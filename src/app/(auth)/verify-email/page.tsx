import type { Metadata } from "next";

import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthNotice } from "@/components/auth/auth-notice";
import { VerifyEmailForm } from "@/components/auth/token-forms";
import { LOGIN_PANEL } from "@/data/auth";

export const metadata: Metadata = {
  title: "Confirm Your Email",
  description: "Confirm your email address to finish setting up your account.",
  robots: { index: false, follow: false },
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <AuthLayout crumb="Confirm email" panel={LOGIN_PANEL}>
      {token ? (
        <VerifyEmailForm token={token} />
      ) : (
        <AuthNotice
          title="That link looks incomplete"
          message="Open the confirmation link from your email again. If it's stopped working, you can send yourself a new one from your account."
          tone="error"
          action={{ label: "Go to my account", href: "/account" }}
        />
      )}
    </AuthLayout>
  );
}
