"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import {
  CONTACT_REASONS,
  CONTACT_REASON_LABELS,
  type ContactReason,
} from "@contracts/contact-requests.ts";

import { submitContactRequestAction } from "@/app/(site)/contact/actions";
import { Button } from "@/components/ui/button";
import { CONTACT_DETAILS } from "@/data/contact";
import { IDLE, fieldError, formMessage } from "@/lib/auth/form-state";
import { cn } from "@/lib/utils";

import { ArrowIcon, CheckIcon } from "./contact-icons";
import styles from "./contact-form.module.css";

const FIELD_BASE =
  "w-full rounded-[12px] border-[1.5px] bg-ivory px-4 py-[14px] font-sans text-[15.5px] text-ink " +
  "transition-[border-color,box-shadow,transform,background-color] duration-[350ms] ease-brand " +
  "placeholder:text-[rgba(99,99,110,0.5)] focus:-translate-y-[2px] focus:border-gold focus:bg-white " +
  "focus:shadow-[0_10px_28px_-16px_rgba(210,162,65,0.7)] focus:outline-none";

const FIELD_ERROR = "border-[#C0453B] bg-white shadow-[0_0_0_3px_rgba(192,69,59,0.12)]";

const LABEL =
  "mb-[9px] block text-[12px] font-bold uppercase tracking-[0.05em] text-muted transition-colors group-focus-within:text-slate";

const ERROR_TEXT = "mt-[7px] text-[12.5px] font-semibold leading-[1.45] text-[#C0453B]";

const CARD =
  "rounded-[24px] border border-line bg-white p-11 shadow-[0_40px_80px_-56px_rgba(22,24,29,0.5)] max-[560px]:p-7";

/** The address that actually reaches a person, single-sourced with the info card. */
const SUPPORT_EMAIL = CONTACT_DETAILS.find((detail) => detail.icon === "mail")?.value;

/**
 * The contact form: parent details, a segmented reason selector, and a message.
 *
 * It posts to `POST /contact-requests` through a Server Action, so everything on
 * screen is now true — the disclosure panel, the warning medallion and the
 * `mailto:` hand-off that used to stand in for a delivery are gone with the demo
 * they apologised for. What replaces them is thinner on purpose: a confirmation
 * that says the note arrived, names the address the reply is going to, and
 * promises no turnaround time, because the product deliberately doesn't state one.
 *
 * Validation is the contract's own schema, run in the action rather than here. The
 * browser round-trips one submit to find out a field is empty, which is the price
 * of having exactly one definition of "valid" — the same one the API enforces —
 * and it is the pattern every other form in this app already follows.
 */
export function ContactForm() {
  const [state, formAction] = useActionState(submitContactRequestAction, IDLE);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [reason, setReason] = useState<ContactReason>(CONTACT_REASONS[0]);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const reasonRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const errors = {
    name: fieldError(state, "name"),
    email: fieldError(state, "email"),
    phone: fieldError(state, "phone"),
    reason: fieldError(state, "reason"),
    message: fieldError(state, "message"),
  };

  /** Focus the first field the server rejected, in visual order. */
  useEffect(() => {
    if (state.status !== "error") return;
    if (errors.name) nameRef.current?.focus();
    else if (errors.email) emailRef.current?.focus();
    else if (errors.reason) reasonRef.current?.focus();
    else if (errors.message) messageRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed on the action result
  }, [state]);

  if (state.status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className={cn(CARD, "p-11 text-center max-[560px]:p-7")}
      >
        <div
          className={cn(
            styles.checkPop,
            "mx-auto mb-6 flex h-[78px] w-[78px] items-center justify-center rounded-full border-[1.5px] border-[rgba(46,58,115,0.2)] bg-[var(--chip-a)] text-slate",
          )}
        >
          <CheckIcon className="h-[34px] w-[34px]" />
        </div>
        <h2 className="mb-2 font-serif text-[26px] font-semibold tracking-[-0.01em]">
          Your message is with us
        </h2>
        <p className="mx-auto max-w-[46ch] text-[14.5px] leading-[1.65] text-ink">
          A real person reads it, and we&rsquo;ll come back to you by email{" "}
          {email.trim() ? (
            <>
              at <span className="font-semibold">{email.trim()}</span>
            </>
          ) : (
            "at the address you gave us"
          )}
          . An acknowledgement is on its way there now &mdash; if it hasn&rsquo;t
          landed shortly, check your spam folder before writing again.
        </p>
      </div>
    );
  }

  const alert = formMessage(state);
  const hasFieldError = Object.values(errors).some(Boolean);
  const alertCode = state.status === "error" ? state.code : undefined;

  return (
    <form action={formAction} noValidate className={CARD}>
      <h2 className="font-serif text-[26px] font-semibold tracking-[-0.01em]">Send a message</h2>
      <p className="mb-[30px] mt-1.5 text-[14.5px] leading-[1.55] text-muted">
        A real human reads every note.
      </p>

      {alert && !hasFieldError ? (
        <p
          role="alert"
          className="mb-6 rounded-[14px] border-[1.5px] border-[rgba(192,69,59,0.35)] bg-[#fdf3f2] px-4 py-[14px] text-[13.5px] leading-[1.6] text-[#b23b3b]"
        >
          {alert}
          {/*
            The one place an email address still earns its keep. A rate limit or an
            unreachable API is the form failing for real, and on a phone this alert
            is all that's on screen — the "reach us" card with the address sits
            below the fold. A plain link, not a pre-filled mailto: nothing was
            thrown away, so there is nothing to hand back.
          */}
          {SUPPORT_EMAIL && alertCode !== "validation_failed" ? (
            <>
              {" "}
              If it keeps happening, email us at{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold underline">
                {SUPPORT_EMAIL}
              </a>
              .
            </>
          ) : null}
        </p>
      ) : null}

      {/*
        The honeypot. Off-screen rather than `display:none`, because the crawlers
        worth catching skip hidden inputs; `aria-hidden` plus `inert` keep it out of
        the accessibility tree and out of reach of a keyboard, a screen reader's
        forms mode, and a click, so no person can fill it by any route. A filled
        one means a bot, and the action answers those with the same confirmation
        everyone else gets.
      */}
      <div
        aria-hidden="true"
        inert
        className="absolute left-[-9999px] h-px w-px overflow-hidden"
      >
        <label htmlFor="contact-website">Leave this field empty</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div className="group relative mb-6">
        <label htmlFor="contact-name" className={LABEL}>
          Parent / guardian name
        </label>
        <input
          id="contact-name"
          ref={nameRef}
          name="name"
          type="text"
          autoComplete="name"
          placeholder="e.g. Jordan Ellis"
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          className={cn(FIELD_BASE, errors.name ? FIELD_ERROR : "border-line")}
        />
        <p id="contact-name-error" hidden={!errors.name} className={ERROR_TEXT}>
          {errors.name}
        </p>
      </div>

      <div className="group relative mb-6">
        <label htmlFor="contact-email" className={LABEL}>
          Email
        </label>
        <input
          id="contact-email"
          ref={emailRef}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          className={cn(FIELD_BASE, errors.email ? FIELD_ERROR : "border-line")}
        />
        <p id="contact-email-error" hidden={!errors.email} className={ERROR_TEXT}>
          {errors.email}
        </p>
      </div>

      <div className="group relative mb-6">
        <label htmlFor="contact-phone" className={LABEL}>
          Phone{" "}
          <span className="font-semibold normal-case tracking-normal text-[rgba(99,99,110,0.55)]">
            (optional)
          </span>
        </label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="(919) 555-0142"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={errors.phone ? "contact-phone-error" : undefined}
          className={cn(FIELD_BASE, errors.phone ? FIELD_ERROR : "border-line")}
        />
        <p id="contact-phone-error" hidden={!errors.phone} className={ERROR_TEXT}>
          {errors.phone}
        </p>
      </div>

      <div className="mb-6">
        <div
          id="contact-reason-label"
          className="mb-[11px] text-[12px] font-bold uppercase tracking-[0.05em] text-muted"
        >
          Reason for contact
        </div>
        {/*
          The buttons carry the choice; a hidden input carries the *value*, because
          the slug is what the API stores and what the staff queue filters on — the
          label is only what a person reads.
        */}
        <input type="hidden" name="reason" value={reason} />
        {/*
          The group is focusable (`tabIndex={-1}`) only so a rejected `reason` can
          take focus like any other field, and carries its own focus ring — the
          global one styles controls, not a group.
        */}
        <div
          ref={reasonRef}
          role="group"
          aria-labelledby="contact-reason-label"
          aria-describedby={errors.reason ? "contact-reason-error" : undefined}
          tabIndex={-1}
          className="flex flex-wrap gap-[10px] focus:[outline-offset:6px] focus:[outline:3px_solid_var(--color-slate)]"
        >
          {CONTACT_REASONS.map((option) => {
            const active = reason === option;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={active}
                onClick={() => setReason(option)}
                className={cn(
                  "cursor-pointer rounded-[30px] border-[1.5px] border-transparent px-[18px] py-[10px] font-sans text-[13.5px] font-semibold text-slate",
                  "transition-[transform,background-color,color,box-shadow] duration-[300ms] ease-brand",
                  active
                    ? "bg-slate text-white shadow-[0_0_0_2px_rgba(210,162,65,0.55),0_14px_28px_-14px_rgba(46,58,115,0.6)]"
                    : "bg-[var(--chip-a)] hover:-translate-y-[2px] hover:bg-[var(--chip-b)]",
                )}
              >
                {CONTACT_REASON_LABELS[option]}
              </button>
            );
          })}
        </div>
        <p id="contact-reason-error" hidden={!errors.reason} className={ERROR_TEXT}>
          {errors.reason}
        </p>
      </div>

      <div className="group relative mb-6">
        <label htmlFor="contact-message" className={LABEL}>
          Message
        </label>
        <textarea
          id="contact-message"
          ref={messageRef}
          name="message"
          placeholder="Tell us a little about the learner's age, subjects, and preferred schedule..."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          className={cn(
            FIELD_BASE,
            "min-h-[118px] resize-y",
            errors.message ? FIELD_ERROR : "border-line",
          )}
        />
        <p id="contact-message-error" hidden={!errors.message} className={ERROR_TEXT}>
          {errors.message}
        </p>
      </div>

      <ContactSubmitButton />
    </form>
  );
}

/**
 * Separate because `useFormStatus` reports the pending state of the form *above*
 * it — called inside `ContactForm` itself it would always read false.
 */
function ContactSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="primary"
      disabled={pending}
      aria-busy={pending}
      className="disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:tracking-[0.01em] disabled:hover:shadow-none [&_svg]:transition-transform [&_svg]:duration-300 hover:[&_svg]:translate-x-[3px]"
    >
      {pending ? "Sending…" : "Send message"}
      <ArrowIcon className="h-[17px] w-[17px]" />
    </Button>
  );
}
