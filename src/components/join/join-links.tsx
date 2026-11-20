import { CLUB_URL, whatsappGroupUrl } from "@/lib/liens";

/** Deux sorties : le groupe WhatsApp de la section et le site du Club Informatique. */
export function JoinLinks({ className = "" }: { className?: string }) {
  const whatsapp = whatsappGroupUrl();
  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${className}`}>
      <article className="panel p-5">
        <h3 className="font-display text-xl font-semibold">Le groupe WhatsApp</h3>
        <p className="mt-2 text-sm leading-relaxed opacity-80">
          Les nouvelles apps, les questions et l'entraide de la section, au même endroit.
        </p>
        {whatsapp ? (
          <a className="btn btn-primary mt-4" href={whatsapp} target="_blank" rel="noopener noreferrer">
            Rejoindre le groupe
          </a>
        ) : (
          <p className="mt-4 text-sm font-semibold" role="status">
            Le lien du groupe sera publié bientôt.
          </p>
        )}
      </article>
      <article className="panel p-5">
        <h3 className="font-display text-xl font-semibold">Le Club Informatique</h3>
        <p className="mt-2 text-sm leading-relaxed opacity-80">
          La section fait partie du Club Informatique de l'ESATIC. Rejoins-la depuis sa page sur le site du club.
        </p>
        <a className="btn btn-secondary mt-4" href={CLUB_URL} target="_blank" rel="noopener noreferrer">
          Rejoindre sur le site du club
        </a>
      </article>
    </div>
  );
}
