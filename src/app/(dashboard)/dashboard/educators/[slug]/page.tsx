import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ServiceUnavailable } from "@/components/auth/service-unavailable";
import {
  AccountBadge,
  VerificationBadge,
} from "@/components/dashboard/educator-badges";
import { EducatorInviteForm } from "@/components/dashboard/educator-invite-form";
import { EducatorProfileForm } from "@/components/dashboard/educator-profile-form";
import { EducatorVerificationForm } from "@/components/dashboard/educator-verification-form";
import {
  DashboardCard,
  DashboardPage,
  EmptyState,
} from "@/components/dashboard/page-frame";
import { EducatorRateRow } from "@/components/dashboard/pricing-editors";
import { guardSession } from "@/lib/auth/session";
import { loadEducatorDetail, rateLabel } from "@/lib/dashboard/educators";
import { loadPricingAdmin } from "@/lib/dashboard/pricing";

export const metadata: Metadata = {
  title: "Educator",
  robots: { index: false, follow: false },
};

const ALERT_ATTENTION =
  "mb-5 rounded-[14px] border-[1.5px] border-[rgba(210,162,65,0.55)] bg-[rgba(210,162,65,0.12)] px-4 py-3 text-[13.5px] leading-[1.6] text-ink";

const ALERT_ERROR =
  "mb-5 rounded-[14px] border-[1.5px] border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.07)] px-4 py-3 text-[13.5px] leading-[1.6] text-[#a63a30]";

const BACK_LINK =
  "text-[13px] font-semibold text-slate no-underline transition-colors hover:text-gold";

function dateLabel(iso: string): string {
  const stamp = new Date(iso);
  return Number.isNaN(stamp.getTime())
    ? iso
    : stamp.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}

/** `Sat, Aug 15 · 4:00 PM` from a booking's civil date and time. */
function whenLabel(date: string, time: string): string {
  const stamp = new Date(`${date}T${time}:00`);
  const day = Number.isNaN(stamp.getTime())
    ? date
    : stamp.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
  const [hour, minute] = time.split(":").map(Number);
  if (Number.isNaN(hour)) return day;
  const suffix = (hour ?? 0) < 12 ? "AM" : "PM";
  const twelve = (hour ?? 0) % 12 === 0 ? 12 : (hour ?? 0) % 12;
  return `${day} · ${twelve}:${String(minute ?? 0).padStart(2, "0")} ${suffix}`;
}

/**
 * One educator in full — vetting, profile, account, rate.
 *
 * The distinction this page exists to make legible, beyond carrying the
 * verification decision itself, is that `accountStatus` and `verificationStatus`
 * are answers to different questions. An educator sitting at `invited` has never
 * signed in: their invite was lost, or expired, or never arrived. That is not the
 * same problem as being unvetted, it isn't fixed by approving them, and nothing
 * else in the dashboard says it out loud.
 */
export default async function EducatorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const currentPath = `/dashboard/educators/${encodeURIComponent(slug)}`;

  const guard = await guardSession(currentPath);
  if (!guard.ok) {
    return <ServiceUnavailable message={guard.message} retryHref={currentPath} />;
  }
  if (!guard.session.isStaff) redirect("/account");

  const isAdmin = guard.session.activeRole === "admin";

  /*
   * The rate lives in pricing, and `/pricing/admin` is `requireRole("admin")` —
   * so a coordinator never makes that call. They see the figure the profile
   * already carries and no control, which is the honest shape of §7: coordinators
   * don't move money rules.
   */
  const [{ educator, missing, error }, pricing] = await Promise.all([
    loadEducatorDetail(slug),
    isAdmin ? loadPricingAdmin() : Promise.resolve(null),
  ]);

  if (missing || !educator) {
    return (
      <DashboardPage
        eyebrow="Operations"
        title={missing ? "No such educator" : "Educator"}
        actions={
          <Link href="/dashboard/educators" className={BACK_LINK}>
            &larr; All educators
          </Link>
        }
      >
        {error ? (
          <p role="alert" className={ALERT_ERROR}>
            {error}
          </p>
        ) : null}
        <EmptyState>
          {missing ? (
            <>
              Nothing here matches <b>{slug}</b>. It may have been removed, or the link
              may be out of date.
            </>
          ) : (
            <>
              We couldn&rsquo;t load this educator. Nothing has been changed —{" "}
              <Link href={currentPath} className="font-semibold text-slate underline">
                try again
              </Link>
              .
            </>
          )}
        </EmptyState>
      </DashboardPage>
    );
  }

  const neverSignedIn = educator.accountStatus === "invited";
  const noAccount = educator.userId === null;
  const noSubjects = educator.subjects.length === 0;
  const commitments = educator.confirmedBookings;

  /*
   * Which resend endpoint this profile would use, and therefore who may press it.
   * An application behind the profile means the staff-scoped
   * `/educator-applications/:id/resend-invite`; without one there is only the
   * account-level `/auth/invites/:userId/resend`, which is admin-only.
   */
  const resendIsAdminOnly = !educator.applicationId;
  const canResend = !resendIsAdminOnly || isAdmin;

  const rates =
    pricing?.view?.educatorRates.filter((rate) => rate.educatorSlug === educator.slug) ??
    [];

  return (
    <DashboardPage
      eyebrow="Operations"
      title={educator.name}
      description={educator.headline?.trim() || undefined}
      actions={
        <Link href="/dashboard/educators" className={BACK_LINK}>
          &larr; All educators
        </Link>
      }
    >
      <div className="mb-6 flex flex-wrap items-center gap-[10px]">
        <VerificationBadge status={educator.verificationStatus} />
        <AccountBadge status={educator.accountStatus} />
        <span className="text-[13px] text-muted">
          /{educator.slug}
          {educator.email ? ` · ${educator.email}` : " · no email on file"}
          {` · joined ${dateLabel(educator.createdAt)}`}
        </span>
      </div>

      {error ? (
        <p role="alert" className={ALERT_ERROR}>
          {error}
        </p>
      ) : null}

      {/*
        "Never signed in" is the state nothing else surfaces. An educator can be
        approved, listed, and completely unreachable, because the invite that was
        supposed to give them a password never landed.
      */}
      {neverSignedIn ? (
        <p role="status" className={ALERT_ATTENTION}>
          <b className="font-semibold">{educator.name} has never signed in.</b> The
          account exists and the invite was sent, but nobody has set a password on it —
          so they can&rsquo;t see an assignment, mark a session delivered, or be
          contacted through the platform, whatever their verification says. Send a fresh
          invite below.
        </p>
      ) : null}

      {noAccount ? (
        <p role="status" className={ALERT_ATTENTION}>
          <b className="font-semibold">There&rsquo;s no account behind this profile.</b>{" "}
          It exists as a public listing only — nobody can sign in as {educator.name}, so
          they can&rsquo;t be given work even if the verification says otherwise.
        </p>
      ) : null}

      {noSubjects && educator.verificationStatus === "approved" ? (
        <p role="alert" className={ALERT_ERROR}>
          <b className="font-semibold">
            Approved, but not bookable: this profile lists no subjects.
          </b>{" "}
          The booking flow only offers topics an educator has listed and refuses
          anything else, so {educator.name} will be turned away for every request until
          at least one subject is added below.
        </p>
      ) : null}

      <DashboardCard title="Verification">
        <p className="mb-4 text-[13px] leading-[1.6] text-muted">
          This is the only control in the product that moves an educator&rsquo;s
          verification, and it decides whether they may be assigned to a session with a
          child at all. Every change needs a reason, which is what the audit row
          records; approving additionally needs the vetting reference.
        </p>

        <dl className="mb-5 flex flex-wrap gap-x-8 gap-y-3 rounded-[14px] border border-line bg-sand px-4 py-3">
          <div>
            <dt className="text-[11.5px] font-bold uppercase tracking-[0.08em] text-muted">
              Check cleared
            </dt>
            <dd className="mt-[3px] text-[13.5px] text-ink">
              {educator.backgroundCheckAt
                ? dateLabel(educator.backgroundCheckAt)
                : "Never"}
            </dd>
          </div>
          <div>
            <dt className="text-[11.5px] font-bold uppercase tracking-[0.08em] text-muted">
              Vetting reference
            </dt>
            <dd className="mt-[3px] text-[13.5px] text-ink">
              {educator.backgroundCheckRef ?? "None on file"}
            </dd>
          </div>
          <div>
            <dt className="text-[11.5px] font-bold uppercase tracking-[0.08em] text-muted">
              Confirmed sessions
            </dt>
            <dd className="mt-[3px] text-[13.5px] text-ink">{commitments.length}</dd>
          </div>
        </dl>

        <EducatorVerificationForm
          slug={educator.slug}
          name={educator.name}
          status={educator.verificationStatus}
          backgroundCheckRef={educator.backgroundCheckRef}
          confirmedBookings={commitments}
        />
      </DashboardCard>

      {commitments.length > 0 ? (
        <div className="mt-6">
          <DashboardCard title={`Sessions they're committed to (${commitments.length})`}>
            <p className="mb-4 text-[13px] leading-[1.6] text-muted">
              Confirmed and not yet delivered. Suspending {educator.name} doesn&rsquo;t
              cancel or reassign these — there is no reassignment feature yet — so
              they&rsquo;d still need a coordinator to find cover, move the session, or
              refund the parent.
            </p>
            <ul className="flex flex-col gap-2">
              {commitments.map((booking) => (
                <li
                  key={booking.reference}
                  className="rounded-[12px] border border-line bg-white px-4 py-3 text-[13.5px] leading-[1.5] text-ink"
                >
                  <b className="font-semibold">{booking.reference}</b>
                  {" · "}
                  {whenLabel(booking.preferredDate, booking.preferredTime)}
                  {" · "}
                  {booking.subjectTopic}
                </li>
              ))}
            </ul>
          </DashboardCard>
        </div>
      ) : null}

      <div className="mt-6">
        <DashboardCard title="Profile">
          <EducatorProfileForm educator={educator} />
        </DashboardCard>
      </div>

      <div className="mt-6">
        <DashboardCard title="Account">
          <p className="mb-4 text-[13px] leading-[1.6] text-muted">
            {noAccount ? (
              <>
                No account is linked to this profile, so there is nothing to sign in
                with and nothing to invite.
              </>
            ) : neverSignedIn ? (
              <>
                The invite has been issued but never used. Re-sending it invalidates the
                previous link and gives them another 7 days — it&rsquo;s the only way
                back, because password reset and email re-verification both refuse an
                account that has never had a password.
              </>
            ) : (
              <>
                {educator.name} has set a password and can sign in. Their access is
                governed by the verification status above, not by this section.
              </>
            )}
          </p>

          {neverSignedIn && !noAccount ? (
            canResend ? (
              <EducatorInviteForm
                slug={educator.slug}
                applicationId={educator.applicationId}
                userId={educator.userId}
              />
            ) : (
              /*
                Told rather than disabled-with-a-shrug: this profile has no
                application behind it, so the only resend available is the
                account-level one, and that route is `requireRole("admin")`.
                Rendering the button anyway would produce a 403 and no
                explanation of why this educator is different from the last.
              */
              <p className="rounded-[12px] border border-dashed border-line bg-sand px-4 py-3 text-[13px] leading-[1.6] text-muted">
                <b className="font-semibold text-ink">
                  An administrator has to re-send this one.
                </b>{" "}
                There&rsquo;s no application behind this profile, so the invite can only
                be re-issued through the account itself — and that endpoint is
                admin-only. Ask an administrator to open this page and send it.
              </p>
            )
          ) : null}
        </DashboardCard>
      </div>

      <div className="mt-6">
        <DashboardCard title="Rate">
          {isAdmin ? (
            <>
              <p className="mb-4 text-[13px] leading-[1.6] text-muted">
                What {educator.name}&rsquo;s sessions price at, per subject. Saves are
                refused outside the subject&rsquo;s band — the full picture, including
                the bands themselves, is on{" "}
                <Link
                  href="/dashboard/pricing"
                  className="font-semibold text-slate underline"
                >
                  pricing
                </Link>
                .
              </p>
              {pricing?.error ? (
                <p role="alert" className={ALERT_ERROR}>
                  {pricing.error}
                </p>
              ) : null}
              {rates.length === 0 ? (
                <EmptyState>
                  No rate is set for {educator.name}. Their listing falls back to the
                  subject&rsquo;s suggested rate until one is — add it on{" "}
                  <b>/dashboard/pricing</b>.
                </EmptyState>
              ) : (
                <ul className="flex flex-col gap-3">
                  {rates.map((rate) => (
                    <EducatorRateRow key={rate.subjectSlug} rate={rate} />
                  ))}
                </ul>
              )}
            </>
          ) : (
            <>
              <p className="font-serif text-[24px] font-semibold leading-none tracking-[-0.02em] text-ink">
                {rateLabel(educator.minRateCents)}
              </p>
              <p className="mt-3 text-[13px] leading-[1.6] text-muted">
                The lowest rate on file for {educator.name}. Rates are priced against the
                subject rate bands and only an administrator can change them, so
                there&rsquo;s no control here — if this figure looks wrong, that&rsquo;s
                the conversation to have.
              </p>
            </>
          )}
        </DashboardCard>
      </div>
    </DashboardPage>
  );
}
