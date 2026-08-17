import "server-only";

import { cookies, headers } from "next/headers";

import { SESSION_COOKIE_NAME, SESSION_COOKIE_SECURE } from "./cookie-config";

/**
 * Session cookie handling. The token never reaches client JavaScript, so an XSS
 * cannot exfiltrate a credential — the main reason the BFF is worth the extra hop.
 *
 * The name and the `secure` flag come from `cookie-config.ts`, which `proxy.ts`
 * imports too: the proxy decides whether to redirect purely on this cookie's
 * presence, so the two must never be able to disagree about what it's called.
 *
 * `set` and `delete` only work inside a Server Action or Route Handler; a Server
 * Component cannot modify cookies (headers are already streaming by then).
 */
export async function readSessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE_NAME)?.value ?? null;
}

export async function writeSessionCookie(token: string, expiresAt: Date): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: SESSION_COOKIE_SECURE,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE_NAME);
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

export { SESSION_COOKIE_NAME };
