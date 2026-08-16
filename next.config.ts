import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Content Security Policy.
 *
 * There was none — not a header, not a nonce, on an app that mounts Stripe and
 * handles children's first names and home addresses. The docs name
 * `components/arts/origami-fold.tsx` (`dangerouslySetInnerHTML`) as an XSS launch
 * blocker whose stated mitigation was CSP plus sanitisation; this is the CSP half.
 *
 * **Why headers here and not a nonce in `proxy.ts`.** A nonce has to be minted per
 * request, which forces every page into dynamic rendering — the whole statically
 * rendered marketing site included, and PPR with it. That is a real cost for a
 * marketing site whose scripts are all first-party, so this takes the documented
 * no-nonce route and accepts `'unsafe-inline'` on scripts: Next's own bootstrap and
 * flight payloads are inline, and without a nonce there is nothing to allow them by.
 * The value is still that every *other* directive is locked to `'self'` plus the two
 * Stripe origins, so an injected `<script src>` or a `fetch` to an attacker's host is
 * blocked even though an injected inline script would not be. If this app later needs
 * to survive a script injection, the upgrade is nonces in the proxy — not loosening
 * anything below.
 *
 * `style-src` needs `'unsafe-inline'` for a plainer reason: React renders `style`
 * attributes (the rating-free profile bars, the reveal transforms), and an inline
 * style attribute has no other way to be allowed.
 *
 * Stripe's requirements, from their documented CSP guidance:
 * - `script-src  https://js.stripe.com`      — Stripe.js itself
 * - `frame-src   https://js.stripe.com https://hooks.stripe.com https://m.stripe.network`
 *                                            — the Checkout/Elements iframes, 3DS
 *                                              challenges, and the hidden frame
 *                                              Stripe.js uses for fraud signals
 * - `connect-src https://api.stripe.com`     — tokenisation and confirmation calls
 *
 * Deliberately *not* allowed: `https://q.stripe.com`, which is Stripe's own metrics
 * beacon. Blocking it costs a console warning and nothing else, and this app has no
 * business sending anything to a third party from a page holding a child's address.
 *
 * `frame-ancestors 'none'` because nothing here should ever be embedded — that is
 * the clickjacking defence for a page with a pay button on it.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  // See the note above: inline is required without a nonce; `eval` only in dev,
  // where React uses it to reconstruct server stacks in the browser.
  `script-src 'self' 'unsafe-inline' https://js.stripe.com${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  // Local assets; `data:`/`blob:` for next/image's own output.
  "img-src 'self' data: blob:",
  // next/font self-hosts at build, so fonts are same-origin.
  "font-src 'self'",
  "media-src 'self'",
  // `ws:` is the dev server's HMR socket and must not be in the production policy.
  `connect-src 'self' https://api.stripe.com${isDev ? " ws: wss:" : ""}`,
  "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://m.stripe.network",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  // Server Actions post to this origin only.
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

/**
 * The rest of the security headers.
 *
 * `Strict-Transport-Security` is production-only: sending it from a dev server
 * pins localhost to https in the browser's HSTS store, which then refuses to load
 * `http://localhost:3000` until it's manually cleared.
 */
const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Belt and braces with `frame-ancestors`, for anything that predates CSP 2.
  { key: "X-Frame-Options", value: "DENY" },
  {
    // Nothing here uses any of these, and a booking form is not the place to
    // leave them available to injected script.
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  ...(isDev
    ? []
    : [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]),
];

const nextConfig: NextConfig = {
  /*
   * Deliberately no `turbopack.root` override.
   *
   * The shared API contracts are synced into `src/generated/contracts` by
   * `scripts/sync-contracts.mjs` precisely so everything Turbopack bundles lives
   * inside this directory. Pointing the root at the workspace parent to import
   * `../server/src/contracts` directly does work, but it pulls both node_modules
   * trees into the watched set — measured at a 105-second cold compile and enough
   * memory pressure that `next dev` restarted itself mid-request.
   */

  /** The version banner is free reconnaissance. */
  poweredByHeader: false,

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
