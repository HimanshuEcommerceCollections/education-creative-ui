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

/** An educator profile card (hover reveals the detail). */
export interface SubjectEducator {
  id: string;
  name: string;
  role: string;
  meta: string;
  rating: string;
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
