import type { ImageAsset } from "@/types/media";

/** A subject filter chip. `value` is matched as a substring of an educator's
 * subject (lowercased); `"all"` shows everyone. */
export interface BrowseFilter {
  label: string;
  value: string;
}

/** One educator card in the browse grid. */
export interface Educator {
  /**
   * Stable identifier for this person, matching their `/educators/[slug]` route
   * and the `?educator=` parameter the booking flow prefills from. The seed plan
   * (ARCHITECTURE.md §6) reconciles `browse.ts`, `tutors.ts` and `educators.ts`
   * into one row per educator keyed on exactly this value.
   */
  slug: string;
  name: string;
  subject: string;
  /** Hourly rate in USD. */
  price: number;
  description: string;
  image: ImageAsset;
  /**
   * This educator's own profile page, or `null` when one hasn't been authored.
   *
   * Not derived, and never shared between cards. One `PROFILE_HREF` reused across
   * the grid means a parent clicking **Marcus T. (Music)** reads an
   * academic-tutoring profile whose CTA then pre-fills `?educator=elena` — the
   * booking flow silently swaps who they are paying. A card without a profile
   * links to the booking flow for *itself* instead; nothing here may ever point
   * at a different person's page.
   */
  profileHref: string | null;
}

/**
 * Sort options for the grid.
 *
 * `rating` sorts on the API's published averages, which are joined onto these
 * rows by slug at render — no rating is stored in this file and none may be. The
 * grid only offers the option when the API actually returned a rating for
 * somebody; otherwise it would be an order with nothing behind it.
 */
export type BrowseSort = "rating" | "name" | "priceLow" | "priceHigh";

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
    slug: "elena",
    name: "Elena M.",
    subject: "Academic Tutoring",
    price: 55,
    description: "Patient K–12 math and science support built around each student.",
    image: { src: "/assets/browse/images/educator-elena.jpg", alt: "Elena M." },
    profileHref: "/educators/elena",
  },
  {
    slug: "daniel",
    name: "Daniel A.",
    subject: "Academic Tutoring",
    price: 50,
    description: "Reading, writing, and study skills for elementary and middle grades.",
    image: { src: "/assets/browse/images/educator-daniel.jpg", alt: "Daniel A." },
    profileHref: null,
  },
  {
    slug: "priya",
    name: "Priya S.",
    subject: "College Admissions",
    price: 65,
    description: "Application guidance, essay feedback, and interview practice.",
    image: { src: "/assets/browse/images/educator-priya.jpg", alt: "Priya S." },
    profileHref: null,
  },
  {
    slug: "marcus",
    name: "Marcus T.",
    subject: "Music",
    price: 60,
    description: "Piano and guitar for beginners through intermediate players.",
    image: { src: "/assets/browse/images/educator-marcus.jpg", alt: "Marcus T." },
    profileHref: null,
  },
  {
    slug: "rosa",
    name: "Rosa N.",
    subject: "Cooking & Music",
    price: 54,
    description: "Home cooking fundamentals and beginner vocals, at your pace.",
    image: { src: "/assets/browse/images/educator-rosa.jpg", alt: "Rosa N." },
    profileHref: null,
  },
  {
    slug: "james",
    name: "James O.",
    subject: "Cooking",
    price: 58,
    description: "Knife skills, baking, and family-friendly recipes.",
    image: { src: "/assets/browse/images/educator-james.jpg", alt: "James O." },
    profileHref: null,
  },
  {
    slug: "lena",
    name: "Lena K.",
    subject: "Languages (Spanish & French)",
    price: 52,
    description: "Conversational Spanish and French for all ages.",
    image: { src: "/assets/browse/images/educator-lena.jpg", alt: "Lena K." },
    profileHref: null,
  },
  {
    slug: "sofia",
    name: "Sofia R.",
    subject: "Languages (Hindi & English)",
    price: 48,
    description: "Hindi and English practice, reading, and pronunciation.",
    image: { src: "/assets/browse/images/educator-sofia.jpg", alt: "Sofia R." },
    profileHref: null,
  },
  {
    slug: "theo",
    name: "Theo W.",
    subject: "Arts & Crafts",
    price: 45,
    description: "Drawing, painting, and hands-on craft projects.",
    image: { src: "/assets/browse/images/educator-theo.jpg", alt: "Theo W." },
    profileHref: null,
  },
];
