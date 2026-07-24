/**
 * Content for the legal / policy pages (Cookie Policy, Child Safety). These
 * pages share one layout — a light hero with a draft flag, a sticky
 * scroll-spied table of contents, and a stack of prose sections — so the copy
 * lives here as data and the components stay purely presentational.
 */

/** A labelled bullet in a section list (`<b>term</b> — description`). */
export interface LegalListItem {
  term: string;
  description: string;
}

/** One block of section content: a paragraph or a labelled bullet list. */
export type LegalBlock =
  | { kind: "text"; body: string }
  | { kind: "list"; items: LegalListItem[] };

/** A single anchored section rendered in the content column and the TOC. */
export interface LegalSection {
  /** Anchor id, shared by the section, its TOC link, and the scroll spy. */
  id: string;
  heading: string;
  blocks: LegalBlock[];
}

/** Everything a legal page needs: hero copy plus its ordered sections. */
export interface LegalPageContent {
  /** Breadcrumb tail and header/eyebrow context. */
  crumb: string;
  eyebrow: string;
  /** Headline split so the accent word can render in slate. */
  titleLead: string;
  titleAccent: string;
  /** "Last updated" value shown in the hero meta line. */
  updated: string;
  sections: LegalSection[];
}

export const COOKIE_POLICY: LegalPageContent = {
  crumb: "Cookie Policy",
  eyebrow: "Legal",
  titleLead: "Cookie ",
  titleAccent: "Policy.",
  updated: "July 2026",
  sections: [
    {
      id: "what",
      heading: "What Are Cookies",
      blocks: [
        {
          kind: "text",
          body: "Cookies are small text files a website can store on your device to remember preferences and keep the site working. This is a demo, so only minimal, non-identifying use would apply.",
        },
      ],
    },
    {
      id: "how",
      heading: "How We Use Cookies",
      blocks: [
        {
          kind: "text",
          body: "To remember basic preferences and to understand, in aggregate, how the site is used so we can improve it.",
        },
        {
          kind: "text",
          body: "We would not use cookies to build advertising profiles or to identify a child.",
        },
      ],
    },
    {
      id: "types",
      heading: "Types of Cookies",
      blocks: [
        {
          kind: "list",
          items: [
            { term: "Essential", description: "needed for the site to function." },
            { term: "Preference", description: "remember choices such as filters." },
            { term: "Analytics", description: "aggregate, non-identifying usage insight." },
          ],
        },
      ],
    },
    {
      id: "manage",
      heading: "Managing Cookies",
      blocks: [
        {
          kind: "text",
          body: "You can control or clear cookies through your browser settings at any time. Blocking some cookies may affect how parts of the site work.",
        },
      ],
    },
    {
      id: "contact",
      heading: "Contact",
      blocks: [
        {
          kind: "text",
          body: "Questions about cookies can be sent through our Contact page.",
        },
      ],
    },
  ],
};

export const CHILD_SAFETY: LegalPageContent = {
  crumb: "Child Safety",
  eyebrow: "Safety",
  titleLead: "Child Safety & ",
  titleAccent: "COPPA.",
  updated: "July 2026",
  sections: [
    {
      id: "commitment",
      heading: "Our Commitment",
      blocks: [
        {
          kind: "text",
          body: "Protecting children is central to how Your Learning Journey works. We are built around parent-managed contact and supervision for every learner under 18.",
        },
      ],
    },
    {
      id: "contact-model",
      heading: "Parent-Managed Contact",
      blocks: [
        {
          kind: "text",
          body: "A parent or guardian creates the account and is the only point of contact. All messaging with educators runs through the parent.",
        },
      ],
    },
    {
      id: "no-child",
      heading: "No Child Accounts",
      blocks: [
        {
          kind: "text",
          body: "There is no separate child-facing login or profile. Children do not create accounts or communicate directly with educators on the platform.",
        },
      ],
    },
    {
      id: "from-children",
      heading: "Information From Children",
      blocks: [
        {
          kind: "text",
          body: "We do not knowingly collect personal information directly from children under 13. Information is provided and controlled by a parent or guardian.",
        },
      ],
    },
    {
      id: "supervision",
      heading: "Supervision of Sessions",
      blocks: [
        {
          kind: "text",
          body: "A parent or guardian books and supervises every session — always — whether it takes place in your home or online, and stays present or reachable throughout.",
        },
      ],
    },
    {
      id: "reporting",
      heading: "Reporting a Concern",
      blocks: [
        {
          kind: "text",
          body: "If you ever have a safety concern, contact us right away through our Contact page and we will review it promptly.",
        },
      ],
    },
    {
      id: "contact",
      heading: "Contact",
      blocks: [
        {
          kind: "text",
          body: "A parent or guardian is always the point of contact for learners under 18. Reach us through our Contact page.",
        },
      ],
    },
  ],
};

export const PRIVACY_POLICY: LegalPageContent = {
  crumb: "Privacy Policy",
  eyebrow: "Legal",
  titleLead: "Privacy ",
  titleAccent: "Policy.",
  updated: "July 2026",
  sections: [
    {
      id: "overview",
      heading: "Overview",
      blocks: [
        {
          kind: "text",
          body: "Your Learning Journey (“we”) connects families in the Raleigh, North Carolina area with independent, vetted educators. This policy describes, in plain terms, what information we would collect and how we would use it.",
        },
        {
          kind: "text",
          body: "Because this is a demonstration site, no real personal data is collected and no student records are stored.",
        },
      ],
    },
    {
      id: "collect",
      heading: "Information We Collect",
      blocks: [
        {
          kind: "text",
          body: "We would collect information a parent or guardian provides when creating an account or contacting an educator — such as a name, email address, and messages.",
        },
        {
          kind: "text",
          body: "We would also collect basic, non-identifying usage information to keep the service running smoothly.",
        },
      ],
    },
    {
      id: "use",
      heading: "How We Use Information",
      blocks: [
        { kind: "text", body: "To let parents browse educators, send messages, and manage bookings." },
        {
          kind: "text",
          body: "To maintain safety and quality, and to respond to questions a parent sends us.",
        },
        { kind: "text", body: "We do not sell personal information." },
      ],
    },
    {
      id: "children",
      heading: "Parent-Managed Accounts & Children",
      blocks: [
        {
          kind: "text",
          body: "Accounts are created and managed by a parent or guardian. There is no separate child-facing login.",
        },
        {
          kind: "text",
          body: "For any learner under 18, the parent or guardian is our point of contact and controls all booking and communication. See our Child Safety page for more.",
        },
      ],
    },
    {
      id: "sharing",
      heading: "Sharing & Disclosure",
      blocks: [
        {
          kind: "text",
          body: "We would share a parent’s message and booking details with the specific educator they choose to contact, so a session can be arranged.",
        },
        {
          kind: "text",
          body: "We would not share information with third parties for their own marketing.",
        },
      ],
    },
    {
      id: "retention",
      heading: "Data Retention",
      blocks: [
        {
          kind: "text",
          body: "We would keep account and message history only as long as needed to provide the service, then remove it on request.",
        },
      ],
    },
    {
      id: "choices",
      heading: "Your Choices",
      blocks: [
        {
          kind: "text",
          body: "A parent may review, update, or ask us to delete their information at any time by contacting us.",
        },
      ],
    },
    {
      id: "contact",
      heading: "Contact",
      blocks: [
        {
          kind: "text",
          body: "Questions about this policy can be sent through our Contact page. A parent or guardian is always the point of contact for learners under 18.",
        },
      ],
    },
  ],
};

export const TERMS_OF_SERVICE: LegalPageContent = {
  crumb: "Terms of Service",
  eyebrow: "Legal",
  titleLead: "Terms of ",
  titleAccent: "Service.",
  updated: "July 2026",
  sections: [
    {
      id: "acceptance",
      heading: "Acceptance of Terms",
      blocks: [
        {
          kind: "text",
          body: "By using this demonstration site, you agree to these sample terms. They are placeholder text for a demo and are not a binding agreement.",
        },
      ],
    },
    {
      id: "role",
      heading: "Our Role as a Marketplace",
      blocks: [
        {
          kind: "text",
          body: "Your Learning Journey is a marketplace that helps families discover and connect with independent educators. We are not the educator and do not deliver the sessions ourselves.",
        },
      ],
    },
    {
      id: "educators",
      heading: "Independent Educators",
      blocks: [
        {
          kind: "text",
          body: "Educators listed here are independent. Each sets their own hourly rate, availability, and session terms. We review credentials before listing an educator, but we describe support — we do not promise outcomes or results.",
        },
      ],
    },
    {
      id: "bookings",
      heading: "Bookings & Payments",
      blocks: [
        {
          kind: "text",
          body: "A parent or guardian arranges and pays for sessions per the terms shown on an educator’s profile. In this demo, no real payments are processed.",
        },
      ],
    },
    {
      id: "parent",
      heading: "Parent Responsibilities",
      blocks: [
        {
          kind: "text",
          body: "For any learner under 18, a parent or guardian creates the account, handles booking, and supervises every session — always.",
        },
      ],
    },
    {
      id: "use",
      heading: "Acceptable Use",
      blocks: [
        {
          kind: "text",
          body: "Use the service lawfully and respectfully. Do not misuse messaging, misrepresent your identity, or attempt to disrupt the service.",
        },
      ],
    },
    {
      id: "disclaimers",
      heading: "Disclaimers",
      blocks: [
        {
          kind: "text",
          body: "The service is provided “as is” for demonstration. We make no guarantee of any particular educational result or outcome.",
        },
      ],
    },
    {
      id: "liability",
      heading: "Limitation of Liability",
      blocks: [
        {
          kind: "text",
          body: "To the extent permitted by law, we are not liable for indirect or incidental damages arising from use of this demo site. This is placeholder language.",
        },
      ],
    },
    {
      id: "changes",
      heading: "Changes to These Terms",
      blocks: [
        {
          kind: "text",
          body: "We may update these sample terms from time to time. Continued use means you accept the current version.",
        },
      ],
    },
    {
      id: "contact",
      heading: "Contact",
      blocks: [
        { kind: "text", body: "Questions can be sent through our Contact page." },
      ],
    },
  ],
};
