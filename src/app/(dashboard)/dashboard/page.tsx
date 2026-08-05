import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  DashboardCard,
  DashboardPage,
  EmptyState,
  StatTile,
} from "@/components/dashboard/page-frame";
import { loadApplicationQueue } from "@/lib/dashboard/applications";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

/**
 * Staff overview. Admins and coordinators share this shell — §5 gives coordinators
 * operations and admins additionally pricing integrity, config, and role grants, so
 * the surfaces overlap heavily and the difference is expressed in the sidebar and
 * in what each page allows, not in two separate apps.
 */
export default async function DashboardOverviewPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!session.isStaff) redirect("/account");

  const isAdmin = session.activeRole === "admin";
  const { open, settled, error } = await loadApplicationQueue();
  const awaitingFirstLook = open.filter((item) => item.status === "submitted").length;

  return (
    <DashboardPage
      eyebrow={isAdmin ? "Administrator" : "Coordinator"}
      title={`Welcome back, ${session.user.fullName.split(" ")[0]}`}
      description={
        isAdmin
          ? "Educator onboarding is live. Pricing, config, and role management arrive with Phase 2."
          : "Educator onboarding is live. Bookings and team dispatch arrive in later phases."
      }
    >
      {error ? (
        <p
          role="alert"
          className="mb-7 rounded-[14px] border-[1.5px] border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.07)] px-4 py-3 text-[13.5px] text-[#a63a30]"
        >
          {error}
        </p>
      ) : null}

      <div className="mb-7 grid gap-4 min-[760px]:grid-cols-3">
        <StatTile
          label="Awaiting review"
          value={awaitingFirstLook}
          hint={awaitingFirstLook > 0 ? "New applications not yet opened" : "Nothing new"}
          tone={awaitingFirstLook > 0 ? "attention" : "neutral"}
        />
        <StatTile label="In the queue" value={open.length} hint="Submitted or in review" />
        <StatTile label="Decided" value={settled.length} hint="Approved or rejected" />
      </div>

      <DashboardCard
        title="Educator applications"
        action={
          <Link
            href="/dashboard/applications"
            className="text-[13px] font-semibold text-slate no-underline transition-colors hover:text-gold"
          >
            Open the queue &rarr;
          </Link>
        }
      >
        {open.length === 0 ? (
          <EmptyState>
            Nothing waiting. Applications submitted from <b>/become-a-tutor</b> land here.
          </EmptyState>
        ) : (
          <ul className="flex flex-col gap-[10px]">
            {open.slice(0, 5).map((application) => (
              <li
                key={application.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-line px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-[14.5px] font-semibold text-ink">
                    {application.applicantName}
                  </p>
                  <p className="truncate text-[12.5px] text-muted">
                    {application.subjectsOfInterest.join(", ") || "No subject given"}
                  </p>
                </div>
                <span className="shrink-0 text-[12px] font-semibold uppercase tracking-[0.06em] text-slate">
                  {application.status === "submitted" ? "New" : "In review"}
                </span>
              </li>
            ))}
          </ul>
        )}
        {open.length > 5 ? (
          <p className="mt-4 text-[12.5px] text-muted">
            Showing 5 of {open.length}. The full queue is on the applications page.
          </p>
        ) : null}
      </DashboardCard>

      <div className="mt-6 grid gap-6 min-[900px]:grid-cols-2">
        <DashboardCard title="What's live">
          <ul className="flex flex-col gap-[9px] text-[14px] leading-[1.6] text-muted">
            <li>Parent signup, sign-in, and password reset</li>
            <li>Educator applications, approval, and invites</li>
            <li>Role-based access — enforced by the API, not this UI</li>
          </ul>
        </DashboardCard>

        <DashboardCard title="Coming next">
          <ul className="flex flex-col gap-[9px] text-[14px] leading-[1.6] text-muted">
            <li>Educators, subjects, and pricing off static data (Phase 2)</li>
            <li>Teams and crew assignment (Phase 2)</li>
            <li>Booking confirmation and completion (Phase 3)</li>
            <li>Payments, refunds, and payout tracking (Phase 4)</li>
            {isAdmin ? <li>Rate bands, take-rate, and role grants (admin only)</li> : null}
          </ul>
        </DashboardCard>
      </div>
    </DashboardPage>
  );
}
