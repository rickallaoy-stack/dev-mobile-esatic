import { useEffect, useRef } from "react";
import { paintWidja } from "@/components/site/draw-widja";
import { useGlitch } from "@/components/site/glitch";
import { parseDawn, poseFromDawn } from "@/lib/widja-pose";

const SKY = "#54C5F8";
const CORAL = "#E8805A";

function reducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Copie l'image principale dans une couche de glitch, teintée (comme les copies colorées du texte). */
function tint(from: HTMLCanvasElement, to: HTMLCanvasElement, color: string) {
  const ctx = to.getContext("2d");
  if (!ctx) return;
  if (to.width !== from.width || to.height !== from.height) {
    to.width = from.width;
    to.height = from.height;
  }
  ctx.globalCompositeOperation = "source-over";
  ctx.clearRect(0, 0, to.width, to.height);
  ctx.drawImage(from, 0, 0);
  ctx.globalCompositeOperation = "source-in";
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, to.width, to.height);
}

/**
 * Widja dessinée en canvas. Elle suit la variable --dawn de <html> (0 = nuit, 1 = jour) :
 * calme et ambrée le jour, chaotique et violette la nuit, avec le glitch du site.
 * Mêmes règles que Glitch : surtout décoratif, aucune animation si le visiteur demande moins de mouvement.
 */
export function WidjaCanvas({ size = 120, className = "" }: { size?: number; className?: string }) {
  const mainRef = useRef<HTMLCanvasElement>(null);
  const aRef = useRef<HTMLCanvasElement>(null);
  const bRef = useRef<HTMLCanvasElement>(null);
  const lookRef = useRef<{ x: number; y: number } | null>(null);
  const { on, burst } = useGlitch(true);
  const onRef = useRef(false);
  onRef.current = on;

  const height = Math.round(size * 1.4);

  useEffect(() => {
    const canvas = mainRef.current;
    const layerA = aRef.current;
    const layerB = bRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const still = reducedMotion();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(height * dpr);

    let raf = 0;
    let lastKey = "";
    const started = performance.now();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (document.hidden) return;
      const dawn = parseDawn(document.documentElement.style.getPropertyValue("--dawn"));
      const pose = poseFromDawn(dawn);
      const look = lookRef.current;
      const glitching = onRef.current;
      const key = `${pose.chaos}|${look ? `${look.x.toFixed(2)},${look.y.toFixed(2)}` : "-"}|${glitching}`;
      if (still && key === lastKey) return;
      lastKey = key;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintWidja(ctx, size, height, {
        chaos: pose.chaos,
        eye: pose.eye,
        mouth: pose.mouth,
        widget: pose.widget,
        hoodie: "auto",
        showRig: false,
        time: still ? 0 : (now - started) / 1000,
        look: still ? null : look,
      });
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      if (glitching && layerA && layerB) {
        tint(canvas, layerA, SKY);
        tint(canvas, layerB, CORAL);
      }
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [size, height]);

  return (
    <figure className={`widja m-0 ${className}`} style={{ width: size }}>
      <span
        className="glitch"
        data-on={on ? "true" : undefined}
        onPointerEnter={() => burst()}
        onClick={() => burst(600)}
        onPointerMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          lookRef.current = {
            x: (event.clientX - rect.left) / rect.width,
            y: (event.clientY - rect.top) / rect.height,
          };
        }}
        onPointerLeave={() => {
          lookRef.current = null;
        }}
      >
        <span className="glitch-main block">
          <canvas
            ref={mainRef}
            role="img"
            aria-label="Widja, la mascotte de la section"
            style={{ width: size, height, display: "block" }}
          />
        </span>
        <span className="glitch-layer glitch-a" aria-hidden="true">
          <canvas ref={aRef} style={{ width: size, height, display: "block" }} />
        </span>
        <span className="glitch-layer glitch-b" aria-hidden="true">
          <canvas ref={bRef} style={{ width: size, height, display: "block" }} />
        </span>
      </span>
    </figure>
  );
}
