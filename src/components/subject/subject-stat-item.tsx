"use client";

import { formatCount, useCountUp } from "@/hooks/use-count-up";
import { useInView } from "@/hooks/use-in-view";
import { revealClassName, type RevealDelay } from "@/lib/reveal";
import { cn } from "@/lib/utils";
import type { SubjectStat } from "@/types/subject-page";

const STAT_CLASSES =
  "mr-5 border-r border-line pr-5 pt-[26px] last:border-r-0 " +
  "max-[640px]:mb-[18px] max-[640px]:mr-0 max-[640px]:border-r-0";

/** Compact count-up stat in the subject stats strip. */
export function SubjectStatItem({
  stat,
  delay,
}: {
  stat: SubjectStat;
  delay?: RevealDelay;
}) {
  const { value, decimals = 0, suffix = "", label } = stat;
  const { ref, inView } = useInView<HTMLDivElement>({
    rootMargin: "0px 0px -8% 0px",
  });
  const display = useCountUp(value, {
    decimals,
    suffix,
    durationMs: 1300,
    active: inView,
  });

  return (
    <div ref={ref} className={cn(STAT_CLASSES, revealClassName(inView, delay))}>
      <div
        aria-hidden="true"
        className="font-serif text-[clamp(30px,3.4vw,48px)] font-semibold leading-none text-slate"
      >
        {display}
      </div>
      <span className="sr-only">{formatCount(value, decimals, suffix)}</span>
      <div className="mt-[10px] text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
        {label}
      </div>
    </div>
  );
}
