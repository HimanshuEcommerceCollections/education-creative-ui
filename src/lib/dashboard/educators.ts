import "server-only";

import {
  EDUCATOR_VERIFICATION_STATUSES,
  type EducatorListResponse,
  type EducatorVerificationStatus,
  type StaffEducatorDetail,
  type StaffEducatorProfile,
} from "@contracts/educators.ts";

import { ApiError, apiFetch } from "@/lib/api/server";
import { readSessionToken } from "@/lib/auth/cookies";

/**
 * Reads behind `/dashboard/educators`.
 *
 * Every one of these returns its failure as data rather than throwing, the same
 * shape the applications, staff and review loaders use: a coordinator who can't
 * reach the API should see the page say so, not an error boundary.
 */

/**
 * One page of the directory. Smaller than the API's 100 ceiling: this is a list
 * someone triages a row at a time, and a hundred of them is a scroll rather than
 * a queue.
 */
export const EDUCATOR_PAGE_SIZE = 25;

/**
 * The same clamp the review queue applies to `?offset=`. Shared rather than
 * copied — a page offset out of a query string is the same problem twice, and two
 * copies would be two things to get wrong.
 */
export { parseOffset } from "./reviews";

/** The status tabs, with "all" standing for "don't filter". */
export const EDUCATOR_FILTERS = ["all", ...EDUCATOR_VERIFICATION_STATUSES] as const;
export type EducatorFilter = (typeof EDUCATOR_FILTERS)[number];

export function parseEducatorFilter(raw: string | undefined): EducatorFilter {
  return (EDUCATOR_FILTERS as readonly string[]).includes(raw ?? "")
    ? (raw as EducatorFilter)
    : "all";
}

/**
 * The free-text term, clamped to what the contract accepts.
 *
 * `listEducatorsQuerySchema` caps `q` at 80 characters, so a pasted paragraph
 * would come back as a 400 with nothing on the page explaining it. Trimming here
 * means the search still runs on the first 80 characters, which is the outcome
 * the person wanted.
 */
export function parseEducatorSearch(raw: string | undefined): string | undefined {
  const value = raw?.trim().slice(0, 80) ?? "";
  return value.length > 0 ? value : undefined;
}

export interface EducatorDirectory {
  items: StaffEducatorProfile[];
  /** Educators matching the filter, not the page — the figure the header shows. */
  total: number;
  hasMore: boolean;
  limit: number;
  offset: number;
  error: string | null;
}

/**
 * One page of the staff directory.
 *
 * Both the status filter and the search run server-side. Filtering the page in
 * the browser would only ever search the twenty-five rows already on screen,
 * which for a paged list is worse than offering no search at all — it looks like
 * an answer and isn't one.
 */
export async function loadEducatorDirectory(
  filter: EducatorFilter,
  search: string | undefined,
  offset = 0,
): Promise<EducatorDirectory> {
  const token = await readSessionToken();

  const params = new URLSearchParams({
    limit: String(EDUCATOR_PAGE_SIZE),
    offset: String(offset),
  });
  if (filter !== "all") params.set("verificationStatus", filter);
  if (search) params.set("q", search);

  try {
    const result = await apiFetch<EducatorListResponse>(`/educators?${params}`, { token });
    const limit = result.limit ?? EDUCATOR_PAGE_SIZE;
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
      error: null,
    };
  } catch (error) {
    return {
      items: [],
      total: 0,
      hasMore: false,
      limit: EDUCATOR_PAGE_SIZE,
      offset,
      error:
        error instanceof ApiError
          ? error.message
          : "We couldn't load the educator directory just now.",
    };
  }
}

/**
 * How many educators sit in each state that needs someone to do something.
 *
 * `null` means "we couldn't ask", which the tiles render as a dash. A zero here
 * would be a claim — "nobody is waiting on a background check" — and that is
 * exactly the claim this page must not make on the strength of a failed request.
 */
export interface EducatorCounts {
  pending: number | null;
  approved: number | null;
  suspended: number | null;
}

/** A count without a page: ask for one row and read `total`. */
async function readTotal(
  status: EducatorVerificationStatus,
  token: string | null,
): Promise<number | null> {
  try {
    const result = await apiFetch<EducatorListResponse>(
      `/educators?verificationStatus=${status}&limit=1&offset=0`,
      { token },
    );
    return result.total ?? result.items.length;
  } catch {
    return null;
  }
}

export async function loadEducatorCounts(): Promise<EducatorCounts> {
  const token = await readSessionToken();
  const [pending, approved, suspended] = await Promise.all([
    readTotal("pending", token),
    readTotal("approved", token),
    readTotal("suspended", token),
  ]);
  return { pending, approved, suspended };
}

export interface EducatorDetailResult {
  educator: StaffEducatorDetail | null;
  /** The API said there is no such educator — distinct from it failing to answer. */
  missing: boolean;
  error: string | null;
}

export async function loadEducatorDetail(slug: string): Promise<EducatorDetailResult> {
  const token = await readSessionToken();

  try {
    const educator = await apiFetch<StaffEducatorDetail>(
      `/educators/${encodeURIComponent(slug)}`,
      { token },
    );
    return { educator, missing: false, error: null };
  } catch (error) {
    if (error instanceof ApiError && error.code === "not_found") {
      return { educator: null, missing: true, error: null };
    }
    return {
      educator: null,
      missing: false,
      error:
        error instanceof ApiError
          ? error.message
          : "We couldn't load this educator just now.",
    };
  }
}

/** Cents per hour as money, or the honest absence of a rate. */
export function rateLabel(cents: number | null): string {
  if (cents === null) return "No rate set";
  const amount = cents % 100 === 0 ? String(cents / 100) : (cents / 100).toFixed(2);
  return `$${amount}/hr`;
}
