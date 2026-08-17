"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import type { StaffReview } from "@contracts/reviews.ts";

import { moderateReviewAction } from "@/app/(dashboard)/dashboard/reviews/actions";
import { SessionExpiredAlert } from "@/components/auth/session-expired-alert";
import { StarMeter } from "@/components/ui/stars";
import { IDLE, fieldError, formMessage, sessionExpired } from "@/lib/auth/form-state";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<StaffReview["status"], string> = {
  pending: "border-[rgba(210,162,65,0.5)] bg-[rgba(210,162,65,0.12)] text-[#7a5a12]",
  published: "border-[rgba(45,120,80,0.35)] bg-[rgba(45,120,80,0.09)] text-[#256a45]",
  rejected: "border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.08)] text-[#a63a30]",
};

const STATUS_LABELS: Record<StaffReview["status"], string> = {
  pending: "Waiting",
  published: "Published",
  rejected: "Rejected",
};

/** The four facets, in the order the profile page's breakdown reads them. */
const FACETS = [
  { key: "communicationRating", label: "Communication" },
  { key: "knowledgeRating", label: "Knowledge" },
  { key: "punctualityRating", label: "Punctuality" },
  { key: "patienceRating", label: "Patience" },
] as const;

const ACTION_BUTTON =
  "rounded-[40px] border-[1.5px] px-[18px] py-[9px] text-[13px] font-semibold " +
  "transition-colors disabled:cursor-wait disabled:opacity-60";

const FIELD =
  "rounded-[11px] border-[1.5px] border-line bg-sand px-[13px] py-[9px] text-[13px] " +
  "text-ink placeholder:text-[rgba(99,99,110,0.6)] focus:border-slate focus:bg-white focus:outline-none";

/**
 * How much of a review is shown before it has to be asked for. Long enough that
 * most reviews never need expanding, short enough that ten of them still read as
 * a queue.
 */
const BODY_PREVIEW = 320;

function dateLabel(iso: string): string {
  const stamp = new Date(iso);
  return Number.isNaN(stamp.getTime())
    ? iso
    : stamp.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
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
 * One review in the moderation queue, with everything a decision rests on.
 *
 * A moderator is deciding whether words written about a named educator go on a
 * public page, so the row carries the whole context rather than a rating and a
 * snippet: which session (the booking reference), which educator, who wrote it,
 * how old the learner is, and every facet they answered. Publishing on less than
 * that is publishing on a vibe.
 *
 * Reject takes an optional note. It isn't shown to the parent by this surface —
 * it stays on the row and in the audit trail — which is exactly why it's worth
 * writing: the next person to ask "why was this one dropped?" is usually us.
 */
export function ReviewRow({ review }: { review: StaffReview }) {
  const [state, formAction] = useActionState(moderateReviewAction, IDLE);
  const [rejecting, setRejecting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // The staff idle window closing mid-decision is not a problem with this review,
  // and never renders as one.
  const expired = sessionExpired(state);
  const failed = state.status === "error";
  const message = expired
    ? undefined
    : formMessage(state) ?? (state.status === "success" ? state.message : undefined);

  const facets = FACETS.filter((facet) => review[facet.key] !== null);
  const body = review.body?.trim() ?? "";
  const truncatable = body.length > BODY_PREVIEW;
  const shownBody = truncatable && !expanded ? `${body.slice(0, BODY_PREVIEW)}…` : body;

  /*
   * A decision already made stays visible under the published/rejected tabs, but
   * its controls are gone — re-publishing something already published is not an
   * action, and the API would refuse it anyway.
   */
  const decided = review.status !== "pending";

  return (
    <li className="rounded-[18px] border border-line bg-white p-6 shadow-[0_24px_50px_-46px_rgba(35,40,70,0.4)] max-[560px]:p-[18px]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-[10px]">
            <h3 className="font-serif text-[19px] font-semibold tracking-[-0.01em]">
              {review.educatorName}
            </h3>
            <span
              className={cn(
                "rounded-[30px] border px-[11px] py-[3px] text-[11.5px] font-bold uppercase tracking-[0.06em]",
                STATUS_STYLES[review.status],
              )}
            >
              {STATUS_LABELS[review.status]}
            </span>
          </div>

          <p className="mt-[6px] text-[13.5px] text-muted">
            <b className="font-semibold text-ink">{review.bookingReference}</b>
            {" · "}
            {review.educatorSlug}
            {" · written "}
            {dateLabel(review.createdAt)}
            {review.publishedAt ? ` · published ${dateLabel(review.publishedAt)}` : ""}
          </p>

          <p className="mt-1 text-[13px] text-muted">
            {review.parentName} · learner aged {review.learnerAgeBand}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <StarMeter
            value={review.overallRating}
            label="Overall"
            starClassName="h-[18px] w-[18px]"
          />
          <p aria-hidden="true" className="mt-1 font-serif text-[15px] font-semibold">
            {review.overallRating} / 5 overall
          </p>
        </div>
      </div>

      {facets.length > 0 ? (
        <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-4">
          {facets.map((facet) => (
            <div key={facet.key} className="flex items-center gap-2">
              <dt className="text-[12.5px] font-semibold uppercase tracking-[0.06em] text-muted">
                {facet.label}
              </dt>
              <dd>
                <StarMeter value={review[facet.key] ?? 0} label={facet.label} />
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="mt-4 border-t border-line pt-4 text-[13px] text-muted">
          No facet ratings were given — only the overall score.
        </p>
      )}

      {body.length > 0 ? (
        <div className="mt-4">
          {/* Parent-written free text: one long token must wrap, not size the row. */}
          <p className="whitespace-pre-line break-words rounded-[12px] border border-line bg-sand px-4 py-3 text-[14px] leading-[1.6] text-ink">
            {shownBody}
          </p>
          {truncatable ? (
            <button
              type="button"
              onClick={() => setExpanded((open) => !open)}
              aria-expanded={expanded}
              className="mt-2 text-[13px] font-semibold text-slate transition-colors hover:text-gold"
            >
              {expanded ? "Show less" : "Read the whole review"}
            </button>
          ) : null}
        </div>
      ) : (
        <p className="mt-4 text-[13px] italic text-muted">
          A rating with nothing written alongside it.
        </p>
      )}

      {review.moderationNote ? (
        <p className="mt-3 break-words rounded-[12px] border border-dashed border-line px-4 py-3 text-[13px] leading-[1.55] text-muted">
          <b className="font-semibold text-ink">Moderator note:</b>{" "}
          {review.moderationNote}
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

      {!decided && state.status !== "success" ? (
        <div className="mt-5 border-t border-line pt-5">
          <div className="flex flex-wrap items-center gap-3">
            <form action={formAction}>
              <input type="hidden" name="id" value={review.id} />
              <input type="hidden" name="action" value="publish" />
              <PendingButton
                label="Publish"
                pendingLabel="Publishing…"
                className="border-transparent bg-slate text-white hover:bg-slate-deep"
              />
            </form>

            {!rejecting ? (
              <button
                type="button"
                onClick={() => setRejecting(true)}
                className="text-[13px] font-semibold text-[#a63a30] transition-colors hover:underline"
              >
                Reject this one
              </button>
            ) : null}
          </div>

          {rejecting ? (
            <form action={formAction} className="mt-4 flex flex-wrap items-end gap-3">
              <input type="hidden" name="id" value={review.id} />
              <input type="hidden" name="action" value="reject" />
              <label className="flex flex-1 flex-col gap-[6px] text-[12px] font-semibold uppercase tracking-[0.07em] text-muted">
                Why? (optional — kept on the record, not shown to the parent)
                <input
                  name="note"
                  maxLength={500}
                  placeholder="Names the child"
                  aria-invalid={Boolean(fieldError(state, "note")) || undefined}
                  className={FIELD}
                />
                {fieldError(state, "note") ? (
                  <span className="text-[12px] font-normal normal-case tracking-normal text-[#a63a30]">
                    {fieldError(state, "note")}
                  </span>
                ) : null}
              </label>
              <PendingButton
                label="Reject"
                pendingLabel="Rejecting…"
                className="border-[rgba(194,72,60,0.4)] bg-white text-[#a63a30] hover:bg-[rgba(194,72,60,0.06)]"
              />
              <button
                type="button"
                onClick={() => setRejecting(false)}
                className="pb-[9px] text-[13px] font-semibold text-muted transition-colors hover:text-ink"
              >
                Cancel
              </button>
            </form>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}
