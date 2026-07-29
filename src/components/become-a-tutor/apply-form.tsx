"use client";

import { useRef, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { APPLY_EXPERIENCE, APPLY_SUBJECTS } from "@/data/become-a-tutor";
import { cn } from "@/lib/utils";

import { APPLY_FIELD, APPLY_FIELD_ERROR, APPLY_FIELD_REST, FieldRow } from "./apply-field";
import styles from "./apply-form.module.css";
import { CheckIcon, ChevronDownIcon } from "./become-icons";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const CARD =
  "rounded-[22px] border border-line bg-white px-10 pb-9 pt-10 " +
  "shadow-[0_34px_70px_-44px_rgba(35,40,70,0.4)] max-[560px]:px-6 max-[560px]:py-[30px]";

type FieldName = "name" | "email" | "subject" | "years" | "about";

type Errors = Partial<Record<FieldName, boolean>>;

const EMPTY = { name: "", email: "", subject: "", years: "", about: "" };

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
 * introduction, with inline validation and a confirmation panel. This is a demo
 * — submitting stores and sends nothing, it just swaps in the confirmation.
 */
export function ApplyForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLSelectElement>(null);
  const yearsRef = useRef<HTMLSelectElement>(null);
  const aboutRef = useRef<HTMLTextAreaElement>(null);

  /** Update one field and clear its error, matching the source's live clearing. */
  const change = (field: FieldName) => (value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: false } : prev));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Errors = {
      name: !values.name.trim(),
      email: !EMAIL_RE.test(values.email.trim()),
      subject: !values.subject,
      years: !values.years,
      about: !values.about.trim(),
    };
    setErrors(next);

    if (next.name) return nameRef.current?.focus();
    if (next.email) return emailRef.current?.focus();
    if (next.subject) return subjectRef.current?.focus();
    if (next.years) return yearsRef.current?.focus();
    if (next.about) return aboutRef.current?.focus();

    setSubmitted(true);
  };

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setSubmitted(false);
  };

  const fieldClass = (field: FieldName, extra?: string) =>
    cn(APPLY_FIELD, extra, errors[field] ? APPLY_FIELD_ERROR : APPLY_FIELD_REST);

  const describedBy = (field: FieldName, id: string) =>
    errors[field] ? `${id}-error` : undefined;

  if (submitted) {
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
          This is a demo, so nothing was actually submitted. On the live site, our team would review
          your credentials and references before your profile is listed.
        </p>
        <Button type="button" variant="outline" onClick={reset} className="mt-[22px]">
          Submit another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={CARD}>
      <FieldRow
        id="apply-name"
        label="Full name"
        error="Please enter your name."
        invalid={Boolean(errors.name)}
        className="mb-5"
      >
        <input
          id="apply-name"
          ref={nameRef}
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Your full name"
          value={values.name}
          onChange={(event) => change("name")(event.target.value)}
          aria-invalid={errors.name || undefined}
          aria-describedby={describedBy("name", "apply-name")}
          className={fieldClass("name")}
        />
      </FieldRow>

      <FieldRow
        id="apply-email"
        label="Email"
        error="Please enter a valid email address."
        invalid={Boolean(errors.email)}
        className="mb-5"
      >
        <input
          id="apply-email"
          ref={emailRef}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={(event) => change("email")(event.target.value)}
          aria-invalid={errors.email || undefined}
          aria-describedby={describedBy("email", "apply-email")}
          className={fieldClass("email")}
        />
      </FieldRow>

      <div className="mb-5 grid grid-cols-2 gap-[18px] max-[560px]:grid-cols-1 max-[560px]:gap-5">
        <FieldRow
          id="apply-subject"
          label="Subject you teach"
          error="Please choose a subject."
          invalid={Boolean(errors.subject)}
        >
          <div className="relative">
            <select
              id="apply-subject"
              ref={subjectRef}
              name="subject"
              value={values.subject}
              onChange={(event) => change("subject")(event.target.value)}
              aria-invalid={errors.subject || undefined}
              aria-describedby={describedBy("subject", "apply-subject")}
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
          id="apply-years"
          label="Years of experience"
          error="Please select your experience."
          invalid={Boolean(errors.years)}
        >
          <div className="relative">
            <select
              id="apply-years"
              ref={yearsRef}
              name="years"
              value={values.years}
              onChange={(event) => change("years")(event.target.value)}
              aria-invalid={errors.years || undefined}
              aria-describedby={describedBy("years", "apply-years")}
              className={fieldClass("years", "appearance-none pr-[42px]")}
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

      <FieldRow
        id="apply-about"
        label="About you"
        error="Please tell us a little about yourself."
        invalid={Boolean(errors.about)}
        className="mb-5"
      >
        <textarea
          id="apply-about"
          ref={aboutRef}
          name="about"
          placeholder="A few sentences about your background, how you like to teach, and the learners you work with best."
          value={values.about}
          onChange={(event) => change("about")(event.target.value)}
          aria-invalid={errors.about || undefined}
          aria-describedby={describedBy("about", "apply-about")}
          className={fieldClass("about", "min-h-[120px] resize-y leading-[1.55]")}
        />
      </FieldRow>

      <Button type="submit" variant="primary" className="mt-2">
        Submit Application
      </Button>

      <p className="mt-4 text-[12.5px] leading-[1.55] text-muted">
        Every educator&rsquo;s credentials are reviewed before their profile is listed. This is a
        demo form &mdash; no data is stored or transmitted.
      </p>
    </form>
  );
}
