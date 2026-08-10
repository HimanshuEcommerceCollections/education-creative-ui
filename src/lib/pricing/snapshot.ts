import "server-only";

import type { PricingSnapshot } from "@contracts/pricing.ts";

import { apiFetch } from "@/lib/api/server";

/**
 * The public pricing snapshot — the one read every displayed price comes from.
 *
 * Cached under the `pricing` tag with a five-minute backstop; the pricing admin
 * actions call `revalidateTag("pricing")` on every successful write, so an
 * admin edit reaches the site on the next request rather than the next deploy.
 *
 * Returns null when the API can't answer (including at build time with no API
 * running). Callers keep their hardcoded figure in that case — a marketing page
 * must degrade to yesterday's price, never to a broken one.
 */
export async function loadPricingSnapshot(): Promise<PricingSnapshot | null> {
  try {
    return await apiFetch<PricingSnapshot>("/pricing/snapshot", {
      next: { revalidate: 300, tags: ["pricing"] },
    });
  } catch {
    return null;
  }
}

/** Educator hourly rates in whole dollars, keyed by slug. */
export function ratesBySlug(snapshot: PricingSnapshot | null): Record<string, number> {
  if (!snapshot) return {};
  const rates: Record<string, number> = {};
  for (const rate of snapshot.educatorRates) {
    rates[rate.educatorSlug] = rate.rateCents / 100;
  }
  return rates;
}

/** Band minimums ("from" prices) in whole dollars, keyed by subject slug. */
export function fromRatesBySubject(
  snapshot: PricingSnapshot | null,
): Record<string, number> {
  if (!snapshot) return {};
  const mins: Record<string, number> = {};
  for (const band of snapshot.bands) {
    mins[band.subjectSlug] = band.minCents / 100;
  }
  return mins;
}
