import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

function reducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Déclenche de courtes rafales de glitch :
 * - au survol et au toucher ;
 * - à chaque passage en mode nuit (attribut data-tone de <html>) ;
 * - de temps en temps (toutes les 5 à 12 s) tant que la page est en mode nuit et visible.
 * Rien ne se déclenche si le visiteur demande moins d'animations.
 */
export function useGlitch(idle: boolean) {
  const [on, setOn] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const burst = useCallback((ms = 420) => {
    if (reducedMotion()) return;
    setOn(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOn(false), ms);
  }, []);

  useEffect(() => {
    if (!idle || reducedMotion()) return;
    let loop: number | undefined;
    const schedule = () => {
      loop = window.setTimeout(
        () => {
          if (document.documentElement.dataset.tone !== "day" && !document.hidden) burst();
          schedule();
        },
        5000 + Math.random() * 7000,
      );
    };
    schedule();
    const watcher = new MutationObserver(() => {
      if (document.documentElement.dataset.tone === "night") burst(520);
    });
    watcher.observe(document.documentElement, { attributes: true, attributeFilter: ["data-tone"] });
    return () => {
      window.clearTimeout(loop);
      window.clearTimeout(timer.current);
      watcher.disconnect();
    };
  }, [idle, burst]);

  return { on, burst };
}

/** Glitch pour du texte. Les copies colorées sont des pseudo-éléments : le texte n'est lu qu'une fois. */
export function GlitchText({ text, className = "", idle = true }: { text: string; className?: string; idle?: boolean }) {
  const { on, burst } = useGlitch(idle);
  return (
    <span
      className={`glitch-text ${className}`}
      data-text={text}
      data-on={on ? "true" : undefined}
      onPointerEnter={() => burst()}
      onClick={() => burst(600)}
    >
      {text}
    </span>
  );
}

/**
 * Glitch pour un visuel (illustration de Widja, icône…). Les enfants sont dupliqués deux fois :
 * réserver à du contenu décoratif, jamais de bouton, de lien ni d'identifiant.
 */
export function Glitch({ children, className = "", idle = true }: { children: ReactNode; className?: string; idle?: boolean }) {
  const { on, burst } = useGlitch(idle);
  return (
    <span
      className={`glitch ${className}`}
      data-on={on ? "true" : undefined}
      onPointerEnter={() => burst()}
      onClick={() => burst(600)}
    >
      <span className="glitch-main">{children}</span>
      <span className="glitch-layer glitch-a" aria-hidden="true">
        {children}
      </span>
      <span className="glitch-layer glitch-b" aria-hidden="true">
        {children}
      </span>
    </span>
  );
}
