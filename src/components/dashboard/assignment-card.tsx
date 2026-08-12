"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import type { EducatorAssignment } from "@contracts/bookings.ts";

import { revealSessionAddressAction } from "@/app/(dashboard)/educator/sessions/actions";
import { IDLE } from "@/lib/auth/form-state";
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

function AddressButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="rounded-[40px] border-[1.5px] border-line bg-white px-[18px] py-[9px] text-[13px] font-semibold transition-colors hover:border-slate hover:bg-[rgba(var(--slate-rgb),0.05)] disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? "Loading…" : "Show the address"}
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

  const past = assignment.status !== "confirmed";

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
            <p className="mt-3 rounded-[12px] border border-line bg-sand px-4 py-3 text-[13.5px] leading-[1.6] text-ink">
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
              <AddressButton />
            </form>
          )}
          {addressState.status === "error" ? (
            <p
              role="alert"
              className="mt-3 rounded-[11px] border-[1.5px] border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.07)] px-[14px] py-[10px] text-[13px] text-[#a63a30]"
            >
              {addressState.message}
            </p>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}
