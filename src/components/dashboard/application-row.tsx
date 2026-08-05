"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import type { EducatorApplicationStatus } from "@contracts/educator-applications.ts";

import {
  approveApplicationAction,
  reviewApplicationAction,
} from "@/app/(dashboard)/dashboard/actions";
import { IDLE, formMessage } from "@/lib/auth/form-state";
import { cn } from "@/lib/utils";

export interface ApplicationSummary {
  id: string;
  applicantName: string;
  email: string;
  phone: string | null;
  subjectsOfInterest: string[];
  yearsExperience: string | null;
  about: string;
  status: EducatorApplicationStatus;
  createdAt: string;
}

const STATUS_STYLES: Record<EducatorApplicationStatus, string> = {
  submitted: "border-[rgba(210,162,65,0.5)] bg-[rgba(210,162,65,0.12)] text-[#7a5a12]",
  in_review: "border-[rgba(46,58,115,0.3)] bg-[rgba(var(--slate-rgb),0.08)] text-slate",
  approved: "border-[rgba(45,120,80,0.35)] bg-[rgba(45,120,80,0.09)] text-[#256a45]",
  rejected: "border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.08)] text-[#a63a30]",
};

const STATUS_LABELS: Record<EducatorApplicationStatus, string> = {
  submitted: "New",
  in_review: "In review",
  approved: "Approved",
  rejected: "Rejected",
};

const ACTION_BUTTON =
  "rounded-[40px] border-[1.5px] px-[18px] py-[9px] text-[13px] font-semibold " +
  "transition-colors disabled:cursor-wait disabled:opacity-60";

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
    <button type="submit" disabled={pending} aria-busy={pending} className={cn(ACTION_BUTTON, className)}>
      {pending ? pendingLabel : label}
    </button>
  );
}

/**
 * One application in the staff queue, with the review and approve controls.
 *
 * Approval is a distinct form rather than another status option: it creates the
 * educator's account and emails an invite, so it deserves its own deliberate
 * click.
 */
export function ApplicationRow({ application }: { application: ApplicationSummary }) {
  const [reviewState, reviewAction] = useActionState(reviewApplicationAction, IDLE);
  const [approveState, approveAction] = useActionState(approveApplicationAction, IDLE);
  const [expanded, setExpanded] = useState(false);

  const message =
    formMessage(reviewState) ??
    formMessage(approveState) ??
    (approveState.status === "success" ? approveState.message : undefined) ??
    (reviewState.status === "success" ? reviewState.message : undefined);

  const failed = reviewState.status === "error" || approveState.status === "error";
  const settled = application.status === "approved" || application.status === "rejected";

  return (
    <li className="rounded-[18px] border border-line bg-white p-6 shadow-[0_24px_50px_-46px_rgba(35,40,70,0.4)] max-[560px]:p-[18px]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-[10px]">
            <h3 className="font-serif text-[19px] font-semibold tracking-[-0.01em]">
              {application.applicantName}
            </h3>
            <span
              className={cn(
                "rounded-[30px] border px-[11px] py-[3px] text-[11.5px] font-bold uppercase tracking-[0.06em]",
                STATUS_STYLES[application.status],
              )}
            >
              {STATUS_LABELS[application.status]}
            </span>
          </div>
          <p className="mt-[6px] text-[13.5px] text-muted">
            {application.email}
            {application.phone ? ` · ${application.phone}` : ""}
          </p>
          <p className="mt-1 text-[13px] text-muted">
            {application.subjectsOfInterest.join(", ") || "No subject given"}
            {application.yearsExperience ? ` · ${application.yearsExperience} yrs` : ""}
            {" · applied "}
            {new Date(application.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setExpanded((open) => !open)}
          aria-expanded={expanded}
          className="shrink-0 text-[13px] font-semibold text-slate transition-colors hover:text-gold"
        >
          {expanded ? "Hide details" : "View details"}
        </button>
      </div>

      {expanded ? (
        <p className="mt-4 whitespace-pre-line rounded-[12px] border border-line bg-sand px-4 py-3 text-[14px] leading-[1.6] text-ink">
          {application.about}
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

      {!settled ? (
        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-5">
          {application.status === "submitted" ? (
            <form action={reviewAction}>
              <input type="hidden" name="id" value={application.id} />
              <input type="hidden" name="status" value="in_review" />
              <PendingButton
                label="Start review"
                pendingLabel="Saving…"
                className="border-line bg-white text-ink hover:border-slate hover:bg-[rgba(var(--slate-rgb),0.05)]"
              />
            </form>
          ) : null}

          {/*
            The API refuses this unless a background check reference is on file
            and blocks it entirely if the email already has an account — the
            child-safety invariant is enforced there, not by this button.
          */}
          <form action={approveAction} className="flex flex-wrap items-center gap-3">
            <input type="hidden" name="id" value={application.id} />
            <input
              name="backgroundCheckRef"
              placeholder="Background check ref"
              className="w-[190px] rounded-[11px] border-[1.5px] border-line bg-sand px-[13px] py-[9px] text-[13px] text-ink placeholder:text-[rgba(99,99,110,0.6)] focus:border-slate focus:bg-white focus:outline-none"
            />
            <PendingButton
              label="Approve & send invite"
              pendingLabel="Approving…"
              className="border-transparent bg-slate text-white hover:bg-slate-deep"
            />
          </form>

          <form action={reviewAction}>
            <input type="hidden" name="id" value={application.id} />
            <input type="hidden" name="status" value="rejected" />
            <PendingButton
              label="Reject"
              pendingLabel="Rejecting…"
              className="border-[rgba(194,72,60,0.4)] bg-white text-[#a63a30] hover:bg-[rgba(194,72,60,0.06)]"
            />
          </form>
        </div>
      ) : null}
    </li>
  );
}
