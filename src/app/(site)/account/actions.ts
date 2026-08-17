"use server";

import { revalidatePath } from "next/cache";

import { submitReviewSchema } from "@contracts/reviews.ts";

import {
  callApiAuthed,
  optionalText,
  parseForm,
  text,
  toErrorState,
} from "@/lib/auth/action-helpers";
import type { AuthFormState } from "@/lib/auth/form-state";

/**
 * A parent cancelling their own booking.
 *
 * The history page showed every state and offered no way out of any of them: a
 * family who needed to cancel had to email and hope. The API owns the policy —
 * a full refund at 24 hours' notice or more, a refusal inside that window — and
 * this forwards the session and renders whatever comes back, including the refusal.
 * Pre-judging it here would put a second copy of the cutoff in the browser, where
 * it could disagree with the one that actually decides.
 *
 * **Path to confirm:** `POST /bookings/:id/cancel`.
 */
export async function cancelBookingAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const id = text(formData, "id");
  const reason = optionalText(formData, "reason");

  try {
    const result = await callApiAuthed<{ message: string }>(
      `/bookings/${encodeURIComponent(id)}/cancel`,
      { method: "POST", body: reason ? { reason } : {} },
    );
    revalidatePath("/account/bookings");
    // The coordinator's queue counts this booking too.
    revalidatePath("/dashboard/bookings");
    return {
      status: "success",
      redirectTo: "",
      message: result.message ?? "That booking is cancelled.",
    };
  } catch (error) {
    return toErrorState(error);
  }
}

/**
 * Reads one star rating out of the form.
 *
 * Unanswered comes back as `undefined` so the contract's `.optional()` applies;
 * anything else is handed over as a number and left for the schema to judge. A
 * value that isn't a number at all becomes `NaN`, which `z.number()` rejects —
 * deliberately, rather than being silently dropped as "not answered".
 */
function starField(formData: FormData, name: string): number | undefined {
  const raw = formData.get(name);
  if (typeof raw !== "string" || raw.trim().length === 0) return undefined;
  return Number(raw);
}

/**
 * A parent reviewing a session that actually happened.
 *
 * The API owns every rule worth owning here — the booking must be `completed`,
 * must belong to the caller, and must not already have a review — so this
 * forwards and renders the refusal rather than re-deciding any of it. What it
 * does own is the shape: `submitReviewSchema` is the same object the API
 * validates, so a rating the server would reject never leaves the browser.
 *
 * Nothing this returns implies the review is live. It goes to staff first, and
 * the form's success state says so.
 */
export async function submitReviewAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const bookingId = text(formData, "bookingId");

  /*
   * Checked before `parseForm` so the missing-rating case reads like a sentence.
   * The contract's message for an absent number is "expected number, received
   * undefined" — true, and no use at all to a parent who simply hasn't clicked a
   * star yet.
   */
  const overallRating = starField(formData, "overallRating");
  if (overallRating === undefined) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors: { overallRating: "Choose a star rating for this session." },
      code: "validation_failed",
    };
  }

  const parsed = parseForm(submitReviewSchema, {
    overallRating,
    communicationRating: starField(formData, "communicationRating"),
    knowledgeRating: starField(formData, "knowledgeRating"),
    punctualityRating: starField(formData, "punctualityRating"),
    patienceRating: starField(formData, "patienceRating"),
    body: optionalText(formData, "body"),
  });
  if (!parsed.ok) return parsed.state;

  try {
    const result = await callApiAuthed<{ message?: string; status?: string }>(
      `/reviews/bookings/${encodeURIComponent(bookingId)}`,
      { method: "POST", body: parsed.data },
    );
    // The card must come back as "already reviewed" rather than offering the form
    // again, and the moderation queue has just gained a row.
    revalidatePath("/account/bookings");
    revalidatePath("/dashboard/reviews");
    return {
      status: "success",
      redirectTo: "",
      message: result?.message ?? "Thanks — your review has been sent for review.",
    };
  } catch (error) {
    return toErrorState(error);
  }
}
