"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { submitReviewAction } from "@/app/(site)/account/actions";
import { SessionExpiredAlert } from "@/components/auth/session-expired-alert";
import { IDLE, fieldError, formMessage, sessionExpired } from "@/lib/auth/form-state";
import { cn } from "@/lib/utils";

import { StarRatingInput } from "./star-rating-input";

/** Straight from `submitReviewSchema` — the ceiling the API enforces. */
const BODY_MAX = 2000;

/**
 * The four facets, in the order the profile page's rating breakdown reads them.
 * Field names match the contract keys exactly; the labels are the parent-facing
 * wording of the same four questions.
 */
const FACETS = [
  {
    name: "communicationRating",
    label: "Communication",
    hint: "Were you kept in the loop before and after the session?",
  },
  {
    name: "knowledgeRating",
    label: "Knowledge",
    hint: "Did they know the subject well enough to teach it?",
  },
  {
    name: "punctualityRating",
    label: "Punctuality",
    hint: "Did they arrive — or log on — when they said they would?",
  },
  {
    name: "patienceRating",
    label: "Patience",
    hint: "How were they with your child when something didn't click?",
  },
] as const;

const PILL =
  "rounded-[40px] border-[1.5px] px-[20px] py-[10px] text-[13.5px] font-semibold " +
  "transition-colors disabled:cursor-wait disabled:opacity-60";

function SendButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={cn(PILL, "border-transparent bg-slate text-white hover:bg-slate-deep")}
    >
      {pending ? "Sending…" : "Send for review"}
    </button>
  );
}

/**
 * The review a parent writes about a completed session.
 *
 * Collapsed behind a single control until asked for: this sits at the foot of a
 * booking card in a list, and five rating groups unfurled on every completed
 * session would bury the history itself.
 *
 * Only the overall rating is required. The four facets are what the educator's
 * "Rating breakdown" is built from, and demanding all five to say anything at all
 * would cost more reviews than the breakdown is worth — so each one can be left
 * alone, or cleared again after a mis-click.
 */
export function ReviewForm({
  bookingId,
  educatorName,
}: {
  bookingId: string;
  /** Whoever actually taught it — the person the review will be attached to. */
  educatorName: string;
}) {
  const [state, formAction] = useActionState(submitReviewAction, IDLE);
  const [open, setOpen] = useState(false);

  const expired = sessionExpired(state);
  const failed = state.status === "error";
  const message = expired ? undefined : formMessage(state);

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="mt-5 rounded-[14px] border-[1.5px] border-[rgba(45,120,80,0.35)] bg-[rgba(45,120,80,0.07)] px-4 py-[14px]"
      >
        <p className="text-[13px] font-bold uppercase tracking-[0.06em] text-[#256a45]">
          Sent for review
        </p>
        <p className="mt-[6px] text-[13.5px] leading-[1.6] text-ink">
          {state.message}{" "}
          {/*
            The honest half. A parent who thinks their words went live and then
            can't find them assumes the site lost them — so the delay, and the
            reason for it, is stated here rather than discovered later.
          */}
          It isn&rsquo;t published yet: a coordinator reads every review before it
          goes anywhere, and once it&rsquo;s approved it appears on{" "}
          {educatorName}&rsquo;s profile with just your first initial and your
          child&rsquo;s age range. Until then only our team can see it, and
          there&rsquo;s nothing more for you to do.
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <div className="mt-5 border-t border-line pt-5">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            PILL,
            "border-line bg-white text-ink hover:border-slate hover:bg-[rgba(var(--slate-rgb),0.05)]",
          )}
        >
          Leave a review
        </button>
        <p className="mt-2 text-[12.5px] leading-[1.5] text-muted">
          Reviews are read by our team before they&rsquo;re published, and appear
          under your first initial only.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-5 border-t border-line pt-5">
      <input type="hidden" name="bookingId" value={bookingId} />

      <h4 className="font-serif text-[17px] font-semibold tracking-[-0.01em]">
        How was your session with {educatorName}?
      </h4>
      <p className="mt-1 text-[13px] leading-[1.55] text-muted">
        Only the first rating is needed. Everything else is optional, and the whole
        thing is read by a coordinator before anyone else sees it.
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <StarRatingInput
          name="overallRating"
          legend="Overall"
          size="large"
          error={fieldError(state, "overallRating")}
        />

        <div className="grid grid-cols-2 gap-3 max-[620px]:grid-cols-1">
          {FACETS.map((facet) => (
            <StarRatingInput
              key={facet.name}
              name={facet.name}
              legend={facet.label}
              hint={facet.hint}
              optional
              error={fieldError(state, facet.name)}
            />
          ))}
        </div>

        <div>
          <label
            htmlFor={`review-body-${bookingId}`}
            className="mb-2 block text-[13px] font-bold tracking-[0.02em] text-ink"
          >
            Anything you&rsquo;d tell another parent?{" "}
            <span className="font-medium text-muted">(optional)</span>
          </label>
          <textarea
            id={`review-body-${bookingId}`}
            name="body"
            rows={4}
            maxLength={BODY_MAX}
            placeholder="What went well, what your child got out of it, anything another family would want to know."
            aria-describedby={`review-body-${bookingId}-hint`}
            aria-invalid={Boolean(fieldError(state, "body")) || undefined}
            className={cn(
              "w-full resize-y rounded-[11px] border-[1.5px] px-[15px] py-[13px] font-sans text-[15px] text-ink",
              "transition-[border-color,background-color,box-shadow] duration-300 placeholder:text-[rgba(99,99,110,0.6)]",
              "focus:border-slate focus:bg-white focus:shadow-[0_0_0_3px_rgba(46,58,115,0.12)] focus:outline-none",
              fieldError(state, "body") ? "border-[#b23b3b] bg-[#fdf3f2]" : "border-line bg-sand",
            )}
          />
          <p
            id={`review-body-${bookingId}-hint`}
            className="mt-[7px] text-[12.5px] leading-[1.5] text-muted"
          >
            Up to {BODY_MAX.toLocaleString("en-US")} characters. Please don&rsquo;t
            include your child&rsquo;s name — published reviews never show it.
          </p>
          {fieldError(state, "body") ? (
            <p className="mt-[6px] text-[12.5px] font-semibold text-[#b23b3b]">
              {fieldError(state, "body")}
            </p>
          ) : null}
        </div>
      </div>

      {message ? (
        <p
          role="alert"
          className={cn(
            "mt-4 rounded-[12px] border-[1.5px] px-4 py-3 text-[13.5px] leading-[1.55]",
            failed
              ? "border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.07)] text-[#a63a30]"
              : "border-line bg-sand text-ink",
          )}
        >
          {message}
        </p>
      ) : null}

      {expired ? <SessionExpiredAlert /> : null}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <SendButton />
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-[13.5px] font-semibold text-muted transition-colors hover:text-ink"
        >
          Not now
        </button>
      </div>
    </form>
  );
}
