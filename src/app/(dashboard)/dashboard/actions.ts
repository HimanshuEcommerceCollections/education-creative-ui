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

/*
 * ---------------------------------------------------------------------------
 * Staff management
 * ---------------------------------------------------------------------------
 *
 * Every staff state the roster page can render has an action here capable of producing
 * it. A `suspended` or `deactivated` badge with no control behind it means an admin
 * can see that an account is suspended but not suspend one, and an invite that never
 * arrived becomes a dead end.
 *
 * Each capability is its own Server Action, deliberately: these are the calls that
 * take someone's access away, and one multiplexed "staff action" endpoint would
 * make the audit trail on this side harder to read than the one on the server.
 *
 * **Paths to confirm.** These match the endpoints the server work in flight adds:
 *
 * - `POST   /staff/invites`                  — invite, `{ fullName, email, phone?, role }`
 * - `POST   /staff/invites/:userId/resend`   — re-issue an unused invite
 * - `POST   /staff/:userId/roles`            — grant, `{ role }`
 * - `DELETE /staff/:userId/roles/:role`      — revoke
 * - `PATCH  /staff/:userId/status`           — `{ status, reason }`
 *
 * The generated contract copy in this repo predates the `role` field on the invite
 * schema and has no schema at all for the last three, which is why the validation
 * below is local rather than a `parseForm` against the contract.
 */

/** The two roles this surface may grant. Educator comes from application approval. */
const GRANTABLE_ROLES = ["coordinator", "admin"] as const;
type GrantableRole = (typeof GRANTABLE_ROLES)[number];

function parseGrantableRole(raw: string): GrantableRole | null {
  return (GRANTABLE_ROLES as readonly string[]).includes(raw)
    ? (raw as GrantableRole)
    : null;
}

function roleError(): AuthFormState {
  return {
    status: "error",
    message: "Please check the highlighted fields.",
    fieldErrors: { role: "Choose coordinator or administrator." },
    code: "validation_failed",
  };
}

/**
 * Staff invite — the staff counterpart of educator approval. The API creates the
 * `invited` account, grants the role, and emails the single-use set-password link;
 * admin-only at the enforcement point, not here.
 *
 * The role travels outside `parseForm` because the generated invite schema is
 * `.strict()` and predates the field — validating the name and email against the
 * contract while checking the role locally keeps both halves honest.
 */
export async function inviteStaffAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = parseForm(inviteCoordinatorRequestSchema, {
    fullName: text(formData, "fullName"),
    email: text(formData, "email"),
    phone: optionalText(formData, "phone"),
  });
  if (!parsed.ok) return parsed.state;

  const role = parseGrantableRole(text(formData, "role") || "coordinator");
  if (!role) return roleError();

  try {
    const result = await callApiAuthed<{ message: string }>("/staff/invites", {
      method: "POST",
      body: { ...parsed.data, role },
    });
    revalidatePath("/dashboard/staff");
    return { status: "success", redirectTo: "", message: result.message };
  } catch (error) {
    return toErrorState(error);
  }
}

/**
 * Re-issues an invite for an account still waiting on its first password.
 *
 * The only way back from a lost or expired invite: the reset and
 * resend-verification flows both refuse accounts that have never set a password.
 * Issuing a new token invalidates the previous link.
 */
export async function resendStaffInviteAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const userId = text(formData, "userId");

  try {
    const result = await callApiAuthed<{ message: string }>(
      `/staff/invites/${encodeURIComponent(userId)}/resend`,
      { method: "POST" },
    );
    revalidatePath("/dashboard/staff");
    return { status: "success", redirectTo: "", message: result.message };
  } catch (error) {
    return toErrorState(error);
  }
}

/** Grants a staff role to an account that already exists. */
export async function grantStaffRoleAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const userId = text(formData, "userId");
  const role = parseGrantableRole(text(formData, "role"));
  if (!role) return roleError();

  try {
    const result = await callApiAuthed<{ message: string }>(
      `/staff/${encodeURIComponent(userId)}/roles`,
      { method: "POST", body: { role } },
    );
    revalidatePath("/dashboard/staff");
    return { status: "success", redirectTo: "", message: result.message };
  } catch (error) {
    return toErrorState(error);
  }
}

/**
 * Revokes a staff role.
 *
 * The API holds the two guards that make this safe to expose — nobody acts on
 * their own account, and the last active admin can't be removed — so this posts
 * and reports rather than pre-judging.
 */
export async function revokeStaffRoleAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const userId = text(formData, "userId");
  const role = parseGrantableRole(text(formData, "role"));
  if (!role) return roleError();

  try {
    const result = await callApiAuthed<{ message: string }>(
      `/staff/${encodeURIComponent(userId)}/roles/${encodeURIComponent(role)}`,
      { method: "DELETE" },
    );
    revalidatePath("/dashboard/staff");
    return { status: "success", redirectTo: "", message: result.message };
  } catch (error) {
    return toErrorState(error);
  }
}

/**
 * Suspends, deactivates, or restores an account.
 *
 * A reason is mandatory because this ends up in the audit log, and "why was this
 * person locked out?" is a question that gets asked months later. Suspension is
 * the reversible one; both stop the account authenticating immediately and drop
 * its live sessions.
 */
export async function setStaffStatusAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const userId = text(formData, "userId");
  const status = text(formData, "status");
  const reason = text(formData, "reason").trim();

  if (!["active", "suspended", "deactivated"].includes(status)) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors: { status: "Choose suspend, deactivate, or reactivate." },
      code: "validation_failed",
    };
  }

  if (reason.length < 3) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors: { reason: "Say why — this ends up in the audit log." },
      code: "validation_failed",
    };
  }

  try {
    const result = await callApiAuthed<{ message: string }>(
      `/staff/${encodeURIComponent(userId)}/status`,
      { method: "PATCH", body: { status, reason } },
    );
    revalidatePath("/dashboard/staff");
    return { status: "success", redirectTo: "", message: result.message };
  } catch (error) {
    return toErrorState(error);
  }
}

/*
 * Educator verification (the gate on assignment) is deliberately *not* wired here.
 * The endpoint exists, but the surface it belongs on — an educator directory —
 * doesn't, and an exported Server Action nothing calls is a live POST route with no
 * page behind it. It goes in with `/dashboard/educators`.
 */

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
