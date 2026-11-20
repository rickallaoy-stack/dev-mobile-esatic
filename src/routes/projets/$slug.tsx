import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { DemoStage } from "@/components/projects/demo-stage";
import { PageTone } from "@/components/site/tone";
import { displayStatus, getProject, isPlayable } from "@/data/projects";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/projets/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return project;
  },
  head: ({ loaderData }) =>
    pageHead({
      title: loaderData ? `${loaderData.title} · Projets` : "Projet",
      description: loaderData?.summary ?? "Fiche projet de la section Développement Mobile.",
      path: `/projets/${loaderData?.slug ?? ""}`,
    }),
  component: ProjectPage,
  notFoundComponent: ProjectMissing,
});

function ProjectMissing() {
  return (
    <main id="contenu" className="mx-auto max-w-3xl px-4 py-16">
      <PageTone tone="day" />
      <h1 className="font-display text-4xl font-semibold">Fiche introuvable</h1>
      <p className="mt-3">Ce projet n'est pas dans le catalogue.</p>
      <Link to="/projets" className="btn btn-primary mt-6">
        Retour aux projets
      </Link>
    </main>
  );
}

function ProjectPage() {
  const project = Route.useLoaderData();
  const status = displayStatus(project);
  const playable = isPlayable(project);
  const [open, setOpen] = useState(false);

  return (
    <main id="contenu" className="mx-auto max-w-3xl px-4 py-10">
      <PageTone tone="day" />
      <p className="text-sm">
        <Link to="/projets" className="underline">
          Projets
        </Link>
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.example ? <span className="badge badge-example">Exemple</span> : null}
        <span className={status === "jouable" ? "badge badge-play" : "badge badge-shot"}>
          {status === "jouable" ? "Jouable" : "Captures"}
        </span>
      </div>
      <h1 className="mt-4 font-display text-4xl font-semibold">{project.title}</h1>
      <p className="mt-3 text-lg">{project.summary}</p>
      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Stack">
        {project.stack.map((item) => (
          <li key={item} className="badge badge-shot font-mono">
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-3">
        {playable ? (
          <button type="button" className="btn btn-primary" onClick={() => setOpen(true)}>
            Essayer
          </button>
        ) : (
          <p className="text-sm opacity-80">Pas encore jouable : aucune adresse de démo valide.</p>
        )}
        {project.apkUrl ? (
          <a className="btn btn-secondary" href={project.apkUrl} rel="noopener noreferrer">
            Télécharger l'APK
          </a>
        ) : null}
        {project.repoUrl ? (
          <a className="btn btn-secondary" href={project.repoUrl} target="_blank" rel="noopener noreferrer">
            Code source
          </a>
        ) : null}
      </div>
      <ul className="mt-8 grid gap-4">
        {project.shots.map((shot) => (
          <li key={shot.src} className="panel overflow-hidden p-3">
            <img src={shot.src} alt={shot.alt} className="h-auto w-full rounded-control" />
          </li>
        ))}
      </ul>
      {open ? <DemoStage project={project} onClose={() => setOpen(false)} /> : null}
    </main>
  );
}
