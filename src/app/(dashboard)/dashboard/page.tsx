import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ServiceUnavailable } from "@/components/auth/service-unavailable";
import {
  DashboardCard,
  DashboardPage,
  EmptyState,
  StatTile,
} from "@/components/dashboard/page-frame";
import { guardSession } from "@/lib/auth/session";
import { loadApplicationQueue } from "@/lib/dashboard/applications";
import { loadBookingQueue } from "@/lib/dashboard/bookings";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

const CARD_LINK =
  "text-[13px] font-semibold text-slate no-underline transition-colors hover:text-gold";

/**
 * Staff overview. Admins and coordinators share this shell — §5 gives coordinators
 * operations and admins additionally pricing integrity, config, and role grants, so
 * the surfaces overlap heavily and the difference is expressed in the sidebar and
 * in what each page allows, not in two separate apps.
 *
 * Bookings lead, and have to keep leading: the confirmation queue is the operational
 * heart of the product, so the page a coordinator lands on always surfaces it and
 * links straight to `/dashboard/bookings`.
 */
export default async function DashboardOverviewPage() {
  const guard = await guardSession("/dashboard");
  if (!guard.ok) return <ServiceUnavailable message={guard.message} retryHref="/dashboard" />;

  const { session } = guard;
  if (!session.isStaff) redirect("/account");

  const isAdmin = session.activeRole === "admin";
  const [applications, bookings] = await Promise.all([
    loadApplicationQueue(),
    loadBookingQueue(),
  ]);

  const awaitingFirstLook = applications.open.filter(
    (item) => item.status === "submitted",
  ).length;

  /*
   * The queue is read whole and split by status here, the same way the bookings
   * page tabs it. The tiles below count from `counts` where they can, because
   * that is every booking rather than the page that was returned.
   */
  const awaiting = bookings.items.filter(
    (booking) => booking.status === "paid_unconfirmed",
  );
  const confirmed = bookings.counts?.confirmed ?? 0;
  const disputed = bookings.counts?.disputed ?? 0;
  const overdue = awaiting.filter(
    (booking) => new Date(booking.slaDeadline).getTime() < bookings.readAt,
  ).length;

  return (
    <DashboardPage
      eyebrow={isAdmin ? "Administrator" : "Coordinator"}
      title={`Welcome back, ${session.user.fullName.split(" ")[0]}`}
      description={
        isAdmin
          ? "Bookings, educator onboarding, pricing and staff are all live. Every paid booking needs a coordinator to confirm it within two days, or it refunds itself."
          : "Bookings and educator onboarding are live. Every paid booking needs confirming within two days, or it refunds itself — the queue is where that work happens."
      }
    >
      {applications.error ? (
        <p
          role="alert"
          className="mb-7 rounded-[14px] border-[1.5px] border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.07)] px-4 py-3 text-[13.5px] text-[#a63a30]"
        >
          {applications.error}
        </p>
      ) : null}
      {bookings.error ? (
        <p
          role="alert"
          className="mb-7 rounded-[14px] border-[1.5px] border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.07)] px-4 py-3 text-[13.5px] text-[#a63a30]"
        >
          {bookings.error}
        </p>
      ) : null}

      {disputed > 0 ? (
        <p
          role="alert"
          className="mb-7 rounded-[14px] border-[1.5px] border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.07)] px-4 py-3 text-[13.5px] text-[#a63a30]"
        >
          <b>{disputed}</b>{" "}
          {disputed === 1 ? "booking has" : "bookings have"} an open
          payment dispute.{" "}
          <Link href="/dashboard/bookings" className="font-semibold underline">
            Open the queue
          </Link>
          .
        </p>
      ) : null}

      <div className="mb-7 grid gap-4 min-[760px]:grid-cols-4 min-[560px]:grid-cols-2">
        <StatTile
          label="Bookings to confirm"
          value={awaiting.length}
          hint={
            overdue > 0
              ? `${overdue} past the deadline — refunding automatically`
              : awaiting.length > 0
                ? "Paid, waiting on a phone call"
                : "Nothing waiting"
          }
          tone={awaiting.length > 0 ? "attention" : "neutral"}
        />
        <StatTile
          label="Confirmed"
          value={confirmed}
          hint="Assigned and set with the family"
        />
        <StatTile
          label="Awaiting review"
          value={awaitingFirstLook}
          hint={awaitingFirstLook > 0 ? "New applications not yet opened" : "Nothing new"}
          tone={awaitingFirstLook > 0 ? "attention" : "neutral"}
        />
        <StatTile
          label="In the review queue"
          value={applications.open.length}
          hint="Submitted or in review"
        />
      </div>

      <DashboardCard
        title={`Bookings to confirm (${awaiting.length})`}
        action={
          <Link href="/dashboard/bookings" className={CARD_LINK}>
            Open the queue &rarr;
          </Link>
        }
      >
        {awaiting.length === 0 ? (
          <EmptyState>
            Nothing waiting. Paid bookings from <b>/book</b> land here the moment Stripe
            confirms the payment.
          </EmptyState>
        ) : (
          <ul className="flex flex-col gap-[10px]">
            {awaiting.slice(0, 5).map((booking) => (
              <li
                key={booking.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-line px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-[14.5px] font-semibold text-ink">
                    {booking.subjectTopic} &middot; {booking.requestedEducator.name}
                  </p>
                  <p className="truncate text-[12.5px] text-muted">
                    {booking.reference} &middot; {booking.parentName} &middot;{" "}
                    {booking.preferredDate}
                  </p>
                </div>
                <span className="shrink-0 text-[12px] font-semibold uppercase tracking-[0.06em] text-slate">
                  {new Date(booking.slaDeadline).getTime() < bookings.readAt
                    ? "Overdue"
                    : "To confirm"}
                </span>
              </li>
            ))}
          </ul>
        )}
        {awaiting.length > 5 ? (
          <p className="mt-4 text-[12.5px] text-muted">
            Showing 5 of {awaiting.length}. The full queue is on the bookings
            page.
          </p>
        ) : null}
      </DashboardCard>

      <div className="mt-6">
        <DashboardCard
          title="Educator applications"
          action={
            <Link href="/dashboard/applications" className={CARD_LINK}>
              Open the queue &rarr;
            </Link>
          }
        >
          {applications.open.length === 0 ? (
            <EmptyState>
              Nothing waiting. Applications submitted from <b>/become-a-tutor</b> land here.
            </EmptyState>
          ) : (
            <ul className="flex flex-col gap-[10px]">
              {applications.open.slice(0, 5).map((application) => (
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
          {applications.open.length > 5 ? (
            <p className="mt-4 text-[12.5px] text-muted">
              Showing 5 of {applications.open.length}. The full queue is on the
              applications page.
            </p>
          ) : null}
        </DashboardCard>
      </div>

      <div className="mt-6 grid gap-6 min-[900px]:grid-cols-2">
        <DashboardCard title="What's live">
          {/*
            This list has to agree with the sidebar: a capability with a page behind
            it — pricing, staff, the booking queue — is live here and never deferred
            to a later phase. A staff member reading "arrives with Phase 2" two inches
            from a working link learns not to trust either.
          */}
          <ul className="flex flex-col gap-[9px] text-[14px] leading-[1.6] text-muted">
            <li>Parent signup, sign-in, and password reset</li>
            <li>Educator applications, approval, and invites</li>
            <li>Paid bookings, confirmation, and assignment</li>
            <li>Refunds — in full when you can&rsquo;t fulfil, or partial for goodwill</li>
            <li>Session outcomes: delivered or no-show</li>
            <li>Role-based access — enforced by the API, not this UI</li>
            {isAdmin ? (
              <>
                <li>Rate bands, educator rates, and the in-home differential</li>
                <li>Staff invites, role grants, and account status</li>
              </>
            ) : null}
          </ul>
        </DashboardCard>

        <DashboardCard title="Coming next">
          <ul className="flex flex-col gap-[9px] text-[14px] leading-[1.6] text-muted">
            <li>Educator directory and verification from this dashboard (fast-follow)</li>
            <li>Teams and crew assignment</li>
            <li>Educator payouts and payout tracking</li>
            <li>Parent reviews — nothing collects them today</li>
          </ul>
        </DashboardCard>
      </div>
    </DashboardPage>
  );
}
