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

export function fieldError(
  state: AuthFormState,
  field: string,
): string | undefined {
  return state.status === "error" ? state.fieldErrors?.[field] : undefined;
}

export function formMessage(state: AuthFormState): string | undefined {
  return state.status === "error" ? state.message : undefined;
}
