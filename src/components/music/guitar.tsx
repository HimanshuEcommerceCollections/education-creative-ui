"use client";

import { useCallback, useRef, useState, type CSSProperties } from "react";

import type { ToneFn } from "@/hooks/use-audio-engine";
import { cn } from "@/lib/utils";

import styles from "./guitar.module.css";

const FRETS = [14, 30, 44, 57, 68, 78, 86, 93];
const FRET_DOTS = [22, 50.5, 73];
const STRING_WIDTHS = ["4px", "3.4px", "2.9px", "2.4px", "2px", "1.6px"];
const STRING_HZ = [82.41, 110, 146.83, 196, 246.94, 329.63];

/** Six-string guitar neck; strings pluck on hover/press with a vibration. */
export function Guitar({ tone }: { tone: ToneFn }) {
  const [vibs, setVibs] = useState<Record<number, number>>({});
  const lastString = useRef(-1);

  const pluck = useCallback(
    (i: number) => {
      setVibs((prev) => ({ ...prev, [i]: (prev[i] ?? 0) + 1 }));
      tone(STRING_HZ[i], 1.1, "triangle", 0.16);
      tone(STRING_HZ[i] * 2, 0.5, "sine", 0.05);
    },
    [tone],
  );

  const handleEnter = useCallback(
    (i: number) => {
      if (i !== lastString.current) {
        pluck(i);
        lastString.current = i;
      }
    },
    [pluck],
  );

  const handleDown = useCallback(
    (i: number) => {
      pluck(i);
      lastString.current = i;
    },
    [pluck],
  );

  const handleNeckLeave = useCallback(() => {
    lastString.current = -1;
  }, []);

  return (
    <div className={styles.guitar}>
      <div className={styles.gNeck} aria-hidden="true" onPointerLeave={handleNeckLeave}>
        {FRETS.map((left) => (
          <div key={`fret-${left}`} className={styles.fret} style={{ left: `${left}%` }} />
        ))}
        {FRET_DOTS.map((left) => (
          <div key={`dot-${left}`} className={styles.fdot} style={{ left: `${left}%` }} />
        ))}
        {STRING_WIDTHS.map((width, i) => (
          <div
            key={width}
            className={styles.gs}
            onPointerEnter={() => handleEnter(i)}
            onPointerDown={() => handleDown(i)}
          >
            <span
              key={`gw-${i}-${vibs[i] ?? 0}`}
              style={{ "--gw": width } as CSSProperties}
              className={cn(styles.gw, (vibs[i] ?? 0) > 0 && styles.vib)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
