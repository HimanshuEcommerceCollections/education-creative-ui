import type { Metadata } from "next";

import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";
import { LOGIN_PANEL } from "@/data/auth";

export const metadata: Metadata = {
  title: "Sign In — Your Learning Journey",
  description:
    "Sign in to your parent account to message educators, manage bookings, and pick up right where your family left off.",
};

export default function LoginPage() {
  return (
    <AuthLayout crumb="Sign in" panel={LOGIN_PANEL}>
      <LoginForm />
    </AuthLayout>
  );
}
