import type { ComponentType } from "react";

interface IconProps {
  className?: string;
}

const STROKE = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "aria-hidden": true,
} as const;

/** Checkmark — the requirement-card chips. */
export function CheckIcon({ className }: IconProps) {
  return (
    <svg
      {...STROKE}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

/** Plain shield — independent-professional standing. */
export function ShieldIcon({ className }: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={1.8} strokeLinejoin="round" className={className}>
      <path d="M12 3l7 4v5c0 4-3 7-7 8-4-1-7-4-7-8V7l7-4z" />
    </svg>
  );
}

/** Person over a shoulder line — parent-supervised sessions. */
export function UsersIcon({ className }: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={1.8} className={className}>
      <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" />
      <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" strokeLinecap="round" />
    </svg>
  );
}

/** Circled exclamation — the no-guaranteed-outcomes note. */
export function InfoIcon({ className }: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={1.8} className={className}>
      <path d="M12 8v5" strokeLinecap="round" />
      <circle cx="12" cy="16.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

/** Icon keys used by the "good to know" cards. */
export type GoodToKnowIconName = "shield" | "users" | "info";

export const GOOD_TO_KNOW_ICONS: Record<GoodToKnowIconName, ComponentType<IconProps>> = {
  shield: ShieldIcon,
  users: UsersIcon,
  info: InfoIcon,
};
