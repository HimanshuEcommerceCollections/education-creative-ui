"use server";

import { revalidatePath } from "next/cache";

import {
  approveEducatorApplicationSchema,
  reviewEducatorApplicationSchema,
} from "@contracts/educator-applications.ts";
import { inviteCoordinatorRequestSchema } from "@contracts/staff-invites.ts";

import {
  callApiAuthed,
  optionalText,
  parseForm,
  text,
  toErrorState,
} from "@/lib/auth/action-helpers";
import type { AuthFormState } from "@/lib/auth/form-state";

/**
 * Staff actions on the educator review queue.
 *
 * Authorisation is **not** decided here. Each of these forwards the session and
 * the API checks the capability, so a stray call from a non-staff session is
 * refused at the enforcement point rather than by whether this page rendered.
 */

export async function reviewApplicationAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const id = text(formData, "id");
  const parsed = parseForm(reviewEducatorApplicationSchema, {
    status: text(formData, "status"),
    reviewNotes: optionalText(formData, "reviewNotes"),
  });
  if (!parsed.ok) return parsed.state;

  try {
    const result = await callApiAuthed<{ message: string }>(
      `/educator-applications/${encodeURIComponent(id)}/review`,
      { method: "PATCH", body: parsed.data },
    );
    // Both surfaces read the same queue — the overview shows counts and a
    // preview, the applications page the full list.
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/applications");
    return { status: "success", redirectTo: "", message: result.message };
  } catch (error) {
    return toErrorState(error);
  }
}

/**
 * Coordinator invite — the staff counterpart of educator approval. The API
 * creates the `invited` account, grants the role, and emails the single-use
 * set-password link; admin-only at the enforcement point, not here.
 */
export async function inviteCoordinatorAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = parseForm(inviteCoordinatorRequestSchema, {
    fullName: text(formData, "fullName"),
    email: text(formData, "email"),
    phone: optionalText(formData, "phone"),
  });
  if (!parsed.ok) return parsed.state;

  try {
    const result = await callApiAuthed<{ message: string }>("/staff/invites", {
      method: "POST",
      body: parsed.data,
    });
    revalidatePath("/dashboard/staff");
    return { status: "success", redirectTo: "", message: result.message };
  } catch (error) {
    return toErrorState(error);
  }
}

/**
 * Approval. Creates the educator's account, grants the role, creates the profile,
 * and sends the invite — all server-side, in one transaction. Separate from
 * `review` because those effects must not be reachable by a status edit.
 */
export async function approveApplicationAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const id = text(formData, "id");
  const parsed = parseForm(approveEducatorApplicationSchema, {
    slug: optionalText(formData, "slug"),
    headline: optionalText(formData, "headline"),
    backgroundCheckRef: optionalText(formData, "backgroundCheckRef"),
    reviewNotes: optionalText(formData, "reviewNotes"),
  });
  if (!parsed.ok) return parsed.state;

  try {
    const result = await callApiAuthed<{ message: string }>(
      `/educator-applications/${encodeURIComponent(id)}/approve`,
      { method: "POST", body: parsed.data },
    );
    // Both surfaces read the same queue — the overview shows counts and a
    // preview, the applications page the full list.
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/applications");
    return { status: "success", redirectTo: "", message: result.message };
  } catch (error) {
    return toErrorState(error);
  }
}
