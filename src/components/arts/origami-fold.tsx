"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Highlight } from "@/components/common/highlight";
import { cn } from "@/lib/utils";

import styles from "./origami-fold.module.css";

/** Copy for each fold, shown in the side card as the diagram advances. */
const STEPS: { title: string; body: string }[] = [
  {
    title: "A single square of paper",
    body: "Nothing special yet — and that's the point. Every project begins with plain material and a first crease.",
  },
  {
    title: "Mountain folds — the wings wake up",
    body: "Two clean creases and the flat sheet is suddenly a shape with a spine. Fingers learn how paper wants to bend.",
  },
  {
    title: "The wings settle",
    body: "The body narrows, the wings sweep down — halfway between a sheet and a bird. This is where patience pays.",
  },
  {
    title: "The neck lifts, the tail answers",
    body: "Two small reverse folds, one at each end. Suddenly it has a front and a back — and a personality.",
  },
  {
    title: "One last crease — and it flies",
    body: "A finished crane, made from one square and five folds. Every session ends like this: something real in your hands.",
  },
];

const N = STEPS.length;

/** Arrowhead marker shared by every diagram's fold arrows. */
const ORI_DEFS = `<defs><marker id="oriArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#D2A241"/></marker></defs>`;

/** Raw inner markup for each fold's SVG diagram (viewBox 0 0 200 200). */
const ORI_SVGS: string[] = [
  `<polygon class="paper" points="100,20 180,100 100,180 20,100"/>
<line class="crease" x1="100" y1="20" x2="100" y2="180"/>
<line class="crease" x1="20" y1="100" x2="180" y2="100"/>`,
  `<polygon class="paper" points="100,20 145,100 100,180 55,100"/>
<polygon class="shade" points="100,20 145,100 100,108"/>
<polygon class="shade" points="100,20 55,100 100,108"/>
<line class="edge" x1="100" y1="20" x2="100" y2="180"/>
<path class="arrow" d="M60,72 Q85,56 96,74"/>
<path class="arrow" d="M140,72 Q115,56 104,74"/>`,
  `<polygon class="paper" points="100,18 128,100 100,182 72,100"/>
<polygon class="shade" points="100,100 128,100 100,140 72,100"/>
<line class="edge" x1="100" y1="18" x2="100" y2="182"/>
<line class="crease" x1="72" y1="100" x2="128" y2="100"/>
<path class="arrow" d="M100,152 Q100,122 100,108"/>`,
  `<polygon class="paper" points="100,58 126,104 100,176 74,104"/>
<polygon class="shade" points="100,104 126,104 100,146 74,104"/>
<polygon class="paper" points="100,58 74,104 42,44"/>
<polygon class="paper" points="100,58 126,104 164,52"/>
<line class="edge" x1="100" y1="58" x2="42" y2="44"/>
<line class="edge" x1="100" y1="58" x2="164" y2="52"/>
<path class="arrow" d="M64,84 Q46,58 46,48"/>
<path class="arrow" d="M138,82 Q160,60 160,54"/>`,
  `<polygon class="paper" points="22,90 90,116 100,108 110,116 178,90 168,116 112,132 100,124 88,132 32,116"/>
<polygon class="shade" points="90,116 100,108 110,116 110,132 100,124 90,132"/>
<polygon class="paper" points="90,126 110,126 100,170"/>
<polygon class="shade" points="100,130 110,126 100,152"/>
<polygon class="paper" points="96,112 104,112 60,50 50,58"/>
<polygon class="paper" points="60,50 50,58 34,52 46,40"/>
<polygon class="paper" points="104,112 99,116 170,72 174,84"/>
<line class="edge" x1="100" y1="114" x2="55" y2="54"/>
<line class="edge" x1="100" y1="114" x2="172" y2="78"/>`,
];

/**
 * The scroll-pinned origami showpiece. A tall pin holds a sticky stage; scroll
 * progress through the pin drives which fold shows. Tapping the paper (or arrow
 * keys) advances manually and briefly suspends scroll-driving so the manual
 * step isn't immediately overridden — a faithful port of the source widget.
 */
export function OrigamiFold() {
  const pinRef = useRef<HTMLDivElement>(null);
  const holdUntil = useRef(0);
  const [step, setStep] = useState(0);

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

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const hold = () => {
    holdUntil.current = performance.now() + 3000;
  };

  const advance = () => {
    setStep((prev) => (prev + 1) % N);
    hold();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      advance();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setStep((prev) => Math.min(N - 1, prev + 1));
      hold();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      setStep((prev) => Math.max(0, prev - 1));
      hold();
    }
  };

  return (
    <div ref={pinRef} className={styles.oriPin}>
      <section className={styles.oriSec}>
        <Container>
          <div className="mb-1.5 max-w-[680px]">
            <Eyebrow tone="light">The origami fold</Eyebrow>
            <h2 className="font-serif text-[clamp(30px,4vw,54px)] font-semibold leading-[1.02] tracking-[-0.02em] text-[#F6F5F1]">
              Watch paper <Highlight tone="gold">learn to fly.</Highlight>
            </h2>
          </div>

          <div className={styles.oriGrid}>
            <div
              className={styles.oriStage}
              data-step={step}
              role="button"
              tabIndex={0}
              aria-label={`Origami crane folding diagram, step ${step + 1} of ${N}. Tap or press Enter to advance; use the arrow keys to step through.`}
              onClick={advance}
              onKeyDown={onKeyDown}
            >
              <div className={styles.oriSheet}>
                <svg
                  viewBox="0 0 200 200"
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: ORI_DEFS + ORI_SVGS[step] }}
                />
              </div>
              <div className={styles.oriShadow} aria-hidden="true" />
            </div>

            <div className={styles.oriPanel}>
              <p className={styles.oriLede}>
                Every craft starts the same way: one plain material, a little
                patience, and someone who knows the next fold. Scroll — and
                watch.
              </p>

              <div key={step} className={cn(styles.oriCard, styles.deal)}>
                <div className={styles.oriChip}>
                  <i />
                  <span>
                    Step {step + 1} of {N}
                  </span>
                </div>
                <h3>{STEPS[step].title}</h3>
                <p>{STEPS[step].body}</p>
                <div className={styles.oriProg}>
                  {STEPS.map((s, index) => (
                    <span
                      key={s.title}
                      className={cn(styles.oriDot, index <= step && styles.on)}
                    />
                  ))}
                </div>
              </div>

              <p className={styles.oriHintTxt}>Keep scrolling — or tap the paper</p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
