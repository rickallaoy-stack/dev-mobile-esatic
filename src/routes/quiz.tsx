import { createFileRoute } from "@tanstack/react-router";
import { QuizFlow } from "@/components/quiz/quiz-flow";
import { PageTone } from "@/components/site/tone";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/quiz")({
  head: () =>
    pageHead({
      title: "Quel dev mobile es-tu ? · ESATIC",
      description:
        "Quatre questions, un niveau, une carte à partager sur WhatsApp. Quiz de la section Développement Mobile, sans compte.",
      path: "/quiz",
    }),
  component: QuizPage,
});

function QuizPage() {
  return (
    <main id="contenu" className="mx-auto max-w-3xl px-4 py-10">
      <PageTone tone="night" />
      <p className="accent-text text-sm font-semibold">Sans compte</p>
      <h1 className="mt-2 font-display text-4xl font-semibold">Quel dev mobile es-tu ?</h1>
      <p className="mt-3 max-w-xl">
        Quatre questions. Le résultat est un niveau et une carte générée ici, sur ton écran. Rien n'est enregistré.
      </p>
      <div className="mt-8">
        <QuizFlow />
      </div>
    </main>
  );
}
