import { Glitch } from "@/components/site/glitch";
import { WidjaCanvas } from "@/components/site/widja-canvas";
import { WIDJA_ASSETS, WIDJA_CANVAS } from "@/data/widja";

/**
 * Emplacement de Widja. N'affiche rien tant qu'aucune illustration n'est renseignée
 * dans src/data/widja.ts et que WIDJA_CANVAS est faux (pas de faux visuel en public). `placeholder` sert à l'aperçu en développement.
 */
export function WidjaSlot({ size = 120, className = "", placeholder = false }: { size?: number; className?: string; placeholder?: boolean }) {
  const { night, day } = WIDJA_ASSETS;
  const height = Math.round(size * 1.4);
  const both = Boolean(night && day);

  if (!night && !day && WIDJA_CANVAS) return <WidjaCanvas size={size} className={className} />;
  if (!night && !day && !placeholder) return null;

  return (
    <figure className={`widja m-0 ${className}`} style={{ width: size }}>
      <Glitch>
        {night || day ? (
          <span className={`widja-art block ${both ? "widja-both" : ""}`} style={{ width: size, height }}>
            {night ? <img className="widja-night" src={night} alt="Widja, la mascotte de la section" width={size} height={height} /> : null}
            {day ? <img className="widja-day" src={day} alt="Widja, la mascotte de la section" width={size} height={height} /> : null}
          </span>
        ) : (
          <span className="widja-placeholder" style={{ width: size, height }}>
            <span className="font-display text-5xl font-semibold">W</span>
          </span>
        )}
      </Glitch>
      {!night && !day ? <figcaption className="mt-1 text-xs opacity-70">Widja · illustration à venir</figcaption> : null}
    </figure>
  );
}
