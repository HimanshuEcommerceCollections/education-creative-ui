import type { ComponentType } from "react";

import type { AboutIconName } from "@/data/about";

interface IconProps {
  className?: string;
}

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

/** Shield with a check — "Vetted, always" / "Credential Review". */
export function ShieldIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <path d="M12 3l7 3v5c0 4.4-3 7.5-7 9-4-1.5-7-4.6-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

/** Single person — "Parents in control". */
export function UserIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <path d="M12 14a4 4 0 100-8 4 4 0 000 8z" />
      <path d="M5 20c.7-3 3.6-5 7-5s6.3 2 7 5" />
    </svg>
  );
}

/** Stacked lines — "Honest by default". */
export function LinesIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <path d="M4 6h16M4 12h16M4 18h10" />
    </svg>
  );
}

/** Map pin — "Local & personal". */
export function PinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <path d="M12 21s-7-4.6-7-10a7 7 0 0114 0c0 5.4-7 10-7 10z" />
      <circle cx="12" cy="11" r="2.4" />
    </svg>
  );
}

/** Document with lines — "A record you can revisit". */
export function RecordIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <path d="M4 5a2 2 0 012-2h9l5 5v11a2 2 0 01-2 2H6a2 2 0 01-2-2z" />
      <path d="M14 3v5h5" />
      <path d="M8 13h8M8 17h6" />
    </svg>
  );
}

/** Star — "Confirmed, or Refunded". */
export function StarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <path d="M12 4l2.3 4.7 5.2.8-3.8 3.7.9 5.1L12 16l-4.6 2.3.9-5.1L4.5 9.5l5.2-.8L12 4z" />
    </svg>
  );
}

/** Speech bubble — "Parent-Managed Contact". */
export function ChatIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <path d="M4 5h16v11H7l-3 3z" />
      <path d="M8 10h8M8 13h5" />
    </svg>
  );
}

/** Left chevron — coverflow "previous" control. */
export function ChevronLeftIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} className={className} {...STROKE}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

/** Right chevron — coverflow "next" control. */
export function ChevronRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} className={className} {...STROKE}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

/** Maps the data-layer icon keys to their components. */
export const ABOUT_ICONS: Record<AboutIconName, ComponentType<IconProps>> = {
  shield: ShieldIcon,
  user: UserIcon,
  lines: LinesIcon,
  pin: PinIcon,
  record: RecordIcon,
  star: StarIcon,
  chat: ChatIcon,
};
