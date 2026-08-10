import { z } from "zod";

import {
  bookingFormatSchema,
  civilDateSchema,
  civilTimeSchema,
  sessionDurationSchema,
} from "@contracts/bookings.ts";

import {
  BOOKING_EDUCATORS,
  getBookingEducator,
  type BookingEducator,
  type BookingTopic,
} from "@/data/booking";

import {
  isDateOpen,
  openSlots,
  parseDateKey,
  type CivilDate,
  type CivilNow,
} from "./schedule";

/**
 * An in-progress booking, carried in a cookie so a parent who leaves to sign in
 * comes back to the choices they'd already made.
 *
 * **Only the choices.** The child's first name, the parent's contact details and
 * the home address are deliberately absent: they take seconds to retype, and a
 * minor's name and a residential address have no business sitting in browser
 * storage on what is often a shared family computer. What's restored is the
 * tedious part — who, what, when — and nothing that would matter if it leaked.
 *
 * A cookie rather than `sessionStorage` for one concrete reason: the server can
 * read it. The booking page therefore renders *already restored*, instead of
 * hydrating with defaults and correcting itself a frame later — which is both a
 * visible flicker and the `setState`-inside-an-effect pattern React now warns
 * about. It also survives a real navigation to `/login` and back, which a
 * tab-scoped store does only by accident.
 */
export const BOOKING_DRAFT_COOKIE = "ylj_booking_draft";

/** An hour is longer than any real booking sitting, and short enough to forget. */
const DRAFT_MAX_AGE_SECONDS = 60 * 60;

export const bookingDraftSchema = z
  .object({
    educatorSlug: z.string().max(60),
    subject: z.string().max(80).nullable(),
    format: bookingFormatSchema,
    durationMinutes: sessionDurationSchema,
    dateKey: civilDateSchema.nullable(),
    time: civilTimeSchema.nullable(),
    alternateTime: civilTimeSchema.nullable(),
    flexible: z.boolean(),
  })
  .strict();

export type BookingDraft = z.infer<typeof bookingDraftSchema>;

/** Parses a cookie value, returning null for anything unrecognised. Hand-edited
 * or stale cookies are an ordinary occurrence, not an error worth surfacing. */
export function parseBookingDraft(raw: string | undefined): BookingDraft | null {
  if (!raw) return null;
  try {
    const parsed = bookingDraftSchema.safeParse(JSON.parse(decodeURIComponent(raw)));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function serializeBookingDraft(draft: BookingDraft): string {
  return encodeURIComponent(JSON.stringify(draft));
}

/**
 * Writes the draft from the browser.
 *
 * `Path=/book` keeps it off every other request to this origin, and `SameSite=Lax`
 * is enough for something that holds no credential and no personal data. Not
 * `HttpOnly` — the page that writes it has to be able to.
 */
export function writeBookingDraft(draft: BookingDraft): void {
  document.cookie =
    `${BOOKING_DRAFT_COOKIE}=${serializeBookingDraft(draft)}` +
    `; Path=/book; Max-Age=${DRAFT_MAX_AGE_SECONDS}; SameSite=Lax`;
}

export function clearBookingDraft(): void {
  document.cookie = `${BOOKING_DRAFT_COOKIE}=; Path=/book; Max-Age=0; SameSite=Lax`;
}

/** The selection the booking flow opens with. */
export interface InitialSelection {
  educator: BookingEducator;
  subject: BookingTopic | null;
  format: BookingDraft["format"];
  durationMinutes: BookingDraft["durationMinutes"];
  date: CivilDate | null;
  time: string | null;
  alternateTime: string | null;
  flexible: boolean;
}

/**
 * Resolves a draft (and any `?educator=`) into a selection that is valid *now*.
 *
 * Every restored value is re-checked rather than trusted. A subject the educator
 * doesn't teach, a format they don't offer, and above all a date or time that has
 * since fallen inside the notice window are all dropped — a draft written
 * yesterday evening can easily name a slot that is no longer offerable, and
 * silently restoring it would put a parent in front of a pay button for a session
 * that can't happen.
 *
 * Pure, and given the same `now` it returns the same answer on the server and in
 * the browser, which is what lets the page render restored without a mismatch.
 */
export function resolveInitialSelection({
  draft,
  educatorSlug,
  now,
}: {
  draft: BookingDraft | null;
  educatorSlug: string | undefined;
  now: CivilNow;
}): InitialSelection {
  // An explicit `?educator=` is a fresh intent and outranks the draft.
  const requested = educatorSlug ? getBookingEducator(educatorSlug) : undefined;
  const fromDraft = draft ? getBookingEducator(draft.educatorSlug) : undefined;
  const educator = requested ?? fromDraft ?? BOOKING_EDUCATORS[0];

  const base: InitialSelection = {
    educator,
    subject: null,
    format: educator.formats.includes("in_home") ? "in_home" : educator.formats[0],
    durationMinutes: 60,
    date: null,
    time: null,
    alternateTime: null,
    flexible: false,
  };

  if (!draft) return base;

  /*
   * Matched by label against *this* educator's topics, so a draft naming "Piano"
   * cannot survive a switch to an arts teacher. The category comes back off the
   * educator's own record rather than the cookie, so a hand-edited cookie can't
   * pair a topic with a cheaper subject's rate.
   */
  const subject =
    educator.subjects.find((topic) => topic.label === draft.subject) ?? null;
  const format = educator.formats.includes(draft.format) ? draft.format : base.format;

  let date: CivilDate | null = null;
  let time: string | null = null;
  let alternateTime: string | null = null;

  if (draft.dateKey) {
    const stored = parseDateKey(draft.dateKey);
    if (isDateOpen(stored, educator, now)) {
      date = stored;
      const open = openSlots(stored, educator, now);
      if (draft.time && open.includes(draft.time)) time = draft.time;
      if (draft.alternateTime && open.includes(draft.alternateTime)) {
        alternateTime = draft.alternateTime;
      }
    }
  }

  return {
    educator,
    subject,
    format,
    durationMinutes: draft.durationMinutes,
    date,
    time,
    // A second choice without a first choice is meaningless.
    alternateTime: time ? alternateTime : null,
    flexible: draft.flexible,
  };
}
