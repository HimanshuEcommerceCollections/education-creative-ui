"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import {
  setEducatorRateSchema,
  updateFormatPolicySchema,
  upsertRateBandSchema,
} from "@contracts/pricing.ts";

import { callApiAuthed, parseForm, text, toErrorState } from "@/lib/auth/action-helpers";
import type { AuthFormState } from "@/lib/auth/form-state";

/**
 * Admin actions on pricing rules. Authorisation lives at the API
 * (`requireRole("admin")`) — these only forward the session.
 *
 * Every successful write busts the `pricing` fetch tag: the public pages
 * (browse, profiles, services, the booking estimate) all read the snapshot
 * through that tag, so an admin edit is live on the site as soon as the next
 * request lands — no redeploy, no manual purge.
 */

/** "55" or "55.50" → integer cents; null for anything that isn't money. */
function parseDollars(raw: string): number | null {
  const value = raw.trim().replace(/^\$/, "");
  if (!/^\d+(\.\d{1,2})?$/.test(value)) return null;
  return Math.round(Number.parseFloat(value) * 100);
}

function moneyField(
  formData: FormData,
  name: string,
): { ok: true; cents: number } | { ok: false; state: AuthFormState } {
  const cents = parseDollars(text(formData, name));
  if (cents === null) {
    return {
      ok: false,
      state: {
        status: "error",
        message: "Please check the highlighted fields.",
        fieldErrors: { [name]: "Enter a dollar amount, like 55 or 55.50." },
        code: "validation_failed",
      },
    };
  }
  return { ok: true, cents };
}

function bustPricing(): void {
  /*
   * Next 16 requires the cache profile; the one-argument form is deprecated and
   * doesn't typecheck. `"max"` is the documented recommendation — public pages
   * serve the stale price while the fresh one is fetched behind them, which is
   * the right trade for a browse grid.
   *
   * The admin's own view isn't left stale by that: `revalidatePath` below
   * refreshes this page directly. If a price edit ever needs to be visible
   * site-wide *immediately*, `updateTag` is the call the docs point at.
   */
  revalidateTag("pricing", "max");
  revalidatePath("/dashboard/pricing");
}

export async function updateRateBandAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const min = moneyField(formData, "minCents");
  if (!min.ok) return min.state;
  const suggested = moneyField(formData, "suggestedCents");
  if (!suggested.ok) return suggested.state;
  const max = moneyField(formData, "maxCents");
  if (!max.ok) return max.state;

  const parsed = parseForm(upsertRateBandSchema, {
    subjectSlug: text(formData, "subjectSlug"),
    minCents: min.cents,
    suggestedCents: suggested.cents,
    maxCents: max.cents,
  });
  if (!parsed.ok) return parsed.state;

  try {
    const result = await callApiAuthed<{ message: string }>("/pricing/bands", {
      method: "POST",
      body: parsed.data,
    });
    bustPricing();
    return { status: "success", redirectTo: "", message: result.message };
  } catch (error) {
    return toErrorState(error);
  }
}

export async function setEducatorRateAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const rate = moneyField(formData, "rateCents");
  if (!rate.ok) return rate.state;

  const parsed = parseForm(setEducatorRateSchema, {
    educatorSlug: text(formData, "educatorSlug"),
    subjectSlug: text(formData, "subjectSlug"),
    rateCents: rate.cents,
  });
  if (!parsed.ok) return parsed.state;

  try {
    const result = await callApiAuthed<{ message: string }>("/pricing/educator-rates", {
      method: "POST",
      body: parsed.data,
    });
    bustPricing();
    return { status: "success", redirectTo: "", message: result.message };
  } catch (error) {
    return toErrorState(error);
  }
}

export async function updateFormatPolicyAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const travel = moneyField(formData, "travelFlatCents");
  if (!travel.ok) return travel.state;

  /*
   * The multiplier is entered as a percentage on top of the base ("25" = +25%)
   * because that's how a founder thinks about it; the contract carries basis
   * points.
   */
  const surcharge = text(formData, "inHomeSurchargePercent").trim();
  if (!/^\d{1,3}(\.\d{1,2})?$/.test(surcharge)) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors: {
        inHomeSurchargePercent: "Enter the surcharge percentage, like 0 or 25.",
      },
      code: "validation_failed",
    };
  }

  const parsed = parseForm(updateFormatPolicySchema, {
    inHomeMultiplierBps: 10_000 + Math.round(Number.parseFloat(surcharge) * 100),
    travelFlatCents: travel.cents,
  });
  if (!parsed.ok) return parsed.state;

  try {
    const result = await callApiAuthed<{ message: string }>("/pricing/format-policy", {
      method: "POST",
      body: parsed.data,
    });
    bustPricing();
    return { status: "success", redirectTo: "", message: result.message };
  } catch (error) {
    return toErrorState(error);
  }
}
