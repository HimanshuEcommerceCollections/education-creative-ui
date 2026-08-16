"use client";

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { BookingStatus } from "@contracts/bookings.ts";

import { getBookingStatusAction } from "@/app/(site)/book/actions";
import type { CheckoutHandoff } from "@/lib/booking/checkout";
import { formatMoney } from "@/lib/booking/pricing";
import { cn } from "@/lib/utils";

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
 * ## Every wait has an exit
 *
 * That polling is also where this component earns its states. A parent whose card
 * has been charged must never be left on a spinner, so each way the wait can end
 * badly has its own screen with something to press: the status read failing gets a
 * retry, a status that isn't "paid" gets copy that doesn't pretend otherwise, and
 * the session's own 30-minute expiry gets a fresh attempt rather than a dead
 * iframe. There is no path here that shows a spinner and swallows the reason.
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

/** How often the expiry countdown re-reads the clock, and when it starts showing. */
const EXPIRY_TICK_MS = 15_000;
const EXPIRY_WARN_MS = 10 * 60_000;

type Phase =
  /** Stripe's iframe is mounted and the window is still open. */
  | "paying"
  /** Checkout reported complete; polling our own API for the webhook. */
  | "verifying"
  /** The API confirmed it. The flow's confirmation dialog takes over. */
  | "settled"
  /** Charged, webhook late. Nothing is lost and the copy says so. */
  | "slow"
  /** Charged as far as we know, but we could not read the booking back. */
  | "unconfirmed"
  /** The API answered with a status that is not "paid and awaiting a coordinator". */
  | "attention"
  /** The 30-minute session lapsed before payment completed. */
  | "window_expired";

/**
 * Which of the three things a booking status means for a parent standing at the
 * end of checkout.
 *
 * Written as an exhaustive switch over the contract's own union with **no
 * `default`**, which is the point: the bug this replaces was
 * `status !== "pending_payment"` treating `expired`, `refunded` and `disputed` as
 * success and firing the confetti dialog. Adding a status to the contract now
 * fails the build here instead of silently landing in the success branch.
 */
function settlementOf(status: BookingStatus): "paid" | "pending" | "attention" {
  switch (status) {
    /*
     * The money landed. The later delivered states are here too — a webhook and a
     * coordinator can both have moved on before a slow poll lands — including
     * `no_show`, which is a session that was paid for and didn't go ahead. Telling
     * a parent who has been charged that they haven't is the one answer that is
     * always wrong.
     */
    case "paid_unconfirmed":
    case "confirmed":
    case "completed":
    case "no_show":
      return "paid";

    /* Our side hasn't been told anything yet. Keep waiting. */
    case "pending_payment":
      return "pending";

    /*
     * Reachable within seconds of checkout only when something has gone wrong, so
     * these get an honest screen and a route to a human rather than confetti.
     */
    case "expired":
    case "refunded":
    case "partially_refunded":
    case "disputed":
      return "attention";
  }
}

/** Per-status copy for the attention screen. Never asserts what we don't know. */
function attentionCopy(status: BookingStatus, reference: string): {
  title: string;
  body: string;
} {
  switch (status) {
    case "expired":
      return {
        title: "This booking expired before it was paid",
        body: `The payment window on ${reference} closed, so this booking was released and nothing was charged. Start again and we'll open a fresh payment for you.`,
      };
    case "refunded":
      return {
        title: "This booking has been refunded",
        body: `Our records show ${reference} is refunded in full, so there's nothing to confirm here. If that isn't what you expected, reply to the email we sent and a coordinator will pick it up.`,
      };
    case "partially_refunded":
      return {
        title: "This booking has a refund on it",
        body: `Part of ${reference} has already been refunded, so we can't confirm it as a new payment. Your bookings page has the exact figures, and a coordinator can explain them.`,
      };
    case "disputed":
      return {
        title: "This payment is under dispute",
        body: `Your bank is reviewing a dispute raised against ${reference}, so we can't treat it as paid while that runs. Nothing more is needed from you here.`,
      };
    default:
      return {
        title: "We can't confirm this booking here",
        body: `${reference} isn't in a state we can confirm from this page. Your bookings page has the current position, and a coordinator can help from there.`,
      };
  }
}

interface CheckoutPanelProps {
  checkout: CheckoutHandoff;
  /**
   * The confirmation SLA in force, from site configuration by way of the flow.
   * This number is a promise printed beside a pay button, so it has to be the
   * live one — a build-time copy would keep promising two days after an admin
   * moved it to three.
   */
  confirmationSlaDays: number;

  /** Called once the API confirms the booking left `pending_payment`. */
  onConfirmed: (reference: string, totalLabel: string) => void;
  /** Abandon this attempt. The booking stays payable and the flow says so. */
  onCancel: () => void;
  /** Ask the API for a fresh Checkout Session against the same booking. */
  onResume: () => void;
  /** True while `onResume` is in flight. */
  resuming: boolean;
}

export function CheckoutPanel({
  checkout,
  confirmationSlaDays,
  onConfirmed,
  onCancel,
  onResume,
  resuming,
}: CheckoutPanelProps) {
  const [phase, setPhase] = useState<Phase>("paying");
  const [error, setError] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<BookingStatus | null>(null);
  const [remainingMs, setRemainingMs] = useState(() => checkout.expiresAt - Date.now());

  /**
   * Guards against a second poll running alongside the first — `onComplete` can
   * fire more than once. Unlike the `settled` ref this replaces, it is *cleared*
   * on every terminal outcome, so a retry is possible: leaving it latched is what
   * turned a failed status read into a permanent spinner.
   */
  const polling = useRef(false);

  const stripePromise = useMemo(
    () => stripeFor(checkout.publishableKey),
    [checkout.publishableKey],
  );

  /**
   * Polls our own API rather than trusting the browser. Resolves as soon as the
   * booking reaches a state only a signed webhook can put it in.
   */
  const verify = useCallback(async () => {
    if (polling.current) return;
    polling.current = true;
    setError(null);
    setOutcome(null);
    setPhase("verifying");

    /*
     * `paymentPending` is the contract's own answer to "money taken, our side not
     * updated yet" and it is what separates the two ways this wait can time out:
     * a late webhook (money definitely taken) from silence (we genuinely cannot
     * say). The field exists for this page, so leaving it unread collapses the two.
     */
    let sawPaymentPending = false;

    for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt += 1) {
      const result = await getBookingStatusAction(checkout.bookingId);

      if (result.status === "error") {
        setError(result.message);
        setPhase("unconfirmed");
        polling.current = false;
        return;
      }

      if (result.booking.paymentPending) sawPaymentPending = true;

      const settlement = settlementOf(result.booking.status);

      if (settlement === "paid") {
        setPhase("settled");
        onConfirmed(result.booking.reference, formatMoney(result.booking.totalCents));
        return;
      }

      if (settlement === "attention") {
        setOutcome(result.booking.status);
        setPhase("attention");
        polling.current = false;
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    }

    /*
     * Out of attempts. With `paymentPending` seen, the money is taken and our side
     * hasn't caught up — saying so is the only honest option, because claiming
     * success would be a phantom-paid booking and claiming failure would tell a
     * parent who has just been charged that they weren't. Without it we know less
     * than that, so the parent gets a retry and a link rather than reassurance.
     */
    setPhase(sawPaymentPending ? "slow" : "unconfirmed");
    polling.current = false;
  }, [checkout.bookingId, onConfirmed]);

  /**
   * The session's own deadline, watched client-side.
   *
   * The API sets `expires_at: now + 30 minutes` and tells the browser nothing, so a
   * parent returning to a tab they left open meets an opaque failure inside
   * Stripe's frame under our "Pay $82.50" heading. Ticking here means the panel is
   * the one to say the window closed, and can offer a fresh session for the same
   * booking instead of a dead iframe. Runs only while the iframe is the thing on
   * screen — once payment is in flight the deadline is Stripe's business.
   */
  useEffect(() => {
    if (phase !== "paying") return;

    const tick = () => {
      const left = checkout.expiresAt - Date.now();
      setRemainingMs(left);
      if (left <= 0) setPhase("window_expired");
    };

    tick();
    const timer = setInterval(tick, EXPIRY_TICK_MS);
    return () => clearInterval(timer);
  }, [checkout.expiresAt, phase]);

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
        body={`Your card has been charged and we're still recording it on our side — nothing is lost. We'll email your receipt shortly, and again when a coordinator confirms your session (within ${confirmationSlaDays} days). Reference ${checkout.reference}.`}
      >
        <BookingsLink />
      </Status>
    );
  }

  if (phase === "unconfirmed") {
    return (
      <Status
        icon={<ClockIcon className="h-7 w-7" />}
        title="We couldn't confirm your payment"
        body={`If you completed the card form, treat the money as taken: we just couldn't read your booking back to be sure. Nothing you do here will charge you twice — ${checkout.reference} is a single payment either way. Try the check again, or open your bookings, where the truth always shows up.`}
      >
        {error ? (
          <p className="mx-auto mb-1 max-w-[46ch] text-[12.5px] leading-[1.55] text-[#b23b3b]">
            {error}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={() => void verify()} className={PRIMARY_ACTION}>
            Check again
          </button>
          <BookingsLink />
        </div>
      </Status>
    );
  }

  if (phase === "attention" && outcome) {
    const copy = attentionCopy(outcome, checkout.reference);
    return (
      <Status icon={<ClockIcon className="h-7 w-7" />} title={copy.title} body={copy.body}>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <BookingsLink />
          <button type="button" onClick={onCancel} className={SECONDARY_ACTION}>
            Start a new booking
          </button>
        </div>
      </Status>
    );
  }

  if (phase === "window_expired") {
    return (
      <Status
        icon={<ClockIcon className="h-7 w-7" />}
        title="This payment window expired"
        body={`Card details are only held open for a while, and this one has closed without a payment — so nothing was charged. Your booking ${checkout.reference} is still here; we can open a fresh payment for exactly the same session.`}
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onResume}
            disabled={resuming}
            aria-busy={resuming}
            className={cn(PRIMARY_ACTION, "disabled:cursor-not-allowed disabled:opacity-50")}
          >
            {resuming ? "Opening payment…" : "Start a fresh payment"}
          </button>
          <button type="button" onClick={onCancel} className={SECONDARY_ACTION}>
            Change something first
          </button>
        </div>
      </Status>
    );
  }

  const closingSoon = remainingMs <= EXPIRY_WARN_MS;

  return (
    <section className="rounded-[20px] border border-line bg-white px-7 pb-7 pt-6 shadow-[0_24px_50px_-44px_rgba(24,24,24,0.3)] max-[560px]:px-4">
      <div className="mb-5 flex items-start gap-3">
        <span className="mt-[2px] flex h-9 w-9 flex-none items-center justify-center rounded-[11px] bg-[var(--chip-a)] text-slate">
          <LockIcon className="h-[19px] w-[19px]" />
        </span>
        <div>
          <h2 className="font-serif text-[18px] font-semibold tracking-[-0.01em]">
            Pay {formatMoney(checkout.totalCents)} to request this session
          </h2>
          <p className="mt-1 text-[13px] leading-[1.55] text-muted">
            Reference {checkout.reference}. Card details go straight to Stripe — they
            never touch our servers.
          </p>
        </div>
      </div>

      {closingSoon ? (
        <p
          aria-live="polite"
          className="mb-4 flex items-start gap-2 rounded-[11px] bg-[var(--chip-a)] px-4 py-3 text-[12.5px] leading-[1.55] text-slate"
        >
          <ClockIcon className="mt-px h-4 w-4 flex-none" />
          This payment window closes in about {Math.max(1, Math.ceil(remainingMs / 60_000))}{" "}
          {Math.ceil(remainingMs / 60_000) === 1 ? "minute" : "minutes"}. If it does, we&rsquo;ll
          open a fresh one for the same booking — you won&rsquo;t lose your place.
        </p>
      ) : null}

      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{
          clientSecret: checkout.checkoutClientSecret,
          onComplete: () => {
            void verify();
          },
        }}
      >
        <EmbeddedCheckout className="min-h-[420px]" />
      </EmbeddedCheckoutProvider>

      <div className="mt-5 grid gap-[10px] border-t border-line pt-4">
        <p className="flex items-start gap-2 text-[12px] leading-[1.55] text-muted">
          <ShieldIcon className="mt-px h-4 w-4 flex-none text-slate" />
          You&rsquo;re paying now and a coordinator confirms next. If we can&rsquo;t
          confirm within {confirmationSlaDays} days, you&rsquo;re refunded in
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

const PRIMARY_ACTION =
  "inline-flex cursor-pointer items-center justify-center rounded-[40px] bg-slate px-6 py-[13px] text-[14px] font-bold text-white " +
  "transition-[transform,background-color] duration-300 ease-brand hover:-translate-y-[2px] hover:bg-slate-deep motion-reduce:transition-none";

const SECONDARY_ACTION =
  "inline-flex cursor-pointer items-center justify-center rounded-[40px] border-[1.5px] border-[rgba(30,28,25,0.28)] px-6 py-[13px] text-[14px] font-bold text-ink " +
  "transition-[transform,background-color] duration-300 ease-brand hover:-translate-y-[2px] hover:bg-[rgba(30,28,25,0.05)] motion-reduce:transition-none";

/**
 * The one destination that is always right when this page can't answer: whatever
 * the webhook eventually decided is visible there, and it survives a reload.
 */
function BookingsLink() {
  return (
    <Link href="/account/bookings" className={cn(SECONDARY_ACTION, "no-underline")}>
      See my bookings
    </Link>
  );
}

/** Shared frame for the waiting and dead-end states. */
function Status({
  icon,
  title,
  body,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  /** Whatever the parent can press. Absent only while a wait is still ordinary. */
  children?: React.ReactNode;
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

      {children ? <div className="mt-6 grid justify-items-center gap-3">{children}</div> : null}
    </section>
  );
}
