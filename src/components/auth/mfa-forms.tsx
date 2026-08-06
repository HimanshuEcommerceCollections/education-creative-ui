"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

import { mfaEnrolAction, mfaVerifyAction } from "@/app/(auth)/actions";
import { IDLE, fieldError, formMessage } from "@/lib/auth/form-state";

import { FormAlert } from "./form-alert";
import { SubmitButton } from "./submit-button";
import { TextField } from "./text-field";

/** Digits only, six of them — matches the contract's `totpCodeSchema`. */
function sanitiseCode(value: string): string {
  return value.replace(/\D/g, "").slice(0, 6);
}

/**
 * Step two of a staff sign-in. The session cookie already exists at this point
 * but is **inert**: the API's `requireFullAuth` fails closed on a staff session
 * whose `mfa_satisfied_at` is null, so nothing is reachable until this passes.
 */
export function MfaVerifyForm() {
  const router = useRouter();
  const [state, formAction] = useActionState(mfaVerifyAction, IDLE);
  const [code, setCode] = useState("");

  useEffect(() => {
    if (state.status !== "success") return;
    router.replace(state.redirectTo);
  }, [state, router]);

  return (
    <div className="w-full max-w-[400px]">
      <h1 className="text-center font-serif text-[28px] font-semibold tracking-[-0.01em]">
        Two-factor check
      </h1>
      <p className="mb-[26px] mt-2 text-center text-[13.5px] leading-[1.55] text-muted">
        Enter the 6-digit code from your authenticator app.
      </p>

      <FormAlert message={fieldError(state, "code") ? undefined : formMessage(state)} />

      <form action={formAction} noValidate>
        <TextField
          id="code"
          label="Authentication code"
          type="text"
          placeholder="123456"
          autoComplete="one-time-code"
          value={code}
          onChange={(value) => setCode(sanitiseCode(value))}
          error={fieldError(state, "code")}
        />
        <div className="mt-2">
          <SubmitButton pendingLabel="Checking…">Continue</SubmitButton>
        </div>
      </form>

      <p className="mt-6 text-center text-[12.5px] leading-[1.5] text-muted">
        Lost your authenticator? An administrator can reset it for you.
      </p>
    </div>
  );
}

/**
 * First-time staff enrolment. The secret is generated and stored by the API, but
 * the account isn't marked enrolled until a live code proves the app is set up —
 * so abandoning this page leaves nothing half-configured.
 */
export function MfaSetupForm({ uri, secret }: { uri: string; secret: string }) {
  const router = useRouter();
  const [state, formAction] = useActionState(mfaEnrolAction, IDLE);
  const [code, setCode] = useState("");

  useEffect(() => {
    if (state.status !== "success") return;
    router.replace(state.redirectTo);
  }, [state, router]);

  return (
    <div className="w-full max-w-[400px]">
      <h1 className="text-center font-serif text-[26px] font-semibold tracking-[-0.01em]">
        Set up two-factor authentication
      </h1>
      <p className="mb-5 mt-2 text-center text-[13.5px] leading-[1.55] text-muted">
        Staff accounts require an authenticator app. Add this account to Google
        Authenticator, 1Password, or similar.
      </p>

      {/*
        No QR image: rendering one needs a QR library, and every authenticator
        accepts a pasted setup key. The otpauth:// link opens the app directly on
        mobile.
      */}
      <div className="mb-5 rounded-[14px] border-[1.5px] border-line bg-sand px-4 py-[14px]">
        <p className="mb-[6px] text-[11.5px] font-bold uppercase tracking-[0.06em] text-muted">
          Setup key
        </p>
        <code className="block break-all font-mono text-[13.5px] leading-[1.5] text-ink">
          {secret}
        </code>
        <a
          href={uri}
          className="mt-3 inline-block text-[12.5px] font-semibold text-slate transition-colors hover:text-gold"
        >
          Or open in your authenticator app →
        </a>
      </div>

      <FormAlert message={fieldError(state, "code") ? undefined : formMessage(state)} />

      <form action={formAction} noValidate>
        <TextField
          id="code"
          label="Enter the code it shows"
          type="text"
          placeholder="123456"
          autoComplete="one-time-code"
          value={code}
          onChange={(value) => setCode(sanitiseCode(value))}
          error={fieldError(state, "code")}
        />
        <div className="mt-2">
          <SubmitButton pendingLabel="Confirming…">Finish setup</SubmitButton>
        </div>
      </form>
    </div>
  );
}
