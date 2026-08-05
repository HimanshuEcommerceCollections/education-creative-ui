import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { DashboardCard, DashboardPage } from "@/components/dashboard/page-frame";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Educator Dashboard",
  robots: { index: false, follow: false },
};

/**
 * Where an approved educator lands. Narrow on purpose: §12.2 scopes the launch
 * educator surface to setting a password, seeing assignments, and marking sessions
 * delivered. Assignments and delivery arrive with bookings in Phase 3; the
 * self-service profile and availability editor is an explicit fast-follow.
 */
export default async function EducatorOverviewPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.isStaff) redirect("/dashboard");
  if (session.activeRole !== "educator") redirect("/account");

  const { user } = session;

  return (
    <DashboardPage
      eyebrow="Educator"
      title={`Welcome, ${user.fullName.split(" ")[0]}`}
      description="Your assignments will appear here once booking goes live."
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

      <div className="mt-6">
        <DashboardCard title="Coming next">
          <ul className="flex flex-col gap-[9px] text-[14px] leading-[1.6] text-muted">
            <li>Your assigned sessions, and marking them delivered (Phase 3)</li>
            <li>Earnings and payout status (Phase 4)</li>
            <li>Editing your own profile and availability (fast-follow)</li>
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
