/** Métadonnées de page, posées dans le HTML initial via le `head` de la route. */

export type PageSeo = {
  title: string;
  description: string;
  path: string;
};

function absoluteUrl(path: string): string | undefined {
  const host = import.meta.env.VITE_PUBLIC_HOSTNAME as string | undefined;
  if (!host) return undefined;
  const clean = host.replace(/^https?:\/\//, "").replace(/\/$/, "");
  if (!clean) return undefined;
  return `https://${clean}${path}`;
}

export function pageHead(page: PageSeo) {
  const url = absoluteUrl(page.path);
  const meta: Array<{ title?: string; name?: string; property?: string; content?: string }> = [
    { title: page.title },
    { name: "description", content: page.description },
    { property: "og:title", content: page.title },
    { property: "og:description", content: page.description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: page.title },
    { name: "twitter:description", content: page.description },
  ];
  if (url) {
    meta.push({ property: "og:url", content: url });
  }
  return {
    meta,
    links: url ? [{ rel: "canonical", href: url }] : [{ rel: "canonical", href: page.path }],
  };
}
