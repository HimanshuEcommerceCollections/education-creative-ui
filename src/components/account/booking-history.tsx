import Link from "next/link";

import type { BookingStatus, ParentBooking } from "@contracts/bookings.ts";

import type { ReviewState, ReviewStates } from "@/lib/reviews/eligibility";
import { cn } from "@/lib/utils";

import { BookingActions } from "./booking-actions";
import { ReviewForm } from "./review-form";

/**
 * What each state means **to a parent**. The internal vocabulary
 * (`paid_unconfirmed`) is honest but reads like a database; a parent needs to
 * know whether anything is expected of them, which is nothing in every state
 * here.
 */
const STATUS_COPY: Record<BookingStatus, { label: string; note: string; tone: Tone }> = {
  pending_payment: {
    label: "Payment not finished",
    // Was "You can book it again", which meant re-entering the whole form. The
    // booking still exists and its checkout can be picked up — see `BookingActions`.
    note: "The payment wasn't completed, so this session isn't booked yet. You can pick up where you left off, or cancel it — nothing has been charged.",
    tone: "neutral",
  },
  paid_unconfirmed: {
    label: "Paid · confirming",
    note: "Paid. A coordinator is confirming your educator and time — we'll email you as soon as it's set. Cancel at least 24 hours before the session for a full refund.",
    tone: "waiting",
  },
  confirmed: {
    label: "Confirmed",
    note: "All set. A parent or guardian supervises the session. Cancel at least 24 hours ahead for a full refund.",
    tone: "good",
  },
  completed: {
    label: "Completed",
    note: "This session has been delivered.",
    tone: "neutral",
  },
  no_show: {
    label: "Recorded as a no-show",
    note: "Get in touch if that doesn't look right to you.",
    tone: "bad",
  },
  refunded: {
    label: "Refunded",
    note: "Refunded in full. It reaches your account within 5–10 business days.",
    tone: "bad",
  },
  partially_refunded: {
    label: "Partly refunded",
    note: "Part of this booking has been refunded.",
    tone: "bad",
  },
  disputed: {
    label: "Under review",
    note: "Your bank is reviewing a dispute on this payment. We'll follow their outcome.",
    tone: "bad",
  },
  expired: {
    label: "Expired",
    note: "This request expired before it was confirmed.",
    tone: "neutral",
  },
};

type Tone = "good" | "waiting" | "bad" | "neutral";

const TONE_STYLES: Record<Tone, string> = {
  good: "border-[rgba(45,120,80,0.35)] bg-[rgba(45,120,80,0.09)] text-[#256a45]",
  waiting: "border-[rgba(210,162,65,0.5)] bg-[rgba(210,162,65,0.12)] text-[#7a5a12]",
  bad: "border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.08)] text-[#a63a30]",
  neutral: "border-line bg-sand text-muted",
};

function money(cents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

function whenLabel(date: string, time: string): string {
  const [hour, minute] = time.split(":").map(Number);
  const stamp = new Date(`${date}T${time}:00`);
  const day = Number.isNaN(stamp.getTime())
    ? date
    : stamp.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
  const suffix = (hour ?? 0) < 12 ? "AM" : "PM";
  const twelve = (hour ?? 0) % 12 === 0 ? 12 : (hour ?? 0) % 12;
  return `${day} at ${twelve}:${String(minute ?? 0).padStart(2, "0")} ${suffix}`;
}

/**
 * The review slot on a completed session.
 *
 * A Server Component that decides *which* of three things a card shows, so the
 * interactive form is only ever sent to the browser for a booking that can
 * actually take one. The states it can't offer a form for still say something:
 * a review already written is acknowledged rather than silently replaced by
 * nothing, and a failed eligibility check admits it was a failure — an absent
 * control would otherwise read as "you've already done this".
 */
function ReviewSlot({
  booking,
  state,
}: {
  booking: ParentBooking;
  state: ReviewState | undefined;
}) {
  if (state === "ok") {
    return (
      <ReviewForm
        bookingId={booking.id}
        educatorName={
          booking.assignedEducator?.name ?? booking.requestedEducator.name
        }
      />
    );
  }

  if (state === "already_reviewed") {
    return (
      <p className="mt-5 border-t border-line pt-5 text-[13.5px] leading-[1.6] text-muted">
        You&rsquo;ve already reviewed this session &mdash; thank you. It goes live on
        the educator&rsquo;s profile once our team has read it.
      </p>
    );
  }

  if (state === "paused") {
    return (
      <p className="mt-5 border-t border-line pt-5 text-[13.5px] leading-[1.6] text-muted">
        We&rsquo;re not taking new reviews just now. This session stays open for one
        &mdash; please come back in a little while and tell us how it went.
      </p>
    );
  }

  if (state === "unknown") {
    return (
      <p className="mt-5 border-t border-line pt-5 text-[13.5px] leading-[1.6] text-muted">
        We couldn&rsquo;t check whether this session is still open for a review just
        now. Reload the page in a moment and it&rsquo;ll be here.
      </p>
    );
  }

  return null;
}

/**
 * One booking in the parent's history.
 *
 * Still a Server Component: the card itself ships no JavaScript, and only the
 * resume/cancel controls at the bottom are a Client Component — so a list of
 * completed sessions costs nothing to render.
 */
function BookingCard({
  booking,
  readAt,
  reviewState,
}: {
  booking: ParentBooking;
  readAt: number;
  /** Absent for anything that isn't a completed session — see `ReviewSlot`. */
  reviewState: ReviewState | undefined;
}) {
  const copy = STATUS_COPY[booking.status];
  const substituted =
    booking.assignedEducator !== null &&
    booking.assignedEducator.slug !== booking.requestedEducator.slug;

  return (
    <li className="rounded-[20px] border border-line bg-white p-7 shadow-[0_30px_60px_-48px_rgba(35,40,70,0.42)] max-[560px]:p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-[10px]">
            <h3 className="font-serif text-[20px] font-semibold tracking-[-0.01em]">
              {booking.subjectTopic}
            </h3>
            <span
              className={cn(
                "rounded-[30px] border px-[11px] py-[3px] text-[11.5px] font-bold uppercase tracking-[0.06em]",
                TONE_STYLES[copy.tone],
              )}
            >
              {copy.label}
            </span>
          </div>

          <p className="mt-2 text-[14.5px] text-ink">
            {whenLabel(booking.preferredDate, booking.preferredTime)}
          </p>
          <p className="mt-1 text-[13.5px] text-muted">
            {booking.format === "in_home" ? "In-home" : "Online"} ·{" "}
            {booking.durationMinutes} minutes · learner aged {booking.learnerAgeBand} ·{" "}
            <span className="whitespace-nowrap">{booking.reference}</span>
          </p>
        </div>

        <p className="shrink-0 font-serif text-[20px] font-semibold">
          {money(booking.totalCents, booking.currency)}
        </p>
      </div>

      <p className="mt-4 text-[13.5px] leading-[1.6] text-muted">{copy.note}</p>

      <dl className="mt-4 border-t border-line pt-4 text-[13.5px]">
        <div className="flex flex-wrap justify-between gap-3 py-1">
          <dt className="text-muted">Educator</dt>
          <dd className="font-semibold text-ink">
            {booking.assignedEducator?.name ?? booking.requestedEducator.name}
            {booking.assignedEducator === null ? " (requested)" : ""}
          </dd>
        </div>
        {substituted ? (
          <div className="flex flex-wrap justify-between gap-3 py-1">
            <dt className="text-muted">You asked for</dt>
            <dd className="text-ink">{booking.requestedEducator.name}</dd>
          </div>
        ) : null}
        {booking.amountRefundedCents > 0 ? (
          <div className="flex flex-wrap justify-between gap-3 py-1">
            <dt className="text-muted">Refunded</dt>
            <dd className="font-semibold text-[#a63a30]">
              {money(booking.amountRefundedCents, booking.currency)}
            </dd>
          </div>
        ) : null}
        {booking.lineItems.map((line) => (
          <div key={line.label} className="flex flex-wrap justify-between gap-3 py-1">
            <dt className="text-muted">{line.label}</dt>
            <dd className="text-ink">{money(line.amountCents, booking.currency)}</dd>
          </div>
        ))}
      </dl>

      <BookingActions booking={booking} readAt={readAt} />
      <ReviewSlot booking={booking} state={reviewState} />
    </li>
  );
}

/** The parent's full history, newest request first. */
export function BookingHistory({
  bookings,
  readAt,
  reviewStates,
}: {
  bookings: ParentBooking[];
  /** When the page was read, so every card judges the 24-hour window identically. */
  readAt: number;
  /** Keyed by booking id, and only populated for completed sessions. */
  reviewStates: ReviewStates;
}) {
  if (bookings.length === 0) {
    return (
      <div className="rounded-[20px] border border-line bg-white p-7 text-center shadow-[0_30px_60px_-48px_rgba(35,40,70,0.42)]">
        <p className="text-[15px] leading-[1.65] text-muted">
          You haven&rsquo;t booked a session yet. When you do, it appears here with its
          status, its price, and who&rsquo;s teaching it.
        </p>
        <Link
          href="/book"
          className="mt-5 inline-block rounded-[40px] border border-ink px-[26px] py-3 text-[14px] font-semibold text-ink no-underline transition-all duration-[400ms] ease-brand hover:bg-slate hover:text-ivory"
        >
          Book a session
        </Link>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-5">
      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          readAt={readAt}
          reviewState={reviewStates[booking.id]}
        />
      ))}
    </ul>
  );
}
