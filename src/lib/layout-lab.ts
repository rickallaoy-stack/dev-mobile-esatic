export const PARENTS = ["Column", "Row"] as const;
export const MAINS = ["start", "center", "end", "spaceBetween", "spaceAround"] as const;
export const CROSSES = ["start", "center", "end", "stretch"] as const;
export const GAPS = [0, 8, 16, 24] as const;
export const COUNTS = [1, 2, 3, 4] as const;

export type LayoutConfig = {
  parent: (typeof PARENTS)[number];
  main: (typeof MAINS)[number];
  cross: (typeof CROSSES)[number];
  gap: number;
  count: number;
};

export const DEFAULT_CONFIG: LayoutConfig = { parent: "Column", main: "start", cross: "start", gap: 0, count: 3 };

const CSS_MAIN: Record<LayoutConfig["main"], string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  spaceBetween: "space-between",
  spaceAround: "space-around",
};

const CSS_CROSS: Record<LayoutConfig["cross"], string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
};

/** Simulation : un Column ou Row Flutter se comporte ici comme un conteneur flexbox. */
export function toCss(config: LayoutConfig) {
  return {
    display: "flex",
    flexDirection: config.parent === "Column" ? ("column" as const) : ("row" as const),
    justifyContent: CSS_MAIN[config.main],
    alignItems: CSS_CROSS[config.cross],
    gap: `${config.gap}px`,
    height: "100%",
  };
}

const LABELS = ["A", "B", "C", "D"];

export function toDart(config: LayoutConfig): string {
  const children = LABELS.slice(0, config.count)
    .map((label) => `    Chip(label: Text('${label}')),`)
    .join("\n");
  const spacing = config.gap > 0 ? `  spacing: ${config.gap},\n` : "";
  return [
    `${config.parent}(`,
    `  mainAxisAlignment: MainAxisAlignment.${config.main},`,
    `  crossAxisAlignment: CrossAxisAlignment.${config.cross},`,
    ...(spacing ? [spacing.trimEnd()] : []),
    `  children: [`,
    children,
    `  ],`,
    `)`,
  ].join("\n");
}

export type Challenge = { id: string; title: string; goal: string; target: Partial<LayoutConfig> };

export const CHALLENGES: Challenge[] = [
  {
    id: "centre",
    title: "Tout au centre",
    goal: "Mets les trois éléments en colonne, bien centrés dans l'écran, au milieu et sur la largeur.",
    target: { parent: "Column", main: "center", cross: "center", count: 3 },
  },
  {
    id: "extremites",
    title: "Aux extrémités",
    goal: "Mets les trois éléments sur une ligne, répartis de la gauche vers la droite avec un maximum d'espace entre eux.",
    target: { parent: "Row", main: "spaceBetween", count: 3 },
  },
  {
    id: "espace",
    title: "En haut, avec de l'air",
    goal: "Colle les trois éléments en haut à gauche d'une colonne, avec 16 d'espace entre chacun.",
    target: { parent: "Column", main: "start", cross: "start", gap: 16, count: 3 },
  },
];

export function matches(config: LayoutConfig, target: Partial<LayoutConfig>): boolean {
  return (Object.keys(target) as Array<keyof LayoutConfig>).every((key) => config[key] === target[key]);
}
