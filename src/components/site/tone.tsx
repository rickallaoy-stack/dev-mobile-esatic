import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type ToneMode = "auto" | "night" | "day";

type ToneContextValue = {
  mode: ToneMode;
  setMode: (mode: ToneMode) => void;
};

const ToneContext = createContext<ToneContextValue | null>(null);

const STORAGE_KEY = "sdm-tone";

export function ToneProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ToneMode>("auto");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "night" || stored === "day") setModeState(stored);
  }, []);

  const setMode = (next: ToneMode) => {
    setModeState(next);
    if (next === "auto") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, next);
  };

  const value = useMemo(() => ({ mode, setMode }), [mode]);
  return <ToneContext.Provider value={value}>{children}</ToneContext.Provider>;
}

export function useTone() {
  const value = useContext(ToneContext);
  if (!value) throw new Error("useTone doit être utilisé dans ToneProvider");
  return value;
}

/** Fait passer le fond de la nuit au jour selon le défilement, sauf si le visiteur a verrouillé un mode. */
export function DawnController() {
  const { mode } = useTone();

  useEffect(() => {
    const root = document.documentElement;
    if (mode !== "auto") {
      root.dataset.tone = mode;
      root.style.setProperty("--dawn", mode === "day" ? "1" : "0");
      return;
    }

    const apply = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max <= 0 ? 0 : window.scrollY / max;
      const dawn = Math.min(1, Math.max(0, (progress - 0.04) / 0.48));
      root.style.setProperty("--dawn", dawn.toFixed(3));
      const current = root.dataset.tone === "day" ? "day" : "night";
      const next = current === "day" ? (dawn < 0.4 ? "night" : "day") : dawn > 0.58 ? "day" : "night";
      root.dataset.tone = next;
    };

    apply();
    window.addEventListener("scroll", apply, { passive: true });
    window.addEventListener("resize", apply);
    return () => {
      window.removeEventListener("scroll", apply);
      window.removeEventListener("resize", apply);
    };
  }, [mode]);

  return null;
}

/** Ton fixe pour les pages intérieures, tant que le visiteur n'a pas choisi nuit ou jour. */
export function PageTone({ tone }: { tone: "night" | "day" }) {
  const { mode } = useTone();

  useEffect(() => {
    const root = document.documentElement;
    const next = mode === "auto" ? tone : mode;
    root.dataset.tone = next;
    root.style.setProperty("--dawn", next === "day" ? "1" : "0");
  }, [mode, tone]);

  return null;
}
