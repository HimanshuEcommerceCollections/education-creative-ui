import "server-only";

import { z } from "zod";

import { ApiError, ApiUnreachableError, apiFetch, type ApiRequestOptions } from "@/lib/api/server";

import { clientRequestMeta, readSessionToken } from "./cookies";
import { SESSION_EXPIRED_MESSAGE, type AuthFormState } from "./form-state";

/**
 * Validates form input against the **shared** contract schema — the same one the
 * API enforces — so the client can never accept something the server rejects.
 *
 * Returns a ready-to-render error state rather than throwing, because a bad form
 * submission isn't an exception.
 */
export function parseForm<T extends z.ZodType>(
  schema: T,
  input: unknown,
): { ok: true; data: z.infer<T> } | { ok: false; state: AuthFormState } {
  const result = schema.safeParse(input);
  if (result.success) return { ok: true, data: result.data };

  const fieldErrors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const field = issue.path.map(String).join(".");
    if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
  }

  return {
    ok: false,
    state: {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors,
      code: "validation_failed",
    },
  };
}

/**
 * Turns any API failure into a renderable state. Keeps the exact server message
 * — those are already written for users — and preserves the code so a form can
 * react to a specific case.
 *
 * `unauthenticated` is the one code rewritten rather than passed through. The
 * API's own wording is fine for an API client and useless to a coordinator whose
 * 45-minute staff window quietly closed mid-note: they need to be told to sign in
 * again, in one sentence, in a box that doesn't look like a field error. Every
 * surface with an action checks `sessionExpired(state)` and renders
 * `<SessionExpiredAlert />` instead of its usual message, so this is handled once
 * here and once per surface rather than being reinvented per form.
 */
export function toErrorState(error: unknown): AuthFormState {
  if (error instanceof ApiError) {
    if (error.code === "unauthenticated") {
      return {
        status: "error",
        message: SESSION_EXPIRED_MESSAGE,
        code: "unauthenticated",
      };
    }

    return {
      status: "error",
      message: error.message,
      ...(error.fieldErrors ? { fieldErrors: error.fieldErrors } : {}),
      code: error.code,
    };
  }

  if (error instanceof ApiUnreachableError) {
    return {
      status: "error",
      message: "We couldn't reach the server. Please check your connection and try again.",
      code: "internal_error",
    };
  }

  return {
    status: "error",
    message: "Something went wrong. Please try again.",
    code: "internal_error",
  };
}

/**
 * Calls the API with the real client IP and user agent attached — the API stamps
 * them onto consent records and audit rows, so omitting them would make those
 * records describe Vercel rather than the user.
 */
export async function callApi<T>(
  path: string,
  options: Omit<ApiRequestOptions, "clientIp" | "clientUserAgent"> = {},
): Promise<T> {
  const meta = await clientRequestMeta();
  return apiFetch<T>(path, { ...options, ...meta });
}

/** As `callApi`, but forwards the caller's session token too. */
export async function callApiAuthed<T>(
  path: string,
  options: Omit<ApiRequestOptions, "clientIp" | "clientUserAgent" | "token"> = {},
): Promise<T> {
  const token = await readSessionToken();
  return callApi<T>(path, { ...options, token });
}

/** Reads a checkbox out of FormData — present means checked. */
export function checkbox(formData: FormData, name: string): boolean {
  return formData.get(name) !== null;
}

/** Reads a trimmed string, or undefined when blank so `.optional()` applies. */
export function optionalText(formData: FormData, name: string): string | undefined {
  const value = formData.get(name);
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function text(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}
