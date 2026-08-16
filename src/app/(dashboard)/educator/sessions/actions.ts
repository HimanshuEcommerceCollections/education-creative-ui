"use server";

import { revalidatePath } from "next/cache";

import type { BookingChildDetails } from "@contracts/bookings.ts";

import {
  callApiAuthed,
  optionalText,
  text,
  toErrorState,
} from "@/lib/auth/action-helpers";
import type { AuthFormState } from "@/lib/auth/form-state";
import { recordBookingOutcome } from "@/lib/dashboard/booking-outcome";

/**
 * The educator marks their own session delivered, or records a no-show.
 *
 * §12.2 and this dashboard's own sidebar both scope the launch educator surface to
 * "set a password, see assignments, **mark sessions delivered**", so the third of
 * those needs a control the educator can reach on the session itself — "Show the
 * address" is not one.
 *
 * Whether the endpoint accepts an educator principal or is staff-only is the part
 * that needs confirming; if it's the latter, the API refuses this with a message
 * the card renders, and the staff queue's own control is unaffected.
 */
export async function recordSessionOutcomeAction(
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
    if (state.status === "success") {
      revalidatePath("/educator/sessions");
      revalidatePath("/dashboard/bookings");
    }
    return state;
  } catch (error) {
    return toErrorState(error);
  }
}

/**
 * Reveals the address for one in-home session the educator is assigned to.
 *
 * The API decides whether they may see it — assigned to them, still confirmed,
 * and their background check current — and writes an audit row for the access.
 * That is why this is a request per session rather than a field on the list: the
 * platform can answer who looked at a family's address and when.
 */
export async function revealSessionAddressAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const id = text(formData, "id");

  try {
    // The contract's own type, rather than a third inline copy of it.
    const details = await callApiAuthed<BookingChildDetails>(
      `/bookings/${encodeURIComponent(id)}/child-details`,
    );

    if (!details.address) {
      return {
        status: "success",
        redirectTo: "",
        message: "No address on this session — it's an online lesson.",
      };
    }

    const address = [
      details.address.line1,
      details.address.line2,
      `${details.address.city}, ${details.address.state} ${details.address.postalCode}`,
    ]
      .filter(Boolean)
      .join("\n");

    return {
      status: "success",
      redirectTo: "",
      message: `${address}\n\nThis view was recorded in the audit log.`,
    };
  } catch (error) {
    return toErrorState(error);
  }
}
