"use server";

import { revalidatePath } from "next/cache";

import {
  type BookingChildDetails,
  cannotConfirmBookingSchema,
  confirmBookingSchema,
  reassignBookingSchema,
  refundBookingSchema,
  rescheduleBookingSchema,
} from "@contracts/bookings.ts";

import {
  callApiAuthed,
  optionalText,
  parseForm,
  text,
  toErrorState,
} from "@/lib/auth/action-helpers";
import type { AuthFormState } from "@/lib/auth/form-state";
import { recordBookingOutcome } from "@/lib/dashboard/booking-outcome";

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

/**
 * The session moves to a new day or time.
 *
 * The date and time posted here are **civil values in `BOOKING_TIMEZONE`**, taken
 * straight off `<input type="date">` and `<input type="time">` — `YYYY-MM-DD` and
 * `HH:MM`, exactly what the contract wants. Nothing is converted to an instant on
 * the way through, because converting through the coordinator's own timezone is
 * precisely how a 4:00 PM session becomes a 9:00 PM one.
 *
 * The field names match the contract keys, so a `validation_failed` from either
 * side lands on the input the value was typed into without any remapping.
 */
export async function rescheduleBookingAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const id = text(formData, "id");
  const parsed = parseForm(rescheduleBookingSchema, {
    preferredDate: text(formData, "preferredDate"),
    preferredTime: text(formData, "preferredTime"),
    reason: text(formData, "reason"),
  });
  if (!parsed.ok) return parsed.state;

  try {
    const result = await callApiAuthed<{ message: string }>(
      `/bookings/${encodeURIComponent(id)}/reschedule`,
      { method: "POST", body: parsed.data },
    );
    revalidateQueue();
    return { status: "success", redirectTo: "", message: result.message };
  } catch (error) {
    return toErrorState(error);
  }
}

/**
 * A different educator takes an already-confirmed session.
 *
 * Separate from `confirm` because the two answer different questions: `confirm`
 * decides who gets the session in the first place, this one takes it off somebody
 * who was already told it was theirs. The API refuses a no-op with `conflict`, so
 * the picker leaves the current holder out rather than relying on that.
 */
export async function reassignBookingAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const id = text(formData, "id");
  const parsed = parseForm(reassignBookingSchema, {
    educatorSlug: text(formData, "educatorSlug"),
    reason: text(formData, "reason"),
  });
  if (!parsed.ok) return parsed.state;

  try {
    const result = await callApiAuthed<{ message: string }>(
      `/bookings/${encodeURIComponent(id)}/reassign`,
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
  if (!parsed.ok) return withAmountFieldName(parsed.state);

  try {
    const result = await callApiAuthed<{ message: string }>(
      `/bookings/${encodeURIComponent(id)}/refund`,
      { method: "POST", body: parsed.data },
    );
    revalidateQueue();
    return { status: "success", redirectTo: "", message: result.message };
  } catch (error) {
    return withAmountFieldName(toErrorState(error));
  }
}

/**
 * Re-keys `amountCents` onto `amount`, the name the input actually has.
 *
 * The form asks for dollars in an input named `amount`; both this action and the
 * contract key their errors `amountCents`. So "Enter how much to refund" or an
 * over-the-cap refusal reached the form alert but never attached to the field, and
 * "Please check the highlighted fields" highlighted nothing. Same remapping the
 * educator-application action does for `subjectsOfInterest` → `subject`.
 */
function withAmountFieldName(state: AuthFormState): AuthFormState {
  if (state.status !== "error" || !state.fieldErrors?.amountCents) return state;

  const { amountCents, ...rest } = state.fieldErrors;
  return { ...state, fieldErrors: { ...rest, amount: amountCents } };
}

/**
 * Marks a confirmed booking delivered, or records a no-show.
 *
 * Staff can always do this — a coordinator taking the phone call is how a no-show
 * usually gets reported — and the educator's own surface posts to the same endpoint.
 * See `lib/dashboard/booking-outcome.ts` for the path that needs confirming.
 */
export async function recordBookingOutcomeAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const id = text(formData, "id");

  try {
    const state = await recordBookingOutcome(
      id,
      text(formData, "outcome"),
      optionalText(formData, "note"),
    );
    if (state.status === "success") revalidateQueue();
    return state;
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
    // The contract's own type. The inline copy this replaces had widened
    // `learnerAgeBand` from the contract enum to bare `string`.
    const details = await callApiAuthed<BookingChildDetails>(
      `/bookings/${encodeURIComponent(id)}/child-details`,
    );

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
