import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import type { UserRole } from "@contracts/roles.ts";

import { AccountCard, AccountShell, DetailRow } from "@/components/account/account-shell";
import { ChangePasswordForm } from "@/components/account/change-password-form";
import { ResendVerification } from "@/components/account/resend-verification";
import {
  SignOutButton,
  SignOutEverywhereButton,
} from "@/components/account/sign-out-button";
import { ServiceUnavailable } from "@/components/auth/service-unavailable";
import { CONTACT_DETAILS } from "@/data/contact";
import { guardSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "My Account",
  robots: { index: false, follow: false },
};

/** Exhaustive over the contract's role union, so a new role is a type error here. */
const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrator",
  coordinator: "Coordinator",
  educator: "Educator",
  customer: "Parent / guardian",
};

/** The address a deletion request has to reach, single-sourced with /contact. */
const SUPPORT_EMAIL =
  CONTACT_DETAILS.find((detail) => detail.icon === "mail")?.value ?? "";

/**
 * The parent's account home, and where a customer lands from the header.
 *
 * The redirect here is for flow, not enforcement — the API refuses any
 * unauthenticated request regardless of what this page decides to render.
 */
export default async function AccountPage() {
  const guard = await guardSession("/account");
  if (!guard.ok) return <ServiceUnavailable message={guard.message} retryHref="/account" />;

  const { session } = guard;

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
      description="Manage your details and sessions here. There's no messaging yet — a coordinator emails you about each booking."
      actions={
        <>
          <Link
            href="/account/bookings"
            className="rounded-[40px] border border-ink px-[22px] py-[11px] text-[14px] font-semibold text-ink no-underline transition-all duration-[400ms] ease-brand hover:bg-slate hover:text-ivory"
          >
            My bookings
          </Link>
          <SignOutButton />
        </>
      }
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
              value={roles.map((role) => ROLE_LABELS[role]).join(", ")}
            />
          </dl>
        </AccountCard>

        <AccountCard
          title="Security"
          footer={
            <div className="flex flex-wrap items-start gap-3">
              {/*
                A real change-password form, never a link to /forgot-password: a
                password reset by email is the wrong instrument for someone already
                signed in who knows their current password.
              */}
              <ChangePasswordForm />
              <SignOutEverywhereButton />
            </div>
          }
        >
          <p className="text-[14.5px] leading-[1.65] text-muted">
            Your session is stored in a cookie this site can read but scripts
            can&rsquo;t, and it can be revoked instantly. Changing your password
            signs you out on every other device.
          </p>
        </AccountCard>
      </div>

      <div className="mt-6">
        <AccountCard title="Your family">
          <p className="text-[14.5px] leading-[1.65] text-muted">
            We never create a login for a child. When you book, you&rsquo;ll add a
            learner profile with only what an educator needs — a first name, an age
            band, and what they&rsquo;re working on. No date of birth, no surname, and
            for in-home sessions the address is encrypted and released only to the
            educator assigned to that booking.
          </p>
          {/*
            "You can delete it at any time" is hashed into the COPPA consent record,
            so this card owes the reader a route that actually works. There is still no
            delete control and no endpoint: self-service deletion is the single most
            important gap left on this page, and until it ships this must say precisely
            how a request is made and what happens to it, rather than show a button
            that does nothing or restate a promise nothing keeps.
          */}
          <div className="mt-5 rounded-[14px] border-[1.5px] border-[rgba(210,162,65,0.45)] bg-[rgba(210,162,65,0.09)] px-4 py-[14px]">
            <p className="text-[12px] font-bold uppercase tracking-[0.07em] text-[#7a5a12]">
              Deleting a learner profile
            </p>
            <p className="mt-[6px] text-[13.5px] leading-[1.6] text-ink">
              You can have a learner profile deleted at any time, and we will. It
              isn&rsquo;t a button here yet &mdash; email{" "}
              {SUPPORT_EMAIL ? (
                <a
                  href={`mailto:${SUPPORT_EMAIL}?subject=Delete%20my%20child%27s%20learner%20profile`}
                  className="font-semibold text-slate underline"
                >
                  {SUPPORT_EMAIL}
                </a>
              ) : (
                <Link href="/support" className="font-semibold text-slate underline">
                  our support team
                </Link>
              )}{" "}
              from the address on this account, say which child, and we&rsquo;ll confirm
              once it&rsquo;s done. Booking and payment records have to stay for tax and
              dispute purposes, but the child&rsquo;s name, age band, focus notes, and any
              address go.
            </p>
          </div>
        </AccountCard>
      </div>
    </AccountShell>
  );
}
