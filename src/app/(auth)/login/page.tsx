import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { homeForRole } from "@contracts/roles.ts";

import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";
import { LOGIN_PANEL } from "@/data/auth";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to message educators, manage bookings, and pick up right where you left off.",
};

/**
 * The single sign-in page for all four roles.
 *
 * Someone who already holds a live session is sent to their role's home rather
 * than shown a form they don't need. A staff session that hasn't cleared TOTP goes
 * to that step instead — it exists, but authorises nothing until it does.
 */
export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    if (session.isStaff && !session.fullyAuthenticated) {
      redirect(session.mfaEnrolled ? "/login/mfa" : "/login/mfa/setup");
    }
    redirect(homeForRole(session.activeRole));
  }

  return (
    <AuthLayout crumb="Sign in" panel={LOGIN_PANEL}>
      <LoginForm />
    </AuthLayout>
  );
}
