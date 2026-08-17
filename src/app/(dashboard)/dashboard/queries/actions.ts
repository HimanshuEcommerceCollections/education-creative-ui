"use server";

import { revalidatePath } from "next/cache";

import { updateContactRequestSchema } from "@contracts/contact-requests.ts";

import {
  callApiAuthed,
  checkbox,
  optionalText,
  parseForm,
  text,
  toErrorState,
} from "@/lib/auth/action-helpers";
import type { AuthFormState } from "@/lib/auth/form-state";

/**
 * The one thing staff do to an enquiry: change who holds it, where it is, or
 * what came of it.
 *
 * A single action rather than five, because the contract is a single PATCH —
 * `{ status?, assignToSelf?, unassign?, resolutionNote? }` — and splitting it
 * into a claim action, a release action and a resolve action would be three
 * copies of the same call differing only in which hidden input the form set.
 * Each button supplies its own fields; the schema is what decides whether the
 * combination makes sense.
 *
 * Nothing here is a decision. The API owns the state machine and the
 * authorisation — this forwards the session, the same as every other dashboard
 * action, and renders whatever comes back.
 *
 * Note what this action does **not** do: it sends nothing to the person who
 * wrote in. Coordinators reply from their own mail client; `resolutionNote` is
 * the record of what happened, read only by the next member of staff to open the
 * enquiry.
 */
export async function updateContactRequestAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const id = text(formData, "id");

  /*
   * Only fields the pressed button actually carried. The schema is `.strict()`
   * and refuses a body that changes nothing, so posting every key with an empty
   * value would turn "release this" into a validation failure.
   */
  const input: Record<string, unknown> = {};

  const status = optionalText(formData, "status");
  if (status !== undefined) input.status = status;
  if (checkbox(formData, "assignToSelf")) input.assignToSelf = true;
  if (checkbox(formData, "unassign")) input.unassign = true;

  const note = optionalText(formData, "resolutionNote");
  if (note !== undefined) input.resolutionNote = note;

  /*
   * The same schema the API enforces, so a resolve with an empty note is caught
   * here and comes back keyed to `resolutionNote` — which is the name of the
   * textarea it belongs under.
   */
  const parsed = parseForm(updateContactRequestSchema, input);
  if (!parsed.ok) return parsed.state;

  try {
    await callApiAuthed<unknown>(`/contact-requests/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: parsed.data,
    });

    // Both surfaces read this enquiry: the queue, and the detail view it opens
    // into. The detail route is dynamic, so it needs the pattern and a type.
    revalidatePath("/dashboard/queries");
    revalidatePath("/dashboard/queries/[id]", "page");

    return { status: "success", redirectTo: "", message: successMessage(parsed.data) };
  } catch (error) {
    return toErrorState(error);
  }
}

/** What just happened, said plainly — and never implying the sender heard it. */
function successMessage(update: {
  status?: string;
  assignToSelf?: boolean;
  unassign?: boolean;
  resolutionNote?: string;
}): string {
  if (update.status === "resolved") {
    return "Resolved, and your note is on the record. Nothing was sent to the sender.";
  }
  if (update.status === "spam") return "Marked as spam. It's out of the queue.";
  if (update.status === "in_progress") return "Marked as being worked on.";
  if (update.unassign) return "Released. It's back in the queue for anyone to take.";
  if (update.assignToSelf) return "Yours. Nobody else will pick it up.";
  return "Saved.";
}
