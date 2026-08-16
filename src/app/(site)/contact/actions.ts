"use server";

import { submitContactRequestSchema } from "@contracts/contact-requests.ts";

import { ApiError } from "@/lib/api/server";
import {
  callApi,
  optionalText,
  parseForm,
  text,
  toErrorState,
} from "@/lib/auth/action-helpers";
import type { AuthFormState } from "@/lib/auth/form-state";

/**
 * `rate_limited` in the API's own words is written for a generic caller and
 * reads as a machine refusing a request. The person on the other end of this
 * form is often a parent who was routed here from the booking flow, so they need
 * two facts instead: nothing is broken, and the way through is to wait a moment
 * — with the address that always works if they'd rather not.
 */
const RATE_LIMITED_MESSAGE =
  "That's a few messages from this connection in a short time, so we've paused new ones for a little while. " +
  "Nothing is wrong with what you wrote — please try again shortly.";

/**
 * Sends the public contact form to `POST /contact-requests`.
 *
 * Public and unauthenticated by design: a parent stuck part-way through booking
 * is exactly who this form is for, and making them sign in first would be a dead
 * end at the worst moment. The API rate-limits per IP, and `callApi` forwards the
 * real client IP so that limit applies to the sender rather than to this app's
 * host.
 *
 * The browser does no validation of its own — the contract schema is parsed here,
 * which is the only parse that counts, since a Server Action is a public endpoint.
 */
export async function submitContactRequestAction(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  /*
   * The honeypot, answered before anything else.
   *
   * A filled `website` means a bot, and the reply has to be indistinguishable
   * from a successful send or the field teaches the next crawler to leave it
   * alone. It is also checked *before* `parseForm`: the contract types the field
   * as `max(0)`, so parsing a filled one would come back as a validation error
   * pointing at an input no human can see, which is both a dead end for anyone
   * who somehow tripped it and a tell for anyone probing.
   */
  if (text(formData, "website").trim().length > 0) {
    return { status: "success", redirectTo: "" };
  }

  const parsed = parseForm(submitContactRequestSchema, {
    name: text(formData, "name"),
    email: text(formData, "email"),
    phone: optionalText(formData, "phone"),
    reason: text(formData, "reason"),
    message: text(formData, "message"),
  });
  if (!parsed.ok) return parsed.state;

  try {
    await callApi("/contact-requests", { method: "POST", body: parsed.data });

    // No redirect: there's no account to land in, and the confirmation replaces
    // the form in place. The wording lives in the component rather than riding
    // on the API's message, so the honeypot's silent success reads identically.
    return { status: "success", redirectTo: "" };
  } catch (error) {
    if (error instanceof ApiError && error.code === "rate_limited") {
      return { status: "error", message: RATE_LIMITED_MESSAGE, code: "rate_limited" };
    }
    return toErrorState(error);
  }
}
