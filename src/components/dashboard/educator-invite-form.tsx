"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { resendEducatorInviteAction } from "@/app/(dashboard)/dashboard/educators/actions";
import { SessionExpiredAlert } from "@/components/auth/session-expired-alert";
import { IDLE, formMessage, sessionExpired } from "@/lib/auth/form-state";
import { cn } from "@/lib/utils";

function SendButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="rounded-[40px] border-[1.5px] border-line bg-white px-[18px] py-[9px] text-[13px] font-semibold text-ink transition-colors hover:border-slate hover:bg-[rgba(var(--slate-rgb),0.05)] disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? "Sending…" : "Send a fresh invite"}
    </button>
  );
}

/**
 * Re-issues the invite for an educator who has never signed in.
 *
 * The only way back from a lost or expired invite: the password-reset and
 * resend-verification flows both refuse an account that has never had a
 * password, and re-approving the application collides on the email index. A new
 * token invalidates the previous link.
 *
 * Which endpoint it goes to is decided by what the profile carries — the page
 * passes both identifiers and the action prefers the application. That matters
 * for who may press it: the application resend is staff-scoped, while the
 * account-level one is admin-only, so a coordinator looking at a profile with no
 * application behind it is told that rather than handed a button that 403s.
 */
export function EducatorInviteForm({
  slug,
  applicationId,
  userId,
}: {
  slug: string;
  applicationId: string | null;
  userId: string | null;
}) {
  const [state, formAction] = useActionState(resendEducatorInviteAction, IDLE);

  const expired = sessionExpired(state);
  const failed = state.status === "error";
  const message = expired
    ? undefined
    : formMessage(state) ?? (state.status === "success" ? state.message : undefined);

  return (
    <div>
      <form action={formAction} className="flex flex-wrap items-center gap-3">
        <input type="hidden" name="slug" value={slug} />
        {applicationId ? (
          <input type="hidden" name="applicationId" value={applicationId} />
        ) : null}
        {userId ? <input type="hidden" name="userId" value={userId} /> : null}
        <SendButton />
        <span className="text-[12.5px] leading-[1.5] text-muted">
          The new link is good for 7 days and replaces the old one.
        </span>
      </form>

      {message ? (
        <p
          role={failed ? "alert" : "status"}
          className={cn(
            "mt-3 rounded-[11px] border-[1.5px] px-[14px] py-[10px] text-[13px] leading-[1.5]",
            failed
              ? "border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.07)] text-[#a63a30]"
              : "border-[rgba(45,120,80,0.35)] bg-[rgba(45,120,80,0.07)] text-[#256a45]",
          )}
        >
          {message}
        </p>
      ) : null}

      {expired ? <SessionExpiredAlert /> : null}
    </div>
  );
}
