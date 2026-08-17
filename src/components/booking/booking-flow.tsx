"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";

import {
  createBookingRequestSchema,
  type BookingFormat,
  type QuoteResponse,
  type SessionDuration,
} from "@contracts/bookings.ts";

import {
  createBookingAction,
  getBookingQuoteAction,
  resumeBookingCheckoutAction,
  type BookingActionState,
} from "@/app/(site)/book/actions";
import {
  FORMAT_LABELS,
  type BookingEducator,
  type BookingRules,
  type BookingTopic,
} from "@/data/booking";
import type { CheckoutHandoff, ResumableBooking } from "@/lib/booking/checkout";
import {
  clearBookingDraft,
  resolveInitialSelection,
  writeBookingDraft,
  type BookingDraft,
} from "@/lib/booking/draft";
import {
  estimateSession,
  formatMoney,
  liveRatePerHour,
  type LivePricing,
} from "@/lib/booking/pricing";
import {
  civilNow,
  formatDate,
  formatTime,
  isDateOpen,
  openSlots,
  toDateKey,
  type CivilDate,
  type CivilNow,
} from "@/lib/booking/schedule";
import type { EducatorRating } from "@/lib/educators/rating";

import { BookingStep } from "./booking-step";
import { CheckoutPanel } from "./checkout-panel";
import { BookingSuccess, type BookingRecap } from "./booking-success";
import { BookingSummary } from "./booking-summary";
import {
  ContactFields,
  type AddressValues,
  type BookingAccount,
  type ContactValues,
} from "./contact-fields";
import { EducatorPicker } from "./educator-picker";
import { LearnerFields, type LearnerValues } from "./learner-fields";
import { SchedulePicker } from "./schedule-picker";
import { SessionDetails } from "./session-details";

const EMPTY_LEARNER: LearnerValues = {
  firstName: "",
  ageBand: "",
  focus: "",
  consentGiven: false,
};

const EMPTY_ADDRESS: AddressValues = {
  line1: "",
  line2: "",
  city: "",
  state: "NC",
  postalCode: "",
  notes: "",
};

/** Long enough that a parent clicking through lengths isn't quoted four times. */
const QUOTE_DEBOUNCE_MS = 350;

/** How often the browser re-reads the clock. See `now` below. */
const CLOCK_TICK_MS = 60_000;

/**
 * Quote refusals worth putting in front of a parent.
 *
 * These mean *this booking will be rejected* — an educator the API doesn't list, a
 * subject with no rate band, a topic label that doesn't match the educator's
 * profile — so they belong on screen at step 2 rather than after the child's name
 * and both consents. Everything else (rate limits, an unreachable API, a session
 * that has gone) leaves the labelled estimate in place and says nothing: a parent
 * who can still complete the booking doesn't need a warning about our plumbing.
 */
const BLOCKING_QUOTE_CODES = new Set(["not_found", "validation_failed", "conflict"]);

/** A quote reply, tagged with the inputs it answers. See `quoted` below. */
type QuotedPrice =
  | { input: object; quote: QuoteResponse }
  | {
      input: object;
      issue: { message: string; blocking: boolean; fieldErrors?: Record<string, string> };
    };

interface BookingFlowProps {
  /** From `?educator=`, so a profile page can hand the flow its own educator. */
  initialEducatorSlug?: string;
  /**
   * The bookable roster, resolved by the page against the pricing snapshot rather
   * than taken from `data/booking` wholesale — the API 404s an educator slug it
   * doesn't hold and refuses a subject it can't price, and finding that out at the
   * final submit costs the parent the whole form.
   */
  educators: readonly BookingEducator[];
  /**
   * Published ratings by educator slug, resolved by the page from the API's
   * public directory and used only by the step-1 cards. Absent for an educator
   * with no published reviews, which renders as no stars rather than a zero.
   */
  ratings?: Record<string, EducatorRating>;
  /** Draft read from the cookie by the server, or null. See `lib/booking/draft`. */
  draft: BookingDraft | null;
  /**
   * The clock, resolved once on the server. Passed in rather than read here so
   * the server's render and the browser's hydration agree on what's inside the
   * notice window — computing it independently on each side would let a minute
   * boundary produce two different sets of open slots for the same page. The
   * browser then takes over; see the `now` state below.
   */
  now: CivilNow;
  account: BookingAccount | null;
  /**
   * Whether this deployment has Stripe configured. Derived on the server from the
   * presence of a publishable key, not from a constant in the repo — see
   * `data/booking.ts`. The API refuses regardless, so this only decides whether
   * the parent is offered a pay button or an explanation.
   */
  paymentsLive: boolean;
  /**
   * Live pricing from the API snapshot — admin-set rates by (educator, subject)
   * plus the format differential — resolved by the page. Null when the API
   * couldn't answer, in which case the flow estimates from the in-repo figures.
   * Either way the authoritative charge is the server's quote, never this.
   */
  pricing: LivePricing | null;
  /**
   * The booking rules in force — notice window, how far ahead the calendar
   * opens, and the confirmation SLA printed beside the pay button. Read from the
   * public site-configuration snapshot by the page, with the in-repo defaults as
   * the fallback, so an admin's edit reaches the calendar and the promise
   * together. The API validates every request against the same figures.
   */
  rules: BookingRules;
  /**
   * A booking of the parent's own that is still awaiting payment, arrived at via
   * `?resume=<id>` from their booking history. Resolved by the page so the banner
   * can name the reference and the amount; reopening the Stripe session is the
   * button's job, not the page load's.
   */
  resumable?: ResumableBooking | null;
}

/**
 * The parent-facing booking flow.
 *
 * One client island holding the whole state machine, with each step a presentational
 * child. The steps are laid out at once rather than as a wizard because the summary
 * has to stay meaningful — a parent deciding whether $82.50 is worth it wants to see
 * what they've picked and change it, not page backwards through five screens.
 *
 * Validation runs against `createBookingRequestSchema` — the *same* schema the API
 * enforces, imported from the shared contracts. Inline errors therefore can't drift
 * from what the server will accept, and the action re-validates regardless: this
 * pass is for the parent's benefit, never a substitute for the server's.
 *
 * Two things are asked of the server as the parent works, rather than at the end:
 * the **price** (`POST /bookings/quotes`, which is also what validates the educator
 * slug and the topic label), and the **clock** — see `now`.
 */
export function BookingFlow({
  initialEducatorSlug,
  educators,
  ratings,
  draft,
  now: serverNow,
  account,
  paymentsLive,
  pricing,
  rules,
  resumable,
}: BookingFlowProps) {
  /**
   * Resolved during render, not in an effect, so the first paint is already the
   * restored one. Pure and given identical inputs on both sides of hydration, so
   * the server HTML and the client's first render match exactly.
   */
  const initial = useMemo(
    () =>
      resolveInitialSelection({
        draft,
        educatorSlug: initialEducatorSlug,
        now: serverNow,
        rules,
        roster: educators,
      }),
    [draft, initialEducatorSlug, serverNow, rules, educators],
  );

  /**
   * The reference clock. Starts as the server's — that identity is what keeps
   * hydration honest — and is then refreshed in the browser.
   *
   * Frozen, it goes stale in exactly the way that matters: a tab left open past
   * midnight keeps offering slots that have since fallen inside the 24-hour notice
   * window, and the API (which validates the notice rule itself) rejects them. So
   * the clock advances, the selection is re-checked against it below, and the
   * submit re-checks once more before it sends.
   */
  const [now, setNow] = useState<CivilNow>(serverNow);

  useEffect(() => {
    const timer = setInterval(() => setNow(civilNow()), CLOCK_TICK_MS);
    return () => clearInterval(timer);
  }, []);

  const [educator, setEducator] = useState<BookingEducator>(initial.educator);
  const [subject, setSubject] = useState<BookingTopic | null>(initial.subject);
  const [format, setFormat] = useState<BookingFormat>(initial.format);
  const [duration, setDuration] = useState<SessionDuration>(initial.durationMinutes);
  /*
   * What the parent *picked*. What the form actually holds is derived from these
   * against the current clock, immediately below — a picked slot is not the same
   * thing as an offerable one once twenty minutes have passed.
   */
  const [pickedDate, setPickedDate] = useState<CivilDate | null>(initial.date);
  const [pickedTime, setPickedTime] = useState<string | null>(initial.time);
  const [pickedAlternate, setPickedAlternate] = useState<string | null>(
    initial.alternateTime,
  );
  const [flexible, setFlexible] = useState(initial.flexible);

  /**
   * The schedule as it stands *now* — derived, not synchronised.
   *
   * A picked slot can stop being offerable while the tab sits open: the notice
   * window moves, and the API validates that rule, so a form still holding
   * yesterday's 4:00 PM is a form heading for a rejection. Filtering here rather
   * than in an effect means there is no frame in which the calendar has greyed the
   * day out and the summary still names a time on it, and no `setState` cascade to
   * reason about. Everything downstream — the summary, the draft cookie, the
   * submit — reads these, never the picked values.
   */
  const openOn = useMemo(
    () =>
      pickedDate && isDateOpen(pickedDate, educator, now, rules)
        ? openSlots(pickedDate, educator, now, rules)
        : null,
    [pickedDate, educator, now, rules],
  );

  const date = openOn ? pickedDate : null;
  const time = openOn && pickedTime && openOn.includes(pickedTime) ? pickedTime : null;
  /* A fallback equal to the preferred time is what the contract rejects. */
  const alternateTime =
    openOn &&
    time &&
    pickedAlternate &&
    pickedAlternate !== time &&
    openOn.includes(pickedAlternate)
      ? pickedAlternate
      : null;

  const [learner, setLearner] = useState<LearnerValues>(EMPTY_LEARNER);
  const [contact, setContact] = useState<ContactValues>(() => ({
    fullName: account?.fullName ?? "",
    email: account?.email ?? "",
    phone: "",
    guardianConfirmed: false,
  }));
  const [address, setAddress] = useState<AddressValues>(EMPTY_ADDRESS);

  const [result, setResult] = useState<BookingActionState>({ status: "idle" });
  const [recap, setRecap] = useState<BookingRecap | null>(null);
  const [pending, startTransition] = useTransition();

  /**
   * The open Checkout Session, once there is one — from a fresh booking or from
   * resuming an unfinished one. Its presence is what swaps the form for Stripe's
   * payment panel: the booking exists and is `pending_payment` at this point, so
   * the form must not be editable behind it.
   */
  const [checkout, setCheckout] = useState<CheckoutHandoff | null>(null);

  /**
   * A booking left in `pending_payment` because the parent walked away from the
   * card form.
   *
   * The row and the Stripe session both survive that, so recovery must not mean
   * booking again — that runs against a limit of ten bookings an hour, and a parent
   * who fiddles can lock themselves out of the thing they were trying to pay for.
   * Remembering the id here is what lets `POST /bookings/:id/checkout` pick it back up
   * in-flow.
   */
  const [unfinished, setUnfinished] = useState<ResumableBooking | null>(
    resumable ?? null,
  );
  const [resuming, startResuming] = useTransition();

  /**
   * The last answer from `POST /bookings/quotes`, tagged with the inputs it was
   * for.
   *
   * Tagged rather than cleared when the inputs change, because clearing means a
   * `setState` in an effect and a render showing neither figure. Holding the input
   * alongside the answer lets the render simply ignore an answer that no longer
   * applies — and "no answer for the current inputs yet" *is* the pending state, so
   * there is no third flag to keep in step.
   */
  const [quoted, setQuoted] = useState<QuotedPrice | null>(null);

  // ---------------------------------------------------------------------------
  // Draft persistence
  // ---------------------------------------------------------------------------

  /**
   * Writing a cookie is exactly what an effect is for: pushing React state out to
   * an external system. Nothing is read back here — the server does the reading,
   * on the next request.
   */
  useEffect(() => {
    writeBookingDraft({
      educatorSlug: educator.slug,
      subject: subject?.label ?? null,
      format,
      durationMinutes: duration,
      dateKey: date ? toDateKey(date) : null,
      time,
      alternateTime,
      flexible,
    });
  }, [educator, subject, format, duration, date, time, alternateTime, flexible]);

  // ---------------------------------------------------------------------------
  // Selection handlers
  // ---------------------------------------------------------------------------

  /**
   * Changing educator invalidates anything that was specific to the last one.
   * Done here rather than in an effect: the reset is a consequence of the click,
   * and an effect would render one frame showing Marcus with Elena's subject.
   */
  const selectEducator = useCallback(
    (next: BookingEducator) => {
      setEducator(next);

      // Matched by label: two educators can teach a same-named topic under
      // different priced categories, and the new educator's own record is what
      // must supply the category.
      const carried = subject
        ? next.subjects.find((topic) => topic.label === subject.label)
        : undefined;
      setSubject(carried ?? null);
      if (!next.formats.includes(format)) setFormat(next.formats[0]);

      /*
       * The derivation above would already hide a date this educator doesn't teach
       * on, but clearing it here is what stops it reappearing if the parent switches
       * back — a request they never made a second time.
       */
      if (date && !isDateOpen(date, next, now, rules)) {
        setPickedDate(null);
        setPickedTime(null);
        setPickedAlternate(null);
      } else if (date && time && !openSlots(date, next, now, rules).includes(time)) {
        setPickedTime(null);
        setPickedAlternate(null);
      }
    },
    [subject, format, date, time, now, rules],
  );

  const selectDate = useCallback(
    (next: CivilDate) => {
      setPickedDate(next);
      // The previous time almost never exists on a different day.
      if (!time || !openSlots(next, educator, now, rules).includes(time)) {
        setPickedTime(null);
        setPickedAlternate(null);
      }
    },
    [time, educator, now, rules],
  );

  /**
   * Choosing a preferred time has to re-decide the fallback.
   *
   * Picking the current second choice as the new first choice leaves both fields
   * equal, which the shared contract rejects at `alternateTime` — while the
   * fallback `<select>`, whose options are `slots.filter(s => s !== time)`,
   * displays "No second choice" and shows the parent nothing to fix. The
   * derivation above refuses to *submit* a collision; this drops it from the
   * stored pick too, so the select and the state agree on what was chosen.
   */
  const selectTime = useCallback((next: string) => {
    setPickedTime(next);
    setPickedAlternate((current) => (current === next ? null : current));
  }, []);

  const patchLearner = useCallback(
    (patch: Partial<LearnerValues>) => setLearner((prev) => ({ ...prev, ...patch })),
    [],
  );
  const patchContact = useCallback(
    (patch: Partial<ContactValues>) => setContact((prev) => ({ ...prev, ...patch })),
    [],
  );
  const patchAddress = useCallback(
    (patch: Partial<AddressValues>) => setAddress((prev) => ({ ...prev, ...patch })),
    [],
  );

  // ---------------------------------------------------------------------------
  // Pricing
  // ---------------------------------------------------------------------------

  /**
   * The browser's estimate, and only ever that. Priced against the rate for the
   * *chosen subject* — the snapshot holds one rate per (educator, subject), so a
   * subject-blind lookup quotes Rosa's baking rate for a music lesson.
   */
  const estimate = useMemo(
    () =>
      estimateSession({
        ratePerHour: liveRatePerHour(
          pricing?.rates,
          educator.slug,
          subject?.category ?? null,
          educator.price,
        ),
        format,
        durationMinutes: duration,
        ...(pricing ? { policy: pricing.policy } : {}),
      }),
    [pricing, educator.slug, educator.price, subject, format, duration],
  );

  /**
   * The priced inputs, as `POST /bookings/quotes` takes them, or null when there is
   * nothing to ask about. Guests get no quote: the endpoint requires the `customer`
   * role, and their number stays the labelled estimate.
   *
   * The contract also accepts a `postalCode` for travel, and this deliberately
   * doesn't send one: the engine's travel component is a flat configured figure
   * that the ZIP has no bearing on, so including it would re-quote on an address
   * keystroke and change nothing. The day travel becomes distance-based, the ZIP
   * belongs in this object and in these dependencies.
   */
  const quoteInput = useMemo(() => {
    if (!account || !subject) return null;
    return {
      educatorSlug: educator.slug,
      subjectSlug: subject.category,
      subjectTopic: subject.label,
      format,
      durationMinutes: duration,
    };
  }, [account, subject, educator.slug, format, duration]);

  /**
   * Asks the server what this costs whenever the priced inputs settle.
   *
   * Debounced, because the inputs are chips a parent clicks through and a ZIP they
   * type — and because the endpoint is rate limited. The reply is discarded if
   * anything changed while it was in flight, so a slow quote for a 60-minute
   * session can't overwrite a fast one for 120.
   */
  useEffect(() => {
    if (!quoteInput) return;

    let live = true;
    const timer = setTimeout(async () => {
      const next = await getBookingQuoteAction(quoteInput);
      if (!live) return;

      setQuoted(
        next.status === "ok"
          ? { input: quoteInput, quote: next.quote }
          : {
              input: quoteInput,
              // The estimate stays on screen; only a refusal that dooms the
              // booking is said out loud. See BLOCKING_QUOTE_CODES.
              issue: {
                message: next.message,
                blocking: next.code !== undefined && BLOCKING_QUOTE_CODES.has(next.code),
                ...(next.fieldErrors ? { fieldErrors: next.fieldErrors } : {}),
              },
            },
      );
    }, QUOTE_DEBOUNCE_MS);

    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [quoteInput]);

  /* Only an answer for the inputs on screen counts. */
  const current = quoted?.input === quoteInput ? quoted : null;
  const quote = current && "quote" in current ? current.quote : null;
  const quoteIssue = current && "issue" in current ? current.issue : null;
  const quoting = quoteInput !== null && current === null;

  // ---------------------------------------------------------------------------
  // Derived
  // ---------------------------------------------------------------------------

  const addressComplete =
    address.line1.trim() !== "" &&
    address.city.trim() !== "" &&
    address.state.trim() !== "" &&
    address.postalCode.trim() !== "";

  const learnerComplete =
    learner.firstName.trim() !== "" && learner.ageBand !== "" && learner.consentGiven;

  const contactComplete =
    contact.fullName.trim() !== "" &&
    contact.email.trim() !== "" &&
    contact.phone.trim() !== "" &&
    contact.guardianConfirmed &&
    (format === "online" || addressComplete);

  /** Plain-language list of what's outstanding, for the summary card. */
  const missing = useMemo(() => {
    const items: string[] = [];
    if (!subject) items.push("Choose what your child is learning");
    if (!date) items.push("Pick a preferred date");
    else if (!time) items.push("Pick a preferred time");
    if (learner.firstName.trim() === "" || learner.ageBand === "") {
      items.push("Add your child's first name and age range");
    }
    if (!learner.consentGiven) items.push("Agree to us storing your child's details");
    if (!account && (contact.fullName.trim() === "" || contact.email.trim() === "")) {
      items.push("Add your name and email");
    }
    if (contact.phone.trim() === "") items.push("Add a phone number");
    if (format === "in_home" && !addressComplete) items.push("Add the in-home address");
    if (!contact.guardianConfirmed) items.push("Confirm you're the parent or guardian");
    if (!account) items.push("Sign in or create an account to pay");
    return items;
  }, [subject, date, time, learner, contact, account, format, addressComplete]);

  /**
   * Field errors from the submit, plus anything the quote probe already told us.
   * The quote's are second so a fresh submit wins, but they arrive *first* in time
   * — which is the whole point of asking early.
   */
  const fieldErrors: Record<string, string | undefined> = {
    ...(quoteIssue?.fieldErrors ?? {}),
    ...(result.status === "error" ? (result.fieldErrors ?? {}) : {}),
  };

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  const submit = useCallback(() => {
    /*
     * Re-read the clock at the moment of submit. A form filled in over twenty
     * minutes can name a slot that has since crossed the notice line, and the API
     * validates that rule — so catching it here is the difference between "pick
     * another time" and a rejected payment attempt.
     */
    const at = civilNow();
    const stale =
      date !== null &&
      (!isDateOpen(date, educator, at, rules) ||
        (time !== null && !openSlots(date, educator, at, rules).includes(time)));

    if (stale) {
      setNow(at);
      setResult({
        status: "error",
        message: `That time has just moved inside our ${rules.minNoticeHours}-hour notice window, so we've cleared it. Please pick another — everything else you've entered is kept.`,
        fieldErrors: {
          preferredTime: `Choose a time at least ${rules.minNoticeHours} hours from now.`,
        },
      });
      return;
    }

    const payload = {
      educatorSlug: educator.slug,
      subjectSlug: subject?.category ?? "",
      subjectTopic: subject?.label ?? "",
      format,
      durationMinutes: duration,
      preferredDate: date ? toDateKey(date) : "",
      preferredTime: time ?? "",
      ...(alternateTime ? { alternateTime } : {}),
      flexibleTime: flexible,
      learner: {
        firstName: learner.firstName.trim(),
        ageBand: learner.ageBand,
        ...(learner.focus.trim() ? { focus: learner.focus.trim() } : {}),
      },
      contact: {
        fullName: contact.fullName.trim(),
        email: contact.email.trim(),
        phone: contact.phone.trim(),
      },
      ...(format === "in_home"
        ? {
            address: {
              line1: address.line1.trim(),
              ...(address.line2.trim() ? { line2: address.line2.trim() } : {}),
              city: address.city.trim(),
              state: address.state.trim(),
              postalCode: address.postalCode.trim(),
              ...(address.notes.trim() ? { notes: address.notes.trim() } : {}),
            },
          }
        : {}),
      learnerDataConsentGiven: learner.consentGiven,
      guardianConfirmed: contact.guardianConfirmed,
    };

    const parsed = createBookingRequestSchema.safeParse(payload);

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.map(String).join(".");
        if (key && !errors[key]) errors[key] = issue.message;
      }
      setResult({
        status: "error",
        message: "Please check the highlighted fields.",
        code: "validation_failed",
        fieldErrors: errors,
      });
      return;
    }

    startTransition(async () => {
      const next = await createBookingAction(parsed.data);
      setResult(next);

      /*
       * Success here means the booking exists and a Checkout Session is open — it
       * does **not** mean anything is paid. So this opens the payment panel; the
       * confirmation screen waits for the panel to verify against our own API,
       * which in turn waits for the webhook.
       */
      if (next.status === "success") {
        setCheckout(next.checkout);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }, [
    educator,
    subject,
    format,
    duration,
    date,
    time,
    alternateTime,
    flexible,
    learner,
    contact,
    address,
    rules,
  ]);

  /** Opens a fresh Checkout Session on a booking that is still unpaid. */
  const resume = useCallback((bookingId: string) => {
    startResuming(async () => {
      const next = await resumeBookingCheckoutAction(bookingId);
      setResult(next);

      if (next.status === "success") {
        setCheckout(next.checkout);
        setUnfinished(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }, []);

  /**
   * Empties the form. Split out from `reset` because the confirmation dialog needs
   * this **without** losing the recap it is rendering.
   */
  const clearForm = useCallback(() => {
    setCheckout(null);
    setResult({ status: "idle" });
    setSubject(null);
    setPickedDate(null);
    setPickedTime(null);
    setPickedAlternate(null);
    setFlexible(false);
    setLearner(EMPTY_LEARNER);
    setAddress(EMPTY_ADDRESS);
    setContact({
      fullName: account?.fullName ?? "",
      email: account?.email ?? "",
      phone: "",
      guardianConfirmed: false,
    });
  }, [account]);

  const reset = useCallback(() => {
    setRecap(null);
    clearForm();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [clearForm]);

  /**
   * Abandoning the card form.
   *
   * The parent's answers are kept — they said they wanted to *change something*,
   * and wiping five steps for that is its own bug. What is not kept is the illusion
   * that the booking went away: it is still there, still payable, and the banner
   * above step 1 offers to reopen it rather than leaving "Payment not finished" in
   * their history with no way back to it.
   */
  const abandonCheckout = useCallback(() => {
    setUnfinished(
      checkout
        ? {
            bookingId: checkout.bookingId,
            reference: checkout.reference,
            totalCents: checkout.totalCents,
          }
        : null,
    );
    setCheckout(null);
    setResult({ status: "idle" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [checkout]);

  const quoteBlocked = quoteIssue?.blocking ? quoteIssue.message : undefined;

  return (
    <>
      <div className="grid grid-cols-[1.5fr_0.9fr] items-start gap-[38px] pb-[12vh] pt-5 max-[940px]:grid-cols-1">
        <div>
          {checkout ? (
            /*
             * The form is replaced, not merely covered. A booking now exists in
             * `pending_payment` with an open Checkout Session against a specific
             * amount — letting the parent edit the length behind the card form
             * would put the price they see and the price they're charged out of
             * step. "Go back and change something" keeps their answers and keeps
             * the booking resumable.
             */
            <CheckoutPanel
              checkout={checkout}
              confirmationSlaDays={rules.confirmationSlaDays}
              onCancel={abandonCheckout}
              onResume={() => resume(checkout.bookingId)}
              resuming={resuming}
              onConfirmed={(reference, totalLabel) => {
                setRecap({
                  reference,
                  educatorName: educator.name,
                  subject: subject?.label ?? "",
                  formatLabel: FORMAT_LABELS[format],
                  when: date && time ? `${formatDate(date, "long")} at ${formatTime(time)}` : "—",
                  durationLabel: `${duration} min`,
                  totalLabel,
                });
                clearBookingDraft();

                /*
                 * The form is emptied, not just hidden behind the dialog. It used
                 * to survive: dismissing the confirmation with Escape or a click
                 * on the backdrop returned the parent to a fully populated form
                 * with an enabled "Continue to payment" — one click from a second
                 * charge for the session they had just paid for.
                 */
                clearForm();
                if (unfinished?.bookingId === checkout.bookingId) setUnfinished(null);
              }}
            />
          ) : (
            <>
              {unfinished ? (
                <UnfinishedPayment
                  reference={unfinished.reference}
                  totalLabel={formatMoney(unfinished.totalCents)}
                  pending={resuming}
                  onResume={() => resume(unfinished.bookingId)}
                />
              ) : null}

              <BookingStep step={1} title="Choose your educator" complete>
                <EducatorPicker
                  educators={educators}
                  selected={educator}
                  onSelect={selectEducator}
                  rates={pricing?.rates}
                  ratings={ratings}
                  subjectSlug={subject?.category ?? null}
                  error={fieldErrors.educatorSlug}
                  /* Only while they're still on the substitute we chose for them. */
                  unavailableSlug={
                    educator.slug === initial.educator.slug
                      ? initial.unavailableEducatorSlug
                      : null
                  }
                />
              </BookingStep>

              <BookingStep step={2} title="Shape the session" complete={Boolean(subject)}>
                <SessionDetails
                  educator={educator}
                  subject={subject}
                  format={format}
                  duration={duration}
                  errors={{
                    subject: fieldErrors.subjectTopic ?? fieldErrors.subjectSlug,
                    format: fieldErrors.format,
                    duration: fieldErrors.durationMinutes,
                  }}
                  onSubject={setSubject}
                  onFormat={setFormat}
                  onDuration={setDuration}
                />
              </BookingStep>

              <BookingStep
                step={3}
                title="Pick a preferred date and time"
                description="Nothing is reserved yet — a coordinator confirms this against your educator's diary."
                complete={Boolean(date && time)}
              >
                <SchedulePicker
                  educator={educator}
                  now={now}
                  rules={rules}
                  date={date}
                  time={time}
                  alternateTime={alternateTime}
                  flexible={flexible}
                  errors={{
                    preferredDate: fieldErrors.preferredDate,
                    preferredTime: fieldErrors.preferredTime,
                    alternateTime: fieldErrors.alternateTime,
                  }}
                  onDate={selectDate}
                  onTime={selectTime}
                  onAlternateTime={setPickedAlternate}
                  onFlexible={setFlexible}
                />
              </BookingStep>

              <BookingStep step={4} title="Who's learning?" complete={learnerComplete}>
                <LearnerFields
                  values={learner}
                  errors={{
                    firstName: fieldErrors["learner.firstName"],
                    ageBand: fieldErrors["learner.ageBand"],
                    focus: fieldErrors["learner.focus"],
                    consent: fieldErrors.learnerDataConsentGiven,
                  }}
                  onChange={patchLearner}
                />
              </BookingStep>

              <BookingStep step={5} title="Your details" complete={contactComplete}>
                <ContactFields
                  format={format}
                  account={account}
                  contact={contact}
                  address={address}
                  errors={fieldErrors}
                  onContact={patchContact}
                  onAddress={patchAddress}
                />
              </BookingStep>
            </>
          )}
        </div>

        <BookingSummary
          educator={educator}
          subject={subject?.label ?? null}
          readOnly={checkout !== null}
          format={format}
          date={date}
          time={time}
          alternateTime={alternateTime}
          flexible={flexible}
          duration={duration}
          estimate={estimate}
          quote={quote}
          quotePending={quoting}
          missing={missing}
          pending={pending}
          error={result.status === "error" ? result.message : undefined}
          errorCode={result.status === "error" ? result.code : undefined}
          accountEmail={account?.email}
          blocked={quoteBlocked}
          paymentsLive={paymentsLive}
          confirmationSlaDays={rules.confirmationSlaDays}
          onSubmit={submit}
        />
      </div>

      <BookingSuccess
        recap={recap}
        confirmationSlaDays={rules.confirmationSlaDays}
        onClose={() => setRecap(null)}
        onBookAnother={reset}
      />
    </>
  );
}

/**
 * The banner for a booking the parent stepped away from.
 *
 * Honest about what resuming does: it pays for the session as it was chosen then,
 * not as the form reads now. Without that distinction a parent who changed the
 * length and pressed "Resume" would be charged the old amount.
 */
function UnfinishedPayment({
  reference,
  totalLabel,
  pending,
  onResume,
}: {
  reference: string;
  totalLabel: string;
  pending: boolean;
  onResume: () => void;
}) {
  return (
    <section
      aria-labelledby="booking-unfinished-title"
      className="mb-5 rounded-[20px] border-[1.5px] border-[rgba(210,162,65,0.5)] bg-[rgba(210,162,65,0.08)] px-7 pb-6 pt-[22px] max-[560px]:px-5"
    >
      <h2
        id="booking-unfinished-title"
        className="font-serif text-[17px] font-semibold tracking-[-0.01em]"
      >
        You have a payment waiting
      </h2>
      <p className="mt-2 text-[13.5px] leading-[1.6] text-muted">
        Booking {reference} is held for {totalLabel} and hasn&rsquo;t been paid, so nothing
        has been charged. Pick it back up and you pay for the session exactly as you chose
        it a moment ago — or change what you like below and start again, and a coordinator
        clears the unfinished one.
      </p>
      <button
        type="button"
        onClick={onResume}
        disabled={pending}
        aria-busy={pending}
        className="mt-4 inline-flex cursor-pointer items-center justify-center rounded-[40px] bg-slate px-6 py-[13px] text-[14px] font-bold text-white transition-[transform,background-color] duration-300 ease-brand hover:-translate-y-[2px] hover:bg-slate-deep disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
      >
        {pending ? "Opening payment…" : `Resume paying ${totalLabel}`}
      </button>
    </section>
  );
}
