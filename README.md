# Client — Next.js app

Next.js 16 (App Router, Turbopack) marketing site and signed-in surfaces. Also the
**BFF**: the browser talks only to this origin, and this app forwards the session
to the Node API in `../server` as a Bearer header. The browser never holds a token
and never learns the API's origin (`docs/ARCHITECTURE.md` §4).

## Getting started

**The API lives in a separate repository and must be cloned as a sibling of this
one** — the shared contracts this app imports come from there, so a clone of this
repo alone will not build.

```bash
mkdir "education-creative" && cd "education-creative"
git clone git@github.com:HimanshuEcommerceCollections/education-creative-ui.git client
git clone git@github.com:HimanshuEcommerceCollections/education-creative.git   server

cd client
cp .env.example .env.local     # check API_BASE_URL matches the server's PORT
npm install
npm run dev                    # http://localhost:3000
```

The directory names matter: `scripts/sync-contracts.mjs` looks for
`../server/src/contracts` and exits with instructions if it isn't there.

The API has to be running too — see `../server/README.md`.

`predev` / `prebuild` / `pretypecheck` run `contracts:sync` automatically.

## Shared contracts

`src/generated/contracts/` is **generated** — copied from `../server/src/contracts`
by `scripts/sync-contracts.mjs`, gitignored, and imported as `@contracts/*`. The
server owns the originals, so request shapes, password rules, role precedence,
consent copy, and error codes have exactly one definition.

Because that source is in the other repository, the two repos are coupled: a
contract change in the API is a breaking change here until the sync runs. Land
API contract edits first, then pull the server repo and re-run
`npm run contracts:sync` before relying on them.

If you edit a contract during a long-running `npm run dev`, re-run
`npm run contracts:sync` — the hooks only fire at startup.

Why a copy rather than a cross-directory import: Turbopack won't resolve files
outside its project root, and setting `turbopack.root` to the workspace parent to
get around that pulls both `node_modules` trees into the watched set. Measured
result was a **105-second cold compile** and enough memory pressure that
`next dev` restarted itself mid-request. Keeping everything bundled inside
`client/` avoids it.

## Auth surfaces

| Route | Rendering | Notes |
|---|---|---|
| `/login` | dynamic | **One sign-in page for all four roles.** Sends an existing session to its role's home. |
| `/signup` | static | Customers only. Educators apply; staff are invited. |
| `/forgot-password` · `/reset-password` | static / dynamic | |
| `/verify-email` | dynamic | Confirms on a button press, not on load — the token is single-use and mail scanners prefetch links. |
| `/accept-invite` | dynamic | Set-password for approved educators and invited staff. |
| `/account` | dynamic | Customer home. Stays in `(site)` with the public chrome. |
| `/dashboard` · `/dashboard/applications` | dynamic | Admin + coordinator. |
| `/educator` | dynamic | Approved educators. |
| `/api/session-summary` | dynamic | Just enough for the header to show an account link. |

Everything else stays statically rendered, deliberately: the header reads the
session through a **fetch** to `/api/session-summary` rather than `getSession()` in
the `(site)` layout, because `cookies()` in a layout opts every page beneath it into
dynamic rendering and would deopt the entire marketing site.

## Route groups

| Group | Chrome | Contains |
|---|---|---|
| `(site)` | canonical `Header` + `Footer` | marketing pages, and `/account` — a parent moves between their account and the public pages constantly |
| `(auth)` | none | `/login`, `/signup`, and the token flows |
| `(dashboard)` | **persistent sidebar, no marketing chrome** | `/dashboard*` (staff) and `/educator*` |

The dashboard sidebar is defined in [src/data/dashboard-nav.ts](src/data/dashboard-nav.ts)
and gated per role: coordinators get the **Operations** section; admins get that
plus **Administration** (pricing & rate bands, site configuration, staff & roles).
Filtering happens on the server, so an item a role can't use never reaches the
browser — and a section left empty disappears entirely, which is why a coordinator
sees no "Administration" heading at all.

Items whose feature hasn't shipped render **disabled with a phase badge** rather
than as links that would 404. On mobile the sidebar becomes an off-canvas drawer.

`(dashboard)/layout.tsx` gates broadly — a session, and for staff a satisfied
second factor. Each page keeps its own role check too: a layout runs once for a
whole subtree, so it can't be the only thing between a coordinator and an
admin-only page. The API remains the real enforcement point.

### Site configuration

[/dashboard/config](<src/app/(dashboard)/dashboard/config/page.tsx>) edits the
API's `config_settings` store — booking window, checkout and confirmation SLA,
refund policy, platform economics, and the feature switches. The editors are
entirely **data-driven**: labels, help, bounds and defaults all arrive on the API
response, so no copy of the registry (and therefore no copy of the take rate)
ever reaches a browser bundle. A save busts the `config` fetch tag.

Two public reads come out of that tag, both through
[src/lib/config/snapshot.ts](src/lib/config/snapshot.ts):

- `bookingRules(...)` — the notice window, how far ahead the calendar opens, and
  the confirmation SLA. The booking page passes these into `BookingFlow` as
  `rules`; nothing in the flow imports the numbers directly any more, which is
  what keeps the greyed-out calendar days and the refund promise beside the pay
  button moving together. `DEFAULT_BOOKING_RULES` in
  [src/data/booking.ts](src/data/booking.ts) is the fallback when the API can't
  answer, and matches the server's own shipped defaults.
- `configFlags(...)` — `/book` and the educator application form render a
  `PausedNotice` in place of the form when their switch is off. Flags default to
  **on** when the API is unreachable: a network blip is not an instruction to
  close the doors, and the API refuses a paused submission regardless.

## How a form reaches the API

1. A Client Component form posts to a Server Action in `src/app/(auth)/actions.ts`.
2. The action validates against the **shared** contract schema, so the client can't
   accept something the server will reject.
3. `callApi` forwards the request, plus the real client IP and user agent — the API
   stamps those onto consent records and audit rows.
4. On success the action writes the opaque token to an HttpOnly cookie and returns a
   server-computed `redirectTo`.
5. The form plays its confirmation animation, then navigates. Nothing in the browser
   derives that destination from a role it could tamper with.

Failures return `AuthFormState` carrying a `message`, optional per-field
`fieldErrors`, and the contract's error `code` — so forms render messages inline and
can react to specific cases (an expired reset link offers a fresh one).

## `proxy.ts`

Coarse cookie-presence redirects for `/account`, `/dashboard`, and `/educator`, and
nothing else. It **is not the security boundary** and must not become one: it can't
tell a valid session from a forged cookie value or know the user's role. Real
enforcement is the API's role guards, with each
page's `getSession()` as a second gate.

## Verified

Typecheck, lint, and `next build` are clean, and the BFF was exercised against a
real database. The action helpers set an `HttpOnly`, `SameSite=Lax`, `Path=/` cookie
holding a 32-character opaque token that never appears in the response body, and the
redirect matrix behaves: no cookie bounces to `/login?next=…`; a customer is turned
away from `/dashboard` and `/educator`; an admin is turned away from `/account`; a
signed-in visitor is redirected off `/login`; and an expired staff session (45-minute
idle window) falls back to `/login`.

**Not covered by automation:** the browser→Server Action hop itself. Replaying
React's internal action-dispatch format outside a browser proved unreliable, so that
one step needs a manual click-through or a browser-driving tool to confirm.
