"use server";

import { z } from "zod";

import {
  bookingStatusResponseSchema,
  createBookingRequestSchema,
  createBookingResponseSchema,
  quoteRequestSchema,
  quoteResponseSchema,
  resumeCheckoutResponseSchema,
  type BookingStatusResponse,
  type QuoteResponse,
} from "@contracts/bookings.ts";
import type { ErrorCode } from "@contracts/errors.ts";

import { ApiError, ApiUnreachableError } from "@/lib/api/server";
import { callApiAuthed } from "@/lib/auth/action-helpers";
import { getSession } from "@/lib/auth/session";
import type { CheckoutHandoff } from "@/lib/booking/checkout";

/**
 * What the booking flow renders. Success carries what's needed to mount payment
 * rather than a redirect, because the next thing that happens is Stripe Embedded
 * Checkout appearing on this page — not a navigation.
 *
 * `code` rides along on failures for the same reason `AuthFormState` carries one:
 * a few refusals have an *action* attached — sign in, resend the confirmation
 * email, resume the payment you abandoned — and the summary card can only offer
 * that affordance if it can tell which refusal it is holding. Matching on message
 * strings would break the first time the API rewords one.
 */
export type BookingActionState =
  | { status: "idle" }
  | {
      status: "error";
      message: string;
      code?: ErrorCode;
      fieldErrors?: Record<string, string>;
    }
  | { status: "success"; checkout: CheckoutHandoff };

function failure(
  message: string,
  extra: { code?: ErrorCode; fieldErrors?: Record<string, string> } = {},
): BookingActionState {
  return {
    status: "error",
    message,
    ...(extra.code ? { code: extra.code } : {}),
    ...(extra.fieldErrors ? { fieldErrors: extra.fieldErrors } : {}),
  };
}

/**
 * Parses an API response against its contract schema instead of casting it.
 *
 * `apiFetch` ends in `payload as T`, which is a promise the response makes and
 * nothing checks. Left uncaught, a renamed field reaches a component as
 * `Cannot read properties of undefined` three renders from the fetch, with a
 * parent already looking at a payment screen. Parsing here turns that into one
 * loud server-side log at the boundary and an honest failure state.
 *
 * Throws `ApiError` so the callers below fold it into their existing catch rather
 * than growing a second failure path.
 */
function parsed<T extends z.ZodType>(
  schema: T,
  payload: unknown,
  endpoint: string,
): z.infer<T> {
  const result = schema.safeParse(payload);
  if (result.success) return result.data;

  console.error(
    `booking actions: ${endpoint} did not match its contract`,
    result.error.issues.map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`),
  );
  throw new ApiError(
    "internal_error",
    "Something went wrong on our side. Please try again.",
    502,
  );
}

/**
 * Turns any thrown API failure into a renderable state, preserving the contract's
 * code. `rate_limited` gets its own copy: the API's own message is written for a
 * generic caller, and the one thing a parent needs to know here — that the way out
 * is to resume the payment they already have, not to book again — isn't in it.
 */
function toBookingFailure(error: unknown, unreachable: string): BookingActionState {
  if (error instanceof ApiError) {
    if (error.code === "rate_limited") {
      return failure(
        "That's several booking attempts in a short time, so we've paused new ones for a little while. " +
          "If a payment is still open, resume it rather than starting again — and if you're stuck, contact us and we'll set it up for you.",
        { code: error.code },
      );
    }
    return failure(error.message, {
      code: error.code,
      ...(error.fieldErrors ? { fieldErrors: error.fieldErrors } : {}),
    });
  }
  if (error instanceof ApiUnreachableError) return failure(unreachable);
  return failure("Something went wrong. Nothing was charged. Please try again.");
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
  const check = createBookingRequestSchema.safeParse(input);

  if (!check.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of check.error.issues) {
      const field = issue.path.map(String).join(".");
      if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return failure("Please check the highlighted fields.", {
      code: "validation_failed",
      fieldErrors,
    });
  }

  const session = await getSession();
  if (!session) {
    /*
     * Reachable when a session expires between the page render and the submit, so
     * the flow is simultaneously showing "Booking as {name}". The code is what
     * lets the summary card put a sign-in link at the point of failure instead of
     * a sentence with nowhere to go; the draft cookie is what makes coming back
     * cheap, and the copy promises exactly that.
     */
    return failure(
      "Your sign-in has expired, so nothing was booked and nothing was charged. Sign back in and your educator, subject and time will still be here.",
      { code: "unauthenticated" },
    );
  }
  if (!session.user.emailVerified) {
    return failure(
      "Please confirm your email address before your first booking — we send your receipt and your confirmation there.",
      { code: "email_not_verified" },
    );
  }

  /*
   * No feature flag here any more. Whether payments are available is a property
   * of the API's own Stripe configuration, and the API answers `conflict` with a
   * usable message when it has none — which is a check that cannot drift out of
   * step with reality the way a boolean in this repo could.
   */
  try {
    const booking = parsed(
      createBookingResponseSchema,
      await callApiAuthed("/bookings", { method: "POST", body: check.data }),
      "POST /bookings",
    );

    return {
      status: "success",
      checkout: {
        bookingId: booking.bookingId,
        reference: booking.reference,
        checkoutClientSecret: booking.checkoutClientSecret,
        publishableKey: booking.publishableKey,
        totalCents: booking.quote.totalCents,
        expiresAt: Date.parse(booking.checkoutExpiresAt),
      },
    };
  } catch (error) {
    return toBookingFailure(
      error,
      "We couldn't reach the server, so nothing was booked and nothing was charged. Please try again.",
    );
  }
}

/**
 * `POST /bookings/:id/checkout` — a fresh Checkout Session on a booking that is
 * still `pending_payment`.
 */

/** Ids come from the browser, so they are shaped before they reach a URL. */
const bookingIdSchema = z.string().trim().min(1).max(80);

/**
 * Resumes payment on a booking the parent walked away from.
 *
 * Abandoning Stripe's panel leaves a real `pending_payment` row and a live session,
 * and recovery must not mean booking again: `POST /bookings` allows ten an hour, so a
 * parent who fiddles can lock themselves out of the thing they were trying to pay
 * for. The booking is the parent's own or the API 404s it, so nothing here needs to
 * prove ownership.
 */
export async function resumeBookingCheckoutAction(
  bookingId: unknown,
): Promise<BookingActionState> {
  const id = bookingIdSchema.safeParse(bookingId);
  if (!id.success) {
    return failure("We couldn't find that booking. Please start a new one.", {
      code: "not_found",
    });
  }

  const session = await getSession();
  if (!session) {
    return failure(
      "Your sign-in has expired. Sign back in and you can pick this payment up where you left it.",
      { code: "unauthenticated" },
    );
  }

  try {
    const resumed = parsed(
      resumeCheckoutResponseSchema,
      await callApiAuthed(`/bookings/${encodeURIComponent(id.data)}/checkout`, {
        method: "POST",
      }),
      "POST /bookings/:id/checkout",
    );

    return {
      status: "success",
      checkout: {
        bookingId: resumed.bookingId,
        reference: resumed.reference,
        checkoutClientSecret: resumed.checkoutClientSecret,
        publishableKey: resumed.publishableKey,
        totalCents: resumed.totalCents,
        expiresAt: Date.parse(resumed.checkoutExpiresAt),
      },
    };
  } catch (error) {
    return toBookingFailure(
      error,
      "We couldn't reach the server to reopen that payment. Nothing was charged — please try again.",
    );
  }
}

/**
 * What `POST /bookings/quotes` gives the flow. Distinct from `BookingActionState`
 * because a failed quote is not a failed booking: the flow keeps showing its local
 * estimate and lets the parent carry on, and only the refusals that mean *this
 * booking will be rejected* are put in front of them.
 */
export type QuoteActionState =
  | { status: "ok"; quote: QuoteResponse }
  | {
      status: "error";
      message: string;
      code?: ErrorCode;
      fieldErrors?: Record<string, string>;
    };

/**
 * The server's authoritative price for the choices made so far.
 *
 * This is the number the parent should be reading while they decide, so it has to be
 * called while they are still deciding: a browser-side estimate that only meets the
 * real figure beside the card form shows it with a booking already committed. Pricing
 * lives on the server (§7) and no amount travels in either direction — this sends
 * the *inputs* and reads back the total.
 *
 * It doubles as the early validation, so the final submit is never the first to run
 * it: the endpoint resolves the educator slug, the subject band and the topic against
 * `educator_profiles.subjects` by exact string, so a drifted label or an educator
 * the API has never heard of surfaces at step 2 rather than after the child's name,
 * the address and both consents are in.
 *
 * Requires the `customer` role, so the flow only calls it for a signed-in parent
 * and keeps the labelled estimate for everyone else.
 */
export async function getBookingQuoteAction(input: unknown): Promise<QuoteActionState> {
  const check = quoteRequestSchema.safeParse(input);
  if (!check.success) {
    return { status: "error", message: "We can't price that combination.", code: "validation_failed" };
  }

  const session = await getSession();
  if (!session || session.activeRole !== "customer") {
    return {
      status: "error",
      message: "Sign in as a parent to see the exact price before you pay.",
      code: "unauthenticated",
    };
  }

  try {
    const quote = parsed(
      quoteResponseSchema,
      await callApiAuthed("/bookings/quotes", { method: "POST", body: check.data }),
      "POST /bookings/quotes",
    );
    return { status: "ok", quote };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        status: "error",
        message: error.message,
        code: error.code,
        ...(error.fieldErrors ? { fieldErrors: error.fieldErrors } : {}),
      };
    }
    return {
      status: "error",
      message: "We couldn't reach the server for an exact price just now.",
      code: "internal_error",
    };
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
  bookingId: unknown,
): Promise<BookingStatusActionState> {
  const id = bookingIdSchema.safeParse(bookingId);
  if (!id.success) {
    return { status: "error", message: "We couldn't confirm that booking." };
  }

  try {
    const booking = parsed(
      bookingStatusResponseSchema,
      await callApiAuthed(`/bookings/${encodeURIComponent(id.data)}`),
      "GET /bookings/:id",
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
