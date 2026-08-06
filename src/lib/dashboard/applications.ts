import "server-only";

import type { ApplicationSummary } from "@/components/dashboard/application-row";
import { ApiError, apiFetch } from "@/lib/api/server";
import { readSessionToken } from "@/lib/auth/cookies";

export interface ApplicationQueue {
  open: ApplicationSummary[];
  settled: ApplicationSummary[];
  error: string | null;
}

/**
 * Loads the educator review queue and splits it by whether a decision has been
 * made. Returns the failure as data rather than throwing, so the dashboard can
 * render with an inline notice instead of an error boundary.
 *
 * Shared by the overview (which only needs the counts) and the applications page.
 */
export async function loadApplicationQueue(): Promise<ApplicationQueue> {
  const token = await readSessionToken();

  try {
    const result = await apiFetch<{ items: ApplicationSummary[] }>(
      "/educator-applications?limit=100",
      { token },
    );

    return {
      open: result.items.filter(
        (item) => item.status === "submitted" || item.status === "in_review",
      ),
      settled: result.items.filter(
        (item) => item.status === "approved" || item.status === "rejected",
      ),
      error: null,
    };
  } catch (error) {
    return {
      open: [],
      settled: [],
      error:
        error instanceof ApiError
          ? error.message
          : "We couldn't load the review queue just now.",
    };
  }
}
