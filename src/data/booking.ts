import {
  LEARNER_AGE_BANDS,
  SESSION_DURATIONS,
  type BookingFormat,
  type LearnerAgeBand,
  type SessionDuration,
} from "@contracts/bookings.ts";

import { EDUCATORS, type Educator } from "./browse";

/**
 * One weekly availability window: the slot start times this educator offers on a
 * given weekday. `day` matches `Date#getDay()` — 0 is Sunday.
 *
 * Times are civil `HH:MM` in `BOOKING_TIMEZONE`, which is what makes them safe
 * to compare and display without ever constructing a UTC instant.
 *
 * This is the in-repo stand-in for the API's `availability_rules` rows. It is
 * deliberately a *pattern*, not a calendar: nothing here is reserved, and at
 * launch the coordinator is the conflict check (materialised slots and the
 * overlap constraint are a deferred fast-follow, ARCHITECTURE.md §6). The UI must
 * therefore never call one of these a confirmed appointment.
 */
export interface AvailabilityWindow {
  day: number;
  times: readonly string[];
}

/**
 * One thing an educator teaches.
 *
 * `label` is the fine-grained topic a parent picks ("Piano"); `category` is the
 * platform subject slug it prices against ("music"). The split is §7's: rates and
 * bands hang off the six categories, while the topics an educator actually
 * teaches stay free text on their profile.
 *
 * Keeping both on every topic is what lets Rosa's "Baking" price as cooking and
 * her "Music theory" price as music, from the same card.
 */
export interface BookingTopic {
  label: string;
  category: string;
}

/** An educator as the booking flow needs them: card data plus what's bookable. */
export interface BookingEducator extends Educator {
  /** Specific things this educator teaches — the step-2 subject choice. */
  subjects: readonly BookingTopic[];
  /** Formats they offer. Drives which format options are selectable. */
  formats: readonly BookingFormat[];
  availability: readonly AvailabilityWindow[];
}

/**
 * Booking-specific facts, keyed by the educator's slug. Kept apart from
 * `browse.ts` so the marketing grid isn't carrying scheduling data it never
 * renders, and joined below into one record the flow can use.
 *
 * Elena's pattern is the same one her profile page already advertises
 * (`data/educators.ts` — Mon afternoons, Wed/Thu afternoons and evenings, some
 * Saturday mornings), so the two surfaces can't tell a parent different things.
 */
const BOOKING_DETAILS: Record<
  string,
  Pick<BookingEducator, "subjects" | "formats" | "availability">
> = {
  elena: {
    subjects: [
      { label: "Elementary math", category: "tutoring" },
      { label: "Algebra I & II", category: "tutoring" },
      { label: "Geometry", category: "tutoring" },
      { label: "Pre-Calculus", category: "tutoring" },
      { label: "Middle-school science", category: "tutoring" },
      { label: "Study skills", category: "tutoring" },
    ],
    formats: ["in_home", "online"],
    availability: [
      { day: 1, times: ["16:00", "17:30"] },
      { day: 3, times: ["13:00", "14:30", "16:00", "17:30", "19:00"] },
      { day: 4, times: ["13:00", "14:30", "16:00", "17:30", "19:00"] },
      { day: 6, times: ["09:00", "10:30"] },
    ],
  },
  daniel: {
    subjects: [
      { label: "Reading comprehension", category: "tutoring" },
      { label: "Writing & grammar", category: "tutoring" },
      { label: "Elementary math", category: "tutoring" },
      { label: "Study skills", category: "tutoring" },
    ],
    formats: ["in_home", "online"],
    availability: [
      { day: 2, times: ["15:30", "17:00"] },
      { day: 3, times: ["15:30", "17:00"] },
      { day: 5, times: ["13:00", "14:30", "16:00"] },
      { day: 6, times: ["09:00", "10:30", "12:00"] },
    ],
  },
  priya: {
    subjects: [
      { label: "Application strategy", category: "college-admissions" },
      { label: "Personal essay", category: "college-admissions" },
      { label: "Interview practice", category: "college-admissions" },
      { label: "Scholarship applications", category: "college-admissions" },
    ],
    formats: ["in_home", "online"],
    availability: [
      { day: 1, times: ["17:30", "19:00"] },
      { day: 2, times: ["17:30", "19:00"] },
      { day: 4, times: ["17:30", "19:00"] },
      { day: 0, times: ["14:00", "15:30"] },
    ],
  },
  marcus: {
    subjects: [
      { label: "Piano", category: "music" },
      { label: "Guitar", category: "music" },
      { label: "Music theory", category: "music" },
      { label: "Beginner vocals", category: "music" },
    ],
    formats: ["in_home", "online"],
    availability: [
      { day: 1, times: ["15:00", "16:30", "18:00"] },
      { day: 2, times: ["15:00", "16:30", "18:00"] },
      { day: 4, times: ["15:00", "16:30", "18:00"] },
      { day: 6, times: ["10:00", "11:30"] },
    ],
  },
  rosa: {
    subjects: [
      { label: "Home cooking basics", category: "cooking" },
      { label: "Baking", category: "cooking" },
      { label: "Beginner vocals", category: "music" },
      { label: "Music theory", category: "music" },
    ],
    formats: ["in_home", "online"],
    availability: [
      { day: 3, times: ["16:00", "17:30"] },
      { day: 5, times: ["16:00", "17:30"] },
      { day: 6, times: ["10:00", "11:30", "14:00"] },
      { day: 0, times: ["11:00", "14:00"] },
    ],
  },
  james: {
    subjects: [
      { label: "Knife skills", category: "cooking" },
      { label: "Baking & pastry", category: "cooking" },
      { label: "Family meal planning", category: "cooking" },
      { label: "Food safety", category: "cooking" },
    ],
    formats: ["in_home", "online"],
    availability: [
      { day: 2, times: ["16:30", "18:00"] },
      { day: 4, times: ["16:30", "18:00"] },
      { day: 6, times: ["09:30", "11:00", "14:00"] },
      { day: 0, times: ["11:00"] },
    ],
  },
  lena: {
    subjects: [
      { label: "Spanish conversation", category: "languages" },
      { label: "Spanish grammar", category: "languages" },
      { label: "French conversation", category: "languages" },
      { label: "French grammar", category: "languages" },
    ],
    formats: ["in_home", "online"],
    availability: [
      { day: 1, times: ["14:00", "15:30", "17:00"] },
      { day: 3, times: ["14:00", "15:30", "17:00"] },
      { day: 5, times: ["14:00", "15:30"] },
      { day: 6, times: ["10:00"] },
    ],
  },
  sofia: {
    subjects: [
      { label: "Hindi conversation", category: "languages" },
      { label: "Hindi reading & writing", category: "languages" },
      { label: "English conversation", category: "languages" },
      { label: "English pronunciation", category: "languages" },
    ],
    formats: ["in_home", "online"],
    availability: [
      { day: 2, times: ["14:00", "15:30", "17:00"] },
      { day: 4, times: ["14:00", "15:30", "17:00"] },
      { day: 5, times: ["17:00", "18:30"] },
      { day: 0, times: ["10:00", "11:30"] },
    ],
  },
  theo: {
    subjects: [
      { label: "Drawing", category: "arts-crafts" },
      { label: "Painting", category: "arts-crafts" },
      { label: "Printmaking", category: "arts-crafts" },
      { label: "Craft projects", category: "arts-crafts" },
    ],
    formats: ["in_home", "online"],
    availability: [
      { day: 1, times: ["15:30"] },
      { day: 3, times: ["15:30", "17:00"] },
      { day: 6, times: ["09:30", "11:00", "13:30"] },
      { day: 0, times: ["13:30", "15:00"] },
    ],
  },
};

/**
 * The bookable educators, in the same order the browse grid lists them. Built by
 * joining rather than duplicated, so a rate or photo change in `browse.ts` can't
 * leave the booking page quoting last month's price.
 */
export const BOOKING_EDUCATORS: readonly BookingEducator[] = EDUCATORS.map(
  (educator) => {
    const details = BOOKING_DETAILS[educator.slug];
    if (!details) {
      // A new educator in browse.ts with no booking details would otherwise
      // render an unbookable card with an empty calendar. Fail at import.
      throw new Error(
        `data/booking.ts: no booking details for educator "${educator.slug}". ` +
          "Add subjects, formats and availability to BOOKING_DETAILS.",
      );
    }
    return { ...educator, ...details };
  },
);

export function getBookingEducator(
  slug: string,
  roster: readonly BookingEducator[] = BOOKING_EDUCATORS,
): BookingEducator | undefined {
  return roster.find((educator) => educator.slug === slug);
}

/**
 * Narrows the in-repo roster to what the server will actually accept.
 *
 * The list above is a stand-in, and the API is the authority: it 404s an educator
 * slug it has never heard of, refuses a subject with no rate band, and matches
 * `subjectTopic` against `educator_profiles.subjects` by exact string. Offering a
 * card the API will refuse means the parent finds out at the *final* submit —
 * after the child's name, the address and both consents.
 *
 * The pricing snapshot is the only public read that names server-side truth, so
 * that is what this filters on:
 *
 * - **Topics** are kept only when their priced category has a band in force. A
 *   topic whose category is missing cannot be quoted at all.
 * - **Educators** are kept only when the snapshot holds at least one rate for
 *   them, which is the one signal we have that the slug exists server-side.
 *
 * Both inputs empty means the snapshot fetch failed, and then the local list is
 * returned whole — a booking page must degrade to yesterday's roster, never to an
 * empty one. Same if the filter would leave nothing: a half-seeded pricing table
 * is a reason to show the local list, not to tell a parent nobody teaches here.
 *
 * What this cannot check is the topic *labels*, which live on
 * `educator_profiles.subjects` and have no public endpoint. The quote probe in the
 * booking flow covers that: it runs the API's own `assertTeachesTopic` at step 2,
 * so a label drift surfaces there instead of at the end.
 */
export function bookableEducators({
  pricedSubjects,
  ratedEducatorSlugs,
  roster = BOOKING_EDUCATORS,
}: {
  pricedSubjects: readonly string[];
  ratedEducatorSlugs: readonly string[];
  roster?: readonly BookingEducator[];
}): readonly BookingEducator[] {
  if (pricedSubjects.length === 0 || ratedEducatorSlugs.length === 0) return roster;

  const priced = new Set(pricedSubjects);
  const rated = new Set(ratedEducatorSlugs);

  const narrowed = roster
    .filter((educator) => rated.has(educator.slug))
    .map((educator) => ({
      ...educator,
      subjects: educator.subjects.filter((topic) => priced.has(topic.category)),
    }))
    .filter((educator) => educator.subjects.length > 0);

  return narrowed.length > 0 ? narrowed : roster;
}

/** Session length choices, in the contract's allowed set. */
export const SESSION_LENGTH_OPTIONS: readonly {
  minutes: SessionDuration;
  label: string;
}[] = SESSION_DURATIONS.map((minutes) => ({ minutes, label: `${minutes} min` }));

/** Age band choices, labelled for the select. */
export const AGE_BAND_OPTIONS: readonly { value: LearnerAgeBand; label: string }[] =
  LEARNER_AGE_BANDS.map((value) => ({ value, label: `${value} years` }));

export const FORMAT_LABELS: Record<BookingFormat, string> = {
  in_home: "In-home",
  online: "Online",
};

export const FORMAT_BLURBS: Record<BookingFormat, string> = {
  in_home: "The educator comes to you",
  online: "Live video session",
};

/**
 * Pricing configuration, mirroring the shape of the API's `config_settings`
 * namespace so the client estimate is computed the same way the server computes
 * the real charge (ARCHITECTURE.md §7: `in_home = base × multiplier + travel`).
 *
 * **The differential is off.** `inHomeMultiplier: 1` and `travelFlatCents: 0`
 * mean an in-home session currently costs the same as an online one — the engine
 * supports charging more, but what to charge is a founder decision that hasn't
 * been made. Setting real values here is a one-line change and the breakdown
 * lines appear on their own.
 *
 * Whatever these say, the browser's number is an **estimate**. The authoritative
 * amount comes from `POST /quotes` and nothing here is ever sent to the API.
 */
export const BOOKING_PRICING = {
  currency: "USD",
  inHomeMultiplier: 1,
  travelFlatCents: 0,
} as const;

/**
 * The booking rules the flow greys out slots and prints promises against.
 *
 * **These are not constants any more.** They live in site configuration
 * (`booking.*`), and the booking page reads them from the public snapshot and
 * passes them down as `rules`. The API enforces the same figures on every
 * request, so a Server Action can't be talked past a rule the calendar shows.
 *
 * The values below are the fallback used when the API can't be reached — the
 * same numbers the server's registry ships as its defaults, so an unreachable
 * API leaves the flow behaving exactly as it did before the store existed.
 */
export interface BookingRules {
  /**
   * How far ahead the calendar opens, in whole months. Two matches the source
   * design and is about as far out as a suggested time stays meaningful.
   */
  windowMonths: number;
  /**
   * Minimum notice on a requested slot. A coordinator has to read the request,
   * check the educator is free, and confirm — a session starting in three hours
   * can't survive that, so it isn't offered.
   */
  minNoticeHours: number;
  /**
   * The confirmation SLA the refund promise is built on: if no coordinator has
   * confirmed within this many days, the booking auto-refunds in full
   * (ARCHITECTURE.md §8). The parent is told this number *before* paying, which
   * is why it has to be the live one and not a build-time copy.
   */
  confirmationSlaDays: number;
}

export const DEFAULT_BOOKING_RULES: BookingRules = {
  windowMonths: 2,
  minNoticeHours: 24,
  confirmationSlaDays: 2,
};

/**
 * Whether card payment is available is **not** a constant.
 *
 * It is `Boolean(process.env.STRIPE_PUBLISHABLE_KEY)`, read on the server and
 * passed into the flow as a prop — see `app/(site)/book/page.tsx`. A deployment
 * without Stripe configured shows the flow with the pay button disabled and an
 * explanation; one with it configured takes payments. That is config, not a code
 * change, and it can't drift out of step with the API's own Stripe config the way
 * a hardcoded boolean did.
 */

