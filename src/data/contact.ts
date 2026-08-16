import type { ContactDetailIconName, ExpectIconName } from "@/components/contact/contact-icons";

/*
 * The "reason for contact" options used to be defined here as display strings.
 * They now live in `@contracts/contact-requests.ts` — `CONTACT_REASONS` (the
 * slugs the API stores and the staff queue filters on) with `CONTACT_REASON_LABELS`
 * (the text the form shows) — because the submitted value has to be the API's
 * value, and a second list in this file could only ever drift out of agreement
 * with it.
 */

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
    title: "In the order they arrive",
    body: "Every message is picked up in turn by the coordinator who can actually answer it, and you get an email confirming yours reached us.",
  },
  {
    icon: "list",
    title: "Helpful next steps",
    body: "We point you to educators, formats, and scheduling that fit — then a parent books and supervises from there.",
  },
];
