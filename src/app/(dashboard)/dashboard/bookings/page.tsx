import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ServiceUnavailable } from "@/components/auth/service-unavailable";
import { BookingQueueRow } from "@/components/dashboard/booking-queue-row";
import {
  DashboardCard,
  DashboardPage,
  EmptyState,
} from "@/components/dashboard/page-frame";
import { guardSession } from "@/lib/auth/session";
import {
  BOOKING_TABS,
  UNTABBED_STATUSES,
  bookingsForTab,
  loadBookingQueue,
  parseTab,
  tabCount,
} from "@/lib/dashboard/bookings";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Bookings",
  robots: { index: false, follow: false },
};

const ALERT =
  "mb-7 rounded-[14px] border-[1.5px] border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.07)] px-4 py-3 text-[13.5px] text-[#a63a30]";

/**
 * The confirmation queue — the operational heart of the pay-first model.
 *
 * A parent has already been charged for everything on this page. The coordinator
 * phones the educator, then either assigns them and confirms, or can't fulfil it
 * and refunds in full. Both staff roles work it; the API's `requireStaff` guard
 * is what actually decides, so this renders the same for a coordinator and an
 * admin.
 *
 * The whole queue is read once and split between tabs here, rather than fetched
 * per status. Every state where money is at risk therefore has a home — including
 * an open chargeback, which the API's status filter previously refused to serve at
 * all, so it appeared in no dashboard and the platform would hear about it from
 * the bank instead.
 */
export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const guard = await guardSession("/dashboard/bookings");
  if (!guard.ok) {
    return <ServiceUnavailable message={guard.message} retryHref="/dashboard/bookings" />;
  }
  if (!guard.session.isStaff) redirect("/account");

  const [{ tab: requested }, { items, counts, educators, readAt, error }] = await Promise.all([
    searchParams,
    loadBookingQueue(),
  ]);

  const activeId = parseTab(requested);
  const active = BOOKING_TABS.find((tab) => tab.id === activeId)!;
  const shown = bookingsForTab(items, active);
  const isAdmin = guard.session.activeRole === "admin";

  const awaiting = bookingsForTab(items, BOOKING_TABS[0]);
  const overdue = awaiting.filter(
    (booking) => new Date(booking.slaDeadline).getTime() < readAt,
  ).length;
  const disputedCount = counts?.disputed ?? 0;

  return (
    <DashboardPage
      eyebrow="Operations"
      title="Bookings"
      description="Every booking here is already paid. Contact the educator, then assign and confirm — or, if it can't be fulfilled, refund it in full and the parent is emailed the reason. Bookings left past their confirmation deadline are refunded automatically, and a delivered session gets its outcome recorded here or by the educator."
    >
      {error ? (
        <p role="alert" className={ALERT}>
          {error}
        </p>
      ) : null}

      {disputedCount > 0 ? (
        <p role="alert" className={ALERT}>
          <b>{disputedCount}</b> {disputedCount === 1 ? "booking has" : "bookings have"}{" "}
          an open payment dispute. The bank decides these on its own timetable — gather
          what happened now, because the window to respond is short.
        </p>
      ) : null}

      {overdue > 0 ? (
        <p role="alert" className={ALERT}>
          <b>{overdue}</b> {overdue === 1 ? "booking is" : "bookings are"} past the
          confirmation deadline. The next sweep refunds{" "}
          {overdue === 1 ? "it" : "them"} automatically — confirm now if{" "}
          {overdue === 1 ? "it" : "they"} can still be filled.
        </p>
      ) : null}

      <nav aria-label="Booking status" className="mb-7 flex flex-wrap gap-2">
        {BOOKING_TABS.map((option) => {
          const isActive = option.id === activeId;
          const total = tabCount(counts, option);
          return (
            <Link
              key={option.id}
              href={option.id === "awaiting" ? "/dashboard/bookings" : `/dashboard/bookings?tab=${option.id}`}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "rounded-[40px] border-[1.5px] px-[18px] py-[9px] text-[13px] font-semibold no-underline transition-colors",
                isActive
                  ? "border-transparent bg-slate text-white"
                  : "border-line bg-white text-ink hover:border-slate hover:bg-[rgba(var(--slate-rgb),0.05)]",
              )}
            >
              {option.label}
              {/* Omitted rather than shown as 0 when the API sent no counts. */}
              {total === null ? null : (
                <span className={cn("ml-2 font-medium", isActive ? "text-white/70" : "text-muted")}>
                  {total}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <DashboardCard title={`${active.label} (${shown.length})`}>
        {activeId === "disputed" && shown.length > 0 ? (
          <p className="mb-4 text-[13px] leading-[1.6] text-muted">
            A chargeback has been opened with the parent&rsquo;s bank. The platform
            doesn&rsquo;t decide the outcome — what it can do is have the session record,
            the confirmation note, and any refund already issued ready to submit.
          </p>
        ) : null}

        {activeId === "stale" && shown.length > 0 ? (
          <p className="mb-4 text-[13px] leading-[1.6] text-muted">
            Requests that expired past their confirmation deadline, and checkouts nobody
            finished. No action is needed on either — they&rsquo;re here because a run of
            them is worth noticing.
          </p>
        ) : null}

        {shown.length === 0 ? (
          <EmptyState>{active.empty}</EmptyState>
        ) : (
          <ul className="flex flex-col gap-4">
            {shown.map((booking) => (
              <BookingQueueRow
                key={booking.id}
                booking={booking}
                educators={educators}
                readAt={readAt}
                isAdmin={isAdmin}
              />
            ))}
          </ul>
        )}
      </DashboardCard>

      {/*
        A status the contract knows about that no tab claims would otherwise be
        invisible here — the failure this page was rebuilt to stop.
      */}
      {UNTABBED_STATUSES.length > 0 ? (
        <p role="status" className="mt-6 text-[12.5px] text-muted">
          Not shown in any tab: {UNTABBED_STATUSES.join(", ")}.
        </p>
      ) : null}
    </DashboardPage>
  );
}
