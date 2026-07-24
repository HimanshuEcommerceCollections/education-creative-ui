import type { ContactDetailIconName, ExpectIconName } from "@/components/contact/contact-icons";

/**
 * The segmented "reason for contact" options. The first entry is the default
 * selection; values double as the label and the submitted value.
 */
export const CONTACT_REASONS = [
  "Finding an educator",
  "Pricing question",
  "Booking help",
  "Something else",
] as const;

export type ContactReason = (typeof CONTACT_REASONS)[number];

/** One "reach us" line in the info card. */
export interface ContactDetail {
  icon: ContactDetailIconName;
  label: string;
  value: string;
  /** When present, the value renders as a link (e.g. mailto:). */
  href?: string;
}

export const CONTACT_DETAILS: ContactDetail[] = [
  {
    icon: "mail",
    label: "Email",
    value: "hello@yourlearningjourney.demo",
    href: "mailto:hello@yourlearningjourney.demo",
  },
  { icon: "pin", label: "Based in", value: "Raleigh, NC" },
  { icon: "clock", label: "Hours", value: "Mon–Fri, 9am–6pm ET" },
];

/** A "what to expect" reassurance card. */
export interface ExpectCard {
  icon: ExpectIconName;
  title: string;
  body: string;
}

export const WHAT_TO_EXPECT: ExpectCard[] = [
  {
    icon: "chat",
    title: "A real person answers",
    body: "Your note reaches our small Raleigh team — not an automated queue. We read the whole thing before we reply.",
  },
  {
    icon: "clock",
    title: "Usually within a day",
    body: "On a live site, replies land within one business day, Monday to Friday. Weekend notes get a first look Monday morning.",
  },
  {
    icon: "list",
    title: "Helpful next steps",
    body: "We point you to educators, formats, and scheduling that fit — then a parent books and supervises from there.",
  },
];
