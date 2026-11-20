import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useTone } from "@/components/site/tone";

const NAV = [
  { to: "/", label: "Accueil" },
  { to: "/projets", label: "Apps" },
  { to: "/cours", label: "Cours" },
  { to: "/atelier", label: "Atelier" },
  { to: "/seance", label: "Séance" },
  { to: "/quiz", label: "Quiz" },
  { to: "/rejoindre", label: "Rejoindre" },
] as const;

function isCurrent(path: string, to: string) {
  if (to === "/") return path === "/";
  return path === to || path.startsWith(`${to}/`);
}

export function Shell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const { mode, setMode } = useTone();
  const [open, setOpen] = useState(false);
  const [visual, setVisual] = useState<"night" | "day">("night");

  useEffect(() => {
    const read = () => setVisual(document.documentElement.dataset.tone === "day" ? "day" : "night");
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-tone"] });
    return () => observer.disconnect();
  }, []);

  const flipTone = () => {
    setMode(visual === "day" ? "night" : "day");
  };

  return (
    <>
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>
      <header className="site-header">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="font-display text-sm font-semibold leading-tight no-underline">
            Dev mobile
            <span className="mt-0.5 block text-xs font-sans font-medium opacity-70">ESATIC · Club info</span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                aria-current={isCurrent(path, item.to) ? "page" : undefined}
                className="rounded-chip px-3 py-2 text-sm font-medium no-underline aria-[current=page]:underline"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button type="button" className="btn btn-secondary hidden sm:inline-flex" onClick={flipTone}>
              {visual === "day" ? "Fond sombre" : "Fond clair"}
            </button>
            {mode !== "auto" ? (
              <button type="button" className="btn btn-secondary hidden md:inline-flex" onClick={() => setMode("auto")}>
                Suivre la page
              </button>
            ) : null}
            <Link to="/rejoindre" className="btn btn-primary hidden sm:inline-flex">
              Rejoindre
            </Link>
            <button
              type="button"
              className="btn btn-secondary lg:hidden"
              aria-expanded={open}
              aria-controls="menu-mobile"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X aria-hidden="true" size={18} /> : <Menu aria-hidden="true" size={18} />}
              Menu
            </button>
          </div>
        </div>
        {open ? (
          <nav id="menu-mobile" className="border-t border-current/10 px-4 py-3 lg:hidden" aria-label="Navigation mobile">
            <ul className="flex flex-col gap-1">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    aria-current={isCurrent(path, item.to) ? "page" : undefined}
                    className="block rounded-control px-3 py-3 no-underline aria-[current=page]:underline"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <button type="button" className="btn btn-secondary w-full" onClick={flipTone}>
                  {visual === "day" ? "Fond sombre" : "Fond clair"}
                </button>
              </li>
            </ul>
          </nav>
        ) : null}
      </header>
      {children}
      <footer className="site-footer">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display font-semibold">Section Développement Mobile</p>
            <p className="opacity-75">Club Informatique de l'ESATIC · Abidjan</p>
          </div>
          <p className="max-w-sm opacity-75">
            Vitrine des apps de la section. Aucun témoignage, aucun effectif inventé. Les fiches marquées Exemple sont des maquettes.
          </p>
        </div>
      </footer>
    </>
  );
}
