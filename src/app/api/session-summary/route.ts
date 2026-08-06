import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth/session";

/**
 * The minimum the header needs to show an account link instead of "Sign in".
 *
 * This exists as a route handler rather than being read in the `(site)` layout on
 * purpose: `cookies()` in a layout opts every page under it into dynamic
 * rendering, which would deopt the whole statically-rendered marketing site for
 * the sake of one nav item. The shell stays static and this fills in after hydration.
 *
 * Deliberately minimal — no email, no roles, nothing beyond what the nav renders.
 * The session cookie is HttpOnly, so this is also the only way client JS can learn
 * whether anyone is signed in.
 */
export async function GET() {
  const session = await getSession();

  const body = session
    ? {
        signedIn: true as const,
        firstName: session.user.fullName.split(" ")[0] ?? "",
        isStaff: session.isStaff,
        activeRole: session.activeRole,
        emailVerified: session.user.emailVerified,
      }
    : { signedIn: false as const };

  return NextResponse.json(body, {
    // Per-user and cheap. Caching it would show one visitor another's state.
    headers: { "Cache-Control": "private, no-store" },
  });
}
