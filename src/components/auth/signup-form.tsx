"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";

import { PASSWORD_MIN_LENGTH } from "@contracts/auth.ts";
import { CURRENT_SIGNUP_CONSENT_TEXT } from "@contracts/consent.ts";

import { signupAction } from "@/app/(auth)/actions";
import { IDLE, fieldError, formMessage } from "@/lib/auth/form-state";
import { cn } from "@/lib/utils";

import { AuthSuccess } from "./auth-success";
import { Confetti } from "./confetti";
import { FormAlert } from "./form-alert";
import { PasswordField } from "./password-field";
import { StudyBuddy, type BuddyState } from "./study-buddy";
import { SubjectChips } from "./subject-chips";
import { SubmitButton } from "./submit-button";
import { TextField } from "./text-field";

const SUCCESS_DWELL_MS = 1800;

/** Create-account form panel: details, optional subjects, guardian consent. */
export function SignupForm() {
  const router = useRouter();
  const [state, formAction] = useActionState(signupAction, IDLE);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [pwFocused, setPwFocused] = useState(false);
  const [pwVisible, setPwVisible] = useState(false);
  const buddy: BuddyState = pwFocused ? (pwVisible ? "peek" : "cover") : "idle";

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);

  const succeeded = state.status === "success";

  useEffect(() => {
    if (state.status !== "success") return;

    const timer = setTimeout(() => router.replace(state.redirectTo), SUCCESS_DWELL_MS);
    return () => clearTimeout(timer);
  }, [state, router]);

  useEffect(() => {
    if (state.status !== "error") return;
    const errors = state.fieldErrors;
    if (errors?.fullName) nameRef.current?.focus();
    else if (errors?.email) emailRef.current?.focus();
    else if (errors?.password) passwordRef.current?.focus();
    else if (errors?.consentGiven) consentRef.current?.focus();
  }, [state]);

  const nameError = fieldError(state, "fullName");
  const emailError = fieldError(state, "email");
  const passwordError = fieldError(state, "password");
  const consentError = fieldError(state, "consentGiven");
  const hasFieldError = Boolean(nameError || emailError || passwordError || consentError);
  const alert = hasFieldError ? undefined : formMessage(state);

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

        <FormAlert message={alert} />

        <form action={formAction} noValidate>
          <TextField
            id="fullName"
            label="Parent / guardian name"
            placeholder="Your name"
            autoComplete="name"
            value={fullName}
            onChange={setFullName}
            error={nameError}
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
            error={emailError}
            inputRef={emailRef}
          />
          <PasswordField
            id="password"
            label="Password"
            placeholder="Create a password"
            autoComplete="new-password"
            value={password}
            onChange={setPassword}
            error={passwordError}
            hint={`At least ${PASSWORD_MIN_LENGTH} characters.`}
            inputRef={passwordRef}
            onFocusChange={setPwFocused}
            onVisibleChange={setPwVisible}
          />

          <SubjectChips />

          {/*
            The guardian consent gate. The server hashes its own canonical copy of
            this text — never the string posted from here — and writes the consent
            record in the same transaction as the account, so an account cannot
            exist without it.
          */}
          <label
            className={cn(
              "my-1 flex cursor-pointer select-none items-start gap-[10px] text-[13px] leading-[1.5]",
              consentError ? "text-[#c2483c]" : "text-muted",
            )}
          >
            <input
              ref={consentRef}
              type="checkbox"
              name="consentGiven"
              aria-invalid={consentError ? true : undefined}
              aria-describedby={consentError ? "consent-error" : undefined}
              className="mt-[2px] h-[17px] w-[17px] shrink-0 accent-slate"
            />
            {CURRENT_SIGNUP_CONSENT_TEXT}
          </label>
          {consentError ? (
            <p id="consent-error" className="mb-1 mt-[6px] text-[12.5px] text-[#c2483c]">
              {consentError}
            </p>
          ) : null}

          <div className="mt-5">
            <SubmitButton pendingLabel="Creating your account…">
              Create account
            </SubmitButton>
          </div>
        </form>

        <p className="mt-[22px] text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-slate transition-colors hover:text-gold">
            Sign in
          </Link>
        </p>
      </div>

      <AuthSuccess
        show={succeeded}
        title="Welcome aboard!"
        message="Your account is ready — check your inbox to confirm your email address."
      />
      <Confetti show={succeeded} />
    </>
  );
}
