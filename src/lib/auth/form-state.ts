import type { ErrorCode } from "@contracts/errors.ts";

/**
 * What every auth Server Action returns to `useActionState`.
 *
 * Success carries a server-computed `redirectTo` rather than navigating on the
 * server, so the forms can play their confirmation animation before moving —
 * the celebration is real now, not a demo, but it still happens.
 */
export type AuthFormState =
  | { status: "idle" }
  | {
      status: "error";
      /** Shown above the submit button. */
      message: string;
      /** Keyed by form field name, rendered inline under the input. */
      fieldErrors?: Record<string, string>;
      /** Lets a form react to a specific failure (e.g. offer "resend link"). */
      code?: ErrorCode;
    }
  | { status: "success"; redirectTo: string; message?: string };

export const IDLE: AuthFormState = { status: "idle" };

/**
 * The one copy for an idled-out session, written once so a coordinator reads the
 * same sentence whichever surface timed out under them.
 */
export const SESSION_EXPIRED_MESSAGE =
  "Your session timed out, so that didn't save. Sign in again and we'll bring you straight back here.";

export function fieldError(
  state: AuthFormState,
  field: string,
): string | undefined {
  return state.status === "error" ? state.fieldErrors?.[field] : undefined;
}

export function formMessage(state: AuthFormState): string | undefined {
  return state.status === "error" ? state.message : undefined;
}

/**
 * True when any of these states is the API saying "you're not signed in".
 *
 * Every surface with an action asks this *before* rendering its ordinary error
 * text, because a timed-out session is not a problem with the row someone was
 * working on and a red box beside a field reads as though it were.
 */
export function sessionExpired(...states: AuthFormState[]): boolean {
  return states.some(
    (state) => state.status === "error" && state.code === "unauthenticated",
  );
}
