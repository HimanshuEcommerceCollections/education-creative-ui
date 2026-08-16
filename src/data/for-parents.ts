import type { ParentIconName } from "@/components/for-parents/for-parents-icons";
import type { ImageAsset } from "@/types/media";

/** A gold-check badge under the hero copy. */
export interface ParentHeroBadge {
  icon: ParentIconName;
  label: string;
}

/** One "peace of mind" promise card. */
export interface ParentPillar {
  icon: ParentIconName;
  title: string;
  body: string;
}

/** One beat of the scroll-pinned booking stepper. */
export interface BookingStep {
  /** Short label on the rail, e.g. "Discover". */
  label: string;
  /** Sub-label under the rail label. */
  hint: string;
  icon: ParentIconName;
  title: string;
  body: string;
  /** Checked reassurances listed under the body copy. */
  points: string[];
}

/** One stage of the educator vetting process. */
export interface VettingItem {
  icon: ParentIconName;
  title: string;
  body: string;
}

export const PARENT_HERO_IMAGE: ImageAsset = {
  src: "/assets/for-parents/images/hero.jpg",
  alt: "A parent and children learning together at home with an educator",
};

export const PARENT_HERO_BADGES: ParentHeroBadge[] = [
  { icon: "shield-check", label: "Vetted, independent educators" },
  { icon: "dollar", label: "Transparent hourly rates" },
  { icon: "shield", label: "Parent-controlled bookings" },
];

/** The four promises held to on every booking. */
export const PARENT_PILLARS: ParentPillar[] = [
  {
    icon: "shield-check",
    title: "Vetted educators",
    body: "Every educator goes through an identity and background-informed review, an interview, and reference checks before joining.",
  },
  {
    icon: "document-check",
    title: "You stay in control",
    body: "For under-18 learners, the parent creates the account, requests the sessions, and supervises — there’s no separate child login.",
  },
  {
    icon: "dollar",
    title: "Transparent pricing",
    body: "Educators set their own hourly rate, shown up front on every profile. You see the full price, including any in-home travel charge, before you pay.",
  },
  {
    /*
     * The star icon belongs to a promise, not a rating: nothing in the product
     * collects a review. What the platform does promise is the refund guarantee
     * behind pay-first booking, which is a commitment rather than a claim.
     */
    icon: "star",
    title: "Confirmed, or refunded",
    body: "You pay when you request a session, and a coordinator confirms it with the educator. If it can’t be confirmed within two days, you’re refunded in full — and we never promise grades or outcomes, only vetted, caring support.",
  },
];

/**
 * A booking, from the parent's side — one pane per step.
 *
 * The panes track the real sequence and nothing else: discover → request and pay →
 * a coordinator confirms → session. There is no messaging stage before committing,
 * no shortlist, no self-service reschedule, and no review afterwards, so no pane may
 * describe one.
 */
export const BOOKING_STEPS: BookingStep[] = [
  {
    label: "Discover",
    hint: "Browse educators by subject",
    icon: "search",
    title: "Find educators who fit",
    body: "Filter by subject, format, availability and rate. Open a profile to read their background, the subjects they teach, and how they approach a session.",
    points: [
      "Compare in-home and online options side by side",
      "See each educator’s hourly rate before you go further",
    ],
  },
  {
    label: "Request & pay",
    hint: "Choose a time, pay securely",
    icon: "calendar",
    title: "Request a session and pay",
    body: "Pick your educator, a date and time, and the format, then add your child’s first name and age band. Paying places the request — the rate you saw on the profile is the rate you pay, with any in-home travel charge itemised before you confirm.",
    points: [
      "Offer a second time, or say any of their open times will do",
      "Nothing about your child is stored until you consent on that step",
    ],
  },
  {
    label: "Confirmation",
    hint: "A coordinator sets it up",
    icon: "chat",
    title: "We confirm it with the educator",
    body: "A coordinator contacts the educator, confirms the time, and emails you — usually well inside two days. If nobody can take it, or the time can’t work, the booking is refunded in full and we tell you why.",
    points: [
      "You’re told who is actually teaching, even if it’s a substitute",
      "Cancel at least 24 hours ahead for a full refund",
    ],
  },
  {
    label: "The session",
    hint: "Supervise, and follow it up",
    icon: "star",
    title: "Stay close throughout",
    body: "You’re present or reachable for every session, in-home or online. Afterwards it’s marked delivered, and the price, the educator, and any refund stay on the record in My Bookings.",
    points: [
      "A parent supervises throughout — always",
      "Request the same educator again whenever you’re ready",
    ],
  },
];

export const VETTING_IMAGE: ImageAsset = {
  src: "/assets/for-parents/images/vetting.jpg",
  alt: "An educator preparing a lesson",
};

/** How an educator earns a place on the marketplace. */
export const VETTING_ITEMS: VettingItem[] = [
  {
    icon: "shield",
    title: "Identity & background-informed review",
    body: "We confirm who each educator is and review their history before they can appear on the marketplace.",
  },
  {
    icon: "user",
    title: "A real interview",
    body: "We talk with every applicant about their experience, teaching style and how they work with young learners.",
  },
  {
    icon: "document-check",
    title: "References checked",
    body: "We follow up on references so families aren’t the first to learn how someone actually works.",
  },
  {
    /*
     * Was "Ongoing feedback — reviews from families feed back into who stays on
     * the marketplace". There are no reviews. There *is* a coordinator working
     * every booking, which is where a problem with an educator actually surfaces
     * today.
     */
    icon: "chart",
    title: "A coordinator on every booking",
    body: "A person confirms each session and hears about it when one goes wrong — and an educator can be suspended from assignment on the strength of that, without waiting on a scoring system.",
  },
];

/**
 * The FAQ rows shown on this page, as ids into FAQ_ITEMS — the accordion and
 * its copy stay single-sourced with the FAQ page rather than duplicated here.
 */
export const PARENT_FAQ_IDS: string[] = [
  "who-books-for-a-child",
  "parent-present-during-sessions",
  "educator-vetting",
  "how-pricing-works",
  "reschedule-or-cancel",
];
