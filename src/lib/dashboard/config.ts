import "server-only";

import type { ConfigAdminView } from "@contracts/config.ts";

import { ApiError, apiFetch } from "@/lib/api/server";
import { readSessionToken } from "@/lib/auth/cookies";

export interface ConfigAdminData {
  view: ConfigAdminView | null;
  error: string | null;
}

/**
 * Site configuration as this session may see it.
 *
 * The API filters by role — a coordinator's response simply doesn't contain the
 * platform's economics — so the page renders whatever came back rather than
 * deciding visibility itself. Failure comes back as data, same shape as the
 * other dashboard loaders, so the page shows an inline notice instead of an
 * error boundary.
 */
export async function loadConfigAdmin(): Promise<ConfigAdminData> {
  const token = await readSessionToken();

  try {
    const view = await apiFetch<ConfigAdminView>("/config/admin", { token });
    return { view, error: null };
  } catch (error) {
    return {
      view: null,
      error:
        error instanceof ApiError
          ? error.message
          : "We couldn't load site configuration just now.",
    };
  }
}
