import { Cake, CheckCircle2, MapPin, Trophy } from "lucide-react";
import { COMPETENCES } from "@/data/seance-profil";

/** Rendu de l’écran Flutter à une étape donnée (0 à 5). */
export function ProfilRendu({ step }: { step: number }) {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#f4f7fb] text-[#122033]">
      <header className="flex h-11 shrink-0 items-center justify-center bg-[#1565c0] text-sm font-semibold text-white">
        Mon Profil Étudiant
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {step === 0 ? <EtapeZero /> : null}
        {step >= 1 ? <ProfilBody step={step} /> : null}
      </div>
    </div>
  );
}

function EtapeZero() {
  return (
    <p className="flex h-full items-center justify-center px-4 text-center text-sm leading-relaxed text-[#5c6b7a]">
      Ici on va construire le profil étape par étape
    </p>
  );
}

function ProfilBody({ step }: { step: number }) {
  const inner = (
    <div className={step >= 3 ? "flex flex-col items-center" : "flex h-full flex-col items-center justify-center"}>
      <div className="grid size-16 place-items-center rounded-full bg-[#1565c0] text-lg font-semibold text-white">AK</div>
      <p className="mt-3 text-lg font-bold">Awa Koné</p>
      <p className="mt-1 text-center text-sm text-[#5c6b7a]">Étudiante en Informatique · L2</p>
      {step >= 2 ? <Infos /> : null}
      {step >= 4 ? <Competences /> : null}
    </div>
  );

  if (step < 3) return inner;

  return (
    <article className="rounded-2xl bg-white p-4 shadow-[0_8px_18px_rgba(18,32,51,0.16)]">
      {inner}
    </article>
  );
}

function Infos() {
  const items = [
    { icon: Cake, label: "21 ans", color: "#1565c0" },
    { icon: MapPin, label: "Abidjan", color: "#c62828" },
    { icon: Trophy, label: "Football", color: "#2e7d32" },
  ];
  return (
    <ul className="mt-4 flex w-full justify-between gap-2">
      {items.map((item) => (
        <li key={item.label} className="flex flex-1 flex-col items-center gap-1 text-xs">
          <item.icon size={18} color={item.color} aria-hidden="true" />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

function Competences() {
  return (
    <section className="mt-5 w-full">
      <h3 className="text-left text-sm font-bold">Mes compétences</h3>
      <ul className="mt-2 grid gap-2">
        {COMPETENCES.map((item) => (
          <li key={item} className="flex items-center gap-2 rounded-xl bg-[#f4f7fb] px-3 py-2 text-sm shadow-sm">
            <CheckCircle2 size={16} className="shrink-0 text-[#2e7d32]" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
