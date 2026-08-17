import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ServiceUnavailable } from "@/components/auth/service-unavailable";
import { ConfigGroupForm } from "@/components/dashboard/config-editors";
import {
  DashboardCard,
  DashboardPage,
  EmptyState,
} from "@/components/dashboard/page-frame";
import { guardSession } from "@/lib/auth/session";
import { loadConfigAdmin } from "@/lib/dashboard/config";

export const metadata: Metadata = {
  title: "Site Configuration",
  robots: { index: false, follow: false },
};

/**
 * Site configuration — the DB-backed settings store (ARCHITECTURE.md §7).
 *
 * **Admin-only surface**, like the rest of the Administration section — a
 * coordinator has no link here and is redirected if they find the URL. The API
 * is the authority and models it more finely: it accepts staff, returns each
 * role only the settings it may see, and re-checks write permission per key on
 * save. That split is deliberate. The API's rule is the one §5 specifies, so a
 * coordinator surface can be added later by widening the nav alone; until then
 * the platform's take rate and margin floor are two guards away from a role that
 * may not read them, rather than one.
 *
 * Every save is live: the write is validated against the registry, audited with
 * both states, and busts the public `config` cache tag — the booking calendar,
 * the checkout promises and the public forms pick it up on their next request.
 */
export default async function ConfigPage() {
  const guard = await guardSession("/dashboard/config");
  if (!guard.ok) {
    return <ServiceUnavailable message={guard.message} retryHref="/dashboard/config" />;
  }
  if (guard.session.activeRole !== "admin") redirect("/dashboard");

  const { view, error } = await loadConfigAdmin();

  return (
    <DashboardPage
      eyebrow="Administration"
      title="Site configuration"
      description="The platform's operating rules, stored in the database rather than compiled in. A setting you haven't touched is the figure the platform shipped with; every change is versioned in the audit log with who made it, and goes live on the next page load."
    >
      {error ? (
        <p
          role="alert"
          className="mb-7 rounded-[14px] border-[1.5px] border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.07)] px-4 py-3 text-[13.5px] text-[#a63a30]"
        >
          {error}
        </p>
      ) : null}

      {view ? (
        view.groups.length === 0 ? (
          <EmptyState>
            There are no settings your role can see. Ask an administrator if you need
            one changed.
          </EmptyState>
        ) : (
          <div className="flex flex-col gap-6">
            {!view.canEditAny ? (
              <p className="rounded-[14px] border border-dashed border-line bg-sand/40 px-5 py-4 text-[13px] leading-[1.6] text-muted">
                You can see these settings but not change them. An administrator owns
                the ones on this page.
              </p>
            ) : null}

            {view.groups.map((group) => (
              <DashboardCard key={group.title} title={group.title}>
                <p className="mb-5 max-w-[70ch] text-[13px] leading-[1.6] text-muted">
                  {group.description}
                </p>
                <ConfigGroupForm group={group} />
              </DashboardCard>
            ))}
          </div>
        )
      ) : null}
    </DashboardPage>
  );
}
