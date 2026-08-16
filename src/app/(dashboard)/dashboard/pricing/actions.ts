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

/**
 * The real ceilings, derived from the contract rather than restated.
 *
 * `inHomeMultiplierBps` caps at 30000 — 10000 is ×1.0, so the headroom above the
 * base rate is 200%. The travel fee caps at 20000 cents. Both are shown on the
 * form, because a limit the person can't see is a limit they discover by failing.
 * (Not exported — every export of a `"use server"` module has to be an async
 * function, so the form states its own copy of the same figures.)
 */
const MAX_SURCHARGE_PERCENT = 200;

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
    return surchargeError("Enter the surcharge percentage, like 0 or 25.");
  }

  /*
   * The contract caps `inHomeMultiplierBps` at 30000 (×3), so the surcharge
   * ceiling is 200%. It has to be checked here, against the input the admin is
   * actually looking at: the contract rejects an over-cap value keyed
   * `inHomeMultiplierBps`, a field this form doesn't have, so leaving it to the
   * contract gives "Please check the highlighted fields" with *nothing* highlighted
   * and no hint that a ceiling exists.
   */
  const percent = Number.parseFloat(surcharge);
  if (percent > MAX_SURCHARGE_PERCENT) {
    return surchargeError(
      `${MAX_SURCHARGE_PERCENT}% is the ceiling — an in-home session can cost at most three times the base rate.`,
    );
  }

  const parsed = parseForm(updateFormatPolicySchema, {
    inHomeMultiplierBps: 10_000 + Math.round(percent * 100),
    travelFlatCents: travel.cents,
  });
  if (!parsed.ok) return withSurchargeFieldName(parsed.state);

  try {
    const result = await callApiAuthed<{ message: string }>("/pricing/format-policy", {
      method: "POST",
      body: parsed.data,
    });
    bustPricing();
    return { status: "success", redirectTo: "", message: result.message };
  } catch (error) {
    return withSurchargeFieldName(toErrorState(error));
  }
}

function surchargeError(message: string): AuthFormState {
  return {
    status: "error",
    message: "Please check the highlighted fields.",
    fieldErrors: { inHomeSurchargePercent: message },
    code: "validation_failed",
  };
}

/**
 * Re-keys the contract's field names onto the form's input names.
 *
 * `inHomeMultiplierBps` and `travelFlatCents` are what the contract validates;
 * `inHomeSurchargePercent` is what the admin typed into. Without this the message
 * arrives keyed to a field that doesn't exist on the page and renders nowhere at
 * all. Same remapping the educator-application action does for
 * `subjectsOfInterest` → `subject`.
 */
function withSurchargeFieldName(state: AuthFormState): AuthFormState {
  if (state.status !== "error" || !state.fieldErrors?.inHomeMultiplierBps) return state;

  const { inHomeMultiplierBps, ...rest } = state.fieldErrors;
  return {
    ...state,
    fieldErrors: { ...rest, inHomeSurchargePercent: inHomeMultiplierBps },
  };
}
