/**
 * Content for the FAQ page. Answers can carry inline links and bolded terms, so
 * each one is modelled as an ordered run of segments — that keeps the copy here
 * as plain data (no JSX in `data/`) while the renderer stays presentational.
 */

/** One run of answer copy: plain prose, an inline link, or a bolded term. */
export type FaqSegment =
  | string
  | { kind: "link"; text: string; href: string }
  | { kind: "strong"; text: string };

/** Filter keys shared by the pills and the question rows. */
export type FaqCategory = "pricing" | "booking" | "safety" | "educators";

/** A pill in the filter row. `null` is the "All" pill (no category filter). */
export interface FaqFilter {
  label: string;
  category: FaqCategory | null;
}

export interface FaqItem {
  /** Stable key, also used as the accordion panel's element id. */
  id: string;
  category: FaqCategory;
  question: string;
  answer: FaqSegment[];
}

/** Short label shown on each question's category chip. */
export const FAQ_CATEGORY_LABELS: Record<FaqCategory, string> = {
  pricing: "Pricing",
  booking: "Booking",
  safety: "Safety",
  educators: "Educators",
};

export const FAQ_FILTERS: FaqFilter[] = [
  { label: "All", category: null },
  { label: "Pricing", category: "pricing" },
  { label: "Booking", category: "booking" },
  { label: "Safety", category: "safety" },
  { label: "Educators", category: "educators" },
];

export const FAQ_ITEMS: FaqItem[] = [
  /* --- pricing --- */
  {
    id: "how-pricing-works",
    category: "pricing",
    question: "How is pricing decided?",
    answer: [
      "Each educator sets their own hourly rate. The range you see on a profile reflects their experience, the subject, and the format — online or in-home. Rates are always shown up front, so you can compare before you message or book. ",
      { kind: "link", text: "Browse educators", href: "/browse" },
      " to see what they currently charge.",
    ],
  },
  {
    id: "subscription-fee",
    category: "pricing",
    question: "Is there a subscription or membership fee?",
    answer: [
      "No. There's no subscription and no membership fee — you simply pay per session at the educator's listed rate. Browsing, messaging, and comparing educators is free from your parent account.",
    ],
  },
  {
    id: "online-vs-in-home-cost",
    category: "pricing",
    question: "Is online cheaper than in-home?",
    answer: [
      "It varies by educator. Some charge the same for both formats; others price in-home sessions a little differently to account for travel. Whatever the case, each educator's online and in-home rates are shown clearly on their profile before you confirm.",
    ],
  },

  /* --- booking --- */
  {
    id: "how-to-book",
    category: "booking",
    question: "How do I book a session?",
    answer: [
      "Browse educators by subject, message the ones who look like a fit, then book directly through your parent account. You choose the date, time, and format, and confirm from there. Everything runs through the parent-managed account — there's no separate child login. ",
      { kind: "link", text: "See how it works", href: "/how-it-works" },
      " for a step-by-step walkthrough.",
    ],
  },
  {
    id: "reschedule-or-cancel",
    category: "booking",
    question: "Can I reschedule or cancel a session?",
    answer: [
      "Yes. You can reschedule or cancel from ",
      { kind: "strong", text: "My Bookings" },
      " in your account. Each educator sets their own reschedule and cancellation terms, and those terms are shown to you before you confirm a session — so there are no surprises.",
    ],
  },
  {
    id: "in-home-or-online",
    category: "booking",
    question: "In-home or online — which can I choose?",
    answer: [
      "Both. Many of the same educators offer in-home sessions across the Raleigh area and online sessions as well. You pick whichever format suits your family when you book, and you can switch formats for future sessions.",
    ],
  },

  /* --- safety --- */
  {
    id: "who-books-for-a-child",
    category: "safety",
    question: "Who books for a child under 18?",
    answer: [
      "A parent or guardian, always. For anyone under 18, the parent or guardian creates the account, books the sessions, and supervises every session. There is no separate child login and children don't hold their own accounts — the account stays parent-managed throughout.",
    ],
  },
  {
    id: "educator-vetting",
    category: "safety",
    question: "Are educators vetted?",
    answer: [
      "Yes. Before an educator is listed, we review their credentials and references. You'll also see their background, subjects, and experience on their profile so you can decide who's the right fit for your family. Learn more on our ",
      { kind: "link", text: "Child Safety", href: "/child-safety" },
      " page.",
    ],
  },
  {
    id: "information-privacy",
    category: "safety",
    question: "Is my information private?",
    answer: [
      "Accounts are parent-managed, and we design around keeping families' details protected. This site is a demo — no real student records or personal data are stored. For how a live version would handle data, see our ",
      { kind: "link", text: "Privacy Policy", href: "/privacy" },
      ".",
    ],
  },

  /* --- educators --- */
  {
    id: "become-an-educator",
    category: "educators",
    question: "How do I become an educator?",
    answer: [
      "Start from the ",
      { kind: "link", text: "Become an Educator", href: "/become-a-tutor" },
      " page. You'll share your background and the subjects you teach, and we review your credentials and references before your profile is listed. Once approved, you set your own rates and availability.",
    ],
  },
  {
    id: "educator-requirements",
    category: "educators",
    question: "What are the requirements to join?",
    answer: [
      "We look for relevant experience, verifiable credentials, and references for your subject area — across Academic Tutoring, College Admissions, Music, Languages, Arts & Crafts, and Cooking. The full checklist is on our ",
      { kind: "link", text: "Requirements", href: "/requirements" },
      " page.",
    ],
  },
  {
    id: "guaranteed-results",
    category: "educators",
    question: "Do you promise results?",
    answer: [
      "No. We describe the support and practice an educator offers and help you find a good fit — but we never promise specific outcomes, scores, or admissions results. Learning is a partnership between the student, the family, and the educator.",
    ],
  },
];

/** Hero copy for the FAQ page. */
export const FAQ_HERO = {
  crumb: "FAQ",
  eyebrow: "Help",
  titleLead: "Questions, ",
  titleAccent: "answered.",
  lede: "Short, honest answers about pricing, booking, safety, and joining as an educator. Parents manage every account — and if what you need isn't here, the support team is one click away.",
  image: {
    src: "/assets/faq/images/hero-bg.jpg",
    alt: "A teacher working with students in a bright classroom",
  },
} as const;

/** Copy for the searchable question list, including its empty state. */
export const FAQ_BROWSER = {
  searchPlaceholder: "Search questions…",
  searchLabel: "Search frequently asked questions",
  empty: {
    title: "No matching questions",
    body: "We couldn't find a question that matches. Try a different word or clear your filters — or reach the support team directly.",
    action: "Clear filters",
  },
} as const;

/** Closing "still need help?" band. */
export const FAQ_HELP_BAND = {
  titleLead: "Still need ",
  titleAccent: "help?",
  body: "If your question isn't here, the support team is happy to point you in the right direction — no bots, just people.",
  image: {
    src: "/assets/faq/images/help-bg.jpg",
    alt: "",
  },
} as const;
