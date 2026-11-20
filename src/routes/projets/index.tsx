import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProjectCard } from "@/components/projects/project-card";
import { PageTone } from "@/components/site/tone";
import { projectStacks, projects, type ProjectType } from "@/data/projects";
import { pageHead } from "@/lib/seo";

type ProjectSearch = {
  type?: ProjectType;
  stack?: string;
};

export const Route = createFileRoute("/projets/")({
  validateSearch: (search: Record<string, unknown>): ProjectSearch => {
    const type = search.type === "app" || search.type === "site" ? search.type : undefined;
    const stack = typeof search.stack === "string" ? search.stack.slice(0, 40) : undefined;
    return { type, stack: stack || undefined };
  },
  head: () =>
    pageHead({
      title: "Projets · Section Développement Mobile ESATIC",
      description:
        "Maquettes et futures démos de la section Développement Mobile. Une fiche n'est jouable que si son adresse de démo est valide.",
      path: "/projets",
    }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/projets/" });
  const stacks = projectStacks();
  const visible = projects.filter((project) => {
    if (search.type && project.type !== search.type) return false;
    if (search.stack && !project.stack.includes(search.stack)) return false;
    return true;
  });

  const setType = (type?: ProjectType) => {
    void navigate({ search: (previous) => ({ ...previous, type }) });
  };
  const setStack = (stack?: string) => {
    void navigate({ search: (previous) => ({ ...previous, stack }) });
  };

  return (
    <main id="contenu" className="mx-auto max-w-6xl px-4 py-10">
      <PageTone tone="day" />
      <p className="accent-text text-sm font-semibold">Bibliothèque</p>
      <h1 className="mt-2 font-display text-4xl font-semibold">Les apps de la section</h1>
      <p className="mt-3 max-w-2xl">
        Pour l'instant, trois fiches d'exemple. Le bouton Essayer n'apparaît que lorsqu'une démo a une adresse valide. Rien n'est marqué jouable à vide.
      </p>
      <div className="mt-6 flex flex-col gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par type">
          <button type="button" className="chip" aria-pressed={!search.type} onClick={() => setType(undefined)}>
            Tout
          </button>
          <button type="button" className="chip" aria-pressed={search.type === "app"} onClick={() => setType("app")}>
            Apps
          </button>
          <button type="button" className="chip" aria-pressed={search.type === "site"} onClick={() => setType("site")}>
            Sites
          </button>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par stack">
          <button type="button" className="chip" aria-pressed={!search.stack} onClick={() => setStack(undefined)}>
            Toutes les stacks
          </button>
          {stacks.map((stack) => (
            <button
              key={stack}
              type="button"
              className="chip"
              aria-pressed={search.stack === stack}
              onClick={() => setStack(stack)}
            >
              {stack}
            </button>
          ))}
        </div>
      </div>
      {visible.length === 0 ? (
        <p className="panel mt-6 p-6">Aucun projet pour ce filtre.</p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <li key={project.slug}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
