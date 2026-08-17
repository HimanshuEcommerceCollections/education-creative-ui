"use client";

import Link from "next/link";
import { useActionState } from "react";

import type { ErrorCode } from "@contracts/errors.ts";

import { resendVerificationAction } from "@/app/(auth)/actions";
import { IDLE, formMessage } from "@/lib/auth/form-state";

/**
 * The way out, rendered where the refusal is.
 *
 * Two failures on this page are recoverable in one click and were both dead ends:
 *
 * - **The session expired mid-flow.** The summary card printed "please sign in
 *   before paying" as plain text with no link, on a page still headed "Booking as
 *   Sarah" — so the sentence read as a bug rather than an instruction.
 * - **The address isn't confirmed.** The message pointed at a resend link sitting
 *   in step 5, far above where the error appears, or in an account page the parent
 *   would have to leave the booking for.
 *
 * `AuthFormState.code` exists for exactly this, and `BookingActionState` now
 * carries one too. Nothing here matches on message text.
 *
 * Rendered inside the slate summary card, so its links take that card's gold
 * treatment rather than the light-background one used elsewhere.
 */
export function BookingBlocked({
  code,
  accountEmail,
}: {
  code?: ErrorCode;
  /** The signed-in parent's address. Without it there is nothing to resend to. */
  accountEmail?: string;
}) {
  const [resend, resendAction, resending] = useActionState(resendVerificationAction, IDLE);

  if (code === "unauthenticated") {
    return (
      <p className="mt-2 text-[13px] leading-[1.5]">
        <Link href="/login" className="font-semibold text-gold underline">
          Sign back in
        </Link>{" "}
        or{" "}
        <Link href="/signup" className="font-semibold text-gold underline">
          create an account
        </Link>
        {" "}— this page keeps your educator, subject and time either way.
      </p>
    );
  }

  if (code === "email_not_verified" && accountEmail) {
    if (resend.status === "success") {
      return (
        <p role="status" className="mt-2 text-[13px] leading-[1.5] text-white/80">
          {resend.message ?? `A new confirmation link is on its way to ${accountEmail}.`}
        </p>
      );
    }

    return (
      <form action={resendAction} className="mt-2">
        <input type="hidden" name="email" value={accountEmail} />
        {resend.status === "error" ? (
          <p className="mb-2 text-[12.5px] leading-[1.5] text-white/80">
            {formMessage(resend)}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={resending}
          aria-busy={resending}
          className="cursor-pointer text-[13px] font-semibold text-gold underline disabled:cursor-not-allowed disabled:opacity-60"
        >
          {resending ? "Sending…" : `Send the confirmation email to ${accountEmail} again`}
        </button>
      </form>
    );
  }

  return null;
}
