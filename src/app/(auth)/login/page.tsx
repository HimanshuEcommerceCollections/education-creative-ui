import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { homeForRole } from "@contracts/roles.ts";

import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";
import { LOGIN_PANEL } from "@/data/auth";
import { safeNextPath } from "@/lib/auth/next-path";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to request sessions, follow your bookings, and pick up right where you left off.",
};

/**
 * The single sign-in page for all four roles.
 *
 * `?next=` is written by `proxy.ts` when it turns away a visitor with no session
 * cookie, and read here — without that, every protected deep link (an emailed
 * "my bookings" link, `/dashboard/bookings`) dumped the user on the marketing
 * homepage after signing in. `safeNextPath` is what keeps it from being an open
 * redirect: root-relative same-origin paths only, and never back to an auth route.
 *
 * Someone who already holds a live session is sent straight on rather than shown a
 * form they don't need.
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const [{ next }, session] = await Promise.all([searchParams, getSession()]);
  const nextPath = safeNextPath(next);

  if (session) redirect(nextPath ?? homeForRole(session.activeRole));

  return (
    <AuthLayout crumb="Sign in" panel={LOGIN_PANEL}>
      <LoginForm nextPath={nextPath} />
    </AuthLayout>
  );
}
