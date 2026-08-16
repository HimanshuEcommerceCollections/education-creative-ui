import "server-only";

import type { z } from "zod";

import {
  type EducatorApplicationStatus,
  educatorApplicationSchema,
} from "@contracts/educator-applications.ts";

import { ApiError, apiFetch } from "@/lib/api/server";
import { readSessionToken } from "@/lib/auth/cookies";

/**
 * One application as the staff endpoint serves it.
 *
 * Inferred from the contract schema rather than hand-written: an `ApplicationSummary`
 * interface declared beside the dashboard row is a second copy of a shape the API
 * already defines, and free to drift from it silently. The contract has no exported
 * type for this schema yet (a server change in flight adds one) — when it appears,
 * this alias is the only line that changes.
 */
export type EducatorApplication = z.infer<typeof educatorApplicationSchema>;

/** The API's own ceiling on one page of applications. */
const PAGE_LIMIT = 100;

export interface ApplicationQueue {
  open: EducatorApplication[];
  settled: EducatorApplication[];
  /**
   * True when the API had more than one page of something.
   *
   * Status filtering happens server-side, never by asking for `?limit=100`
   * unfiltered and splitting the page in JS: past a hundred applications that
   * silently drops the oldest row, and because a new submission pushes the window
   * along, the row that falls off can be an *unreviewed* one. Filtering keeps the
   * review queue from competing for space with settled history, and this flag means a
   * truncated list says so instead of pretending to be complete.
   */
  truncated: boolean;
  error: string | null;
}

/** The list response, plus the pagination signals the server is adding. */
type ListResponse = {
  items: EducatorApplication[];
  total?: number;
  hasMore?: boolean;
};

/** One status page. `hasMore` when the server says so, or when the page is full. */
async function readStatus(
  status: EducatorApplicationStatus,
  token: string | null,
  limit: number,
): Promise<{ items: EducatorApplication[]; hasMore: boolean }> {
  const result = await apiFetch<ListResponse>(
    `/educator-applications?status=${status}&limit=${limit}`,
    { token },
  );

  const hasMore =
    result.hasMore ??
    (typeof result.total === "number"
      ? result.total > result.items.length
      : // No signal from the server yet: a page filled to the limit is the only
        // evidence available that something was left behind.
        result.items.length >= limit);

  return { items: result.items, hasMore };
}

/**
 * Loads the educator review queue, filtered server-side and split by whether a
 * decision has been made. Returns the failure as data rather than throwing, so the
 * dashboard can render with an inline notice instead of an error boundary.
 *
 * Shared by the overview (which only needs the counts) and the applications page.
 */
export async function loadApplicationQueue(): Promise<ApplicationQueue> {
  const token = await readSessionToken();

  try {
    // Open work gets the full page each; decided history is reference material and
    // takes a smaller slice, so a year of rejections can't crowd out the queue.
    const [submitted, inReview, approved, rejected] = await Promise.all([
      readStatus("submitted", token, PAGE_LIMIT),
      readStatus("in_review", token, PAGE_LIMIT),
      readStatus("approved", token, 25),
      readStatus("rejected", token, 25),
    ]);

    return {
      open: [...submitted.items, ...inReview.items],
      settled: [...approved.items, ...rejected.items],
      truncated:
        submitted.hasMore || inReview.hasMore || approved.hasMore || rejected.hasMore,
      error: null,
    };
  } catch (error) {
    return {
      open: [],
      settled: [],
      truncated: false,
      error:
        error instanceof ApiError
          ? error.message
          : "We couldn't load the review queue just now.",
    };
  }
}
