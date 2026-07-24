import type { SocialIconName } from "@/components/auth/auth-icons";

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

export const LOGIN_PANEL: AuthPanel = {
  eyebrow: "Welcome back",
  heading: "Welcome back to your",
  accent: "learning journey.",
  description:
    "Sign in to your parent account to message educators, manage bookings, and pick up right where your family left off.",
  ticks: [
    "Parent-managed booking & messaging",
    "Every educator reviewed before listing",
    "In-home & online, across six subjects",
  ],
  footnote: "Demo — no real account is created and no data is stored.",
  image: "/assets/tutoring/images/feature-study-session.jpg",
  imageAlt: "Students learning together",
};

export const SIGNUP_PANEL: AuthPanel = {
  eyebrow: "Get started",
  heading: "Start your family's",
  accent: "learning journey.",
  description:
    "Create a parent account to browse vetted educators, message the ones who fit, and book sessions — in your home or online.",
  ticks: [
    "Free to browse — no subscription",
    "A parent stays in control of every booking",
    "Six subjects, all vetted educators",
  ],
  footnote: "Demo — no real account is created and no data is stored.",
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

/** One "continue with" social provider on the sign-in form. */
export interface SocialProvider {
  label: string;
  icon: SocialIconName;
}

export const SOCIAL_PROVIDERS: SocialProvider[] = [
  { label: "Google", icon: "google" },
  { label: "Facebook", icon: "facebook" },
];

/** Guardian consent copy on the sign-up form. */
export const SIGNUP_CONSENT =
  "I'm a parent or guardian creating this account for my family, and I'll book and supervise every session.";
