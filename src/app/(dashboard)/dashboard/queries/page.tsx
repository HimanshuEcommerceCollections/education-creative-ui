import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  CONTACT_REQUEST_STATUSES,
  type ContactRequestStatus,
} from "@contracts/contact-requests.ts";

import { ServiceUnavailable } from "@/components/auth/service-unavailable";
import { ContactRequestRow } from "@/components/dashboard/contact-request-row";
import {
  DashboardCard,
  DashboardPage,
  EmptyState,
  StatTile,
} from "@/components/dashboard/page-frame";
import { guardSession } from "@/lib/auth/session";
import {
  ageLabel,
  loadContactQueue,
  parseContactStatus,
  parseMine,
  parseOffset,
} from "@/lib/dashboard/contact-requests";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Queries",
  robots: { index: false, follow: false },
};

const TAB_LABELS: Record<ContactRequestStatus, string> = {
  new: "Nobody's answered",
  in_progress: "Being worked",
  resolved: "Resolved",
  spam: "Spam",
};

const CARD_TITLES: Record<ContactRequestStatus, string> = {
  new: "Waiting for an answer",
  in_progress: "Being worked on",
  resolved: "Resolved",
  spam: "Spam",
};

const PAGE_LINK =
  "rounded-[40px] border-[1.5px] border-line bg-white px-[18px] py-[9px] text-[13px] " +
  "font-semibold text-ink no-underline transition-colors hover:border-slate hover:bg-[rgba(var(--slate-rgb),0.05)]";

const PILL =
  "rounded-[40px] border-[1.5px] px-[18px] py-[9px] text-[13px] font-semibold no-underline transition-colors";

const PILL_ACTIVE = "border-transparent bg-slate text-white";
const PILL_IDLE =
  "border-line bg-white text-ink hover:border-slate hover:bg-[rgba(var(--slate-rgb),0.05)]";

/** `/dashboard/queries?status=…&mine=true&offset=…`, with the defaults left off. */
function queueHref(
  status: ContactRequestStatus,
  mine: boolean,
  offset: number,
): string {
  const params = new URLSearchParams();
  if (status !== "new") params.set("status", status);
  if (mine) params.set("mine", "true");
  if (offset > 0) params.set("offset", String(offset));
  const query = params.toString();
  return query ? `/dashboard/queries?${query}` : "/dashboard/queries";
}

/**
 * The enquiry queue — everything written from the public contact form.
 *
 * **This is a tracker, not an inbox.** There is no reply box and there is no
 * thread, because the platform doesn't send the reply: a coordinator answers
 * from their own mail client and comes back here to record who owns the enquiry
 * and what came of it. Storing one half of a conversation would invite the next
 * reader to believe it was the whole of it, so the screen doesn't pretend to
 * hold one.
 *
 * Both staff roles work it. The API's staff guard is the enforcement point, so a
 * coordinator and an admin see the same controls — exactly as on the
 * applications, bookings, educators and reviews queues.
 *
 * The filter and the "mine" toggle are both URL state, so a coordinator can send
 * a colleague the exact view they're looking at. Default is `new`, because that
 * is the only tab with unowned work in it.
 */
export default async function DashboardQueriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; mine?: string; offset?: string }>;
}) {
  const {
    status: rawStatus,
    mine: rawMine,
    offset: rawOffset,
  } = await searchParams;

  const status = parseContactStatus(rawStatus);
  const mine = parseMine(rawMine);
  const requestedOffset = parseOffset(rawOffset);

  const currentPath = queueHref(status, mine, requestedOffset);
  const guard = await guardSession(currentPath);
  if (!guard.ok) {
    return <ServiceUnavailable message={guard.message} retryHref={currentPath} />;
  }
  if (!guard.session.isStaff) redirect("/account");

  const { items, total, hasMore, limit, offset, counts, readAt, error } =
    await loadContactQueue(status, mine, requestedOffset);

  const firstOnPage = total === 0 ? 0 : offset + 1;
  const lastOnPage = offset + items.length;

  /*
   * The longest anything on this page has been waiting. Derived from the rows in
   * front of you rather than claimed of the whole queue, because the sort order
   * of the list is the API's business — "oldest on this page" is a fact this
   * screen can actually stand behind on page three.
   */
  const unanswered = items.filter(
    (item) => item.status === "new" || item.status === "in_progress",
  );
  const oldestOnPage = unanswered.reduce<string | null>(
    (oldest, item) =>
      oldest === null || new Date(item.createdAt) < new Date(oldest)
        ? item.createdAt
        : oldest,
    null,
  );

  return (
    <DashboardPage
      eyebrow="Operations"
      title="Queries"
      description="Everything written from the contact form. Replies go from your own mail client — this screen records who owns an enquiry and what came of it, and never sends anything to the person who wrote in."
    >
      {/*
        The four counts, and they come from the API's own tally across the whole
        table rather than from the page in front of you — so "9 waiting" stays
        true while you're reading the resolved tab. A dash means we couldn't ask,
        which is the one thing that must never render as a confident zero.
      */}
      <div className="mb-7 grid grid-cols-4 gap-4 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
        <StatTile
          label="Nobody's answered"
          value={counts?.new ?? "—"}
          tone={counts && counts.new > 0 ? "attention" : "neutral"}
          hint={
            oldestOnPage
              ? `Oldest on this page has waited ${ageLabel(oldestOnPage, readAt)}.`
              : "Enquiries land here the moment someone submits /contact."
          }
        />
        <StatTile
          label="Being worked"
          value={counts?.in_progress ?? "—"}
          hint="Someone has said they're on it."
        />
        <StatTile
          label="Resolved"
          value={counts?.resolved ?? "—"}
          hint="Answered, with a note saying what was said."
        />
        <StatTile
          label="Spam"
          value={counts?.spam ?? "—"}
          hint="Filed out of the way, not deleted."
        />
      </div>

      <nav aria-label="Enquiry status" className="mb-4 flex flex-wrap gap-2">
        {CONTACT_REQUEST_STATUSES.map((option) => {
          const active = option === status;
          return (
            <Link
              key={option}
              href={queueHref(option, mine, 0)}
              aria-current={active ? "page" : undefined}
              className={cn(PILL, active ? PILL_ACTIVE : PILL_IDLE)}
            >
              {TAB_LABELS[option]}
            </Link>
          );
        })}
      </nav>

      {/*
        A link rather than a checkbox: the state it toggles is the URL, so it
        needs no client JavaScript and the resulting view can be sent to someone.
        Switching it drops `offset` — page three of everyone's enquiries has
        nothing to do with page three of yours.
      */}
      <div className="mb-7 flex flex-wrap items-center gap-3">
        {/*
          A link, not a toggle button, so no `aria-pressed` — that attribute
          belongs to `role="button"` and would be a lie on an anchor. The label
          itself carries the state instead, which a screen reader reads anyway.
        */}
        <Link
          href={queueHref(status, !mine, 0)}
          className={cn(PILL, mine ? PILL_ACTIVE : PILL_IDLE)}
        >
          {mine ? "Showing only mine" : "Only the ones I hold"}
        </Link>
        <p className="text-[12.5px] leading-[1.5] text-muted">
          {mine
            ? "Filtered to enquiries assigned to you. The counts above still cover everyone's."
            : "Everyone's enquiries, held or not."}
        </p>
      </div>

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
        empty queue: "nothing waiting" and "you've paged off the end" are the same
        picture and very different facts.
      */}
      {!error && items.length === 0 && offset > 0 ? (
        <p
          role="status"
          className="mb-7 rounded-[14px] border-[1.5px] border-[rgba(210,162,65,0.5)] bg-[rgba(210,162,65,0.1)] px-4 py-3 text-[13.5px] leading-[1.55] text-ink"
        >
          There&rsquo;s nothing on this page &mdash; the list is shorter than it was
          when this link was made.{" "}
          <Link
            href={queueHref(status, mine, 0)}
            className="font-semibold text-slate underline"
          >
            Back to the first page
          </Link>
          .
        </p>
      ) : null}

      <DashboardCard
        title={`${CARD_TITLES[status]}${mine ? ", yours" : ""} (${total})`}
      >
        {items.length === 0 ? (
          <EmptyState>
            {mine ? (
              <>
                You&rsquo;re not holding anything in this state.{" "}
                <Link
                  href={queueHref(status, false, 0)}
                  className="font-semibold text-slate underline"
                >
                  See everyone&rsquo;s
                </Link>
                .
              </>
            ) : status === "new" ? (
              <>
                Nothing waiting &mdash; every enquiry has someone on it. New ones land
                here the moment somebody submits <b>/contact</b>.
              </>
            ) : (
              <>No enquiries are {TAB_LABELS[status].toLowerCase()}.</>
            )}
          </EmptyState>
        ) : (
          <ul className="flex flex-col gap-4">
            {items.map((request) => (
              <ContactRequestRow
                key={request.id}
                request={request}
                readAt={readAt}
                viewerId={guard.session.user.id}
              />
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
                  href={queueHref(status, mine, Math.max(0, offset - limit))}
                  className={PAGE_LINK}
                >
                  &larr; Newer
                </Link>
              ) : null}
              {hasMore ? (
                <Link
                  href={queueHref(status, mine, offset + limit)}
                  className={PAGE_LINK}
                >
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
