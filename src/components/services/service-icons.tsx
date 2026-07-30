import type { ComponentType } from "react";

import type { ServiceIconName } from "@/data/services";

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

/** Page with lines — academic tutoring. */
function DocumentIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <path d="M4 5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
      <path d="M14 3v5h5" />
      <path d="M8 13h8M8 17h6" />
    </svg>
  );
}

/** Mortarboard — college admissions. */
function GraduationIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <path d="M22 10 12 5 2 10l10 5 10-5Z" />
      <path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5" />
      <path d="M22 10v5" />
    </svg>
  );
}

/** Beamed note — music. */
function NoteIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <path d="M9 18V5l10-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="16" cy="16" r="3" />
    </svg>
  );
}

/** Globe — languages. */
function GlobeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18" />
    </svg>
  );
}

/** Palette — arts & crafts. */
function PaletteIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.6-.9 1.6-1.7 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.1 0-.9.7-1.6 1.6-1.6H16a5 5 0 0 0 5-5c0-3.9-4-7.4-9-7.4z" />
      <circle cx="7.5" cy="10.5" r="1" />
      <circle cx="12" cy="7.5" r="1" />
      <circle cx="16.5" cy="10.5" r="1" />
    </svg>
  );
}

/** Lidded pot — cooking. */
function PotIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <path d="M7 21h10M6 11h12v3a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4z" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

/** Arrow with a shaft — the card's "Explore" affordance. */
export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2.2} className={className} {...STROKE}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export const SERVICE_ICONS: Record<ServiceIconName, ComponentType<IconProps>> = {
  document: DocumentIcon,
  graduation: GraduationIcon,
  note: NoteIcon,
  globe: GlobeIcon,
  palette: PaletteIcon,
  pot: PotIcon,
};
