import type {
  SupportContactIconName,
  SupportTopicIconName,
} from "@/components/support/support-icons";

/** One card in the "Browse topics" grid. */
export interface SupportTopic {
  title: string;
  body: string;
  /**
   * Where the card leads. Topics the FAQ answers point at `/faq`; the rest go to
   * the page that covers them in more depth (sign-up, child safety, browse).
   */
  href: string;
  icon: SupportTopicIconName;
  /** Extra terms the search matches beyond the visible title and body. */
  keywords: string;
}

export const SUPPORT_TOPICS: SupportTopic[] = [
  {
    title: "Account & Sign-in",
    body: "Create a family account, reset a password, and manage profile details.",
    href: "/signup",
    icon: "user",
    keywords: "login password profile email verification family guardian register",
  },
  {
    title: "Booking & Scheduling",
    body: "How to request a session, pick a time, and confirm with an educator.",
    href: "/faq",
    icon: "calendar",
    keywords: "calendar session time reschedule availability appointment request",
  },
  {
    title: "Pricing & Payments",
    body: "Understand session rates, how billing works, and payment questions.",
    href: "/faq",
    icon: "card",
    keywords: "cost fees invoice card refund billing charge rates hourly",
  },
  {
    title: "Safety & Supervision",
    body: "Our vetting approach and how a parent stays present for learners.",
    href: "/child-safety",
    icon: "shield",
    keywords: "parent guardian background check trust child protection privacy coppa",
  },
  {
    title: "Educators",
    body: "How independent educators are vetted and how to explore their profiles.",
    href: "/browse",
    icon: "graduation",
    keywords: "tutors teachers vetting subjects profiles reviews qualifications",
  },
  {
    title: "Managing your bookings",
    body: "Review upcoming sessions, request changes, and see your booking history.",
    href: "/faq",
    icon: "bookings",
    keywords: "cancel change reschedule history upcoming sessions dashboard",
  },
];

/** One "reach a real person" detail card. */
export interface SupportContactDetail {
  icon: SupportContactIconName;
  label: string;
  value: string;
  /** When present the value renders as a link (e.g. mailto:). */
  href?: string;
}

export const SUPPORT_CONTACT_DETAILS: SupportContactDetail[] = [
  {
    icon: "mail",
    label: "Email",
    value: "hello@yourlearningjourney.demo",
    href: "mailto:hello@yourlearningjourney.demo",
  },
  { icon: "clock", label: "Hours", value: "Mon–Fri, 9am–6pm ET" },
  { icon: "reply", label: "Typical response", value: "Within 1 business day" },
];

/** Hero copy for the help center. */
export const SUPPORT_HERO = {
  crumb: "Support",
  eyebrow: "Help Center",
  titleLead: "How can we ",
  titleAccent: "help?",
  lede: "Search the help center or browse the topics below. This is a demo experience — answers link to our sample FAQ, and no real support tickets are created.",
  searchPlaceholder: "Search topics — try “booking” or “payments”",
  searchHint: "Demo search — filters the topic cards below as you type.",
  image: {
    src: "/assets/support/images/hero-agent.jpg",
    alt: "A friendly support agent wearing a headset",
  },
} as const;
