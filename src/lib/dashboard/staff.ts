import "server-only";

import type { StaffMember } from "@contracts/staff-invites.ts";

import { ApiError, apiFetch } from "@/lib/api/server";
import { readSessionToken } from "@/lib/auth/cookies";

export interface StaffDirectory {
  items: StaffMember[];
  error: string | null;
}

/**
 * Loads the staff roster for the admin's directory. Returns the failure as data
 * rather than throwing, so the page renders with an inline notice instead of an
 * error boundary — same shape as `loadApplicationQueue`.
 */
export async function loadStaffDirectory(): Promise<StaffDirectory> {
  const token = await readSessionToken();

  try {
    const result = await apiFetch<{ items: StaffMember[] }>("/staff", { token });
    return { items: result.items, error: null };
  } catch (error) {
    return {
      items: [],
      error:
        error instanceof ApiError
          ? error.message
          : "We couldn't load the staff directory just now.",
    };
  }
}
