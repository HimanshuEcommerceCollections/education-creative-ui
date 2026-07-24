"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { SIGNUP_CONSENT } from "@/data/auth";
import { cn } from "@/lib/utils";

import { AuthSuccess } from "./auth-success";
import { Confetti, createConfettiPieces, type ConfettiPiece } from "./confetti";
import { PasswordField } from "./password-field";
import { StudyBuddy, type BuddyState } from "./study-buddy";
import { SubjectChips } from "./subject-chips";
import { TextField } from "./text-field";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

interface Errors {
  name?: boolean;
  email?: boolean;
  password?: boolean;
  consent?: boolean;
}

/** Create-account form panel: details, optional subjects, guardian consent. */
export function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  const [pwFocused, setPwFocused] = useState(false);
  const [pwVisible, setPwVisible] = useState(false);
  const buddy: BuddyState = pwFocused ? (pwVisible ? "peek" : "cover") : "idle";

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const next: Errors = {
      name: name.trim().length < 2,
      email: !EMAIL_RE.test(email.trim()),
      password: password.length < 6,
      consent: !consent,
    };
    setErrors(next);
    if (next.name) return nameRef.current?.focus();
    if (next.email) return emailRef.current?.focus();
    if (next.password) return passwordRef.current?.focus();
    if (next.consent) return consentRef.current?.focus();
    setSubmitted(true);
    setConfetti(createConfettiPieces());
  }

  function reset() {
    setSubmitted(false);
    setConfetti([]);
  }

  return (
    <>
      <div className="w-full max-w-[420px]">
        <StudyBuddy state={buddy} size={84} />

        <h1 className="text-center font-serif text-[28px] font-semibold tracking-[-0.01em]">
          Create your account
        </h1>
        <p className="mb-6 mt-[7px] text-center text-[13.5px] text-muted">
          For parents &amp; guardians — there&rsquo;s no separate child login.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <TextField
            id="name"
            label="Parent / guardian name"
            placeholder="Your name"
            autoComplete="name"
            value={name}
            onChange={setName}
            error={errors.name}
            inputRef={nameRef}
          />
          <TextField
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={setEmail}
            error={errors.email}
            inputRef={emailRef}
          />
          <PasswordField
            id="password"
            label="Password"
            placeholder="Create a password"
            autoComplete="new-password"
            value={password}
            onChange={setPassword}
            error={errors.password}
            inputRef={passwordRef}
            onFocusChange={setPwFocused}
            onVisibleChange={setPwVisible}
          />

          <SubjectChips />

          <label
            className={cn(
              "my-1 mb-5 flex cursor-pointer select-none items-start gap-[10px] text-[13px] leading-[1.5]",
              errors.consent ? "text-[#c2483c]" : "text-muted",
            )}
          >
            <input
              ref={consentRef}
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              className="mt-[2px] h-[17px] w-[17px] shrink-0 accent-slate"
            />
            {SIGNUP_CONSENT}
          </label>

          <Button type="submit" variant="primary" className="w-full">
            Create account
          </Button>
        </form>

        <p className="mt-[22px] text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-slate transition-colors hover:text-gold">
            Sign in
          </Link>
        </p>
      </div>

      <AuthSuccess
        show={submitted}
        title="Welcome aboard!"
        message="This is a demo, so no account was actually created — but your family's journey would start right here."
        againLabel="Back to form"
        onAgain={reset}
      />
      <Confetti pieces={confetti} />
    </>
  );
}
