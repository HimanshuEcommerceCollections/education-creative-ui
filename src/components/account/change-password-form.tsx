"use client";

import { useActionState, useRef, useState } from "react";

import { PASSWORD_MIN_LENGTH } from "@contracts/auth.ts";

import { changePasswordAction } from "@/app/(auth)/actions";
import { FormAlert } from "@/components/auth/form-alert";
import { PasswordField } from "@/components/auth/password-field";
import { SubmitButton } from "@/components/auth/submit-button";
import { SessionExpiredAlert } from "@/components/auth/session-expired-alert";
import { IDLE, fieldError, formMessage, sessionExpired } from "@/lib/auth/form-state";

/**
 * Changing a password from inside the account, current password required.
 *
 * "Change password" on `/account` stays a form and must never become a link to
 * `/forgot-password`: mailing a reset link to someone already signed in who knows
 * their password is a round trip through an inbox they shouldn't need, and it fails
 * outright if their address is unconfirmed.
 *
 * Collapsed until asked for: this card is read most often by people who came to
 * check something else, and three password fields is a lot of form to walk past.
 */
export function ChangePasswordForm() {
  const [state, formAction] = useActionState(changePasswordAction, IDLE);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  // `PasswordField` owns its show/hide toggle and restores focus through this ref.
  const currentRef = useRef<HTMLInputElement>(null);
  const nextRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  const expired = sessionExpired(state);

  if (state.status === "success") {
    return (
      <p
        role="status"
        className="rounded-[14px] border-[1.5px] border-[rgba(45,120,80,0.35)] bg-[rgba(45,120,80,0.07)] px-4 py-[14px] text-[13.5px] leading-[1.55] text-[#256a45]"
      >
        {state.message ?? "Your password is updated."} Every other device has been
        signed out; this one stays signed in.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-[40px] border-[1.5px] border-line bg-white px-[22px] py-[11px] text-[13.5px] font-semibold text-ink transition-colors hover:border-slate hover:bg-[rgba(var(--slate-rgb),0.05)]"
      >
        Change password
      </button>
    );
  }

  const currentError = fieldError(state, "currentPassword");
  const nextError = fieldError(state, "newPassword");
  const confirmError = fieldError(state, "confirmPassword");

  return (
    <div className="max-w-[400px]">
      {expired ? (
        <SessionExpiredAlert className="mb-4 rounded-[14px] border-[1.5px] border-[rgba(210,162,65,0.55)] bg-[rgba(210,162,65,0.12)] px-[16px] py-[14px]" />
      ) : (
        <FormAlert
          message={currentError || nextError || confirmError ? undefined : formMessage(state)}
        />
      )}

      <form action={formAction} noValidate>
        <PasswordField
          id="currentPassword"
          label="Current password"
          placeholder="The one you use now"
          autoComplete="current-password"
          value={current}
          onChange={setCurrent}
          error={currentError}
          inputRef={currentRef}
        />
        <PasswordField
          id="newPassword"
          label="New password"
          placeholder="Create a password"
          autoComplete="new-password"
          value={next}
          onChange={setNext}
          error={nextError}
          hint={`At least ${PASSWORD_MIN_LENGTH} characters.`}
          inputRef={nextRef}
        />
        <PasswordField
          id="confirmPassword"
          label="Confirm new password"
          placeholder="Type it again"
          autoComplete="new-password"
          value={confirm}
          onChange={setConfirm}
          error={confirmError}
          inputRef={confirmRef}
        />
        <div className="mt-2 flex flex-wrap items-center gap-4">
          <SubmitButton pendingLabel="Updating…">Update password</SubmitButton>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-[13px] font-semibold text-muted transition-colors hover:text-ink"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
