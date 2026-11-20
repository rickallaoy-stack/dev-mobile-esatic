import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home/home-page";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      title: "Section Développement Mobile · ESATIC",
      description:
        "Les apps mobiles de la section Développement Mobile du Club Informatique de l'ESATIC, à Abidjan : captures, démos dans le navigateur, téléchargements, cours et vidéos.",
      path: "/",
    }),
  component: HomePage,
});
