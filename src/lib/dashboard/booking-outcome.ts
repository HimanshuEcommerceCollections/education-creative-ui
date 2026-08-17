import "server-only";

import {
  BOOKING_OUTCOMES,
  bookingOutcomeSchema,
  type BookingOutcome,
} from "@contracts/bookings.ts";

import { callApiAuthed } from "@/lib/auth/action-helpers";
import type { AuthFormState } from "@/lib/auth/form-state";

/**
 * `POST /bookings/:id/outcome` — the call that finally lets a confirmed booking
 * reach `completed` or `no_show`.
 *
 * Both states carry parent-facing copy ("This session has been delivered", "Recorded
 * as a no-show") and queue labels, so **something in the product has to be able to
 * reach them**. Without this call a delivered session stays "Confirmed" forever and a
 * family who was stood up has no state to point at.
 *
 * Shared by the staff queue and the educator's own session list because it is one
 * call with one meaning; only the revalidation target differs, which is why the two
 * Server Actions stay separate and thin.
 *
 * The body is validated against the API's own `bookingOutcomeSchema`, so a form
 * here cannot send something the API will refuse.
 */

export type { BookingOutcome };

export function parseOutcome(raw: string): BookingOutcome | null {
  return (BOOKING_OUTCOMES as readonly string[]).includes(raw)
    ? (raw as BookingOutcome)
    : null;
}

export async function recordBookingOutcome(
  bookingId: string,
  outcome: string,
  note: string | undefined,
): Promise<AuthFormState> {
  const body = bookingOutcomeSchema.safeParse({
    outcome,
    ...(note ? { note } : {}),
  });

  if (!body.success) {
    const issues = body.error.issues;
    const onOutcome = issues.some((issue) => issue.path[0] === "outcome");
    return {
      status: "error",
      message: onOutcome
        ? "Choose whether the session went ahead or was a no-show."
        : "Please check the highlighted fields.",
      fieldErrors: onOutcome
        ? { outcome: "Pick one." }
        : { note: issues[0]?.message ?? "Please shorten this." },
      code: "validation_failed",
    };
  }

  const parsed = body.data.outcome;
  const result = await callApiAuthed<{ message: string }>(
    `/bookings/${encodeURIComponent(bookingId)}/outcome`,
    { method: "POST", body: body.data },
  );

  return {
    status: "success",
    redirectTo: "",
    message:
      result.message ??
      (parsed === "completed"
        ? "Marked as delivered."
        : "Recorded as a no-show. A coordinator will follow up with the family."),
  };
}
