import "server-only";

import type { EducatorDirectoryResponse, PublicEducator } from "@contracts/reviews.ts";

import { apiFetch } from "@/lib/api/server";

import { ratingsBySlug, type EducatorRating } from "./rating";

/**
 * The cache tag both public educator reads carry — the directory here and one
 * educator's reviews in `./reviews`.
 *
 * One tag rather than two because one *event* invalidates both: publishing or
 * rejecting a review moves an educator's average, their review count, and the
 * list on their profile at the same instant. A moderation action calling
 * `revalidateTag(EDUCATORS_CACHE_TAG)` therefore fixes every surface at once, and
 * cannot leave a browse card showing 4.9 while the profile behind it shows 4.6.
 */
export const EDUCATORS_CACHE_TAG = "educators";

/**
 * Backstop lifetime, in seconds. The tag above is the real mechanism; this is
 * only what bounds the staleness if a revalidation is ever missed.
 */
export const EDUCATORS_REVALIDATE_SECONDS = 300;

/**
 * The public educator directory — the only place a cached rating is published.
 *
 * Returns an empty list when the API can't answer, including at build time with
 * no API running. Callers read that as "no ratings known", which renders as no
 * stars anywhere: a page must degrade to the honest silence it had before the
 * reviews feature existed, never to a crash and never to a number nobody gave.
 */
export async function loadEducatorDirectory(): Promise<PublicEducator[]> {
  try {
    const { items } = await apiFetch<EducatorDirectoryResponse>("/educators/directory", {
      next: {
        revalidate: EDUCATORS_REVALIDATE_SECONDS,
        tags: [EDUCATORS_CACHE_TAG],
      },
    });
    return items;
  } catch (caught) {
    /*
     * Logged, because the fallback is silent by design and that makes a missing
     * API indistinguishable from an educator nobody has reviewed. Twice now the
     * answer to "why are there no stars" has been that the API wasn't reachable
     * when the page rendered — and with nothing written down, there was no way to
     * tell that from the page itself.
     */
    console.error("loadEducatorDirectory: no ratings will render —", caught);
    return [];
  }
}

/**
 * The one call a card surface makes: published ratings keyed by educator slug,
 * ready to join onto in-repo presentational data.
 *
 * Empty on any failure, and empty of any educator the API holds no rating for —
 * a lookup that misses is exactly the "render no stars" case, so callers need no
 * separate failure branch.
 */
export async function loadEducatorRatings(): Promise<Record<string, EducatorRating>> {
  return ratingsBySlug(await loadEducatorDirectory());
}
