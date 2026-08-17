import type { Metadata } from "next";
import { redirect } from "next/navigation";

import type { EducatorAssignment } from "@contracts/bookings.ts";

import { ServiceUnavailable } from "@/components/auth/service-unavailable";
import { AssignmentCard } from "@/components/dashboard/assignment-card";
import {
  DashboardCard,
  DashboardPage,
  EmptyState,
} from "@/components/dashboard/page-frame";
import { ApiError, apiFetch } from "@/lib/api/server";
import { readSessionToken } from "@/lib/auth/cookies";
import { guardSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "My Sessions",
  robots: { index: false, follow: false },
};

/**
 * The educator's own sessions.
 *
 * Only bookings a coordinator has **confirmed and assigned to them** appear —
 * an educator doesn't see the requests naming them, because until a coordinator
 * dispatches one, nothing is theirs. The API scopes this off the session's own
 * educator profile and takes no parameter, so this page cannot ask for anyone
 * else's list.
 */
export default async function EducatorSessionsPage() {
  const guard = await guardSession("/educator/sessions");
  if (!guard.ok) {
    return <ServiceUnavailable message={guard.message} retryHref="/educator/sessions" />;
  }
  if (guard.session.isStaff) redirect("/dashboard");
  if (guard.session.activeRole !== "educator") redirect("/account");

  let assignments: EducatorAssignment[] = [];
  let error: string | null = null;

  try {
    const token = await readSessionToken();
    const result = await apiFetch<{ items: EducatorAssignment[] }>("/bookings/assigned", {
      token,
    });
    assignments = result.items;
  } catch (caught) {
    error =
      caught instanceof ApiError
        ? caught.message
        : "We couldn't load your sessions just now.";
  }

  const upcoming = assignments.filter((item) => item.status === "confirmed");
  const past = assignments.filter((item) => item.status !== "confirmed");

  return (
    <DashboardPage
      eyebrow="Teaching"
      title="My sessions"
      description="Sessions a coordinator has confirmed and assigned to you. Learner details are here; for in-home sessions the address is one click away, and every look at it is recorded. Mark a session delivered — or record a no-show — from its card once it's done."
    >
      {error ? (
        <p
          role="alert"
          className="mb-7 rounded-[14px] border-[1.5px] border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.07)] px-4 py-3 text-[13.5px] text-[#a63a30]"
        >
          {error}
        </p>
      ) : null}

      <DashboardCard title={`Upcoming (${upcoming.length})`}>
        {upcoming.length === 0 ? (
          <EmptyState>
            Nothing assigned to you yet. A session appears here once a coordinator
            confirms it — you&rsquo;ll get an email at the same time.
          </EmptyState>
        ) : (
          <ul className="flex flex-col gap-4">
            {upcoming.map((assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </ul>
        )}
      </DashboardCard>

      {past.length > 0 ? (
        <div className="mt-6">
          <DashboardCard title={`Earlier (${past.length})`}>
            <ul className="flex flex-col gap-4">
              {past.map((assignment) => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))}
            </ul>
          </DashboardCard>
        </div>
      ) : null}
    </DashboardPage>
  );
}
