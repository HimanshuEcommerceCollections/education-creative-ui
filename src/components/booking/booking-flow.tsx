"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";

import {
  createBookingRequestSchema,
  type BookingFormat,
  type CreateBookingResponse,
  type SessionDuration,
} from "@contracts/bookings.ts";

import { createBookingAction, type BookingActionState } from "@/app/(site)/book/actions";
import { FORMAT_LABELS, type BookingEducator, type BookingTopic } from "@/data/booking";
import {
  clearBookingDraft,
  resolveInitialSelection,
  writeBookingDraft,
  type BookingDraft,
} from "@/lib/booking/draft";
import { estimateSession, type LivePricing } from "@/lib/booking/pricing";
import {
  formatDate,
  formatTime,
  isDateOpen,
  openSlots,
  toDateKey,
  type CivilDate,
  type CivilNow,
} from "@/lib/booking/schedule";

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

interface BookingFlowProps {
  /** From `?educator=`, so a profile page can hand the flow its own educator. */
  initialEducatorSlug?: string;
  /** Draft read from the cookie by the server, or null. See `lib/booking/draft`. */
  draft: BookingDraft | null;
  /**
   * The clock, resolved once on the server. Passed in rather than read here so
   * the server's render and the browser's hydration agree on what's inside the
   * notice window — computing it independently on each side would let a minute
   * boundary produce two different sets of open slots for the same page.
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
   * Live pricing from the API snapshot — admin-set rates by educator slug plus
   * the format differential — resolved by the page. Null when the API couldn't
   * answer, in which case the flow estimates from the in-repo figures. Either
   * way the authoritative charge is the server's quote, never this estimate.
   */
  pricing: LivePricing | null;
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
 */
export function BookingFlow({
  initialEducatorSlug,
  draft,
  now,
  account,
  paymentsLive,
  pricing,
}: BookingFlowProps) {
  /**
   * Resolved during render, not in an effect, so the first paint is already the
   * restored one. Pure and given identical inputs on both sides of hydration, so
   * the server HTML and the client's first render match exactly.
   */
  const initial = useMemo(
    () => resolveInitialSelection({ draft, educatorSlug: initialEducatorSlug, now }),
    [draft, initialEducatorSlug, now],
  );

  const [educator, setEducator] = useState<BookingEducator>(initial.educator);
  const [subject, setSubject] = useState<BookingTopic | null>(initial.subject);
  const [format, setFormat] = useState<BookingFormat>(initial.format);
  const [duration, setDuration] = useState<SessionDuration>(initial.durationMinutes);
  const [date, setDate] = useState<CivilDate | null>(initial.date);
  const [time, setTime] = useState<string | null>(initial.time);
  const [alternateTime, setAlternateTime] = useState<string | null>(initial.alternateTime);
  const [flexible, setFlexible] = useState(initial.flexible);

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
   * The created booking, once the API has one. Its presence is what swaps the form
   * for Stripe's payment panel — the booking exists and is `pending_payment` at
   * this point, so the form must not be editable behind it.
   */
  const [checkout, setCheckout] = useState<CreateBookingResponse | null>(null);

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

      if (date && !isDateOpen(date, next, now)) {
        setDate(null);
        setTime(null);
        setAlternateTime(null);
      } else if (date && time && !openSlots(date, next, now).includes(time)) {
        setTime(null);
        setAlternateTime(null);
      }
    },
    [subject, format, date, time, now],
  );

  const selectDate = useCallback(
    (next: CivilDate) => {
      setDate(next);
      // The previous time almost never exists on a different day.
      if (!time || !openSlots(next, educator, now).includes(time)) {
        setTime(null);
        setAlternateTime(null);
      }
    },
    [time, educator, now],
  );

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
  // Derived
  // ---------------------------------------------------------------------------

  const estimate = useMemo(
    () =>
      estimateSession({
        ratePerHour: pricing?.rates[educator.slug] ?? educator.price,
        format,
        durationMinutes: duration,
        ...(pricing ? { policy: pricing.policy } : {}),
      }),
    [pricing, educator.slug, educator.price, format, duration],
  );

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

  const fieldErrors = result.status === "error" ? (result.fieldErrors ?? {}) : {};

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  const submit = useCallback(() => {
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
        setCheckout(next.booking);
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
  ]);

  const reset = useCallback(() => {
    setRecap(null);
    setCheckout(null);
    setResult({ status: "idle" });
    setSubject(null);
    setDate(null);
    setTime(null);
    setAlternateTime(null);
    setFlexible(false);
    setLearner(EMPTY_LEARNER);
    setAddress(EMPTY_ADDRESS);
    setContact({
      fullName: account?.fullName ?? "",
      email: account?.email ?? "",
      phone: "",
      guardianConfirmed: false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [account]);

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
             * step. "Go back and change something" abandons this booking and
             * returns to a fresh form.
             */
            <CheckoutPanel
              booking={checkout}
              onCancel={reset}
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
                setCheckout(null);
              }}
            />
          ) : (
            <>
          <BookingStep step={1} title="Choose your educator" complete>
            <EducatorPicker
              selected={educator}
              onSelect={selectEducator}
              rates={pricing?.rates}
            />
          </BookingStep>

          <BookingStep step={2} title="Shape the session" complete={Boolean(subject)}>
            <SessionDetails
              educator={educator}
              subject={subject}
              format={format}
              duration={duration}
              subjectError={fieldErrors.subjectTopic ?? fieldErrors.subjectSlug}
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
              date={date}
              time={time}
              alternateTime={alternateTime}
              flexible={flexible}
              onDate={selectDate}
              onTime={setTime}
              onAlternateTime={setAlternateTime}
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
          missing={missing}
          pending={pending}
          error={result.status === "error" ? result.message : undefined}
          paymentsLive={paymentsLive}
          onSubmit={submit}
        />
      </div>

      <BookingSuccess recap={recap} onClose={() => setRecap(null)} onBookAnother={reset} />
    </>
  );
}
