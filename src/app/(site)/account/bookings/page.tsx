import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AccountShell } from "@/components/account/account-shell";
import { BookingHistory } from "@/components/account/booking-history";
import type { ParentBooking } from "@contracts/bookings.ts";
import { ApiError, apiFetch } from "@/lib/api/server";
import { readSessionToken } from "@/lib/auth/cookies";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "My Bookings",
  robots: { index: false, follow: false },
};

/**
 * The parent's own booking history.
 *
 * Reads `/bookings/mine`, which scopes to their `customer_profiles` row on the
 * server — this page passes no identifier, so there is nothing to tamper with to
 * read someone else's. A failure renders as an inline notice rather than an error
 * page: "we couldn't load your bookings" is recoverable, a crash screen on the
 * page where you check whether you were charged is not.
 */
export default async function AccountBookingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  // Staff and educators have their own surfaces; a parent's history is theirs.
  if (session.activeRole === "admin" || session.activeRole === "coordinator") {
    redirect("/dashboard/bookings");
  }
  if (session.activeRole === "educator") redirect("/educator/sessions");

  let bookings: ParentBooking[] = [];
  let error: string | null = null;

  try {
    const token = await readSessionToken();
    const result = await apiFetch<{ items: ParentBooking[] }>("/bookings/mine", { token });
    bookings = result.items;
  } catch (caught) {
    error =
      caught instanceof ApiError
        ? caught.message
        : "We couldn't load your bookings just now. Please try again in a moment.";
  }

  return (
    <AccountShell
      eyebrow="Your account"
      title="My bookings"
      description="Every session you've booked, what you paid, and where it stands. You pay when you book; a coordinator then confirms the time and assigns your educator."
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

      <BookingHistory bookings={bookings} />
    </AccountShell>
  );
}
