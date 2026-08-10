"use client";

import Image from "next/image";
import Link from "next/link";

import type { BookingFormat, SessionDuration } from "@contracts/bookings.ts";

import {
  BOOKING_CONFIRMATION_SLA_DAYS,
  FORMAT_LABELS,
  type BookingEducator,
} from "@/data/booking";
import { formatMoney, type Estimate } from "@/lib/booking/pricing";
import { formatDate, formatTime, type CivilDate } from "@/lib/booking/schedule";
import { cn } from "@/lib/utils";

import { ArrowRightIcon, LockIcon, ShieldIcon } from "./booking-icons";

interface BookingSummaryProps {
  educator: BookingEducator;
  subject: string | null;
  format: BookingFormat;
  date: CivilDate | null;
  time: string | null;
  alternateTime: string | null;
  flexible: boolean;
  duration: SessionDuration;
  estimate: Estimate;
  /** Human-readable list of what's still needed. Empty means ready. */
  missing: readonly string[];
  pending: boolean;
  error?: string;
  paymentsLive: boolean;
  /**
   * True once a booking exists and Stripe's panel has taken over. The card then
   * shows what is being paid for and drops its own button — two live pay
   * affordances on one screen is how a parent creates a second booking by
   * accident.
   */
  readOnly?: boolean;
  onSubmit: () => void;
}

function Row({ label, value, filled }: { label: string; value: string; filled: boolean }) {
  return (
    <li className="flex items-center justify-between gap-[14px] text-[14px]">
      <span className="text-white/[0.66]">{label}</span>
      <b
        className={cn(
          "text-right font-semibold transition-colors duration-300",
          filled ? "text-gold" : "text-white/80",
        )}
      >
        {value}
      </b>
    </li>
  );
}

/**
 * The sticky request summary and the pay button.
 *
 * Three things here are load-bearing rather than decorative:
 *
 * 1. **The number is an estimate and says so.** The authoritative amount is
 *    computed server-side from the quote; the browser is not allowed to name a
 *    price, so this must not read like a bill.
 * 2. **A disabled button explains itself.** The source shipped a dead "Confirm
 *    booking" with no indication of what was missing, which is a dead end for
 *    anyone who can't visually scan for an absent tick. The outstanding items are
 *    listed, in a live region.
 * 3. **The refund promise sits next to the pay button.** The parent is charged
 *    before anyone has confirmed the session, so the terms of that — full refund
 *    if it isn't confirmed within the SLA — belong at the point of payment, not
 *    only in the Terms page.
 */
export function BookingSummary({
  educator,
  subject,
  format,
  date,
  time,
  alternateTime,
  flexible,
  duration,
  estimate,
  missing,
  pending,
  error,
  paymentsLive,
  readOnly = false,
  onSubmit,
}: BookingSummaryProps) {
  const ready = missing.length === 0;

  return (
    <aside className="sticky top-[100px]">
      <div className="relative overflow-hidden rounded-[22px] bg-slate p-7 text-white shadow-[0_40px_80px_-44px_rgba(46,58,115,0.7)] before:absolute before:-right-[70px] before:-top-[70px] before:h-[200px] before:w-[200px] before:rounded-full before:bg-[radial-gradient(circle_at_50%_50%,rgba(210,162,65,0.3),rgba(210,162,65,0)_70%)] before:content-['']">
        <h2 className="relative mb-5 font-serif text-[13px] font-semibold uppercase tracking-[0.14em] text-white/70">
          Your request
        </h2>

        <div className="relative mb-[18px] flex items-center gap-[13px] border-b border-white/[0.16] pb-5">
          <span className="relative block h-[50px] w-[50px] flex-none overflow-hidden rounded-full border-2 border-white/30">
            <Image
              src={educator.image.src}
              alt=""
              fill
              sizes="50px"
              className="object-cover object-[50%_18%]"
            />
          </span>
          <span className="block">
            <b className="block font-serif text-[16px] font-semibold">{educator.name}</b>
            <span className="mt-[2px] block text-[12.5px] text-white/70">
              Requested · {educator.subject}
            </span>
          </span>
        </div>

        <ul className="relative mb-[18px] grid list-none gap-[13px]">
          <Row label="Subject" value={subject ?? "—"} filled={Boolean(subject)} />
          <Row label="Format" value={FORMAT_LABELS[format]} filled />
          <Row
            label="Date"
            value={date ? formatDate(date) : "—"}
            filled={Boolean(date)}
          />
          <Row
            label="Time"
            value={time ? formatTime(time) : "—"}
            filled={Boolean(time)}
          />
          {alternateTime ? (
            <Row label="Or" value={formatTime(alternateTime)} filled />
          ) : null}
          {flexible ? <Row label="Flexible" value="Any open time" filled /> : null}
          <Row label="Length" value={`${duration} min`} filled />
        </ul>

        <div className="relative border-t border-white/[0.16] pt-[18px]">
          <ul className="grid list-none gap-2">
            {estimate.lineItems.map((line) => (
              <li
                key={line.label}
                className="flex items-baseline justify-between gap-3 text-[13px] text-white/[0.66]"
              >
                <span>{line.label}</span>
                <span>{formatMoney(line.amountCents)}</span>
              </li>
            ))}
          </ul>

          <div
            aria-live="polite"
            className="mt-[14px] flex items-baseline justify-between gap-3"
          >
            <span className="text-[13.5px] text-white/70">Estimated total</span>
            <b className="font-serif text-[30px] font-bold text-white">
              {formatMoney(estimate.totalCents)}
            </b>
          </div>

          <p className="mt-1 text-[11.5px] leading-[1.5] text-white/50">
            An estimate. We confirm the exact amount on the payment step before you&rsquo;re
            charged.
          </p>
        </div>

        <div className="relative mt-6">
          {readOnly ? (
            <p className="rounded-[12px] bg-white/[0.09] px-4 py-3 text-[12.5px] leading-[1.55] text-white/75">
              Complete the card details to finish. Nothing here can change while a
              payment is open.
            </p>
          ) : paymentsLive ? (
            <button
              type="button"
              onClick={onSubmit}
              disabled={!ready || pending}
              aria-busy={pending}
              aria-describedby={ready ? undefined : "booking-missing"}
              className={cn(
                "inline-flex w-full cursor-pointer items-center justify-center gap-[9px] rounded-[40px] bg-white px-7 py-4 font-sans text-[15px] font-bold text-slate-deep",
                "transition-[transform,box-shadow,opacity] duration-300 ease-brand motion-reduce:transition-none",
                "hover:-translate-y-[2px] hover:shadow-[0_18px_40px_-14px_rgba(0,0,0,0.5)]",
                "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none",
              )}
            >
              <LockIcon className="h-[17px] w-[17px]" />
              {pending ? "Opening payment…" : "Continue to payment"}
            </button>
          ) : (
            <>
              <button
                type="button"
                disabled
                aria-describedby="booking-payments-phase"
                className="inline-flex w-full cursor-not-allowed items-center justify-center gap-[9px] rounded-[40px] bg-white/[0.16] px-7 py-4 font-sans text-[15px] font-bold text-white/60"
              >
                <LockIcon className="h-[17px] w-[17px]" />
                Continue to payment
              </button>

              <p
                id="booking-payments-phase"
                className="mt-3 rounded-[12px] bg-white/[0.09] px-4 py-3 text-[12.5px] leading-[1.55] text-white/75"
              >
                Card payment goes live with the booking release. Until then,{" "}
                <Link href="/contact" className="font-semibold text-gold underline">
                  send us this request
                </Link>{" "}
                and a coordinator will arrange it with you directly.
              </p>
            </>
          )}

          {error ? (
            <p
              role="alert"
              className="mt-3 rounded-[12px] bg-[rgba(255,255,255,0.12)] px-4 py-3 text-[13px] leading-[1.5] text-white"
            >
              {error}
            </p>
          ) : null}

          {!ready ? (
            <div
              id="booking-missing"
              role="status"
              className="mt-3 rounded-[12px] bg-white/[0.09] px-4 py-3"
            >
              <p className="text-[12.5px] font-semibold text-white/80">
                Still to do:
              </p>
              <ul className="mt-1 list-disc pl-[18px] text-[12.5px] leading-[1.6] text-white/70">
                {missing.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="relative mt-5 grid gap-[10px] border-t border-white/[0.16] pt-[18px]">
          <p className="flex items-start gap-2 text-[11.5px] leading-[1.55] text-white/60">
            <ShieldIcon className="mt-px h-[15px] w-[15px] flex-none text-gold" />
            You pay now and a coordinator confirms. If we can&rsquo;t confirm your session
            within {BOOKING_CONFIRMATION_SLA_DAYS} days, you&rsquo;re refunded in full,
            automatically.
          </p>
          <p className="flex items-start gap-2 text-[11.5px] leading-[1.55] text-white/60">
            <ArrowRightIcon className="mt-px h-[15px] w-[15px] flex-none text-gold" />
            Cancel 24 hours or more before the session for a full refund.
          </p>
        </div>
      </div>
    </aside>
  );
}
