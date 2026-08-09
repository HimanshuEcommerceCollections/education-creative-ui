"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";

import { loginAction } from "@/app/(auth)/actions";
import { IDLE, fieldError, formMessage } from "@/lib/auth/form-state";

import { SOCIAL_ICONS } from "./auth-icons";
import { AuthSuccess } from "./auth-success";
import { Confetti } from "./confetti";
import { FormAlert } from "./form-alert";
import { PasswordField } from "./password-field";
import { StudyBuddy, type BuddyState } from "./study-buddy";
import { SubmitButton } from "./submit-button";
import { TextField } from "./text-field";

/** How long the confirmation panel shows before navigating. */
const SUCCESS_DWELL_MS = 1400;

/** Sign-in form panel — one entry point for parents, educators, and staff. */
export function LoginForm() {
  const router = useRouter();
  const [state, formAction] = useActionState(loginAction, IDLE);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [pwFocused, setPwFocused] = useState(false);
  const [pwVisible, setPwVisible] = useState(false);
  const buddy: BuddyState = pwFocused ? (pwVisible ? "peek" : "cover") : "idle";

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const succeeded = state.status === "success";

  /**
   * Celebrate, then go where the **server** said to. `redirectTo` is derived from
   * the session's role — customers to the homepage, educators and staff to their
   * dashboards. Nothing here inspects a role to make that choice.
   */
  useEffect(() => {
    if (state.status !== "success") return;

    const timer = setTimeout(() => router.replace(state.redirectTo), SUCCESS_DWELL_MS);
    return () => clearTimeout(timer);
  }, [state, router]);

  /** Put the cursor on whichever field the server complained about. */
  useEffect(() => {
    if (state.status !== "error") return;
    if (state.fieldErrors?.email) emailRef.current?.focus();
    else if (state.fieldErrors?.password) passwordRef.current?.focus();
  }, [state]);

  const emailError = fieldError(state, "email");
  const passwordError = fieldError(state, "password");
  // Field-level messages render under their input; only surface the rest here.
  const alert = emailError || passwordError ? undefined : formMessage(state);

  return (
    <>
      <div className="w-full max-w-[400px]">
        <StudyBuddy state={buddy} size={96} />

        <h1 className="text-center font-serif text-[30px] font-semibold tracking-[-0.01em]">
          Sign in
        </h1>
        <p className="mb-[30px] mt-2 text-center text-[13.5px] text-muted">
          Parents, educators, and staff all sign in here.
        </p>

        <FormAlert message={alert} />

        <form action={formAction} noValidate>
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
            placeholder="Your password"
            autoComplete="current-password"
            value={password}
            onChange={setPassword}
            error={passwordError}
            inputRef={passwordRef}
            onFocusChange={setPwFocused}
            onVisibleChange={setPwVisible}
          />

          <div className="mb-[22px] mt-1 flex items-center justify-between text-[13px]">
            <label className="flex cursor-pointer select-none items-center gap-2 text-muted">
              <input
                type="checkbox"
                name="rememberMe"
                className="h-4 w-4 accent-slate"
              />
              Remember me
            </label>
            <Link
              href="/forgot-password"
              className="font-semibold text-slate transition-colors hover:text-gold"
            >
              Forgot password?
            </Link>
          </div>

          <SubmitButton pendingLabel="Signing in…">Sign in</SubmitButton>
        </form>

        <div className="my-6 flex items-center gap-[14px] text-[12px] text-muted">
          <span className="h-px flex-1 bg-line" />
          or continue with
          <span className="h-px flex-1 bg-line" />
        </div>

        {/*
          Google sign-in is a fast-follow, not wired yet — rendered disabled
          rather than hidden so the option is visibly coming. Facebook is
          deliberately absent: its app review is heavy for a child-adjacent
          product, so it's deferred past launch.
        */}
        <div className="flex gap-3">
          {SOCIAL_PROVIDERS_AT_LAUNCH.map((provider) => {
            const Icon = SOCIAL_ICONS[provider.icon];
            return (
              <button
                key={provider.label}
                type="button"
                disabled
                title="Coming soon"
                className="flex flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-[12px] border-[1.5px] border-line bg-white py-3 text-[13.5px] font-semibold text-muted opacity-60"
              >
                <Icon className="h-[17px] w-[17px]" />
                {provider.label}
                <span className="text-[11px] font-medium">(soon)</span>
              </button>
            );
          })}
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          New here?{" "}
          <Link href="/signup" className="font-semibold text-slate transition-colors hover:text-gold">
            Create an account
          </Link>
        </p>
      </div>

      <AuthSuccess
        show={succeeded}
        title="You&rsquo;re signed in!"
        message="Taking you where you need to be…"
      />
      <Confetti show={succeeded} />
    </>
  );
}

/**
 * Only Google at launch (§4). Kept local rather than in `data/auth.ts` so the
 * deferred-Facebook decision lives next to the code that acts on it.
 */
const SOCIAL_PROVIDERS_AT_LAUNCH = [{ label: "Google", icon: "google" }] as const;
