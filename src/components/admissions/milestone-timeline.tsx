"use client";

import { useEffect, useRef, useState } from "react";

import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Highlight } from "@/components/common/highlight";
import { ADMISSIONS_MILESTONES } from "@/data/admissions";
import { cn } from "@/lib/utils";

import styles from "./milestone-timeline.module.css";

const N = ADMISSIONS_MILESTONES.length;
/** Node/marker positions along the path, matching the source. */
const LEFTS = ["6%", "28%", "50%", "72%", "94%"];

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={direction === "left" ? "M15 18l-6-6 6-6" : "M9 6l6 6-6 6"} />
    </svg>
  );
}

/**
 * Junior-year-to-decision-day timeline. A tall pin holds a sticky 3D "road";
 * scroll progress drives the active milestone, while the nodes, arrow buttons,
 * and keyboard arrows advance it manually (briefly suspending scroll-driving).
 */
export function MilestoneTimeline() {
  const pinRef = useRef<HTMLDivElement>(null);
  const holdUntil = useRef(0);
  const [step, setStep] = useState(0);

  const hold = () => {
    holdUntil.current = performance.now() + 3000;
  };

  const go = (next: number) => {
    const clamped = Math.max(0, Math.min(N - 1, next));
    setStep((prev) => (prev === clamped ? prev : clamped));
    hold();
  };

  useEffect(() => {
    const pin = pinRef.current;
    if (!pin) return;

    const onScroll = () => {
      if (performance.now() < holdUntil.current) return;
      const total = pin.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const progress = Math.max(0, Math.min(1, -pin.getBoundingClientRect().top / total));
      const next = Math.min(N - 1, Math.floor(progress * N));
      setStep((prev) => (prev === next ? prev : next));
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      const rect = pin.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      event.preventDefault();
      setStep((prev) => Math.max(0, Math.min(N - 1, prev + (event.key === "ArrowRight" ? 1 : -1))));
      hold();
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const milestone = ADMISSIONS_MILESTONES[step];

  return (
    <div ref={pinRef} className={styles.pin}>
      <section className={styles.sec}>
        <Container>
          <div className={styles.top}>
            <div>
              <Eyebrow tone="light">The journey</Eyebrow>
              <h2 className="font-serif text-[clamp(30px,4vw,54px)] font-semibold leading-[1.02] tracking-[-0.02em] text-[#F6F5F1]">
                Junior year to <Highlight tone="gold">decision day.</Highlight>
              </h2>
              <p className={styles.lede}>
                Five milestones, walked together. Tap a marker on the path — or
                use the arrows — to see what happens at each stage.
              </p>
            </div>
            <div className={styles.ctrls}>
              <button
                type="button"
                className={styles.btn}
                aria-label="Previous milestone"
                disabled={step === 0}
                onClick={() => go(step - 1)}
              >
                <Chevron direction="left" />
              </button>
              <div className={styles.step} aria-live="polite">
                {step + 1} / {N}
              </div>
              <button
                type="button"
                className={styles.btn}
                aria-label="Next milestone"
                disabled={step === N - 1}
                onClick={() => go(step + 1)}
              >
                <Chevron direction="right" />
              </button>
            </div>
          </div>
        </Container>

        <Container>
          <div className={styles.side}>
            <div className={styles.stage}>
              <div className={styles.world}>
                <div className={styles.ground} aria-hidden="true" />
                <div className={styles.path}>
                  <div
                    className={styles.fill}
                    style={{ width: `${(step / (N - 1)) * 100}%` }}
                  />
                </div>
                {ADMISSIONS_MILESTONES.map((item, index) => (
                  <button
                    type="button"
                    key={item.season}
                    className={cn(
                      styles.node,
                      index === step && styles.on,
                      index < step && styles.done,
                    )}
                    style={{ left: LEFTS[index] }}
                    aria-label={`Milestone ${index + 1}: ${item.season}`}
                    aria-current={index === step ? "step" : undefined}
                    onClick={() => go(index)}
                  >
                    <span className={styles.disc}>{index + 1}</span>
                    <span className={styles.season}>{item.season}</span>
                  </button>
                ))}
                <div
                  className={styles.marker}
                  style={{ left: LEFTS[step] }}
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.9}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 9L12 4 2 9l10 5 10-5z" />
                    <path d="M6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
                    <path d="M22 9v5" />
                  </svg>
                </div>
              </div>
            </div>

            <div key={step} className={cn(styles.card, styles.swap)}>
              <div className={styles.chip}>
                <i />
                <span>{milestone.season}</span>
              </div>
              <h3 className={styles.cardTitle}>{milestone.title}</h3>
              <p className={styles.cardBody}>{milestone.body}</p>
              <div className={styles.pts}>
                {milestone.points.map((point) => (
                  <span key={point}>{point}</span>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
