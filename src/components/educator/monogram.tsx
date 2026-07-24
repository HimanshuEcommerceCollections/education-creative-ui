import { cn } from "@/lib/utils";

import styles from "./monogram.module.css";

interface MonogramProps {
  /** Initials shown centered (e.g. "EM"). */
  initials: string;
  /** Tailwind font-size class for the initials, so callers scale it. */
  size: string;
  /** Optional uppercase caption pinned to the bottom edge. */
  slot?: string;
  className?: string;
}

/**
 * Decorative educator portrait placeholder. Fills its parent — give the parent
 * the size, radius and `overflow-hidden`. Swap for a real `<Image>` when photos
 * are available.
 */
export function Monogram({ initials, size, slot, className }: MonogramProps) {
  return (
    <div aria-hidden="true" className={cn(styles.ph, className)}>
      <span className={cn(styles.mono, size)}>{initials}</span>
      {slot ? <span className={styles.slot}>{slot}</span> : null}
    </div>
  );
}
