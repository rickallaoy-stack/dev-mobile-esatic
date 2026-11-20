export type ProjectType = "app" | "site";
export type ProjectStatus = "jouable" | "captures";

export type ProjectShot = {
  src: string;
  alt: string;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  stack: string[];
  type: ProjectType;
  status: ProjectStatus;
  demoUrl?: string;
  apkUrl?: string;
  repoUrl?: string;
  shots: ProjectShot[];
  tags: string[];
  example: boolean;
};

const HTTP_URL = /^https?:\/\/\S+$/i;

/** Jouable seulement avec une URL http(s). Un statut déclaré sans URL retombe en captures. */
export function isPlayable(project: Project): boolean {
  return project.status === "jouable" && typeof project.demoUrl === "string" && HTTP_URL.test(project.demoUrl);
}

export function displayStatus(project: Project): ProjectStatus {
  return isPlayable(project) ? "jouable" : "captures";
}

export const projects: Project[] = [
  {
    slug: "cantine-esatic",
    title: "Cantine ESATIC",
    summary:
      "Maquette d'une app pour voir le plat du jour et son prix, sans faire la queue. Exemple de parcours Flutter, pas une application publiée par la section.",
    stack: ["Flutter", "Dart"],
    type: "app",
    status: "captures",
    shots: [
      {
        src: "/captures/cantine-liste.svg",
        alt: "Exemple : liste de plats du jour avec prix en francs CFA, dans une maquette d'application.",
      },
      {
        src: "/captures/cantine-detail.svg",
        alt: "Exemple : fiche d'un plat avec un bouton pour signaler qu'il ne reste plus rien.",
      },
    ],
    tags: ["Exemple", "Campus"],
    example: true,
  },
  {
    slug: "navette-campus",
    title: "Navette campus",
    summary:
      "Maquette des prochains départs entre deux sites. Elle montre une liste, une heure, et un état quand aucun car n'est annoncé.",
    stack: ["Flutter", "Dart"],
    type: "app",
    status: "captures",
    shots: [
      {
        src: "/captures/navette.svg",
        alt: "Exemple : écran des prochains départs de navette, avec un trajet sans horaire.",
      },
    ],
    tags: ["Exemple", "Campus"],
    example: true,
  },
  {
    slug: "fiches-revision",
    title: "Fiches de révision",
    summary:
      "Maquette d'un petit site pour retourner une carte de cours. Exemple prévu pour un cadre navigateur, le jour où une démo sera branchée.",
    stack: ["TypeScript", "React"],
    type: "site",
    status: "captures",
    shots: [
      {
        src: "/captures/fiches.svg",
        alt: "Exemple : carte de révision avec une question et le rappel de retourner la fiche.",
      },
    ],
    tags: ["Exemple", "Cours"],
    example: true,
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function projectStacks(list: Project[] = projects): string[] {
  return [...new Set(list.flatMap((project) => project.stack))].sort((a, b) => a.localeCompare(b, "fr"));
}
