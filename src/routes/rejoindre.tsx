import { createFileRoute } from "@tanstack/react-router";
import { JoinLinks } from "@/components/join/join-links";
import { PageTone } from "@/components/site/tone";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/rejoindre")({
  head: () =>
    pageHead({
      title: "Rejoindre · Section Développement Mobile ESATIC",
      description:
        "Rejoins le groupe WhatsApp de la section Développement Mobile ou le Club Informatique de l'ESATIC.",
      path: "/rejoindre",
    }),
  component: JoinPage,
});

function JoinPage() {
  return (
    <main id="contenu" className="mx-auto max-w-3xl px-4 py-10">
      <PageTone tone="day" />
      <p className="accent-text text-sm font-semibold">Deux façons de nous suivre</p>
      <h1 className="mt-2 font-display text-4xl font-semibold">Rejoindre</h1>
      <p className="mt-3 max-w-xl">
        Suis les apps de la section dans le groupe WhatsApp, ou rejoins le Club Informatique depuis son site. Pas de compte à créer ici.
      </p>
      <JoinLinks className="mt-8" />
    </main>
  );
}
