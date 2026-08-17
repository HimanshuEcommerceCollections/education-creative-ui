import type { ImageAsset } from "@/types/media";

/** Icon keys shared by the About values and trust-recap cards. */
export type AboutIconName =
  | "shield"
  | "user"
  | "lines"
  | "pin"
  | "record"
  | "star"
  | "chat";

/** One card in the 3D values coverflow. */
export interface AboutValue {
  icon: AboutIconName;
  title: string;
  body: string;
  /** Two-digit index shown in the card corner ("01"…). */
  num: string;
}

/** A single figure in the "snapshot" counter grid. */
export interface SnapshotStat {
  /** Numeric stats count up from zero; text stats render as-is. */
  count?: number;
  text?: string;
  suffix?: string;
  label: string;
  /** Slightly smaller display size for the text ("Raleigh") tile. */
  small?: boolean;
}

/** A trust-recap card. */
export interface AboutTrustCard {
  icon: AboutIconName;
  title: string;
  body: string;
}

/** Background media for the About page's photo-backed sections. */
export const ABOUT_MEDIA = {
  heroVideo: "/assets/about/videos/hero.mp4",
  heroPoster: "/assets/about/images/hero-poster.jpg",
  valuesBg: { src: "/assets/about/images/values-bg.jpg", alt: "" } satisfies ImageAsset,
  trustBg: { src: "/assets/about/images/trust-bg.jpg", alt: "" } satisfies ImageAsset,
  coppaBg: { src: "/assets/about/images/coppa-bg.jpg", alt: "" } satisfies ImageAsset,
  ctaBg: { src: "/assets/about/images/cta-bg.jpg", alt: "" } satisfies ImageAsset,
} as const;

/** The five principles in the coverflow. */
export const ABOUT_VALUES: AboutValue[] = [
  {
    icon: "shield",
    title: "Vetted, always",
    body: "Every educator’s credentials are reviewed before their profile is listed on the marketplace.",
    num: "01",
  },
  {
    icon: "user",
    title: "Parents in control",
    body: "Parents manage booking and supervision. You decide who, when, and how sessions happen.",
    num: "02",
  },
  {
    icon: "lines",
    title: "Honest by default",
    body: "We describe the support an educator offers — we never promise outcomes or results.",
    num: "03",
  },
  {
    icon: "pin",
    title: "Local & personal",
    body: "Built for Raleigh families, with educators available in your home or online.",
    num: "04",
  },
  {
    icon: "record",
    title: "A record you can revisit",
    body: "Every booking, payment, and refund is recorded in your account, so there’s always a record to look back on.",
    num: "05",
  },
];

/** The four snapshot figures — illustrative demo numbers, not claims. */
export const ABOUT_SNAPSHOT: SnapshotStat[] = [
  {
    count: 6,
    label: "Subjects covered — math, reading, writing, science, music, and art.",
  },
  {
    count: 9,
    label: "Educators on the current demo roster.",
  },
  {
    count: 2,
    suffix: "ways",
    label: "Every session runs in-home or online — your choice.",
  },
  {
    text: "Raleigh",
    suffix: ", NC",
    small: true,
    label: "Where we’re based and the families we serve.",
  },
];

/** The four trust-recap cards. */
export const ABOUT_TRUST_CARDS: AboutTrustCard[] = [
  {
    icon: "shield",
    title: "Credential Review",
    body: "We check an educator’s background and credentials before their profile goes live.",
  },
  {
    /*
     * The star card carries the refund promise, not a ratings claim: nothing in the
     * product collects a review, so a "verified ratings" card would describe a
     * verification system that does not exist. How It Works and For Parents carry the
     * same promise in the same slot, and the three have to stay in step.
     */
    icon: "star",
    title: "Confirmed, or Refunded",
    body: "You pay when you request a session and a coordinator confirms it with the educator — if that can’t happen within two days, you’re refunded in full, automatically.",
  },
  {
    icon: "chat",
    title: "Parent-Managed Contact",
    body: "Parents create the account and manage all contact with an educator on behalf of learners.",
  },
  {
    icon: "record",
    title: "A Record You Can Revisit",
    body: "Bookings, payments, and refunds are all recorded in your account, giving you a history you can return to anytime.",
  },
];
