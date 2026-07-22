import type {
  OfferItem,
  SubjectEducator,
  SubjectStat,
} from "@/types/subject-page";

/** Marquee ticker labels for the Music subject page. */
export const MUSIC_MARQUEE: readonly string[] = [
  "Piano",
  "Guitar",
  "Voice",
  "Violin",
  "Drums",
  "Theory",
];

/** "Three ways in" offer cards. */
export const OFFERS: OfferItem[] = [
  {
    id: "instrument",
    icon: "note",
    title: "Instrument Lessons",
    description:
      "Piano, guitar, violin, drums and more — from the very first note to advanced repertoire.",
    image: { src: "/assets/music/images/offer-instrument-lessons.jpg", alt: "Instrument Lessons" },
  },
  {
    id: "voice",
    icon: "mic",
    title: "Voice & Singing",
    description:
      "Healthy technique, confidence, and songs learners actually want to sing.",
    image: { src: "/assets/music/images/offer-voice-singing.jpg", alt: "Voice & Singing" },
  },
  {
    id: "theory",
    icon: "book",
    title: "Theory & Composition",
    description:
      "Reading, writing, and understanding music — for exams or curiosity.",
    image: { src: "/assets/music/images/offer-theory-composition.jpg", alt: "Theory & Composition" },
  },
];

/** Sample educator profiles. */
export const EDUCATORS: SubjectEducator[] = [
  {
    id: "marcus",
    name: "Marcus T.",
    role: "Music Educator",
    meta: "12 yrs experience · In-home",
    rating: "5.0",
    bio: "Classically trained, but happiest teaching the songs you actually want to play.",
    price: "$60/hr",
    href: "/educators/marcus",
    image: { src: "/assets/music/images/educator-marcus.jpg", alt: "Marcus T., music educator" },
  },
  {
    id: "rosa",
    name: "Rosa N.",
    role: "Music Educator",
    meta: "11 yrs experience · Online · In-home",
    rating: "4.8",
    bio: "Violin and viola, from first bow-hold to youth orchestra auditions.",
    price: "$54/hr",
    href: "/educators/rosa",
    image: { src: "/assets/music/images/educator-rosa.jpg", alt: "Rosa N., music educator" },
  },
];

/** Subject stats strip. */
export const MUSIC_STATS: SubjectStat[] = [
  { id: "monthly", value: 140, suffix: "+", label: "Music lessons monthly" },
  { id: "educators", value: 2, label: "Vetted music educators" },
  { id: "rating", value: 4.9, decimals: 1, label: "Average rating" },
];
