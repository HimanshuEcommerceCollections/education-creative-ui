import { cn } from "@/lib/utils";

import styles from "./study-buddy.module.css";

export type BuddyState = "idle" | "cover" | "peek";

interface StudyBuddyProps {
  state: BuddyState;
  /** Square size in px (login uses 96, sign-up 84). */
  size?: number;
}

/**
 * Friendly mascot above the auth form: it covers its eyes while a hidden
 * password is typed and peeks once it's revealed. Purely decorative.
 */
export function StudyBuddy({ state, size = 96 }: StudyBuddyProps) {
  return (
    <div
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={cn(
        "mx-auto mb-[22px]",
        state === "cover" && styles.cover,
        state === "peek" && styles.peek,
      )}
    >
      <svg viewBox="0 0 120 120" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id="authBuddyGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3a4890" />
            <stop offset="1" stopColor="#232C59" />
          </linearGradient>
        </defs>
        <g className={styles.head}>
          <rect x="18" y="16" width="84" height="84" rx="26" fill="url(#authBuddyGrad)" />
          <circle cx="60" cy="18" r="4.5" fill="#D2A241" />
          <circle className={styles.eye} cx="46" cy="56" r="8" fill="#F6F5F1" />
          <circle className={styles.pupil} cx="46" cy="56" r="3.4" fill="#232C59" />
          <circle className={styles.eye} cx="74" cy="56" r="8" fill="#F6F5F1" />
          <circle className={styles.pupil} cx="74" cy="56" r="3.4" fill="#232C59" />
          <path
            className={styles.mouth}
            d="M50 76 Q60 84 70 76"
            fill="none"
            stroke="#F6F5F1"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
        <g className={styles.hands}>
          <path d="M26 106 Q30 80 44 60" stroke="#c8922f" strokeWidth="12" fill="none" strokeLinecap="round" />
          <path d="M94 106 Q90 80 76 60" stroke="#c8922f" strokeWidth="12" fill="none" strokeLinecap="round" />
          <ellipse cx="46" cy="55" rx="15.5" ry="14.5" fill="#D2A241" />
          <ellipse cx="74" cy="55" rx="15.5" ry="14.5" fill="#D2A241" />
          <g stroke="#a97f27" strokeWidth="1.7" strokeLinecap="round" opacity="0.65">
            <line x1="40" y1="46" x2="40" y2="61" />
            <line x1="46" y1="45" x2="46" y2="62" />
            <line x1="52" y1="46" x2="52" y2="61" />
            <line x1="68" y1="46" x2="68" y2="61" />
            <line x1="74" y1="45" x2="74" y2="62" />
            <line x1="80" y1="46" x2="80" y2="61" />
          </g>
        </g>
      </svg>
    </div>
  );
}
