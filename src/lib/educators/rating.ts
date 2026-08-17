/**
 * The vocabulary of the ratings display: what a rating *is*, and how the profile
 * page's breakdown is derived from an aggregate.
 *
 * Deliberately free of `server-only` and of any fetch. The loaders beside it are
 * server modules, but the cards that render these shapes — the browse grid, the
 * home stack, the booking picker — are in the client bundle, so the types and the
 * pure derivations have to be importable from both sides.
 *
 * Nothing here invents a number. Every function takes what the API said and
 * either shows it or returns nothing at all; there is no default, no rounding up
 * from zero, and no placeholder rating.
 */

import type { LearnerAgeBand } from "@contracts/bookings.ts";
import type { PublicEducator, ReviewAggregate } from "@contracts/reviews.ts";

/**
 * An educator's published rating.
 *
 * Its *absence* carries the meaning: an educator with no published reviews has no
 * `EducatorRating`, and every surface then renders no stars at all — not a `0.0`,
 * not an empty five-star row, not a "No reviews yet" badge dressed as a score.
 * Somebody who has just been listed and somebody rated one star must never look
 * the same, and the only way to guarantee that is to draw nothing for the first.
 */
export interface EducatorRating {
  /** One-decimal average over published reviews, exactly as the API computed it. */
  average: number;
  /** Published reviews behind that average — never 0 when this exists. */
  count: number;
}

/** One bar in the profile page's "Rating breakdown". */
export interface RatingFacet {
  label: string;
  /** Displayed value, e.g. `"4.9 / 5"` for a facet or `"12"` for a star row. */
  value: string;
  /** Bar fill as a percentage (0–100). */
  percent: number;
}

/**
 * The directory's ratings, keyed by educator slug — the join every card surface
 * makes against its in-repo presentational data.
 *
 * An educator is only in the map when the API gave *both* an average and at least
 * one review. A null average with a non-zero count (or the reverse) is a shape the
 * contract permits and a rating nobody should see rendered, so it is dropped
 * rather than coerced into something displayable.
 */
export function ratingsBySlug(
  educators: readonly PublicEducator[],
): Record<string, EducatorRating> {
  const ratings: Record<string, EducatorRating> = {};

  for (const educator of educators) {
    if (educator.rating === null || educator.reviewCount < 1) continue;
    ratings[educator.slug] = {
      average: educator.rating,
      count: educator.reviewCount,
    };
  }

  return ratings;
}

/** The four facets, in the order the design's two-column grid reads them. */
const FACETS: readonly { key: keyof ReviewAggregate["facets"]; label: string }[] = [
  { key: "communication", label: "Communication" },
  { key: "knowledge", label: "Knowledge" },
  { key: "punctuality", label: "Punctuality" },
  { key: "patience", label: "Patience" },
];

/** Star rows, best first — the shape a reader expects a distribution in. */
const DISTRIBUTION_STARS = [5, 4, 3, 2, 1] as const;

/**
 * The bars behind "Rating breakdown", from whichever source the aggregate can
 * actually support.
 *
 * The four facets are optional on submission (a parent may leave every one of
 * them blank and still give an overall rating), so the breakdown has two possible
 * sources and a precedence between them:
 *
 * 1. **Facets**, when any of them has an answer — they say more than a star count
 *    does, and only the ones with data are drawn. Three bars is an honest
 *    breakdown; a fourth bar at 0% for a question nobody answered is not.
 * 2. **The star distribution**, when no facet has data but reviews exist. Same
 *    component, same bars, `percent` as each star's share of the total.
 *
 * Empty when there are no published reviews, which is the caller's signal to
 * render no breakdown section at all rather than an empty card.
 */
export function ratingBreakdown(aggregate: ReviewAggregate): RatingFacet[] {
  const facets: RatingFacet[] = [];

  for (const facet of FACETS) {
    const value = aggregate.facets[facet.key];
    if (value === null) continue;
    facets.push({
      label: facet.label,
      value: `${value.toFixed(1)} / 5`,
      percent: (value / 5) * 100,
    });
  }

  if (facets.length > 0) return facets;
  if (aggregate.count < 1) return [];

  return DISTRIBUTION_STARS.map((star) => {
    const count = aggregate.distribution[star];
    return {
      label: star === 1 ? "1 star" : `${star} stars`,
      value: `${count}`,
      percent: (count / aggregate.count) * 100,
    };
  });
}

/**
 * The attribution line on a review.
 *
 * The age band and an initial are the entire attribution the public shapes carry
 * — no parent name, no learner name — so this reads the band as the sentence a
 * person would write it as. Every band starts with a consonant sound ("four",
 * "seven", "ten", "thirteen", "sixteen"), so the article is always "a".
 */
export function ageBandAttribution(band: LearnerAgeBand): string {
  return `Parent of a ${band.replace("-", "–")} year old`;
}
