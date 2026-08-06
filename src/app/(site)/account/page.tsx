import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AccountCard, AccountShell, DetailRow } from "@/components/account/account-shell";
import { ResendVerification } from "@/components/account/resend-verification";
import {
  SignOutButton,
  SignOutEverywhereButton,
} from "@/components/account/sign-out-button";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "My Account",
  robots: { index: false, follow: false },
};

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrator",
  coordinator: "Coordinator",
  educator: "Educator",
  customer: "Parent / guardian",
};

/**
 * The parent's account home, and where a customer lands from the header.
 *
 * The redirect here is for flow, not enforcement — the API refuses any
 * unauthenticated request regardless of what this page decides to render.
 */
export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  // A staff or educator session belongs on its own dashboard.
  if (session.activeRole === "admin" || session.activeRole === "coordinator") {
    redirect("/dashboard");
  }
  if (session.activeRole === "educator") redirect("/educator");

  const { user, roles } = session;

  return (
    <AccountShell
      eyebrow="Your account"
      title={`Hello, ${user.fullName.split(" ")[0]}`}
      description="Manage your details and sessions here. Bookings and messaging arrive in a later release."
      actions={<SignOutButton />}
    >
      {!user.emailVerified ? (
        <div className="mb-7">
          <ResendVerification email={user.email} />
        </div>
      ) : null}

      <div className="grid gap-6 min-[900px]:grid-cols-2">
        <AccountCard title="Your details">
          <dl>
            <DetailRow label="Name" value={user.fullName} />
            <DetailRow label="Email" value={user.email} />
            <DetailRow
              label="Email confirmed"
              value={
                user.emailVerified ? (
                  <span className="font-semibold text-slate">Yes</span>
                ) : (
                  <span className="font-semibold text-[#a63a30]">Not yet</span>
                )
              }
            />
            <DetailRow
              label="Account type"
              value={roles.map((role) => ROLE_LABELS[role] ?? role).join(", ")}
            />
          </dl>
        </AccountCard>

        <AccountCard
          title="Security"
          footer={
            <div className="flex flex-wrap gap-3">
              <Link
                href="/forgot-password"
                className="rounded-[40px] border-[1.5px] border-line bg-white px-[22px] py-[11px] text-[13.5px] font-semibold text-ink no-underline transition-colors hover:border-slate hover:bg-[rgba(var(--slate-rgb),0.05)]"
              >
                Change password
              </Link>
              <SignOutEverywhereButton />
            </div>
          }
        >
          <p className="text-[14.5px] leading-[1.65] text-muted">
            Your session is stored in a cookie this site can read but scripts
            can&rsquo;t, and it can be revoked instantly. Changing your password
            signs you out everywhere.
          </p>
        </AccountCard>
      </div>

      <div className="mt-6">
        <AccountCard title="Your family">
          <p className="text-[14.5px] leading-[1.65] text-muted">
            We never create a login for a child. When you book, you&rsquo;ll add a
            learner profile with only what an educator needs — a first name, an age
            band, and the subjects they&rsquo;re working on. You can delete it at
            any time.
          </p>
        </AccountCard>
      </div>
    </AccountShell>
  );
}
