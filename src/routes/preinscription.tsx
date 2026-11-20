import { createFileRoute } from "@tanstack/react-router";
import { JoinForm } from "@/components/join/join-form";
import { PageTone } from "@/components/site/tone";
import { pageHead } from "@/lib/seo";

/**
 * Page cachée : le formulaire de pré-inscription n'est lié nulle part et n'est pas indexé.
 * Le site publie les apps de la section ; la sortie publique est /rejoindre (WhatsApp + club).
 * Pour la réactiver, ajouter un lien vers /preinscription.
 */
export const Route = createFileRoute("/preinscription")({
  head: () => {
    const head = pageHead({
      title: "Pré-inscription · Section Développement Mobile ESATIC",
      description: "Pré-inscription à la section Développement Mobile du Club Informatique de l'ESATIC.",
      path: "/preinscription",
    });
    return { ...head, meta: [...head.meta, { name: "robots", content: "noindex, nofollow" }] };
  },
  component: PreinscriptionPage,
});

function PreinscriptionPage() {
  return (
    <main id="contenu" className="mx-auto max-w-3xl px-4 py-10">
      <PageTone tone="day" />
      <p className="accent-text text-sm font-semibold">Une minute</p>
      <h1 className="mt-2 font-display text-4xl font-semibold">Pré-inscription</h1>
      <p className="mt-3 max-w-xl">
        Nom, filière, niveau, WhatsApp. Pas de compte. Le numéro sert à te retrouver sur la liste, il n'est pas réaffiché.
      </p>
      <div className="mt-8">
        <JoinForm />
      </div>
    </main>
  );
}
