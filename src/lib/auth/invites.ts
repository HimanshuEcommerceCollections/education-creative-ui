import "server-only";

import type { z } from "zod";

import { inviteDetailsResponseSchema } from "@contracts/auth.ts";

import { ApiError, apiFetch } from "@/lib/api/server";

/**
 * `GET /auth/invite` as the contract defines it.
 *
 * Was a hand-written interface, i.e. a second copy of a schema the API already
 * owns and free to drift from it without anything failing.
 */
export type InviteDetails = z.infer<typeof inviteDetailsResponseSchema>;

/**
 * Reads an invite without consuming it, so the set-password page can greet the
 * invitee and name the role they're accepting.
 *
 * Returns a result rather than throwing: an expired invite is an expected state
 * this page has to render, not an error condition.
 */
export async function readInvite(
  token: string,
): Promise<{ ok: true; invite: InviteDetails } | { ok: false; message: string }> {
  try {
    const invite = await apiFetch<InviteDetails>(
      `/auth/invite?token=${encodeURIComponent(token)}`,
    );
    return { ok: true, invite };
  } catch (error) {
    if (error instanceof ApiError) return { ok: false, message: error.message };
    return {
      ok: false,
      message: "We couldn't check that invite just now. Please try again shortly.",
    };
  }
}
