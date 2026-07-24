"use client";

import { useEffect, useRef, useState } from "react";

import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Highlight } from "@/components/common/highlight";
import { Reveal, type RevealDelay } from "@/components/common/reveal";
import { useInView } from "@/hooks/use-in-view";
import { ABOUT_SNAPSHOT } from "@/data/about";

/** Counts from zero to `target` (ease-out) once scrolled into view. */
function CountUp({ target }: { target: number }) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.4 });
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const raf = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(raf);
    }

    const duration = 1400;
    let start: number | null = null;
    let raf = 0;
    const tick = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return <span ref={ref}>{value}</span>;
}

/** "A snapshot" — four demo figures, the numeric ones counting up on reveal. */
export function AboutSnapshot() {
  return (
    <section className="bg-ivory py-[13vh]">
      <Container>
        <Reveal>
          <div className="mx-auto mb-[76px] max-w-[680px] text-center">
            <Eyebrow align="center">A Snapshot</Eyebrow>
            <h2 className="font-serif text-[clamp(30px,4vw,54px)] font-semibold leading-[1.02] tracking-[-0.02em]">
              The marketplace <Highlight>today.</Highlight>
            </h2>
            <p className="mx-auto mt-[14px] max-w-[520px] text-[16px] leading-[1.6] text-muted">
              An illustrative look at this demo. Numbers are synthetic and shown to give a feel for
              the platform.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-4 gap-7 max-[900px]:grid-cols-2 max-[520px]:grid-cols-1">
          {ABOUT_SNAPSHOT.map((stat, i) => (
            <Reveal key={stat.label} delay={(i + 1) as RevealDelay}>
              <div className="rounded-[20px] border border-line bg-sand p-[38px_30px] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,0.7,0.2,1)] hover:-translate-y-[6px] hover:shadow-[0_24px_54px_-30px_rgba(22,24,29,0.34)]">
                <div
                  className={`flex items-baseline gap-1 font-serif font-bold leading-none tracking-[-0.03em] text-slate ${
                    stat.small ? "text-[clamp(30px,3.6vw,42px)]" : "text-[clamp(40px,5vw,60px)]"
                  }`}
                >
                  {typeof stat.count === "number" ? <CountUp target={stat.count} /> : stat.text}
                  {stat.suffix ? (
                    <span className="text-[0.42em] font-bold text-gold">{stat.suffix}</span>
                  ) : null}
                </div>
                <div className="mt-[14px] text-[14.5px] leading-[1.5] text-muted">{stat.label}</div>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-[34px] text-center text-[12.5px] tracking-[0.04em] text-muted">
          Demo — figures are illustrative and synthetic, not performance or outcome claims.
        </p>
      </Container>
    </section>
  );
}
