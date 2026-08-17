"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import type {
  EducatorCommitment,
  EducatorVerificationStatus,
} from "@contracts/educators.ts";

import { setEducatorVerificationAction } from "@/app/(dashboard)/dashboard/educators/actions";
import { SessionExpiredAlert } from "@/components/auth/session-expired-alert";
import { IDLE, fieldError, formMessage, sessionExpired } from "@/lib/auth/form-state";
import { cn } from "@/lib/utils";

/** The three transitions the contract allows. `draft` is deliberately not one. */
type Target = "approved" | "suspended" | "pending";

const FIELD =
  "w-full rounded-[11px] border-[1.5px] border-line bg-white px-[13px] py-[9px] text-[13.5px] " +
  "text-ink placeholder:text-[rgba(99,99,110,0.6)] focus:border-slate focus:outline-none";

const ACTION_BUTTON =
  "rounded-[40px] border-[1.5px] px-[18px] py-[9px] text-[13px] font-semibold " +
  "transition-colors disabled:cursor-wait disabled:opacity-60";

const CHOICES: {
  target: Target;
  label: string;
  submitLabel: string;
  pendingLabel: string;
  buttonClass: string;
}[] = [
  {
    target: "approved",
    label: "Approve",
    submitLabel: "Approve for assignment",
    pendingLabel: "Approving…",
    buttonClass: "border-transparent bg-slate text-white hover:bg-slate-deep",
  },
  {
    target: "suspended",
    label: "Suspend",
    submitLabel: "Suspend",
    pendingLabel: "Suspending…",
    buttonClass:
      "border-[rgba(194,72,60,0.4)] bg-white text-[#a63a30] hover:bg-[rgba(194,72,60,0.06)]",
  },
  {
    target: "pending",
    label: "Return to pending",
    submitLabel: "Return to pending",
    pendingLabel: "Saving…",
    buttonClass:
      "border-line bg-white text-ink hover:border-slate hover:bg-[rgba(var(--slate-rgb),0.05)]",
  },
];

/** `Sat, Aug 15 · 4:00 PM` from the civil date and time on a booking. */
function whenLabel(date: string, time: string): string {
  const stamp = new Date(`${date}T${time}:00`);
  const day = Number.isNaN(stamp.getTime())
    ? date
    : stamp.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
  const [hour, minute] = time.split(":").map(Number);
  if (Number.isNaN(hour)) return day;
  const suffix = (hour ?? 0) < 12 ? "AM" : "PM";
  const twelve = (hour ?? 0) % 12 === 0 ? 12 : (hour ?? 0) % 12;
  return `${day} · ${twelve}:${String(minute ?? 0).padStart(2, "0")} ${suffix}`;
}

function SubmitButton({
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

interface VerificationFormProps {
  slug: string;
  name: string;
  status: EducatorVerificationStatus;
  /** The vetting reference already on file, if there is one, to save re-typing. */
  backgroundCheckRef: string | null;
  /** Sessions this educator is committed to and hasn't delivered. */
  confirmedBookings: EducatorCommitment[];
}

/**
 * The verification decision — the reason this page exists.
 *
 * Nothing else in the product can move an educator to `approved`, and until
 * something does, an applicant who was approved, invited and has signed in still
 * can't be given a single booking: the confirm path, the assignment picker, the
 * educator's own session list and every learner-detail read all check this one
 * field.
 *
 * Three things this form insists on, each for a different reason:
 *
 * 1. **A reason, always.** It is the audit row. An approval with no recorded
 *    justification is precisely what an audit of it would need and wouldn't have.
 * 2. **A vetting reference to approve.** Required by the contract's refinement,
 *    so the API refuses it too — this form marks the input `required` when
 *    approving is selected so the person finds out before the round trip, not
 *    instead of it.
 * 3. **Seeing the commitments before suspending.** Suspension is allowed while an
 *    educator is holding confirmed sessions, but it must not happen silently:
 *    nothing reassigns those sessions, so the honest framing is that a
 *    coordinator now owns them.
 *
 * The current status is not offered as a target — the API answers a no-op
 * transition with a conflict, and a button whose only outcome is a refusal is
 * worse than no button.
 */
export function EducatorVerificationForm({
  slug,
  name,
  status,
  backgroundCheckRef,
  confirmedBookings,
}: VerificationFormProps) {
  const [state, formAction] = useActionState(setEducatorVerificationAction, IDLE);
  const [target, setTarget] = useState<Target | null>(null);

  // A staff session idling out mid-decision is not a problem with this educator,
  // and never renders as one.
  const expired = sessionExpired(state);
  const failed = state.status === "error";
  const message = expired
    ? undefined
    : formMessage(state) ?? (state.status === "success" ? state.message : undefined);

  /*
   * The panel closes itself once the change lands: the page revalidates, `status`
   * arrives as the value that was just chosen, and the open target is no longer a
   * transition. No effect, no stale form left sitting open over a decision that
   * has already been made.
   */
  const open = target !== null && target !== status ? target : null;
  const choice = CHOICES.find((entry) => entry.target === open);
  const holdsSessions = confirmedBookings.length > 0;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        {CHOICES.filter((entry) => entry.target !== status).map((entry) => (
          <button
            key={entry.target}
            type="button"
            onClick={() => setTarget(target === entry.target ? null : entry.target)}
            aria-expanded={open === entry.target}
            className={cn(
              ACTION_BUTTON,
              open === entry.target
                ? "border-transparent bg-ink text-white"
                : entry.buttonClass,
            )}
          >
            {entry.label}
          </button>
        ))}
      </div>

      {message ? (
        <p
          role={failed ? "alert" : "status"}
          className={cn(
            "mt-4 rounded-[11px] border-[1.5px] px-[14px] py-[10px] text-[13px] leading-[1.5]",
            failed
              ? "border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.07)] text-[#a63a30]"
              : "border-[rgba(45,120,80,0.35)] bg-[rgba(45,120,80,0.07)] text-[#256a45]",
          )}
        >
          {message}
        </p>
      ) : null}

      {expired ? <SessionExpiredAlert /> : null}

      {open && choice ? (
        <form
          action={formAction}
          className="mt-5 flex flex-col gap-4 rounded-[14px] border border-line bg-sand px-5 py-5"
        >
          <input type="hidden" name="slug" value={slug} />
          <input type="hidden" name="status" value={open} />

          {open === "approved" ? (
            <p className="rounded-[12px] border-[1.5px] border-[rgba(210,162,65,0.55)] bg-[rgba(210,162,65,0.12)] px-4 py-3 text-[13.5px] leading-[1.6] text-ink">
              <b className="font-semibold">
                Approving is what lets {name} be assigned to sessions with children.
              </b>{" "}
              From the moment this saves they can be picked on the bookings queue, and
              a confirmed session releases the learner&rsquo;s name and the family&rsquo;s
              contact details to them. Only approve on a background check you have
              actually seen come back clear.
            </p>
          ) : null}

          {open === "suspended" ? (
            <p className="rounded-[12px] border-[1.5px] border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.07)] px-4 py-3 text-[13.5px] leading-[1.6] text-ink">
              Suspending takes {name} out of the assignment picker, hides them from the
              public directory, and signs them out of every device immediately. It does
              not cancel anything they have already been given.
            </p>
          ) : null}

          {open === "pending" ? (
            <p className="rounded-[12px] border border-line bg-white px-4 py-3 text-[13.5px] leading-[1.6] text-ink">
              Returning {name} to pending withdraws the clearance. They keep their
              account and their profile, and can&rsquo;t be assigned anything until
              someone approves them again. The date their check cleared is kept on the
              record either way.
            </p>
          ) : null}

          {/*
            The commitments, shown before the decision rather than after it. There
            is no reassignment feature, so this is not "these will be moved" — it
            is a list of sessions that become someone's problem the moment this
            button is pressed.
          */}
          {open === "suspended" && holdsSessions ? (
            <div className="rounded-[12px] border-[1.5px] border-[rgba(194,72,60,0.35)] bg-white px-4 py-4">
              <p className="text-[13.5px] font-semibold leading-[1.55] text-[#a63a30]">
                {confirmedBookings.length}{" "}
                {confirmedBookings.length === 1
                  ? "confirmed session is"
                  : "confirmed sessions are"}{" "}
                still assigned to {name}.
              </p>
              <p className="mt-2 text-[13px] leading-[1.6] text-muted">
                Suspending doesn&rsquo;t cancel or reassign{" "}
                {confirmedBookings.length === 1 ? "it" : "them"} — there is no
                reassignment feature yet — so{" "}
                {confirmedBookings.length === 1 ? "it" : "they"} still need a
                coordinator to deal with: find cover, move the session, or refund the
                parent. The family has already paid.
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {confirmedBookings.map((booking) => (
                  <li
                    key={booking.reference}
                    className="rounded-[10px] border border-line bg-sand px-3 py-2 text-[13px] leading-[1.5] text-ink"
                  >
                    <b className="font-semibold">{booking.reference}</b>
                    {" · "}
                    {whenLabel(booking.preferredDate, booking.preferredTime)}
                    {" · "}
                    {booking.subjectTopic}
                  </li>
                ))}
              </ul>
              <label className="mt-3 flex items-start gap-[10px] text-[13px] leading-[1.5] text-ink">
                <input
                  type="checkbox"
                  required
                  className="mt-[3px] h-[15px] w-[15px] shrink-0 accent-[#a63a30]"
                />
                <span>
                  I&rsquo;ve seen{" "}
                  {confirmedBookings.length === 1 ? "this session" : "these sessions"}{" "}
                  and will make sure{" "}
                  {confirmedBookings.length === 1 ? "it isn't" : "they aren't"} left
                  unattended.
                </span>
              </label>
            </div>
          ) : null}

          {open === "approved" ? (
            <label className="flex flex-col gap-[6px] text-[12px] font-semibold uppercase tracking-[0.07em] text-muted">
              Vetting reference (required to approve)
              <input
                name="backgroundCheckRef"
                required
                maxLength={200}
                defaultValue={backgroundCheckRef ?? ""}
                placeholder="DBS-2026-041193"
                aria-invalid={Boolean(fieldError(state, "backgroundCheckRef")) || undefined}
                className={FIELD}
              />
              <span className="text-[12px] font-normal normal-case tracking-normal text-muted">
                The pass/fail reference from the vetting provider — never the ID
                document itself. It goes on the application record.
              </span>
              {fieldError(state, "backgroundCheckRef") ? (
                <span className="text-[12px] font-normal normal-case tracking-normal text-[#a63a30]">
                  {fieldError(state, "backgroundCheckRef")}
                </span>
              ) : null}
            </label>
          ) : null}

          <label className="flex flex-col gap-[6px] text-[12px] font-semibold uppercase tracking-[0.07em] text-muted">
            Why? This is the record of the decision.
            <textarea
              name="reason"
              required
              minLength={3}
              maxLength={1000}
              rows={3}
              placeholder={
                open === "approved"
                  ? "Enhanced check returned clear on 12 Aug; two references confirmed."
                  : open === "suspended"
                    ? "Safeguarding concern raised on 14 Aug — paused pending review."
                    : "Check has lapsed and needs renewing before further sessions."
              }
              aria-invalid={Boolean(fieldError(state, "reason")) || undefined}
              className={cn(FIELD, "resize-y leading-[1.55]")}
            />
            {fieldError(state, "reason") ? (
              <span className="text-[12px] font-normal normal-case tracking-normal text-[#a63a30]">
                {fieldError(state, "reason")}
              </span>
            ) : null}
          </label>

          {fieldError(state, "status") ? (
            <p className="text-[12px] text-[#a63a30]">{fieldError(state, "status")}</p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <SubmitButton
              label={
                open === "suspended" && holdsSessions ? "Suspend anyway" : choice.submitLabel
              }
              pendingLabel={choice.pendingLabel}
              className={choice.buttonClass}
            />
            <button
              type="button"
              onClick={() => setTarget(null)}
              className="text-[13px] font-semibold text-muted transition-colors hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
