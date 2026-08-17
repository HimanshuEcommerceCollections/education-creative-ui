import "server-only";

import type { ReviewQueueResponse, StaffReview } from "@contracts/reviews.ts";

import { ApiError, apiFetch } from "@/lib/api/server";
import { readSessionToken } from "@/lib/auth/cookies";

/** The three states a review can be in, and the three tabs of the queue. */
export const REVIEW_STATUSES = ["pending", "published", "rejected"] as const;
export type ReviewQueueStatus = (typeof REVIEW_STATUSES)[number];

/**
 * One page of the queue.
 *
 * Smaller than the API's 100 ceiling on purpose: a moderator reads every word of
 * every row, and a hundred of them on one screen is a scroll, not a queue.
 */
export const REVIEW_PAGE_SIZE = 25;

export function parseReviewStatus(raw: string | undefined): ReviewQueueStatus {
  return (REVIEW_STATUSES as readonly string[]).includes(raw ?? "")
    ? (raw as ReviewQueueStatus)
    : "pending";
}

/** A page number out of a query string, clamped to something sane. */
export function parseOffset(raw: string | undefined): number {
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Math.floor(value);
}

export interface ReviewQueue {
  items: StaffReview[];
  /** Reviews in this status, not on this page — the figure the header shows. */
  total: number;
  hasMore: boolean;
  limit: number;
  offset: number;
  error: string | null;
}

/**
 * Reads one status page of the moderation queue.
 *
 * Filtering happens server-side rather than by pulling everything and splitting
 * it here: past one page that silently drops the oldest rows, and the oldest
 * pending review is exactly the one that has been waiting longest.
 *
 * A failure comes back as data. A moderator who can't reach the API should see
 * the dashboard say so, not an error boundary.
 */
export async function loadReviewQueue(
  status: ReviewQueueStatus,
  offset = 0,
): Promise<ReviewQueue> {
  const token = await readSessionToken();

  try {
    const result = await apiFetch<ReviewQueueResponse>(
      `/reviews?status=${status}&limit=${REVIEW_PAGE_SIZE}&offset=${offset}`,
      { token },
    );

    const limit = result.limit ?? REVIEW_PAGE_SIZE;
    const resolvedOffset = result.offset ?? offset;

    return {
      items: result.items,
      total: result.total ?? result.items.length,
      // The server's own signal wins; the fallback is the only evidence available
      // if it ever stops sending one.
      hasMore: result.hasMore ?? resolvedOffset + result.items.length < (result.total ?? 0),
      limit,
      offset: resolvedOffset,
      error: null,
    };
  } catch (error) {
    return {
      items: [],
      total: 0,
      hasMore: false,
      limit: REVIEW_PAGE_SIZE,
      offset,
      error:
        error instanceof ApiError
          ? error.message
          : "We couldn't load the review queue just now.",
    };
  }
}
