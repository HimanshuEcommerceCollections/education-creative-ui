import "server-only";

import { cache } from "react";

import type { SessionResponse } from "@contracts/auth.ts";
import type { UserRole } from "@contracts/roles.ts";

import { ApiError, apiFetch } from "@/lib/api/server";

import { readSessionToken } from "./cookies";

/**
 * Reads the current session, or null. Wrapped in React's `cache` so a page with
 * a dozen server components that each need the user costs exactly one API call
 * per request.
 *
 * **The API is the authoritative verifier** — this only forwards the cookie. A
 * present cookie proves nothing on its own, which is why `proxy.ts` is never the
 * security boundary.
 */
export const getSession = cache(async (): Promise<SessionResponse | null> => {
  const token = await readSessionToken();
  if (!token) return null;

  try {
    return await apiFetch<SessionResponse>("/auth/session", { token });
  } catch (error) {
    // An expired or revoked session is an ordinary outcome, not a failure.
    if (error instanceof ApiError && error.status === 401) return null;
    // Anything else (API down, 500) must not render the app as signed-in.
    return null;
  }
});

/** True only when every precondition for acting as the active role is met. */
export async function isFullyAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session?.fullyAuthenticated === true;
}

export async function getActiveRole(): Promise<UserRole | null> {
  const session = await getSession();
  return session?.activeRole ?? null;
}

export async function hasRole(...roles: UserRole[]): Promise<boolean> {
  const session = await getSession();
  if (!session?.fullyAuthenticated) return false;
  return roles.includes(session.activeRole);
}
