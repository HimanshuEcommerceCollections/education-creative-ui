"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import { submitApplicationAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { APPLY_EXPERIENCE, APPLY_SUBJECTS } from "@/data/become-a-tutor";
import { IDLE, fieldError, formMessage } from "@/lib/auth/form-state";
import { cn } from "@/lib/utils";

import { APPLY_FIELD, APPLY_FIELD_ERROR, APPLY_FIELD_REST, FieldRow } from "./apply-field";
import styles from "./apply-form.module.css";
import { CheckIcon, ChevronDownIcon } from "./become-icons";

const CARD =
  "rounded-[22px] border border-line bg-white px-10 pb-9 pt-10 " +
  "shadow-[0_34px_70px_-44px_rgba(35,40,70,0.4)] max-[560px]:px-6 max-[560px]:py-[30px]";

/** Input names, which are also the contract's field names where they match. */
type FieldName = "applicantName" | "email" | "subject" | "yearsExperience" | "about";

const EMPTY: Record<FieldName, string> = {
  applicantName: "",
  email: "",
  subject: "",
  yearsExperience: "",
  about: "",
};

/** Chevron indicator for the native selects, which render `appearance-none`. */
function SelectChevron() {
  return (
    <span className="pointer-events-none absolute right-[15px] top-1/2 -translate-y-1/2 text-muted">
      <ChevronDownIcon className="h-4 w-4" />
    </span>
  );
}

/**
 * The educator application: name, email, subject, experience, and a short
 * introduction.
 *
 * Submitting creates **no account** — that's the point of the flow. A coordinator
 * reviews the application, and only an approval creates a user and emails an
 * invite to set a password. Until then the applicant has nothing to sign in with
 * and hears back by email.
 */
export function ApplyForm() {
  const [state, formAction] = useActionState(submitApplicationAction, IDLE);
  const [values, setValues] = useState(EMPTY);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLSelectElement>(null);
  const yearsRef = useRef<HTMLSelectElement>(null);
  const aboutRef = useRef<HTMLTextAreaElement>(null);

  const change = (field: FieldName) => (value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const errors = {
    applicantName: fieldError(state, "applicantName"),
    email: fieldError(state, "email"),
    subject: fieldError(state, "subject"),
    yearsExperience: fieldError(state, "yearsExperience"),
    about: fieldError(state, "about"),
  } satisfies Record<FieldName, string | undefined>;

  /** Focus the first field the server rejected, in visual order. */
  useEffect(() => {
    if (state.status !== "error") return;
    if (errors.applicantName) nameRef.current?.focus();
    else if (errors.email) emailRef.current?.focus();
    else if (errors.subject) subjectRef.current?.focus();
    else if (errors.yearsExperience) yearsRef.current?.focus();
    else if (errors.about) aboutRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed on the action result
  }, [state]);

  const fieldClass = (field: FieldName, extra?: string) =>
    cn(APPLY_FIELD, extra, errors[field] ? APPLY_FIELD_ERROR : APPLY_FIELD_REST);

  const describedBy = (field: FieldName, id: string) =>
    errors[field] ? `${id}-error` : undefined;

  if (state.status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className={cn(CARD, styles.successFade, "px-8 py-10 text-center")}
      >
        <div className="mx-auto mb-[22px] flex h-[72px] w-[72px] items-center justify-center rounded-full border border-[rgba(46,58,115,0.18)] bg-[var(--chip-a)] text-slate">
          <CheckIcon className="h-[34px] w-[34px]" />
        </div>
        <h3 className="mb-3 font-serif text-[26px] font-semibold tracking-[-0.01em]">
          Thanks for applying
        </h3>
        <p className="mx-auto max-w-[42ch] text-[15px] leading-[1.65] text-muted">
          {state.message ??
            "We've got your application and we'll be in touch by email."}{" "}
          Our team reviews your credentials and runs a background check before your
          profile is listed, so this takes a few days. There&rsquo;s no account to
          sign in to yet — we&rsquo;ll email you either way.
        </p>
      </div>
    );
  }

  const alert = formMessage(state);
  const hasFieldError = Object.values(errors).some(Boolean);

  return (
    <form action={formAction} noValidate className={CARD}>
      {alert && !hasFieldError ? (
        <p
          role="alert"
          className="mb-5 rounded-[11px] border-[1.5px] border-[rgba(178,59,59,0.35)] bg-[#fdf3f2] px-4 py-3 text-[13.5px] leading-[1.5] text-[#b23b3b]"
        >
          {alert}
        </p>
      ) : null}

      <FieldRow
        id="applicantName"
        label="Full name"
        error={errors.applicantName}
        className="mb-5"
      >
        <input
          id="applicantName"
          ref={nameRef}
          name="applicantName"
          type="text"
          autoComplete="name"
          placeholder="Your full name"
          value={values.applicantName}
          onChange={(event) => change("applicantName")(event.target.value)}
          aria-invalid={errors.applicantName ? true : undefined}
          aria-describedby={describedBy("applicantName", "applicantName")}
          className={fieldClass("applicantName")}
        />
      </FieldRow>

      <FieldRow id="email" label="Email" error={errors.email} className="mb-5">
        <input
          id="email"
          ref={emailRef}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={(event) => change("email")(event.target.value)}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={describedBy("email", "email")}
          className={fieldClass("email")}
        />
      </FieldRow>

      <div className="mb-5 grid grid-cols-2 gap-[18px] max-[560px]:grid-cols-1 max-[560px]:gap-5">
        <FieldRow id="subject" label="Subject you teach" error={errors.subject}>
          <div className="relative">
            <select
              id="subject"
              ref={subjectRef}
              name="subject"
              value={values.subject}
              onChange={(event) => change("subject")(event.target.value)}
              aria-invalid={errors.subject ? true : undefined}
              aria-describedby={describedBy("subject", "subject")}
              className={fieldClass("subject", "appearance-none pr-[42px]")}
            >
              <option value="">Select a subject</option>
              {APPLY_SUBJECTS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <SelectChevron />
          </div>
        </FieldRow>

        <FieldRow
          id="yearsExperience"
          label="Years of experience"
          error={errors.yearsExperience}
        >
          <div className="relative">
            <select
              id="yearsExperience"
              ref={yearsRef}
              name="yearsExperience"
              value={values.yearsExperience}
              onChange={(event) => change("yearsExperience")(event.target.value)}
              aria-invalid={errors.yearsExperience ? true : undefined}
              aria-describedby={describedBy("yearsExperience", "yearsExperience")}
              className={fieldClass("yearsExperience", "appearance-none pr-[42px]")}
            >
              <option value="">Select</option>
              {APPLY_EXPERIENCE.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <SelectChevron />
          </div>
        </FieldRow>
      </div>

      <FieldRow id="about" label="About you" error={errors.about} className="mb-5">
        <textarea
          id="about"
          ref={aboutRef}
          name="about"
          placeholder="A few sentences about your background, how you like to teach, and the learners you work with best."
          value={values.about}
          onChange={(event) => change("about")(event.target.value)}
          aria-invalid={errors.about ? true : undefined}
          aria-describedby={describedBy("about", "about")}
          className={fieldClass("about", "min-h-[120px] resize-y leading-[1.55]")}
        />
      </FieldRow>

      <ApplySubmitButton />

      <p className="mt-4 text-[12.5px] leading-[1.55] text-muted">
        Every educator&rsquo;s credentials are reviewed and a background check is run
        before their profile is listed. Applying doesn&rsquo;t create an account —
        we&rsquo;ll email you an invite if you&rsquo;re approved.
      </p>
    </form>
  );
}

/**
 * A separate component because `useFormStatus` reports the pending state of the
 * form *above* it — calling it inside `ApplyForm` itself would always read false.
 */
function ApplySubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="primary"
      disabled={pending}
      aria-busy={pending}
      className="mt-2 disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:tracking-[0.01em] disabled:hover:shadow-none"
    >
      {pending ? "Sending…" : "Submit Application"}
    </Button>
  );
}
