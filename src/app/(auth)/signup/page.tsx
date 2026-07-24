import type { Metadata } from "next";

import { AuthLayout } from "@/components/auth/auth-layout";
import { SignupForm } from "@/components/auth/signup-form";
import { SIGNUP_PANEL } from "@/data/auth";

export const metadata: Metadata = {
  title: "Create Account — Your Learning Journey",
  description:
    "Create a parent account to browse vetted educators, message the ones who fit, and book sessions — in your home or online.",
};

export default function SignupPage() {
  return (
    <AuthLayout crumb="Create account" panel={SIGNUP_PANEL} reverse>
      <SignupForm />
    </AuthLayout>
  );
}
