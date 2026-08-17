import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import type { SessionResponse } from "@contracts/auth.ts";
import type { UserRole } from "@contracts/roles.ts";

import { ApiError, ApiUnreachableError, apiFetch } from "@/lib/api/server";

import { readSessionToken } from "./cookies";
import { loginHrefWithNext } from "./next-path";

/**
 * What one `/auth/session` call can actually tell us.
 *
 * Collapsing all three into `null` was wrong in a specific, user-visible way: a
 * flaky API or a 500 ejected a signed-in coordinator to the login screen, where
 * signing in again wouldn't have helped and nothing said so. Authorization still
 * fails closed — `unavailable` renders no signed-in UI either — but it fails
 * *honestly*, and it does not throw away the session cookie on the way.
 */
export type SessionState =
  | { status: "authenticated"; session: SessionResponse }
  | { status: "anonymous" }
  | { status: "unavailable"; message: string };

const UNAVAILABLE_MESSAGE =
  "We can't reach the server right now, so we can't load your account. You're still signed in — please try again in a moment.";

/**
 * Reads the current session state. Wrapped in React's `cache` so a page with a
 * dozen server components that each need the user costs exactly one API call per
 * request.
 *
 * **The API is the authoritative verifier** — this only forwards the cookie. A
 * present cookie proves nothing on its own, which is why `proxy.ts` is never the
 * security boundary.
 */
export const readSessionState = cache(async (): Promise<SessionState> => {
  const token = await readSessionToken();
  if (!token) return { status: "anonymous" };

  try {
    const session = await apiFetch<SessionResponse>("/auth/session", { token });
    return { status: "authenticated", session };
  } catch (error) {
    // An expired or revoked session is an ordinary outcome, not a failure.
    if (error instanceof ApiError && error.status === 401) return { status: "anonymous" };

    /*
     * Everything else — `ApiUnreachableError`, a 5xx, a gateway page, a wrong
     * `API_BASE_URL` — means the cookie may well be valid and we simply couldn't
     * check it. Never renders as signed-in; never claims they're signed out.
     */
    if (!(error instanceof ApiUnreachableError) && !(error instanceof ApiError)) {
      console.error("readSessionState: unexpected failure reading /auth/session", error);
    }
    return { status: "unavailable", message: UNAVAILABLE_MESSAGE };
  }
});

/**
 * The session, or null when there isn't one **or** we couldn't check.
 *
 * Kept for the places that only need "may I render signed-in content" — the nav
 * probe, the login page's already-signed-in shortcut. A protected page wants
 * `guardSession` instead, so it can tell the two apart.
 */
export async function getSession(): Promise<SessionResponse | null> {
  const state = await readSessionState();
  return state.status === "authenticated" ? state.session : null;
}

export type SessionGuard =
  | { ok: true; session: SessionResponse }
  | { ok: false; message: string };

/**
 * The guard every protected page uses.
 *
 * An anonymous visitor is redirected to login, carrying where they were so they
 * get back there (the proxy does this for a missing cookie; this covers a cookie
 * the API has since rejected). An unreachable API comes back as data, for the
 * page to render as itself rather than as a sign-in prompt.
 *
 * `currentPath` is passed explicitly because a Server Component has no reliable
 * read of its own route — and a wrong `next` is worse than none.
 */
export async function guardSession(currentPath?: string): Promise<SessionGuard> {
  const state = await readSessionState();

  if (state.status === "authenticated") return { ok: true, session: state.session };
  if (state.status === "unavailable") return { ok: false, message: state.message };

  redirect(loginHrefWithNext(currentPath));
}

export async function getActiveRole(): Promise<UserRole | null> {
  const session = await getSession();
  return session?.activeRole ?? null;
}

export async function hasRole(...roles: UserRole[]): Promise<boolean> {
  const session = await getSession();
  if (!session) return false;
  return roles.includes(session.activeRole);
}
