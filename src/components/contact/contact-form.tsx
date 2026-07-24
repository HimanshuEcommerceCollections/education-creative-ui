"use client";

import { useRef, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { CONTACT_REASONS, type ContactReason } from "@/data/contact";
import { cn } from "@/lib/utils";

import { ArrowIcon, CheckIcon } from "./contact-icons";
import styles from "./contact-form.module.css";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const FIELD_BASE =
  "w-full rounded-[12px] border-[1.5px] bg-ivory px-4 py-[14px] font-sans text-[15.5px] text-ink " +
  "transition-[border-color,box-shadow,transform,background-color] duration-[350ms] ease-[cubic-bezier(0.16,0.7,0.2,1)] " +
  "placeholder:text-[rgba(99,99,110,0.5)] focus:-translate-y-[2px] focus:border-gold focus:bg-white " +
  "focus:shadow-[0_10px_28px_-16px_rgba(210,162,65,0.7)] focus:outline-none";

const FIELD_ERROR = "border-[#C0453B] bg-white shadow-[0_0_0_3px_rgba(192,69,59,0.12)]";

const LABEL = "mb-[9px] block text-[12px] font-bold uppercase tracking-[0.05em] text-muted transition-colors group-focus-within:text-slate";

interface Errors {
  name?: boolean;
  email?: boolean;
  message?: boolean;
}

/**
 * The contact form: parent details, a segmented reason selector, and a message,
 * with inline validation and a confirmation panel. This is a demo — submitting
 * sends nothing, it just swaps the card for the confirmation.
 */
export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [reason, setReason] = useState<ContactReason>(CONTACT_REASONS[0]);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Errors = {
      name: !name.trim(),
      email: !EMAIL_RE.test(email.trim()),
      message: !message.trim(),
    };
    setErrors(next);

    if (next.name) return nameRef.current?.focus();
    if (next.email) return emailRef.current?.focus();
    if (next.message) return messageRef.current?.focus();

    setSubmitted(true);
  };

  const reset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setReason(CONTACT_REASONS[0]);
    setErrors({});
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="rounded-[24px] border border-line bg-white p-11 text-center shadow-[0_40px_80px_-56px_rgba(22,24,29,0.5)] max-[560px]:p-7">
        <div
          className={cn(
            styles.checkPop,
            "mx-auto mb-6 flex h-[78px] w-[78px] items-center justify-center rounded-full bg-[var(--chip-a)] text-slate",
          )}
        >
          <CheckIcon className="h-9 w-9" />
        </div>
        <h2 className="mb-2 font-serif text-[26px] font-semibold tracking-[-0.01em]">
          Thanks — message noted.
        </h2>
        <p className="mx-auto mb-[26px] max-w-[42ch] text-[14.5px] leading-[1.55] text-muted">
          This is a demo, so nothing was actually sent. On a live site, our team would reply within
          one business day.
        </p>
        <Button type="button" variant="outline" onClick={reset}>
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-[24px] border border-line bg-white p-11 shadow-[0_40px_80px_-56px_rgba(22,24,29,0.5)] max-[560px]:p-7"
    >
      <h2 className="font-serif text-[26px] font-semibold tracking-[-0.01em]">Send a message</h2>
      <p className="mb-[30px] mt-1.5 text-[14.5px] leading-[1.55] text-muted">
        A real human reads every note. This is a demo, so nothing is actually sent.
      </p>

      <div className="group relative mb-6">
        <label htmlFor="contact-name" className={LABEL}>
          Parent / guardian name
        </label>
        <input
          id="contact-name"
          ref={nameRef}
          type="text"
          autoComplete="name"
          placeholder="e.g. Jordan Ellis"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (errors.name) setErrors((prev) => ({ ...prev, name: false }));
          }}
          aria-invalid={errors.name || undefined}
          className={cn(FIELD_BASE, errors.name ? FIELD_ERROR : "border-line")}
        />
      </div>

      <div className="group relative mb-6">
        <label htmlFor="contact-email" className={LABEL}>
          Email
        </label>
        <input
          id="contact-email"
          ref={emailRef}
          type="email"
          autoComplete="email"
          placeholder="you@email.com"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: false }));
          }}
          aria-invalid={errors.email || undefined}
          className={cn(FIELD_BASE, errors.email ? FIELD_ERROR : "border-line")}
        />
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
          type="tel"
          autoComplete="tel"
          placeholder="(919) 555-0142"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className={cn(FIELD_BASE, "border-line")}
        />
      </div>

      <div className="mb-6">
        <div className="mb-[11px] text-[12px] font-bold uppercase tracking-[0.05em] text-muted">
          Reason for contact
        </div>
        <div role="group" aria-label="Reason for contact" className="flex flex-wrap gap-[10px]">
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
                  "transition-[transform,background-color,color,box-shadow] duration-[300ms] ease-[cubic-bezier(0.16,0.7,0.2,1)]",
                  active
                    ? "bg-slate text-white shadow-[0_0_0_2px_rgba(210,162,65,0.55),0_14px_28px_-14px_rgba(46,58,115,0.6)]"
                    : "bg-[var(--chip-a)] hover:-translate-y-[2px] hover:bg-[var(--chip-b)]",
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div className="group relative mb-6">
        <label htmlFor="contact-message" className={LABEL}>
          Message
        </label>
        <textarea
          id="contact-message"
          ref={messageRef}
          placeholder="Tell us a little about the learner's age, subjects, and preferred schedule..."
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
            if (errors.message) setErrors((prev) => ({ ...prev, message: false }));
          }}
          aria-invalid={errors.message || undefined}
          className={cn(FIELD_BASE, "min-h-[118px] resize-y", errors.message ? FIELD_ERROR : "border-line")}
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        className="[&_svg]:transition-transform [&_svg]:duration-300 hover:[&_svg]:translate-x-[3px]"
      >
        Send message
        <ArrowIcon className="h-[17px] w-[17px]" />
      </Button>
    </form>
  );
}
