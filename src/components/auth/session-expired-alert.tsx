"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { SESSION_EXPIRED_MESSAGE } from "@/lib/auth/form-state";
import { loginHrefWithNext } from "@/lib/auth/next-path";

/**
 * Shown when an action came back `unauthenticated` — the staff idle window closed,
 * or the session was revoked elsewhere.
 *
 * Two deliberate choices:
 *
 * 1. **It doesn't navigate on its own.** The complaint this fixes is a coordinator
 *    losing the note they had typed; auto-redirecting would guarantee that loss.
 *    The link is prominent and focused instead, so leaving is one keypress but
 *    still their decision.
 * 2. **It carries `next`.** `loginHrefWithNext` runs the current path through the
 *    same open-redirect guard the login page uses, and that guard rejects auth
 *    routes — so this can never bounce someone from login back to login.
 */
export function SessionExpiredAlert({ className }: { className?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.toString();
  const href = loginHrefWithNext(query ? `${pathname}?${query}` : pathname);

  return (
    <div
      role="alert"
      className={
        className ??
        "mt-4 rounded-[14px] border-[1.5px] border-[rgba(210,162,65,0.55)] bg-[rgba(210,162,65,0.12)] px-[16px] py-[14px]"
      }
    >
      <p className="text-[13.5px] font-bold uppercase tracking-[0.06em] text-[#7a5a12]">
        Signed out
      </p>
      <p className="mt-1 text-[13.5px] leading-[1.55] text-ink">
        {SESSION_EXPIRED_MESSAGE}
      </p>
      <Link
        href={href}
        className="mt-3 inline-flex rounded-[40px] border-[1.5px] border-transparent bg-slate px-[20px] py-[9px] text-[13px] font-semibold text-white no-underline transition-colors hover:bg-slate-deep"
      >
        Sign in again
      </Link>
    </div>
  );
}
