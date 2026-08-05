import type { NextConfig } from "next";

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
};

export default nextConfig;
