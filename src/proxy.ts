import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? "ylj_session";

/** Routes that make no sense without a session. */
const PROTECTED_PREFIXES = ["/account", "/dashboard", "/educator"];

/**
 * Coarse cookie-presence redirect, and **nothing more**.
 *
 * This is not the security boundary and must never become one. It cannot tell a
 * valid session from a forged cookie value, know the user's role, or see whether
 * a staff session has cleared its second factor — verifying any of that means
 * calling the API, and Proxy explicitly isn't for data fetching.
 *
 * Real enforcement lives in two places: the API's `requireFullAuth` / role guards,
 * and the `getSession()` checks in each protected page. What this saves is a
 * pointless render for a visitor who obviously isn't signed in.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSessionCookie = request.cookies.has(COOKIE_NAME);

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isProtected && !hasSessionCookie) {
    const url = new URL("/login", request.url);
    // Preserve where they were headed so login can return them there once the
    // page-level checks confirm the session is real.
    url.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // `:path*` matches zero or more segments, so these cover the section roots
  // (/dashboard) as well as their children (/dashboard/applications).
  matcher: ["/account/:path*", "/dashboard/:path*", "/educator/:path*"],
};
