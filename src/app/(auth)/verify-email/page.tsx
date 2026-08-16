import type { Metadata } from "next";

import { AuthLayout } from "@/components/auth/auth-layout";
import { ResendVerificationForm, VerifyEmailForm } from "@/components/auth/token-forms";
import { LOGIN_PANEL } from "@/data/auth";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Confirm Your Email",
  description: "Confirm your email address to finish setting up your account.",
  robots: { index: false, follow: false },
};

/**
 * The confirmation landing page.
 *
 * Reads whether this device holds a session, because that decides what an honest
 * outcome looks like. A confirmation link is routinely opened on a phone that was
 * never signed in, so no exit from this page may assume `/account` is reachable —
 * for a signed-out visitor that bounces to `/login` and loses the thread of what has
 * just happened. Requesting a fresh link has to work without signing in first, which
 * is the one thing an expired link's owner needs.
 */
export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const [{ token }, session] = await Promise.all([searchParams, getSession()]);
  const signedIn = session !== null;

  return (
    <AuthLayout crumb="Confirm email" panel={LOGIN_PANEL}>
      {token ? (
        <VerifyEmailForm token={token} signedIn={signedIn} />
      ) : (
        <ResendVerificationForm
          title="That link looks incomplete"
          body="Open the confirmation link from your email again — the whole URL has to come across. If it's stopped working, we'll send a fresh one."
          signedIn={signedIn}
          knownEmail={session?.user.email}
        />
      )}
    </AuthLayout>
  );
}
