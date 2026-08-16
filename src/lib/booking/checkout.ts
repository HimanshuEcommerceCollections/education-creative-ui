/**
 * The handoff between "a booking exists" and "Stripe's iframe is mounted".
 *
 * There are two ways a parent reaches the payment panel and they return different
 * shapes: `POST /bookings` creates the booking and opens a Checkout Session, while
 * `POST /bookings/:id/checkout` opens a fresh session against a booking that is
 * still `pending_payment`. The panel cares about neither distinction, so both are
 * normalised to this before they get there — which is what lets an abandoned
 * payment be resumed into exactly the same UI instead of forcing a re-book against
 * a rate limit of ten bookings an hour.
 *
 * Deliberately not the booking: no learner, no address, no quote breakdown. The
 * panel shows an amount, a reference and a card form, and holding anything else
 * here would invite it to render details the form behind it can no longer edit.
 */
export interface CheckoutHandoff {
  bookingId: string;
  reference: string;
  /** Stripe Embedded Checkout client secret for this attempt. */
  checkoutClientSecret: string;
  /** The publishable key for the account that issued that secret. */
  publishableKey: string;
  /** What this attempt charges, in integer cents, as the server priced it. */
  totalCents: number;
  /**
   * Epoch milliseconds after which Stripe stops accepting this session.
   *
   * Stripe's own `expires_at`, forwarded by the API, rather than a deadline
   * computed here: the window length is Stripe's to decide and this device's clock
   * is not the one enforcing it, so estimating would eventually offer a fresh
   * session while the old one still worked, or worse, the reverse.
   */
  expiresAt: number;
}

/**
 * A booking that exists and hasn't been paid for.
 *
 * Enough to offer it back to the parent — which reference, for how much — and no
 * more: the client secret behind it may well have expired, so the banner that
 * shows this asks the API for a fresh session when the parent asks for one.
 */
export interface ResumableBooking {
  bookingId: string;
  reference: string;
  totalCents: number;
}
