import type { ImageAsset } from "@/types/media";

/** A photo tile in the Featured Subjects mosaic. */
export interface Subject {
  id: string;
  category: string;
  title: string;
  description?: string;
  image: ImageAsset;
  /** Dedicated subject page, when one exists (otherwise the tile scrolls to educators). */
  href?: string;
}
