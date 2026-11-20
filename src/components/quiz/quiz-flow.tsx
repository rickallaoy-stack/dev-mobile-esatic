import { useEffect, useRef, useState } from "react";
import { levelFromScore, quizQuestions, scoreAnswers } from "@/data/quiz";
import { drawQuizCard, quizShareText } from "@/lib/quiz-card";

export function QuizFlow() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const done = step >= quizQuestions.length;
  const score = done ? scoreAnswers(answers) : null;
  const level = score === null ? null : levelFromScore(score);
  const question = quizQuestions[step];

  useEffect(() => {
    if (!level) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    void document.fonts.ready
      .then(() => {
        if (cancelled || !canvasRef.current) return;
        const fontsReady = document.fonts.check("16px Sora") && document.fonts.check("16px Inter");
        drawQuizCard(canvasRef.current, level, fontsReady);
      })
      .catch(() => {
        if (!cancelled && canvasRef.current) drawQuizCard(canvasRef.current, level, false);
      });
    return () => {
      cancelled = true;
    };
  }, [level]);

  const paint = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !level) return;
    await document.fonts.ready.catch(() => undefined);
    const fontsReady = document.fonts.check("16px Sora") && document.fonts.check("16px Inter");
    drawQuizCard(canvas, level, fontsReady);
  };

  const share = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !level) return;
    await paint();
    const text = quizShareText(level);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    const file = blob ? new File([blob], "quiz-dev-mobile-esatic.png", { type: "image/png" }) : null;
    if (file && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], text, title: level.name });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  const download = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !level) return;
    await paint();
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "quiz-dev-mobile-esatic.png";
    link.click();
  };

  if (!done && question) {
    return (
      <fieldset className="panel p-5 sm:p-6">
        <legend className="px-1 text-sm font-semibold opacity-70">
          Question {step + 1} sur {quizQuestions.length}
        </legend>
        <h2 className="mt-3 font-display text-2xl font-semibold sm:text-3xl">{question.prompt}</h2>
        <div className="mt-5 grid gap-3">
          {question.options.map((option) => (
            <button
              key={option.id}
              type="button"
              className="panel px-4 py-4 text-left font-medium"
              onClick={() => {
                setAnswers((current) => ({ ...current, [question.id]: option.id }));
                setStep((value) => value + 1);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>
    );
  }

  if (!level) return null;

  return (
    <div className="grid gap-6">
      <div className="panel p-5 sm:p-6">
        <p className="text-sm font-semibold accent-text">Ton niveau</p>
        <h2 className="mt-2 font-display text-4xl font-semibold">{level.name}</h2>
        <p className="mt-3 max-w-xl">{level.line}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" className="btn btn-primary" onClick={() => void share()}>
            Partager sur WhatsApp
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => void download()}>
            Télécharger la carte
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setAnswers({});
              setStep(0);
            }}
          >
            Recommencer
          </button>
        </div>
      </div>
      <canvas ref={canvasRef} className="panel h-auto w-full max-w-3xl" aria-label={`Carte de résultat : ${level.name}`} />
    </div>
  );
}
