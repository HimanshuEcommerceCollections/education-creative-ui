import "server-only";

import { cookies, headers } from "next/headers";

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? "ylj_session";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

/**
 * Session cookie handling. The token never reaches client JavaScript, so an XSS
 * cannot exfiltrate a credential — the main reason the BFF is worth the extra hop.
 *
 * `set` and `delete` only work inside a Server Action or Route Handler; a Server
 * Component cannot modify cookies (headers are already streaming by then).
 */
export async function readSessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}

export async function writeSessionCookie(token: string, expiresAt: Date): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    // Required by the `__Host-` prefix in production. Left off in development so
    // the cookie survives plain http:// over a LAN address.
    secure: IS_PRODUCTION,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/**
 * The real client's IP and user agent, for the API to stamp onto consent records
 * and audit rows. Without this every record would show the Vercel edge address.
 */
export async function clientRequestMeta(): Promise<{
  clientIp: string | null;
  clientUserAgent: string | null;
}> {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");

  return {
    // Left-most entry is the original client; the rest are proxies.
    clientIp: forwardedFor?.split(",")[0]?.trim() ?? headerList.get("x-real-ip") ?? null,
    clientUserAgent: headerList.get("user-agent"),
  };
}

export { COOKIE_NAME as SESSION_COOKIE_NAME };
