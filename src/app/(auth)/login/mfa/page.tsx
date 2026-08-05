import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthLayout } from "@/components/auth/auth-layout";
import { MfaVerifyForm } from "@/components/auth/mfa-forms";
import { LOGIN_PANEL } from "@/data/auth";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Two-Factor Check",
  robots: { index: false, follow: false },
};

/**
 * Step two of a staff sign-in. Reaching it without a session, or already having
 * cleared the second factor, means there's nothing to do here.
 *
 * These redirects are for flow, not security — the API refuses staff work on an
 * unsatisfied session regardless of which page the request came from.
 */
export default async function MfaVerifyPage() {
  const session = await getSession();

  if (!session) redirect("/login");
  if (!session.isStaff || session.mfaSatisfied) redirect("/dashboard");
  if (!session.mfaEnrolled) redirect("/login/mfa/setup");

  return (
    <AuthLayout crumb="Two-factor" panel={LOGIN_PANEL}>
      <MfaVerifyForm />
    </AuthLayout>
  );
}
