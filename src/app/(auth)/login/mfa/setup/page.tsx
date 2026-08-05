import type { Metadata } from "next";
import { redirect } from "next/navigation";

import type { MfaSetupResponse } from "@contracts/auth.ts";

import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthNotice } from "@/components/auth/auth-notice";
import { MfaSetupForm } from "@/components/auth/mfa-forms";
import { LOGIN_PANEL } from "@/data/auth";
import { ApiError, apiFetch } from "@/lib/api/server";
import { readSessionToken } from "@/lib/auth/cookies";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Set Up Two-Factor",
  robots: { index: false, follow: false },
};

export default async function MfaSetupPage() {
  const session = await getSession();

  if (!session) redirect("/login");
  if (!session.isStaff) redirect("/");
  if (session.mfaEnrolled) redirect("/login/mfa");

  const token = await readSessionToken();

  let setup: MfaSetupResponse | null = null;
  let problem: string | null = null;

  try {
    // The API generates and stores the secret but leaves the account
    // un-enrolled until a live code confirms it, so abandoning this page can't
    // half-configure an account.
    setup = await apiFetch<MfaSetupResponse>("/auth/mfa/setup", { token });
  } catch (error) {
    problem =
      error instanceof ApiError
        ? error.message
        : "We couldn't start two-factor setup just now. Please try again shortly.";
  }

  return (
    <AuthLayout crumb="Two-factor setup" panel={LOGIN_PANEL}>
      {setup ? (
        <MfaSetupForm uri={setup.uri} secret={setup.secret} />
      ) : (
        <AuthNotice
          title="Setup unavailable"
          message={problem ?? "Please try again shortly."}
          tone="error"
          action={{ label: "Back to sign in", href: "/login" }}
        />
      )}
    </AuthLayout>
  );
}
