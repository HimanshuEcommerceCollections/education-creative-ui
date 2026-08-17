"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import {
  CONFIG_FIELD_KINDS,
  configKeySchema,
  updateConfigSchema,
  type ConfigFieldKind,
  type ConfigKey,
  type ConfigValue,
} from "@contracts/config.ts";

import { callApiAuthed, parseForm, text, toErrorState } from "@/lib/auth/action-helpers";
import type { AuthFormState } from "@/lib/auth/form-state";

/**
 * Saving one group of site settings.
 *
 * Authorisation lives at the API: the route requires staff, and the service
 * checks each key against the registry's `editableBy`, so a coordinator posting
 * the take rate is refused by name there. Nothing here is a permission check —
 * the form only renders what came back as editable, which is a convenience, not
 * a control.
 *
 * A successful write busts the `config` fetch tag. The booking calendar, the
 * checkout promises and the public forms all read the snapshot through it, so
 * flipping a switch reaches the site on the next request rather than the next
 * deploy.
 */

/**
 * Which settings this form is submitting and how to read each one, carried as a
 * hidden field.
 *
 * A form only knows its own inputs, and three of the four kinds need converting
 * before they mean anything — dollars to cents, percent to basis points. An
 * unchecked checkbox is absent from `FormData` entirely, so without a declared
 * list, turning a switch *off* would look exactly like not submitting it.
 *
 * Client-supplied, and deliberately not trusted for anything but parsing: every
 * value is re-validated against the server's own registry bounds, so the worst a
 * tampered declaration achieves is misreading the admin's own input.
 */
interface SubmittedField {
  key: ConfigKey;
  kind: ConfigFieldKind;
}

/** The hidden field's name, shared with `config-editors.tsx`. */
const FIELDS_INPUT = "__fields";

function parseFieldList(formData: FormData): SubmittedField[] | null {
  let raw: unknown;
  try {
    raw = JSON.parse(text(formData, FIELDS_INPUT));
  } catch {
    return null;
  }
  if (!Array.isArray(raw)) return null;

  const fields: SubmittedField[] = [];
  for (const entry of raw) {
    const key = configKeySchema.safeParse((entry as SubmittedField)?.key);
    const kind = (entry as SubmittedField)?.kind;
    if (!key.success || !CONFIG_FIELD_KINDS.includes(kind)) return null;
    fields.push({ key: key.data, kind });
  }
  return fields.length > 0 ? fields : null;
}

/** "55" or "55.50" → integer cents; null for anything that isn't money. */
function parseDollars(raw: string): number | null {
  const value = raw.trim().replace(/^\$/, "");
  if (!/^\d+(\.\d{1,2})?$/.test(value)) return null;
  return Math.round(Number.parseFloat(value) * 100);
}

/** "2.5" → 250 basis points; null for anything that isn't a percentage. */
function parsePercent(raw: string): number | null {
  const value = raw.trim().replace(/%$/, "");
  if (!/^\d{1,3}(\.\d{1,2})?$/.test(value)) return null;
  return Math.round(Number.parseFloat(value) * 100);
}

/** A plain whole number, as typed. */
function parseInteger(raw: string): number | null {
  const value = raw.trim();
  if (!/^\d{1,7}$/.test(value)) return null;
  return Number.parseInt(value, 10);
}

/**
 * Reads one field in the unit the admin typed it in and returns it in the unit
 * the store keeps. The message names the format rather than the bound — the
 * bounds are printed under the input and enforced by the API.
 */
function readField(
  formData: FormData,
  field: SubmittedField,
): { ok: true; value: ConfigValue } | { ok: false; message: string } {
  if (field.kind === "boolean") {
    return { ok: true, value: formData.get(field.key) !== null };
  }

  const raw = text(formData, field.key);

  if (field.kind === "money_cents") {
    const cents = parseDollars(raw);
    return cents === null
      ? { ok: false, message: "Enter a dollar amount, like 5 or 5.50." }
      : { ok: true, value: cents };
  }

  if (field.kind === "percent_bps") {
    const bps = parsePercent(raw);
    return bps === null
      ? { ok: false, message: "Enter a percentage, like 25 or 2.9." }
      : { ok: true, value: bps };
  }

  const whole = parseInteger(raw);
  return whole === null
    ? { ok: false, message: "Enter a whole number." }
    : { ok: true, value: whole };
}

export async function updateConfigAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const fields = parseFieldList(formData);
  if (!fields) {
    return {
      status: "error",
      message: "That form didn't submit properly. Reload the page and try again.",
      code: "validation_failed",
    };
  }

  const settings: { key: ConfigKey; value: ConfigValue }[] = [];
  const fieldErrors: Record<string, string> = {};

  for (const field of fields) {
    const read = readField(formData, field);
    if (read.ok) {
      settings.push({ key: field.key, value: read.value });
    } else {
      fieldErrors[field.key] = read.message;
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please check the highlighted settings.",
      fieldErrors,
      code: "validation_failed",
    };
  }

  const parsed = parseForm(updateConfigSchema, { settings });
  if (!parsed.ok) return parsed.state;

  try {
    const result = await callApiAuthed<{ updated: number; message: string }>(
      "/config/settings",
      { method: "POST", body: parsed.data },
    );

    /*
     * Next 16 requires the cache profile; `"max"` is the documented
     * recommendation — public pages serve the previous rule while the new one is
     * fetched behind them, which is the right trade for a booking window and the
     * wrong one for nothing here. The admin's own view isn't left stale by that:
     * `revalidatePath` refreshes this page directly.
     */
    revalidateTag("config", "max");
    revalidatePath("/dashboard/config");

    return { status: "success", redirectTo: "", message: result.message };
  } catch (error) {
    return toErrorState(error);
  }
}
