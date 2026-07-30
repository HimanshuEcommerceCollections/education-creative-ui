import type { ComponentType } from "react";

import type { OfferIconName } from "@/types/subject-page";

interface IconProps {
  className?: string;
}

export const OFFER_ICON_CLASS =
  "h-6 w-6 fill-none stroke-slate stroke-[1.6] [stroke-linecap:round] [stroke-linejoin:round]";

function NoteIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="17.5" cy="16" r="2.5" />
      <path d="M9 18V6l11-2.5V16" />
    </svg>
  );
}

function MicIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <path d="M12 18v3" />
    </svg>
  );
}

function BookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M4 5a2 2 0 0 1 2-2h6v16H6a2 2 0 0 0-2 2z" />
      <path d="M20 5a2 2 0 0 0-2-2h-6v16h6a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function GraduationIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M3 7l9-4 9 4-9 4-9-4z" />
      <path d="M7 9.5V15c0 1.4 2.4 2.5 5 2.5s5-1.1 5-2.5V9.5" />
      <path d="M21 7v5" />
    </svg>
  );
}

function TargetIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.4" />
    </svg>
  );
}

function PencilIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M15.5 5.5l3 3" />
      <path d="M18 3l3 3-10 10-4 1 1-4z" />
      <path d="M11 21H3" />
    </svg>
  );
}

function BrushIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M15 4l5 5-8 8-5-5z" />
      <path d="M8 13l-3 3a2.5 2.5 0 0 0 3.5 3.5l3-3" />
    </svg>
  );
}

function VaseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M9.5 3h5" />
      <path d="M9.5 3c0 3-3.5 4.5-3.5 9a6.5 6.5 0 0 0 12 0c0-4.5-3.5-6-3.5-9" />
    </svg>
  );
}

function ScissorsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="6" cy="18" r="2.5" />
      <path d="M8 8l12 8" />
      <path d="M8 16l12-8" />
    </svg>
  );
}

export const OFFER_ICONS: Record<OfferIconName, ComponentType<IconProps>> = {
  note: NoteIcon,
  mic: MicIcon,
  book: BookIcon,
  graduation: GraduationIcon,
  target: TargetIcon,
  pencil: PencilIcon,
  brush: BrushIcon,
  vase: VaseIcon,
  scissors: ScissorsIcon,
};
