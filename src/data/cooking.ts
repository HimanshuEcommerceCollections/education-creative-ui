import type { ImageAsset } from "@/types/media";
import type { SubjectEducator, SubjectStat } from "@/types/subject-page";

/** A "three ways to begin" offer card (photo + copy, no icon badge). */
export interface CookingOffer {
  id: string;
  title: string;
  description: string;
  image: ImageAsset;
}

/** One notch on the heat dial: the label, headline, and description. */
export interface HeatStep {
  /** Short badge label, e.g. "Med-low". */
  badge: string;
  title: string;
  body: string;
}

/** The three entry points into cooking. */
export const COOKING_OFFERS: CookingOffer[] = [
  {
    id: "everyday",
    title: "Everyday Cooking",
    description:
      "Weeknight dinners done well — knife skills, timing, and go-to meals a family actually wants to eat.",
    image: { src: "/assets/cooking/images/offer-everyday.jpg", alt: "Lamb ragout with salad and naan" },
  },
  {
    id: "baking",
    title: "Baking & Bread",
    description:
      "Doughs, pastry, and the patience they teach — from first loaf to weekend cinnamon rolls.",
    image: { src: "/assets/cooking/images/offer-baking.jpg", alt: "Hands shaping bread dough on a board" },
  },
  {
    id: "world",
    title: "World Flavours",
    description:
      "Curries, pasta, stir-fries and more — explore a cuisine and bring its staples into your own kitchen.",
    image: { src: "/assets/cooking/images/offer-world.jpg", alt: "A globe surrounded by world dishes and spices" },
  },
];

/** The five heat levels the dial travels through, low to high. */
export const HEAT_STEPS: HeatStep[] = [
  {
    badge: "Low",
    title: "Low — the gentle poach",
    body: "Barely a shiver on the surface. Low heat is for eggs, custards, delicate fish — anything that turns rubbery if you rush it.",
  },
  {
    badge: "Med-low",
    title: "Medium-low — the steady simmer",
    body: "Small bubbles break the surface. This is where soups, stews, and sauces live — slow enough to build flavour, gentle enough to forgive.",
  },
  {
    badge: "Medium",
    title: "Medium — the everyday sauté",
    body: "The workhorse. Onions soften, garlic turns golden, vegetables cook through without scorching. Most weeknight cooking happens right here.",
  },
  {
    badge: "Med-high",
    title: "Medium-high — the confident sear",
    body: "Now it sizzles the moment food hits the pan. This is how you get a golden crust on meat and colour that means flavour. Keep things moving.",
  },
  {
    badge: "High",
    title: "High — the fearless char",
    body: "Full flame. For stir-fries, blistering peppers, searing a steak fast. Thrilling, unforgiving, and the level most cooks never learn to trust — until now.",
  },
];

/** Lead paragraph for the "Taste as you go" approach split. */
export const COOKING_APPROACH_LEAD =
  "No stiff demonstrations. Sessions happen in your own kitchen, at your own pace — hands on the knife, spoon in the pot, tasting and adjusting until it’s right. Every session ends with a meal on the table.";

/** Bullet points for the approach split. */
export const COOKING_APPROACH_POINTS: string[] = [
  "Real meals cooked start to finish — then eaten together",
  "Shopping lists sent ahead so you cook with what you have",
  "Kitchen-safety first — heat, blades, and cleanup done right",
];

/** The two featured cooking educators (tutoring-style hover cards). */
export const COOKING_EDUCATORS: SubjectEducator[] = [
  {
    id: "james",
    name: "James O.",
    role: "Cooking Educator",
    meta: "8 yrs experience · Online · In-home",
    bio: "A former line cook who swears the best food is unfussy — sharp knife work, big flavour, no stress.",
    price: "$58/hr",
    href: "/browse",
    image: { src: "/assets/cooking/images/educator-james.jpg", alt: "James O., cooking educator" },
  },
  {
    id: "rosa",
    name: "Rosa N.",
    role: "Cooking Educator",
    meta: "6 yrs experience · Online · In-home",
    bio: "Baker and bread-head — dough, pastry, and the quiet satisfaction of something rising in the oven.",
    price: "$54/hr",
    href: "/browse",
    image: { src: "/assets/cooking/images/educator-rosa.jpg", alt: "Rosa N., cooking educator" },
  },
];

/**
 * Count-up figures for the stats strip.
 *
 * The educator count is read off the array above, and the other two tiles are
 * promises the product keeps: credentials reviewed before listing, and a booking
 * that refunds itself if a coordinator can't confirm it. Ratings are published per
 * educator, not as a platform average, and there is no session history to count — so a
 * figure that could only be written in this file and nowhere else (an average rating, a
 * tally of meals cooked together) does not belong here.
 */
export const COOKING_STATS: SubjectStat[] = [
  { id: "educators", value: COOKING_EDUCATORS.length, label: "Kitchen educators" },
  { id: "checked", value: 100, suffix: "%", label: "Background checked" },
  // BOOKING_POLICY.confirmationSlaDays on the server, and the same promise the
  // booking flow makes before anyone pays.
  { id: "confirmation", value: 2, suffix: " days", label: "To confirm, or refund" },
];
