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

/* --- chrome --- */

/** Magnifier — the help-center search field. */
export function SearchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} className={className} {...STROKE}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

/** Chevron — the breadcrumb separator. */
export function CrumbChevronIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2.2} className={className} {...STROKE}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

/** Right arrow — the topic-card "Open topic" row and the section CTA. */
export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2.2} className={className} {...STROKE}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/* --- topic tiles --- */

/** Bust — "Account & Sign-in". */
export function UserIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}

/** Calendar — "Booking & Scheduling". */
export function CalendarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
      <path d="M3 9h18M8 2.5v4M16 2.5v4" />
    </svg>
  );
}

/** Payment card — "Pricing & Payments". */
export function CardIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
      <path d="M2.5 10h19" />
      <path d="M6 14.5h4" />
    </svg>
  );
}

/** Shield with a tick — "Safety & Supervision" and the parent-supervision band. */
export function ShieldCheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

/** Mortarboard — "Educators". */
export function GraduationIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <path d="M12 3l9 4.5-9 4.5-9-4.5z" />
      <path d="M6 10v4.5c0 1.5 2.7 3 6 3s6-1.5 6-3V10" />
    </svg>
  );
}

/** Lined page — "Managing your bookings". */
export function BookingsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <rect x="3.5" y="4" width="17" height="16" rx="2.5" />
      <path d="M8 9h8M8 13h8M8 17h5" />
    </svg>
  );
}

/* --- "reach a real person" details --- */

/** Envelope — the support email. */
export function MailIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  );
}

/** Clock — support hours. */
export function ClockIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

/** Reply bubble — typical response time. */
export function ReplyIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <path d="M4 5h16v11H8l-4 3z" />
      <path d="M9 10h6M9 13h4" />
    </svg>
  );
}

/** Icon keys for the browse-topics cards. */
export type SupportTopicIconName =
  | "user"
  | "calendar"
  | "card"
  | "shield"
  | "graduation"
  | "bookings";

export const SUPPORT_TOPIC_ICONS: Record<SupportTopicIconName, ComponentType<IconProps>> = {
  user: UserIcon,
  calendar: CalendarIcon,
  card: CardIcon,
  shield: ShieldCheckIcon,
  graduation: GraduationIcon,
  bookings: BookingsIcon,
};

/** Icon keys for the support contact details. */
export type SupportContactIconName = "mail" | "clock" | "reply";

export const SUPPORT_CONTACT_ICONS: Record<
  SupportContactIconName,
  ComponentType<IconProps>
> = {
  mail: MailIcon,
  clock: ClockIcon,
  reply: ReplyIcon,
};
