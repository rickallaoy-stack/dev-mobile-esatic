import { normalizeWhatsapp } from "@/lib/phone";

export const NIVEAUX = ["L1", "L2", "L3", "M1", "M2", "Autre"] as const;
export type Niveau = (typeof NIVEAUX)[number];

export type SignupInput = {
  nom: string;
  filiere: string;
  niveau: string;
  whatsapp: string;
  /** Champ piège. S'il est rempli, l'envoi est ignoré. */
  company?: string;
};

export type NormalizedSignup = {
  nom: string;
  filiere: string;
  niveau: Niveau;
  whatsapp: string;
};

export type SignupResult =
  | { ok: true; status: "saved" | "ignored" }
  | { ok: false; message: string };

export function validateSignup(
  input: SignupInput,
): { ok: true; value: NormalizedSignup } | { ok: false; message: string } {
  const nom = input.nom.trim().replace(/\s+/g, " ");
  const filiere = input.filiere.trim().replace(/\s+/g, " ");
  const niveau = input.niveau.trim();
  if (nom.length < 2 || nom.length > 80) {
    return { ok: false, message: "Indique ton prénom et ton nom (2 à 80 caractères)." };
  }
  if (filiere.length < 2 || filiere.length > 80) {
    return { ok: false, message: "Indique ta filière (2 à 80 caractères)." };
  }
  if (!NIVEAUX.includes(niveau as Niveau)) {
    return { ok: false, message: "Choisis un niveau dans la liste." };
  }
  const whatsapp = normalizeWhatsapp(input.whatsapp);
  if (!whatsapp) {
    return {
      ok: false,
      message: "Numéro illisible. Exemple : 07 00 00 00 00 ou +225 07 00 00 00 00.",
    };
  }
  return {
    ok: true,
    value: { nom, filiere, niveau: niveau as Niveau, whatsapp },
  };
}
