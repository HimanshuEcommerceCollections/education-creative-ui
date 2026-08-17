"use client";

import { useEffect, useState } from "react";

import type { UserRole } from "@contracts/roles.ts";

export type SessionSummary =
  | { signedIn: false }
  | {
      signedIn: true;
      firstName: string;
      isStaff: boolean;
      activeRole: UserRole;
      emailVerified: boolean;
    };

/**
 * Reads just enough session state for the header to render an account link.
 *
 * Returns `undefined` while in flight so the caller can render the signed-out
 * state without flashing a wrong one. The session cookie is HttpOnly, so a fetch
 * is the only way client code can learn any of this.
 */
export function useSessionSummary(): SessionSummary | undefined {
  const [summary, setSummary] = useState<SessionSummary | undefined>(undefined);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/session-summary", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : { signedIn: false }))
      .then((data: SessionSummary) => setSummary(data))
      .catch(() => {
        // An aborted or failed probe renders as signed-out, which is the safe
        // default for a nav item.
        if (!controller.signal.aborted) setSummary({ signedIn: false });
      });

    return () => controller.abort();
  }, []);

  return summary;
}

/**
 * Where each role lands from the nav.
 *
 * A `Record` over the contract's role union rather than an `if` chain, so adding a
 * role to `USER_ROLES` is a type error here instead of a silent fall-through to
 * `/account` — which for a staff role would be a redirect bounce, and for anything
 * else a page they have no business on.
 *
 * Not `ROLE_HOME` from the contract: that maps `customer` to `/` because it answers
 * "where does login send them", and this answers "where does *their account* live".
 */
const ACCOUNT_HREF: Record<UserRole, string> = {
  admin: "/dashboard",
  coordinator: "/dashboard",
  educator: "/educator",
  customer: "/account",
};

/** Where this session's owner should land when they click through the nav. */
export function accountHref(summary: SessionSummary): string {
  if (!summary.signedIn) return "/login";
  return ACCOUNT_HREF[summary.activeRole];
}
