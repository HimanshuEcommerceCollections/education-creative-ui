import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { BookingQueueRow } from "@/components/dashboard/booking-queue-row";
import {
  DashboardCard,
  DashboardPage,
  EmptyState,
} from "@/components/dashboard/page-frame";
import { getSession } from "@/lib/auth/session";
import { loadBookingQueue } from "@/lib/dashboard/bookings";

export const metadata: Metadata = {
  title: "Bookings",
  robots: { index: false, follow: false },
};

/**
 * The confirmation queue — the operational heart of the pay-first model.
 *
 * A parent has already been charged for everything on this page. The coordinator
 * phones the educator, then either assigns them and confirms, or can't fulfil it
 * and refunds in full. Both staff roles work it; the API's `requireStaff` guard
 * is what actually decides, so this renders the same for a coordinator and an
 * admin.
 */
export default async function BookingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!session.isStaff) redirect("/account");

  const { awaiting, decided, educators, readAt, error } = await loadBookingQueue();
  const isAdmin = session.activeRole === "admin";

  const overdue = awaiting.filter(
    (booking) => new Date(booking.slaDeadline).getTime() < readAt,
  ).length;

  return (
    <DashboardPage
      eyebrow="Operations"
      title="Bookings"
      description="Every booking here is already paid. Contact the educator, then assign and confirm — or, if it can't be fulfilled, refund it in full and the parent is emailed the reason. Bookings left past their confirmation deadline are refunded automatically."
    >
      {error ? (
        <p
          role="alert"
          className="mb-7 rounded-[14px] border-[1.5px] border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.07)] px-4 py-3 text-[13.5px] text-[#a63a30]"
        >
          {error}
        </p>
      ) : null}

      {overdue > 0 ? (
        <p
          role="alert"
          className="mb-7 rounded-[14px] border-[1.5px] border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.07)] px-4 py-3 text-[13.5px] text-[#a63a30]"
        >
          <b>{overdue}</b> {overdue === 1 ? "booking is" : "bookings are"} past the
          confirmation deadline. The next sweep refunds{" "}
          {overdue === 1 ? "it" : "them"} automatically — confirm now if{" "}
          {overdue === 1 ? "it" : "they"} can still be filled.
        </p>
      ) : null}

      <DashboardCard title={`Awaiting confirmation (${awaiting.length})`}>
        {awaiting.length === 0 ? (
          <EmptyState>
            Nothing waiting. Paid bookings from <b>/book</b> land here the moment
            Stripe confirms the payment.
          </EmptyState>
        ) : (
          <ul className="flex flex-col gap-4">
            {awaiting.map((booking) => (
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

      {decided.length > 0 ? (
        <div className="mt-6">
          <DashboardCard title={`Confirmed (${decided.length})`}>
            <ul className="flex flex-col gap-4">
              {decided.map((booking) => (
                <BookingQueueRow
                key={booking.id}
                booking={booking}
                educators={educators}
                readAt={readAt}
                isAdmin={isAdmin}
              />
              ))}
            </ul>
          </DashboardCard>
        </div>
      ) : null}
    </DashboardPage>
  );
}
