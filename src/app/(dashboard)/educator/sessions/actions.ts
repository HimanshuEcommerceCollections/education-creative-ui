"use server";

import { callApiAuthed, text, toErrorState } from "@/lib/auth/action-helpers";
import type { AuthFormState } from "@/lib/auth/form-state";

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
    const details = await callApiAuthed<{
      address: {
        line1: string;
        line2?: string | null;
        city: string;
        state: string;
        postalCode: string;
      } | null;
    }>(`/bookings/${encodeURIComponent(id)}/child-details`);

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
