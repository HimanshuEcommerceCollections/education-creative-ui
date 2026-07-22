import type { NavGroup, NavLink, SocialLink } from "@/types/navigation";

/** Primary header navigation for the one-page home route (section anchors). */
export const MAIN_NAV: NavLink[] = [
  { label: "Home", href: "#top" },
  { label: "Subjects", href: "#subjects2" },
  { label: "How It Works", href: "#how" },
  { label: "For Parents", href: "#trust" },
  { label: "Educators", href: "#tutors" },
  { label: "About", href: "#faq" },
  { label: "Contact", href: "#book" },
];

/** Header navigation for standalone routes (e.g. subject pages). */
export const SITE_NAV: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Browse", href: "/browse" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** Footer link columns. */
export const FOOTER_NAV: NavGroup[] = [
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#book" },
    ],
  },
  {
    title: "Parents",
    links: [
      { label: "Find Tutors", href: "#subjects2" },
      { label: "Pricing", href: "#" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Educators",
    links: [
      { label: "Become a Tutor", href: "#tutors" },
      { label: "Requirements", href: "#" },
      { label: "Support", href: "#" },
    ],
  },
];

/** Footer link columns for standalone routes (route targets, not anchors). */
export const SITE_FOOTER_NAV: NavGroup[] = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Parents",
    links: [
      { label: "Find Educators", href: "/browse" },
      { label: "Pricing", href: "/pricing" },
      { label: "How It Works", href: "/how-it-works" },
    ],
  },
  {
    title: "Educators",
    links: [
      { label: "Become an Educator", href: "#" },
      { label: "Requirements", href: "#" },
      { label: "Support", href: "#" },
    ],
  },
];

/** Footer social links, rendered as brand icons. */
export const SOCIAL_LINKS: SocialLink[] = [
  { label: "IG", href: "#", ariaLabel: "Instagram", icon: "instagram" },
  { label: "FB", href: "#", ariaLabel: "Facebook", icon: "facebook" },
  { label: "IN", href: "#", ariaLabel: "LinkedIn", icon: "linkedin" },
  { label: "YT", href: "#", ariaLabel: "YouTube", icon: "youtube" },
];
