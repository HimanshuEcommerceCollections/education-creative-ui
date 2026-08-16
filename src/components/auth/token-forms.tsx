"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";

import { PASSWORD_MIN_LENGTH } from "@contracts/auth.ts";
import type { UserRole } from "@contracts/roles.ts";

import {
  acceptInviteAction,
  forgotPasswordAction,
  resendVerificationAction,
  resetPasswordAction,
  verifyEmailAction,
} from "@/app/(auth)/actions";
import { IDLE, fieldError, formMessage } from "@/lib/auth/form-state";
import { cn } from "@/lib/utils";

import { AuthNotice } from "./auth-notice";
import { FormAlert } from "./form-alert";
import { PasswordField } from "./password-field";
import { StudyBuddy, type BuddyState } from "./study-buddy";
import { SubmitButton } from "./submit-button";
import { TextField } from "./text-field";

// ---------------------------------------------------------------------------
// Forgot password
// ---------------------------------------------------------------------------

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(forgotPasswordAction, IDLE);
  const [email, setEmail] = useState("");

  if (state.status === "success") {
    return (
      <AuthNotice
        title="Check your inbox"
        // The API replies identically whether or not the address exists, so this
        // copy must not imply the account was found.
        message={state.message ?? "If that email has an account, a reset link is on its way."}
        action={{ label: "Back to sign in", href: "/login" }}
      />
    );
  }

  return (
    <div className="w-full max-w-[400px]">
      <h1 className="text-center font-serif text-[28px] font-semibold tracking-[-0.01em]">
        Reset your password
      </h1>
      <p className="mb-[26px] mt-2 text-center text-[13.5px] text-muted">
        We&rsquo;ll email you a link to choose a new one.
      </p>

      <FormAlert message={fieldError(state, "email") ? undefined : formMessage(state)} />

      {/*
        The one code with a real instruction attached: asking again immediately
        will fail again, and nothing else on this form says so.
      */}
      {state.status === "error" && state.code === "rate_limited" ? (
        <p className="mb-4 rounded-[12px] border-[1.5px] border-[rgba(210,162,65,0.45)] bg-[rgba(210,162,65,0.09)] px-4 py-3 text-[13px] leading-[1.55] text-ink">
          Give it a minute before trying again — and check your spam folder in the
          meantime, in case an earlier link already arrived.
        </p>
      ) : null}

      <form action={formAction} noValidate>
        <TextField
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          error={fieldError(state, "email")}
        />
        <div className="mt-2">
          <SubmitButton pendingLabel="Sending…">Email me a link</SubmitButton>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/login" className="font-semibold text-slate transition-colors hover:text-gold">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Reset password
// ---------------------------------------------------------------------------

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [state, formAction] = useActionState(resetPasswordAction, IDLE);
  const [password, setPassword] = useState("");
  const [pwFocused, setPwFocused] = useState(false);
  const [pwVisible, setPwVisible] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);
  const buddy: BuddyState = pwFocused ? (pwVisible ? "peek" : "cover") : "idle";

  useEffect(() => {
    if (state.status !== "success") return;
    const timer = setTimeout(() => router.replace(state.redirectTo), 2000);
    return () => clearTimeout(timer);
  }, [state, router]);

  if (state.status === "success") {
    return (
      <AuthNotice
        title="Password updated"
        message={`${state.message ?? "Your password is updated."} You've been signed out everywhere else, so sign in again with the new one.`}
        action={{ label: "Sign in", href: "/login" }}
      />
    );
  }

  // An expired or already-used link is terminal — offer a fresh one rather than
  // leaving them retyping a password against a dead token.
  if (state.status === "error" && (state.code === "token_expired" || state.code === "invalid_token")) {
    return (
      <AuthNotice
        title="That link has expired"
        message={state.message}
        tone="error"
        action={{ label: "Request a new link", href: "/forgot-password" }}
      />
    );
  }

  return (
    <div className="w-full max-w-[400px]">
      <StudyBuddy state={buddy} size={84} />

      <h1 className="text-center font-serif text-[28px] font-semibold tracking-[-0.01em]">
        Choose a new password
      </h1>
      <p className="mb-[26px] mt-2 text-center text-[13.5px] text-muted">
        This signs you out on every device.
      </p>

      <FormAlert message={fieldError(state, "password") ? undefined : formMessage(state)} />

      <form action={formAction} noValidate>
        <input type="hidden" name="token" value={token} />
        <PasswordField
          id="password"
          label="New password"
          placeholder="Create a password"
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
          error={fieldError(state, "password")}
          hint={`At least ${PASSWORD_MIN_LENGTH} characters.`}
          inputRef={passwordRef}
          onFocusChange={setPwFocused}
          onVisibleChange={setPwVisible}
        />
        <div className="mt-2">
          <SubmitButton pendingLabel="Updating…">Update password</SubmitButton>
        </div>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Verify email
// ---------------------------------------------------------------------------

/**
 * The confirm-my-email button, and every way it can end.
 *
 * `signedIn` is the whole reason this takes a prop: the same link gets clicked on
 * the laptop that signed up and on a phone that never has, and the two need
 * different exits. Sending a signed-out visitor to `/account` sent them to a login
 * form with no word about the confirmation that had just succeeded.
 */
export function VerifyEmailForm({
  token,
  signedIn,
}: {
  token: string;
  signedIn: boolean;
}) {
  const [state, formAction] = useActionState(verifyEmailAction, IDLE);

  if (state.status === "success") {
    return (
      <AuthNotice
        title="Email confirmed"
        message={
          signedIn
            ? "Thanks — that's everything we needed. You can request a session whenever you're ready."
            : "Thanks — that's everything we needed. Sign in on this device whenever you'd like to request a session."
        }
        action={
          signedIn
            ? { label: "Go to my account", href: "/account" }
            : { label: "Sign in", href: "/login?next=%2Faccount" }
        }
      />
    );
  }

  /*
   * A dead token is the common failure and the only one with a real remedy, so it
   * gets the resend form rather than a link into a section this visitor may not be
   * able to reach.
   */
  if (
    state.status === "error" &&
    (state.code === "token_expired" || state.code === "invalid_token")
  ) {
    return (
      <ResendVerificationForm
        title="That link has expired"
        body={state.message}
        signedIn={signedIn}
      />
    );
  }

  if (state.status === "error") {
    return (
      <AuthNotice
        title="We couldn't confirm that"
        message={state.message}
        tone="error"
        action={
          signedIn
            ? { label: "Go to my account", href: "/account" }
            : { label: "Get help", href: "/support" }
        }
      />
    );
  }

  return (
    <div className="w-full max-w-[400px] text-center">
      <h1 className="font-serif text-[28px] font-semibold tracking-[-0.01em]">
        Confirm your email
      </h1>
      <p className="mx-auto mb-[26px] mt-2 max-w-[34ch] text-[13.5px] leading-[1.6] text-muted">
        One tap and you&rsquo;re done.
      </p>

      {/*
        A button rather than confirming on page load: the token is single-use, and
        mail clients and security scanners prefetch links — doing this during
        render would spend the token before the recipient ever clicked.
      */}
      <form action={formAction}>
        <input type="hidden" name="token" value={token} />
        <SubmitButton pendingLabel="Confirming…">Confirm my email</SubmitButton>
      </form>
    </div>
  );
}

/**
 * Ask for a fresh confirmation link **without being signed in**.
 *
 * The gap this closes: an expired confirmation link left its owner with a page
 * whose only exit was `/account`, which for a signed-out visitor meant a login
 * form and no way to get another link. `POST /auth/resend-verification` is public
 * and non-enumerating precisely so this form can exist, and the copy below has to
 * hold that line — the reply is the same whether or not the address has an account
 * waiting, and it must not be written as if it confirmed one.
 */
export function ResendVerificationForm({
  title,
  body,
  signedIn,
  /** Pre-filled when we already know it, so nobody retypes their own address. */
  knownEmail,
}: {
  title: string;
  body: string;
  signedIn: boolean;
  knownEmail?: string;
}) {
  const [state, formAction] = useActionState(resendVerificationAction, IDLE);
  const [email, setEmail] = useState(knownEmail ?? "");

  if (state.status === "success") {
    return (
      <AuthNotice
        title="Check your inbox"
        message={
          state.message ??
          "If that address is waiting to be confirmed, a new link is on its way. It's good for 24 hours."
        }
        action={
          signedIn
            ? { label: "Go to my account", href: "/account" }
            : { label: "Back to sign in", href: "/login" }
        }
      />
    );
  }

  return (
    <div className="w-full max-w-[400px] text-center">
      <div className="mx-auto mb-[22px] flex h-[72px] w-[72px] items-center justify-center rounded-full border-[1.5px] border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.07)] text-[26px] font-semibold text-[#a63a30]">
        !
      </div>

      <h1 className="font-serif text-[26px] font-semibold tracking-[-0.01em]">{title}</h1>
      <p className="mx-auto mt-[10px] max-w-[38ch] text-[14.5px] leading-[1.6] text-muted">
        {body}
      </p>

      <div className="mt-6 text-left">
        <FormAlert message={fieldError(state, "email") ? undefined : formMessage(state)} />

        <form action={formAction} noValidate>
          <TextField
            id="resend-email"
            label="Your email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={setEmail}
            error={fieldError(state, "email")}
          />
          <div className="mt-2">
            <SubmitButton pendingLabel="Sending…">Send me a new link</SubmitButton>
          </div>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        <Link
          href={signedIn ? "/account" : "/login"}
          className="font-semibold text-slate transition-colors hover:text-gold"
        >
          {signedIn ? "Back to my account" : "Back to sign in"}
        </Link>
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Invite acceptance — educators and staff
// ---------------------------------------------------------------------------

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "administrator",
  coordinator: "coordinator",
  educator: "educator",
  customer: "parent",
};

export function AcceptInviteForm({
  token,
  fullName,
  email,
  role,
}: {
  token: string;
  fullName: string;
  email: string;
  role: UserRole;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(acceptInviteAction, IDLE);
  const [password, setPassword] = useState("");
  const [pwFocused, setPwFocused] = useState(false);
  const [pwVisible, setPwVisible] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);
  const buddy: BuddyState = pwFocused ? (pwVisible ? "peek" : "cover") : "idle";

  useEffect(() => {
    if (state.status !== "success") return;
    const timer = setTimeout(() => router.replace(state.redirectTo), 1200);
    return () => clearTimeout(timer);
  }, [state, router]);

  if (state.status === "success") {
    return (
      <AuthNotice
        title="You're all set"
        message="Signing you in…"
        action={{ label: "Continue", href: state.redirectTo }}
      />
    );
  }

  /*
   * The token can die between this page rendering and the form being submitted —
   * invites are single-use and expire. Terminal, and with no self-service remedy:
   * re-issuing an invite is an admin action, so support is the only honest exit.
   */
  if (
    state.status === "error" &&
    (state.code === "token_expired" || state.code === "invalid_token")
  ) {
    return (
      <AuthNotice
        title="This invite has expired"
        message={`${state.message} Only an administrator can issue a new one — get in touch and we'll have a fresh link sent to ${email}.`}
        tone="error"
        action={{ label: "Get help", href: "/support" }}
      />
    );
  }

  const attestError = fieldError(state, "attestAdult");
  const passwordError = fieldError(state, "password");

  return (
    <div className="w-full max-w-[400px]">
      <StudyBuddy state={buddy} size={84} />

      <h1 className="text-center font-serif text-[26px] font-semibold tracking-[-0.01em]">
        Welcome, {fullName.split(" ")[0]}
      </h1>
      <p className="mb-[22px] mt-2 text-center text-[13.5px] leading-[1.55] text-muted">
        Set a password to activate your {ROLE_LABELS[role]} account for{" "}
        <b className="font-semibold text-ink">{email}</b>.
      </p>

      <FormAlert message={passwordError || attestError ? undefined : formMessage(state)} />

      <form action={formAction} noValidate>
        <input type="hidden" name="token" value={token} />
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

        {/*
          These accounts never passed through the signup form, so the adult
          attestation is captured here instead.
        */}
        <label
          className={cn(
            "my-1 mb-5 flex cursor-pointer select-none items-start gap-[10px] text-[13px] leading-[1.5]",
            attestError ? "text-[#c2483c]" : "text-muted",
          )}
        >
          <input
            type="checkbox"
            name="attestAdult"
            className="mt-[2px] h-[17px] w-[17px] shrink-0 accent-slate"
          />
          I confirm I&rsquo;m over 18.
        </label>
        {attestError ? (
          <p className="mb-3 text-[12.5px] text-[#c2483c]">{attestError}</p>
        ) : null}

        <SubmitButton pendingLabel="Activating…">Activate my account</SubmitButton>
      </form>
    </div>
  );
}
