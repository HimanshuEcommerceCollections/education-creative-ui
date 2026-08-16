import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ServiceUnavailable } from "@/components/auth/service-unavailable";
import { InviteStaffForm } from "@/components/dashboard/invite-staff-form";
import {
  DashboardCard,
  DashboardPage,
  EmptyState,
} from "@/components/dashboard/page-frame";
import { StaffRow } from "@/components/dashboard/staff-row";
import { guardSession } from "@/lib/auth/session";
import { loadStaffDirectory } from "@/lib/dashboard/staff";

export const metadata: Metadata = {
  title: "Staff & Roles",
  robots: { index: false, follow: false },
};

/**
 * Staff management — admin only, and the API enforces that with
 * `requireRole("admin")` on every endpoint this page talks to; the redirect
 * below is navigation, not the boundary. Coordinators never see this page in
 * the sidebar (the "Administration" section drops for them) and get bounced to
 * the overview if they type the URL.
 *
 * The roster is not read-only, and must not drift back towards it: every state it
 * renders — `suspended`, `deactivated`, an invite that never arrived, a role — has a
 * control on this page capable of producing it, so nothing here shows an admin a
 * condition they can only change by running a CLI script on a server. See `StaffRow`
 * for the controls and `dashboard/actions.ts` for the one Server Action per
 * capability.
 */
export default async function StaffPage() {
  const guard = await guardSession("/dashboard/staff");
  if (!guard.ok) {
    return <ServiceUnavailable message={guard.message} retryHref="/dashboard/staff" />;
  }
  if (guard.session.activeRole !== "admin") redirect("/dashboard");

  const { items, error } = await loadStaffDirectory();

  return (
    <DashboardPage
      eyebrow="Administration"
      title="Staff & roles"
      description="Inviting someone creates their account, grants the role, and emails a single-use link to set a password — the same acceptance path educator invites use. Coordinators review applications and run operations; administrators additionally own pricing, staff, and role grants. Nobody can change their own roles or status, and the last active administrator can't be removed."
    >
      {error ? (
        <p
          role="alert"
          className="mb-7 rounded-[14px] border-[1.5px] border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.07)] px-4 py-3 text-[13.5px] text-[#a63a30]"
        >
          {error}
        </p>
      ) : null}

      <DashboardCard title="Invite a member of staff">
        <InviteStaffForm />
      </DashboardCard>

      <div className="mt-6">
        <DashboardCard title={`Team (${items.length})`}>
          {items.length === 0 ? (
            <EmptyState>No staff yet. People you invite will appear here.</EmptyState>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((member) => (
                <StaffRow
                  key={member.userId}
                  member={member}
                  isSelf={member.userId === guard.session.user.id}
                />
              ))}
            </ul>
          )}
        </DashboardCard>
      </div>
    </DashboardPage>
  );
}
