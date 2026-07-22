interface IconProps {
  className?: string;
}

/** Filled eighth-note glyph for the drifting feature-photo notes. */
export function MusicNoteGlyph({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M9 17.5A2.5 2.5 0 1 1 6.5 15c.9 0 1.7.4 2.1 1V5.6l9-2.1v10.6a2.5 2.5 0 1 1-1.4-2.2V6.3L10 7.8v9.7z" />
    </svg>
  );
}

/* --- dice faces (inherit color/size from the .cf face) --- */

const FACE_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

/** Piano keyboard (dice front/back). */
export function PianoFaceIcon() {
  return (
    <svg {...FACE_PROPS}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M8 5v9M12 5v9M16 5v9" />
    </svg>
  );
}

/** Guitar (dice right/left). */
export function GuitarFaceIcon() {
  return (
    <svg {...FACE_PROPS}>
      <path d="M20 4l-6.5 6.5" />
      <path d="M17.5 2.5L21.5 6.5" />
      <circle cx="8.5" cy="15.5" r="5" />
      <circle cx="8.5" cy="15.5" r="1.6" />
    </svg>
  );
}

/** Drum (dice top/bottom). */
export function DrumsFaceIcon() {
  return (
    <svg {...FACE_PROPS}>
      <ellipse cx="12" cy="8" rx="8" ry="3.4" />
      <path d="M4 8v8c0 1.9 3.6 3.4 8 3.4s8-1.5 8-3.4V8" />
      <path d="M3.5 3l5 5.5M20.5 3l-5 5.5" />
    </svg>
  );
}

