/**
 * Full educator-profile content for the `/educators/[slug]` route. This is the
 * richer counterpart to the summary cards in `data/tutors.ts` — one entry per
 * educator, keyed by the slug used in their profile href.
 */

export interface EducatorReview {
  /** Avatar initial (single letter). */
  initial: string;
  /** Reviewer role, e.g. "Parent of a 9th grader". */
  role: string;
  /** Star rating shown on the review. */
  rating: number;
  /** Review body. */
  body: string;
}

export interface RatingFacet {
  label: string;
  /** Displayed value, e.g. "4.9 / 5". */
  value: string;
  /** Bar fill as a percentage (0–100). */
  percent: number;
}

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
  /** Displayed rating string, e.g. "4.9". */
  rating: string;
  /** Numeric rating for the star row. */
  ratingValue: number;
  reviewCount: number;
  location: string;
  formats: string;
  price: number;
  priceUnit: string;
  /** About-section paragraphs. */
  about: string[];
  subjects: string[];
  reviews: EducatorReview[];
  ratingBreakdown: RatingFacet[];
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
    rating: "4.9",
    ratingValue: 4.9,
    reviewCount: 38,
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
    reviews: [
      {
        initial: "P",
        role: "Parent of a 9th grader",
        rating: 5,
        body: "Elena is calm and organized. She sends a quick plan before each session so we know what she'll cover, and my son actually looks forward to Algebra now. No pressure — just steady practice.",
      },
      {
        initial: "P",
        role: "Parent of a 6th grader",
        rating: 5,
        body: "We booked her for middle-school science help. She's patient and explains things a few different ways until it clicks. I appreciate that she's honest about what needs more practice at home.",
      },
      {
        initial: "P",
        role: "Parent of an 11th grader",
        rating: 5,
        body: "Reliable and easy to schedule with. Online sessions for Pre-Calc worked well for us. She keeps things focused and we always sat in on the first few — felt very comfortable.",
      },
      {
        initial: "P",
        role: "Parent of a 4th grader",
        rating: 4,
        body: "Great with younger kids. My daughter was nervous about math and Elena made it feel low-stakes. Scheduling around her Saturday mornings took a little planning, but well worth it.",
      },
    ],
    ratingBreakdown: [
      { label: "Communication", value: "4.9 / 5", percent: 98 },
      { label: "Knowledge", value: "5.0 / 5", percent: 100 },
      { label: "Punctuality", value: "4.8 / 5", percent: 96 },
      { label: "Patience", value: "4.9 / 5", percent: 98 },
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
    ctaBody:
      "Send a booking request and Elena will follow up to confirm times, format and a simple plan for the first session. A parent or guardian arranges and supervises every booking.",
  },
};

export const EDUCATOR_SLUGS = Object.keys(EDUCATOR_PROFILES);

export function getEducator(slug: string): EducatorProfile | undefined {
  return EDUCATOR_PROFILES[slug];
}
