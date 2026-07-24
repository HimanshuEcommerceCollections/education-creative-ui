"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import { Container } from "@/components/common/container";
import { Highlight } from "@/components/common/highlight";
import { ChevronIcon } from "@/components/common/icons";
import { Reveal } from "@/components/common/reveal";
import { SectionHeading } from "@/components/common/section-heading";
import { JOURNEY_STEPS } from "@/data/how-it-works";
import { cn } from "@/lib/utils";

import styles from "./journey-rack.module.css";

const N = JOURNEY_STEPS.length;

/** Position, blur, and stacking for a racked photo relative to the active one. */
function rackStyle(index: number, active: number): CSSProperties {
  const off = index - active;
  const depth = Math.abs(off);
  if (off === 0) {
    return {
      transform: "translate(-50%,-50%) scale(1)",
      filter: "none",
      opacity: 1,
      zIndex: 30,
      boxShadow: "0 40px 80px -30px rgba(35,40,70,0.5)",
    };
  }
  const dir = off > 0 ? 1 : -1;
  return {
    transform: `translate(-50%,-50%) translateX(${dir * 46 * depth}px) translateY(${depth * 10}px) scale(${1 - depth * 0.08})`,
    filter: `blur(${depth * 3}px) saturate(${1 - depth * 0.3})`,
    opacity: Math.max(0, 1 - depth * 0.5),
    zIndex: 20 - depth,
    boxShadow: "0 30px 60px -40px rgba(35,40,70,0.35)",
  };
}

/**
 * The Journey: a scroll-pinned "focus rack" of three photos that shuffle into
 * focus as the visitor moves through browse → connect → learn. Driven by
 * scroll progress through the tall pin, and also by the dots, arrows, and
 * prev/next buttons — which briefly pause scroll-takeover so the pick sticks.
 */
export function JourneyRack() {
  const pinRef = useRef<HTMLDivElement>(null);
  const holdRef = useRef(0);
  const [step, setStep] = useState(0);

  const clamp = (next: number) => Math.max(0, Math.min(N - 1, next));

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
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      const rect = pin!.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      holdRef.current = performance.now() + 3000;
      setStep((prev) =>
        Math.max(0, Math.min(N - 1, prev + (event.key === "ArrowRight" ? 1 : -1))),
      );
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    document.addEventListener("keydown", onKeyDown);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const current = JOURNEY_STEPS[step];

  return (
    <div
      ref={pinRef}
      className="relative h-[340vh] bg-[linear-gradient(180deg,var(--ivory)_0%,#EFEDE7_100%)]"
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <Container>
          <Reveal>
            <SectionHeading
              className="mb-11"
              eyebrow="The Journey"
              title={
                <>
                  From first look to first <Highlight>lesson.</Highlight>
                </>
              }
            />
          </Reveal>

          <div className="grid grid-cols-2 items-center gap-14 max-[960px]:grid-cols-1 max-[960px]:gap-[34px]">
            <div className="relative h-[500px] [perspective:1400px] max-[960px]:h-[360px]">
              {JOURNEY_STEPS.map((journeyStep, index) => (
                <div
                  key={journeyStep.title}
                  style={rackStyle(index, step)}
                  className="absolute left-1/2 top-1/2 h-[435px] w-[340px] max-w-[80%] overflow-hidden rounded-[18px] transition-[transform,filter,opacity,box-shadow] duration-[850ms] ease-brand"
                >
                  <Image
                    src={journeyStep.image.src}
                    alt={journeyStep.image.alt}
                    fill
                    sizes="340px"
                    className="object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(15,17,32,0),rgba(15,17,32,0.82))] px-[22px] pb-5 pt-[26px] font-serif text-[18px] font-semibold tracking-[0.02em] text-white">
                    {journeyStep.caption}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-[20px] border border-line bg-white p-[38px_40px] shadow-[0_30px_60px_-44px_rgba(35,40,70,0.4)]">
              <span className="mb-5 inline-block rounded-[20px] bg-[rgba(46,58,115,0.1)] px-[14px] py-[6px] text-[11px] font-bold uppercase tracking-[0.14em] text-slate">
                Step {step + 1} of {N}
              </span>
              <div key={step} className={styles.stepBody}>
                <h3 className="mb-[14px] font-serif text-[clamp(22px,2.4vw,30px)] font-semibold tracking-[-0.01em] text-ink">
                  {current.title}
                </h3>
                <p className="text-[15.5px] leading-[1.65] text-muted">{current.body}</p>
              </div>

              <div className="mt-[30px] flex gap-[9px]">
                {JOURNEY_STEPS.map((journeyStep, index) => (
                  <button
                    key={journeyStep.title}
                    type="button"
                    aria-label={`Step ${index + 1}`}
                    aria-current={index === step}
                    onClick={() => {
                      setStep(clamp(index));
                      holdRef.current = performance.now() + 3000;
                    }}
                    className={cn(
                      "h-1 rounded-[4px] transition-[background-color,width] duration-[400ms]",
                      index === step ? "w-[44px] bg-gold" : "w-[30px] bg-sand2",
                    )}
                  />
                ))}
              </div>

              <div className="mt-[26px] flex gap-3">
                <button
                  type="button"
                  aria-label="Previous step"
                  disabled={step === 0}
                  onClick={() => {
                    setStep((prev) => clamp(prev - 1));
                    holdRef.current = performance.now() + 3000;
                  }}
                  className="flex h-[42px] w-[42px] items-center justify-center rounded-full border-[1.5px] border-[rgba(22,24,29,0.22)] text-ink transition-[background-color,border-color,opacity] duration-300 enabled:hover:border-[rgba(22,24,29,0.4)] enabled:hover:bg-[rgba(22,24,29,0.05)] disabled:cursor-default disabled:opacity-30"
                >
                  <ChevronIcon
                    direction="left"
                    className="h-4 w-4 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:2]"
                  />
                </button>
                <button
                  type="button"
                  aria-label="Next step"
                  disabled={step === N - 1}
                  onClick={() => {
                    setStep((prev) => clamp(prev + 1));
                    holdRef.current = performance.now() + 3000;
                  }}
                  className="flex h-[42px] w-[42px] items-center justify-center rounded-full border-[1.5px] border-[rgba(22,24,29,0.22)] text-ink transition-[background-color,border-color,opacity] duration-300 enabled:hover:border-[rgba(22,24,29,0.4)] enabled:hover:bg-[rgba(22,24,29,0.05)] disabled:cursor-default disabled:opacity-30"
                >
                  <ChevronIcon
                    direction="right"
                    className="h-4 w-4 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:2]"
                  />
                </button>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
