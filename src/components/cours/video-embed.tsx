import { useState } from "react";
import { embedUrl, type Cours } from "@/data/cours";

/** La vidéo ne se charge qu'au clic : rien n'est téléchargé tant que le visiteur ne la lance pas. */
export function VideoEmbed({ cours }: { cours: Cours }) {
  const [open, setOpen] = useState(false);
  const url = embedUrl(cours.videoId);
  if (!url) return null;
  if (!open) {
    return (
      <button type="button" className="btn btn-secondary mt-4" onClick={() => setOpen(true)}>
        Lire la vidéo
      </button>
    );
  }
  return (
    <iframe
      className="mt-4 aspect-video w-full rounded-2xl border-0"
      src={url}
      title={cours.title}
      loading="lazy"
      allow="encrypted-media; picture-in-picture; fullscreen"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
    />
  );
}
