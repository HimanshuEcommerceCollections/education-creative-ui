"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import { Container } from "@/components/common/container";
import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { SectionHeading } from "@/components/common/section-heading";
import { CheckIcon } from "@/components/how-it-works/how-it-works-icons";
import { BOOKING_STEPS } from "@/data/for-parents";
import { cn } from "@/lib/utils";

import styles from "./booking-stepper.module.css";
import { PARENT_ICONS } from "./for-parents-icons";

const N = BOOKING_STEPS.length;

/** Below this width the stepper is a plain tab list — nothing is pinned. */
const PIN_BREAKPOINT = 860;

const PANEL_ID = "booking-step-panel";

const tabId = (index: number) => `booking-step-tab-${index}`;

const clamp = (index: number) => Math.max(0, Math.min(N - 1, index));

/**
 * "A booking, from your side": a scroll-pinned stepper. Scroll progress through
 * a tall spacer drives which pane is shown, and a click jumps the page to that
 * step's slice of the scroll — so the rail and the scrollbar never disagree.
 * Below `PIN_BREAKPOINT` the pin is dropped and it behaves as a tab list.
 */
export function BookingStepper() {
  const pinRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  /** Timestamp until which scroll-driven stepping is paused after a keypress. */
  const holdRef = useRef(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const pin = pinRef.current;
    if (!pin) return;

    function onScroll() {
      if (window.innerWidth <= PIN_BREAKPOINT) return;
      const total = pin!.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const progress = Math.max(0, Math.min(1, -pin!.getBoundingClientRect().top / total));
      if (progressRef.current) {
        progressRef.current.style.width = `${(progress * 100).toFixed(1)}%`;
      }
      if (performance.now() < holdRef.current) return;
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

  /** Jump the page to the scroll slice that owns `index` (pinned layout only). */
  function goToStep(index: number) {
    const pin = pinRef.current;
    if (!pin || window.innerWidth <= PIN_BREAKPOINT) {
      setStep(index);
      return;
    }
    const total = pin.offsetHeight - window.innerHeight;
    const top = pin.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + ((index + 0.5) / N) * total, behavior: "smooth" });
    setStep(index);
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const offset =
      event.key === "ArrowDown" || event.key === "ArrowRight"
        ? 1
        : event.key === "ArrowUp" || event.key === "ArrowLeft"
          ? -1
          : 0;
    if (!offset) return;
    event.preventDefault();
    const next = clamp(step + offset);
    holdRef.current = performance.now() + 3000;
    setStep(next);
    tabsRef.current[next]?.focus();
  }

  const current = BOOKING_STEPS[step];
  const CurrentIcon = PARENT_ICONS[current.icon];

  return (
    <section className="bg-sand pt-[13vh] max-[860px]:pb-[13vh]">
      <Container>
        <Reveal>
          <SectionHeading
            className="mb-[60px]"
            eyebrow="Your Part Is Simple"
            title={
              <>
                A booking, <Highlight>from your side.</Highlight>
              </>
            }
            description="Scroll to move through each step — or tap one to jump. See exactly what you do, and what stays in your hands."
          />
        </Reveal>
      </Container>

      <div ref={pinRef} className="relative h-[320vh] max-[860px]:h-auto">
        <div className="sticky top-0 flex h-screen items-center py-10 max-[860px]:static max-[860px]:block max-[860px]:h-auto max-[860px]:py-0">
          <div
            aria-hidden="true"
            ref={progressRef}
            className="absolute inset-x-0 top-0 z-[3] h-[3px] w-0 bg-[linear-gradient(90deg,var(--gold),var(--slate))] transition-[width] duration-[250ms] ease-out max-[860px]:hidden"
          />

          <Container>
            <div className="grid grid-cols-[0.92fr_1.08fr] items-center gap-12 max-[860px]:grid-cols-1 max-[860px]:gap-7">
              <Reveal>
                {/* The tablist hosts the roving-tabindex keydown; each tab is a
                    real button, so focus stays on an interactive element. */}
                <div
                  role="tablist"
                  aria-label="How a booking works"
                  aria-orientation="vertical"
                  onKeyDown={onTabKeyDown}
                  className="relative flex flex-col gap-1"
                >
                  <span
                    aria-hidden="true"
                    className="absolute bottom-[30px] left-7 top-[30px] w-0.5 bg-[rgba(46,58,115,0.16)]"
                  />

                  {BOOKING_STEPS.map((bookingStep, index) => {
                    const active = index === step;
                    return (
                      <button
                        key={bookingStep.label}
                        type="button"
                        role="tab"
                        id={tabId(index)}
                        ref={(node) => {
                          tabsRef.current[index] = node;
                        }}
                        aria-selected={active}
                        aria-controls={PANEL_ID}
                        tabIndex={active ? 0 : -1}
                        onClick={() => goToStep(index)}
                        className={cn(
                          "relative cursor-pointer rounded-2xl border-none py-[26px] pl-[68px] pr-[26px] text-left font-sans transition-colors duration-300",
                          active
                            ? "bg-ivory shadow-[0_20px_44px_-30px_rgba(24,24,24,0.4)]"
                            : "bg-transparent hover:bg-white/50",
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "absolute left-[22px] top-1/2 z-[1] h-[18px] w-[18px] -translate-y-1/2 rounded-full border-2 transition-[background-color,border-color,transform] duration-300",
                            active
                              ? "scale-[1.14] border-gold bg-gold"
                              : "border-[rgba(46,58,115,0.45)] bg-sand",
                          )}
                        />
                        <span className="block font-serif text-[20px] font-semibold text-ink">
                          {index + 1} · {bookingStep.label}
                        </span>
                        <small className="mt-[5px] block text-[15px] text-muted">
                          {bookingStep.hint}
                        </small>
                      </button>
                    );
                  })}
                </div>
              </Reveal>

              <div
                id={PANEL_ID}
                role="tabpanel"
                aria-labelledby={tabId(step)}
                className="relative flex min-h-[520px] items-center overflow-hidden rounded-[24px] border border-line bg-ivory px-[54px] py-14 shadow-[0_30px_60px_-44px_rgba(24,24,24,0.4)] max-[560px]:min-h-0 max-[560px]:px-7 max-[560px]:py-9"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-20 -top-20 h-[260px] w-[260px] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(210,162,65,0.14),rgba(210,162,65,0)_70%)]"
                />

                <div key={step} className={cn(styles.stepPane, "relative z-[1] w-full")}>
                  <p className="mb-[18px] text-[12.5px] font-bold uppercase tracking-[0.22em] text-gold">
                    Step {step + 1}
                  </p>

                  <span className="mb-[26px] flex h-[68px] w-[68px] items-center justify-center rounded-[18px] bg-slate text-white">
                    <CurrentIcon className="h-[33px] w-[33px]" />
                  </span>

                  <h3 className="mb-4 font-serif text-[clamp(28px,2.7vw,36px)] font-semibold tracking-[-0.015em]">
                    {current.title}
                  </h3>
                  <p className="max-w-[54ch] text-[18px] leading-[1.7] text-muted">
                    {current.body}
                  </p>

                  <ul className="mt-[30px] grid list-none gap-4">
                    {current.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-[14px] text-[17px] leading-[1.55] text-ink"
                      >
                        <CheckIcon className="mt-[2px] h-[22px] w-[22px] flex-none text-slate" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
