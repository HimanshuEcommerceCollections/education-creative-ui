import type { QuizQuestion, QuizSubject } from "@/types/quiz";

export const QUIZ_SUBJECTS: QuizSubject[] = [
  "math",
  "science",
  "english",
  "cs",
  "languages",
];

export const QUIZ_LABELS: Record<QuizSubject, string> = {
  math: "Mathematics",
  science: "Science",
  english: "English",
  cs: "Computer Science",
  languages: "Languages",
};

export const QUIZ: Record<QuizSubject, QuizQuestion[]> = {
  math: [
    {
      question: "What is 7 × 8?",
      options: ["54", "56", "64"],
      correct: 1,
      note: "Times tables are the warm-up of every maths session.",
    },
    {
      question: "How many sides does a hexagon have?",
      options: ["5", "6", "8"],
      correct: 1,
      note: "Hex- means six — like a honeycomb cell.",
    },
    {
      question: "What is half of 90?",
      options: ["40", "45", "55"],
      correct: 1,
      note: "Halving and doubling build fast mental maths.",
    },
    {
      question: "What comes next: 2, 4, 8, 16…?",
      options: ["24", "32", "36"],
      correct: 1,
      note: "Each number doubles — that's a geometric pattern.",
    },
  ],
  science: [
    {
      question: "Which planet is closest to the Sun?",
      options: ["Venus", "Mercury", "Mars"],
      correct: 1,
      note: "Small, fast, and scorching — a year there lasts 88 days.",
    },
    {
      question: "What gas do plants breathe in?",
      options: ["Oxygen", "Nitrogen", "Carbon dioxide"],
      correct: 2,
      note: "They turn CO₂ into the oxygen we breathe — our lungs in reverse.",
    },
    {
      question: "What force pulls an apple to the ground?",
      options: ["Magnetism", "Friction", "Gravity"],
      correct: 2,
      note: "The same force keeps the Moon circling Earth.",
    },
    {
      question: "Solid, liquid, gas — what's the fourth state of matter?",
      options: ["Plasma", "Steam", "Crystal"],
      correct: 0,
      note: "Lightning and stars are made of it.",
    },
  ],
  english: [
    {
      question: "What is the plural of 'mouse'?",
      options: ["Mouses", "Mice", "Meese"],
      correct: 1,
      note: "English loves irregular plurals — goose becomes geese, too.",
    },
    {
      question: "A word that describes an action is called a…?",
      options: ["Noun", "Adjective", "Verb"],
      correct: 2,
      note: "Run, think, laugh — every sentence needs one.",
    },
    {
      question: "Which 'there' names a place?",
      options: ["Their", "There", "They're"],
      correct: 1,
      note: "Their = belonging; they're = they are.",
    },
    {
      question: "What punctuation mark ends a question?",
      options: ["A full stop", "An exclamation mark", "A question mark"],
      correct: 2,
      note: "Like the one you just answered?",
    },
  ],
  cs: [
    {
      question: "What does 'www' stand for?",
      options: ["Web World Wide", "World Wide Web", "Wide Web World"],
      correct: 1,
      note: "Invented in 1989 — younger than many parents!",
    },
    {
      question: "What is a step-by-step recipe for a computer called?",
      options: ["A password", "An algorithm", "A browser"],
      correct: 1,
      note: "From sorting photos to suggesting videos — all algorithms.",
    },
    {
      question: "In binary, what does 1 + 1 equal?",
      options: ["2", "11", "10"],
      correct: 2,
      note: "Binary only has 0 and 1 — so two is written '10'.",
    },
    {
      question: "HTML builds a page's structure — what adds the style?",
      options: ["CSS", "HTTP", "JPEG"],
      correct: 0,
      note: "This very page is styled with it.",
    },
  ],
  languages: [
    {
      question: "How do you say 'hello' in Spanish?",
      options: ["Bonjour", "Hola", "Ciao"],
      correct: 1,
      note: "The H is silent — 'OH-la'.",
    },
    {
      question: "'Merci' means thank you in which language?",
      options: ["Italian", "Spanish", "French"],
      correct: 2,
      note: "Reply with 'de rien' — you're welcome.",
    },
    {
      question: "How do you say 'thank you' in Hindi?",
      options: ["Namaste", "Alvida", "Dhanyavaad"],
      correct: 2,
      note: "धन्यवाद — a warm, formal thank-you.",
    },
    {
      question: "Which language has the most native speakers?",
      options: ["English", "Mandarin Chinese", "Hindi"],
      correct: 1,
      note: "Nearly a billion people grow up speaking it.",
    },
  ],
};

export const QUIZ_PRAISE = [
  "Great job!",
  "Nailed it!",
  "Brilliant!",
  "Exactly right!",
  "You got it!",
];

export const QUIZ_PERSIST = [
  "There it is — persistence pays!",
  "Got there — that’s real learning!",
  "Yes! Second looks win.",
];

export const QUIZ_CHEER = [
  "Good try — every miss is a step closer. Have another go!",
  "Not quite — but that’s exactly how learning works. Try again!",
  "Almost! Take another look.",
  "Keep going — tutors love a brave guess!",
];
