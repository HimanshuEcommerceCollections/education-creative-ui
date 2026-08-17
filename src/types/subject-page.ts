import type { ImageAsset } from "@/types/media";

/** Line-icon keys used on offer cards across subject pages. */
export type OfferIconName =
  | "note"
  | "mic"
  | "book"
  | "graduation"
  | "target"
  | "pencil"
  | "brush"
  | "vase"
  | "scissors";

/** A "Three ways in" offer card. */
export interface OfferItem {
  id: string;
  icon: OfferIconName;
  title: string;
  description: string;
  image: ImageAsset;
}

/**
 * An educator profile card (hover reveals the detail).
 *
 * No `rating`, and none may be added. The gold "★ 4.9" pill is drawn again, but the
 * number is passed to `EducatorCard` separately, joined by the page from the API's
 * published directory on the `id` below (the educator's slug). A rating field here
 * would let a subject data file publish a score no parent gave; an educator the API
 * has no rating for simply gets no pill.
 */
export interface SubjectEducator {
  id: string;
  name: string;
  role: string;
  meta: string;
  bio: string;
  price: string;
  href: string;
  image: ImageAsset;
}

/** A compact count-up statistic in the subject stats strip. */
export interface SubjectStat {
  id: string;
  value: number;
  decimals?: number;
  suffix?: string;
  label: string;
}
