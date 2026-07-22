export type QuizSubject = "math" | "science" | "english" | "cs" | "languages";

export interface QuizQuestion {
  question: string;
  options: string[];
  /** Index into `options` of the correct answer. */
  correct: number;
  note: string;
}
