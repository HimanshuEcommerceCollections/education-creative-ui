import type { ComponentType } from "react";

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

/** Checkmark — hero trust badges. */
export function CheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} className={className} {...STROKE}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/** Shield with a checkmark — credential review / COPPA. */
export function ShieldCheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6z" />
      <polyline points="9 12 11.5 14.5 15.5 9.5" />
    </svg>
  );
}

/** Plain shield — the COPPA band icon. */
export function ShieldIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6z" />
    </svg>
  );
}

/** Star — verified ratings. */
export function StarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <polygon points="12 2 15 8.5 22 9.5 17 14.5 18.2 21.5 12 18 5.8 21.5 7 14.5 2 9.5 9 8.5 12 2" />
    </svg>
  );
}

/** People — parent-managed contact. */
export function UsersIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

/** Document with lines — a revisitable record. */
export function DocumentIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <rect x="4" y="4" width="16" height="17" rx="2" />
      <line x1="8" y1="10" x2="16" y2="10" />
      <line x1="8" y1="14" x2="16" y2="14" />
      <line x1="8" y1="18" x2="12" y2="18" />
    </svg>
  );
}

/** Icon keys used by the Trust & Safety cards. */
export type TrustIconName = "shield-check" | "star" | "users" | "document";

export const TRUST_ICONS: Record<TrustIconName, ComponentType<IconProps>> = {
  "shield-check": ShieldCheckIcon,
  star: StarIcon,
  users: UsersIcon,
  document: DocumentIcon,
};
