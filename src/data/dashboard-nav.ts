import type { UserRole } from "@contracts/roles.ts";

/**
 * A sidebar entry. `roles` is the gate — an item renders only for the session's
 * active role, so a coordinator never sees admin-only surfaces at all.
 *
 * Items whose backing feature hasn't shipped carry a `phase` and render disabled
 * rather than being hidden. Showing the shape of the product is useful; a link
 * that 404s is not.
 */
export interface DashboardNavItem {
  label: string;
  href: string;
  icon: DashboardIconName;
  roles: readonly UserRole[];
  /** Roadmap phase, for items that aren't built yet. Omit when live. */
  phase?: string;
  /** Marks the surfaces only an admin gets, for the "Admin" caption. */
  adminOnly?: boolean;
}

export interface DashboardNavSection {
  title: string;
  items: DashboardNavItem[];
}

export type DashboardIconName =
  | "overview"
  | "applications"
  | "bookings"
  | "teams"
  | "educators"
  | "reviews"
  | "pricing"
  | "config"
  | "staff"
  | "sessions"
  | "earnings"
  | "profile"
  | "payouts";

const STAFF = ["admin", "coordinator"] as const;
const ADMIN_ONLY = ["admin"] as const;

/**
 * Staff sidebar. Coordinators run operations; admins additionally own pricing
 * integrity, site config, and role grants (§5). That split is the reason the
 * "Administration" section exists separately rather than being mixed in.
 */
export const STAFF_NAV: DashboardNavSection[] = [
  {
    title: "Operations",
    items: [
      { label: "Overview", href: "/dashboard", icon: "overview", roles: STAFF },
      {
        label: "Educator applications",
        href: "/dashboard/applications",
        icon: "applications",
        roles: STAFF,
      },
      {
        label: "Bookings",
        href: "/dashboard/bookings",
        icon: "bookings",
        roles: STAFF,
        phase: "Phase 3",
      },
      {
        label: "Teams",
        href: "/dashboard/teams",
        icon: "teams",
        roles: STAFF,
        phase: "Phase 2",
      },
      {
        label: "Educators",
        href: "/dashboard/educators",
        icon: "educators",
        roles: STAFF,
        phase: "Phase 2",
      },
      {
        label: "Reviews",
        href: "/dashboard/reviews",
        icon: "reviews",
        roles: STAFF,
        phase: "Phase 2",
      },
      {
        label: "Payouts",
        href: "/dashboard/payouts",
        icon: "payouts",
        roles: STAFF,
        phase: "Phase 4",
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        label: "Pricing & rate bands",
        href: "/dashboard/pricing",
        icon: "pricing",
        roles: ADMIN_ONLY,
        phase: "Phase 2",
        adminOnly: true,
      },
      {
        label: "Site configuration",
        href: "/dashboard/config",
        icon: "config",
        roles: ADMIN_ONLY,
        phase: "Phase 2",
        adminOnly: true,
      },
      {
        label: "Staff & roles",
        href: "/dashboard/staff",
        icon: "staff",
        roles: ADMIN_ONLY,
        adminOnly: true,
      },
    ],
  },
];

/**
 * Educator sidebar. Launch scope for an educator is deliberately narrow (§12.2):
 * set a password, see assignments, mark sessions delivered. Profile and
 * availability editing is an explicit fast-follow.
 */
export const EDUCATOR_NAV: DashboardNavSection[] = [
  {
    title: "Teaching",
    items: [
      { label: "Overview", href: "/educator", icon: "overview", roles: ["educator"] },
      {
        label: "My sessions",
        href: "/educator/sessions",
        icon: "sessions",
        roles: ["educator"],
        phase: "Phase 3",
      },
      {
        label: "Earnings",
        href: "/educator/earnings",
        icon: "earnings",
        roles: ["educator"],
        phase: "Phase 4",
      },
      {
        label: "My profile",
        href: "/educator/profile",
        icon: "profile",
        roles: ["educator"],
        phase: "Fast-follow",
      },
    ],
  },
];

/** Which sidebar a session sees, chosen by its active role. */
export function navForRole(role: UserRole): DashboardNavSection[] {
  if (role === "educator") return EDUCATOR_NAV;
  if (role === "admin" || role === "coordinator") return STAFF_NAV;
  return [];
}

/**
 * Drops entries this role can't see, then drops sections left empty — which is
 * how the whole "Administration" block disappears for a coordinator.
 */
export function visibleSections(
  sections: DashboardNavSection[],
  role: UserRole,
): DashboardNavSection[] {
  return sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => item.roles.includes(role)),
    }))
    .filter((section) => section.items.length > 0);
}
