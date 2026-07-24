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

/** The three journey steps, browse → connect → learn. */
export const JOURNEY_STEPS: JourneyStep[] = [
  {
    title: "Browse educators",
    caption: "Browse educators",
    body: "Explore profiles across six subjects — tutoring, admissions guidance, music, languages, arts & crafts, and cooking. Compare experience, availability, and ratings from other families before you reach out.",
    image: { src: "/assets/how-it-works/images/journey-browse.jpg", alt: "A student browsing on a laptop" },
  },
  {
    title: "Connect & book",
    caption: "Connect & book",
    body: "Message an educator directly from your parent account to talk through goals, schedule, and format. When it feels right, confirm a booking — no pressure, no obligation.",
    image: { src: "/assets/how-it-works/images/journey-connect.jpg", alt: "Two people finalizing a booking agreement" },
  },
  {
    title: "Learn & grow",
    caption: "Learn & grow",
    body: "Sessions run in your home or online, at times that work for your family. You’re looped in throughout, with an educator to message any time plans need to change.",
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
    icon: "star",
    title: "Verified Ratings",
    body: "Reviews come only from parents who’ve completed a session, so what you read reflects real experience.",
  },
  {
    icon: "users",
    title: "Parent-Managed Contact",
    body: "Parents create the account, message educators, and manage every booking — there’s no separate child-facing login.",
  },
  {
    icon: "document",
    title: "A Record You Can Revisit",
    body: "Messaging and scheduling stay on the platform, so there’s always a record to look back on.",
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
