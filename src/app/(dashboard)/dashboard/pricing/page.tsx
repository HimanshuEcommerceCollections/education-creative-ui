import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ServiceUnavailable } from "@/components/auth/service-unavailable";
import {
  DashboardCard,
  DashboardPage,
  EmptyState,
} from "@/components/dashboard/page-frame";
import {
  EducatorRateRow,
  FormatPolicyForm,
  RateBandRow,
} from "@/components/dashboard/pricing-editors";
import { guardSession } from "@/lib/auth/session";
import { loadPricingAdmin } from "@/lib/dashboard/pricing";

export const metadata: Metadata = {
  title: "Pricing & Rate Bands",
  robots: { index: false, follow: false },
};

/**
 * Pricing rules — admin only, enforced by `requireRole("admin")` on every
 * endpoint this page talks to (§7: coordinators cannot move money rules).
 *
 * Every save here is live pricing: the write closes the rule row in force and
 * inserts a new version (full history, exact replay for old quotes), then the
 * action busts the public `pricing` cache tag — browse cards, profile pages and
 * the booking estimate pick the change up on their next request.
 */
export default async function PricingPage() {
  const guard = await guardSession("/dashboard/pricing");
  if (!guard.ok) {
    return <ServiceUnavailable message={guard.message} retryHref="/dashboard/pricing" />;
  }
  if (guard.session.activeRole !== "admin") redirect("/dashboard");

  const { view, error } = await loadPricingAdmin();

  return (
    <DashboardPage
      eyebrow="Administration"
      title="Pricing & rate bands"
      description="These rules are what the site charges and displays — edits go live on the next page load, and every change is versioned and audited. Educator rates must sit inside their subject's band; the booking engine clamps and flags anything that drifts."
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
        <>
          <DashboardCard title="Subject rate bands">
            <p className="mb-4 text-[13px] leading-[1.6] text-muted">
              Min ≤ suggested ≤ max, per hour. The suggested rate is what a guest sees
              where no educator is named; the band is the guardrail every educator rate
              is validated against.
            </p>
            {view.bands.length === 0 ? (
              <EmptyState>
                No bands yet. Run <b>npm run seed:pricing</b> in <b>server/</b> to seed
                them from the current site prices.
              </EmptyState>
            ) : (
              <ul className="flex flex-col gap-3">
                {view.bands.map((band) => (
                  <RateBandRow key={band.subjectSlug} band={band} />
                ))}
              </ul>
            )}
          </DashboardCard>

          <div className="mt-6">
            <DashboardCard title="Educator rates">
              <p className="mb-4 text-[13px] leading-[1.6] text-muted">
                What each educator&rsquo;s sessions price at. Saves are refused outside
                the subject&rsquo;s band — widen the band first if the rate is right.
              </p>
              {view.educatorRates.length === 0 ? (
                <EmptyState>No educator rates yet.</EmptyState>
              ) : (
                <ul className="flex flex-col gap-3">
                  {view.educatorRates.map((rate) => (
                    <EducatorRateRow
                      key={`${rate.educatorSlug}:${rate.subjectSlug}`}
                      rate={rate}
                    />
                  ))}
                </ul>
              )}
            </DashboardCard>
          </div>

          <div className="mt-6">
            <DashboardCard title="In-home format differential">
              <FormatPolicyForm policy={view.formatPolicy} />
            </DashboardCard>
          </div>
        </>
      ) : null}
    </DashboardPage>
  );
}
