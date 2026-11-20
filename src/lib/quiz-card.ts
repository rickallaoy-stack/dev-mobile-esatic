import type { QuizLevel } from "@/data/quiz";

const WIDTH = 1200;
const HEIGHT = 630;

/** Dessine la carte de résultat. Le canvas doit déjà avoir les bonnes dimensions. */
export function drawQuizCard(
  canvas: HTMLCanvasElement,
  level: QuizLevel,
  fontsReady: boolean,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const scale = 1;
  canvas.width = WIDTH * scale;
  canvas.height = HEIGHT * scale;

  ctx.fillStyle = "#F1E9D6";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#0B1020";
  ctx.fillRect(0, 0, canvas.width, 168);

  ctx.fillStyle = "#4F46E5";
  ctx.beginPath();
  ctx.arc(1080, 84, 46, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#54C5F8";
  ctx.beginPath();
  ctx.arc(1080, 84, 18, 0, Math.PI * 2);
  ctx.fill();

  const display = fontsReady ? "Sora, sans-serif" : "sans-serif";
  const body = fontsReady ? "Inter, sans-serif" : "sans-serif";

  ctx.fillStyle = "#F1E9D6";
  ctx.font = `600 28px ${body}`;
  ctx.fillText("Section Développement Mobile · ESATIC", 64, 78);

  ctx.font = `500 22px ${body}`;
  ctx.fillStyle = "#54C5F8";
  ctx.fillText("Quel dev mobile es-tu ?", 64, 124);

  ctx.fillStyle = "#1A1612";
  ctx.font = `600 92px ${display}`;
  ctx.fillText(level.name, 64, 340);

  ctx.fillStyle = "#E8805A";
  ctx.fillRect(64, 372, 96, 10);

  ctx.fillStyle = "#3A342C";
  ctx.font = `400 32px ${body}`;
  wrapText(ctx, level.line, 64, 440, 980, 44);

  ctx.font = `500 22px ${body}`;
  ctx.fillStyle = "#3E5C45";
  ctx.fillText("Résultat personnel. Pas un classement, pas un diplôme.", 64, 580);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(" ");
  let line = "";
  let cursor = y;
  for (const word of words) {
    const attempt = line ? `${line} ${word}` : word;
    if (ctx.measureText(attempt).width > maxWidth && line) {
      ctx.fillText(line, x, cursor);
      line = word;
      cursor += lineHeight;
    } else {
      line = attempt;
    }
  }
  if (line) ctx.fillText(line, x, cursor);
}

export function quizShareText(level: QuizLevel): string {
  return `Je suis « ${level.name} » au quiz « Quel dev mobile es-tu ? ». Section Développement Mobile, Club Informatique de l'ESATIC.`;
}
