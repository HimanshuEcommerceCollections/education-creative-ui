import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ServiceUnavailable } from "@/components/auth/service-unavailable";
import { ApplicationRow } from "@/components/dashboard/application-row";
import {
  DashboardCard,
  DashboardPage,
  EmptyState,
} from "@/components/dashboard/page-frame";
import { loadApplicationQueue } from "@/lib/dashboard/applications";
import { guardSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Educator Applications",
  robots: { index: false, follow: false },
};

/**
 * The review queue. Both staff roles review and approve (§5 permission matrix);
 * the API's `requireStaff` guard is what actually decides, so this page renders the
 * same controls for a coordinator and an admin.
 */
export default async function ApplicationsPage() {
  const guard = await guardSession("/dashboard/applications");
  if (!guard.ok) {
    return <ServiceUnavailable message={guard.message} retryHref="/dashboard/applications" />;
  }
  if (!guard.session.isStaff) redirect("/account");

  const { open, settled, truncated, error } = await loadApplicationQueue();

  return (
    <DashboardPage
      eyebrow="Operations"
      title="Educator applications"
      description="Approving creates the educator's account, grants them the educator role, and emails a single-use invite to set a password. Their profile starts unverified — listing them for bookings is a separate step once the background check is on file."
    >
      {error ? (
        <p
          role="alert"
          className="mb-7 rounded-[14px] border-[1.5px] border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.07)] px-4 py-3 text-[13.5px] text-[#a63a30]"
        >
          {error}
        </p>
      ) : null}

      {/*
        Truncation is stated rather than hidden. The list is filtered by status on
        the server now, but a page ceiling still exists — and an unreviewed
        application quietly falling off the end is the failure worth naming.
      */}
      {truncated ? (
        <p
          role="status"
          className="mb-7 rounded-[14px] border-[1.5px] border-[rgba(210,162,65,0.5)] bg-[rgba(210,162,65,0.1)] px-4 py-3 text-[13.5px] leading-[1.55] text-ink"
        >
          There are more applications than fit on one page, so this list is
          incomplete. Work the queue down and the rest will appear.
        </p>
      ) : null}

      <DashboardCard title={`Open (${open.length})`}>
        {open.length === 0 ? (
          <EmptyState>
            Nothing waiting. Applications submitted from <b>/become-a-tutor</b> land here.
          </EmptyState>
        ) : (
          <ul className="flex flex-col gap-4">
            {open.map((application) => (
              <ApplicationRow key={application.id} application={application} />
            ))}
          </ul>
        )}
      </DashboardCard>

      {settled.length > 0 ? (
        <div className="mt-6">
          <DashboardCard title={`Decided (${settled.length})`}>
            <ul className="flex flex-col gap-4">
              {settled.map((application) => (
                <ApplicationRow key={application.id} application={application} />
              ))}
            </ul>
          </DashboardCard>
        </div>
      ) : null}
    </DashboardPage>
  );
}
