/**
 * `?next=` handling — the one place a post-login destination is vetted.
 *
 * `proxy.ts` writes the deep link a visitor was refused, and the login page reads
 * it back. That parameter is attacker-controlled, so it is never handed to a
 * router unchecked: an open redirect on a sign-in page is how a phishing link
 * borrows a real domain to land someone on a fake one.
 *
 * No `server-only` here — the login form is a Client Component and vets the value
 * it was handed rather than trusting the prop.
 */

/** Auth routes. Returning to one of these after signing in is a loop, not a destination. */
const AUTH_PREFIXES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/accept-invite",
];

/** The base a candidate is parsed against. Any value that escapes it is rejected. */
const RELATIVE_BASE = "https://relative.invalid";

/** ASCII control characters, which can smuggle a payload past a naive check. */
function hasControlCharacter(value: string): boolean {
  for (const character of value) {
    const code = character.codePointAt(0) ?? 0;
    if (code < 0x20 || code === 0x7f) return true;
  }
  return false;
}

/**
 * A root-relative, same-origin path, or `null`.
 *
 * Rejects anything that could leave this origin or be read as an authority by a
 * URL parser:
 *
 * - no scheme (`https://evil.test`, `javascript:…`, `data:…`)
 * - no protocol-relative `//evil.test` — and no `/\evil.test`, which several
 *   browsers normalise to the same thing
 * - no backslashes anywhere, for the same reason
 * - no control characters
 * - no auth route, so login can't send someone back to login
 */
export function safeNextPath(raw: string | null | undefined): string | null {
  if (typeof raw !== "string") return null;

  const value = raw.trim();
  if (value.length === 0 || value.length > 512) return null;

  // A path, not a URL, and not an authority in disguise.
  if (!value.startsWith("/")) return null;
  if (value.startsWith("//")) return null;
  if (value.includes("\\")) return null;
  if (hasControlCharacter(value)) return null;

  // Parsed against a throwaway base, a safe value must stay on that origin.
  let parsed: URL;
  try {
    parsed = new URL(value, RELATIVE_BASE);
  } catch {
    return null;
  }
  if (parsed.origin !== RELATIVE_BASE) return null;

  const isAuthRoute = AUTH_PREFIXES.some(
    (prefix) => parsed.pathname === prefix || parsed.pathname.startsWith(`${prefix}/`),
  );
  if (isAuthRoute) return null;

  return `${parsed.pathname}${parsed.search}`;
}

/**
 * `/login`, carrying the caller's own location so login can return them.
 *
 * Used by the session-expiry notice: a coordinator whose staff session idled out
 * lands back on the row they were working, not on the marketing homepage.
 */
export function loginHrefWithNext(path: string | null | undefined): string {
  const next = safeNextPath(path);
  return next ? `/login?next=${encodeURIComponent(next)}` : "/login";
}
