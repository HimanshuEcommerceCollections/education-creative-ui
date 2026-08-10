import type { Metadata } from "next";
import { redirect } from "next/navigation";

import type { UserStatus } from "@contracts/staff-invites.ts";

import { InviteCoordinatorForm } from "@/components/dashboard/invite-coordinator-form";
import {
  DashboardCard,
  DashboardPage,
  EmptyState,
} from "@/components/dashboard/page-frame";
import { getSession } from "@/lib/auth/session";
import { loadStaffDirectory } from "@/lib/dashboard/staff";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Staff & Roles",
  robots: { index: false, follow: false },
};

const STATUS_STYLES: Record<UserStatus, string> = {
  invited: "border-[rgba(210,162,65,0.5)] bg-[rgba(210,162,65,0.12)] text-[#7a5a12]",
  active: "border-[rgba(45,120,80,0.35)] bg-[rgba(45,120,80,0.09)] text-[#256a45]",
  suspended: "border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.08)] text-[#a63a30]",
  deactivated: "border-line bg-sand text-muted",
};

const STATUS_LABELS: Record<UserStatus, string> = {
  invited: "Invite pending",
  active: "Active",
  suspended: "Suspended",
  deactivated: "Deactivated",
};

/**
 * Staff management — admin only, and the API enforces that with
 * `requireRole("admin")` on every endpoint this page talks to; the redirect
 * below is navigation, not the boundary. Coordinators never see this page in
 * the sidebar (the "Administration" section drops for them) and get bounced to
 * the overview if they type the URL.
 */
export default async function StaffPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.activeRole !== "admin") redirect("/dashboard");

  const { items, error } = await loadStaffDirectory();

  return (
    <DashboardPage
      eyebrow="Administration"
      title="Staff & roles"
      description="Inviting a coordinator creates their account, grants the role, and emails a single-use link to set a password — the same acceptance path educator invites use. Coordinators review applications and run operations; only admins can invite staff."
    >
      {error ? (
        <p
          role="alert"
          className="mb-7 rounded-[14px] border-[1.5px] border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.07)] px-4 py-3 text-[13.5px] text-[#a63a30]"
        >
          {error}
        </p>
      ) : null}

      <DashboardCard title="Invite a coordinator">
        <InviteCoordinatorForm />
      </DashboardCard>

      <div className="mt-6">
        <DashboardCard title={`Team (${items.length})`}>
          {items.length === 0 ? (
            <EmptyState>No staff yet. Coordinators you invite will appear here.</EmptyState>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((member) => (
                <li
                  key={member.userId}
                  className="flex flex-wrap items-start justify-between gap-4 rounded-[18px] border border-line bg-white p-5"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-[10px]">
                      <h3 className="font-serif text-[17px] font-semibold tracking-[-0.01em]">
                        {member.fullName}
                      </h3>
                      <span
                        className={cn(
                          "rounded-[30px] border px-[11px] py-[3px] text-[11.5px] font-bold uppercase tracking-[0.06em]",
                          STATUS_STYLES[member.status],
                        )}
                      >
                        {STATUS_LABELS[member.status]}
                      </span>
                    </div>
                    <p className="mt-[6px] text-[13.5px] text-muted">{member.email}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[13px] font-semibold capitalize text-slate">
                      {member.roles.join(" · ")}
                    </p>
                    <p className="mt-1 text-[12.5px] text-muted">
                      {member.status === "invited" ? "invited " : "joined "}
                      {new Date(member.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </DashboardCard>
      </div>
    </DashboardPage>
  );
}
