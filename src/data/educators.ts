/**
 * Full educator-profile content for the `/educators/[slug]` route. This is the
 * richer counterpart to the summary cards in `data/tutors.ts` — one entry per
 * educator, keyed by the slug used in their profile href.
 *
 * **No ratings, reviews or review counts, and no fields for them.** The profile
 * page shows all three again, but every one of them comes from
 * `GET /educators/:slug/reviews` — reviews anchored to a completed booking somebody
 * paid for — loaded by `lib/educators/reviews`. A `4.9`, a `38 reviews`, a facet
 * breakdown or a testimonial written *here* would render on the profile as though a
 * parent had given it, which is the one thing a page about a person who teaches
 * children must never do. An educator the API has no rating for shows none.
 */

export type DayState = "open" | "some" | "closed";

export interface AvailabilityDay {
  /** Short day name, e.g. "Mon". */
  name: string;
  /** Pill label, e.g. "PM / Eve" or "—". */
  pill: string;
  state: DayState;
}

export interface EducatorProfile {
  slug: string;
  name: string;
  firstName: string;
  initials: string;
  subject: string;
  location: string;
  formats: string;
  price: number;
  priceUnit: string;
  /** About-section paragraphs. */
  about: string[];
  subjects: string[];
  availability: AvailabilityDay[];
  /** Sidebar "usually available" summary. */
  availabilitySummary: string;
  /** CTA lead paragraph under "Ready to book with …". */
  ctaBody: string;
}

const EDUCATOR_PROFILES: Record<string, EducatorProfile> = {
  elena: {
    slug: "elena",
    name: "Elena M.",
    firstName: "Elena",
    initials: "EM",
    subject: "Academic Tutoring",
    location: "Raleigh, NC",
    formats: "In-home & online",
    price: 55,
    priceUnit: "hour",
    about: [
      "Elena is a former public-school teacher who now tutors K–12 math and science. She builds patient, plan-based sessions around each student's goals and pace, so families always know what a session is working toward.",
      "With 8 years of classroom teaching experience, she focuses on steady practice and clear explanations — helping students build confidence and stronger study habits over time. Sessions are available in-home across Raleigh or online.",
      "Elena teaches in English. Every booking is arranged and supervised by a parent or guardian.",
    ],
    subjects: [
      "Elementary math",
      "Algebra I & II",
      "Geometry",
      "Pre-Calculus",
      "Middle-school science",
      "Study skills",
    ],
    availability: [
      { name: "Mon", pill: "PM", state: "some" },
      { name: "Tue", pill: "—", state: "closed" },
      { name: "Wed", pill: "PM / Eve", state: "open" },
      { name: "Thu", pill: "PM / Eve", state: "open" },
      { name: "Fri", pill: "—", state: "closed" },
      { name: "Sat", pill: "AM", state: "some" },
      { name: "Sun", pill: "—", state: "closed" },
    ],
    availabilitySummary:
      "Mon/Wed/Thu afternoons & early evenings, with some Saturday mornings. In-home across Raleigh or online.",
    /*
     * This copy must not promise that the educator follows up: the parent pays at
     * the time of booking, a coordinator confirms the slot and assigns the educator,
     * and only then does the session reach Elena at all.
     */
    ctaBody:
      "Pick a time and pay to place the request. A coordinator confirms the slot with Elena and emails you within two days — if it can't be filled, you're refunded in full. A parent or guardian arranges and supervises every booking.",
  },
};

export const EDUCATOR_SLUGS = Object.keys(EDUCATOR_PROFILES);

export function getEducator(slug: string): EducatorProfile | undefined {
  return EDUCATOR_PROFILES[slug];
}
