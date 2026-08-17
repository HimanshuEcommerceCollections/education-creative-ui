/**
 * The session cookie's name and flags — the **one** definition both runtimes use.
 *
 * Deliberately free of `server-only` and of `next/headers`: `proxy.ts` runs in its
 * own runtime and cannot import either, and the previous arrangement (a default
 * inlined here, a second copy inlined in the proxy) meant a changed
 * `SESSION_COOKIE_NAME` could leave the proxy looking for one name while the
 * cookie was written under another — every signed-in user bounced to `/login`
 * while holding a perfectly valid session.
 *
 * One caveat that no amount of sharing removes: Next inlines `process.env` reads
 * into the proxy bundle at build time, so changing this variable needs a rebuild,
 * not just a restart. Sharing the module is what makes the two agree *after* that
 * rebuild instead of only by coincidence.
 */
export const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? "ylj_session";

/**
 * Whether to mark the cookie `Secure`.
 *
 * Not "required by the `__Host-` prefix" — the default name carries no prefix.
 * It's required because the cookie *is* the session credential, and a plain-http
 * request would put it on the wire.
 *
 * Derived the way the server derives `isProductionLike`: `NODE_ENV` **or**
 * `VERCEL_ENV`. Keying it on `NODE_ENV` alone is the exact trap the server
 * hardened against — on the first Vercel deployment `NODE_ENV` was not
 * `"production"`, which silently switched off every guard that depended on it.
 * Left off locally so the cookie survives plain http:// over a LAN address.
 */
export const SESSION_COOKIE_SECURE =
  process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";
