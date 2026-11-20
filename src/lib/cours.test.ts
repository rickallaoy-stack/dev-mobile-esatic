import assert from "node:assert/strict";
import { test } from "node:test";
import { coursByKind, embedUrl, type Cours } from "../data/cours.ts";

test("embedUrl : identifiant YouTube valide uniquement", () => {
  assert.equal(embedUrl("dQw4w9WgXcQ"), "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0");
  assert.equal(embedUrl(undefined), null);
  assert.equal(embedUrl("court"), null);
  assert.equal(embedUrl("dQw4w9WgXcQ\"><script>"), null);
});

test("coursByKind : ignore les entrées sans contenu réel", () => {
  const base = { slug: "x", title: "t", summary: "s", level: "Débutant" } as const;
  const list: Cours[] = [
    { ...base, kind: "video", videoId: "invalide" },
    { ...base, slug: "y", kind: "video", videoId: "dQw4w9WgXcQ" },
    { ...base, slug: "z", kind: "interactif" },
    { ...base, slug: "w", kind: "interactif", href: "/atelier" },
  ];
  assert.deepEqual(coursByKind("video", list).map((c) => c.slug), ["y"]);
  assert.deepEqual(coursByKind("interactif", list).map((c) => c.slug), ["w"]);
});
