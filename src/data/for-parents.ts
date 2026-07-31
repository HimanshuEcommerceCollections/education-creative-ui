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
    body: "For under-18 learners, the parent creates the account, books, messages, and supervises — there’s no separate child login.",
  },
  {
    icon: "dollar",
    title: "Transparent pricing",
    body: "Educators set their own hourly rate, shown up front on every profile. You see the price before you ever book.",
  },
  {
    icon: "star",
    title: "Honest reviews",
    body: "Ratings and notes come from other families — and we never promise grades or outcomes, only vetted, caring support.",
  },
];

/** A booking, from the parent's side — one pane per step. */
export const BOOKING_STEPS: BookingStep[] = [
  {
    label: "Discover",
    hint: "Browse and shortlist educators",
    icon: "search",
    title: "Find educators who fit",
    body: "Filter by subject, format, availability and rate. Open any profile to read their background, approach and reviews from other families.",
    points: [
      "Compare in-home and online options side by side",
      "Save a shortlist to revisit any time",
    ],
  },
  {
    label: "Message",
    hint: "Ask questions, share goals",
    icon: "chat",
    title: "Message before you commit",
    body: "Reach out to talk through your child’s goals, schedule and any needs. Every conversation runs through your parent account — nothing goes directly to a child.",
    points: [
      "Share learning goals and a comfortable pace",
      "Confirm a first session feels right, no pressure",
    ],
  },
  {
    label: "Book & pay",
    hint: "Pick a time, confirm securely",
    icon: "calendar",
    title: "Book a time and confirm",
    body: "Choose a slot that suits your family and confirm securely. The rate you saw on the profile is the rate you pay — no hidden add-ons.",
    points: [
      "Reschedule easily if plans change",
      "See every upcoming session in My Bookings",
    ],
  },
  {
    label: "Session & review",
    hint: "Supervise, then leave feedback",
    icon: "star",
    title: "Stay close, then share feedback",
    body: "You’re present or reachable for every session, in-home or online. Afterwards, leave an honest review to help the next family choose well.",
    points: [
      "A parent supervises throughout — always",
      "Rebook your favourites in a couple of taps",
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
    icon: "chart",
    title: "Ongoing feedback",
    body: "Reviews from families feed back into who stays on the marketplace, so quality holds over time.",
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
