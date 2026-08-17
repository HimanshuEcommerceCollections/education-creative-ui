"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import type { ParentBooking } from "@contracts/bookings.ts";

import { cancelBookingAction } from "@/app/(site)/account/actions";
import { SessionExpiredAlert } from "@/components/auth/session-expired-alert";
import { IDLE, formMessage, sessionExpired } from "@/lib/auth/form-state";
import { cn } from "@/lib/utils";

/** Full refund at this much notice or more. `BOOKING_POLICY.cancellationWindowHours`. */
const CANCELLATION_WINDOW_HOURS = 24;

const PILL =
  "rounded-[40px] border-[1.5px] px-[20px] py-[10px] text-[13.5px] font-semibold no-underline " +
  "transition-colors disabled:cursor-wait disabled:opacity-60";

const OUTLINE = "border-line bg-white text-ink hover:border-slate hover:bg-[rgba(var(--slate-rgb),0.05)]";
const DANGER = "border-[rgba(194,72,60,0.4)] bg-white text-[#a63a30] hover:bg-[rgba(194,72,60,0.06)]";

function CancelButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-busy={pending} className={cn(PILL, DANGER)}>
      {pending ? "Cancelling…" : "Cancel this session"}
    </button>
  );
}

/**
 * What a parent can actually *do* about one of their bookings.
 *
 * Two gaps this closes. An abandoned checkout read "Payment not finished / You can
 * book it again" and offered nothing — re-entering the whole form was the only path,
 * and the paid-for slot went to waste. And no booking, in any state, could be
 * cancelled from the account at all.
 *
 * Resuming is a link, not a call: the checkout mount belongs to the booking flow,
 * and a second Stripe embed here would be two places minting client secrets for the
 * same booking.
 */
export function BookingActions({
  booking,
  readAt,
}: {
  booking: ParentBooking;
  /**
   * The instant the page was rendered, as epoch ms.
   *
   * Passed in rather than read here: `Date.now()` during render is impure, and a
   * client reading its own clock would render different copy than the server sent
   * and mismatch on hydration. Same reason the coordinator queue threads `readAt`
   * down to its rows.
   */
  readAt: number;
}) {
  const [state, formAction] = useActionState(cancelBookingAction, IDLE);
  const [confirming, setConfirming] = useState(false);

  const expired = sessionExpired(state);
  const failed = state.status === "error";
  const message = expired
    ? undefined
    : formMessage(state) ?? (state.status === "success" ? state.message : undefined);

  const canResume = booking.status === "pending_payment";
  const canCancel =
    booking.status === "pending_payment" ||
    booking.status === "paid_unconfirmed" ||
    booking.status === "confirmed";

  if (!canResume && !canCancel) return null;

  const hoursAway =
    (new Date(`${booking.preferredDate}T${booking.preferredTime}:00`).getTime() - readAt) /
    3_600_000;
  /*
   * A hint, not a gate. The API owns the cutoff and this only sets an expectation —
   * which is why the copy below states the rule rather than asserting an outcome.
   */
  const insideWindow = Number.isFinite(hoursAway) && hoursAway < CANCELLATION_WINDOW_HOURS;

  return (
    <div className="mt-5 border-t border-line pt-5">
      {message ? (
        <p
          role={failed ? "alert" : "status"}
          className={cn(
            "mb-4 rounded-[12px] border-[1.5px] px-4 py-3 text-[13.5px] leading-[1.55]",
            failed
              ? "border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.07)] text-[#a63a30]"
              : "border-[rgba(45,120,80,0.35)] bg-[rgba(45,120,80,0.07)] text-[#256a45]",
          )}
        >
          {message}
        </p>
      ) : null}

      {expired ? <SessionExpiredAlert className="mb-4 rounded-[14px] border-[1.5px] border-[rgba(210,162,65,0.55)] bg-[rgba(210,162,65,0.12)] px-[16px] py-[14px]" /> : null}

      {state.status === "success" ? null : (
        <div className="flex flex-wrap items-center gap-3">
          {canResume ? (
            <Link href={`/book?resume=${encodeURIComponent(booking.id)}`} className={cn(PILL, OUTLINE)}>
              Finish paying
            </Link>
          ) : null}

          {canCancel && !confirming ? (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="text-[13.5px] font-semibold text-[#a63a30] transition-colors hover:underline"
            >
              Cancel this session
            </button>
          ) : null}
        </div>
      )}

      {canCancel && confirming && state.status !== "success" ? (
        <form action={formAction} className="mt-4">
          <input type="hidden" name="id" value={booking.id} />
          <p className="mb-3 text-[13.5px] leading-[1.6] text-ink">
            {booking.status === "pending_payment" ? (
              <>You haven&rsquo;t been charged for this one, so there&rsquo;s nothing to refund.</>
            ) : insideWindow ? (
              <>
                This session is less than {CANCELLATION_WINDOW_HOURS} hours away, so it
                can&rsquo;t be refunded &mdash; the educator has already held the time.
                You can still cancel so nobody travels, and if something has gone wrong{" "}
                <Link href="/support" className="font-semibold text-slate underline">
                  tell us
                </Link>{" "}
                and a coordinator will look at it.
              </>
            ) : (
              <>
                You&rsquo;re more than {CANCELLATION_WINDOW_HOURS} hours ahead, so this
                is refunded in full. It reaches your account within 5&ndash;10 business
                days.
              </>
            )}
          </p>
          <label className="mb-3 block text-[12.5px] font-semibold uppercase tracking-[0.07em] text-muted">
            Anything we should know? (optional)
            <input
              name="reason"
              placeholder="Family plans changed"
              className="mt-[6px] w-full max-w-[420px] rounded-[11px] border-[1.5px] border-line bg-sand px-[13px] py-[10px] text-[13.5px] font-normal normal-case tracking-normal text-ink placeholder:text-[rgba(99,99,110,0.6)] focus:border-slate focus:bg-white focus:outline-none"
            />
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <CancelButton />
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="text-[13.5px] font-semibold text-muted transition-colors hover:text-ink"
            >
              Keep it
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
