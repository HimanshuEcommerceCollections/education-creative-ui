"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { NoiseFn, ToneFn } from "@/hooks/use-audio-engine";
import { cn } from "@/lib/utils";

import styles from "./drums.module.css";

type DrumKind = "hat" | "snare" | "kick" | "tom" | "crash";

/** Per-pad module class (replaces the source's dynamic `dp-<kind>` name). */
const PAD_CLASS: Record<DrumKind, string> = {
  hat: styles.dpHat,
  snare: styles.dpSnare,
  kick: styles.dpKick,
  tom: styles.dpTom,
  crash: styles.dpCrash,
};

/** Rendered left-to-right, matching the source's kit layout. */
const PADS: { kind: DrumKind; label: string }[] = [
  { kind: "hat", label: "Hi-hat" },
  { kind: "snare", label: "Snare" },
  { kind: "kick", label: "Kick" },
  { kind: "tom", label: "Tom" },
  { kind: "crash", label: "Crash" },
];

const RETRIGGER_MS = 140;
const HIT_MS = 300;

/** Five-piece kit; pads sound and flash on hover/press. */
export function Drums({ tone, noise }: { tone: ToneFn; noise: NoiseFn }) {
  const [active, setActive] = useState<Record<string, boolean>>({});
  const lastHit = useRef<Record<string, number>>({});
  const timers = useRef<Record<string, number>>({});

  const play = useCallback(
    (kind: DrumKind) => {
      switch (kind) {
        case "kick":
          tone(140, 0.28, "sine", 0.5, 42);
          break;
        case "snare":
          tone(190, 0.14, "triangle", 0.18, 120);
          noise(0.2, 0.22, "bandpass", 1800);
          break;
        case "tom":
          tone(200, 0.3, "sine", 0.3, 95);
          break;
        case "hat":
          noise(0.08, 0.16, "highpass", 7000);
          break;
        case "crash":
          noise(0.9, 0.2, "highpass", 4500);
          break;
      }
    },
    [noise, tone],
  );

  const hit = useCallback(
    (kind: DrumKind) => {
      const now = performance.now();
      const previous = lastHit.current[kind];
      if (previous && now - previous < RETRIGGER_MS) return;
      lastHit.current[kind] = now;

      setActive((state) => ({ ...state, [kind]: true }));
      if (timers.current[kind]) window.clearTimeout(timers.current[kind]);
      timers.current[kind] = window.setTimeout(() => {
        setActive((state) => ({ ...state, [kind]: false }));
      }, HIT_MS);

      play(kind);
    },
    [play],
  );

  useEffect(
    () => () => {
      Object.values(timers.current).forEach((id) => window.clearTimeout(id));
    },
    [],
  );

  return (
    <div className={styles.drums}>
      <div className={styles.drumFloor} aria-hidden="true">
        {PADS.map(({ kind, label }) => (
          <button
            type="button"
            key={kind}
            className={cn(styles.dp, PAD_CLASS[kind], active[kind] && styles.hit)}
            onPointerEnter={() => hit(kind)}
            onPointerDown={() => hit(kind)}
          >
            <span className={styles.dpTop} />
            <span className={styles.dpLbl}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
