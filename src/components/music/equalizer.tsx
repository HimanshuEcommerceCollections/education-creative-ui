import { cn } from "@/lib/utils";

import styles from "./equalizer.module.css";

const BAR_COUNT = 18;
const STAGGER_MS = 90;
const DELAYS = Array.from({ length: BAR_COUNT }, (_, index) => index * STAGGER_MS);

/** Decorative animated equalizer; bars settle to a fixed height when reduced. */
export function Equalizer({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("flex h-[44px] items-end gap-[5px]", className)}
    >
      {DELAYS.map((delay) => (
        <i
          key={delay}
          style={{ animationDelay: `${delay}ms` }}
          className={cn(
            styles.bar,
            "w-[5px] rounded-[3px] bg-[linear-gradient(180deg,var(--color-gold),var(--color-slate))]",
          )}
        />
      ))}
    </div>
  );
}
