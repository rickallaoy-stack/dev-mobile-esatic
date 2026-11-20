import { createFileRoute } from "@tanstack/react-router";
import { LayoutPlayground } from "@/components/atelier/layout-playground";
import { PageTone } from "@/components/site/tone";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/atelier")({
  head: () =>
    pageHead({
      title: "Atelier : comprends Column et Row · ESATIC",
      description:
        "Un faux téléphone et le code Dart qui change en même temps. Trois défis guidés pour comprendre les layouts Flutter, sans compte.",
      path: "/atelier",
    }),
  component: AtelierPage,
});

function AtelierPage() {
  return (
    <main id="contenu" className="mx-auto max-w-5xl px-4 py-10">
      <PageTone tone="night" />
      <p className="accent-text text-sm font-semibold">Sans compte, sans installation</p>
      <h1 className="mt-2 font-display text-4xl font-semibold">Atelier : Column et Row</h1>
      <p className="mt-3 max-w-xl">Change un réglage, regarde le téléphone bouger et le code Dart se réécrire. Puis relève les trois défis.</p>
      <div className="mt-8">
        <LayoutPlayground />
      </div>
    </main>
  );
}
