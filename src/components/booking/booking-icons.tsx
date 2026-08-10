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

/** Tick — completed steps, consent rows, and the confirmation badge. */
export function CheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2.6} className={className} {...STROKE}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/** House — the in-home format. */
export function HomeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10" />
    </svg>
  );
}

/** Monitor — the online format. */
export function ScreenIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <rect x="2" y="4" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 18v3" />
    </svg>
  );
}

export function ChevronLeftIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} className={className} {...STROKE}>
      <path d="m14 6-6 6 6 6" />
    </svg>
  );
}

export function ChevronRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} className={className} {...STROKE}>
      <path d="m10 6 6 6-6 6" />
    </svg>
  );
}

/** Shield — supervision and safety notes. */
export function ShieldIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.9} className={className} {...STROKE}>
      <path d="M12 3l7 3v6c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6l7-3z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

/** Padlock — the payment step. */
export function LockIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.9} className={className} {...STROKE}>
      <rect x="4" y="10" width="16" height="11" rx="2.5" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} className={className} {...STROKE}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** Star — the educator rating. Solid, so it reads at 14px. */
export function StarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2.6l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.6l-5.9 3.2 1.2-6.6L2.5 9.6l6.6-.9L12 2.6z" />
    </svg>
  );
}

/** Clock — the confirmation timeline's pending state. */
export function ClockIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.9} className={className} {...STROKE}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}
