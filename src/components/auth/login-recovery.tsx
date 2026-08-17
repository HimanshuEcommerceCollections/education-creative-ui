"use client";

import Link from "next/link";
import { useActionState } from "react";

import { resendVerificationAction } from "@/app/(auth)/actions";
import { IDLE, formMessage, type AuthFormState } from "@/lib/auth/form-state";

import { SubmitButton } from "./submit-button";

/**
 * What to *do* about a failed sign-in.
 *
 * `AuthFormState.code` exists so a form can offer recovery rather than restate
 * the problem, and for a long time only the reset-password form used it — an
 * unverified parent, a locked-out coordinator and an invited educator all got the
 * same bare sentence and no way forward. This renders the affordance that actually
 * matches the code, and nothing where there genuinely isn't one.
 */
export function LoginRecovery({
  state,
  email,
}: {
  state: AuthFormState;
  /** Whatever they typed, so a resend doesn't ask for it twice. */
  email: string;
}) {
  if (state.status !== "error") return null;

  switch (state.code) {
    case "email_not_verified":
      return <ResendVerificationPanel email={email} />;

    case "account_locked":
      return (
        <RecoveryPanel
          title="Locked for a few minutes"
          body="Too many attempts in a row. You can wait it out — or reset your password now, which clears the lock and lets you straight back in."
        >
          <Link
            href="/forgot-password"
            className="inline-flex rounded-[40px] border-[1.5px] border-transparent bg-slate px-5 py-[10px] text-[13px] font-semibold text-white no-underline transition-colors hover:bg-slate-deep"
          >
            Reset my password
          </Link>
        </RecoveryPanel>
      );

    case "account_inactive":
      /*
       * Two shapes reach here — an invite that was never accepted, and an account
       * suspended or deactivated by an admin — and neither has a self-service
       * path. Re-sending an invite is an admin action, so promising a link they
       * could request themselves would be a dead end. Support is the honest route.
       */
      return (
        <RecoveryPanel
          title="This account can't sign in yet"
          body="If you were invited, the set-up link in your email is the only way in — we can't re-send it from this page. Ask us and we'll have an administrator issue a fresh one."
        >
          <Link
            href="/support"
            className="inline-flex rounded-[40px] border-[1.5px] border-transparent bg-slate px-5 py-[10px] text-[13px] font-semibold text-white no-underline transition-colors hover:bg-slate-deep"
          >
            Contact support
          </Link>
        </RecoveryPanel>
      );

    case "rate_limited":
      return (
        <RecoveryPanel
          title="Too many tries just now"
          body="Give it a minute and try again. If you've forgotten the password, resetting it is quicker than guessing."
        >
          <Link
            href="/forgot-password"
            className="inline-flex rounded-[40px] border-[1.5px] border-line bg-white px-5 py-[10px] text-[13px] font-semibold text-ink no-underline transition-colors hover:border-slate hover:bg-[rgba(var(--slate-rgb),0.05)]"
          >
            Reset my password
          </Link>
        </RecoveryPanel>
      );

    default:
      // `invalid_credentials`, `validation_failed`: the message and the inline
      // field errors are the whole story, and a CTA here would just be noise.
      return null;
  }
}

function RecoveryPanel({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5 rounded-[14px] border-[1.5px] border-[rgba(46,58,115,0.25)] bg-[rgba(var(--slate-rgb),0.05)] px-4 py-[14px]">
      <p className="text-[12px] font-bold uppercase tracking-[0.07em] text-slate">{title}</p>
      <p className="mt-[6px] text-[13.5px] leading-[1.55] text-ink">{body}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

/**
 * A fresh confirmation link, from the sign-in page.
 *
 * `POST /auth/resend-verification` is public and deliberately non-enumerating, so
 * this can be offered before anyone is signed in — and the reply is the same
 * whether or not the address needed one.
 */
function ResendVerificationPanel({ email }: { email: string }) {
  const [state, formAction] = useActionState(resendVerificationAction, IDLE);

  if (state.status === "success") {
    return (
      <p
        role="status"
        className="mb-5 rounded-[14px] border-[1.5px] border-[rgba(46,58,115,0.25)] bg-[rgba(var(--slate-rgb),0.05)] px-4 py-[14px] text-[13.5px] leading-[1.55] text-slate"
      >
        {state.message ?? "If that address needs confirming, a new link is on its way."}
      </p>
    );
  }

  return (
    <div className="mb-5 rounded-[14px] border-[1.5px] border-[rgba(210,162,65,0.45)] bg-[rgba(210,162,65,0.09)] px-4 py-[14px]">
      <p className="text-[12px] font-bold uppercase tracking-[0.07em] text-[#7a5a12]">
        Confirm your email first
      </p>
      <p className="mt-[6px] text-[13.5px] leading-[1.55] text-ink">
        We need to know the address is yours before you can book. Lost the link? We&rsquo;ll
        send another.
      </p>
      {state.status === "error" ? (
        <p role="alert" className="mt-2 text-[12.5px] text-[#a63a30]">
          {formMessage(state)}
        </p>
      ) : null}
      <form action={formAction} className="mt-3 max-w-[260px]">
        <input type="hidden" name="email" value={email} />
        <SubmitButton pendingLabel="Sending…" className="min-h-[42px] px-5 text-[13px]">
          Send a new link
        </SubmitButton>
      </form>
    </div>
  );
}
