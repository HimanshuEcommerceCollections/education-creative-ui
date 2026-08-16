import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ServiceUnavailable } from "@/components/auth/service-unavailable";
import {
  DashboardCard,
  DashboardPage,
  EmptyState,
} from "@/components/dashboard/page-frame";
import { ReviewRow } from "@/components/dashboard/review-row";
import { guardSession } from "@/lib/auth/session";
import {
  REVIEW_STATUSES,
  type ReviewQueueStatus,
  loadReviewQueue,
  parseOffset,
  parseReviewStatus,
} from "@/lib/dashboard/reviews";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Reviews",
  robots: { index: false, follow: false },
};

const TAB_LABELS: Record<ReviewQueueStatus, string> = {
  pending: "Waiting on us",
  published: "Published",
  rejected: "Rejected",
};

const CARD_TITLES: Record<ReviewQueueStatus, string> = {
  pending: "Waiting for a decision",
  published: "Published",
  rejected: "Rejected",
};

const PAGE_LINK =
  "rounded-[40px] border-[1.5px] border-line bg-white px-[18px] py-[9px] text-[13px] " +
  "font-semibold text-ink no-underline transition-colors hover:border-slate hover:bg-[rgba(var(--slate-rgb),0.05)]";

/** `/dashboard/reviews?status=…&offset=…`, with the defaults left off. */
function queueHref(status: ReviewQueueStatus, offset: number): string {
  const params = new URLSearchParams();
  if (status !== "pending") params.set("status", status);
  if (offset > 0) params.set("offset", String(offset));
  const query = params.toString();
  return query ? `/dashboard/reviews?${query}` : "/dashboard/reviews";
}

/**
 * The moderation queue.
 *
 * Nothing a parent writes reaches a public page until someone here says so, which
 * makes this the surface that decides what the educator profiles claim about
 * themselves. Both staff roles work it — the API's `requireStaff` guard is the
 * enforcement point, so a coordinator and an admin see the same controls, exactly
 * as on the applications and bookings queues.
 *
 * Default view is `pending`, because that is the only tab with work in it. The
 * other two are there so a decision can be looked up afterwards, not re-made.
 */
export default async function DashboardReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; offset?: string }>;
}) {
  const { status: rawStatus, offset: rawOffset } = await searchParams;
  const status = parseReviewStatus(rawStatus);
  const requestedOffset = parseOffset(rawOffset);

  const currentPath = queueHref(status, requestedOffset);
  const guard = await guardSession(currentPath);
  if (!guard.ok) {
    return <ServiceUnavailable message={guard.message} retryHref={currentPath} />;
  }
  if (!guard.session.isStaff) redirect("/account");

  const { items, total, hasMore, limit, offset, error } = await loadReviewQueue(
    status,
    requestedOffset,
  );

  const firstOnPage = total === 0 ? 0 : offset + 1;
  const lastOnPage = offset + items.length;

  return (
    <DashboardPage
      eyebrow="Operations"
      title="Reviews"
      description="A review can only be written against a session that was paid for and delivered, one per booking — but nothing a parent writes is public until it's approved here. Published reviews carry the parent's first initial and the learner's age band, and nothing else about the family."
    >
      <nav aria-label="Review status" className="mb-7 flex flex-wrap gap-2">
        {REVIEW_STATUSES.map((option) => {
          const active = option === status;
          return (
            <Link
              key={option}
              href={queueHref(option, 0)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-[40px] border-[1.5px] px-[18px] py-[9px] text-[13px] font-semibold no-underline transition-colors",
                active
                  ? "border-transparent bg-slate text-white"
                  : "border-line bg-white text-ink hover:border-slate hover:bg-[rgba(var(--slate-rgb),0.05)]",
              )}
            >
              {TAB_LABELS[option]}
            </Link>
          );
        })}
      </nav>

      {error ? (
        <p
          role="alert"
          className="mb-7 rounded-[14px] border-[1.5px] border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.07)] px-4 py-3 text-[13.5px] text-[#a63a30]"
        >
          {error}
        </p>
      ) : null}

      {/*
        An offset past the end of the list. Worth naming rather than showing an
        empty queue: "nothing pending" and "you've paged off the end" are the same
        picture and very different facts.
      */}
      {!error && items.length === 0 && offset > 0 ? (
        <p
          role="status"
          className="mb-7 rounded-[14px] border-[1.5px] border-[rgba(210,162,65,0.5)] bg-[rgba(210,162,65,0.1)] px-4 py-3 text-[13.5px] leading-[1.55] text-ink"
        >
          There&rsquo;s nothing on this page &mdash; the list is shorter than it was
          when this link was made.{" "}
          <Link href={queueHref(status, 0)} className="font-semibold text-slate underline">
            Back to the first page
          </Link>
          .
        </p>
      ) : null}

      <DashboardCard title={`${CARD_TITLES[status]} (${total})`}>
        {items.length === 0 ? (
          <EmptyState>
            {status === "pending" ? (
              <>
                Nothing waiting. Reviews land here when a parent writes one about a{" "}
                <b>completed</b> session from <b>/account/bookings</b>.
              </>
            ) : (
              <>No reviews have been {status} yet.</>
            )}
          </EmptyState>
        ) : (
          <ul className="flex flex-col gap-4">
            {items.map((review) => (
              <ReviewRow key={review.id} review={review} />
            ))}
          </ul>
        )}

        {items.length > 0 ? (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
            <p className="text-[13px] text-muted">
              Showing <b className="font-semibold text-ink">{firstOnPage}</b>&ndash;
              <b className="font-semibold text-ink">{lastOnPage}</b> of{" "}
              <b className="font-semibold text-ink">{total}</b>
              {hasMore ? " — there are more after this page." : ""}
            </p>
            <div className="flex flex-wrap gap-3">
              {offset > 0 ? (
                <Link
                  href={queueHref(status, Math.max(0, offset - limit))}
                  className={PAGE_LINK}
                >
                  &larr; Newer
                </Link>
              ) : null}
              {hasMore ? (
                <Link href={queueHref(status, offset + limit)} className={PAGE_LINK}>
                  Older &rarr;
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}
      </DashboardCard>
    </DashboardPage>
  );
}
