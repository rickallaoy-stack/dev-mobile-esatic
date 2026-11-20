/** Liens de sortie du site : groupe WhatsApp de la section et site du Club Informatique. */

/** Page de la section Développement mobile sur le site du Club Informatique, ancrée sur « Rejoindre la section ». */
export const CLUB_URL = "https://clubinfo-esatic.com/sections/dev-mobile/#rejoindre";

/** Accueil du site du club (inscription au club : « S'inscrire au club » mène à son espace membres). */
export const CLUB_HOME_URL = "https://clubinfo-esatic.com";

const WHATSAPP = /^https:\/\/(chat\.whatsapp\.com|wa\.me)\/\S+$/;

/** Accepte uniquement un lien WhatsApp en https. Tout le reste (vide, autre hôte, autre schéma) = null. */
export function parseWhatsappUrl(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const url = raw.trim();
  return WHATSAPP.test(url) ? url : null;
}

/** Lien du groupe, lu dans VITE_WHATSAPP_GROUP_URL. Null tant qu'il n'est pas renseigné : aucun lien inventé. */
export function whatsappGroupUrl(): string | null {
  return parseWhatsappUrl(import.meta.env.VITE_WHATSAPP_GROUP_URL);
}
