"use client";

import { useEffect, useRef, useState } from "react";

import { Reveal } from "@/components/common/reveal";
import { TimelineStep } from "@/components/home/timeline-step";
import { STEPS } from "@/data/steps";

/**
 * Vertical timeline whose center line fills as the section scrolls past the
 * viewport midpoint (reproduces the source's `tlFill` script). The scroll
 * math is trivial and single-use, so it lives inline rather than in a hook.
 */
export function Timeline() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = timelineRef.current;
    if (!element) return;

    const update = () => {
      const rect = element.getBoundingClientRect();
      const ratio = (window.innerHeight * 0.5 - rect.top) / rect.height;
      setProgress(Math.max(0, Math.min(1, ratio)));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div ref={timelineRef} className="relative mx-auto max-w-[1040px]">
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[rgba(24,24,24,0.12)] max-[820px]:left-[22px]"
      >
        <span
          className="absolute left-0 top-0 block w-full bg-slate transition-[height] duration-100 ease-linear motion-reduce:transition-none"
          style={{ height: `${progress * 100}%` }}
        />
      </div>

      {STEPS.map((step, index) => (
        <Reveal key={step.id}>
          <TimelineStep step={step} reversed={index % 2 === 0} />
        </Reveal>
      ))}
    </div>
  );
}
