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

/** Subject stats strip. */
export const ARTS_STATS: SubjectStat[] = [
  { id: "projects", value: 130, suffix: "+", label: "Projects taken home" },
  { id: "disciplines", value: 6, label: "Craft disciplines" },
  { id: "rating", value: 4.8, decimals: 1, label: "Average rating" },
];
