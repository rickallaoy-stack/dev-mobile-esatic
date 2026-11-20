import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ProjectCard } from "@/components/projects/project-card";
import { CodeSketch, Phone, type PhoneScreen } from "@/components/site/phone";
import { GlitchText } from "@/components/site/glitch";
import { DawnController } from "@/components/site/tone";
import { WidjaSlot } from "@/components/site/widja";
import { projects } from "@/data/projects";

export function HomePage() {
  const [screen, setScreen] = useState<PhoneScreen>("dart");

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-screen]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const next = visible?.target.getAttribute("data-screen");
        if (next === "dart" || next === "ui" || next === "club") setScreen(next);
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0.15, 0.4, 0.7] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <main id="contenu">
      <DawnController />
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 lg:pt-12">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_18.5rem] lg:items-start lg:gap-12">
          <div className="grid gap-6">
            <section data-screen="dart" className="panel relative p-5 sm:p-8">
              <WidjaSlot size={132} className="absolute right-8 top-8 hidden lg:block" />
              <p className="accent-text text-sm font-semibold">Section Développement Mobile · Club Informatique ESATIC</p>
              <h1 className="mt-3 max-w-xl font-display text-4xl font-semibold sm:text-6xl">
                Les apps de la section.
                <span className="mt-2 block">
                  <GlitchText text="À essayer en vrai." />
                </span>
              </h1>
              <p className="mt-4 max-w-xl text-lg">
                On publie ici les apps mobiles de la section : captures, démo dans le navigateur quand elle existe, téléchargement quand l'app est prête. Et des cours pour apprendre à en faire.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/projets" className="btn btn-primary">
                  Voir les apps
                </Link>
                <Link to="/cours" className="btn btn-secondary">
                  Cours et vidéos
                </Link>
              </div>
              <CodeSketch />
              <p className="mt-5 max-w-xl text-sm opacity-75">
                Chaque app dit si on peut l'essayer, la télécharger ou seulement la regarder. Les projets marqués Exemple sont des maquettes, pas des apps publiées.
              </p>
            </section>

            <section data-screen="ui" className="grid gap-4 sm:grid-cols-3" aria-labelledby="seance-titre">
              <h2 id="seance-titre" className="sr-only">
                Comment on publie
              </h2>
              {[
                ["Essaie dans le navigateur", "La version web d'une app Flutter se lance au clic, sans rien installer."],
                ["Télécharge l'app", "Quand une app est prête, son téléchargement est sur sa fiche, avec les infos pour l'installer."],
                ["Apprends à la refaire", "Des cours et des vidéos, et un atelier pour comprendre les layouts Flutter."],
              ].map(([title, copy]) => (
                <article key={title} className="panel p-5">
                  <h3 className="font-display text-xl font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed opacity-80">{copy}</p>
                </article>
              ))}
            </section>

            <section data-screen="club" aria-labelledby="apps-titre">
              <div className="panel mb-4 flex items-end justify-between gap-3 p-5">
                <h2 id="apps-titre" className="font-display text-3xl font-semibold">
                  Trois maquettes d'exemple
                </h2>
                <Link to="/projets" className="text-sm font-semibold underline">
                  Tout voir
                </Link>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {projects.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </div>
            </section>
          </div>

          <aside className="relative hidden lg:block">
            <div className="sticky top-24">
              <Phone screen={screen} />
            </div>
          </aside>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <section className="panel p-5 sm:p-6">
            <WidjaSlot size={88} className="float-right ml-3" />
            <p className="accent-text text-sm font-semibold">Quatre questions</p>
            <h2 className="mt-2 font-display text-3xl font-semibold">Quel dev mobile es-tu ?</h2>
            <p className="mt-3">Un niveau, une carte à envoyer sur WhatsApp. Pas de compte.</p>
            <Link to="/quiz" className="btn btn-primary mt-5">
              Faire le quiz
            </Link>
          </section>
          <section className="panel p-5 sm:p-6">
            <p className="accent-text text-sm font-semibold">Nous suivre</p>
            <h2 className="mt-2 font-display text-3xl font-semibold">Rejoindre</h2>
            <p className="mt-3">Le groupe WhatsApp de la section, ou le Club Informatique depuis son site.</p>
            <Link to="/rejoindre" className="btn btn-primary mt-5">
              Voir comment
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
