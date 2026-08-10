"use client";

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { useCallback, useMemo, useRef, useState } from "react";

import type { CreateBookingResponse } from "@contracts/bookings.ts";

import { getBookingStatusAction } from "@/app/(site)/book/actions";
import { BOOKING_CONFIRMATION_SLA_DAYS } from "@/data/booking";
import { formatMoney } from "@/lib/booking/pricing";

import { CheckIcon, ClockIcon, LockIcon, ShieldIcon } from "./booking-icons";

/**
 * Stripe Embedded Checkout, and the wait for payment truth.
 *
 * ## Why embedded, and why no redirect
 *
 * The card fields live in Stripe's iframe, so a PAN never touches this origin and
 * PCI scope stays at SAQ-A — but the parent stays on our page, so the
 * confirmation they land on is ours, with the coordinator-confirms timeline on it.
 * `redirect_on_completion: "never"` on the server side is what makes that
 * possible.
 *
 * ## Checkout saying "complete" is not the booking being paid
 *
 * `onComplete` fires in the browser. A browser can be lied to, and more mundanely
 * it can be ahead of the webhook that is the *only* thing allowed to mark a
 * booking paid. So this does not report success on Stripe's word: it polls our own
 * API until the booking's status actually moves, and if the webhook is slow it says
 * so honestly rather than showing a confirmation the backend can't corroborate.
 *
 * That distinction is the whole reason this component has states at all.
 */

/**
 * One `loadStripe` per publishable key, cached across mounts. Calling it twice for
 * the same key downloads Stripe.js twice; keying the cache means a deployment that
 * ever switches accounts still gets the right one rather than the first one.
 */
const stripeCache = new Map<string, Promise<Stripe | null>>();

function stripeFor(publishableKey: string): Promise<Stripe | null> {
  let loader = stripeCache.get(publishableKey);
  if (!loader) {
    loader = loadStripe(publishableKey);
    stripeCache.set(publishableKey, loader);
  }
  return loader;
}

/** Long enough for a webhook round trip, short enough not to look hung. */
const POLL_ATTEMPTS = 10;
const POLL_INTERVAL_MS = 1200;

type Phase = "paying" | "verifying" | "settled" | "slow";

interface CheckoutPanelProps {
  booking: CreateBookingResponse;
  /** Called once the API confirms the booking left `pending_payment`. */
  onConfirmed: (reference: string, totalLabel: string) => void;
  onCancel: () => void;
}

export function CheckoutPanel({ booking, onConfirmed, onCancel }: CheckoutPanelProps) {
  const [phase, setPhase] = useState<Phase>("paying");
  const [error, setError] = useState<string | null>(null);
  const settled = useRef(false);

  const stripePromise = useMemo(
    () => stripeFor(booking.publishableKey),
    [booking.publishableKey],
  );

  /**
   * Polls our own API rather than trusting the browser. Resolves as soon as the
   * booking is no longer `pending_payment` — which only a signed webhook can do.
   */
  const confirmWithServer = useCallback(async () => {
    if (settled.current) return;
    settled.current = true;
    setPhase("verifying");

    for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt += 1) {
      const result = await getBookingStatusAction(booking.bookingId);

      if (result.status === "error") {
        setError(result.message);
        return;
      }

      if (result.booking.status !== "pending_payment") {
        setPhase("settled");
        onConfirmed(result.booking.reference, formatMoney(result.booking.totalCents));
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    }

    /*
     * The money is taken and our side hasn't caught up. Saying so is the only
     * honest option: claiming success would be a phantom-paid booking, and
     * claiming failure would tell a parent who has just been charged that they
     * weren't. The webhook will land, and the receipt email follows from it.
     */
    setPhase("slow");
  }, [booking.bookingId, onConfirmed]);

  if (phase === "verifying" || phase === "settled") {
    return (
      <Status
        icon={<ClockIcon className="h-7 w-7" />}
        title="Confirming your payment"
        body="One moment — we're checking the payment cleared before we show you anything. This usually takes a couple of seconds."
      />
    );
  }

  if (phase === "slow") {
    return (
      <Status
        icon={<CheckIcon className="h-7 w-7" />}
        title="Payment taken"
        body={`Your card has been charged and we're still recording it on our side — nothing is lost. We'll email your receipt shortly, and again when a coordinator confirms your session (within ${BOOKING_CONFIRMATION_SLA_DAYS} days). Reference ${booking.reference}.`}
      />
    );
  }

  return (
    <section className="rounded-[20px] border border-line bg-white px-7 pb-7 pt-6 shadow-[0_24px_50px_-44px_rgba(24,24,24,0.3)] max-[560px]:px-4">
      <div className="mb-5 flex items-start gap-3">
        <span className="mt-[2px] flex h-9 w-9 flex-none items-center justify-center rounded-[11px] bg-[var(--chip-a)] text-slate">
          <LockIcon className="h-[19px] w-[19px]" />
        </span>
        <div>
          <h2 className="font-serif text-[18px] font-semibold tracking-[-0.01em]">
            Pay {formatMoney(booking.quote.totalCents)} to request this session
          </h2>
          <p className="mt-1 text-[13px] leading-[1.55] text-muted">
            Reference {booking.reference}. Card details go straight to Stripe — they
            never touch our servers.
          </p>
        </div>
      </div>

      {error ? (
        <p
          role="alert"
          className="mb-4 rounded-[11px] border-[1.5px] border-[rgba(178,59,59,0.35)] bg-[#fdf3f2] px-4 py-3 text-[13.5px] leading-[1.5] text-[#b23b3b]"
        >
          {error}
        </p>
      ) : null}

      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{
          clientSecret: booking.checkoutClientSecret,
          onComplete: () => {
            void confirmWithServer();
          },
        }}
      >
        <EmbeddedCheckout className="min-h-[420px]" />
      </EmbeddedCheckoutProvider>

      <div className="mt-5 grid gap-[10px] border-t border-line pt-4">
        <p className="flex items-start gap-2 text-[12px] leading-[1.55] text-muted">
          <ShieldIcon className="mt-px h-4 w-4 flex-none text-slate" />
          You&rsquo;re paying now and a coordinator confirms next. If we can&rsquo;t
          confirm within {BOOKING_CONFIRMATION_SLA_DAYS} days, you&rsquo;re refunded in
          full, automatically.
        </p>
        <button
          type="button"
          onClick={onCancel}
          className="justify-self-start text-[13px] font-semibold text-muted underline hover:text-ink"
        >
          Go back and change something
        </button>
      </div>
    </section>
  );
}

/** Shared frame for the two waiting states. */
function Status({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <section
      role="status"
      aria-live="polite"
      className="rounded-[20px] border border-line bg-white px-8 py-10 text-center shadow-[0_24px_50px_-44px_rgba(24,24,24,0.3)]"
    >
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-slate text-white">
        {icon}
      </div>
      <h2 className="mb-2 font-serif text-[20px] font-semibold tracking-[-0.01em]">
        {title}
      </h2>
      <p className="mx-auto max-w-[46ch] text-[14px] leading-[1.65] text-muted">{body}</p>
    </section>
  );
}
