"use client";

import { formatCount, useCountUp } from "@/hooks/use-count-up";
import { useInView } from "@/hooks/use-in-view";
import { revealClassName, type RevealDelay } from "@/lib/reveal";
import { cn } from "@/lib/utils";
import type { Stat } from "@/types/stat";

/*
 * Border logic mirrors the source's responsive `.stat` selectors:
 * 4 cols with right dividers → 2 cols (bottom dividers, right on odd) → 1 col.
 */
const STAT_CLASSES =
  "border-r border-line pt-11 pr-6 last:border-r-0 " +
  "max-[820px]:border-b max-[820px]:border-r-0 max-[820px]:py-[30px] max-[820px]:pr-0 max-[820px]:odd:border-r max-[820px]:odd:pr-6 " +
  "max-[520px]:border-r-0 max-[520px]:py-7 max-[520px]:odd:border-r-0 max-[520px]:odd:pr-0";

interface StatCounterProps {
  stat: Stat;
  delay?: RevealDelay;
}

/** A single stat that counts up from zero the first time it scrolls into view. */
export function StatCounter({ stat, delay }: StatCounterProps) {
  const { value, decimals = 0, suffix = "", label, description } = stat;
  const { ref, inView } = useInView<HTMLDivElement>({
    rootMargin: "0px 0px -8% 0px",
  });
  const display = useCountUp(value, { decimals, suffix, active: inView });

  return (
    <div ref={ref} className={cn(STAT_CLASSES, revealClassName(inView, delay))}>
      <div
        aria-hidden="true"
        className="font-serif text-[clamp(46px,5vw,76px)] font-normal leading-[0.9] tracking-[-0.02em] text-slate"
      >
        {display}
      </div>
      <span className="sr-only">{formatCount(value, decimals, suffix)}</span>
      <h4 className="mb-1.5 mt-4 text-[14px] font-semibold uppercase tracking-[0.04em]">
        {label}
      </h4>
      <p className="text-[14px] leading-[1.55] text-muted">{description}</p>
    </div>
  );
}
