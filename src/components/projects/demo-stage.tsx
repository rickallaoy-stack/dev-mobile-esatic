import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { isPlayable } from "@/data/projects";

type Phase = "loading" | "ready" | "error";

export function DemoStage({ project, onClose }: { project: Project; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [mobile, setMobile] = useState(false);
  const playable = isPlayable(project);
  const demoUrl = project.demoUrl ?? "";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    const onCancel = (event: Event) => {
      event.preventDefault();
      onClose();
    };
    dialog.addEventListener("cancel", onCancel);
    return () => {
      dialog.removeEventListener("cancel", onCancel);
      if (dialog.open) dialog.close();
    };
  }, [onClose]);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 1023px)");
    const apply = () => setMobile(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!playable) return;
    const timer = window.setTimeout(() => {
      setPhase((current) => (current === "loading" ? "error" : current));
    }, 12000);
    return () => window.clearTimeout(timer);
  }, [playable]);

  return (
    <dialog ref={dialogRef} className="demo-dialog" aria-labelledby="demo-title">
      <div className="flex h-full flex-col p-3 sm:p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 id="demo-title" className="font-display text-lg font-semibold text-cream">
            {project.title}
          </h2>
          <div className="flex items-center gap-2">
            {playable ? (
              <a className="btn btn-secondary text-cream" href={demoUrl} target="_blank" rel="noopener noreferrer">
                Nouvel onglet
              </a>
            ) : null}
            <button type="button" className="btn btn-primary" onClick={onClose} autoFocus>
              Fermer
            </button>
          </div>
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center">
          {!playable ? (
            <p className="panel max-w-md p-6 text-center">Cette fiche n'a pas d'adresse de démo valide.</p>
          ) : (
            <div
              className={
                mobile
                  ? "relative h-full w-full overflow-hidden rounded-control bg-night"
                  : project.type === "site"
                    ? "relative h-full max-h-[40rem] w-full max-w-5xl overflow-hidden rounded-card border border-cream/20 bg-night"
                    : "phone-bezel"
              }
            >
              <div className={mobile || project.type === "site" ? "relative h-full" : "phone-screen relative"}>
                {phase !== "ready" ? (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-night p-6 text-center text-cream">
                    {phase === "loading" ? (
                      <p>Chargement de la démo…</p>
                    ) : (
                      <>
                        <p>La démo n'a pas répondu.</p>
                        <a className="btn btn-primary" href={demoUrl} target="_blank" rel="noopener noreferrer">
                          Ouvrir dans un nouvel onglet
                        </a>
                      </>
                    )}
                  </div>
                ) : null}
                <iframe
                  key={demoUrl}
                  title={`Démo : ${project.title}`}
                  src={demoUrl}
                  className="h-full w-full border-0 bg-paper"
                  sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin"
                  referrerPolicy="no-referrer"
                  onLoad={() => setPhase("ready")}
                  onError={() => setPhase("error")}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
