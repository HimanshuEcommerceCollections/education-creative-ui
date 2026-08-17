import type { TrustIconName } from "@/components/how-it-works/how-it-works-icons";
import type { ImageAsset } from "@/types/media";

/** One beat of the scroll-pinned journey rack. */
export interface JourneyStep {
  title: string;
  body: string;
  /** Short caption overlaid on the racked photo. */
  caption: string;
  image: ImageAsset;
}

/** A glassmorphism trust-and-safety card. */
export interface TrustCard {
  icon: TrustIconName;
  title: string;
  body: string;
}

/** An in-home / online session format card. */
export interface SessionFormat {
  tag: string;
  title: string;
  body: string;
  image: ImageAsset;
}

/** Trust badges under the hero copy. */
export const HERO_BADGES: string[] = [
  "Parent-managed booking",
  "Credentials reviewed before listing",
  "In-home & online",
];

/**
 * The three journey steps, browse → request → learn.
 *
 * These steps describe the pay-first model the booking flow implements, and nothing
 * else: the parent pays at the point of request, a coordinator then confirms the slot
 * and assigns the educator, and an unconfirmed booking is refunded in full. There is
 * no messaging anywhere in the product, so nothing here may offer to contact an
 * educator directly or to decide "when it feels right".
 */
export const JOURNEY_STEPS: JourneyStep[] = [
  {
    title: "Browse educators",
    caption: "Browse educators",
    body: "Explore profiles across six subjects — tutoring, admissions guidance, music, languages, arts & crafts, and cooking. Compare experience, format, availability, and the hourly rate you'll pay before you request anything.",
    image: { src: "/assets/how-it-works/images/journey-browse.jpg", alt: "A student browsing on a laptop" },
  },
  {
    title: "Request & pay",
    caption: "Request & pay",
    body: "Choose your educator, a time, and a format, add your child's details, and pay securely. That places the request — a coordinator then confirms the slot with the educator and emails you within two days, or refunds you in full if it can't be filled.",
    image: { src: "/assets/how-it-works/images/journey-connect.jpg", alt: "Two people finalizing a booking agreement" },
  },
  {
    title: "Learn & grow",
    caption: "Learn & grow",
    body: "Sessions run in your home or online, at the time your coordinator confirmed. A parent or guardian is present or reachable throughout, and every booking, price, and refund stays visible in My Bookings.",
    image: { src: "/assets/how-it-works/images/journey-learn.jpg", alt: "A parent helping their child with schoolwork" },
  },
];

/** The four trust-and-safety cards. */
export const TRUST_CARDS: TrustCard[] = [
  {
    icon: "shield-check",
    title: "Credential Review",
    body: "Every independent educator submits credentials and professional references, reviewed before their profile is ever listed.",
  },
  {
    /*
     * Was "Verified Ratings — reviews come only from parents who've completed a
     * session". Reviews do exist now and are anchored to a completed booking, but a
     * three-tile strip explaining how booking works is not where that belongs. The
     * coordinator confirmation step below is the one a parent most needs explained,
     * because it is why paying does not instantly book a time.
     */
    icon: "star",
    title: "A Person Confirms Every Booking",
    body: "Nothing is auto-assigned. A coordinator reaches the educator, confirms the time, and emails you — and if that can’t happen within two days, your payment is refunded in full automatically.",
  },
  {
    icon: "users",
    title: "Parent-Managed Bookings",
    body: "Parents create the account, request the sessions, and manage every booking — there’s no separate child-facing login.",
  },
  {
    icon: "document",
    title: "A Record You Can Revisit",
    body: "Every request, the price you paid, who was assigned, and any refund stays in My Bookings, so there’s always a record to look back on.",
  },
];

/** In-home and online session formats. */
export const SESSION_FORMATS: SessionFormat[] = [
  {
    tag: "In-Home",
    title: "Your space, your pace",
    body: "Educators come to your home at a time that suits your family. You choose the room, set the pace, and stay close by throughout.",
    image: { src: "/assets/how-it-works/images/format-in-home.jpg", alt: "A tutor explaining a lesson to a student in person" },
  },
  {
    tag: "Online",
    title: "Face-to-face, from anywhere",
    body: "Live video sessions with the same educators and subjects — just over a call, with the same materials guidance included.",
    image: { src: "/assets/how-it-works/images/format-online.jpg", alt: "A parent and child on a video call lesson" },
  },
];
