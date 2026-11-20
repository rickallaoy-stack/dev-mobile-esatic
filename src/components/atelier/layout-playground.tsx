import { useState } from "react";
import {
  CHALLENGES,
  COUNTS,
  CROSSES,
  DEFAULT_CONFIG,
  GAPS,
  MAINS,
  PARENTS,
  matches,
  toCss,
  toDart,
  type LayoutConfig,
} from "@/lib/layout-lab";

function Choice<T extends string | number>({
  legend,
  value,
  options,
  onChange,
}: {
  legend: string;
  value: T;
  options: readonly T[];
  onChange: (next: T) => void;
}) {
  return (
    <fieldset className="chip-group">
      <legend>{legend}</legend>
      {options.map((option) => (
        <button key={String(option)} type="button" className="chip" aria-pressed={option === value} onClick={() => onChange(option)}>
          {String(option)}
        </button>
      ))}
    </fieldset>
  );
}

export function LayoutPlayground() {
  const [config, setConfig] = useState<LayoutConfig>(DEFAULT_CONFIG);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const challenge = CHALLENGES.find((item) => item.id === challengeId) ?? null;
  const solved = challenge ? matches(config, challenge.target) : false;

  const update = (patch: Partial<LayoutConfig>) => {
    const next = { ...config, ...patch };
    setConfig(next);
    if (challenge && matches(next, challenge.target) && !done.includes(challenge.id)) {
      setDone((list) => [...list, challenge.id]);
    }
  };

  const pick = (id: string | null) => {
    setChallengeId(id);
    setConfig(DEFAULT_CONFIG);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start">
      <div className="grid gap-5">
        <section className="panel p-5" aria-labelledby="defis-titre">
          <h2 id="defis-titre" className="font-display text-xl font-semibold">
            Défis guidés
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="chip" aria-pressed={challengeId === null} onClick={() => pick(null)}>
              Mode libre
            </button>
            {CHALLENGES.map((item) => (
              <button key={item.id} type="button" className="chip" aria-pressed={challengeId === item.id} onClick={() => pick(item.id)}>
                {done.includes(item.id) ? "✓ " : ""}
                {item.title}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm" role="status" aria-live="polite">
            {challenge ? (solved ? "Réussi. Regarde le code Dart : c'est exactement ce qui produit ce rendu." : challenge.goal) : "Change les réglages et regarde le téléphone et le code bouger ensemble."}
          </p>
        </section>

        <section className="panel grid gap-4 p-5" aria-label="Réglages du layout">
          <Choice legend="Widget parent" value={config.parent} options={PARENTS} onChange={(parent) => update({ parent })} />
          <Choice legend="mainAxisAlignment" value={config.main} options={MAINS} onChange={(main) => update({ main })} />
          <Choice legend="crossAxisAlignment" value={config.cross} options={CROSSES} onChange={(cross) => update({ cross })} />
          <Choice legend="Espace (spacing)" value={config.gap} options={GAPS} onChange={(gap) => update({ gap })} />
          <Choice legend="Nombre d'éléments" value={config.count} options={COUNTS} onChange={(count) => update({ count })} />
        </section>

        <section className="night-card p-5" aria-labelledby="code-titre">
          <h2 id="code-titre" className="text-sm font-semibold text-sky">
            Code Dart correspondant
          </h2>
          <pre className="mt-3 overflow-x-auto font-mono text-sm leading-relaxed">
            <code>{toDart(config)}</code>
          </pre>
          <p className="mt-3 text-xs opacity-70">
            Simulation en CSS (flexbox), pas du vrai Dart. Le paramètre spacing demande une version récente de Flutter (3.27 ou plus).
          </p>
        </section>
      </div>

      <div className="lab-phone mx-auto lg:sticky lg:top-24" role="img" aria-label={`Aperçu : ${config.count} éléments dans un ${config.parent}`}>
        <div className="lab-screen">
          <div style={toCss(config)}>
            {["A", "B", "C", "D"].slice(0, config.count).map((label) => (
              <div key={label} className="lab-box">
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
