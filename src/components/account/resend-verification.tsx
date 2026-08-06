"use client";

import { useActionState } from "react";

import { resendVerificationAction } from "@/app/(auth)/actions";
import { IDLE, formMessage } from "@/lib/auth/form-state";

import { SubmitButton } from "@/components/auth/submit-button";

/**
 * Banner offering a fresh confirmation email. Shown only while the address is
 * unverified — verification gates the first booking, not signing in, so this is a
 * nudge rather than a blocker.
 */
export function ResendVerification({ email }: { email: string }) {
  const [state, formAction] = useActionState(resendVerificationAction, IDLE);

  if (state.status === "success") {
    return (
      <p
        role="status"
        className="rounded-[14px] border-[1.5px] border-[rgba(46,58,115,0.25)] bg-[rgba(var(--slate-rgb),0.05)] px-4 py-[14px] text-[13.5px] leading-[1.55] text-slate"
      >
        {state.message ?? "A new confirmation link is on its way."}
      </p>
    );
  }

  return (
    <div className="rounded-[14px] border-[1.5px] border-[rgba(210,162,65,0.45)] bg-[rgba(210,162,65,0.09)] px-4 py-[14px]">
      <p className="text-[13.5px] leading-[1.55] text-ink">
        <b className="font-bold">Confirm your email to book.</b> We sent a link to{" "}
        {email}.
      </p>
      {state.status === "error" ? (
        <p role="alert" className="mt-2 text-[12.5px] text-[#a63a30]">
          {formMessage(state)}
        </p>
      ) : null}
      <form action={formAction} className="mt-3 max-w-[240px]">
        <input type="hidden" name="email" value={email} />
        <SubmitButton pendingLabel="Sending…" className="min-h-[44px] px-5 text-[13.5px]">
          Send it again
        </SubmitButton>
      </form>
    </div>
  );
}
