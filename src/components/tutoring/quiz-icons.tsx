import type { ComponentType } from "react";

import type { QuizSubject } from "@/types/quiz";

const FACE_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

/** Sigma / summation (Mathematics). */
export function MathFaceIcon() {
  return (
    <svg {...FACE_PROPS}>
      <path d="M5 4h14M5 4l8 8-8 8h14" />
    </svg>
  );
}

/** Open book (English). */
export function EnglishFaceIcon() {
  return (
    <svg {...FACE_PROPS}>
      <path d="M12 6c-1.5-1.7-3.8-2.5-7-2.5v14c3.2 0 5.5.8 7 2.5 1.5-1.7 3.8-2.5 7-2.5v-14c-3.2 0-5.5.8-7 2.5z" />
      <path d="M12 6v14" />
    </svg>
  );
}

/** Flask (Science). */
export function ScienceFaceIcon() {
  return (
    <svg {...FACE_PROPS}>
      <path d="M9 3h6M10 3v6l-5.5 9A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-3L14 9V3" />
      <path d="M8 15h8" />
    </svg>
  );
}

/** Code brackets (Computer Science). */
export function CsFaceIcon() {
  return (
    <svg {...FACE_PROPS}>
      <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13 4l-2 16" />
    </svg>
  );
}

/** Globe (Languages). */
export function LanguagesFaceIcon() {
  return (
    <svg {...FACE_PROPS}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z" />
    </svg>
  );
}

/** Star (Wild). */
export function WildFaceIcon() {
  return (
    <svg {...FACE_PROPS}>
      <path d="M12 3l2.4 5.1 5.6.7-4.1 3.8 1.1 5.5L12 15.4 7 18.1l1.1-5.5L4 8.8l5.6-.7z" />
    </svg>
  );
}

/** Icon for the flashcard chip, keyed by subject. */
export const QUIZ_SUBJECT_ICON: Record<QuizSubject, ComponentType> = {
  math: MathFaceIcon,
  english: EnglishFaceIcon,
  science: ScienceFaceIcon,
  cs: CsFaceIcon,
  languages: LanguagesFaceIcon,
};
