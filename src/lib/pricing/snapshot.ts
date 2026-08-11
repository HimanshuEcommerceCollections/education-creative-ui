import "server-only";

import type { PricingSnapshot } from "@contracts/pricing.ts";

import { apiFetch } from "@/lib/api/server";
import { formatMoney } from "@/lib/booking/pricing";

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

/**
 * Overlays admin-set rates onto a subject landing page's featured educators.
 *
 * Those entries carry the educator's slug as `id` and their price as a rendered
 * string (`"$60/hr"`), so this resolves a rate and rewrites the label rather
 * than handing the card a number to format.
 *
 * The rate for *this* subject wins. Failing that, an educator holding exactly
 * one rate on the platform is unambiguous, so that rate is used — it is the same
 * figure browse and their profile show, which is the drift this closes. An
 * educator with rates in other subjects but none here keeps the in-repo string:
 * better a stale price than confidently printing a cooking rate on the music
 * page. Same as every other snapshot read, no snapshot means no change.
 */
export function withLiveRates<T extends { id: string; price: string }>(
  educators: T[],
  snapshot: PricingSnapshot | null,
  subjectSlug: string,
): T[] {
  if (!snapshot) return educators;

  return educators.map((educator) => {
    const held = snapshot.educatorRates.filter(
      (rate) => rate.educatorSlug === educator.id,
    );
    const rate =
      held.find((candidate) => candidate.subjectSlug === subjectSlug) ??
      (held.length === 1 ? held[0] : undefined);

    return rate ? { ...educator, price: `${formatMoney(rate.rateCents)}/hr` } : educator;
  });
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
