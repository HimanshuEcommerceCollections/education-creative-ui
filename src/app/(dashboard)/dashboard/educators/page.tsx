import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ServiceUnavailable } from "@/components/auth/service-unavailable";
import { EducatorRow } from "@/components/dashboard/educator-row";
import {
  DashboardCard,
  DashboardPage,
  EmptyState,
  StatTile,
} from "@/components/dashboard/page-frame";
import { guardSession } from "@/lib/auth/session";
import {
  EDUCATOR_FILTERS,
  type EducatorFilter,
  loadEducatorCounts,
  loadEducatorDirectory,
  parseEducatorFilter,
  parseEducatorSearch,
  parseOffset,
} from "@/lib/dashboard/educators";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Educators",
  robots: { index: false, follow: false },
};

const TAB_LABELS: Record<EducatorFilter, string> = {
  all: "Everyone",
  draft: "Draft",
  pending: "Awaiting a check",
  approved: "Approved",
  suspended: "Suspended",
};

const CARD_TITLES: Record<EducatorFilter, string> = {
  all: "Educators",
  draft: "Draft profiles",
  pending: "Awaiting a background check",
  approved: "Approved",
  suspended: "Suspended",
};

const PAGE_LINK =
  "rounded-[40px] border-[1.5px] border-line bg-white px-[18px] py-[9px] text-[13px] " +
  "font-semibold text-ink no-underline transition-colors hover:border-slate hover:bg-[rgba(var(--slate-rgb),0.05)]";

/** `/dashboard/educators?status=…&q=…&offset=…`, with the defaults left off. */
function directoryHref(
  filter: EducatorFilter,
  search: string | undefined,
  offset: number,
): string {
  const params = new URLSearchParams();
  if (filter !== "all") params.set("status", filter);
  if (search) params.set("q", search);
  if (offset > 0) params.set("offset", String(offset));
  const query = params.toString();
  return query ? `/dashboard/educators?${query}` : "/dashboard/educators";
}

/**
 * The educator directory.
 *
 * This page and the detail view beneath it are the only place in the product
 * where verification can be moved, which makes them the gate the whole
 * child-safety invariant hangs off: until someone here approves an educator they
 * cannot be assigned a booking, cannot see their own sessions, and are shown no
 * learner detail — however far along their application got.
 *
 * Both staff roles work it. The API's `requireStaff` guard is what actually
 * decides, so a coordinator and an admin see the same controls, exactly as on the
 * applications, bookings and reviews queues.
 *
 * The filter and the search both run server-side. This list is paged, and a
 * search box that only looked at the twenty-five rows already on screen would
 * answer "no such educator" for someone on page two.
 */
export default async function EducatorsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; offset?: string }>;
}) {
  const { status: rawStatus, q: rawSearch, offset: rawOffset } = await searchParams;
  const filter = parseEducatorFilter(rawStatus);
  const search = parseEducatorSearch(rawSearch);
  const requestedOffset = parseOffset(rawOffset);

  const currentPath = directoryHref(filter, search, requestedOffset);
  const guard = await guardSession(currentPath);
  if (!guard.ok) {
    return <ServiceUnavailable message={guard.message} retryHref={currentPath} />;
  }
  if (!guard.session.isStaff) redirect("/account");

  const [directory, counts] = await Promise.all([
    loadEducatorDirectory(filter, search, requestedOffset),
    loadEducatorCounts(),
  ]);
  const { items, total, hasMore, limit, offset, error } = directory;

  const firstOnPage = total === 0 ? 0 : offset + 1;
  const lastOnPage = offset + items.length;

  return (
    <DashboardPage
      eyebrow="Operations"
      title="Educators"
      description="Approving an educator here is what allows them to be assigned to sessions with children — nothing else in the product moves that status. Until it happens, an approved applicant with an account and a password still can't be given a single booking, doesn't appear in the assignment picker, and sees no learner details."
    >
      {/*
        Counts come from the API's `total` for each status, not from the page in
        front of you — "3 awaiting a check" has to stay true on page four. A dash
        means the count couldn't be read, which is the one thing that must not
        render as a confident zero.
      */}
      <div className="mb-7 grid grid-cols-3 gap-4 max-[760px]:grid-cols-1">
        <StatTile
          label="Awaiting a check"
          value={counts.pending ?? "—"}
          tone={counts.pending && counts.pending > 0 ? "attention" : "neutral"}
          hint="Have an account, can't be assigned anything yet."
        />
        <StatTile
          label="Approved"
          value={counts.approved ?? "—"}
          hint="Assignable, and shown on the public site."
        />
        <StatTile
          label="Suspended"
          value={counts.suspended ?? "—"}
          hint="Signed out, hidden, and unassignable."
        />
      </div>

      <nav aria-label="Verification status" className="mb-4 flex flex-wrap gap-2">
        {EDUCATOR_FILTERS.map((option) => {
          const active = option === filter;
          return (
            <Link
              key={option}
              href={directoryHref(option, search, 0)}
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

      {/*
        A plain GET form: no client component, no JavaScript, and the resulting
        URL is shareable and bookmarkable. Submitting drops `offset`, because the
        page you were on in the previous result set means nothing in this one.
      */}
      <form
        method="get"
        action="/dashboard/educators"
        className="mb-7 flex flex-wrap items-center gap-3"
      >
        {filter !== "all" ? <input type="hidden" name="status" value={filter} /> : null}
        <label className="flex min-w-[260px] flex-1 flex-col gap-[6px] text-[12px] font-semibold uppercase tracking-[0.07em] text-muted">
          Search by name or subject
          <input
            type="search"
            name="q"
            maxLength={80}
            defaultValue={search ?? ""}
            placeholder="Amelia, or Piano"
            className="w-full rounded-[11px] border-[1.5px] border-line bg-white px-[13px] py-[9px] text-[13.5px] text-ink placeholder:text-[rgba(99,99,110,0.6)] focus:border-slate focus:outline-none"
          />
        </label>
        <button
          type="submit"
          className="mt-[22px] rounded-[40px] border-[1.5px] border-transparent bg-slate px-[20px] py-[9px] text-[13px] font-semibold text-white transition-colors hover:bg-slate-deep"
        >
          Search
        </button>
        {search ? (
          <Link
            href={directoryHref(filter, undefined, 0)}
            className="mt-[22px] text-[13px] font-semibold text-slate no-underline transition-colors hover:text-gold"
          >
            Clear
          </Link>
        ) : null}
      </form>

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
        empty page: "nobody matches" and "you've paged off the end" look identical
        and are very different facts.
      */}
      {!error && items.length === 0 && offset > 0 ? (
        <p
          role="status"
          className="mb-7 rounded-[14px] border-[1.5px] border-[rgba(210,162,65,0.5)] bg-[rgba(210,162,65,0.1)] px-4 py-3 text-[13.5px] leading-[1.55] text-ink"
        >
          There&rsquo;s nothing on this page &mdash; the list is shorter than it was
          when this link was made.{" "}
          <Link
            href={directoryHref(filter, search, 0)}
            className="font-semibold text-slate underline"
          >
            Back to the first page
          </Link>
          .
        </p>
      ) : null}

      <DashboardCard
        title={`${CARD_TITLES[filter]}${search ? ` matching “${search}”` : ""} (${total})`}
      >
        {items.length === 0 ? (
          <EmptyState>
            {search ? (
              <>
                Nobody matches <b>{search}</b>
                {filter === "all" ? "" : ` in ${TAB_LABELS[filter].toLowerCase()}`}. The
                search covers names and the subjects an educator teaches.
              </>
            ) : filter === "pending" ? (
              <>
                Nobody is waiting on a background check. Approving an application on{" "}
                <b>/dashboard/applications</b> creates the profile that lands here.
              </>
            ) : (
              <>No educators in this state.</>
            )}
          </EmptyState>
        ) : (
          <ul className="flex flex-col gap-4">
            {items.map((educator) => (
              <EducatorRow key={educator.slug} educator={educator} />
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
                  href={directoryHref(filter, search, Math.max(0, offset - limit))}
                  className={PAGE_LINK}
                >
                  &larr; Previous
                </Link>
              ) : null}
              {hasMore ? (
                <Link
                  href={directoryHref(filter, search, offset + limit)}
                  className={PAGE_LINK}
                >
                  Next &rarr;
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}
      </DashboardCard>
    </DashboardPage>
  );
}
