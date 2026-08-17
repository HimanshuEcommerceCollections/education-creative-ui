"use client";

import { useInView } from "@/hooks/use-in-view";
import type { RatingFacet } from "@/lib/educators/rating";

/**
 * Rating-facet breakdown; bars fill from zero once the card scrolls into view.
 *
 * Presentational only — which bars these are (the four facets, or the star
 * distribution when no facet was answered) is decided by `ratingBreakdown` in
 * `lib/educators/rating`, and an educator with no published reviews yields no
 * facets at all, so the page renders nothing here rather than an empty card.
 */
export function RatingBars({ facets }: { facets: RatingFacet[] }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });

  return (
    <div>
      <h2 className="mb-5 font-serif text-[clamp(22px,2.4vw,28px)] font-semibold tracking-[-0.01em]">
        Rating breakdown
      </h2>

      <div
        ref={ref}
        className="grid grid-cols-2 gap-x-9 gap-y-6 rounded-[22px] border border-line bg-white p-7 max-[520px]:grid-cols-1"
      >
        {facets.map((facet) => (
          <div key={facet.label}>
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-[14.5px] font-semibold text-ink">{facet.label}</span>
              <span className="text-[13.5px] font-medium text-muted">{facet.value}</span>
            </div>
            <div className="h-[9px] overflow-hidden rounded-full bg-sand">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,var(--slate),var(--gold))] transition-[width] duration-[1100ms] ease-[cubic-bezier(0.19,1,0.22,1)] motion-reduce:transition-none"
                style={{ width: inView ? `${facet.percent}%` : "0%" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
