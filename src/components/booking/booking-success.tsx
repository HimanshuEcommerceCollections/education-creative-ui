"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";

import { Confetti } from "@/components/auth/confetti";
import { BOOKING_CONFIRMATION_SLA_DAYS } from "@/data/booking";
import { cn } from "@/lib/utils";

import { CheckIcon, ClockIcon } from "./booking-icons";

export interface BookingRecap {
  reference: string;
  educatorName: string;
  subject: string;
  formatLabel: string;
  when: string;
  durationLabel: string;
  totalLabel: string;
}

interface BookingSuccessProps {
  recap: BookingRecap | null;
  onClose: () => void;
  onBookAnother: () => void;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Post-payment confirmation.
 *
 * The copy is the part that matters. The source told the parent *"we've sent your
 * request to Elena — they'll confirm shortly"*, which is wrong twice over under
 * the locked flow: a **coordinator** confirms and assigns, not the educator, and
 * it happens after payment rather than instead of it. So this shows the real state
 * machine — paid, awaiting confirmation, then assigned — with the SLA attached, so
 * a parent who has just been charged knows exactly what they're waiting for and
 * what happens if it doesn't come.
 *
 * It is also a real dialog: focus moves in, Tab is trapped, Escape closes, and
 * focus returns to whatever opened it. The source set `aria-modal="true"` and did
 * none of that, which leaves a keyboard user tabbing around the page behind an
 * overlay they can't see past.
 */
export function BookingSuccess({ recap, onClose, onBookAnother }: BookingSuccessProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  const open = recap !== null;

  useEffect(() => {
    if (!open) return;

    restoreTo.current = document.activeElement as HTMLElement | null;
    headingRef.current?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflow;
      restoreTo.current?.focus();
    };
  }, [open]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = cardRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  if (!recap) return null;

  const steps = [
    { label: "Payment received", detail: recap.totalLabel, done: true },
    {
      label: "Coordinator confirms & assigns",
      detail: `Within ${BOOKING_CONFIRMATION_SLA_DAYS} days`,
      done: false,
    },
    { label: "Your educator is confirmed", detail: "We'll email you", done: false },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-success-title"
      onKeyDown={onKeyDown}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[120] flex items-center justify-center overflow-hidden bg-[rgba(18,19,28,0.62)] p-6 backdrop-blur-[6px]"
    >
      <Confetti show />

      <div
        ref={cardRef}
        className="relative z-[10] max-h-full w-full max-w-[460px] overflow-y-auto rounded-[24px] bg-ivory px-10 py-11 text-center max-[560px]:px-6 max-[560px]:py-8"
      >
        <div className="mx-auto mb-[22px] flex h-[72px] w-[72px] items-center justify-center rounded-full bg-slate text-white">
          <CheckIcon className="h-[34px] w-[34px]" />
        </div>

        <h2
          ref={headingRef}
          tabIndex={-1}
          id="booking-success-title"
          className="mb-[10px] font-serif text-[24px] font-semibold tracking-[-0.01em] focus:outline-none"
        >
          Payment received
        </h2>

        <p className="mb-2 text-[14.5px] leading-[1.6] text-muted">
          Your session is paid for and with our coordination team. They&rsquo;ll confirm
          the time and assign your educator — we&rsquo;ll email you the moment they do.
        </p>
        <p className="text-[13px] font-semibold text-slate">
          Reference {recap.reference}
        </p>

        <ol className="my-6 grid list-none gap-3 text-left">
          {steps.map((step) => (
            <li key={step.label} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className={cn(
                  "mt-[2px] flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full",
                  step.done ? "bg-slate text-white" : "bg-sand text-muted",
                )}
              >
                {step.done ? (
                  <CheckIcon className="h-[14px] w-[14px]" />
                ) : (
                  <ClockIcon className="h-[14px] w-[14px]" />
                )}
              </span>
              <span className="block">
                <b className="block text-[14px] font-semibold">{step.label}</b>
                <span className="block text-[12.5px] text-muted">{step.detail}</span>
              </span>
              <span className="sr-only">{step.done ? "Done" : "Pending"}</span>
            </li>
          ))}
        </ol>

        <div className="my-5 grid gap-2 rounded-[14px] border border-line bg-white px-[18px] py-4 text-left text-[13.5px]">
          {[
            ["Educator requested", `${recap.educatorName} · ${recap.subject}`],
            ["Format", recap.formatLabel],
            ["Requested time", recap.when],
            ["Length", recap.durationLabel],
            ["Paid", recap.totalLabel],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-[14px]">
              <span className="text-muted">{label}</span>
              <b className="text-right font-semibold">{value}</b>
            </div>
          ))}
        </div>

        <p className="mb-5 rounded-[12px] bg-[var(--chip-a)] px-4 py-3 text-left text-[12.5px] leading-[1.55] text-slate">
          If we can&rsquo;t confirm within {BOOKING_CONFIRMATION_SLA_DAYS} days, this
          booking is refunded in full automatically — you don&rsquo;t need to chase us.
        </p>

        <div className="grid gap-[10px]">
          <Link
            href="/account/bookings"
            className="inline-flex w-full items-center justify-center rounded-[40px] bg-slate px-7 py-4 text-[15px] font-bold text-white no-underline transition-[transform,background-color] duration-300 ease-brand hover:-translate-y-[2px] hover:bg-slate-deep motion-reduce:transition-none"
          >
            See my bookings
          </Link>
          <button
            type="button"
            onClick={onBookAnother}
            className="inline-flex w-full cursor-pointer items-center justify-center rounded-[40px] border-[1.5px] border-[rgba(30,28,25,0.28)] bg-transparent px-7 py-4 text-[15px] font-bold text-ink transition-[transform,background-color] duration-300 ease-brand hover:-translate-y-[2px] hover:bg-[rgba(30,28,25,0.05)] motion-reduce:transition-none"
          >
            Book another session
          </button>
        </div>
      </div>
    </div>
  );
}
