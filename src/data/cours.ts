/**
 * Cours et vidéos de la section. Rien d'inventé : une entrée n'existe que si le contenu existe.
 * - kind "interactif" : page du site (href).
 * - kind "video" : identifiant YouTube de 11 caractères (videoId). La vidéo ne se charge qu'au clic.
 */
export type CoursKind = "interactif" | "video";
export type CoursLevel = "Débutant" | "Intermédiaire";

export type Cours = {
  slug: string;
  title: string;
  summary: string;
  kind: CoursKind;
  level: CoursLevel;
  href?: string;
  videoId?: string;
};

export const cours: Cours[] = [
  {
    slug: "atelier-column-row",
    title: "Column et Row, sans installer Flutter",
    summary: "Un faux téléphone et le code Dart qui change en même temps, puis trois défis guidés.",
    kind: "interactif",
    level: "Débutant",
    href: "/atelier",
  },
  {
    slug: "seance-profil-layouts",
    title: "Séance 3 : profil, Card et ListView",
    summary: "Les rendus du cours, étape par étape, du Stateless de départ jusqu’à la liste de compétences.",
    kind: "interactif",
    level: "Débutant",
    href: "/seance",
  },
];

const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

/** Adresse d'intégration YouTube (domaine sans cookies) ou null si l'identifiant est invalide. */
export function embedUrl(videoId: string | undefined): string | null {
  if (!videoId || !VIDEO_ID.test(videoId)) return null;
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`;
}

export function coursByKind(kind: CoursKind, list: Cours[] = cours): Cours[] {
  return list.filter((item) => item.kind === kind && (kind === "interactif" ? Boolean(item.href) : embedUrl(item.videoId) !== null));
}
