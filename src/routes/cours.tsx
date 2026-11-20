import { createFileRoute, Link } from "@tanstack/react-router";
import { VideoEmbed } from "@/components/cours/video-embed";
import { PageTone } from "@/components/site/tone";
import { cours, coursByKind } from "@/data/cours";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/cours")({
  head: () =>
    pageHead({
      title: "Cours et vidéos · Section Développement Mobile ESATIC",
      description:
        "Les cours de la section Développement Mobile : exercices interactifs et vidéos pour apprendre Flutter et Dart.",
      path: "/cours",
    }),
  component: CoursPage,
});

function CoursPage() {
  const interactifs = coursByKind("interactif", cours);
  const videos = coursByKind("video", cours);
  return (
    <main id="contenu" className="mx-auto max-w-5xl px-4 py-10">
      <PageTone tone="night" />
      <p className="accent-text text-sm font-semibold">Apprendre en pratiquant</p>
      <h1 className="mt-2 font-display text-4xl font-semibold">Cours et vidéos</h1>
      <p className="mt-3 max-w-xl">Flutter et Dart, avec les mêmes apps que celles de la section.</p>

      <h2 className="mt-10 font-display text-2xl font-semibold">Interactifs</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {interactifs.map((item) => (
          <article key={item.slug} className="panel p-5">
            <p className="accent-text text-xs font-semibold">{item.level}</p>
            <h3 className="mt-1 font-display text-xl font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed opacity-80">{item.summary}</p>
            {item.href ? (
              <Link to={item.href} className="btn btn-primary mt-4">
                Ouvrir
              </Link>
            ) : null}
          </article>
        ))}
      </div>

      <h2 className="mt-10 font-display text-2xl font-semibold">Vidéos</h2>
      {videos.length === 0 ? (
        <p className="panel mt-4 p-5 text-sm" role="status">
          Aucune vidéo publiée pour l'instant. Elles apparaîtront ici, une par une, dès qu'elles existent.
        </p>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {videos.map((item) => (
            <article key={item.slug} className="panel p-5">
              <p className="accent-text text-xs font-semibold">{item.level}</p>
              <h3 className="mt-1 font-display text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed opacity-80">{item.summary}</p>
              <VideoEmbed cours={item} />
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
