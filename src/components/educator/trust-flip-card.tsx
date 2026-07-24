"use client";

import { useState } from "react";

import { CheckIcon, ShieldCheckIcon } from "./educator-icons";
import styles from "./flip-card.module.css";

const REVIEWED = [
  "Teaching background verified",
  "References checked",
  "Identity confirmed",
];

/**
 * Platform-level "credentials reviewed" assurance. The content is the same for
 * every educator, so it isn't data-driven. Flips on hover/focus and also on
 * click or Enter/Space for touch and keyboard users.
 */
export function TrustFlipCard() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div>
      <h2 className="mb-5 font-serif text-[clamp(22px,2.4vw,28px)] font-semibold tracking-[-0.01em]">
        Trust &amp; safety
      </h2>

      <div className={styles.scene}>
        <div
          role="button"
          tabIndex={0}
          aria-pressed={flipped}
          aria-label="Credentials reviewed — flip for what we reviewed"
          onClick={() => setFlipped((value) => !value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setFlipped((value) => !value);
            }
          }}
          className={`${styles.card} ${flipped ? styles.flipped : ""} outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2`}
        >
          <div className={styles.front}>
            <span className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-slate text-white">
              <ShieldCheckIcon className="h-7 w-7" />
            </span>
            <h3 className="mt-5 font-serif text-[22px] font-semibold text-ink">
              Credentials reviewed
            </h3>
            <p className="mt-2 text-[14.5px] leading-[1.6] text-muted">
              Every educator goes through our onboarding review before they appear here. Hover or
              tap to see what that covers.
            </p>
            <span className="mt-auto pt-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-slate">
              Tap to flip
            </span>
          </div>

          <div className={styles.back}>
            <h3 className="font-serif text-[22px] font-semibold text-white">What we reviewed</h3>
            <ul className="mt-4 flex flex-col gap-[10px]">
              {REVIEWED.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[14.5px]">
                  <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[rgba(210,162,65,0.22)] text-gold">
                    <CheckIcon className="h-[14px] w-[14px]" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-auto pt-4 text-[12.5px] leading-[1.55] text-[rgba(244,241,234,0.6)]">
              Review is a process we follow, not a promise of any particular result. Parents remain
              responsible for booking and supervising sessions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
