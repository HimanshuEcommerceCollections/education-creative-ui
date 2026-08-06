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
 * `server/src/contracts` stays the single source of truth. The copies carry a
 * do-not-edit banner and are refreshed by the `predev` and `prebuild` hooks, so
 * they can't drift on a normal build. If you edit a contract during a long-running
 * `next dev`, re-run `npm run contracts:sync`.
 *
 * **The copies are committed**, which looks redundant but isn't: the API is a
 * separate repository, and a CI or Vercel build clones only this one. With nothing
 * to copy from, the build has to use what's in the tree. When the sibling *is*
 * present the copies are regenerated, so a stale commit shows up as a git diff.
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

/** How many committed contract files are already in place. */
async function committedFileCount() {
  try {
    const existing = await readdir(TARGET, { withFileTypes: true });
    return existing.filter((entry) => entry.isFile() && entry.name.endsWith(".ts")).length;
  } catch {
    return 0;
  }
}

async function main() {
  let entries;
  try {
    entries = await readdir(SOURCE, { withFileTypes: true });
  } catch {
    /*
     * No sibling API checkout. This is the normal case on Vercel and CI, which
     * clone this repository alone — so fall back to the committed copies rather
     * than failing the build, which is what broke the first preview deployment.
     *
     * Only an actual absence of contracts is fatal.
     */
    const committed = await committedFileCount();

    if (committed > 0) {
      console.log(
        `sync-contracts: no sibling server/ checkout — using ${committed} committed file(s) ` +
          "in src/generated/contracts",
      );
      return;
    }

    console.error(
      [
        "",
        "sync-contracts: no API contracts to build against.",
        `  looked in: ${SOURCE}`,
        `  and found nothing committed in: ${TARGET}`,
        "",
        "  The API is a separate repository. Either clone it as a sibling of this",
        "  one and re-run, or commit the generated copies:",
        "",
        "    <parent>/",
        "      client/   <- this repo (education-creative-ui)",
        "      server/   <- git@github.com:HimanshuEcommerceCollections/education-creative.git",
        "",
        "  git clone git@github.com:HimanshuEcommerceCollections/education-creative.git server",
        "",
      ].join("\n"),
    );
    process.exit(1);
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
    /*
     * Normalised to LF rather than copied verbatim.
     *
     * The source files are in a different repository with its own checkout, so on
     * Windows their line endings depend on that repo's autocrlf setting and on
     * whether a given file was last written by git or by an editor. Copying bytes
     * through made the output non-deterministic: identical contracts produced
     * different bytes here depending on which, so the copies showed as modified
     * for no real reason. `.gitattributes` pins this directory to LF; this makes
     * the script agree.
     */
    const normalised = contents.replace(/\r\n/g, "\n");
    await writeFile(path.join(TARGET, file), BANNER + normalised, "utf8");
  }

  console.log(`sync-contracts: ${files.length} file(s) → src/generated/contracts`);
}

await main();
