import type { ImageAsset } from "@/types/media";
import type { QuizSubject } from "@/types/quiz";

/** A subject page (right-hand page of the book). */
export interface BookPage {
  title: string;
  /** Reuses the quiz subject icons. */
  icon: QuizSubject;
  chips: string[];
  note: string;
  /** Page number printed in the corner. */
  num: string;
}

/** A photo page (left-hand page revealed on turn). */
export interface BookPhoto {
  image: ImageAsset;
  caption: string;
}

export const BOOK_PAGES: BookPage[] = [
  {
    title: "Mathematics",
    icon: "math",
    chips: ["Algebra", "Geometry", "Calculus"],
    note: "From first principles to exam-day confidence, one step at a time.",
    num: "01",
  },
  {
    title: "Science",
    icon: "science",
    chips: ["Physics", "Chemistry", "Biology"],
    note: "Curiosity first — concepts, experiments, and clear explanations.",
    num: "03",
  },
  {
    title: "English",
    icon: "english",
    chips: ["Grammar", "Literature", "Writing"],
    note: "Read closely, write clearly, and find your own voice.",
    num: "05",
  },
  {
    title: "Computer Science",
    icon: "cs",
    chips: ["Programming", "AI", "Web"],
    note: "Think in logic and build real things from the very first lesson.",
    num: "07",
  },
  {
    title: "Languages",
    icon: "languages",
    chips: ["Spanish", "French", "Hindi"],
    note: "Speak from day one, with culture woven into every lesson.",
    num: "09",
  },
];

export const BOOK_PHOTOS: BookPhoto[] = [
  {
    image: {
      src: "/assets/tutoring/images/book-mathematics.jpg",
      alt: "Mathematics lesson at the chalkboard",
    },
    caption: "Mathematics",
  },
  {
    image: {
      src: "/assets/tutoring/images/book-science.jpg",
      alt: "Hands-on chemistry experiment",
    },
    caption: "Science",
  },
  {
    image: {
      src: "/assets/tutoring/images/book-english.jpg",
      alt: "English lesson in progress",
    },
    caption: "English",
  },
  {
    image: {
      src: "/assets/tutoring/images/book-computer-science.jpg",
      alt: "Students in a computer class",
    },
    caption: "Computer Science",
  },
  {
    image: {
      src: "/assets/tutoring/images/book-languages.jpg",
      alt: "Language class with world flags",
    },
    caption: "Languages",
  },
];

/** Caption shown in the nav for each turn state (index = pages turned). */
export const BOOK_LABELS = [
  "Cover",
  "Mathematics",
  "Science",
  "English",
  "Computer Science",
  "Languages",
  "Keep exploring",
];
