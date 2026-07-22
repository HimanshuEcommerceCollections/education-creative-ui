"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

import type { ToneFn } from "@/hooks/use-audio-engine";
import { cn } from "@/lib/utils";

import styles from "./piano.module.css";

const WHITE_COUNT = 21;
const WHITE_OFFSETS = [0, 2, 4, 5, 7, 9, 11] as const;
const BLACK_OFFSETS: Record<number, number> = { 0: 1, 1: 3, 3: 6, 4: 8, 5: 10 };
const IDLE_MS = 5000;

/** Black keys: center position (% of the strip) plus octave/semitone data. */
const BLACK_KEYS: { center: number; w: number; j: number }[] = [
  { center: 4.762, w: 0, j: 0 },
  { center: 9.524, w: 1, j: 1 },
  { center: 19.048, w: 3, j: 3 },
  { center: 23.81, w: 4, j: 4 },
  { center: 28.571, w: 5, j: 5 },
  { center: 38.095, w: 7, j: 0 },
  { center: 42.857, w: 8, j: 1 },
  { center: 52.381, w: 10, j: 3 },
  { center: 57.143, w: 11, j: 4 },
  { center: 61.905, w: 12, j: 5 },
  { center: 71.429, w: 14, j: 0 },
  { center: 76.19, w: 15, j: 1 },
  { center: 85.714, w: 17, j: 3 },
  { center: 90.476, w: 18, j: 4 },
  { center: 95.238, w: 19, j: 5 },
];

const WHITE_KEYS = Array.from({ length: WHITE_COUNT }, (_, index) => index);

const midiHz = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

/** Pointer-swept 3D piano that plays notes and idles with a gentle wave. */
export function Piano({ tone }: { tone: ToneFn }) {
  const keysRef = useRef<HTMLDivElement>(null);
  const [pressedWhite, setPressedWhite] = useState<number | null>(null);
  const [pressedBlack, setPressedBlack] = useState<number | null>(null);
  const [idle, setIdle] = useState(true);

  const inside = useRef(false);
  const pointerX = useRef<number | null>(null);
  const lastWhite = useRef(-1);
  const lastBlack = useRef(-1);
  const rafRef = useRef<number | null>(null);
  const idleTimer = useRef<number | null>(null);

  const playWhite = useCallback(
    (i: number) => {
      const octave = Math.floor(i / 7);
      const step = WHITE_OFFSETS[i % 7];
      tone(midiHz(60 + octave * 12 + step), 0.9, "triangle", 0.14);
    },
    [tone],
  );

  const playBlack = useCallback(
    (index: number) => {
      const { w, j } = BLACK_KEYS[index];
      const octave = Math.floor(w / 7);
      tone(midiHz(60 + octave * 12 + BLACK_OFFSETS[j]), 0.9, "triangle", 0.13);
    },
    [tone],
  );

  const clearPress = useCallback(() => {
    setPressedWhite(null);
    setPressedBlack(null);
    lastWhite.current = -1;
    lastBlack.current = -1;
  }, []);

  const wake = useCallback(() => {
    setIdle(false);
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setIdle(true), IDLE_MS);
  }, []);

  const apply = useCallback(() => {
    rafRef.current = null;
    const box = keysRef.current;
    if (!inside.current || pointerX.current === null || !box) return;
    const rect = box.getBoundingClientRect();
    if (rect.width <= 0) return;
    const fraction = (pointerX.current - rect.left) / rect.width;
    if (fraction < 0 || fraction > 1) {
      clearPress();
      return;
    }
    const idx = Math.min(WHITE_COUNT - 1, Math.floor(fraction * WHITE_COUNT));
    const threshold = 0.5 / WHITE_COUNT;
    let blackHit = -1;
    for (let i = 0; i < BLACK_KEYS.length; i += 1) {
      if (Math.abs(BLACK_KEYS[i].center / 100 - fraction) < threshold) {
        blackHit = i;
        break;
      }
    }

    setPressedWhite(idx);
    setPressedBlack(blackHit >= 0 ? blackHit : null);

    if (blackHit > -1) {
      if (blackHit !== lastBlack.current) {
        playBlack(blackHit);
        lastBlack.current = blackHit;
      }
      lastWhite.current = idx;
    } else {
      lastBlack.current = -1;
      if (idx !== lastWhite.current) {
        playWhite(idx);
        lastWhite.current = idx;
      }
    }
  }, [clearPress, playBlack, playWhite]);

  const handleMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      pointerX.current = event.clientX;
      wake();
      if (!rafRef.current) rafRef.current = requestAnimationFrame(apply);
    },
    [apply, wake],
  );

  const handleEnter = useCallback(() => {
    inside.current = true;
    wake();
  }, [wake]);

  const handleLeave = useCallback(() => {
    inside.current = false;
    pointerX.current = null;
    clearPress();
    wake();
  }, [clearPress, wake]);

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
    },
    [],
  );

  return (
    <div className={styles.pianoStage}>
      <div className={cn(styles.piano, idle && styles.idle)}>
        <div
          ref={keysRef}
          className={styles.pKeys}
          aria-hidden="true"
          onPointerEnter={handleEnter}
          onPointerLeave={handleLeave}
          onPointerMove={handleMove}
        >
          {WHITE_KEYS.map((i) => (
            <div
              key={i}
              style={{ "--i": i } as CSSProperties}
              className={cn(
                styles.wk,
                pressedWhite === i && styles.press,
                (pressedWhite === i - 1 || pressedWhite === i + 1) && styles.press2,
              )}
            >
              <i />
            </div>
          ))}
          {BLACK_KEYS.map((key, index) => (
            <div
              key={key.center}
              style={{ left: `calc(${key.center}% - 2.9%)` }}
              className={cn(styles.bk, pressedBlack === index && styles.press)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
