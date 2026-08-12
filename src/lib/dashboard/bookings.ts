import "server-only";

import type { AssignableEducator, CoordinatorBooking } from "@contracts/bookings.ts";

import { ApiError, apiFetch } from "@/lib/api/server";
import { readSessionToken } from "@/lib/auth/cookies";

export interface BookingQueue {
  /** Paid, waiting on a coordinator. The work. */
  awaiting: CoordinatorBooking[];
  /**
   * Past the confirm decision: confirmed, plus partially refunded.
   *
   * A goodwill refund flips the booking's status, so fetching only `confirmed`
   * would make a booking disappear from the queue the moment it was partly
   * refunded — exactly when someone might need to refund the rest of it.
   */
  decided: CoordinatorBooking[];
  /** Approved educators, the only ones a confirm may name. */
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

/**
 * Loads the confirmation queue. Two calls rather than one unfiltered fetch,
 * because the API's default is deliberately "what needs a decision" and asking
 * for the confirmed list is a separate intent — the overview only ever wants the
 * first.
 *
 * Failures come back as data so the page renders with an inline notice instead of
 * an error boundary; a coordinator seeing an empty queue with an explanation can
 * still work, one seeing a crash page cannot.
 */
export async function loadBookingQueue(): Promise<BookingQueue> {
  const token = await readSessionToken();

  type QueueResponse = { items: CoordinatorBooking[]; educators: AssignableEducator[] };

  try {
    const [awaiting, confirmed, partlyRefunded] = await Promise.all([
      apiFetch<QueueResponse>("/bookings/queue?status=paid_unconfirmed", { token }),
      apiFetch<QueueResponse>("/bookings/queue?status=confirmed&limit=25", { token }),
      apiFetch<QueueResponse>("/bookings/queue?status=partially_refunded&limit=25", {
        token,
      }),
    ]);

    return {
      awaiting: awaiting.items,
      decided: [...confirmed.items, ...partlyRefunded.items].sort((a, b) =>
        a.preferredDate.localeCompare(b.preferredDate),
      ),
      educators: awaiting.educators,
      readAt: Date.now(),
      error: null,
    };
  } catch (error) {
    return {
      awaiting: [],
      decided: [],
      educators: [],
      readAt: Date.now(),
      error:
        error instanceof ApiError
          ? error.message
          : "We couldn't load the booking queue just now.",
    };
  }
}
