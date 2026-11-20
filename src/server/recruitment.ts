import { createServerFn } from "@tanstack/react-start";
import type { SignupResult } from "@/lib/recruitment/types";
import { validateSignup } from "@/lib/recruitment/types";

/**
 * Adaptateur base de cette plateforme. Aucun composant ne l'importe directement :
 * passer par src/lib/recruitment/client.ts.
 * Migration Supabase : garder validateSignup, remplacer getSql par le client
 * serveur (service role) ou par l'insert anon + rpc preinscription_count.
 *
 * Le compteur public ne compte que les lignes valides de preinscriptions.
 * Création et doublon renvoient le même reçu : le client ne peut pas deviner
 * si le numéro était déjà inscrit.
 */

const SAVED_STATUS = "saved" as const;

const NO_IP_MESSAGE = "Envoi impossible depuis cette connexion pour l'instant. Réessaie plus tard.";

const RATE_MESSAGE = "Trop d'envois depuis cette connexion. Cinq par heure, pas plus. Réessaie plus tard.";

async function countValidRows(): Promise<number> {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const rows = await sql<{ n: number }>`
    select count(*)::int as n
    from preinscriptions
    where char_length(nom) between 2 and 80
      and char_length(filiere) between 2 and 80
      and niveau in ('L1', 'L2', 'L3', 'M1', 'M2', 'Autre')
      and substr(whatsapp, 1, 1) = '+'
      and char_length(whatsapp) between 9 and 16
      and translate(substr(whatsapp, 2), '0123456789', '') = ''
  `;
  return Number(rows[0]?.n ?? 0);
}

function isUniqueViolation(error: unknown): boolean {
  if (typeof error === "object" && error !== null && "code" in error) {
    if ((error as { code?: string }).code === "23505") return true;
  }
  const message = error instanceof Error ? error.message : String(error);
  return message.includes("23505") || message.includes("duplicate key");
}

/** Aucun compteur dans le reçu : un doublon et un nouveau numéro sont indiscernables. */
function saved(): SignupResult {
  return { ok: true, status: SAVED_STATUS };
}

export const getSignupCount = createServerFn({ method: "GET" }).handler(async () => {
  const count = await countValidRows();
  return { count };
});

export const submitSignup = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    if (!input || typeof input !== "object") {
      throw new Error("Envoi invalide.");
    }
    return input as {
      nom?: string;
      filiere?: string;
      niveau?: string;
      whatsapp?: string;
      company?: string;
    };
  })
  .handler(async ({ data }): Promise<SignupResult> => {
    if (typeof data.company === "string" && data.company.trim() !== "") {
      return { ok: true, status: "ignored" };
    }
    const parsed = validateSignup({
      nom: String(data.nom ?? ""),
      filiere: String(data.filiere ?? ""),
      niveau: String(data.niveau ?? ""),
      whatsapp: String(data.whatsapp ?? ""),
    });
    if (!parsed.ok) return parsed;

    const { getSql } = await import("@/lib/db");
    const { clientIpHash, recordValidSend } = await import("./signup-rate.server");
    const sql = await getSql();
    const ipHash = await clientIpHash();
    if (!ipHash) return { ok: false, message: NO_IP_MESSAGE };
    const allowed = await recordValidSend(sql, ipHash);
    if (!allowed) {
      return { ok: false, message: RATE_MESSAGE };
    }

    const id = crypto.randomUUID();
    try {
      await sql`
        insert into preinscriptions (id, nom, filiere, niveau, whatsapp)
        values (${id}, ${parsed.value.nom}, ${parsed.value.filiere}, ${parsed.value.niveau}, ${parsed.value.whatsapp})
      `;
    } catch (error) {
      if (!isUniqueViolation(error)) throw error;
    }
    return saved();
  });
