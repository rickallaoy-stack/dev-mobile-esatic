import { createHmac } from "node:crypto";
import type { Sql } from "@/lib/db";

const WINDOW_MS = 60 * 60 * 1000;
export const SIGNUP_LIMIT_PER_HOUR = 5;

export class SignupConfigError extends Error {}

/** Empreinte HMAC-SHA256 de l'IP : sans le secret serveur, impossible de retrouver l'adresse par force brute. */
export function hashIp(ip: string, secret: string): string {
  return createHmac("sha256", secret).update(ip).digest("hex");
}

/** x-real-ip d'abord, sinon le premier x-forwarded-for. Sur Vercel, ces en-têtes sont posés par la plateforme. */
export function pickClientIp(headers: { get(name: string): string | null }): string | null {
  const real = headers.get("x-real-ip")?.trim();
  if (real) return real;
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || null;
}

/** IP_HASH_SECRET est obligatoire en production. Hors production, un secret de développement sert de repli. */
export function ipHashSecret(env: Record<string, string | undefined> = process.env): string {
  const secret = env.IP_HASH_SECRET?.trim();
  if (secret) return secret;
  if (env.NODE_ENV === "production") throw new SignupConfigError("IP_HASH_SECRET est manquant.");
  return "dev-only-secret";
}

/** null = IP introuvable en production : l'envoi est refusé (pas de seau commun « unknown »). */
export async function clientIpHash(): Promise<string | null> {
  const production = process.env.NODE_ENV === "production";
  let ip: string | null = null;
  try {
    const { getRequest } = await import("@tanstack/react-start/server");
    ip = pickClientIp(getRequest().headers);
  } catch {
    ip = null;
  }
  if (!ip && !production) ip = "dev-local";
  return ip ? hashIp(ip, ipHashSecret()) : null;
}

/**
 * Enregistre un envoi déjà validé et dit s'il reste dans les 5 de l'heure.
 * Les payloads invalides ne passent pas ici : ils ne comptent pas.
 */
export async function recordValidSend(sql: Sql, ipHash: string): Promise<boolean> {
  const cutoff = new Date(Date.now() - WINDOW_MS).toISOString();
  await sql`
    delete from preinscription_envois
    where created_at < ${cutoff}::timestamptz
  `;
  await sql`
    insert into preinscription_envois (id, ip_hash)
    values (${crypto.randomUUID()}, ${ipHash})
  `;
  const rows = await sql<{ n: number }>`
    select count(*)::int as n
    from preinscription_envois
    where ip_hash = ${ipHash}
  `;
  return Number(rows[0]?.n ?? 0) <= SIGNUP_LIMIT_PER_HOUR;
}
