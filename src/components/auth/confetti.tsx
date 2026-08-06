"use client";

import { useState, type CSSProperties } from "react";

import styles from "./confetti.module.css";

const COLORS = ["#D2A241", "#2E3A73", "#F6F5F1", "#e6bd6a", "#3a4890"];
const COUNT = 70;

interface ConfettiPiece {
  id: number;
  style: CSSProperties;
}

/**
 * Build a burst of confetti pieces. Randomised, so it runs exactly once per
 * burst — as the lazy initialiser of the burst component's state, which mounts
 * only after a successful submit. Returns an empty burst under reduced motion.
 */
function createConfettiPieces(): ConfettiPiece[] {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return [];
  }

  return Array.from({ length: COUNT }, (_, index) => {
    const duration = 1.6 + Math.random() * 1.8;
    return {
      id: index,
      style: {
        left: `${Math.random() * 100}%`,
        width: `${7 + Math.random() * 5}px`,
        height: `${11 + Math.random() * 7}px`,
        background: COLORS[index % COLORS.length],
        borderRadius: Math.random() < 0.4 ? "50%" : undefined,
        transform: `translateY(-24px) rotate(${Math.random() * 360}deg)`,
        animationDuration: `${duration}s`,
        animationDelay: `${Math.random() * 0.5}s`,
      },
    };
  });
}

/**
 * Generates its pieces on mount and never re-randomises them.
 *
 * Split from `Confetti` so the randomness is tied to mounting rather than
 * pushed in from an effect — a form that owned the pieces in state had to
 * `setState` inside an effect to fill them, which triggers a cascading render.
 */
function ConfettiBurst() {
  const [pieces] = useState(createConfettiPieces);

  if (pieces.length === 0) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[8] overflow-hidden">
      {pieces.map((piece) => (
        <span key={piece.id} className={styles.piece} style={piece.style} />
      ))}
    </div>
  );
}

/** Confetti burst inside its overflow-hidden, positioned parent. */
export function Confetti({ show }: { show: boolean }) {
  if (!show) return null;
  return <ConfettiBurst />;
}
