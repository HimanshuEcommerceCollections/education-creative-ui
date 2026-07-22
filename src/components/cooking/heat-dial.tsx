"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { HEAT_STEPS } from "@/data/cooking";
import { cn } from "@/lib/utils";

import styles from "./heat-dial.module.css";

const N = HEAT_STEPS.length;

/** Bubble timing custom props. */
type BubStyle = CSSProperties & { "--bd": string; "--bdl": string };
/** Steam timing custom props. */
type SteamStyle = CSSProperties & { "--sd": string; "--sdl": string };

/** Simmering bubbles in the pot (positions/timings from the source). */
const BUBBLES: BubStyle[] = [
  { left: "48%", width: 7, height: 7, "--bd": "1.6s", "--bdl": "1.7s" },
  { left: "20%", width: 8, height: 8, "--bd": "2.5s", "--bdl": "0.2s" },
  { left: "53%", width: 9, height: 9, "--bd": "1.4s", "--bdl": "0.8s" },
  { left: "62%", width: 8, height: 8, "--bd": "2.3s", "--bdl": "0.3s" },
  { left: "34%", width: 6, height: 6, "--bd": "2.0s", "--bdl": "1.8s" },
  { left: "55%", width: 10, height: 10, "--bd": "1.9s", "--bdl": "1.5s" },
  { left: "26%", width: 7, height: 7, "--bd": "2.2s", "--bdl": "1.5s" },
  { left: "45%", width: 6, height: 6, "--bd": "1.7s", "--bdl": "0.4s" },
  { left: "37%", width: 10, height: 10, "--bd": "1.6s", "--bdl": "1.8s" },
];

/** Sear marks that appear at high heat. */
const SEARS: CSSProperties[] = [
  { left: "54%", top: "46%", width: 18, height: 12 },
  { left: "60%", top: "51%", width: 23, height: 9 },
  { left: "45%", top: "46%", width: 20, height: 15 },
  { left: "51%", top: "55%", width: 15, height: 12 },
  { left: "56%", top: "51%", width: 19, height: 15 },
];

/** Char flecks at the highest heat. */
const CHARFLECKS: CSSProperties[] = [
  { left: "46%", top: "45%", width: 5, height: 5 },
  { left: "29%", top: "54%", width: 4, height: 4 },
  { left: "56%", top: "74%", width: 3, height: 3 },
  { left: "53%", top: "56%", width: 3, height: 3 },
  { left: "38%", top: "76%", width: 6, height: 6 },
  { left: "30%", top: "61%", width: 6, height: 6 },
  { left: "36%", top: "56%", width: 3, height: 3 },
];

/** Rising steam wisps. */
const STEAM: SteamStyle[] = [
  { left: "30%", "--sd": "2.8s", "--sdl": "0.0s" },
  { left: "50%", "--sd": "3.3s", "--sdl": "0.6s" },
  { left: "70%", "--sd": "3.8s", "--sdl": "1.2s" },
  { left: "90%", "--sd": "4.3s", "--sdl": "1.8s" },
];

/** Heat tick labels arranged around the dial. */
const TICKS: { label: string; left: string; top: string }[] = [
  { label: "Low", left: "12%", top: "78%" },
  { label: "Med-low", left: "24%", top: "40%" },
  { label: "Medium", left: "50%", top: "24%" },
  { label: "Med-high", left: "76%", top: "40%" },
  { label: "High", left: "88%", top: "78%" },
];

/**
 * The Heat Dial: a scroll-pinned stove that turns from a gentle poach to a
 * fearless char. Scroll progress through the tall pin drives the heat step;
 * the dial also responds to click and arrow/enter keys, briefly ignoring
 * scroll after a manual change so the tap "sticks".
 */
export function HeatDial() {
  const pinRef = useRef<HTMLDivElement>(null);
  const holdRef = useRef(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const pin = pinRef.current;
    if (!pin) return;
    function onScroll() {
      if (performance.now() < holdRef.current) return;
      const total = pin!.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const rect = pin!.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / total));
      const next = Math.min(N - 1, Math.floor(progress * N));
      setStep((prev) => (next !== prev ? next : prev));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  function nudge() {
    holdRef.current = performance.now() + 3000;
  }
  function handleClick() {
    setStep((prev) => (prev + 1) % N);
    nudge();
  }
  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setStep((prev) => (prev + 1) % N);
      nudge();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setStep((prev) => Math.min(N - 1, prev + 1));
      nudge();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      setStep((prev) => Math.max(0, prev - 1));
      nudge();
    }
  }

  const current = HEAT_STEPS[step];

  return (
    <div ref={pinRef} className={styles.cookPin}>
      <section className={styles.cookSec}>
        <Container>
          <Reveal className="mb-2 max-w-[680px]">
            <Eyebrow tone="light">The heat dial</Eyebrow>
            <h2 className="font-serif text-[clamp(30px,4vw,54px)] font-semibold leading-[1.02] tracking-[-0.02em] text-[#F6F5F1]">
              Turn it up, <Highlight tone="gold">one notch at a time.</Highlight>
            </h2>
          </Reveal>

          <div className="grid grid-cols-[1fr_0.9fr] items-center gap-10 max-[960px]:grid-cols-1 max-[960px]:gap-3">
            <div
              className={styles.cookStage}
              data-step={step}
              role="button"
              tabIndex={0}
              aria-label="A stove heat dial. Tap or use arrow keys to turn the heat up and see how the pot responds."
              onClick={handleClick}
              onKeyDown={handleKeyDown}
            >
              <div className={styles.dialWrap}>
                <div className={styles.burner} aria-hidden="true" />
                <div className={cn(styles.burnerRing, styles.ringR1)} aria-hidden="true" />
                <div className={cn(styles.burnerRing, styles.ringR2)} aria-hidden="true" />
                <div className={styles.heatGlow} aria-hidden="true" />

                <div className={styles.pot} aria-hidden="true">
                  <div className={styles.liquid}>
                    {BUBBLES.map((style, index) => (
                      <span key={`bub-${index}`} className={styles.bub} style={style} />
                    ))}
                    {SEARS.map((style, index) => (
                      <span key={`sear-${index}`} className={styles.sear} style={style} />
                    ))}
                    {CHARFLECKS.map((style, index) => (
                      <span key={`char-${index}`} className={styles.charfleck} style={style} />
                    ))}
                  </div>
                </div>

                <div className={styles.dialSteam} aria-hidden="true">
                  {STEAM.map((style, index) => (
                    <span key={`steam-${index}`} style={style} />
                  ))}
                </div>

                <div className={styles.knob} aria-hidden="true" />

                <div className="pointer-events-none absolute inset-0 z-[5]" aria-hidden="true">
                  {TICKS.map((tick, index) => (
                    <span
                      key={tick.label}
                      style={{ left: tick.left, top: tick.top, transform: "translate(-50%,-50%)" }}
                      className={cn(
                        "absolute text-[10px] font-bold uppercase tracking-[0.1em] transition-colors duration-[400ms]",
                        index === step ? "text-gold" : "text-[rgba(246,245,241,0.4)]",
                      )}
                    >
                      {tick.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-[18px]">
              <Reveal delay={1}>
                <p className="max-w-[430px] text-[16px] leading-[1.65] text-[rgba(246,245,241,0.62)]">
                  Heat is the whole game. Most home cooking goes wrong at the dial — too hot, too
                  soon, or too timid. Scroll to turn it up, and see what each level is really for.
                </p>
              </Reveal>

              <div
                key={step}
                className={cn(
                  styles.dealCard,
                  "flex flex-col gap-[9px] rounded-[18px] border border-[rgba(22,24,29,0.1)] bg-[linear-gradient(90deg,rgba(210,162,65,0.06),transparent_16%),#FBFAF7] p-[26px_30px] shadow-[0_34px_60px_rgba(0,0,0,0.5)] transition-[transform,box-shadow] duration-[400ms] hover:-translate-y-[5px] hover:shadow-[0_44px_74px_rgba(0,0,0,0.6)]",
                )}
              >
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate">
                  <i aria-hidden="true" className="h-[2px] w-[22px] bg-gold" />
                  <span>
                    Level {step + 1} of {N}
                  </span>
                  <span className="ml-auto rounded-full border border-[rgba(210,162,65,0.4)] bg-[rgba(210,162,65,0.12)] px-[11px] py-1 text-[10.5px] tracking-[0.12em] text-gold">
                    {current.badge}
                  </span>
                </div>
                <h3 className="font-serif text-[clamp(19px,2.3vw,25px)] font-bold text-ink">
                  {current.title}
                </h3>
                <p className="text-[14.5px] leading-[1.65] text-muted">{current.body}</p>
                <div className="mt-1 flex items-center gap-[10px]">
                  {HEAT_STEPS.map((heatStep, index) => (
                    <span
                      key={heatStep.badge}
                      className={cn(
                        "h-[9px] w-[9px] rounded-full transition-[background-color,transform] duration-300",
                        index <= step ? "scale-[1.3] bg-gold" : "bg-[rgba(22,24,29,0.16)]",
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="text-[11px] uppercase tracking-[0.14em] text-[rgba(246,245,241,0.45)]">
                Keep scrolling — or tap the dial
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
