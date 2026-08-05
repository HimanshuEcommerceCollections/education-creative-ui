import type { Metadata } from "next";

import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthNotice } from "@/components/auth/auth-notice";
import { ResetPasswordForm } from "@/components/auth/token-forms";
import { LOGIN_PANEL } from "@/data/auth";

export const metadata: Metadata = {
  title: "Choose a New Password",
  description: "Set a new password for your account.",
  robots: { index: false, follow: false },
};

/**
 * The token arrives in the emailed link's query string. It is only validated when
 * the form is submitted — reading it here doesn't consume it, so landing on this
 * page (or a scanner prefetching the link) costs nothing.
 */
export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <AuthLayout crumb="New password" panel={LOGIN_PANEL}>
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <AuthNotice
          title="That link looks incomplete"
          message="Open the link from your email again, or ask for a fresh one."
          tone="error"
          action={{ label: "Request a new link", href: "/forgot-password" }}
        />
      )}
    </AuthLayout>
  );
}
