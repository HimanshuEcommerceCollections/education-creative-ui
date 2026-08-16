import type { EducatorVerificationStatus } from "@contracts/educators.ts";
import type { UserStatus } from "@contracts/staff-invites.ts";

import { cn } from "@/lib/utils";

/**
 * The two badges an educator carries, kept together because they are read
 * together and constantly confused with each other.
 *
 * `verificationStatus` is whether we have vetted them. `accountStatus` is whether
 * they have an account they have actually used. An educator can be approved and
 * have never signed in, or be signed in every day and not be allowed near a
 * child — different problems, different fixes, so different badges.
 */

const BADGE =
  "inline-flex rounded-[30px] border px-[11px] py-[3px] text-[11.5px] font-bold uppercase tracking-[0.06em]";

const VERIFICATION_STYLES: Record<EducatorVerificationStatus, string> = {
  draft: "border-line bg-sand text-muted",
  pending: "border-[rgba(210,162,65,0.5)] bg-[rgba(210,162,65,0.12)] text-[#7a5a12]",
  approved: "border-[rgba(45,120,80,0.35)] bg-[rgba(45,120,80,0.09)] text-[#256a45]",
  suspended: "border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.08)] text-[#a63a30]",
};

const VERIFICATION_LABELS: Record<EducatorVerificationStatus, string> = {
  draft: "Draft",
  pending: "Awaiting check",
  approved: "Approved",
  suspended: "Suspended",
};

export function VerificationBadge({
  status,
  className,
}: {
  status: EducatorVerificationStatus;
  className?: string;
}) {
  return (
    <span className={cn(BADGE, VERIFICATION_STYLES[status], className)}>
      {VERIFICATION_LABELS[status]}
    </span>
  );
}

const ACCOUNT_STYLES: Record<UserStatus, string> = {
  invited: "border-[rgba(210,162,65,0.5)] bg-[rgba(210,162,65,0.12)] text-[#7a5a12]",
  active: "border-line bg-white text-muted",
  suspended: "border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.08)] text-[#a63a30]",
  deactivated: "border-line bg-sand text-muted",
};

const ACCOUNT_LABELS: Record<UserStatus, string> = {
  // Not "Invite pending": the fact worth surfacing is that this person has never
  // signed in, which is a different problem from not being vetted.
  invited: "Never signed in",
  active: "Signed in",
  suspended: "Account suspended",
  deactivated: "Account closed",
};

/** `null` means the profile has no account at all — a seeded or orphaned row. */
export function AccountBadge({
  status,
  className,
}: {
  status: UserStatus | null;
  className?: string;
}) {
  if (status === null) {
    return (
      <span className={cn(BADGE, "border-line bg-sand text-muted", className)}>
        No account
      </span>
    );
  }
  return (
    <span className={cn(BADGE, ACCOUNT_STYLES[status], className)}>
      {ACCOUNT_LABELS[status]}
    </span>
  );
}
