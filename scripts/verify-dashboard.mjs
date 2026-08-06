/**
 * Verifies the dashboard route group renders the right sidebar for each role, and
 * that the coordinator really does see a subset of the admin's navigation.
 *
 * Creates its own accounts through the API, then grants staff roles directly in
 * the database (there's no role-grant endpoint yet — that's Phase 2 admin work).
 *
 *   node scripts/verify-dashboard.mjs
 *
 * Needs both dev servers running, and DATABASE_URL from ../server/.env.
 */
import { execFileSync } from "node:child_process";
import path from "node:path";

const API = process.env.E2E_API ?? "http://127.0.0.1:4100";
const WEB = process.env.E2E_WEB ?? "http://127.0.0.1:3001";
const SERVER_DIR = path.join(import.meta.dirname, "..", "..", "server");
const RUN = `dash${Date.now().toString().slice(-6)}`;
const PASSWORD = "a-strong-passphrase";

let failures = 0;
const ok = (label, condition, detail = "") => {
  if (!condition) failures += 1;
  console.log(`${condition ? "PASS" : "FAIL"}  ${label}${detail ? `  (${detail})` : ""}`);
};
const section = (t) => console.log(`\n— ${t} —`);

/**
 * "This role must NOT see X" is only meaningful on a page that actually rendered
 * — on an empty body every such check passes for the wrong reason. Guarding it
 * here rather than at each call site so the suite can't report false confidence.
 */
const absent = (page, label, needle) => {
  if (page.status !== 200) {
    failures += 1;
    console.log(`FAIL  ${label}  (page did not render — status ${page.status}, check is vacuous)`);
    return;
  }
  ok(label, !page.text.includes(needle));
};

async function signup(email) {
  const response = await fetch(`${API}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: `Nav ${email.split(".")[0]}`,
      email,
      password: PASSWORD,
      consentGiven: true,
    }),
  });
  return response.json();
}

async function login(email) {
  const response = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: PASSWORD }),
  });
  return response.json();
}

/**
 * Grants a role using the server's own CLI, rather than inlining SQL through a
 * shell — a previous version passed a multi-line `--eval` script with
 * `shell: true`, which Windows mangled into a silent no-op that made every
 * downstream check fail confusingly.
 */
function grantRole(email, role) {
  // Invoke tsx's entry with the current node binary. Going through `npx` means
  // spawning `npx.cmd`, which Node 24 refuses without a shell (EINVAL), and
  // enabling the shell is what corrupted the arguments in the first place.
  const tsxCli = path.join(SERVER_DIR, "node_modules", "tsx", "dist", "cli.mjs");
  const output = execFileSync(
    process.execPath,
    [tsxCli, "scripts/grant-role.ts", email, role],
    {
      cwd: SERVER_DIR,
      encoding: "utf8",
      stdio: "pipe",
      env: { ...process.env, LOG_LEVEL: "info" },
    },
  );
  if (!/role granted|already held/.test(output)) {
    throw new Error(`grant-role did not confirm the grant for ${email}:\n${output}`);
  }
}

/** Fetches a page as this session and returns its visible text plus raw HTML. */
async function fetchPage(url, token) {
  const response = await fetch(url, {
    headers: { Cookie: `ylj_session=${token}` },
    redirect: "manual",
  });
  const html = response.status < 300 ? await response.text() : "";
  const text = html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&[a-z]+;/g, " ")
    .replace(/\s+/g, " ");
  return { status: response.status, location: response.headers.get("location"), text, html };
}

// ---------------------------------------------------------------------------

const coordinatorEmail = `coord.${RUN}@example.com`;
const educatorEmail = `edu.${RUN}@example.com`;
const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@yourlearningjourney.test";
const adminPassword = process.env.SEED_ADMIN_PASSWORD;

section("setup");
await signup(coordinatorEmail);
await signup(educatorEmail);
grantRole(coordinatorEmail, "coordinator");
grantRole(educatorEmail, "educator");
ok("coordinator and educator accounts prepared", true);

const coordinator = await login(coordinatorEmail);
const educator = await login(educatorEmail);
ok("coordinator lands on /dashboard", coordinator.redirectTo === "/dashboard", coordinator.redirectTo);
ok("educator lands on /educator", educator.redirectTo === "/educator", educator.redirectTo);

const adminLogin = await fetch(`${API}/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: adminEmail, password: adminPassword }),
}).then((r) => r.json());
ok("admin signed in", Boolean(adminLogin.token), adminLogin?.error?.code ?? "ok");

const ADMIN_ONLY_ITEMS = ["Pricing & rate bands", "Site configuration", "Staff & roles"];
const OPS_ITEMS = ["Overview", "Educator applications", "Bookings", "Teams", "Reviews", "Payouts"];

section("admin sidebar");
const adminPage = await fetchPage(`${WEB}/dashboard`, adminLogin.token);
ok("/dashboard renders for admin", adminPage.status === 200, `status ${adminPage.status}`);
ok("role badge reads Administrator", adminPage.text.includes("Administrator"));
ok("Operations section present", adminPage.text.includes("Operations"));
ok("Administration section present", adminPage.text.includes("Administration"));
for (const item of ADMIN_ONLY_ITEMS) {
  ok(`admin sees "${item}"`, adminPage.text.includes(item));
}
for (const item of OPS_ITEMS) {
  ok(`admin sees "${item}"`, adminPage.text.includes(item));
}
ok(
  "marketing footer is absent (own layout, not the site chrome)",
  !adminPage.text.includes("Trusted independent educators"),
);

section("coordinator sidebar — must be a strict subset");
const coordPage = await fetchPage(`${WEB}/dashboard`, coordinator.token);
ok("/dashboard renders for coordinator", coordPage.status === 200, `status ${coordPage.status}`);
ok("role badge reads Coordinator", coordPage.text.includes("Coordinator"));
ok("Operations section present", coordPage.text.includes("Operations"));
absent(coordPage, "Administration section is absent entirely", "Administration");
for (const item of ADMIN_ONLY_ITEMS) {
  absent(coordPage, `coordinator does NOT see "${item}"`, item);
}
for (const item of OPS_ITEMS) {
  ok(`coordinator sees "${item}"`, coordPage.text.includes(item));
}

section("educator sidebar");
const eduPage = await fetchPage(`${WEB}/educator`, educator.token);
ok("/educator renders for educator", eduPage.status === 200, `status ${eduPage.status}`);
ok("role badge reads Educator", eduPage.text.includes("Educator"));
ok("Teaching section present", eduPage.text.includes("Teaching"));
for (const item of ["My sessions", "Earnings", "My profile"]) {
  ok(`educator sees "${item}"`, eduPage.text.includes(item));
}
for (const item of [...ADMIN_ONLY_ITEMS, "Educator applications", "Payouts"]) {
  absent(eduPage, `educator does NOT see "${item}"`, item);
}

section("cross-role access");
const eduAtDashboard = await fetchPage(`${WEB}/dashboard`, educator.token);
ok("educator is redirected away from /dashboard", eduAtDashboard.status === 307, `status ${eduAtDashboard.status} → ${eduAtDashboard.location}`);
const eduAtApplications = await fetchPage(`${WEB}/dashboard/applications`, educator.token);
ok("educator is redirected away from the queue", eduAtApplications.status === 307, `status ${eduAtApplications.status} → ${eduAtApplications.location}`);
const adminAtEducator = await fetchPage(`${WEB}/educator`, adminLogin.token);
ok("admin is redirected away from /educator", adminAtEducator.status === 307, `→ ${adminAtEducator.location}`);
const noCookie = await fetch(`${WEB}/dashboard/applications`, { redirect: "manual" });
ok("no cookie is bounced to /login", noCookie.status === 307, `→ ${noCookie.headers.get("location")}`);

section("applications page");
const queue = await fetchPage(`${WEB}/dashboard/applications`, coordinator.token);
ok("coordinator can open the queue", queue.status === 200, `status ${queue.status}`);
ok("approve control is present", queue.html.includes("Approve &amp; send invite"));
ok("background check field is present", queue.html.includes('name="backgroundCheckRef"'));

section("active nav state");
ok(
  "queue page marks its nav item current",
  queue.html.includes('aria-current="page"'),
);
ok(
  "overview marks its nav item current",
  coordPage.html.includes('aria-current="page"'),
);

console.log(failures === 0 ? `\nAll dashboard checks passed.\n` : `\n${failures} failed.\n`);
process.exit(failures === 0 ? 0 : 1);
