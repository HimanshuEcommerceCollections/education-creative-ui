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

/** Envelope — the "Email" contact detail. */
export function MailIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

/** Outline map pin — the "Based in" contact detail. */
export function PinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

/** Clock — the "Hours" detail and the "usually within a day" expectation. */
export function ClockIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

/** Plain shield — the parent-supervision note inside the info card. */
export function ShieldIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <path d="M12 3l7 3v5c0 4.4-3 8.3-7 9.5C8 19.3 5 15.4 5 11V6l7-3z" />
    </svg>
  );
}

/** Right arrow — the form's submit button. */
export function ArrowIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} className={className} {...STROKE}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** Checkmark — the submission confirmation medallion. */
export function CheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2.4} className={className} {...STROKE}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

/** Speech bubble — the "a real person answers" expectation. */
export function ChatIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

/** Stacked lines — the "helpful next steps" expectation. */
export function ListIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <path d="M4 6h16M4 12h16M4 18h10" />
    </svg>
  );
}

/** Filled map pin — the pulsing marker on the info-card map panel. */
export function PinFilledIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
    </svg>
  );
}

/** Icon keys for the info-card contact details. */
export type ContactDetailIconName = "mail" | "pin" | "clock";

export const CONTACT_DETAIL_ICONS: Record<ContactDetailIconName, ComponentType<IconProps>> = {
  mail: MailIcon,
  pin: PinIcon,
  clock: ClockIcon,
};

/** Icon keys for the "what to expect" cards. */
export type ExpectIconName = "chat" | "clock" | "list";

export const EXPECT_ICONS: Record<ExpectIconName, ComponentType<IconProps>> = {
  chat: ChatIcon,
  clock: ClockIcon,
  list: ListIcon,
};
