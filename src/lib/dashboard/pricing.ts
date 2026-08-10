import "server-only";

import type { PricingAdminView } from "@contracts/pricing.ts";

import { ApiError, apiFetch } from "@/lib/api/server";
import { readSessionToken } from "@/lib/auth/cookies";

export interface PricingAdminData {
  view: PricingAdminView | null;
  error: string | null;
}

/**
 * The admin's current pricing state — bands, educator rates, format policy.
 * Failure comes back as data so the page renders an inline notice, same shape
 * as the other dashboard loaders.
 */
export async function loadPricingAdmin(): Promise<PricingAdminData> {
  const token = await readSessionToken();

  try {
    const view = await apiFetch<PricingAdminView>("/pricing/admin", { token });
    return { view, error: null };
  } catch (error) {
    return {
      view: null,
      error:
        error instanceof ApiError
          ? error.message
          : "We couldn't load pricing just now.",
    };
  }
}
