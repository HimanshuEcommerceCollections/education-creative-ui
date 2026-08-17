import type {
  OfferItem,
  SubjectStat,
} from "@/types/subject-page";

/** Craft-strip ticker labels for the Arts & Crafts subject page. */
export const ARTS_MARQUEE: readonly string[] = [
  "Painting",
  "Clay & Pottery",
  "Origami",
  "Collage",
  "Knitting",
  "Sketching",
];

/** "Three ways in" offer cards. */
export const ARTS_OFFERS: OfferItem[] = [
  {
    id: "drawing",
    icon: "brush",
    title: "Drawing & Painting",
    description:
      "Watercolour, acrylic, and sketchbook habits — from first still-life to a style of your own.",
    image: {
      src: "/assets/arts/images/offer-drawing.jpg",
      alt: "A child choosing paintbrushes",
    },
  },
  {
    id: "clay",
    icon: "vase",
    title: "Clay & Pottery",
    description:
      "Pinch pots to wheel work — muddy hands, careful glazes, and pieces you'll actually use.",
    image: {
      src: "/assets/arts/images/offer-clay.jpg",
      alt: "Hands throwing clay on a pottery wheel",
    },
  },
  {
    id: "paper",
    icon: "scissors",
    title: "Paper & Fibre Crafts",
    description:
      "Origami, collage, knitting, and weaving — small projects that finish in one sitting and grow from there.",
    image: {
      src: "/assets/arts/images/offer-paper.jpg",
      alt: "Cutting coloured craft paper",
    },
  },
];

/**
 * Subject stats strip.
 *
 * Every tile is either read off an array this page renders or states a policy the
 * product keeps. The disciplines count comes from the marquee; the other two are
 * commitments — credentials are reviewed before an educator is listed, and an
 * unconfirmed booking refunds itself. Per-educator ratings are published by the API,
 * but there is no platform-wide average behind a stat tile and no session history, so
 * nothing here may claim an average rating or tally projects taken home.
 */
export const ARTS_STATS: SubjectStat[] = [
  { id: "disciplines", value: ARTS_MARQUEE.length, label: "Craft disciplines" },
  { id: "checked", value: 100, suffix: "%", label: "Background checked" },
  // BOOKING_POLICY.confirmationSlaDays on the server, and the same promise the
  // booking flow makes before anyone pays.
  { id: "confirmation", value: 2, suffix: " days", label: "To confirm, or refund" },
];
