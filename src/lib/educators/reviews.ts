import "server-only";

import type { EducatorReviewsResponse } from "@contracts/reviews.ts";

import { apiFetch } from "@/lib/api/server";

import { EDUCATORS_CACHE_TAG, EDUCATORS_REVALIDATE_SECONDS } from "./directory";

/**
 * One educator's published reviews and the aggregate behind them.
 *
 * Public and unauthenticated, cached under the same `educators` tag as the
 * directory so a moderation decision reaches the profile page and the browse card
 * in the same revalidation.
 *
 * Null when the API can't answer — a missing educator, a refusal, or no API at
 * all during `next build`. The profile page reads null as "no reviews known" and
 * renders the hero, the breakdown and the tab exactly as it would for an educator
 * nobody has reviewed yet: no stars, no bars, no invented average.
 */
export async function loadEducatorReviews(
  slug: string,
): Promise<EducatorReviewsResponse | null> {
  try {
    return await apiFetch<EducatorReviewsResponse>(
      `/educators/${encodeURIComponent(slug)}/reviews`,
      {
        next: {
          revalidate: EDUCATORS_REVALIDATE_SECONDS,
          tags: [EDUCATORS_CACHE_TAG],
        },
      },
    );
  } catch {
    return null;
  }
}
