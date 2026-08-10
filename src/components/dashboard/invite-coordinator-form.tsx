"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { inviteCoordinatorAction } from "@/app/(dashboard)/dashboard/actions";
import { IDLE, fieldError, formMessage } from "@/lib/auth/form-state";
import { cn } from "@/lib/utils";

const INPUT =
  "w-full rounded-[11px] border-[1.5px] border-line bg-sand px-[13px] py-[9px] text-[13.5px] " +
  "text-ink placeholder:text-[rgba(99,99,110,0.6)] focus:border-slate focus:bg-white focus:outline-none";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="rounded-[40px] border-[1.5px] border-transparent bg-slate px-[22px] py-[10px] text-[13px] font-semibold text-white transition-colors hover:bg-slate-deep disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? "Sending invite…" : "Send invite"}
    </button>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex min-w-[200px] flex-1 flex-col gap-[6px]">
      <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-muted">
        {label}
      </span>
      {children}
      {error ? (
        <span id={`${name}-error`} className="text-[12.5px] text-[#a63a30]">
          {error}
        </span>
      ) : null}
    </label>
  );
}

/**
 * The coordinator invite form. Deliberately has no password field — the invitee
 * sets their own through the emailed single-use link, so no credential ever
 * passes through an admin's hands.
 */
export function InviteCoordinatorForm() {
  const [state, action] = useActionState(inviteCoordinatorAction, IDLE);

  const failed = state.status === "error";
  const message =
    formMessage(state) ?? (state.status === "success" ? state.message : undefined);

  return (
    <form action={action}>
      <div className="flex flex-wrap gap-4">
        <Field label="Full name" name="fullName" error={fieldError(state, "fullName")}>
          <input
            name="fullName"
            required
            autoComplete="off"
            placeholder="Jordan Rivera"
            aria-invalid={Boolean(fieldError(state, "fullName"))}
            className={INPUT}
          />
        </Field>
        <Field label="Email" name="email" error={fieldError(state, "email")}>
          <input
            name="email"
            type="email"
            required
            autoComplete="off"
            placeholder="name@example.com"
            aria-invalid={Boolean(fieldError(state, "email"))}
            className={INPUT}
          />
        </Field>
        <Field label="Phone (optional)" name="phone" error={fieldError(state, "phone")}>
          <input
            name="phone"
            autoComplete="off"
            placeholder="+1 555 000 0000"
            aria-invalid={Boolean(fieldError(state, "phone"))}
            className={INPUT}
          />
        </Field>
      </div>

      {message ? (
        <p
          role={failed ? "alert" : "status"}
          className={cn(
            "mt-4 rounded-[11px] border-[1.5px] px-[14px] py-[10px] text-[13px] leading-[1.5]",
            failed
              ? "border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.07)] text-[#a63a30]"
              : "border-[rgba(45,120,80,0.35)] bg-[rgba(45,120,80,0.07)] text-[#256a45]",
          )}
        >
          {message}
        </p>
      ) : null}

      <div className="mt-5 flex items-center justify-between gap-4 border-t border-line pt-5">
        <p className="text-[12.5px] leading-[1.5] text-muted">
          They&apos;ll get a single-use link, good for 7 days, to set their own password.
        </p>
        <SubmitButton />
      </div>
    </form>
  );
}
