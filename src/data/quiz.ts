export type QuizLevelId = "curieux" | "maker" | "architecte";

export type QuizOption = {
  id: string;
  label: string;
  points: number;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: QuizOption[];
};

export type QuizLevel = {
  id: QuizLevelId;
  name: string;
  line: string;
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: "depart",
    prompt: "Une idée d'app te vient. Tu commences par quoi ?",
    options: [
      { id: "note", label: "Je la note, pour ne pas l'oublier.", points: 1 },
      { id: "ecran", label: "Je dessine le premier écran.", points: 2 },
      { id: "donnees", label: "Je liste ce que l'app doit retenir.", points: 3 },
    ],
  },
  {
    id: "bug",
    prompt: "Un bouton s'affiche, mais il ne réagit pas. Tu fais quoi ?",
    options: [
      { id: "ensemble", label: "Je demande à quelqu'un de regarder avec moi.", points: 1 },
      { id: "widget", label: "Je relis le widget et je relance.", points: 2 },
      { id: "etat", label: "J'isole l'état qui devrait changer.", points: 3 },
    ],
  },
  {
    id: "attrait",
    prompt: "Qu'est-ce qui te donne envie de rester sur un projet ?",
    options: [
      { id: "comprendre", label: "Comprendre comment une app tient debout.", points: 1 },
      { id: "doigt", label: "Voir un geste du doigt changer l'écran.", points: 2 },
      { id: "base", label: "Brancher l'écran à quelque chose qui dure.", points: 3 },
    ],
  },
  {
    id: "rythme",
    prompt: "Ton rythme idéal, en séance ?",
    options: [
      { id: "guide", label: "Un exercice guidé, une étape à la fois.", points: 1 },
      { id: "fini", label: "Un petit écran fini avant de partir.", points: 2 },
      { id: "defi", label: "Un défi que j'emporte et que je termine seul.", points: 3 },
    ],
  },
];

export const quizLevels: Record<QuizLevelId, QuizLevel> = {
  curieux: {
    id: "curieux",
    name: "Curieux",
    line: "Tu veux voir comment une app se construit. La section commence exactement là : un écran, ensemble.",
  },
  maker: {
    id: "maker",
    name: "Maker",
    line: "Tu avances dès qu'un écran répond. En séance, on vise quelque chose que l'on peut toucher.",
  },
  architecte: {
    id: "architecte",
    name: "Architecte",
    line: "Tu regardes déjà derrière l'écran : l'état, les données, ce qui reste quand l'app se ferme.",
  },
};

export function levelFromScore(score: number): QuizLevel {
  if (score >= 10) return quizLevels.architecte;
  if (score >= 7) return quizLevels.maker;
  return quizLevels.curieux;
}

export function scoreAnswers(answers: Record<string, string>): number | null {
  let total = 0;
  for (const question of quizQuestions) {
    const picked = answers[question.id];
    const option = question.options.find((item) => item.id === picked);
    if (!option) return null;
    total += option.points;
  }
  return total;
}
