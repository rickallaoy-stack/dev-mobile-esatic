import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { Shell } from "@/components/site/shell";
import { ToneProvider } from "@/components/site/tone";
import appCss from "../styles.css?url";

const APP_NAME = "Section Développement Mobile · ESATIC";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "description", content: "Section Développement Mobile du Club Informatique de l'ESATIC, à Abidjan." },
      { name: "theme-color", content: "#0B1020" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@500;600;700&display=swap",
      },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  shellComponent: RootShell,
  component: () => (
    <ToneProvider>
      <Shell>
        <Outlet />
      </Shell>
    </ToneProvider>
  ),
  notFoundComponent: () => (
    <main id="contenu" className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-4xl font-semibold">Page introuvable</h1>
      <p className="mt-3">Ce lien ne mène nulle part sur le site de la section.</p>
      <a className="btn btn-primary mt-6" href="/">
        Retour à l'accueil
      </a>
    </main>
  ),
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{var t=localStorage.getItem("sdm-tone");if(t==="day"||t==="night")document.documentElement.dataset.tone=t;}catch(e){}',
          }}
        />
        <PreviewHostBridge />
        <AuthProvider>{children}</AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
