import "server-only";

import {
  BOOKING_STATUSES,
  type AssignableEducator,
  type BookingStatus,
  type CoordinatorBooking,
} from "@contracts/bookings.ts";

import { ApiError, apiFetch } from "@/lib/api/server";
import { readSessionToken } from "@/lib/auth/cookies";

/** How many bookings sit in each status, across the whole table — not this page. */
export type BookingStatusCounts = Record<BookingStatus, number>;

export interface BookingQueue {
  /** Every booking the read returned, newest deadline first. Tabs filter this. */
  items: CoordinatorBooking[];
  /**
   * Per-status totals from the API, counted over all bookings rather than the
   * page. A tab labelled from `items` would read "of the most recent 200", and a
   * tab showing zero because the page ran out is indistinguishable from a status
   * that is genuinely empty.
   */
  counts: BookingStatusCounts | null;
  /** Approved educators, the only ones a confirm or reassign may name. */
  educators: AssignableEducator[];
  /**
   * When the queue was read, as epoch ms.
   *
   * Resolved here and passed down so every "4h left" on the page is measured
   * from one instant — a row reading its own clock in the browser would render
   * different text than the server sent it and mismatch on hydration.
   */
  readAt: number;
  error: string | null;
}

type QueueResponse = {
  items: CoordinatorBooking[];
  educators: AssignableEducator[];
  counts?: BookingStatusCounts;
};

/**
 * Loads the whole queue in one call.
 *
 * One read rather than one per status. The previous shape asked six times and
 * reported the refusals, because the API's filter did not accept `disputed`,
 * `expired` or `pending_payment` at all — so the three statuses nobody could see
 * were reported as "we couldn't read them just now" on every single render. The
 * filter now accepts every status and omitting it returns all of them, which
 * makes the tabs a client-side split of one answer instead of six requests that
 * can half-fail.
 */
export async function loadBookingQueue(): Promise<BookingQueue> {
  const token = await readSessionToken();
  const readAt = Date.now();

  try {
    const response = await apiFetch<QueueResponse>("/bookings/queue", { token });

    return {
      items: response.items,
      counts: response.counts ?? null,
      educators: response.educators ?? [],
      readAt,
      error: null,
    };
  } catch (caught) {
    return {
      items: [],
      counts: null,
      educators: [],
      readAt,
      error:
        caught instanceof ApiError
          ? caught.message
          : "We couldn't load the booking queue just now.",
    };
  }
}

/**
 * The tabs, in the order a coordinator works them.
 *
 * `awaiting` leads because it is the only status with a deadline that refunds
 * itself. `disputed` is next despite usually being empty: an open chargeback is
 * money leaving on somebody else's timetable, and it had no surface in the
 * product at all until the queue could request it.
 */
export const BOOKING_TABS = [
  {
    id: "awaiting",
    label: "To confirm",
    statuses: ["paid_unconfirmed"],
    empty: "Nothing is waiting on a decision.",
  },
  {
    id: "disputed",
    label: "Disputed",
    statuses: ["disputed"],
    empty: "No open chargebacks.",
  },
  {
    id: "decided",
    label: "Confirmed",
    /*
     * A goodwill refund flips the status, so a booking partly refunded would
     * vanish from this tab — exactly when someone might need to refund the rest.
     */
    statuses: ["confirmed", "partially_refunded"],
    empty: "Nothing confirmed and still to happen.",
  },
  {
    id: "delivered",
    label: "Delivered",
    statuses: ["completed", "no_show"],
    empty: "No sessions recorded as delivered yet.",
  },
  {
    id: "stale",
    label: "Unfinished",
    /** Requests that never became sessions: nobody confirmed, or checkout was abandoned. */
    statuses: ["expired", "pending_payment"],
    empty: "No abandoned or expired requests.",
  },
  {
    id: "refunded",
    label: "Refunded",
    statuses: ["refunded"],
    empty: "Nothing has been refunded in full.",
  },
] as const satisfies readonly {
  id: string;
  label: string;
  statuses: readonly BookingStatus[];
  empty: string;
}[];

export type BookingTab = (typeof BOOKING_TABS)[number];
export type BookingTabId = BookingTab["id"];

const TAB_IDS = new Set<string>(BOOKING_TABS.map((tab) => tab.id));

/** The tab from `?tab=`, falling back to the work everyone opens this page for. */
export function parseTab(value: string | undefined): BookingTabId {
  return value && TAB_IDS.has(value) ? (value as BookingTabId) : "awaiting";
}

/** The bookings belonging to a tab, filtered from the single read. */
export function bookingsForTab(
  items: readonly CoordinatorBooking[],
  tab: BookingTab,
): CoordinatorBooking[] {
  const wanted = new Set<string>(tab.statuses);
  return items.filter((booking) => wanted.has(booking.status));
}

/**
 * What a tab shows next to its label.
 *
 * `null` when the API didn't send counts, so the UI can leave the number off
 * rather than print a zero it can't stand behind.
 */
export function tabCount(
  counts: BookingStatusCounts | null,
  tab: BookingTab,
): number | null {
  if (!counts) return null;
  return tab.statuses.reduce((total, status) => total + (counts[status] ?? 0), 0);
}

/**
 * Statuses no tab claims, so a new one added to the contract can't quietly
 * disappear from the dashboard.
 */
export const UNTABBED_STATUSES: readonly BookingStatus[] = BOOKING_STATUSES.filter(
  (status) => !BOOKING_TABS.some((tab) => (tab.statuses as readonly string[]).includes(status)),
);
