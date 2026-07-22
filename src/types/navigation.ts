export interface NavLink {
  label: string;
  href: string;
}

export interface NavGroup {
  title: string;
  links: NavLink[];
}

/** Brand-icon keys for the footer social links. */
export type SocialIconName = "instagram" | "facebook" | "linkedin" | "youtube";

export interface SocialLink extends NavLink {
  /** Accessible name for the icon-only link. */
  ariaLabel: string;
  /** Which brand glyph to render. */
  icon: SocialIconName;
}
