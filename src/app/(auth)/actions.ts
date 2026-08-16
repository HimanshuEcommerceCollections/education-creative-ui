"use server";

import { redirect } from "next/navigation";

import {
  PASSWORD_MIN_LENGTH,
  acceptInviteRequestSchema,
  forgotPasswordRequestSchema,
  type LoginResponse,
  loginRequestSchema,
  passwordSchema,
  resendVerificationRequestSchema,
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

    /*
     * Where "done" leads depends on whether this device holds a session at all.
     * Confirmation links get opened on phones that were never signed in, and
     * sending those to `/account` bounced them through `/login?next=/account` —
     * the confirmation succeeded and the user was shown a sign-in form with no
     * explanation, which reads exactly like a failure.
     */
    const signedIn = (await readSessionToken()) !== null;
    return {
      status: "success",
      redirectTo: signedIn ? "/account" : "/login",
      message: "Your email is confirmed.",
    };
  } catch (error) {
    return toErrorState(error);
  }
}

/**
 * Sends a fresh confirmation link.
 *
 * Public and deliberately non-enumerating on the API side, which is what lets the
 * sign-in page and the token pages offer it to someone who isn't signed in — the
 * reply is identical whether or not the address has an unconfirmed account.
 */
export async function resendVerificationAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = parseForm(resendVerificationRequestSchema, {
    email: text(formData, "email"),
  });
  if (!parsed.ok) return parsed.state;

  try {
    const result = await callApi<{ message: string }>("/auth/resend-verification", {
      method: "POST",
      body: parsed.data,
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

/**
 * Changes the password of a signed-in account, current password required.
 *
 * Distinct from the reset flow, and the two must not be collapsed into one: mailing a
 * `/forgot-password` link to someone who is already authenticated and holds their
 * current password is a round trip through an inbox for no security gain.
 *
 * The API revokes every other session on success (the same rule as a reset), so
 * this deliberately does not clear the cookie *this* device holds.
 *
 * The new password is checked against the shared `passwordSchema`, so this form
 * can't accept one the API will reject. `confirmPassword` is not sent: it exists to
 * catch a typo in the browser, and the API has no business knowing about it.
 */
export async function changePasswordAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const currentPassword = text(formData, "currentPassword");
  const newPassword = text(formData, "newPassword");
  const confirmPassword = text(formData, "confirmPassword");

  if (currentPassword.length === 0) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors: { currentPassword: "Enter your current password." },
      code: "validation_failed",
    };
  }

  // Checked here rather than server-side: the confirmation box exists to catch a
  // typo in the browser, and the API has no business knowing about it.
  if (newPassword !== confirmPassword) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors: { confirmPassword: "These two don't match." },
      code: "validation_failed",
    };
  }

  const parsed = parseForm(passwordSchema, newPassword);
  if (!parsed.ok) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors: {
        newPassword: `Use at least ${PASSWORD_MIN_LENGTH} characters.`,
      },
      code: "validation_failed",
    };
  }

  try {
    const token = await readSessionToken();
    const result = await callApi<{ message: string }>("/auth/change-password", {
      method: "POST",
      token,
      body: { currentPassword, newPassword: parsed.data },
    });
    return {
      status: "success",
      redirectTo: "",
      message: result.message ?? "Your password is updated.",
    };
  } catch (error) {
    const state = toErrorState(error);
    // The contract keys a wrong current password however it likes; attach it to
    // the input the person is looking at.
    if (state.status === "error" && state.code === "invalid_credentials") {
      return { ...state, fieldErrors: { currentPassword: state.message } };
    }
    return state;
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
