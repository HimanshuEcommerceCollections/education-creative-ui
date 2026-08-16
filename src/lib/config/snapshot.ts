import "server-only";

import type { ConfigSnapshot } from "@contracts/config.ts";

import { DEFAULT_BOOKING_RULES, type BookingRules } from "@/data/booking";
import { apiFetch } from "@/lib/api/server";

/**
 * The public site-configuration snapshot — booking rules a parent is shown
 * before they pay, and the switches that decide whether a public form accepts.
 *
 * Cached under the `config` tag with a five-minute backstop; the dashboard's
 * save action calls `revalidateTag("config")`, so an admin edit reaches the site
 * on the next request rather than the next deploy.
 *
 * Returns null when the API can't answer (including at build time with no API
 * running). Callers fall back to the in-repo figures — a booking page must
 * degrade to yesterday's notice window, never to a broken one.
 */
export async function loadConfigSnapshot(): Promise<ConfigSnapshot | null> {
  try {
    return await apiFetch<ConfigSnapshot>("/config/snapshot", {
      next: { revalidate: 300, tags: ["config"] },
    });
  } catch {
    return null;
  }
}

/**
 * The booking rules the flow renders and validates against.
 *
 * The in-repo constants in `data/booking.ts` are the fallback rather than a
 * second opinion: they are the same figures the API's registry ships as its
 * defaults, so an unreachable API leaves the calendar behaving exactly as it did
 * before the store existed.
 *
 * The API is still the enforcement. These numbers grey out slots and print
 * promises; a Server Action is a public endpoint, and `assertRequestableSlot`
 * re-checks every one of them against the same live config.
 */
export function bookingRules(snapshot: ConfigSnapshot | null): BookingRules {
  if (!snapshot) return DEFAULT_BOOKING_RULES;

  return {
    minNoticeHours: snapshot.booking.minNoticeHours,
    windowMonths: snapshot.booking.windowMonths,
    confirmationSlaDays: snapshot.booking.confirmationSlaDays,
  };
}

/**
 * Whether a public entry point is accepting.
 *
 * `true` when the API can't be reached, deliberately: a switch nobody has
 * touched is on, and a network blip is not an instruction to close the doors. A
 * form shown while the platform is genuinely paused is refused server-side with
 * the admin's own message, which is a worse experience than hiding it and a far
 * better one than hiding a form that was never switched off.
 */
export function configFlags(snapshot: ConfigSnapshot | null): ConfigSnapshot["flags"] {
  return (
    snapshot?.flags ?? {
      bookingsEnabled: true,
      reviewsEnabled: true,
      educatorApplicationsOpen: true,
    }
  );
}
