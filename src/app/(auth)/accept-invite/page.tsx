import type { Metadata } from "next";

import type { InviteDetails } from "@/lib/auth/invites";

import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthNotice } from "@/components/auth/auth-notice";
import { AcceptInviteForm } from "@/components/auth/token-forms";
import { SIGNUP_PANEL } from "@/data/auth";
import { readInvite } from "@/lib/auth/invites";

export const metadata: Metadata = {
  title: "Activate Your Account",
  description: "Set a password to activate your account.",
  robots: { index: false, follow: false },
};

/**
 * Set-password page for educators approved by a coordinator and for invited
 * staff. The invite is *read* here so the page can greet the person by name —
 * reading does not consume the token, so a refresh or a link scanner is harmless.
 */
export default async function AcceptInvitePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  let invite: InviteDetails | null = null;
  let problem: string | null = null;

  if (token) {
    const result = await readInvite(token);
    if (result.ok) invite = result.invite;
    else problem = result.message;
  }

  return (
    <AuthLayout crumb="Activate account" panel={SIGNUP_PANEL} reverse>
      {token && invite ? (
        <AcceptInviteForm
          token={token}
          fullName={invite.fullName}
          email={invite.email}
          role={invite.role}
        />
      ) : (
        /*
         * No self-service path exists here on purpose: only an administrator can
         * re-issue an invite (the reset and resend-verification flows both refuse
         * accounts that have never set a password). So this points at support
         * rather than at a link the visitor can't actually request.
         */
        <AuthNotice
          title="This invite isn't usable"
          message={
            problem ??
            "Open the invite link from your email again — the whole URL has to come across. If it has expired, only an administrator can issue a new one, so get in touch and we'll sort it."
          }
          tone="error"
          action={{ label: "Get help", href: "/support" }}
        />
      )}
    </AuthLayout>
  );
}
