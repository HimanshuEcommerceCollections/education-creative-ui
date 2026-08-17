import { BOOKING_TIMEZONE } from "@contracts/bookings.ts";

import type { BookingEducator, BookingRules } from "@/data/booking";

/**
 * Civil-date arithmetic for the booking calendar.
 *
 * Everything here works in **civil** dates and times in `BOOKING_TIMEZONE` — a
 * `{ year, month, day }` and an `"HH:MM"` — never a `Date` carrying an instant.
 * The source page built `new Date(viewY, viewM, d)` in the *visitor's* zone and
 * compared it against slots labelled in ours, which silently shifts a Saturday
 * morning into Friday night for anyone west of us. Keeping civil values civil
 * removes the bug class rather than patching it.
 *
 * A second benefit: because "today" is resolved through `Intl` with an explicit
 * `timeZone`, this module returns the same answer on the server and in the
 * browser, so the calendar can render during SSR without a hydration mismatch.
 */

export interface CivilDate {
  year: number;
  /** 1–12, unlike `Date#getMonth()`. */
  month: number;
  day: number;
}

const NY_PARTS = new Intl.DateTimeFormat("en-US", {
  timeZone: BOOKING_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** A civil date plus a wall-clock time, as read in `BOOKING_TIMEZONE`. */
export interface CivilNow extends CivilDate {
  hour: number;
  minute: number;
}

/** The current civil date and time where the platform operates. */
export function civilNow(at: Date = new Date()): CivilNow {
  const parts = NY_PARTS.formatToParts(at);
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? "0");

  return {
    year: read("year"),
    month: read("month"),
    day: read("day"),
    hour: read("hour"),
    minute: read("minute"),
  };
}

/** `YYYY-MM-DD` — the wire format for `preferredDate`. */
export function toDateKey({ year, month, day }: CivilDate): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function parseDateKey(key: string): CivilDate {
  const [year, month, day] = key.split("-").map(Number);
  return { year, month, day };
}

/**
 * `0` = Sunday, matching `Date#getDay()` and the `day` field on an availability
 * window. Built through `Date.UTC` so the answer can't depend on where this runs.
 */
export function weekdayOf({ year, month, day }: CivilDate): number {
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** Weekday the 1st falls on, i.e. how many blank cells the grid starts with. */
export function firstWeekdayOfMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
}

/**
 * Minutes from an arbitrary fixed origin, for comparing two civil moments in the
 * same zone. Both sides go through `Date.UTC`, so the difference is the civil
 * difference and no offset lookup is involved.
 *
 * Across a DST boundary this makes the notice rule 23 or 25 hours rather than 24,
 * twice a year. That is not worth a timezone library on a "we need a day's
 * notice" business rule.
 */
function civilMinutes(date: CivilDate, hour = 0, minute = 0): number {
  return Date.UTC(date.year, date.month - 1, date.day, hour, minute) / 60_000;
}

export function isSameDate(a: CivilDate | null, b: CivilDate | null): boolean {
  if (!a || !b) return false;
  return a.year === b.year && a.month === b.month && a.day === b.day;
}

/**
 * Latest month the calendar will page to, as `{ year, month }`.
 *
 * `rules` comes from site configuration by way of the booking page, so every
 * function here that has an opinion about *when* takes it explicitly rather than
 * reading a module constant — which is what lets one page render the live window
 * and the tests render whatever they need.
 */
export function lastOpenMonth(
  now: CivilNow,
  rules: BookingRules,
): { year: number; month: number } {
  const zeroBased = now.month - 1 + rules.windowMonths;
  return { year: now.year + Math.floor(zeroBased / 12), month: (zeroBased % 12) + 1 };
}

/**
 * Whether a date can be picked at all: inside the booking window, not in the
 * past, and with at least one slot left once the notice rule is applied.
 *
 * Note it takes the educator — a day with no availability window is dead for
 * *this* educator, and greying it out is far clearer than letting a parent click
 * through to an empty time list. The source page instead greyed out every Sunday
 * for everyone, which is wrong for the four educators who teach then.
 */
export function isDateOpen(
  date: CivilDate,
  educator: BookingEducator,
  now: CivilNow,
  rules: BookingRules,
): boolean {
  const startOfToday = civilMinutes(now);
  if (civilMinutes(date) < startOfToday) return false;

  const last = lastOpenMonth(now, rules);
  if (date.year * 12 + date.month > last.year * 12 + last.month) return false;

  return openSlots(date, educator, now, rules).length > 0;
}

/**
 * The educator's open start times on this date, after dropping anything inside
 * the notice window.
 *
 * Every time returned is genuinely offerable, so there is no "booked" state to
 * render: nothing is reserved until a coordinator confirms, and showing fake
 * `booked` chips — as the source page did, from `(dayOfMonth + index) % 4` —
 * invents scarcity the system cannot back up.
 */
export function openSlots(
  date: CivilDate,
  educator: BookingEducator,
  now: CivilNow,
  rules: BookingRules,
): string[] {
  const weekday = weekdayOf(date);
  const window = educator.availability.find((entry) => entry.day === weekday);
  if (!window) return [];

  const earliest =
    civilMinutes(now, now.hour, now.minute) + rules.minNoticeHours * 60;

  return window.times.filter((time) => {
    const [hour, minute] = time.split(":").map(Number);
    return civilMinutes(date, hour, minute) >= earliest;
  });
}

/** First date this educator can actually be requested for, or null if none. */
export function firstOpenDate(
  educator: BookingEducator,
  now: CivilNow,
  rules: BookingRules,
): CivilDate | null {
  const last = lastOpenMonth(now, rules);
  const cursor: CivilDate = { year: now.year, month: now.month, day: now.day };

  while (cursor.year * 12 + cursor.month <= last.year * 12 + last.month) {
    if (isDateOpen(cursor, educator, now, rules)) return { ...cursor };

    cursor.day += 1;
    if (cursor.day > daysInMonth(cursor.year, cursor.month)) {
      cursor.day = 1;
      cursor.month += 1;
      if (cursor.month > 12) {
        cursor.month = 1;
        cursor.year += 1;
      }
    }
  }

  return null;
}

const MONTH_TITLE = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  month: "long",
  year: "numeric",
});

const DATE_MEDIUM = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  weekday: "short",
  month: "short",
  day: "numeric",
});

const DATE_LONG = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  weekday: "long",
  month: "long",
  day: "numeric",
});

/**
 * Civil values are formatted as UTC instants deliberately: `Date.UTC` puts the
 * civil numbers in, `timeZone: "UTC"` reads the same numbers back out, and no
 * shift happens in between. Formatting them in `BOOKING_TIMEZONE` instead would
 * subtract five hours from a midnight that never represented one.
 */
export function monthTitle(year: number, month: number): string {
  return MONTH_TITLE.format(new Date(Date.UTC(year, month - 1, 1)));
}

export function formatDate(date: CivilDate, style: "medium" | "long" = "medium"): string {
  const instant = new Date(Date.UTC(date.year, date.month - 1, date.day));
  return (style === "long" ? DATE_LONG : DATE_MEDIUM).format(instant);
}

/** `"16:00"` → `"4:00 PM"`. */
export function formatTime(time: string): string {
  const [hour, minute] = time.split(":").map(Number);
  const suffix = hour < 12 ? "AM" : "PM";
  const twelve = hour % 12 === 0 ? 12 : hour % 12;
  return `${twelve}:${String(minute).padStart(2, "0")} ${suffix}`;
}

/** Short weekday initials for the calendar header. */
export const WEEKDAY_INITIALS = ["S", "M", "T", "W", "T", "F", "S"] as const;
