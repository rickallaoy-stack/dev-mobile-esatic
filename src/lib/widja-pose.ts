/**
 * Pose de Widja en fonction du moment de la journée du site.
 * `dawn` vient de la variable CSS --dawn de <html> : 0 = nuit, 1 = jour.
 * Le dessin (draw-widja.ts) parle en « chaos » : 0 = calme (jour), 100 = chaotique (nuit).
 */
export type Eye = "open" | "bright" | "lidded" | "wild";
export type Mouth = "soft" | "smile" | "smirk" | "grin";
export type Widget = "itclub" | "error" | "cracked" | "code";
export type Hoodie = "auto" | "mint" | "void";

export type WidjaPose = { chaos: number; eye: Eye; mouth: Mouth; widget: Widget };

export function clamp01(n: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(n) ? n : 0));
}

/** Lit --dawn (0 à 1) ; nuit si la valeur est absente ou illisible. */
export function parseDawn(raw: string | null | undefined): number {
  if (!raw) return 0;
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? clamp01(value) : 0;
}

/** Pose complète à partir de dawn. Les paliers suivent la boucle du studio (calme → glitch). */
export function poseFromDawn(dawn: number): WidjaPose {
  const chaos = Math.round((1 - clamp01(dawn)) * 100);
  if (chaos < 20) return { chaos, eye: "open", mouth: "soft", widget: "itclub" };
  if (chaos < 40) return { chaos, eye: "bright", mouth: "smile", widget: "itclub" };
  if (chaos < 60) return { chaos, eye: "lidded", mouth: "smirk", widget: "error" };
  if (chaos < 85) return { chaos, eye: "lidded", mouth: "smirk", widget: "cracked" };
  return { chaos, eye: "wild", mouth: "grin", widget: "code" };
}
