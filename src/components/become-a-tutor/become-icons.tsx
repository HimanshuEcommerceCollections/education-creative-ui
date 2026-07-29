import type { ComponentType } from "react";

interface IconProps {
  className?: string;
}

const STROKE = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

/** Dollar sign — you set your own hourly rate. */
export function RateIcon({ className }: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={1.8} className={className}>
      <line x1="12" y1="2" x2="12" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

/** House — in-home sessions (paired with online in the copy). */
export function HomeIcon({ className }: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={1.8} className={className}>
      <path d="M3 9.5 12 3l9 6.5" />
      <path d="M5 8.5V21h14V8.5" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}

/** Calendar with a check — parent-managed bookings. */
export function CalendarCheckIcon({ className }: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={1.8} className={className}>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <polyline points="9 15 11 17 15 13" />
    </svg>
  );
}

/** Map pin — reaching local Raleigh families. */
export function PinIcon({ className }: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={1.8} className={className}>
      <path d="M12 21s-7-4.35-7-10a7 7 0 0 1 14 0c0 5.65-7 10-7 10z" />
      <circle cx="12" cy="11" r="2.5" />
    </svg>
  );
}

/** Shield with a check — the credential-review reassurance note. */
export function ShieldCheckIcon({ className }: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={1.8} className={className}>
      <path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6z" />
      <polyline points="9 12 11.5 14.5 15.5 9.5" />
    </svg>
  );
}

/** Plain shield — the parent-supervision footnote in the requirements band. */
export function ShieldIcon({ className }: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={1.9} className={className}>
      <path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6z" />
    </svg>
  );
}

/** Checkmark — the application-received confirmation. */
export function CheckIcon({ className }: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={2} className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/** Chevron — the custom indicator on the form's native selects. */
export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={2.2} className={className}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/** Icon keys used by the "why teach with us" benefit cards. */
export type TeachBenefitIconName = "rate" | "home" | "calendar" | "pin";

export const TEACH_BENEFIT_ICONS: Record<TeachBenefitIconName, ComponentType<IconProps>> = {
  rate: RateIcon,
  home: HomeIcon,
  calendar: CalendarCheckIcon,
  pin: PinIcon,
};
