"use client";

import { useFormStatus } from "react-dom";

import { signOutAction, signOutEverywhereAction } from "@/app/(auth)/actions";
import { cn } from "@/lib/utils";

/** `dark` suits the dashboard sidebar; `light` the ivory account pages. */
type Tone = "light" | "dark";

const TONES: Record<Tone, string> = {
  light:
    "border-line bg-white text-ink hover:border-slate hover:bg-[rgba(var(--slate-rgb),0.05)]",
  dark:
    "border-[rgba(255,255,255,0.22)] bg-[rgba(255,255,255,0.06)] text-[#e9e7e1] " +
    "hover:border-[rgba(210,162,65,0.5)] hover:bg-[rgba(210,162,65,0.14)] hover:text-gold",
};

function PendingAwareButton({
  label,
  pendingLabel,
  tone,
  className,
}: {
  label: string;
  pendingLabel: string;
  tone: Tone;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={cn(
        "rounded-[40px] border-[1.5px] px-[22px] py-[11px] text-[13.5px] font-semibold",
        "transition-colors disabled:cursor-wait disabled:opacity-60",
        TONES[tone],
        className,
      )}
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

/**
 * Sign out of this device. The action revokes the session row server-side before
 * clearing the cookie, so the token can't be replayed — clearing the cookie alone
 * would leave a live session behind.
 */
export function SignOutButton({
  tone = "light",
  className,
}: {
  tone?: Tone;
  className?: string;
}) {
  return (
    <form action={signOutAction}>
      <PendingAwareButton
        label="Sign out"
        pendingLabel="Signing out…"
        tone={tone}
        className={className}
      />
    </form>
  );
}

/** Revokes every session for the account, not just this browser's. */
export function SignOutEverywhereButton({ tone = "light" }: { tone?: Tone }) {
  return (
    <form action={signOutEverywhereAction}>
      <PendingAwareButton
        label="Sign out on all devices"
        pendingLabel="Signing out everywhere…"
        tone={tone}
      />
    </form>
  );
}
