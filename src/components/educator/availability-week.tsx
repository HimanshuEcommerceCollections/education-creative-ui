"use client";

import { useEffect, useRef, useState } from "react";

import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";
import type { AvailabilityDay, DayState } from "@/data/educators";

const STATE_STYLES: Record<DayState, string> = {
  open: "bg-[rgba(46,58,115,0.16)] text-slate",
  some: "bg-[rgba(210,162,65,0.2)] text-[#8a6a1e]",
  closed: "bg-sand text-muted opacity-60",
};

const LEGEND: { state: DayState; label: string }[] = [
  { state: "open", label: "Afternoons & evenings" },
  { state: "some", label: "Limited slots" },
  { state: "closed", label: "Usually unavailable" },
];

/** Illustrative weekly availability; day pills pop in one-by-one on scroll. */
export function AvailabilityWeek({ days }: { days: AvailabilityDay[] }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });
  const [shown, setShown] = useState(0);
  const prefersReduced = useRef(false);

  useEffect(() => {
    prefersReduced.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (!inView) return;
    if (prefersReduced.current) {
      setShown(days.length);
      return;
    }
    const timers = days.map((_, index) =>
      setTimeout(() => setShown((count) => Math.max(count, index + 1)), index * 90),
    );
    return () => timers.forEach(clearTimeout);
  }, [inView, days]);

  return (
    <div>
      <h2 className="mb-5 font-serif text-[clamp(22px,2.4vw,28px)] font-semibold tracking-[-0.01em]">
        Typical weekly availability
      </h2>

      <div
        ref={ref}
        className="grid grid-cols-7 gap-3 max-[560px]:grid-cols-4"
      >
        {days.map((day, index) => (
          <div
            key={day.name}
            className={cn(
              "flex flex-col items-center gap-2 rounded-[16px] px-2 py-4 text-center transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] motion-reduce:transition-none",
              STATE_STYLES[day.state],
              index < shown ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
            )}
          >
            <span className="text-[12.5px] font-semibold uppercase tracking-[0.08em]">
              {day.name}
            </span>
            <span className="text-[13px] font-medium">{day.pill}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
        {LEGEND.map((entry) => (
          <span key={entry.state} className="flex items-center gap-2 text-[13px] text-muted">
            <span
              aria-hidden="true"
              className={cn("h-3 w-3 rounded-[5px]", STATE_STYLES[entry.state])}
            />
            {entry.label}
          </span>
        ))}
      </div>

      <p className="mt-4 text-[12.5px] leading-[1.55] text-muted">
        Illustrative only — exact times are confirmed with the parent when a booking is requested.
      </p>
    </div>
  );
}
