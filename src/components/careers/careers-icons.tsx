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

/** Circled "i" — the demo-page disclosure chip in the hero. */
export function InfoIcon({ className }: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={2} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01M11 12h1v4h1" />
    </svg>
  );
}

/** Dial with a needle — mission that matters. */
export function TargetIcon({ className }: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={1.8} className={className}>
      <path d="M12 2v4M12 22a10 10 0 1 0-10-10" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 12l6-4" />
    </svg>
  );
}

/** Two figures — a small team with outsized impact. */
export function PeopleIcon({ className }: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={1.8} className={className}>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="10" r="2.4" />
      <path d="M3 20c0-3 2.7-5 6-5s6 2 6 5M15 20c0-2 1-3.4 3-3.4S21 18 21 20" />
    </svg>
  );
}

/** Shield with a check — the trust-first culture card and Trust & Safety role. */
export function ShieldCheckIcon({ className }: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={1.8} className={className}>
      <path d="M12 3l7 3v5c0 4.4-3 8-7 10-4-2-7-5.6-7-10V6z" />
      <path d="M9.2 12l2 2 3.6-3.8" />
    </svg>
  );
}

/** Plain shield — the Trust & Safety department chip. */
export function ShieldIcon({ className }: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={2} className={className}>
      <path d="M12 3l7 3v5c0 4.4-3 8-7 10-4-2-7-5.6-7-10V6z" />
    </svg>
  );
}

/** Monitor on a stand — flexible and remote-friendly. */
export function MonitorIcon({ className }: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={1.8} className={className}>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4M7 8h6M7 11h4" />
    </svg>
  );
}

/** Lightbulb — the Community department chip. */
export function LightbulbIcon({ className }: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={2} className={className}>
      <path d="M9 18h6M12 3a6 6 0 0 0-3 11v2h6v-2a6 6 0 0 0-3-11z" />
    </svg>
  );
}

/** Graduation cap — the Educator Success department chip. */
export function CapIcon({ className }: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={2} className={className}>
      <path d="M12 3 3 8l9 5 9-5-9-5zM5 10v5l7 4 7-4v-5" />
    </svg>
  );
}

/** Angle brackets — the Engineering department chip. */
export function CodeIcon({ className }: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={2} className={className}>
      <path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" />
    </svg>
  );
}

/** Plus — the role card's expand affordance (rotates to a cross when open). */
export function PlusIcon({ className }: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={2.2} className={className}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

/** Checkmark — responsibility bullets and the trust-band points. */
export function CheckIcon({ className }: IconProps) {
  return (
    <svg {...STROKE} strokeWidth={2.2} className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/** Icon keys used by the "why work with us" cards. */
export type ValueIconName = "target" | "people" | "shield" | "monitor";

export const VALUE_ICONS: Record<ValueIconName, ComponentType<IconProps>> = {
  target: TargetIcon,
  people: PeopleIcon,
  shield: ShieldCheckIcon,
  monitor: MonitorIcon,
};

/** Icon keys used by the open-role department chips. */
export type RoleIconName = "lightbulb" | "cap" | "code" | "shield";

export const ROLE_ICONS: Record<RoleIconName, ComponentType<IconProps>> = {
  lightbulb: LightbulbIcon,
  cap: CapIcon,
  code: CodeIcon,
  shield: ShieldIcon,
};
