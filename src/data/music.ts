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
    bio: "Classically trained, but happiest teaching the songs you actually want to play.",
    price: "$60/hr",
    href: "/browse",
    image: { src: "/assets/music/images/educator-marcus.jpg", alt: "Marcus T., music educator" },
  },
  {
    id: "rosa",
    name: "Rosa N.",
    role: "Music Educator",
    meta: "11 yrs experience · Online · In-home",
    bio: "Violin and viola, from first bow-hold to youth orchestra auditions.",
    price: "$54/hr",
    href: "/browse",
    image: { src: "/assets/music/images/educator-rosa.jpg", alt: "Rosa N., music educator" },
  },
];

/**
 * Subject stats strip.
 *
 * Every tile is a fact a reader can check against the page itself or against the
 * booking policy — the two counts are read off the arrays this page renders, so they
 * cannot drift from what is on screen. Ratings are published per educator, not as a
 * platform average, and there is no session history to count, so no tile may state an
 * average rating or a monthly lesson total.
 */
export const MUSIC_STATS: SubjectStat[] = [
  { id: "instruments", value: MUSIC_MARQUEE.length, label: "Instruments & skills taught" },
  { id: "educators", value: EDUCATORS.length, label: "Vetted music educators" },
  // BOOKING_POLICY.confirmationSlaDays on the server, and the same promise the
  // booking flow makes before anyone pays.
  { id: "confirmation", value: 2, suffix: " days", label: "To confirm, or refund" },
];
