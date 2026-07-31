import type { ComponentType } from "react";

import {
  ShieldCheckIcon,
  ShieldIcon,
  StarIcon,
  UsersIcon,
} from "@/components/how-it-works/how-it-works-icons";

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

/** Page with a checkmark — a parent-held account, a checked reference. */
function DocumentCheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="m9 15 2 2 4-4" />
    </svg>
  );
}

/** Dollar sign — the rate shown up front on every profile. */
function DollarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <path d="M12 1v22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

/** Magnifier — discovering and shortlisting educators. */
function SearchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

/** Speech bubble — messaging before committing. */
function ChatIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4L3 21l1.1-9A8.4 8.4 0 1 1 21 11.5z" />
    </svg>
  );
}

/** Calendar — picking a slot and confirming. */
function CalendarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

/** Rising line chart — family feedback holding quality over time. */
function ChartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} className={className} {...STROKE}>
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  );
}

/** Icon keys used by the For Parents pillars, stepper, and vetting list. */
export type ParentIconName =
  | "shield"
  | "shield-check"
  | "document-check"
  | "dollar"
  | "star"
  | "search"
  | "chat"
  | "calendar"
  | "chart"
  | "user";

export const PARENT_ICONS: Record<ParentIconName, ComponentType<IconProps>> = {
  shield: ShieldIcon,
  "shield-check": ShieldCheckIcon,
  "document-check": DocumentCheckIcon,
  dollar: DollarIcon,
  star: StarIcon,
  search: SearchIcon,
  chat: ChatIcon,
  calendar: CalendarIcon,
  chart: ChartIcon,
  user: UsersIcon,
};
