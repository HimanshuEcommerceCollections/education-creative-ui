import type { Subject } from "@/types/subject";

/** Scrolling ticker labels (order differs from the mosaic in the source). */
export const SUBJECT_MARQUEE: readonly string[] = [
  "Academic Tutoring",
  "College Admissions",
  "Music",
  "Languages",
  "Arts & Crafts",
  "Cooking",
];

/** Featured Subjects mosaic photo tiles, in display order. */
export const SUBJECTS: Subject[] = [
  {
    id: "tutoring",
    category: "Academic",
    title: "Academic Tutoring",
    description: "Steady support in the subjects that matter most.",
    image: { src: "/assets/home/images/subject-academic-tutoring.jpg", alt: "Academic Tutoring" },
    href: "/subjects/tutoring",
  },
  {
    id: "music",
    category: "Creative",
    title: "Music",
    image: { src: "/assets/home/images/subject-music.jpg", alt: "Music" },
    href: "/subjects/music",
  },
  {
    id: "college",
    category: "Academic",
    title: "College Admissions",
    image: { src: "/assets/home/images/subject-college-admissions.jpg", alt: "College Admissions" },
    href: "/subjects/college-admissions",
  },
  {
    id: "arts",
    category: "Creative",
    title: "Arts & Crafts",
    image: { src: "/assets/home/images/subject-arts-crafts.jpg", alt: "Arts & Crafts" },
    href: "/subjects/arts-crafts",
  },
  {
    id: "languages",
    category: "Academic",
    title: "Languages",
    description: "Real conversation with fluent, patient speakers.",
    href: "/subjects/languages",
    image: { src: "/assets/home/images/subject-languages.jpg", alt: "Languages" },
  },
  {
    id: "cooking",
    category: "Creative",
    title: "Cooking",
    description: "Confident kitchen skills for every age.",
    href: "/subjects/cooking",
    image: { src: "/assets/home/images/subject-cooking.jpg", alt: "Cooking" },
  },
];
