interface ChevronIconProps {
  direction: "left" | "right";
  className?: string;
}

/** The stack control chevron — exact polylines from the source SVGs. */
export function ChevronIcon({ direction, className }: ChevronIconProps) {
  const points = direction === "left" ? "15 5 8 12 15 19" : "9 5 16 12 9 19";
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <polyline points={points} />
    </svg>
  );
}

/* --- sound toggle (shared by the music playground and the pop-quiz) --- */

const SPEAKER_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

export function SpeakerOnIcon({ className }: { className?: string }) {
  return (
    <svg {...SPEAKER_PROPS} className={className}>
      <path d="M11 5L6 9H3v6h3l5 4V5z" />
      <path d="M15.5 8.5a5 5 0 010 7M18.5 5.5a9 9 0 010 13" />
    </svg>
  );
}

export function SpeakerOffIcon({ className }: { className?: string }) {
  return (
    <svg {...SPEAKER_PROPS} className={className}>
      <path d="M11 5L6 9H3v6h3l5 4V5z" />
      <path d="M22 9l-6 6M16 9l6 6" />
    </svg>
  );
}
