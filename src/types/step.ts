import type { ImageAsset } from "@/types/media";

/** A single step in the "How It Works" timeline. */
export interface Step {
  id: string;
  /** Zero-padded ordinal shown as the large background numeral, e.g. "01". */
  number: string;
  chapter: string;
  title: string;
  description: string;
  image: ImageAsset;
}
