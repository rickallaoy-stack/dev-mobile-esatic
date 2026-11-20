import { Link } from "@tanstack/react-router";
import { displayStatus, type Project } from "@/data/projects";

export function ProjectCard({ project }: { project: Project }) {
  const status = displayStatus(project);
  return (
    <article className="panel flex h-full flex-col p-5">
      <div className="flex flex-wrap gap-2">
        {project.example ? <span className="badge badge-example">Exemple</span> : null}
        <span className={status === "jouable" ? "badge badge-play" : "badge badge-shot"}>
          {status === "jouable" ? "Jouable" : "Captures"}
        </span>
        <span className="badge badge-shot">{project.type === "app" ? "App" : "Site"}</span>
      </div>
      <h3 className="mt-4 font-display text-2xl font-semibold">{project.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed opacity-80">{project.summary}</p>
      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Stack">
        {project.stack.map((item) => (
          <li key={item} className="font-mono text-xs opacity-75">
            {item}
          </li>
        ))}
      </ul>
      <Link to="/projets/$slug" params={{ slug: project.slug }} className="btn btn-secondary mt-5 w-full">
        Ouvrir la fiche
      </Link>
    </article>
  );
}
