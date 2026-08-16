import Link from "next/link";

import type { StaffEducatorProfile } from "@contracts/educators.ts";

import { rateLabel } from "@/lib/dashboard/educators";

import { AccountBadge, VerificationBadge } from "./educator-badges";

/**
 * One educator in the directory.
 *
 * A Server Component with no state of its own — every action lives on the detail
 * page, because approving someone is not a decision to make from a list. What the
 * row owes the person scanning it is enough to triage: where they are in vetting,
 * whether they ever signed in, what they teach, and what they cost.
 */
export function EducatorRow({ educator }: { educator: StaffEducatorProfile }) {
  const href = `/dashboard/educators/${encodeURIComponent(educator.slug)}`;
  const noSubjects = educator.subjects.length === 0;

  return (
    <li className="rounded-[18px] border border-line bg-white p-5 transition-colors hover:border-slate">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-[10px]">
            <h3 className="font-serif text-[17px] font-semibold tracking-[-0.01em]">
              <Link href={href} className="text-ink no-underline hover:text-slate">
                {educator.name}
              </Link>
            </h3>
            <VerificationBadge status={educator.verificationStatus} />
            <AccountBadge status={educator.accountStatus} />
          </div>

          <p className="mt-[6px] text-[13.5px] text-muted">
            {educator.headline?.trim() || "No headline yet"}
          </p>

          <p className="mt-1 text-[13px] text-muted">
            {noSubjects ? (
              <b className="font-semibold text-[#a63a30]">
                No subjects — can&rsquo;t be booked for anything
              </b>
            ) : (
              educator.subjects.join(" · ")
            )}
          </p>

          <p className="mt-1 text-[12.5px] text-muted">
            {educator.email ?? "no email on file"}
            {" · "}
            {rateLabel(educator.minRateCents)}
            {" · joined "}
            {new Date(educator.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        <Link
          href={href}
          className="shrink-0 rounded-[40px] border-[1.5px] border-line bg-white px-[18px] py-[9px] text-[13px] font-semibold text-ink no-underline transition-colors hover:border-slate hover:bg-[rgba(var(--slate-rgb),0.05)]"
        >
          Open
        </Link>
      </div>
    </li>
  );
}
