"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { SOCIAL_PROVIDERS } from "@/data/auth";

import { SOCIAL_ICONS } from "./auth-icons";
import { AuthSuccess } from "./auth-success";
import { Confetti, createConfettiPieces, type ConfettiPiece } from "./confetti";
import { PasswordField } from "./password-field";
import { StudyBuddy, type BuddyState } from "./study-buddy";
import { TextField } from "./text-field";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

interface Errors {
  email?: boolean;
  password?: boolean;
}

/** Sign-in form panel: fields, social options, and the demo success state. */
export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  const [pwFocused, setPwFocused] = useState(false);
  const [pwVisible, setPwVisible] = useState(false);
  const buddy: BuddyState = pwFocused ? (pwVisible ? "peek" : "cover") : "idle";

  const formRef = useRef<HTMLFormElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const next: Errors = {
      email: !EMAIL_RE.test(email.trim()),
      password: password.length < 1,
    };
    setErrors(next);
    if (next.email) return emailRef.current?.focus();
    if (next.password) return passwordRef.current?.focus();
    setSubmitted(true);
    setConfetti(createConfettiPieces());
  }

  function reset() {
    setSubmitted(false);
    setConfetti([]);
  }

  return (
    <>
      <div className="w-full max-w-[400px]">
        <StudyBuddy state={buddy} size={96} />

        <h1 className="text-center font-serif text-[30px] font-semibold tracking-[-0.01em]">
          Sign in
        </h1>
        <p className="mb-[30px] mt-2 text-center text-[13.5px] text-muted">
          <b className="font-bold text-slate">Parent &amp; guardian accounts only.</b>
        </p>

        <form ref={formRef} onSubmit={handleSubmit} noValidate>
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
            placeholder="Your password"
            autoComplete="current-password"
            value={password}
            onChange={setPassword}
            error={errors.password}
            inputRef={passwordRef}
            onFocusChange={setPwFocused}
            onVisibleChange={setPwVisible}
          />

          <div className="mb-[22px] mt-1 flex items-center justify-between text-[13px]">
            <label className="flex cursor-pointer select-none items-center gap-2 text-muted">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
                className="h-4 w-4 accent-slate"
              />
              Remember me
            </label>
            <a
              href="#"
              onClick={(event) => event.preventDefault()}
              className="font-semibold text-slate transition-colors hover:text-gold"
            >
              Forgot password?
            </a>
          </div>

          <Button type="submit" variant="primary" className="w-full">
            Sign in
          </Button>
        </form>

        <div className="my-6 flex items-center gap-[14px] text-[12px] text-muted">
          <span className="h-px flex-1 bg-line" />
          or continue with
          <span className="h-px flex-1 bg-line" />
        </div>

        <div className="flex gap-3">
          {SOCIAL_PROVIDERS.map((provider) => {
            const Icon = SOCIAL_ICONS[provider.icon];
            return (
              <button
                key={provider.label}
                type="button"
                onClick={() => formRef.current?.requestSubmit()}
                className="flex flex-1 items-center justify-center gap-2 rounded-[12px] border-[1.5px] border-line bg-white py-3 text-[13.5px] font-semibold text-ink transition-[transform,background-color,border-color] duration-200 hover:-translate-y-[2px] hover:border-[rgba(var(--slate-rgb),0.4)] hover:bg-[rgba(var(--slate-rgb),0.04)]"
              >
                <Icon className="h-[17px] w-[17px]" />
                {provider.label}
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
        show={submitted}
        title="You&rsquo;re signed in!"
        message="This is a demo, so nothing was actually submitted — but that's exactly how it would feel."
        againLabel="Back to sign in"
        onAgain={reset}
      />
      <Confetti pieces={confetti} />
    </>
  );
}
