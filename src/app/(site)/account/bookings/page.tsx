import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AccountShell } from "@/components/account/account-shell";
import { BookingHistory } from "@/components/account/booking-history";
import { ServiceUnavailable } from "@/components/auth/service-unavailable";
import type { ParentBooking } from "@contracts/bookings.ts";
import { ApiError, apiFetch } from "@/lib/api/server";
import { readSessionToken } from "@/lib/auth/cookies";
import { guardSession } from "@/lib/auth/session";
import { loadReviewEligibility } from "@/lib/reviews/eligibility";

export const metadata: Metadata = {
  title: "My Bookings",
  robots: { index: false, follow: false },
};

/**
 * Reads `/bookings/mine`, which scopes to the caller's `customer_profiles` row on
 * the server — nothing here passes an identifier, so there is nothing to tamper
 * with to read someone else's. A failure comes back as data rather than throwing:
 * "we couldn't load your bookings" is recoverable, a crash screen on the page where
 * you check whether you were charged is not.
 *
 * `readAt` is resolved here, outside the component, for two reasons: reading a clock
 * during render is impure, and one instant for the whole page means every card
 * judges the 24-hour cancellation window identically.
 */
async function loadMyBookings(): Promise<{
  bookings: ParentBooking[];
  readAt: number;
  error: string | null;
}> {
  try {
    const token = await readSessionToken();
    const result = await apiFetch<{ items: ParentBooking[] }>("/bookings/mine", { token });
    return { bookings: result.items, readAt: Date.now(), error: null };
  } catch (caught) {
    return {
      bookings: [],
      readAt: Date.now(),
      error:
        caught instanceof ApiError
          ? caught.message
          : "We couldn't load your bookings just now. Please try again in a moment.",
    };
  }
}

/** The parent's own booking history. */
export default async function AccountBookingsPage() {
  const guard = await guardSession("/account/bookings");
  if (!guard.ok) {
    return <ServiceUnavailable message={guard.message} retryHref="/account/bookings" />;
  }

  // Staff and educators have their own surfaces; a parent's history is theirs.
  const { session } = guard;
  if (session.activeRole === "admin" || session.activeRole === "coordinator") {
    redirect("/dashboard/bookings");
  }
  if (session.activeRole === "educator") redirect("/educator/sessions");

  const { bookings, readAt, error } = await loadMyBookings();
  // Only asks about completed sessions, and only because the booking's own status
  // can't tell a session still open for a review from one already reviewed.
  const reviewStates = await loadReviewEligibility(bookings);

  return (
    <AccountShell
      eyebrow="Your account"
      title="My bookings"
      description="Every session you've booked, what you paid, and where it stands. You pay when you book; a coordinator then confirms the time and assigns your educator. Cancel at least 24 hours before a session for a full refund."
      actions={
        <Link
          href="/account"
          className="rounded-[40px] border border-line px-[22px] py-[11px] text-[14px] font-semibold text-ink no-underline transition-colors hover:border-slate hover:bg-[rgba(var(--slate-rgb),0.05)]"
        >
          Account details
        </Link>
      }
    >
      {error ? (
        <p
          role="alert"
          className="mb-7 rounded-[14px] border-[1.5px] border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.07)] px-4 py-3 text-[14px] text-[#a63a30]"
        >
          {error}
        </p>
      ) : null}

      <BookingHistory
        bookings={bookings}
        readAt={readAt}
        reviewStates={reviewStates}
      />
    </AccountShell>
  );
}
