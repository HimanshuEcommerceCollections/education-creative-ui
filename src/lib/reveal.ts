import { cn } from "@/lib/utils";

/** Staggered entrance delays matching the source `.r1`–`.r6` classes. */
export type RevealDelay = 1 | 2 | 3 | 4 | 5 | 6;

const DELAY_CLASS: Record<RevealDelay, string> = {
  1: "delay-[60ms]",
  2: "delay-[140ms]",
  3: "delay-[220ms]",
  4: "delay-[300ms]",
  5: "delay-[380ms]",
  6: "delay-[460ms]",
};

const BASE =
  "transition-[opacity,transform] duration-[1150ms] ease-[cubic-bezier(0.19,1,0.22,1)] motion-reduce:transition-none";

/**
 * Classes for the source `.reveal` fade-up: hidden until `inView`, then
 * settled. Shared so any element can reveal in place without a wrapper.
 */
export function revealClassName(inView: boolean, delay?: RevealDelay): string {
  return cn(
    BASE,
    inView ? "translate-y-0 opacity-100" : "translate-y-[34px] opacity-0",
    delay ? DELAY_CLASS[delay] : undefined,
  );
}
