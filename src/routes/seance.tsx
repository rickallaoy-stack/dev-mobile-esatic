import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ProfilRendu } from "@/components/cours/profil-rendu";
import { PageTone } from "@/components/site/tone";
import { SEANCE_STEPS } from "@/data/seance-profil";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/seance")({
  head: () =>
    pageHead({
      title: "Séance 3 · Profil, layouts et ListView",
      description:
        "Les rendus de la séance, du profil Stateless jusqu’à la Card et la liste de compétences.",
      path: "/seance",
    }),
  component: SeancePage,
});

function SeancePage() {
  const [index, setIndex] = useState(0);
  const step = SEANCE_STEPS[index];

  return (
    <main id="contenu" className="mx-auto max-w-5xl px-4 py-10">
      <PageTone tone="night" />
      <p className="accent-text text-sm font-semibold">Séance 3 · 2 h à 2 h 30</p>
      <h1 className="mt-2 font-display text-4xl font-semibold">Du profil Stateless aux layouts</h1>
      <p className="mt-3 max-w-2xl">
        On part du profil déjà écrit et on le rend plus clair : Column, Row, Card, puis une liste de compétences.
        Chaque étape montre le rendu que la classe doit obtenir.
      </p>

      <div className="mt-8 flex gap-2 overflow-x-auto pb-1">
        {SEANCE_STEPS.map((item, i) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={i === index}
            onClick={() => setIndex(i)}
            className="btn btn-secondary shrink-0"
          >
            {item.id === "fin" ? "Fin" : `Étape ${item.id}`}
          </button>
        ))}
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <figure className="m-0">
          <div className="phone-bezel mx-auto">
            <div className="phone-screen">
              <ProfilRendu step={index} />
            </div>
          </div>
          <figcaption className="mt-3 text-center text-sm opacity-75">
            {step.titre} · {step.duree}
          </figcaption>
        </figure>

        <section className="panel p-5" aria-live="polite">
          <h2 className="font-display text-2xl font-semibold">{step.titre}</h2>
          <p className="mt-3 leading-relaxed">{step.ajout}</p>
          <ul className="mt-4 grid gap-2 text-sm">
            {step.points.map((point) => (
              <li key={point} className="rounded-xl bg-white/5 px-3 py-2">
                {point}
              </li>
            ))}
          </ul>
          <h3 className="mt-6 font-display text-lg font-semibold">Code de l’étape</h3>
          <pre className="night-card mt-2 overflow-x-auto p-4 font-mono text-sm leading-relaxed">
            <code>{step.code}</code>
          </pre>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className="btn btn-secondary" disabled={index === 0} onClick={() => setIndex((n) => n - 1)}>
              Étape précédente
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={index === SEANCE_STEPS.length - 1}
              onClick={() => setIndex((n) => n + 1)}
            >
              Étape suivante
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
