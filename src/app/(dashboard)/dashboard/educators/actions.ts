"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import {
  setEducatorVerificationSchema,
  staffUpdateEducatorProfileSchema,
} from "@contracts/educators.ts";

import {
  callApiAuthed,
  optionalText,
  parseForm,
  text,
  toErrorState,
} from "@/lib/auth/action-helpers";
import type { AuthFormState } from "@/lib/auth/form-state";

/**
 * Staff actions on educator profiles.
 *
 * Authorisation is **not** decided here. Each of these forwards the session and
 * the API checks the capability — `requireStaff` for verification and profile
 * edits, `requireRole("admin")` for the account-level invite resend — so a call
 * from a session that shouldn't make it is refused at the enforcement point
 * rather than by whether a button rendered.
 */

/**
 * What has to be invalidated after any write to an educator.
 *
 * The public marketing pages (`/browse`, the profile pages) read educators under
 * the `"educators"` fetch tag, and verification is what decides whether someone
 * appears there at all — approve an educator without this and the directory goes
 * on omitting them until something else happens to evict the cache.
 *
 * `"max"` is the profile the Next 16 docs recommend and the one the reviews and
 * pricing actions already use: the tag is marked stale and the public pages keep
 * serving the previous copy while the fresh one is fetched behind them. (The
 * single-argument form is deprecated in this version and doesn't typecheck.) The
 * dashboard's own view isn't left stale by that — the two `revalidatePath` calls
 * refresh the directory and this educator's page directly.
 */
function bustEducator(slug: string): void {
  revalidateTag("educators", "max");
  revalidatePath("/dashboard/educators");
  if (slug) revalidatePath(`/dashboard/educators/${slug}`);
}

/**
 * The child-safety gate.
 *
 * Until this runs an approved applicant is `pending`, which means unassignable,
 * unable to see their own sessions, and shown no learner detail. The contract
 * carries both guards that make it auditable — a reason of at least three
 * characters, and a vetting reference that is *required* when the status is
 * `approved` — so they are enforced by `parseForm` against the same schema the
 * API parses, not by this function's own opinion.
 */
export async function setEducatorVerificationAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const slug = text(formData, "slug");

  const parsed = parseForm(setEducatorVerificationSchema, {
    status: text(formData, "status"),
    reason: text(formData, "reason"),
    backgroundCheckRef: optionalText(formData, "backgroundCheckRef"),
  });
  if (!parsed.ok) return parsed.state;

  try {
    const result = await callApiAuthed<{ message: string }>(
      `/educators/${encodeURIComponent(slug)}/verification`,
      { method: "PATCH", body: parsed.data },
    );
    bustEducator(slug);
    return { status: "success", redirectTo: "", message: result.message };
  } catch (error) {
    return toErrorState(error);
  }
}

/**
 * Blank-line-separated paragraphs, which is how `about` is stored and how the
 * public profile renders it — one `<p>` per entry.
 */
function paragraphs(raw: string): string[] {
  return raw
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
}

/** Topics, one per line or comma-separated — whichever the person typed. */
function topics(raw: string): string[] {
  return raw
    .split(/[\n,]/)
    .map((topic) => topic.trim())
    .filter((topic) => topic.length > 0);
}

/**
 * Re-keys per-element array errors onto the field the person typed into.
 *
 * The contract validates `about` and `subjects` as arrays, so a too-long
 * paragraph arrives keyed `about.3` — a name no input on the form has, which
 * renders the message nowhere at all and leaves "Please check the highlighted
 * fields" with nothing highlighted. Same remapping the pricing action does for
 * `inHomeMultiplierBps` → `inHomeSurchargePercent`.
 */
function collapseArrayFields(state: AuthFormState): AuthFormState {
  if (state.status !== "error" || !state.fieldErrors) return state;

  const fieldErrors: Record<string, string> = {};
  for (const [key, message] of Object.entries(state.fieldErrors)) {
    const field = key.replace(/\.\d+$/, "");
    if (!fieldErrors[field]) fieldErrors[field] = message;
  }
  return { ...state, fieldErrors };
}

/**
 * Staff correcting a profile. The slug is not editable — it is a public URL that
 * may already be linked to, so renaming it is a redirect problem rather than a
 * form field.
 *
 * `subjects` is the field that does more than it looks like it does: it is the
 * authoritative list of what this person teaches, and the booking flow rejects
 * any topic that isn't on it verbatim. An empty list is not a neutral default,
 * it's an educator nobody can book.
 */
export async function updateEducatorProfileAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const slug = text(formData, "slug");
  const headline = text(formData, "headline").trim();

  const parsed = parseForm(staffUpdateEducatorProfileSchema, {
    name: text(formData, "name"),
    // Blank clears it rather than meaning "leave alone": the field is on screen
    // with its current value, so emptying it is a deliberate act.
    headline: headline.length > 0 ? headline : null,
    about: paragraphs(text(formData, "about")),
    subjects: topics(text(formData, "subjects")),
  });
  if (!parsed.ok) return collapseArrayFields(parsed.state);

  try {
    const result = await callApiAuthed<{ message: string }>(
      `/educators/${encodeURIComponent(slug)}`,
      { method: "PATCH", body: parsed.data },
    );
    bustEducator(slug);
    return { status: "success", redirectTo: "", message: result.message };
  } catch (error) {
    return collapseArrayFields(toErrorState(error));
  }
}

/**
 * Re-issues the invite for an educator who has never signed in.
 *
 * Two endpoints, because there are two ways a profile can exist. One that came
 * from an approved application resends through the application — staff-scoped,
 * so a coordinator can do it. One with an account but no application behind it (a
 * seeded profile) has only the account-level invite, and that route is
 * `requireRole("admin")`. The form picks by what the profile carries; the page
 * decides what to *offer*, so a coordinator isn't handed a button whose only
 * outcome is a refusal.
 */
export async function resendEducatorInviteAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const slug = text(formData, "slug");
  const applicationId = optionalText(formData, "applicationId");
  const userId = optionalText(formData, "userId");

  const path = applicationId
    ? `/educator-applications/${encodeURIComponent(applicationId)}/resend-invite`
    : userId
      ? `/auth/invites/${encodeURIComponent(userId)}/resend`
      : null;

  if (!path) {
    return {
      status: "error",
      message:
        "There's no account and no application behind this profile, so there's nothing to send an invite to.",
      code: "not_found",
    };
  }

  try {
    const result = await callApiAuthed<{ message?: string }>(path, { method: "POST" });
    bustEducator(slug);
    return {
      status: "success",
      redirectTo: "",
      message: result?.message ?? "A fresh invite is on its way.",
    };
  } catch (error) {
    return toErrorState(error);
  }
}
