import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ServiceUnavailable } from "@/components/auth/service-unavailable";
import { DashboardCard, DashboardPage } from "@/components/dashboard/page-frame";
import { guardSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Educator Dashboard",
  robots: { index: false, follow: false },
};

/**
 * Where an approved educator lands. Narrow on purpose: §12.2 scopes the launch
 * educator surface to setting a password, seeing assignments, and marking sessions
 * delivered — all three of which exist, so this page describes them as available.
 *
 * Nothing here may defer a capability the sidebar two inches to the left already
 * links to: "your assignments will appear here once booking goes live" beside a live
 * `/educator/sessions` teaches an educator not to trust either.
 */
export default async function EducatorOverviewPage() {
  const guard = await guardSession("/educator");
  if (!guard.ok) return <ServiceUnavailable message={guard.message} retryHref="/educator" />;

  const { session } = guard;
  if (session.isStaff) redirect("/dashboard");
  if (session.activeRole !== "educator") redirect("/account");

  const { user } = session;

  return (
    <DashboardPage
      eyebrow="Educator"
      title={`Welcome, ${user.fullName.split(" ")[0]}`}
      description="Sessions a coordinator has confirmed and assigned to you appear under My sessions, with the learner's details and — for in-home lessons — the address."
      actions={
        <Link
          href="/educator/sessions"
          className="rounded-[40px] border-[1.5px] border-transparent bg-slate px-[22px] py-[10px] text-[13.5px] font-semibold text-white no-underline transition-colors hover:bg-slate-deep"
        >
          My sessions
        </Link>
      }
    >
      <div className="grid gap-6 min-[900px]:grid-cols-2">
        <DashboardCard title="Your account">
          <dl>
            <Row label="Name" value={user.fullName} />
            <Row label="Email" value={user.email} />
            <Row
              label="Email confirmed"
              value={
                user.emailVerified ? (
                  <span className="font-semibold text-slate">Yes</span>
                ) : (
                  <span className="font-semibold text-[#a63a30]">Not yet</span>
                )
              }
            />
            <Row label="Role" value="Educator" />
          </dl>
        </DashboardCard>

        <DashboardCard title="Getting listed">
          <p className="text-[14.5px] leading-[1.65] text-muted">
            Your profile exists but isn&rsquo;t listed publicly yet. A coordinator marks
            it verified once your background check is on file. Until then a booking
            can&rsquo;t be assigned to you, and no learner details or home addresses are
            shared — that rule is enforced on the server, not just hidden in the UI.
          </p>
        </DashboardCard>
      </div>

      <div className="mt-6 grid gap-6 min-[900px]:grid-cols-2">
        <DashboardCard
          title="How a session reaches you"
          action={
            <Link
              href="/educator/sessions"
              className="text-[13px] font-semibold text-slate no-underline transition-colors hover:text-gold"
            >
              My sessions &rarr;
            </Link>
          }
        >
          <ol className="flex list-decimal flex-col gap-[9px] pl-5 text-[14px] leading-[1.6] text-muted">
            <li>A parent requests you and pays — nothing is on your calendar yet.</li>
            <li>A coordinator phones you to confirm the time before assigning it.</li>
            <li>
              It appears under <b>My sessions</b> with the learner&rsquo;s first name, age
              band, and what they&rsquo;re working on.
            </li>
            <li>
              For in-home lessons, the address is one click away — and every look at it
              is recorded.
            </li>
            <li>
              Afterwards, mark it <b>delivered</b> (or record a no-show) from that same
              card.
            </li>
          </ol>
        </DashboardCard>

        <DashboardCard title="Coming next">
          <ul className="flex flex-col gap-[9px] text-[14px] leading-[1.6] text-muted">
            <li>Earnings and payout status &mdash; each session already shows what it earns you</li>
            <li>Editing your own profile and availability (fast-follow)</li>
            <li>Setting your own open times, rather than a coordinator matching them</li>
          </ul>
        </DashboardCard>
      </div>
    </DashboardPage>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line py-[12px] last:border-b-0">
      <dt className="text-[12px] font-bold uppercase tracking-[0.06em] text-muted">
        {label}
      </dt>
      <dd className="text-[14.5px] text-ink">{value}</dd>
    </div>
  );
}
