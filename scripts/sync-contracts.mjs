/**
 * Copies the API's shared contracts into `src/generated/contracts/`.
 *
 * Why a copy rather than importing across directories: Turbopack refuses to
 * resolve files outside its project root, and pointing `turbopack.root` at the
 * workspace parent to work around it pulls both `node_modules` trees into the
 * watched set — that measured a 105-second cold compile and enough memory
 * pressure that `next dev` restarted itself. Keeping every bundled file inside
 * `client/` avoids all of it.
 *
 * `server/src/contracts` stays the single source of truth. The copies are
 * gitignored, carry a do-not-edit banner, and are refreshed by the `predev` and
 * `prebuild` hooks, so they can't drift on a normal build. If you edit a contract
 * during a long-running `next dev`, re-run `npm run contracts:sync`.
 *
 * Plain Node ESM with no dependencies so it can run before anything is built.
 */
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const SOURCE = path.join(import.meta.dirname, "..", "..", "server", "src", "contracts");
const TARGET = path.join(import.meta.dirname, "..", "src", "generated", "contracts");

const BANNER = `// ---------------------------------------------------------------------------
// GENERATED FILE — DO NOT EDIT.
// Copied from server/src/contracts by client/scripts/sync-contracts.mjs.
// Edit the original in the server and re-run \`npm run contracts:sync\`.
// ---------------------------------------------------------------------------
`;

async function main() {
  let entries;
  try {
    entries = await readdir(SOURCE, { withFileTypes: true });
  } catch (error) {
    console.error(
      `sync-contracts: could not read ${SOURCE}\n` +
        "Is the sibling server/ directory present?",
    );
    throw error;
  }

  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".ts"))
    .map((entry) => entry.name);

  if (files.length === 0) {
    throw new Error(`sync-contracts: no .ts files found in ${SOURCE}`);
  }

  // Cleared first so a contract deleted upstream doesn't linger here and keep
  // typechecking against something the API no longer honours.
  await rm(TARGET, { recursive: true, force: true });
  await mkdir(TARGET, { recursive: true });

  for (const file of files) {
    const contents = await readFile(path.join(SOURCE, file), "utf8");
    await writeFile(path.join(TARGET, file), BANNER + contents, "utf8");
  }

  console.log(`sync-contracts: ${files.length} file(s) → src/generated/contracts`);
}

await main();
