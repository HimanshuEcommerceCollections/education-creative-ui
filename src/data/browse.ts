import type { ImageAsset } from "@/types/media";

/** A subject filter chip. `value` is matched as a substring of an educator's
 * subject (lowercased); `"all"` shows everyone. */
export interface BrowseFilter {
  label: string;
  value: string;
}

/** One educator card in the browse grid. */
export interface Educator {
  name: string;
  subject: string;
  /** Hourly rate in USD. */
  price: number;
  rating: number;
  description: string;
  image: ImageAsset;
}

/**
 * "View profile" destination. The demo ships a single fully-built profile
 * (Elena's), so — as in the source, where every card opened one shared
 * profile page — all cards link here until more profiles are authored.
 */
export const PROFILE_HREF = "/educators/elena";

/** Sort options for the grid. */
export type BrowseSort = "rating" | "priceLow" | "priceHigh";

export const BROWSE_FILTERS: BrowseFilter[] = [
  { label: "All", value: "all" },
  { label: "Academic Tutoring", value: "academic tutoring" },
  { label: "College Admissions", value: "college admissions" },
  { label: "Music", value: "music" },
  { label: "Languages", value: "languages" },
  { label: "Arts & Crafts", value: "arts" },
  { label: "Cooking", value: "cooking" },
];

export const EDUCATORS: Educator[] = [
  {
    name: "Elena M.",
    subject: "Academic Tutoring",
    price: 55,
    rating: 4.9,
    description: "Patient K–12 math and science support built around each student.",
    image: { src: "/assets/browse/images/educator-elena.jpg", alt: "Elena M." },
  },
  {
    name: "Daniel A.",
    subject: "Academic Tutoring",
    price: 50,
    rating: 4.7,
    description: "Reading, writing, and study skills for elementary and middle grades.",
    image: { src: "/assets/browse/images/educator-daniel.jpg", alt: "Daniel A." },
  },
  {
    name: "Priya S.",
    subject: "College Admissions",
    price: 65,
    rating: 4.9,
    description: "Application guidance, essay feedback, and interview practice.",
    image: { src: "/assets/browse/images/educator-priya.jpg", alt: "Priya S." },
  },
  {
    name: "Marcus T.",
    subject: "Music",
    price: 60,
    rating: 5.0,
    description: "Piano and guitar for beginners through intermediate players.",
    image: { src: "/assets/browse/images/educator-marcus.jpg", alt: "Marcus T." },
  },
  {
    name: "Rosa N.",
    subject: "Cooking & Music",
    price: 54,
    rating: 4.8,
    description: "Home cooking fundamentals and beginner vocals, at your pace.",
    image: { src: "/assets/browse/images/educator-rosa.jpg", alt: "Rosa N." },
  },
  {
    name: "James O.",
    subject: "Cooking",
    price: 58,
    rating: 4.9,
    description: "Knife skills, baking, and family-friendly recipes.",
    image: { src: "/assets/browse/images/educator-james.jpg", alt: "James O." },
  },
  {
    name: "Lena K.",
    subject: "Languages (Spanish & French)",
    price: 52,
    rating: 4.9,
    description: "Conversational Spanish and French for all ages.",
    image: { src: "/assets/browse/images/educator-lena.jpg", alt: "Lena K." },
  },
  {
    name: "Sofia R.",
    subject: "Languages (Hindi & English)",
    price: 48,
    rating: 4.8,
    description: "Hindi and English practice, reading, and pronunciation.",
    image: { src: "/assets/browse/images/educator-sofia.jpg", alt: "Sofia R." },
  },
  {
    name: "Theo W.",
    subject: "Arts & Crafts",
    price: 45,
    rating: 4.8,
    description: "Drawing, painting, and hands-on craft projects.",
    image: { src: "/assets/browse/images/educator-theo.jpg", alt: "Theo W." },
  },
];

/** COPPA band parent-control points. */
export const BROWSE_COPPA_POINTS = [
  {
    title: "Parent creates the account",
    body: "A parent or guardian sets up and owns the account from the start.",
  },
  {
    title: "Parent handles booking",
    body: "Every session is scheduled and confirmed by the adult in charge.",
  },
  {
    title: "Parent stays involved",
    body: "Guardians supervise sessions and stay part of the learning throughout.",
  },
];
