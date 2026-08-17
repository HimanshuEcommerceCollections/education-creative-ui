import "server-only";

import {
  CONTACT_REQUEST_STATUSES,
  type ContactRequestListResponse,
  type ContactRequestRecord,
  type ContactRequestStatus,
} from "@contracts/contact-requests.ts";

import { ApiError, apiFetch } from "@/lib/api/server";
import { readSessionToken } from "@/lib/auth/cookies";

/**
 * Reads behind `/dashboard/queries` — the enquiries that arrive from the public
 * contact form and the queue staff work them from.
 *
 * Both return their failure as data rather than throwing, the same shape the
 * applications, bookings, educators and review loaders use: a coordinator who
 * can't reach the API should see the page say so, not an error boundary.
 */

/**
 * One page of the queue. Smaller than the API's 100 ceiling on purpose: someone
 * reads these a row at a time, and a hundred of them is a scroll, not a queue.
 */
export const CONTACT_QUEUE_PAGE_SIZE = 25;

/**
 * The same clamp the review queue applies to `?offset=`. Shared rather than
 * copied — a page offset out of a query string is the same problem again.
 */
export { parseOffset } from "./reviews";

export function parseContactStatus(raw: string | undefined): ContactRequestStatus {
  return (CONTACT_REQUEST_STATUSES as readonly string[]).includes(raw ?? "")
    ? (raw as ContactRequestStatus)
    : "new";
}

/**
 * The "only mine" toggle out of the query string.
 *
 * Strictly `"true"` and nothing else, because the API coerces this one with
 * `z.coerce.boolean()` — under which the string `"false"` is *true*. Only ever
 * sending the parameter when it is genuinely on keeps that trap shut.
 */
export function parseMine(raw: string | undefined): boolean {
  return raw === "true";
}

export type ContactRequestCounts = ContactRequestListResponse["counts"];

export interface ContactQueue {
  items: ContactRequestRecord[];
  /** Enquiries matching the filter, not on this page — the figure the header shows. */
  total: number;
  hasMore: boolean;
  limit: number;
  offset: number;
  /**
   * How many sit in each status, computed by the API regardless of the filter in
   * front of you — so an unattended `new` pile stays visible from a screen
   * showing something else.
   *
   * `null` means "we couldn't ask". A zero here would be a claim — "nothing is
   * waiting" — and that is exactly the claim a failed request must not make.
   */
  counts: ContactRequestCounts | null;
  /**
   * The instant this page was read, for the age labels. Taken here rather than
   * from `Date.now()` inside a component so every row on one render measures
   * against the same clock, and so a server-rendered age can't disagree with the
   * browser's.
   */
  readAt: number;
  error: string | null;
}

/**
 * One page of the enquiry queue.
 *
 * Filtering runs server-side rather than by pulling everything and splitting it
 * here: past one page that silently drops rows, and the row it drops is the one
 * that has been waiting longest — which is the only row this screen exists for.
 */
export async function loadContactQueue(
  status: ContactRequestStatus,
  mine: boolean,
  offset = 0,
): Promise<ContactQueue> {
  const token = await readSessionToken();

  const params = new URLSearchParams({
    status,
    limit: String(CONTACT_QUEUE_PAGE_SIZE),
    offset: String(offset),
  });
  if (mine) params.set("mine", "true");

  try {
    const result = await apiFetch<ContactRequestListResponse>(
      `/contact-requests?${params}`,
      { token },
    );

    const limit = result.limit ?? CONTACT_QUEUE_PAGE_SIZE;
    const resolvedOffset = result.offset ?? offset;
    const total = result.total ?? result.items.length;

    return {
      items: result.items,
      total,
      // The server's own signal wins; the fallback is the only evidence available
      // if it ever stops sending one.
      hasMore: result.hasMore ?? resolvedOffset + result.items.length < total,
      limit,
      offset: resolvedOffset,
      counts: result.counts ?? null,
      readAt: Date.now(),
      error: null,
    };
  } catch (error) {
    return {
      items: [],
      total: 0,
      hasMore: false,
      limit: CONTACT_QUEUE_PAGE_SIZE,
      offset,
      counts: null,
      readAt: Date.now(),
      error:
        error instanceof ApiError
          ? error.message
          : "We couldn't load the enquiry queue just now.",
    };
  }
}

export interface ContactRequestResult {
  request: ContactRequestRecord | null;
  /** The API said there is no such enquiry — distinct from it failing to answer. */
  missing: boolean;
  readAt: number;
  error: string | null;
}

export async function loadContactRequest(id: string): Promise<ContactRequestResult> {
  const token = await readSessionToken();

  try {
    const request = await apiFetch<ContactRequestRecord>(
      `/contact-requests/${encodeURIComponent(id)}`,
      { token },
    );
    return { request, missing: false, readAt: Date.now(), error: null };
  } catch (error) {
    if (error instanceof ApiError && error.code === "not_found") {
      return { request: null, missing: true, readAt: Date.now(), error: null };
    }
    return {
      request: null,
      missing: false,
      readAt: Date.now(),
      error:
        error instanceof ApiError
          ? error.message
          : "We couldn't load this enquiry just now.",
    };
  }
}

/** Past this, an unanswered enquiry is worth looking at twice. One working day. */
export const AGEING_AFTER_MS = 24 * 60 * 60 * 1000;

/**
 * How long something has been sitting, in the shortest form that still says it.
 *
 * Measured against an instant the read passes in, never `Date.now()` at render:
 * the whole point of this queue is that nothing waits unnoticed, so the number
 * has to be the same one for every row on the page.
 */
export function ageLabel(since: string, readAt: number): string {
  const elapsed = readAt - new Date(since).getTime();
  if (!Number.isFinite(elapsed)) return "unknown";
  if (elapsed < 60_000) return "just now";

  const minutes = Math.floor(elapsed / 60_000);
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
}

/** True once an enquiry has waited long enough that its age should be loud. */
export function hasAged(since: string, readAt: number): boolean {
  return readAt - new Date(since).getTime() >= AGEING_AFTER_MS;
}

/** `Aug 15, 2026 · 4:07 PM` — when it landed, to the minute. */
export function arrivedLabel(iso: string): string {
  const stamp = new Date(iso);
  if (Number.isNaN(stamp.getTime())) return iso;
  return `${stamp.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })} · ${stamp.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })}`;
}
