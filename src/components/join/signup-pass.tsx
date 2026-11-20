import { useEffect, useRef } from "react";
import { drawPassCard, type PassInfo } from "@/lib/pass";

async function fontsReady(): Promise<boolean> {
  await document.fonts.ready.catch(() => undefined);
  return document.fonts.check("16px Sora") && document.fonts.check("16px Inter");
}

function shareText(info: PassInfo): string {
  return `Je me suis pré-inscrit à la section Développement Mobile du Club Informatique de l'ESATIC. Pass ${info.numero}. ${window.location.origin}/rejoindre`;
}

export function SignupPass({ info }: { info: PassInfo }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    void fontsReady().then((ready) => {
      if (!cancelled && canvasRef.current) drawPassCard(canvasRef.current, info, ready);
    });
    return () => {
      cancelled = true;
    };
  }, [info]);

  const toBlob = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    drawPassCard(canvas, info, await fontsReady());
    return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  };

  const share = async () => {
    const text = shareText(info);
    const blob = await toBlob();
    if (blob && typeof navigator.share === "function") {
      const file = new File([blob], "pass-dev-mobile-esatic.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], text, title: "Pass Dev Mobile" });
          return;
        } catch {
          return;
        }
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  const download = async () => {
    const blob = await toBlob();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "pass-dev-mobile-esatic.png";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="grid gap-3" aria-labelledby="pass-titre">
      <h2 id="pass-titre" className="font-display text-2xl font-semibold">
        Ton pass de pré-inscription
      </h2>
      <canvas ref={canvasRef} className="panel h-auto w-full max-w-3xl" aria-label={`Pass de ${info.name}, niveau ${info.niveau}, numéro ${info.numero}`} />
      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn btn-primary" onClick={() => void share()}>
          Partager
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => void download()}>
          Télécharger
        </button>
      </div>
      <p className="text-sm opacity-75">Le pass est généré sur ton écran. Il n'affiche jamais ton numéro WhatsApp, et son numéro n'ouvre aucun accès.</p>
    </section>
  );
}
