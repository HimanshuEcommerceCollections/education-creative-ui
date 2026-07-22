"use client";

import { useEffect, useState } from "react";

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/** Format a numeric value with optional decimals and a trailing suffix. */
export function formatCount(
  value: number,
  decimals: number,
  suffix: string,
): string {
  const number =
    decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
  return `${number}${suffix}`;
}

interface CountUpOptions {
  decimals?: number;
  suffix?: string;
  durationMs?: number;
  /** Start (and, from zero, run) the animation when true. */
  active: boolean;
}

/**
 * Animates a number from zero to `value` once `active` becomes true, easing
 * out over `durationMs`. Reduced motion jumps straight to the final value.
 * Returns the formatted display string.
 */
export function useCountUp(
  value: number,
  { decimals = 0, suffix = "", durationMs = 1400, active }: CountUpOptions,
): string {
  const [display, setDisplay] = useState(() => formatCount(0, decimals, suffix));

  useEffect(() => {
    if (!active) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let start: number | null = null;

    const step = (now: number) => {
      if (start === null) start = now;
      const progress = reduced ? 1 : Math.min(1, (now - start) / durationMs);
      setDisplay(formatCount(value * easeOutCubic(progress), decimals, suffix));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [active, value, decimals, suffix, durationMs]);

  return display;
}
