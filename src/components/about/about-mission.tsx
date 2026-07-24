"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Highlight } from "@/components/common/highlight";
import { cn } from "@/lib/utils";

/** The mission statement, assembled one line at a time as the section scrolls. */
const MISSION_LINES: ReactNode[] = [
  <>We started Your Learning Journey with one belief —</>,
  <>
    that every family deserves a <Highlight>trusted, vetted educator.</Highlight>
  </>,
  <>So we built a place to browse, compare, and connect —</>,
  <>
    with <Highlight>parents in control</Highlight> at every step.
  </>,
];

/**
 * Scroll-pinned mission: a tall track holds a sticky panel while the reader
 * scrolls, revealing each line (and advancing the progress dots) in turn.
 * Reduced motion collapses the track and shows every line at once.
 */
export function AboutMission() {
  const pinRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const pin = pinRef.current;
    if (!pin) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const update = () => {
      if (reduce) {
        setStep(MISSION_LINES.length - 1);
        return;
      }
      const total = pin.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const progress = Math.min(Math.max(-pin.getBoundingClientRect().top / total, 0), 1);
      const next = Math.min(Math.floor(progress * MISSION_LINES.length), MISSION_LINES.length - 1);
      setStep(next);
    };

    update();
    if (reduce) return;
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div ref={pinRef} className="relative h-[330vh] bg-ivory motion-reduce:h-auto">
      <section className="sticky top-0 flex h-screen items-center overflow-hidden motion-reduce:static motion-reduce:h-auto motion-reduce:py-[14vh]">
        <Container>
          <div className="grid grid-cols-[0.62fr_1.38fr] items-center gap-16 max-[860px]:grid-cols-1 max-[860px]:gap-[34px]">
            <div>
              <Eyebrow>Our Mission</Eyebrow>
              <h2 className="font-serif text-[clamp(24px,2.6vw,32px)] font-semibold leading-[1.08] tracking-[-0.02em]">
                Built around one <Highlight>simple belief.</Highlight>
              </h2>
              <div className="mt-[30px] flex gap-3" aria-hidden="true">
                {MISSION_LINES.map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-[5px] w-[34px] origin-left rounded transition-[background-color,transform] duration-500 motion-reduce:transition-none",
                      i <= step ? "bg-gold" : "bg-sand-2",
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-[26px]">
              {MISSION_LINES.map((line, i) => (
                <p
                  key={i}
                  className={cn(
                    "font-serif text-[clamp(24px,3.4vw,44px)] font-semibold leading-[1.12] tracking-[-0.02em] transition-[opacity,transform,color] duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)] motion-reduce:transition-none",
                    i <= step
                      ? "translate-y-0 text-ink opacity-100"
                      : "translate-y-[26px] text-muted opacity-[0.22]",
                  )}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
