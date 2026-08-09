import { redirect } from "next/navigation";

import { SignOutButton } from "@/components/account/sign-out-button";
import { Sidebar } from "@/components/dashboard/sidebar";
import { navForRole } from "@/data/dashboard-nav";
import { getSession } from "@/lib/auth/session";

/**
 * Shell for every signed-in staff and educator surface: a sidebar beside the
 * content, with none of the marketing header or footer.
 *
 * A separate route group from `(site)` because these are application screens, not
 * pages of the public site — they need persistent navigation and no hero chrome.
 * The parent's `/account` stays in `(site)`, since a parent moves between their
 * account and the public pages constantly.
 *
 * The gate here is broad: a session, and not a customer. Each page keeps its own
 * role check as well — a layout runs once for a subtree, so it can't be the only
 * thing standing between a coordinator and an admin page. The API is the actual
 * enforcement point either way.
 */
export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  if (!session) redirect("/login");

  // A customer has no surface in here.
  if (session.activeRole === "customer") redirect("/account");

  return (
    <div className="flex min-h-screen flex-col bg-ivory min-[1000px]:flex-row">
      <Sidebar
        sections={navForRole(session.activeRole)}
        role={session.activeRole}
        fullName={session.user.fullName}
        email={session.user.email}
        footer={<SignOutButton tone="dark" className="w-full" />}
      />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
