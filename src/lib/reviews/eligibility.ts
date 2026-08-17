import "server-only";

import type { ParentBooking } from "@contracts/bookings.ts";
import type { ReviewEligibility } from "@contracts/reviews.ts";

import { apiFetch } from "@/lib/api/server";
import { readSessionToken } from "@/lib/auth/cookies";

/**
 * What the booking history knows about reviewing one booking.
 *
 * `unknown` is not a contract state — it is this app admitting the eligibility
 * call failed, which matters because "no control shown" and "we couldn't ask"
 * look identical on the card and mean very different things to the parent.
 */
export type ReviewState = ReviewEligibility["reason"] | "unknown";

export type ReviewStates = Record<string, ReviewState>;

/**
 * Works out which of a parent's bookings can still be reviewed.
 *
 * **Only `completed` bookings are asked about.** The booking's own status already
 * settles `not_completed` for every other row, and it is already loaded — so a
 * history of thirty bookings with two completed sessions costs two requests, not
 * thirty. What the status cannot settle is whether a review has *already* been
 * written, and that is the whole reason this endpoint is called at all: without
 * it a parent is offered the form a second time and gets a `conflict` back for
 * their trouble.
 *
 * `allSettled` because one failed check must not take the booking history down
 * with it — a parent opens this page to see whether they were charged, and that
 * has nothing to do with reviews.
 */
export async function loadReviewEligibility(
  bookings: ParentBooking[],
): Promise<ReviewStates> {
  const completed = bookings.filter((booking) => booking.status === "completed");
  if (completed.length === 0) return {};

  const token = await readSessionToken();

  const settled = await Promise.allSettled(
    completed.map((booking) =>
      apiFetch<ReviewEligibility>(
        `/reviews/eligibility/${encodeURIComponent(booking.id)}`,
        { token },
      ),
    ),
  );

  const states: ReviewStates = {};
  settled.forEach((result, index) => {
    const { id } = completed[index]!;
    if (result.status !== "fulfilled") {
      states[id] = "unknown";
      return;
    }
    // `eligible` is the decision and `reason` only explains it, so the flag wins:
    // a future reason this build has never heard of still closes the form rather
    // than opening one the API would refuse. A payload where the two contradict
    // each other is treated as no answer at all.
    const { eligible, reason } = result.value;
    states[id] = eligible ? "ok" : reason === "ok" ? "unknown" : reason;
  });

  return states;
}
