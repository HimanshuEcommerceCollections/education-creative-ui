"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import type { EducatorAssignment } from "@contracts/bookings.ts";

import {
  recordSessionOutcomeAction,
  revealSessionAddressAction,
} from "@/app/(dashboard)/educator/sessions/actions";
import { SessionExpiredAlert } from "@/components/auth/session-expired-alert";
import { IDLE, formMessage, sessionExpired } from "@/lib/auth/form-state";
import { cn } from "@/lib/utils";

function money(cents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

function whenLabel(date: string, time: string): string {
  const [hour, minute] = time.split(":").map(Number);
  const stamp = new Date(`${date}T${time}:00`);
  const day = Number.isNaN(stamp.getTime())
    ? date
    : stamp.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
  const suffix = (hour ?? 0) < 12 ? "AM" : "PM";
  const twelve = (hour ?? 0) % 12 === 0 ? 12 : (hour ?? 0) % 12;
  return `${day} at ${twelve}:${String(minute ?? 0).padStart(2, "0")} ${suffix}`;
}

const PILL_BUTTON =
  "rounded-[40px] border-[1.5px] px-[18px] py-[9px] text-[13px] font-semibold " +
  "transition-colors disabled:cursor-wait disabled:opacity-60";

const FIELD =
  "rounded-[11px] border-[1.5px] border-line bg-sand px-[13px] py-[9px] text-[13px] " +
  "text-ink placeholder:text-[rgba(99,99,110,0.6)] focus:border-slate focus:bg-white focus:outline-none";

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
      className={cn(PILL_BUTTON, className)}
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

/**
 * One confirmed session on the educator's dashboard.
 *
 * The learner's first name is here because you cannot teach a child you can't be
 * told the name of. The address is not: fetching it is a separate, audited
 * request, so "who looked at a family's address, and when" has an answer.
 */
export function AssignmentCard({ assignment }: { assignment: EducatorAssignment }) {
  const [addressState, addressAction] = useActionState(revealSessionAddressAction, IDLE);
  const [outcomeState, outcomeAction] = useActionState(recordSessionOutcomeAction, IDLE);
  const [recording, setRecording] = useState(false);

  const past = assignment.status !== "confirmed";
  const expired = sessionExpired(addressState, outcomeState);
  const outcomeMessage = expired
    ? undefined
    : formMessage(outcomeState) ??
      (outcomeState.status === "success" ? outcomeState.message : undefined);

  return (
    <li
      className={cn(
        "rounded-[18px] border border-line bg-white p-6 shadow-[0_24px_50px_-46px_rgba(35,40,70,0.4)] max-[560px]:p-[18px]",
        past && "opacity-80",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-serif text-[19px] font-semibold tracking-[-0.01em]">
            {assignment.subjectTopic} with {assignment.learnerFirstName}
          </h3>
          <p className="mt-[6px] text-[14px] text-ink">
            {whenLabel(assignment.preferredDate, assignment.preferredTime)}
          </p>
          <p className="mt-1 text-[13px] text-muted">
            {assignment.format === "in_home" ? "In-home" : "Online"} ·{" "}
            {assignment.durationMinutes} min · aged {assignment.learnerAgeBand} ·{" "}
            {assignment.reference}
            {past ? ` · ${assignment.status.replace("_", " ")}` : ""}
          </p>
          {assignment.learnerFocus ? (
            /* The parent's free text about their child: a long token wraps. */
            <p className="mt-3 break-words rounded-[12px] border border-line bg-sand px-4 py-3 text-[13.5px] leading-[1.6] text-ink">
              {assignment.learnerFocus}
            </p>
          ) : null}
        </div>

        <p className="shrink-0 text-right font-serif text-[19px] font-semibold">
          {money(assignment.earningsCents, assignment.currency)}
          <span className="mt-[2px] block text-[11.5px] font-sans font-bold uppercase tracking-[0.07em] text-muted">
            You earn
          </span>
        </p>
      </div>

      {assignment.format === "in_home" ? (
        <div className="mt-5 border-t border-line pt-5">
          {addressState.status === "success" && addressState.message ? (
            <p className="whitespace-pre-line rounded-[12px] border border-line bg-sand px-4 py-3 text-[13.5px] leading-[1.6] text-ink">
              {addressState.message}
            </p>
          ) : (
            <form action={addressAction}>
              <input type="hidden" name="id" value={assignment.id} />
              <PendingButton
                label="Show the address"
                pendingLabel="Loading…"
                className="border-line bg-white text-ink hover:border-slate hover:bg-[rgba(var(--slate-rgb),0.05)]"
              />
            </form>
          )}
          {addressState.status === "error" && !expired ? (
            <p
              role="alert"
              className="mt-3 rounded-[11px] border-[1.5px] border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.07)] px-[14px] py-[10px] text-[13px] text-[#a63a30]"
            >
              {addressState.message}
            </p>
          ) : null}
        </div>
      ) : null}

      {outcomeMessage ? (
        <p
          role={outcomeState.status === "error" ? "alert" : "status"}
          className={cn(
            "mt-4 rounded-[11px] border-[1.5px] px-[14px] py-[10px] text-[13px] leading-[1.5]",
            outcomeState.status === "error"
              ? "border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.07)] text-[#a63a30]"
              : "border-[rgba(45,120,80,0.35)] bg-[rgba(45,120,80,0.07)] text-[#256a45]",
          )}
        >
          {outcomeMessage}
        </p>
      ) : null}

      {expired ? <SessionExpiredAlert /> : null}

      {!past ? (
        /*
         * The other half of this surface. The educator dashboard promises "marking
         * them delivered", so the card needs an outcome control and not only "Show
         * the address" — without one, a session they taught stays "Confirmed"
         * indefinitely and a family who was stood up has no record of it.
         */
        <div className="mt-5 border-t border-line pt-5">
          {recording ? (
            <form action={outcomeAction} className="flex flex-wrap items-end gap-3">
              <input type="hidden" name="id" value={assignment.id} />
              <label className="flex flex-col gap-[6px] text-[12px] font-semibold uppercase tracking-[0.07em] text-muted">
                How did it go?
                <select name="outcome" defaultValue="completed" className={cn(FIELD, "w-[190px]")}>
                  <option value="completed">I delivered the session</option>
                  <option value="no_show">Nobody was there</option>
                </select>
              </label>
              <label className="flex flex-1 flex-col gap-[6px] text-[12px] font-semibold uppercase tracking-[0.07em] text-muted">
                Note for the coordinator (optional)
                <input name="note" placeholder="Covered fractions; ran the full hour" className={FIELD} />
              </label>
              <PendingButton
                label="Save"
                pendingLabel="Saving…"
                className="border-transparent bg-slate text-white hover:bg-slate-deep"
              />
              <button
                type="button"
                onClick={() => setRecording(false)}
                className="pb-[9px] text-[13px] font-semibold text-muted transition-colors hover:text-ink"
              >
                Cancel
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setRecording(true)}
              className="text-[13px] font-semibold text-slate transition-colors hover:text-gold"
            >
              Mark this session delivered
            </button>
          )}
        </div>
      ) : null}
    </li>
  );
}
