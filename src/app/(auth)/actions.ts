"use server";

import { redirect } from "next/navigation";

import {
  acceptInviteRequestSchema,
  forgotPasswordRequestSchema,
  type LoginResponse,
  loginRequestSchema,
  resetPasswordRequestSchema,
  signupRequestSchema,
  verifyEmailRequestSchema,
} from "@contracts/auth.ts";
import { submitEducatorApplicationSchema } from "@contracts/educator-applications.ts";

import {
  callApi,
  checkbox,
  optionalText,
  parseForm,
  text,
  toErrorState,
} from "@/lib/auth/action-helpers";
import {
  clearSessionCookie,
  readSessionToken,
  writeSessionCookie,
} from "@/lib/auth/cookies";
import type { AuthFormState } from "@/lib/auth/form-state";

/**
 * Stores the session the API just minted. The token lives only in an HttpOnly
 * cookie on this origin — the browser never holds it and never sees the API.
 */
async function persistSession(result: LoginResponse): Promise<void> {
  await writeSessionCookie(result.token, new Date(result.expiresAt));
}

// ---------------------------------------------------------------------------
// Signup — customers only. Educators apply; staff are invited.
// ---------------------------------------------------------------------------

export async function signupAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = parseForm(signupRequestSchema, {
    fullName: text(formData, "fullName"),
    email: text(formData, "email"),
    password: text(formData, "password"),
    consentGiven: checkbox(formData, "consentGiven"),
    subjectsOfInterest: formData.getAll("subjectsOfInterest").map(String),
    phone: optionalText(formData, "phone"),
  });
  if (!parsed.ok) return parsed.state;

  try {
    const result = await callApi<LoginResponse>("/auth/signup", {
      method: "POST",
      body: parsed.data,
    });
    await persistSession(result);

    // Not redirecting here: the form plays its confirmation animation first and
    // navigates itself.
    return { status: "success", redirectTo: result.redirectTo };
  } catch (error) {
    return toErrorState(error);
  }
}

// ---------------------------------------------------------------------------
// Login — one form for all four roles
// ---------------------------------------------------------------------------

export async function loginAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = parseForm(loginRequestSchema, {
    email: text(formData, "email"),
    password: text(formData, "password"),
    rememberMe: checkbox(formData, "rememberMe"),
  });
  if (!parsed.ok) return parsed.state;

  try {
    const result = await callApi<LoginResponse>("/auth/login", {
      method: "POST",
      body: parsed.data,
    });
    await persistSession(result);

    // `redirectTo` is decided server-side from the session's role — a customer
    // lands on the homepage, an educator on their dashboard, staff on theirs. The
    // browser never derives this from a role it could tamper with.
    return { status: "success", redirectTo: result.redirectTo };
  } catch (error) {
    return toErrorState(error);
  }
}

// ---------------------------------------------------------------------------
// Email verification
// ---------------------------------------------------------------------------

/**
 * Confirms an email from a button press, not on page load. Verification tokens
 * are single-use, and mail clients and link scanners routinely prefetch URLs —
 * consuming the token during render would burn it before the user ever clicked.
 */
export async function verifyEmailAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = parseForm(verifyEmailRequestSchema, { token: text(formData, "token") });
  if (!parsed.ok) {
    return {
      status: "error",
      message: "That confirmation link doesn't look right.",
      code: "invalid_token",
    };
  }

  try {
    await callApi("/auth/verify-email", { method: "POST", body: parsed.data });
    return { status: "success", redirectTo: "/account", message: "Your email is confirmed." };
  } catch (error) {
    return toErrorState(error);
  }
}

export async function resendVerificationAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = text(formData, "email");
  try {
    const result = await callApi<{ message: string }>("/auth/resend-verification", {
      method: "POST",
      body: { email },
    });
    return { status: "success", redirectTo: "", message: result.message };
  } catch (error) {
    return toErrorState(error);
  }
}

// ---------------------------------------------------------------------------
// Password reset
// ---------------------------------------------------------------------------

export async function forgotPasswordAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = parseForm(forgotPasswordRequestSchema, {
    email: text(formData, "email"),
  });
  if (!parsed.ok) return parsed.state;

  try {
    const result = await callApi<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: parsed.data,
    });
    // Deliberately the same reply whether or not the address exists.
    return { status: "success", redirectTo: "", message: result.message };
  } catch (error) {
    return toErrorState(error);
  }
}

export async function resetPasswordAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = parseForm(resetPasswordRequestSchema, {
    token: text(formData, "token"),
    password: text(formData, "password"),
  });
  if (!parsed.ok) return parsed.state;

  try {
    const result = await callApi<{ message: string }>("/auth/reset-password", {
      method: "POST",
      body: parsed.data,
    });
    // The reset revoked every session, so any cookie held here is now dead.
    await clearSessionCookie();
    return { status: "success", redirectTo: "/login", message: result.message };
  } catch (error) {
    return toErrorState(error);
  }
}

// ---------------------------------------------------------------------------
// Invite acceptance — educators and staff
// ---------------------------------------------------------------------------

export async function acceptInviteAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = parseForm(acceptInviteRequestSchema, {
    token: text(formData, "token"),
    password: text(formData, "password"),
    attestAdult: checkbox(formData, "attestAdult"),
  });
  if (!parsed.ok) return parsed.state;

  try {
    const result = await callApi<LoginResponse>("/auth/accept-invite", {
      method: "POST",
      body: parsed.data,
    });
    await persistSession(result);
    return { status: "success", redirectTo: result.redirectTo };
  } catch (error) {
    return toErrorState(error);
  }
}

// ---------------------------------------------------------------------------
// Educator application — creates no account
// ---------------------------------------------------------------------------

export async function submitApplicationAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const subject = optionalText(formData, "subject");

  const parsed = parseForm(submitEducatorApplicationSchema, {
    applicantName: text(formData, "applicantName"),
    email: text(formData, "email"),
    phone: optionalText(formData, "phone"),
    // The form offers a single select; the contract takes an array.
    subjectsOfInterest: subject ? [subject] : [],
    yearsExperience: optionalText(formData, "yearsExperience"),
    about: text(formData, "about"),
  });
  if (!parsed.ok) {
    // Map the contract's field name back onto the form's input name.
    if (parsed.state.status === "error" && parsed.state.fieldErrors?.subjectsOfInterest) {
      parsed.state.fieldErrors.subject = parsed.state.fieldErrors.subjectsOfInterest;
    }
    return parsed.state;
  }

  try {
    const result = await callApi<{ message: string }>("/educator-applications", {
      method: "POST",
      body: parsed.data,
    });
    // No redirect: an applicant has no account to go to.
    return { status: "success", redirectTo: "", message: result.message };
  } catch (error) {
    return toErrorState(error);
  }
}

// ---------------------------------------------------------------------------
// Sign out
// ---------------------------------------------------------------------------

/**
 * Revokes the session server-side, then clears the cookie. Best-effort on the
 * API call: if it fails, the cookie still goes, so the user is signed out here
 * regardless and the orphaned row expires on its own.
 */
export async function signOutAction(): Promise<never> {
  const token = await readSessionToken();

  if (token) {
    try {
      await callApi("/auth/logout", { method: "POST", token });
    } catch {
      // Fall through — clearing the cookie is the part that must happen.
    }
  }

  await clearSessionCookie();
  redirect("/");
}

export async function signOutEverywhereAction(): Promise<never> {
  const token = await readSessionToken();

  if (token) {
    try {
      await callApi("/auth/logout-everywhere", { method: "POST", token });
    } catch {
      // As above.
    }
  }

  await clearSessionCookie();
  redirect("/");
}
