import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { CONTACT_REASON_LABELS } from "@contracts/contact-requests.ts";

import { ServiceUnavailable } from "@/components/auth/service-unavailable";
import { ContactRequestActions } from "@/components/dashboard/contact-request-actions";
import { ContactStatusBadge } from "@/components/dashboard/contact-request-row";
import {
  DashboardCard,
  DashboardPage,
  EmptyState,
} from "@/components/dashboard/page-frame";
import { SITE } from "@/constants/site";
import { guardSession } from "@/lib/auth/session";
import {
  ageLabel,
  arrivedLabel,
  hasAged,
  loadContactRequest,
} from "@/lib/dashboard/contact-requests";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Enquiry",
  robots: { index: false, follow: false },
};

const ALERT_ERROR =
  "mb-5 rounded-[14px] border-[1.5px] border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.07)] px-4 py-3 text-[13.5px] leading-[1.6] text-[#a63a30]";

const BACK_LINK =
  "text-[13px] font-semibold text-slate no-underline transition-colors hover:text-gold";

const CONTACT_LINK =
  "font-semibold text-slate no-underline underline decoration-[rgba(46,58,115,0.35)] underline-offset-[3px] transition-colors hover:text-gold";

/**
 * One enquiry in full.
 *
 * The page a coordinator has open while they write the reply — so it carries the
 * whole message rather than a preview, and puts the address and the phone number
 * where they can be clicked or copied without hunting.
 *
 * The `mailto:` is the honest control here: **the platform sends nothing**. It
 * opens the coordinator's own mail client with the sender's address in it, and
 * whatever they type there is the reply. What this screen records afterwards is
 * only who owned the enquiry and what came of it.
 */
export default async function ContactRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const currentPath = `/dashboard/queries/${encodeURIComponent(id)}`;

  const guard = await guardSession(currentPath);
  if (!guard.ok) {
    return <ServiceUnavailable message={guard.message} retryHref={currentPath} />;
  }
  if (!guard.session.isStaff) redirect("/account");

  const { request, missing, readAt, error } = await loadContactRequest(id);

  if (missing || !request) {
    return (
      <DashboardPage
        eyebrow="Operations"
        title={missing ? "No such enquiry" : "Enquiry"}
        actions={
          <Link href="/dashboard/queries" className={BACK_LINK}>
            &larr; All queries
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
              Nothing here matches that link. The enquiry may have been removed, or the
              link may be out of date.
            </>
          ) : (
            <>
              We couldn&rsquo;t load this enquiry. Nothing has been changed &mdash;{" "}
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

  const open = request.status === "new" || request.status === "in_progress";
  const ageing = open && hasAged(request.createdAt, readAt);
  const heldByViewer = request.assignedToId === guard.session.user.id;

  /*
   * The address is left unescaped and only the subject is encoded: `%40` in the
   * mailto path is legal but not every mail client round-trips it, and the value
   * has already been through the contract's email validation, so there is nothing
   * in it that needs escaping.
   */
  const mailto = `mailto:${request.email}?subject=${encodeURIComponent(
    `Re: your message to ${SITE.name}`,
  )}`;

  return (
    <DashboardPage
      eyebrow="Operations"
      title={request.name}
      description={`${CONTACT_REASON_LABELS[request.reason]} — sent through the contact form.`}
      actions={
        <Link href="/dashboard/queries" className={BACK_LINK}>
          &larr; All queries
        </Link>
      }
    >
      <div className="mb-6 flex flex-wrap items-center gap-[10px]">
        <ContactStatusBadge status={request.status} />
        <span className="rounded-[30px] border border-line bg-sand px-[11px] py-[3px] text-[11.5px] font-semibold uppercase tracking-[0.06em] text-muted">
          {CONTACT_REASON_LABELS[request.reason]}
        </span>
        <span className="text-[13px] text-muted">
          Arrived {arrivedLabel(request.createdAt)}
          {" · "}
          <b
            className={cn("font-semibold", ageing ? "text-[#a63a30]" : "text-ink")}
          >
            {open
              ? `waiting ${ageLabel(request.createdAt, readAt)}`
              : `${ageLabel(request.createdAt, readAt)} old`}
          </b>
        </span>
      </div>

      {error ? (
        <p role="alert" className={ALERT_ERROR}>
          {error}
        </p>
      ) : null}

      <DashboardCard title="How to reach them">
        <p className="mb-4 text-[13px] leading-[1.6] text-muted">
          Answer from your own mail client &mdash; nothing you do on this page is sent
          to {request.name}. The address below opens a draft; the note you leave when
          you resolve the enquiry stays here, for whoever reads it next.
        </p>

        <dl className="flex flex-wrap gap-x-10 gap-y-4">
          <div className="min-w-0">
            <dt className="text-[11.5px] font-bold uppercase tracking-[0.08em] text-muted">
              Email
            </dt>
            <dd className="mt-[4px] text-[14.5px] leading-[1.5] break-words">
              <a href={mailto} className={CONTACT_LINK}>
                {request.email}
              </a>
            </dd>
          </div>

          <div className="min-w-0">
            <dt className="text-[11.5px] font-bold uppercase tracking-[0.08em] text-muted">
              Phone
            </dt>
            <dd className="mt-[4px] text-[14.5px] leading-[1.5] break-words">
              {request.phone ? (
                <a href={`tel:${request.phone.replace(/\s+/g, "")}`} className={CONTACT_LINK}>
                  {request.phone}
                </a>
              ) : (
                <span className="text-muted">They didn&rsquo;t leave one.</span>
              )}
            </dd>
          </div>

          <div className="min-w-0">
            <dt className="text-[11.5px] font-bold uppercase tracking-[0.08em] text-muted">
              Account
            </dt>
            <dd className="mt-[4px] text-[14.5px] leading-[1.5] text-ink">
              {/*
                `senderUserId` means they were signed in when they wrote. Said, not
                linked: there is no staff route that opens an arbitrary account, and
                inventing one here would be a link to a 404. What it is good for is
                knowing the address on the message is one we can already recognise.
              */}
              {request.senderUserId ? (
                <>They were signed in &mdash; this came from an account.</>
              ) : (
                <span className="text-muted">Sent while signed out.</span>
              )}
            </dd>
          </div>

          <div className="min-w-0">
            <dt className="text-[11.5px] font-bold uppercase tracking-[0.08em] text-muted">
              Held by
            </dt>
            <dd className="mt-[4px] text-[14.5px] leading-[1.5] text-ink">
              {request.assignedToName ? (
                heldByViewer ? (
                  <b className="font-semibold">You</b>
                ) : (
                  request.assignedToName
                )
              ) : (
                <span className="font-semibold text-[#a63a30]">Nobody yet</span>
              )}
            </dd>
          </div>
        </dl>
      </DashboardCard>

      <div className="mt-6">
        <DashboardCard title="What they wrote">
          {request.message.trim().length > 0 ? (
            <p className="whitespace-pre-line break-words rounded-[12px] border border-line bg-sand px-4 py-3 text-[14.5px] leading-[1.7] text-ink">
              {request.message}
            </p>
          ) : (
            <EmptyState>The form was submitted with no message text.</EmptyState>
          )}
        </DashboardCard>
      </div>

      {request.firstRespondedAt || request.resolvedAt || request.resolutionNote ? (
        <div className="mt-6">
          <DashboardCard title="What came of it">
            <dl className="mb-4 flex flex-wrap gap-x-10 gap-y-3">
              <div>
                <dt className="text-[11.5px] font-bold uppercase tracking-[0.08em] text-muted">
                  First picked up
                </dt>
                <dd className="mt-[3px] text-[13.5px] text-ink">
                  {request.firstRespondedAt
                    ? arrivedLabel(request.firstRespondedAt)
                    : "Not yet"}
                </dd>
              </div>
              <div>
                <dt className="text-[11.5px] font-bold uppercase tracking-[0.08em] text-muted">
                  Resolved
                </dt>
                <dd className="mt-[3px] text-[13.5px] text-ink">
                  {request.resolvedAt ? arrivedLabel(request.resolvedAt) : "Not yet"}
                </dd>
              </div>
            </dl>

            {request.resolutionNote ? (
              <p className="whitespace-pre-line break-words rounded-[12px] border border-dashed border-line px-4 py-3 text-[14px] leading-[1.65] text-ink">
                {request.resolutionNote}
              </p>
            ) : (
              <p className="text-[13px] leading-[1.6] text-muted">
                No note yet. One is required to resolve the enquiry.
              </p>
            )}
          </DashboardCard>
        </div>
      ) : null}

      <div className="mt-6">
        <DashboardCard title="Move it along">
          <ContactRequestActions request={request} viewerId={guard.session.user.id} />
        </DashboardCard>
      </div>
    </DashboardPage>
  );
}
