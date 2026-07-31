import type { NavGroup, NavLink, SocialLink } from "@/types/navigation";

/**
 * The site's single primary navigation, shared by every page. Section links are
 * root-relative (`/#id`) so they jump to the matching home-page section from
 * anywhere; `/how-it-works` and `/about` are standalone routes. This is the
 * canonical set — individual page designs never trim it.
 */
export const MAIN_NAV: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "For Parents", href: "/for-parents" },
  { label: "Educators", href: "/browse" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** The site's single footer link set, shared by every page. */
export const FOOTER_NAV: NavGroup[] = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Parents",
    links: [
      { label: "Find Tutors", href: "/#subjects2" },
      { label: "Pricing", href: "#" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Educators",
    links: [
      { label: "Become an Educator", href: "/become-a-tutor" },
      { label: "Requirements", href: "/requirements" },
      { label: "Support", href: "/support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Cookie Policy", href: "/cookie-policy" },
      { label: "Child Safety", href: "/child-safety" },
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
