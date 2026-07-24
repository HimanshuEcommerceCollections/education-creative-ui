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

/** Small check used for brand-panel ticks. */
export function TickIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2.2} className={className} {...STROKE}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/** Larger check for the success medallion. */
export function CheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={3} className={className} {...STROKE}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/** Eye — password shown. */
export function EyeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} className={className} {...STROKE}>
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/** Eye with slash — password hidden. */
export function EyeOffIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} className={className} {...STROKE}>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M6.61 6.61A18.5 18.5 0 0 0 1 12s4 8 11 8a9.12 9.12 0 0 0 5.06-1.55" />
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

/** Google "G" glyph (solid). */
export function GoogleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M21.35 11.1h-9.17v2.97h5.3c-.23 1.4-1.64 4.1-5.3 4.1-3.19 0-5.79-2.64-5.79-5.9s2.6-5.9 5.79-5.9c1.82 0 3.04.78 3.74 1.45l2.55-2.46C16.9 3.6 14.7 2.7 12.18 2.7 6.98 2.7 2.8 6.88 2.8 12.27s4.18 9.57 9.38 9.57c5.42 0 9-3.8 9-9.16 0-.62-.07-1.09-.16-1.58z" />
    </svg>
  );
}

/** Facebook "f" glyph (solid). */
export function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H17V3.6c-.29-.04-1.27-.12-2.4-.12-2.38 0-4 1.45-4 4.11V9.9H8v3.1h2.6V21z" />
    </svg>
  );
}

export type SocialIconName = "google" | "facebook";

/** Lookup used by the sign-in form's social buttons. */
export const SOCIAL_ICONS: Record<SocialIconName, ComponentType<IconProps>> = {
  google: GoogleIcon,
  facebook: FacebookIcon,
};
