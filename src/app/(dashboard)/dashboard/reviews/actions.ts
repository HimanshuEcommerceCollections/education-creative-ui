"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { moderateReviewSchema } from "@contracts/reviews.ts";

import {
  callApiAuthed,
  optionalText,
  parseForm,
  text,
  toErrorState,
} from "@/lib/auth/action-helpers";
import type { AuthFormState } from "@/lib/auth/form-state";

/**
 * Publishing or rejecting one review.
 *
 * Authorisation is not decided here — this forwards the session and the API's
 * staff guard is the enforcement point, the same as every other dashboard action.
 *
 * The interesting part is what happens *after* a decision. A published review
 * changes an educator's average, their review count, and the directory grid that
 * ranks on it — all of which are cached public reads under the `educators` tag.
 * Without the bust below, a moderator would approve a review and then watch the
 * public profile go on showing the old number until something else happened to
 * evict the cache.
 *
 * `"max"` is the profile the Next 16 docs recommend and the one the pricing
 * actions already use: the tag is marked stale, the public pages keep serving the
 * previous figure while the fresh one is fetched behind them. For a rating average
 * that is the right trade — nobody needs the fifth decimal place of an educator's
 * score to change mid-request. (The single-argument form is deprecated in this
 * version and doesn't typecheck.)
 */
export async function moderateReviewAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const id = text(formData, "id");

  const parsed = parseForm(moderateReviewSchema, {
    action: text(formData, "action"),
    note: optionalText(formData, "note"),
  });
  if (!parsed.ok) return parsed.state;

  try {
    const result = await callApiAuthed<{ message?: string }>(
      `/reviews/${encodeURIComponent(id)}/moderation`,
      { method: "PATCH", body: parsed.data },
    );

    /*
     * `src/lib/educators/directory.ts` and `src/lib/educators/reviews.ts` cache
     * the browse grid and the profile reads under this tag — it is their
     * `EDUCATORS_CACHE_TAG`. Written as the literal rather than imported so this
     * action doesn't take a build dependency on a module it doesn't own; the two
     * are pinned together by the tag name itself, which is what the API's cache
     * key is anyway.
     */
    revalidateTag("educators", "max");
    revalidatePath("/dashboard/reviews");

    return {
      status: "success",
      redirectTo: "",
      message:
        result?.message ??
        (parsed.data.action === "publish"
          ? "Published. It's on the educator's profile now."
          : "Rejected. Nothing about it is public."),
    };
  } catch (error) {
    return toErrorState(error);
  }
}
