import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ApplicationRow } from "@/components/dashboard/application-row";
import {
  DashboardCard,
  DashboardPage,
  EmptyState,
} from "@/components/dashboard/page-frame";
import { loadApplicationQueue } from "@/lib/dashboard/applications";
import { getSession } from "@/lib/auth/session";

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
  const session = await getSession();
  if (!session) redirect("/login");
  if (!session.isStaff) redirect("/account");

  const { open, settled, error } = await loadApplicationQueue();

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
