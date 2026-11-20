const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/** Numéro de pass décoratif (ex. DM-K7M-4QX). Tiré au hasard dans le navigateur, jamais enregistré, ne donne accès à rien. */
export function generatePassNumber(): string {
  const bytes = new Uint8Array(6);
  globalThis.crypto.getRandomValues(bytes);
  const chars = Array.from(bytes, (byte) => ALPHABET[byte % ALPHABET.length]);
  return `DM-${chars.slice(0, 3).join("")}-${chars.slice(3).join("")}`;
}

/** Premier mot du nom saisi, pour ne jamais afficher le nom complet sur la carte partagée. */
export function passName(nom: string): string {
  const first = nom.trim().split(/\s+/)[0] ?? "";
  return first.slice(0, 20);
}

export type PassInfo = { name: string; niveau: string; numero: string };

const WIDTH = 1200;
const HEIGHT = 630;
const STUB_X = 880;

/** Dessine le pass de pré-inscription (ticket nuit + souche crème, avec tranches glitch). */
export function drawPassCard(canvas: HTMLCanvasElement, info: PassInfo, fontsReady: boolean) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const display = fontsReady ? "Sora, sans-serif" : "sans-serif";
  const body = fontsReady ? "Inter, sans-serif" : "sans-serif";

  ctx.fillStyle = "#0B1020";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = "#F1E9D6";
  ctx.fillRect(STUB_X, 0, WIDTH - STUB_X, HEIGHT);

  ctx.fillStyle = "#54C5F8";
  ctx.font = `600 24px ${body}`;
  ctx.fillText("PASS DE PRÉ-INSCRIPTION", 64, 84);
  ctx.fillStyle = "#F1E9D6";
  ctx.font = `500 28px ${body}`;
  ctx.fillText("Section Développement Mobile · ESATIC", 64, 128);

  let size = 112;
  ctx.font = `600 ${size}px ${display}`;
  while (ctx.measureText(info.name).width > 740 && size > 48) {
    size -= 4;
    ctx.font = `600 ${size}px ${display}`;
  }
  ctx.fillStyle = "#F1E9D6";
  ctx.fillText(info.name, 64, 320);

  ctx.fillStyle = "#E8805A";
  ctx.fillRect(64, 352, 96, 10);
  ctx.fillStyle = "#F1E9D6";
  ctx.font = `500 34px ${body}`;
  ctx.fillText(`Niveau ${info.niveau}`, 64, 420);
  ctx.fillStyle = "#54C5F8";
  ctx.font = `600 44px ui-monospace, Menlo, Consolas, monospace`;
  ctx.fillText(`N° ${info.numero}`, 64, 490);
  ctx.fillStyle = "#F1E9D6";
  ctx.globalAlpha = 0.7;
  ctx.font = `400 22px ${body}`;
  ctx.fillText("Pré-inscrit, pas encore membre. Numéro décoratif.", 64, 580);
  ctx.globalAlpha = 1;

  ctx.fillStyle = "#4F46E5";
  ctx.beginPath();
  ctx.arc(1040, 280, 96, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#F1E9D6";
  ctx.font = `600 120px ${display}`;
  ctx.textAlign = "center";
  ctx.fillText("W", 1040, 322);
  ctx.fillStyle = "#54C5F8";
  ctx.beginPath();
  ctx.arc(1112, 208, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1A1612";
  ctx.font = `600 26px ${body}`;
  ctx.fillText("Widja", 1040, 470);
  ctx.textAlign = "left";

  ctx.fillStyle = "#0B1020";
  for (let y = 24; y < HEIGHT; y += 36) {
    ctx.beginPath();
    ctx.arc(STUB_X, y, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  const slices: Array<[number, number, number]> = [
    [96, 16, -14],
    [262, 10, 12],
    [398, 20, -9],
  ];
  for (const [y, h, dx] of slices) {
    ctx.drawImage(canvas, 0, y, STUB_X - 16, h, dx, y, STUB_X - 16, h);
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = dx < 0 ? "#54C5F8" : "#E8805A";
    ctx.fillRect(0, y, STUB_X - 16, 2);
    ctx.globalAlpha = 1;
  }
}
