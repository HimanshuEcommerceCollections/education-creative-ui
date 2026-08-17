/** Marketing content for an auth page's dark brand panel. */
export interface AuthPanel {
  eyebrow: string;
  /** Headline lead, followed by the gold-accented `accent` phrase. */
  heading: string;
  accent: string;
  description: string;
  /** Reassurance ticks listed under the description. */
  ticks: string[];
  footnote: string;
  /** Existing on-brand photo shown (faintly) behind the slate wash. */
  image: string;
  imageAlt: string;
}

/*
 * The panel copy promised messaging on both of these. There is no messaging —
 * bookings are requested and paid for, then confirmed by a coordinator — so the
 * ticks name that instead of a feature the account doesn't have.
 */
export const LOGIN_PANEL: AuthPanel = {
  eyebrow: "Welcome back",
  heading: "Welcome back to your",
  accent: "learning journey.",
  description:
    "Sign in to your parent account to request sessions, follow where each booking stands, and pick up right where your family left off.",
  ticks: [
    "Parent-managed bookings, start to finish",
    "Every educator reviewed before listing",
    "In-home & online, across six subjects",
  ],
  footnote: "Your session is private to this device. Sign out anytime.",
  image: "/assets/tutoring/images/feature-study-session.jpg",
  imageAlt: "Students learning together",
};

export const SIGNUP_PANEL: AuthPanel = {
  eyebrow: "Get started",
  heading: "Start your family's",
  accent: "learning journey.",
  description:
    "Create a parent account to browse vetted educators and request sessions — in your home or online, at a rate you see before you pay.",
  ticks: [
    "Free to browse — no subscription",
    "A parent stays in control of every booking",
    "Confirmed within two days, or refunded in full",
  ],
  footnote: "We never create a login for a child, and we never sell your data.",
  image: "/assets/home/images/step-booking-lesson.jpg",
  imageAlt: "A parent and child learning together",
};

/** Optional subjects a new family can flag during sign-up. */
export const SUBJECT_CHIPS = [
  "Academic Tutoring",
  "College Admissions",
  "Music",
  "Languages",
  "Arts & Crafts",
  "Cooking",
] as const;

/*
 * Removed from here deliberately:
 *
 * - `SOCIAL_PROVIDERS` — the sign-in form now lists only Google (disabled until
 *   OAuth ships). Facebook is deferred past launch, so the provider list lives
 *   next to the code that acts on that decision.
 * - `SIGNUP_CONSENT` — the consent wording is now `CURRENT_SIGNUP_CONSENT_TEXT`
 *   in the shared contracts. The API hashes its own copy into every consent
 *   record, so the text shown and the text recorded cannot drift apart.
 */
