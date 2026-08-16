"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { BOOKING_TIMEZONE, REFUND_POLICY } from "@contracts/bookings.ts";
import type {
  AssignableEducator,
  BookingStatus,
  CoordinatorBooking,
} from "@contracts/bookings.ts";

import {
  cannotConfirmBookingAction,
  confirmBookingAction,
  reassignBookingAction,
  recordBookingOutcomeAction,
  refundBookingAction,
  rescheduleBookingAction,
  revealChildDetailsAction,
} from "@/app/(dashboard)/dashboard/bookings/actions";
import { SessionExpiredAlert } from "@/components/auth/session-expired-alert";
import { IDLE, fieldError, formMessage, sessionExpired } from "@/lib/auth/form-state";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Partial<Record<BookingStatus, string>> = {
  paid_unconfirmed: "border-[rgba(210,162,65,0.5)] bg-[rgba(210,162,65,0.12)] text-[#7a5a12]",
  confirmed: "border-[rgba(45,120,80,0.35)] bg-[rgba(45,120,80,0.09)] text-[#256a45]",
  completed: "border-[rgba(46,58,115,0.3)] bg-[rgba(var(--slate-rgb),0.08)] text-slate",
  no_show: "border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.08)] text-[#a63a30]",
  refunded: "border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.08)] text-[#a63a30]",
  partially_refunded:
    "border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.08)] text-[#a63a30]",
  disputed: "border-[rgba(194,72,60,0.5)] bg-[rgba(194,72,60,0.12)] text-[#a63a30]",
};

const STATUS_LABELS: Partial<Record<BookingStatus, string>> = {
  paid_unconfirmed: "Awaiting confirmation",
  confirmed: "Confirmed",
  completed: "Completed",
  no_show: "No-show",
  refunded: "Refunded",
  partially_refunded: "Partly refunded",
  disputed: "Disputed",
  expired: "Expired",
  pending_payment: "Unpaid",
};

const ACTION_BUTTON =
  "rounded-[40px] border-[1.5px] px-[18px] py-[9px] text-[13px] font-semibold " +
  "transition-colors disabled:cursor-wait disabled:opacity-60";

const FIELD =
  "rounded-[11px] border-[1.5px] border-line bg-sand px-[13px] py-[9px] text-[13px] " +
  "text-ink placeholder:text-[rgba(99,99,110,0.6)] focus:border-slate focus:bg-white focus:outline-none";

/**
 * `America/New_York` → `New York`. Every date and time on a booking is a *civil*
 * value in `BOOKING_TIMEZONE`, so the reschedule fields have to name whose clock
 * they mean — a coordinator on a laptop set to UTC would otherwise type theirs.
 */
const TIMEZONE_LABEL = BOOKING_TIMEZONE.split("/").pop()?.replace(/_/g, " ") ?? BOOKING_TIMEZONE;

/** Statuses where the session hasn't happened yet, so its time can still move. */
const RESCHEDULABLE: readonly BookingStatus[] = ["confirmed", "paid_unconfirmed"];

function money(cents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

/** `4:00 PM` from an `HH:MM` civil time. */
function timeLabel(time: string): string {
  const [hour, minute] = time.split(":").map(Number);
  const suffix = (hour ?? 0) < 12 ? "AM" : "PM";
  const twelve = (hour ?? 0) % 12 === 0 ? 12 : (hour ?? 0) % 12;
  return `${twelve}:${String(minute ?? 0).padStart(2, "0")} ${suffix}`;
}

/** `Sat, Aug 15 · 4:00 PM` from the civil date and time on the booking. */
function whenLabel(date: string, time: string): string {
  const stamp = new Date(`${date}T${time}:00`);
  const day = Number.isNaN(stamp.getTime())
    ? date
    : stamp.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
  return `${day} · ${timeLabel(time)}`;
}

/**
 * "1d 4h left" / "3h overdue" against the confirmation deadline, measured from
 * an instant the page passes in rather than the browser's own clock — see
 * `readAt` in `lib/dashboard/bookings.ts`.
 */
function slaLabel(deadline: string, readAt: number): { text: string; overdue: boolean } {
  const remainingMs = new Date(deadline).getTime() - readAt;
  const overdue = remainingMs < 0;
  const hours = Math.floor(Math.abs(remainingMs) / 3_600_000);
  const days = Math.floor(hours / 24);
  const spread = days > 0 ? `${days}d ${hours % 24}h` : `${hours}h`;
  return { text: overdue ? `${spread} overdue` : `${spread} left`, overdue };
}

function PendingButton({
  label,
  pendingLabel,
  className,
}: {
  label: string;
  pendingLabel: string;
  className: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={cn(ACTION_BUTTON, className)}
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

/**
 * One booking in the coordinator's queue.
 *
 * The shape follows the actual job: the coordinator phones the educator, so the
 * assign field defaults to the educator the parent requested but stays editable —
 * a substitution is a normal outcome of that call, not an exception. Learner
 * details sit behind a deliberate click because revealing them is audited.
 */
export function BookingQueueRow({
  booking,
  educators,
  readAt,
  isAdmin,
}: {
  booking: CoordinatorBooking;
  educators: AssignableEducator[];
  /** The instant the queue was read, so every row counts down from the same one. */
  readAt: number;
  /** Admins have no refund cap; coordinators are told theirs up front. */
  isAdmin: boolean;
}) {
  const [confirmState, confirmAction] = useActionState(confirmBookingAction, IDLE);
  const [refundState, refundAction] = useActionState(cannotConfirmBookingAction, IDLE);
  const [detailsState, detailsAction] = useActionState(revealChildDetailsAction, IDLE);
  const [partialState, partialAction] = useActionState(refundBookingAction, IDLE);
  const [outcomeState, outcomeAction] = useActionState(recordBookingOutcomeAction, IDLE);
  const [moveState, moveAction] = useActionState(rescheduleBookingAction, IDLE);
  const [handoverState, handoverAction] = useActionState(reassignBookingAction, IDLE);
  const [refunding, setRefunding] = useState(false);
  const [issuingRefund, setIssuingRefund] = useState(false);
  const [recordingOutcome, setRecordingOutcome] = useState(false);
  /*
   * Rescheduling and reassigning share one slot rather than getting a disclosure
   * each: they are the same decision from the same phone call, and two forms open
   * at once invites saving one and forgetting the other.
   */
  const [changing, setChanging] = useState<"reschedule" | "reassign" | null>(null);

  /*
   * The staff idle window is 45 minutes, and this row is exactly where it closes
   * under someone — mid-note, on a booking a family has already paid for. That
   * gets its own unmistakable notice instead of a red box beside a field.
   */
  const expired = sessionExpired(
    confirmState,
    refundState,
    partialState,
    outcomeState,
    moveState,
    handoverState,
    detailsState,
  );

  const message = expired
    ? undefined
    : formMessage(confirmState) ??
      formMessage(refundState) ??
      formMessage(partialState) ??
      formMessage(outcomeState) ??
      formMessage(moveState) ??
      formMessage(handoverState) ??
      (confirmState.status === "success" ? confirmState.message : undefined) ??
      (refundState.status === "success" ? refundState.message : undefined) ??
      (partialState.status === "success" ? partialState.message : undefined) ??
      (outcomeState.status === "success" ? outcomeState.message : undefined) ??
      (moveState.status === "success" ? moveState.message : undefined) ??
      (handoverState.status === "success" ? handoverState.message : undefined);

  const failed =
    confirmState.status === "error" ||
    refundState.status === "error" ||
    partialState.status === "error" ||
    outcomeState.status === "error" ||
    moveState.status === "error" ||
    handoverState.status === "error";
  const awaiting = booking.status === "paid_unconfirmed";
  const sla = slaLabel(booking.slaDeadline, readAt);
  /** Only a confirmed session can be delivered or missed. */
  const canRecordOutcome = booking.status === "confirmed";
  /** A session that hasn't happened can still move; a finished one can't. */
  const canReschedule = RESCHEDULABLE.includes(booking.status);
  /** Handing it over presupposes somebody is holding it — i.e. a confirm. */
  const canReassign = booking.status === "confirmed";
  /*
   * Who is actually on the hook. `assignedEducator` is set by the confirm, so on a
   * confirmed booking it is the answer; the requested educator is the fallback for
   * the impossible case of a confirmed row without one, so the form never renders
   * a blank name.
   */
  const holder = booking.assignedEducator ?? booking.requestedEducator;
  /** The API refuses a no-op reassign, so the current holder isn't offered. */
  const substitutes = educators.filter((educator) => educator.slug !== holder.slug);

  /*
   * An educator the parent requested who isn't in the approved list still shows
   * as the default, and the API refuses the confirm with a message naming the
   * problem. Silently dropping them from the picker would leave a coordinator
   * wondering why the person they just phoned isn't there.
   */
  const options = educators.some((e) => e.slug === booking.requestedEducator.slug)
    ? educators
    : [booking.requestedEducator, ...educators];

  return (
    <li className="rounded-[18px] border border-line bg-white p-6 shadow-[0_24px_50px_-46px_rgba(35,40,70,0.4)] max-[560px]:p-[18px]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-[10px]">
            <h3 className="font-serif text-[19px] font-semibold tracking-[-0.01em]">
              {booking.subjectTopic}
            </h3>
            <span
              className={cn(
                "rounded-[30px] border px-[11px] py-[3px] text-[11.5px] font-bold uppercase tracking-[0.06em]",
                STATUS_STYLES[booking.status] ??
                  "border-line bg-sand text-muted",
              )}
            >
              {STATUS_LABELS[booking.status] ?? booking.status}
            </span>
            {awaiting ? (
              <span
                className={cn(
                  "text-[12px] font-bold uppercase tracking-[0.06em]",
                  sla.overdue ? "text-[#a63a30]" : "text-muted",
                )}
              >
                {sla.text}
              </span>
            ) : null}
          </div>

          <p className="mt-[6px] text-[13.5px] text-muted">
            <b className="font-semibold text-ink">{booking.reference}</b>
            {" · "}
            {whenLabel(booking.preferredDate, booking.preferredTime)}
            {/* Formatted like the primary time, so a raw `16:00` never leaks out here. */}
            {booking.alternateTime ? ` (or ${timeLabel(booking.alternateTime)})` : ""}
            {booking.flexibleTime ? " · flexible" : ""}
            {" · "}
            {booking.format === "in_home" ? "In-home" : "Online"}
            {" · "}
            {booking.durationMinutes} min
          </p>

          <p className="mt-1 text-[13px] text-muted">
            {booking.parentName} · {booking.parentEmail}
            {booking.parentPhone ? ` · ${booking.parentPhone}` : ""}
            {" · learner aged "}
            {booking.learnerAgeBand}
          </p>

          <p className="mt-1 text-[13px] text-muted">
            Requested <b className="font-semibold text-ink">{booking.requestedEducator.name}</b>
            {booking.assignedEducator
              ? booking.assignedEducator.slug === booking.requestedEducator.slug
                ? " · assigned as requested"
                : ` · assigned ${booking.assignedEducator.name}`
              : ""}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="font-serif text-[19px] font-semibold">
            {money(booking.totalCents, booking.currency)}
          </p>
          <p className="text-[12px] text-muted">
            {money(booking.educatorEarningsCents, booking.currency)} educator
          </p>
          {booking.amountRefundedCents > 0 ? (
            <p className="text-[12px] font-semibold text-[#a63a30]">
              {money(booking.amountRefundedCents, booking.currency)} refunded
            </p>
          ) : null}
        </div>
      </div>

      {/* Audited on the server, so it is a form post rather than a disclosure toggle. */}
      <form action={detailsAction} className="mt-4">
        <input type="hidden" name="id" value={booking.id} />
        <PendingButton
          label={booking.format === "in_home" ? "Show learner & address" : "Show learner"}
          pendingLabel="Loading…"
          className="border-line bg-white text-ink hover:border-slate hover:bg-[rgba(var(--slate-rgb),0.05)]"
        />
      </form>

      {detailsState.status === "success" && detailsState.message ? (
        <p className="mt-3 whitespace-pre-line rounded-[12px] border border-line bg-sand px-4 py-3 text-[13.5px] leading-[1.6] text-ink">
          {detailsState.message}
          <span className="mt-2 block text-[11.5px] uppercase tracking-[0.08em] text-muted">
            This view was recorded in the audit log
          </span>
        </p>
      ) : null}
      {detailsState.status === "error" && !expired ? (
        <p
          role="alert"
          className="mt-3 rounded-[11px] border-[1.5px] border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.07)] px-[14px] py-[10px] text-[13px] text-[#a63a30]"
        >
          {detailsState.message}
        </p>
      ) : null}

      {message ? (
        <p
          role={failed ? "alert" : "status"}
          className={cn(
            "mt-4 rounded-[11px] border-[1.5px] px-[14px] py-[10px] text-[13px] leading-[1.5]",
            failed
              ? "border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.07)] text-[#a63a30]"
              : "border-[rgba(46,58,115,0.25)] bg-[rgba(var(--slate-rgb),0.05)] text-slate",
          )}
        >
          {message}
        </p>
      ) : null}

      {expired ? <SessionExpiredAlert /> : null}

      {canRecordOutcome ? (
        /*
         * How `completed` and `no_show` are finally reachable. Both states had
         * parent-facing copy and a queue label, and nothing in the product could
         * put a booking into either — a delivered session stayed "Confirmed"
         * forever. Staff get this because a coordinator usually hears about a
         * no-show first; the educator's own session card posts to the same
         * endpoint.
         */
        <div className="mt-5 border-t border-line pt-5">
          {recordingOutcome ? (
            <form action={outcomeAction} className="flex flex-wrap items-end gap-3">
              <input type="hidden" name="id" value={booking.id} />
              <label className="flex flex-col gap-[6px] text-[12px] font-semibold uppercase tracking-[0.07em] text-muted">
                Outcome
                <select name="outcome" defaultValue="completed" className={cn(FIELD, "w-[180px]")}>
                  <option value="completed">Delivered</option>
                  <option value="no_show">No-show</option>
                </select>
              </label>
              <label className="flex flex-1 flex-col gap-[6px] text-[12px] font-semibold uppercase tracking-[0.07em] text-muted">
                Note (optional)
                <input
                  name="note"
                  placeholder="Ran the full hour; parent present"
                  className={FIELD}
                />
              </label>
              <PendingButton
                label="Record outcome"
                pendingLabel="Saving…"
                className="border-transparent bg-slate text-white hover:bg-slate-deep"
              />
              <button
                type="button"
                onClick={() => setRecordingOutcome(false)}
                className="pb-[9px] text-[13px] font-semibold text-muted transition-colors hover:text-ink"
              >
                Cancel
              </button>
              {fieldError(outcomeState, "note") ? (
                <p className="w-full text-[12px] text-[#a63a30]">
                  {fieldError(outcomeState, "note")}
                </p>
              ) : null}
              <p className="w-full text-[12px] text-muted">
                A no-show is not refunded automatically — use the refund control below
                if the family is owed something back.
              </p>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setRecordingOutcome(true)}
              className="text-[13px] font-semibold text-slate transition-colors hover:text-gold"
            >
              Record the outcome &mdash; delivered or no-show
            </button>
          )}
        </div>
      ) : null}

      {awaiting ? (
        <div className="mt-5 border-t border-line pt-5">
          <form action={confirmAction} className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="id" value={booking.id} />
            <label className="flex flex-col gap-[6px] text-[12px] font-semibold uppercase tracking-[0.07em] text-muted">
              Educator taking it
              <select
                name="educatorSlug"
                defaultValue={booking.requestedEducator.slug}
                className={cn(FIELD, "w-[220px]")}
              >
                {options.map((educator) => (
                  <option key={educator.slug} value={educator.slug}>
                    {educator.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-1 flex-col gap-[6px] text-[12px] font-semibold uppercase tracking-[0.07em] text-muted">
              Note from the call (optional)
              <input name="note" placeholder="Spoke to them, 4pm works" className={FIELD} />
            </label>
            <PendingButton
              label="Confirm & assign"
              pendingLabel="Confirming…"
              className="border-transparent bg-slate text-white hover:bg-slate-deep"
            />
          </form>

          {refunding ? (
            <form action={refundAction} className="mt-4 flex flex-wrap items-end gap-3">
              <input type="hidden" name="id" value={booking.id} />
              <label className="flex flex-1 flex-col gap-[6px] text-[12px] font-semibold uppercase tracking-[0.07em] text-muted">
                Why can&rsquo;t this be confirmed? The parent is told this.
                <input
                  name="reason"
                  required
                  placeholder="No educator available for this time"
                  className={FIELD}
                />
              </label>
              <PendingButton
                label="Refund in full"
                pendingLabel="Refunding…"
                className="border-[rgba(194,72,60,0.4)] bg-white text-[#a63a30] hover:bg-[rgba(194,72,60,0.06)]"
              />
              <button
                type="button"
                onClick={() => setRefunding(false)}
                className="text-[13px] font-semibold text-muted transition-colors hover:text-ink"
              >
                Cancel
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setRefunding(true)}
              className="mt-4 text-[13px] font-semibold text-[#a63a30] transition-colors hover:underline"
            >
              Can&rsquo;t confirm this one
            </button>
          )}
        </div>
      ) : booking.refundableCents > 0 ? (
        /*
         * The conflict path, on a booking that is past the confirm decision. The
         * cap shown here is a courtesy: the API checks it against this booking's
         * whole refund history, so the real answer can be stricter than the hint.
         */
        <div className="mt-5 border-t border-line pt-5">
          {issuingRefund ? (
            <form action={partialAction} className="flex flex-wrap items-end gap-3">
              <input type="hidden" name="id" value={booking.id} />
              <label className="flex flex-col gap-[6px] text-[12px] font-semibold uppercase tracking-[0.07em] text-muted">
                Refund
                <input
                  name="amount"
                  required
                  inputMode="decimal"
                  defaultValue={(booking.refundableCents / 100).toFixed(2)}
                  aria-describedby={`refund-limit-${booking.id}`}
                  aria-invalid={Boolean(fieldError(partialState, "amount"))}
                  className={cn(FIELD, "w-[120px]")}
                />
                {/*
                  The action re-keys the contract's `amountCents` onto this input's
                  name, so an over-cap refusal lands on the box the number was typed
                  into rather than only in the form alert.
                */}
                {fieldError(partialState, "amount") ? (
                  <span className="text-[12px] font-normal normal-case tracking-normal text-[#a63a30]">
                    {fieldError(partialState, "amount")}
                  </span>
                ) : null}
              </label>
              <label className="flex flex-1 flex-col gap-[6px] text-[12px] font-semibold uppercase tracking-[0.07em] text-muted">
                Why? The parent is told this.
                <input
                  name="reason"
                  required
                  placeholder="Educator cut the session short"
                  className={FIELD}
                />
              </label>
              <PendingButton
                label="Issue refund"
                pendingLabel="Refunding…"
                className="border-[rgba(194,72,60,0.4)] bg-white text-[#a63a30] hover:bg-[rgba(194,72,60,0.06)]"
              />
              <button
                type="button"
                onClick={() => setIssuingRefund(false)}
                className="pb-[9px] text-[13px] font-semibold text-muted transition-colors hover:text-ink"
              >
                Cancel
              </button>
              <p
                id={`refund-limit-${booking.id}`}
                className="w-full text-[12px] text-muted"
              >
                {money(booking.refundableCents, booking.currency)} refundable.{" "}
                {isAdmin
                  ? "You have no refund cap — an admin can return the whole balance."
                  : `Coordinators can refund up to ${money(
                      REFUND_POLICY.coordinatorCapCents,
                      booking.currency,
                    )} per booking, counting anything already refunded. An admin can approve more.`}
              </p>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIssuingRefund(true)}
              className="text-[13px] font-semibold text-[#a63a30] transition-colors hover:underline"
            >
              Refund some or all of {money(booking.refundableCents, booking.currency)}
            </button>
          )}
        </div>
      ) : null}

      {canReschedule || canReassign ? (
        /*
         * The two ways a session changes after it has been sold: a new time, a
         * different educator, or — on a bad day — both. They share one disclosure
         * slot for the same reason the refund and outcome controls have theirs:
         * this row already carries five decisions, and two more permanently-open
         * forms would bury the one that matters most on a given booking.
         */
        <div className="mt-5 border-t border-line pt-5">
          {changing === "reschedule" ? (
            <form
              /*
               * Re-keyed on the booking's own date and time. A successful move
               * revalidates the queue and this row comes back with the new values,
               * but an uncontrolled input ignores a changed `defaultValue` — so
               * without the key the form would sit there still showing the old
               * time and the reason that has already been emailed.
               */
              key={`${booking.preferredDate}T${booking.preferredTime}`}
              action={moveAction}
              className="flex flex-wrap items-end gap-3"
            >
              <input type="hidden" name="id" value={booking.id} />

              {/* What it is now, beside what it is becoming. */}
              <div className="flex flex-col gap-[6px] text-[12px] font-semibold uppercase tracking-[0.07em] text-muted">
                Currently
                <span className="rounded-[11px] border-[1.5px] border-dashed border-line bg-sand px-[13px] py-[9px] text-[13px] font-normal normal-case tracking-normal text-ink">
                  {whenLabel(booking.preferredDate, booking.preferredTime)}
                </span>
              </div>
              <span aria-hidden="true" className="pb-[11px] text-[15px] text-muted">
                &rarr;
              </span>

              <label className="flex flex-col gap-[6px] text-[12px] font-semibold uppercase tracking-[0.07em] text-muted">
                New date
                <input
                  type="date"
                  name="preferredDate"
                  required
                  defaultValue={booking.preferredDate}
                  aria-invalid={Boolean(fieldError(moveState, "preferredDate"))}
                  className={cn(FIELD, "w-[165px]")}
                />
                {fieldError(moveState, "preferredDate") ? (
                  <span className="text-[12px] font-normal normal-case tracking-normal text-[#a63a30]">
                    {fieldError(moveState, "preferredDate")}
                  </span>
                ) : null}
              </label>

              <label className="flex flex-col gap-[6px] text-[12px] font-semibold uppercase tracking-[0.07em] text-muted">
                New time
                <input
                  type="time"
                  name="preferredTime"
                  required
                  defaultValue={booking.preferredTime}
                  aria-invalid={Boolean(fieldError(moveState, "preferredTime"))}
                  className={cn(FIELD, "w-[130px]")}
                />
                {fieldError(moveState, "preferredTime") ? (
                  <span className="text-[12px] font-normal normal-case tracking-normal text-[#a63a30]">
                    {fieldError(moveState, "preferredTime")}
                  </span>
                ) : null}
              </label>

              <label className="flex flex-1 basis-[220px] flex-col gap-[6px] text-[12px] font-semibold uppercase tracking-[0.07em] text-muted">
                Why it moved. Everyone is told this.
                <input
                  name="reason"
                  required
                  placeholder="Parent asked to move it a week"
                  aria-invalid={Boolean(fieldError(moveState, "reason"))}
                  className={FIELD}
                />
                {fieldError(moveState, "reason") ? (
                  <span className="text-[12px] font-normal normal-case tracking-normal text-[#a63a30]">
                    {fieldError(moveState, "reason")}
                  </span>
                ) : null}
              </label>

              <PendingButton
                label="Move the session"
                pendingLabel="Moving…"
                className="border-transparent bg-slate text-white hover:bg-slate-deep"
              />
              <button
                type="button"
                onClick={() => setChanging(null)}
                className="pb-[9px] text-[13px] font-semibold text-muted transition-colors hover:text-ink"
              >
                Cancel
              </button>

              <p className="w-full text-[12px] leading-[1.55] text-muted">
                Times are {TIMEZONE_LABEL} time. Saving emails the parent
                {booking.assignedEducator
                  ? ` and ${booking.assignedEducator.name}`
                  : " and the educator on this booking"}{" "}
                the new time and this reason — it goes out the moment you save, so
                make the call first.
              </p>
            </form>
          ) : changing === "reassign" ? (
            /* Keyed on the current holder for the same reason as the date above. */
            <form key={holder.slug} action={handoverAction} className="flex flex-wrap items-end gap-3">
              <input type="hidden" name="id" value={booking.id} />

              {/* Named, not implied: this is who the session is being taken from. */}
              <div className="flex flex-col gap-[6px] text-[12px] font-semibold uppercase tracking-[0.07em] text-muted">
                Teaching it now
                <span className="rounded-[11px] border-[1.5px] border-dashed border-line bg-sand px-[13px] py-[9px] text-[13px] font-normal normal-case tracking-normal text-ink">
                  {holder.name}
                </span>
              </div>
              <span aria-hidden="true" className="pb-[11px] text-[15px] text-muted">
                &rarr;
              </span>

              {substitutes.length === 0 ? (
                <>
                  <p className="flex-1 basis-[260px] pb-[10px] text-[13px] leading-[1.55] text-muted">
                    There is no other approved educator with a current background check
                    to hand this to. Approve one first, or refund the booking.
                  </p>
                  <button
                    type="button"
                    onClick={() => setChanging(null)}
                    className="pb-[9px] text-[13px] font-semibold text-muted transition-colors hover:text-ink"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <label className="flex flex-col gap-[6px] text-[12px] font-semibold uppercase tracking-[0.07em] text-muted">
                    Hand it to
                    <select
                      name="educatorSlug"
                      required
                      defaultValue=""
                      aria-invalid={Boolean(fieldError(handoverState, "educatorSlug"))}
                      className={cn(FIELD, "w-[240px]")}
                    >
                      <option value="" disabled>
                        Choose an educator
                      </option>
                      {substitutes.map((educator) => (
                        <option key={educator.slug} value={educator.slug}>
                          {educator.subjects.length > 0
                            ? `${educator.name} — ${educator.subjects.join(", ")}`
                            : educator.name}
                        </option>
                      ))}
                    </select>
                    {fieldError(handoverState, "educatorSlug") ? (
                      <span className="text-[12px] font-normal normal-case tracking-normal text-[#a63a30]">
                        {fieldError(handoverState, "educatorSlug")}
                      </span>
                    ) : null}
                  </label>

                  <label className="flex flex-1 basis-[220px] flex-col gap-[6px] text-[12px] font-semibold uppercase tracking-[0.07em] text-muted">
                    Why it moved. Everyone is told this.
                    <input
                      name="reason"
                      required
                      placeholder="Original educator is ill"
                      aria-invalid={Boolean(fieldError(handoverState, "reason"))}
                      className={FIELD}
                    />
                    {fieldError(handoverState, "reason") ? (
                      <span className="text-[12px] font-normal normal-case tracking-normal text-[#a63a30]">
                        {fieldError(handoverState, "reason")}
                      </span>
                    ) : null}
                  </label>

                  <PendingButton
                    label="Reassign"
                    pendingLabel="Reassigning…"
                    className="border-transparent bg-slate text-white hover:bg-slate-deep"
                  />
                  <button
                    type="button"
                    onClick={() => setChanging(null)}
                    className="pb-[9px] text-[13px] font-semibold text-muted transition-colors hover:text-ink"
                  >
                    Cancel
                  </button>

                  <p className="w-full text-[12px] leading-[1.55] text-muted">
                    Saving emails all three straight away — the parent, the educator
                    taking it on, and {holder.name}, who is told they no longer have
                    this session. Phone {holder.name} before you save, not after.
                  </p>
                </>
              )}
            </form>
          ) : (
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {canReschedule ? (
                <button
                  type="button"
                  onClick={() => setChanging("reschedule")}
                  className="text-[13px] font-semibold text-slate transition-colors hover:text-gold"
                >
                  Move this session to another time
                </button>
              ) : null}
              {canReassign ? (
                <button
                  type="button"
                  onClick={() => setChanging("reassign")}
                  className="text-[13px] font-semibold text-slate transition-colors hover:text-gold"
                >
                  Hand it to a different educator
                </button>
              ) : null}
              <span className="w-full text-[12px] text-muted">
                Either one emails the parent and the educators involved the moment you
                save it.
              </span>
            </div>
          )}
        </div>
      ) : null}
    </li>
  );
}
