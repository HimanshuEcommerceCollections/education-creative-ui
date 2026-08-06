import type { Metadata } from "next";

import { AuthLayout } from "@/components/auth/auth-layout";
import { ForgotPasswordForm } from "@/components/auth/token-forms";
import { LOGIN_PANEL } from "@/data/auth";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Request a link to choose a new password for your account.",
  // A password page has no business in search results.
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout crumb="Reset password" panel={LOGIN_PANEL}>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
