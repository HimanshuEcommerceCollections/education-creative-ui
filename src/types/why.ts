import type { ImageAsset } from "@/types/media";

/** A reason card in the "Why families choose us" strip. */
export interface WhyItem {
  id: string;
  /** Two-digit ordinal badge, e.g. "01". */
  number: string;
  title: string;
  description: string;
  image: ImageAsset;
}
