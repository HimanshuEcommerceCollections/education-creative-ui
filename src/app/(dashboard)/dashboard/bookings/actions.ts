"use server";

import { revalidatePath } from "next/cache";

import {
  cannotConfirmBookingSchema,
  confirmBookingSchema,
  refundBookingSchema,
} from "@contracts/bookings.ts";

import {
  callApiAuthed,
  optionalText,
  parseForm,
  text,
  toErrorState,
} from "@/lib/auth/action-helpers";
import type { AuthFormState } from "@/lib/auth/form-state";

/**
 * Coordinator decisions on a paid booking.
 *
 * Neither of these decides anything itself. The API owns the state machine, the
 * child-safety invariant, and the refund — these forward the session and render
 * whatever comes back. A confirm that names an unapproved educator fails at the
 * API even though this action would happily post it.
 */

/** Both surfaces read the same queue: the overview's counts and this page. */
function revalidateQueue(): void {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/bookings");
}

export async function confirmBookingAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const id = text(formData, "id");
  const parsed = parseForm(confirmBookingSchema, {
    educatorSlug: text(formData, "educatorSlug"),
    note: optionalText(formData, "note"),
  });
  if (!parsed.ok) return parsed.state;

  try {
    const result = await callApiAuthed<{ message: string }>(
      `/bookings/${encodeURIComponent(id)}/confirm`,
      { method: "POST", body: parsed.data },
    );
    revalidateQueue();
    return { status: "success", redirectTo: "", message: result.message };
  } catch (error) {
    return toErrorState(error);
  }
}

/**
 * Can't fulfil it. This refunds the parent in full and emails them the reason,
 * so it is a separate action from `confirm` rather than another status value —
 * money leaves the platform on this click and it deserves its own path.
 */
export async function cannotConfirmBookingAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const id = text(formData, "id");
  const parsed = parseForm(cannotConfirmBookingSchema, {
    reason: text(formData, "reason"),
  });
  if (!parsed.ok) return parsed.state;

  try {
    const result = await callApiAuthed<{ message: string }>(
      `/bookings/${encodeURIComponent(id)}/cannot-confirm`,
      { method: "POST", body: parsed.data },
    );
    revalidateQueue();
    return { status: "success", redirectTo: "", message: result.message };
  } catch (error) {
    return toErrorState(error);
  }
}

/** "12.50" / "$12.50" / "12" → integer cents; null for anything that isn't money. */
function parseDollars(raw: string): number | null {
  const value = raw.trim().replace(/^\$/, "");
  if (!/^\d+(\.\d{1,2})?$/.test(value)) return null;
  return Math.round(Number.parseFloat(value) * 100);
}

/**
 * A discretionary refund, whole or partial — the conflict path.
 *
 * The amount is typed in dollars because that is how the person deciding thinks
 * about it, and converted to integer cents here; no float reaches the API. Both
 * ceilings — the refundable balance and the coordinator cap — are the API's to
 * enforce, so this posts and reports rather than pre-judging.
 */
export async function refundBookingAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const id = text(formData, "id");
  const amountCents = parseDollars(text(formData, "amount"));

  if (amountCents === null) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors: { amount: "Enter an amount, like 25 or 12.50." },
      code: "validation_failed",
    };
  }

  const parsed = parseForm(refundBookingSchema, {
    amountCents,
    reason: text(formData, "reason"),
  });
  if (!parsed.ok) return parsed.state;

  try {
    const result = await callApiAuthed<{ message: string }>(
      `/bookings/${encodeURIComponent(id)}/refund`,
      { method: "POST", body: parsed.data },
    );
    revalidateQueue();
    return { status: "success", redirectTo: "", message: result.message };
  } catch (error) {
    return toErrorState(error);
  }
}

/**
 * Reveals the learner's name and the in-home address for one booking.
 *
 * A server action rather than a client fetch so the session cookie never has to
 * be readable from the browser, and one deliberate click rather than part of the
 * list payload so the API can audit who saw a child's details and when.
 */
export async function revealChildDetailsAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const id = text(formData, "id");

  try {
    const details = await callApiAuthed<{
      learnerFirstName: string;
      learnerAgeBand: string;
      learnerFocus: string | null;
      address: {
        line1: string;
        line2?: string | null;
        city: string;
        state: string;
        postalCode: string;
      } | null;
    }>(`/bookings/${encodeURIComponent(id)}/child-details`);

    const lines = [
      `Learner: ${details.learnerFirstName} (${details.learnerAgeBand})`,
      ...(details.learnerFocus ? [`Focus: ${details.learnerFocus}`] : []),
      ...(details.address
        ? [
            `Address: ${[
              details.address.line1,
              details.address.line2,
              details.address.city,
              `${details.address.state} ${details.address.postalCode}`,
            ]
              .filter(Boolean)
              .join(", ")}`,
          ]
        : []),
    ];

    return { status: "success", redirectTo: "", message: lines.join("\n") };
  } catch (error) {
    return toErrorState(error);
  }
}
