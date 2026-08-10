"use server";

import {
  createBookingRequestSchema,
  type BookingStatusResponse,
  type CreateBookingResponse,
} from "@contracts/bookings.ts";

import { ApiError, ApiUnreachableError } from "@/lib/api/server";
import { callApiAuthed } from "@/lib/auth/action-helpers";
import { getSession } from "@/lib/auth/session";

/**
 * What the booking flow renders. Success carries the created booking rather than
 * a redirect, because the next thing that happens is Stripe Embedded Checkout
 * mounting on this page with the returned client secret — not a navigation.
 */
export type BookingActionState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> }
  | { status: "success"; booking: CreateBookingResponse };

function failure(message: string, fieldErrors?: Record<string, string>): BookingActionState {
  return { status: "error", message, ...(fieldErrors ? { fieldErrors } : {}) };
}

/**
 * Creates the booking and hands back what's needed to take payment.
 *
 * Order of business, and none of it is negotiable:
 *
 * 1. **Re-validate.** The client parsed with this same schema, which is a courtesy
 *    to the user and nothing more — a Server Action is a public endpoint, so the
 *    only parse that counts happens here.
 * 2. **Require a session.** A booking belongs to a `users` row; an anonymous one
 *    has nobody to refund, no account to show it in, and no consent record to
 *    attach. The API refuses these too — this is the flow-level check, not the
 *    security boundary.
 * 3. **Send no money.** The payload carries no amount. The API prices the booking
 *    from its own rules and derives the PaymentIntent from the re-validated quote
 *    (ARCHITECTURE.md §7), so there is nothing here for a tampered client to
 *    inflate or discount.
 *
 * The booking comes back `pending_payment`. It is not paid until the Stripe
 * webhook says so — never on the strength of this response or a browser redirect.
 */
export async function createBookingAction(input: unknown): Promise<BookingActionState> {
  const parsed = createBookingRequestSchema.safeParse(input);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path.map(String).join(".");
      if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return failure("Please check the highlighted fields.", fieldErrors);
  }

  const session = await getSession();
  if (!session) {
    return failure(
      "Please sign in or create an account before paying for a session. Your educator, subject and time are saved.",
    );
  }
  if (!session.user.emailVerified) {
    return failure(
      "Please confirm your email address before your first booking — there's a resend link in your account.",
    );
  }

  /*
   * No feature flag here any more. Whether payments are available is a property
   * of the API's own Stripe configuration, and the API answers `conflict` with a
   * usable message when it has none — which is a check that cannot drift out of
   * step with reality the way a boolean in this repo could.
   */
  try {
    const booking = await callApiAuthed<CreateBookingResponse>("/bookings", {
      method: "POST",
      body: parsed.data,
    });
    return { status: "success", booking };
  } catch (error) {
    if (error instanceof ApiError) {
      return failure(error.message, error.fieldErrors);
    }
    if (error instanceof ApiUnreachableError) {
      return failure(
        "We couldn't reach the server, so nothing was booked and nothing was charged. Please try again.",
      );
    }
    return failure("Something went wrong. Nothing was charged. Please try again.");
  }
}

export type BookingStatusActionState =
  | { status: "error"; message: string }
  | { status: "ok"; booking: BookingStatusResponse };

/**
 * Reads the booking back after Checkout reports complete.
 *
 * This is how the page waits for the **webhook** rather than believing the
 * browser. Stripe's `onComplete` fires client-side and can be ahead of — or
 * entirely disconnected from — the signed event that actually marks a booking
 * paid, so the page polls this until the status moves on the server's own say-so.
 *
 * Ownership is enforced by the API: it 404s a booking that isn't this session's,
 * so a guessed id reveals nothing.
 */
export async function getBookingStatusAction(
  bookingId: string,
): Promise<BookingStatusActionState> {
  try {
    const booking = await callApiAuthed<BookingStatusResponse>(
      `/bookings/${encodeURIComponent(bookingId)}`,
    );
    return { status: "ok", booking };
  } catch (error) {
    if (error instanceof ApiError) {
      return { status: "error", message: error.message };
    }
    if (error instanceof ApiUnreachableError) {
      return {
        status: "error",
        message:
          "We couldn't reach the server to confirm your payment. If your card was charged, your receipt will still arrive by email.",
      };
    }
    return { status: "error", message: "We couldn't confirm your payment just yet." };
  }
}
