import type { ImageAsset } from "@/types/media";

/** Which icon a service card shows, keyed into SERVICE_ICONS. */
export type ServiceIconName =
  | "document"
  | "graduation"
  | "note"
  | "globe"
  | "palette"
  | "pot";

/** A subject card on the Services hub. */
export interface ServiceItem {
  id: string;
  icon: ServiceIconName;
  title: string;
  description: string;
  /** Starting rate without the unit, e.g. "$50" — rendered as "from $50/hr". */
  rateFrom: string;
  /** The subject page this card opens. */
  href: string;
  image: ImageAsset;
}

/**
 * The six subjects, in display order, for the Services hub grid. Kept separate
 * from SUBJECTS in `subjects.ts` — that set drives the home mosaic and carries
 * shorter, tile-sized copy. Both point at the same `/subjects/*` routes.
 */
export const SERVICES: ServiceItem[] = [
  {
    id: "tutoring",
    icon: "document",
    title: "Academic Tutoring",
    description:
      "K–12 math, reading, writing and science support, built around each learner’s pace and goals.",
    rateFrom: "$50",
    href: "/subjects/tutoring",
    image: {
      src: "/assets/home/images/subject-academic-tutoring.jpg",
      alt: "An educator working through a maths problem with a student",
    },
  },
  {
    id: "college",
    icon: "graduation",
    title: "College Admissions",
    description:
      "Guidance on applications, essays, interviews and timelines — honest support, never outcome promises.",
    rateFrom: "$65",
    href: "/subjects/college-admissions",
    image: {
      src: "/assets/home/images/subject-college-admissions.jpg",
      alt: "A student reviewing application materials with an adviser",
    },
  },
  {
    id: "music",
    icon: "note",
    title: "Music",
    description:
      "Piano, guitar, voice and more, from first notes to steady practice, in your home or online.",
    rateFrom: "$54",
    href: "/subjects/music",
    image: {
      src: "/assets/home/images/subject-music.jpg",
      alt: "A child at a piano during a lesson",
    },
  },
  {
    id: "languages",
    icon: "globe",
    title: "Languages",
    description:
      "Conversational and school-curriculum practice across Spanish, French, Hindi, English and more.",
    rateFrom: "$48",
    href: "/subjects/languages",
    image: {
      src: "/assets/home/images/subject-languages.jpg",
      alt: "A language lesson in progress",
    },
  },
  {
    id: "arts",
    icon: "palette",
    title: "Arts & Crafts",
    description:
      "Hands-on creative sessions — drawing, painting and small-batch projects sized to finish.",
    rateFrom: "$45",
    href: "/subjects/arts-crafts",
    image: {
      src: "/assets/home/images/subject-arts-crafts.jpg",
      alt: "A child painting at a craft table",
    },
  },
  {
    id: "cooking",
    icon: "pot",
    title: "Cooking",
    description:
      "Kitchen basics and confidence, with a parent always welcome at the table.",
    rateFrom: "$54",
    href: "/subjects/cooking",
    image: {
      src: "/assets/home/images/subject-cooking.jpg",
      alt: "A parent and child cooking together",
    },
  },
];
