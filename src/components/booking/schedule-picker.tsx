"use client";

import { useMemo, useState } from "react";

import type { BookingEducator, BookingRules } from "@/data/booking";
import {
  WEEKDAY_INITIALS,
  daysInMonth,
  firstOpenDate,
  firstWeekdayOfMonth,
  formatTime,
  isDateOpen,
  isSameDate,
  lastOpenMonth,
  monthTitle,
  openSlots,
  type CivilDate,
  type CivilNow,
} from "@/lib/booking/schedule";
import { cn } from "@/lib/utils";

import { ChevronLeftIcon, ChevronRightIcon } from "./booking-icons";

interface SchedulePickerProps {
  educator: BookingEducator;
  /** Owned by the flow so the calendar and the flow agree on the notice window. */
  now: CivilNow;
  /**
   * The live notice and window rules from site configuration. Owned by the flow
   * for the same reason `now` is: the calendar's greyed-out days and the flow's
   * own re-checks have to be answering the same question.
   */
  rules: BookingRules;
  date: CivilDate | null;
  time: string | null;
  alternateTime: string | null;
  flexible: boolean;
  /**
   * Validation messages from the shared contract, keyed by its own field names.
   *
   * This step has to be able to show one, or a collision between the preferred and
   * the alternate time is invisible: the contract rejects it at `alternateTime`, and
   * with nowhere to render that, the summary says "please check the highlighted
   * fields" while nothing anywhere is highlighted.
   */
  errors?: {
    preferredDate?: string;
    preferredTime?: string;
    alternateTime?: string;
  };
  onDate: (date: CivilDate) => void;
  onTime: (time: string) => void;
  onAlternateTime: (time: string | null) => void;
  onFlexible: (flexible: boolean) => void;
}

/**
 * Step 3 — the date and time the parent would prefer.
 *
 * Two things this deliberately does not do. It does not show fabricated "booked"
 * slots: nothing is reserved until a coordinator confirms, so inventing scarcity
 * would be a lie the system can't back. And it does not grey out a fixed day for
 * everyone — open days come from *this* educator's availability, so the four who
 * teach on Sundays are bookable on Sundays.
 *
 * The second-choice time and the flexible checkbox are here to spend a parent's
 * ten seconds instead of a coordinator's email: with nothing held, a single fixed
 * request that can't be met costs a round trip.
 */
export function SchedulePicker({
  educator,
  now,
  rules,
  date,
  time,
  alternateTime,
  flexible,
  errors,
  onDate,
  onTime,
  onAlternateTime,
  onFlexible,
}: SchedulePickerProps) {
  const limit = useMemo(() => lastOpenMonth(now, rules), [now, rules]);

  /**
   * Which month is on screen is *derived*, not synchronised.
   *
   * The default follows the selection — or, with nothing selected, the first month
   * that has an open day, so an educator who only teaches from next month doesn't
   * open on an empty grid. Paging sets an override, and that override is what the
   * arrows move. No effect mirrors the selected date into state, which is what
   * makes the flow's prefill and draft restore land correctly on the first render
   * rather than one frame later.
   */
  const [pagedTo, setPagedTo] = useState<{ year: number; month: number } | null>(null);

  const fallback = useMemo(
    () => firstOpenDate(educator, now, rules) ?? now,
    [educator, now, rules],
  );

  const anchor = date ?? fallback;
  const view = pagedTo ?? { year: anchor.year, month: anchor.month };

  const atStart = view.year === now.year && view.month === now.month;
  const atEnd = view.year === limit.year && view.month === limit.month;

  const step = (delta: number) => {
    const zeroBased = view.month - 1 + delta;
    setPagedTo({
      year: view.year + Math.floor(zeroBased / 12),
      month: (((zeroBased % 12) + 12) % 12) + 1,
    });
  };

  const leadingBlanks = firstWeekdayOfMonth(view.year, view.month);
  const total = daysInMonth(view.year, view.month);
  const days = Array.from({ length: total }, (_, index) => index + 1);

  const slots = date ? openSlots(date, educator, now, rules) : [];
  const alternatives = slots.filter((slot) => slot !== time);

  return (
    <div className="grid gap-6">
      <div>
        <div className="mb-[14px] flex items-center justify-between">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={atStart}
            aria-label="Previous month"
            className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-[10px] border border-line bg-white text-ink transition-colors duration-[250ms] hover:bg-[var(--chip-a)] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
          >
            <ChevronLeftIcon className="h-[18px] w-[18px]" />
          </button>

          <span aria-live="polite" className="font-serif text-[16px] font-semibold">
            {monthTitle(view.year, view.month)}
          </span>

          <button
            type="button"
            onClick={() => step(1)}
            disabled={atEnd}
            aria-label="Next month"
            className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-[10px] border border-line bg-white text-ink transition-colors duration-[250ms] hover:bg-[var(--chip-a)] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
          >
            <ChevronRightIcon className="h-[18px] w-[18px]" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-[6px]">
          {WEEKDAY_INITIALS.map((initial, index) => (
            <span
              // Duplicate initials (two T's, two S's) make the letter a bad key.
              key={index}
              aria-hidden="true"
              className="py-1 text-center text-[11px] font-bold text-muted"
            >
              {initial}
            </span>
          ))}

          {Array.from({ length: leadingBlanks }, (_, index) => (
            <span key={`blank-${index}`} aria-hidden="true" />
          ))}

          {days.map((day) => {
            const cell: CivilDate = { year: view.year, month: view.month, day };
            const open = isDateOpen(cell, educator, now, rules);
            const active = isSameDate(cell, date);

            return (
              <button
                key={day}
                type="button"
                disabled={!open}
                aria-pressed={active}
                onClick={() => onDate(cell)}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-[11px] text-[14px] font-semibold transition-[background-color,color,transform] duration-[250ms] motion-reduce:transition-none",
                  open
                    ? "cursor-pointer bg-ivory text-ink hover:-translate-y-[2px] hover:bg-[var(--chip-a)]"
                    : "cursor-not-allowed bg-transparent text-[#c5c5cc]",
                  active &&
                    "bg-slate text-white shadow-[0_10px_22px_-10px_rgba(46,58,115,0.6)] hover:bg-slate",
                )}
              >
                {day}
              </button>
            );
          })}
        </div>

        <p className="mt-3 text-[12.5px] leading-[1.55] text-muted">
          Open days are {educator.name.split(" ")[0]}&rsquo;s usual teaching days. We need
          at least {rules.minNoticeHours} hours&rsquo; notice, so today and tomorrow
          may be closed.
        </p>

        <p
          id="booking-date-error"
          hidden={!errors?.preferredDate}
          className="mt-[9px] text-[12.5px] font-semibold text-[#b23b3b]"
        >
          {errors?.preferredDate}
        </p>
      </div>

      <fieldset>
        <legend className="mb-3 block text-[13px] font-bold tracking-[0.02em] text-ink">
          Preferred time <span className="text-slate">*</span>
        </legend>

        {!date ? (
          <p className="text-[14px] italic text-muted">Pick a date to see open times.</p>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-[10px] max-[560px]:grid-cols-2">
              {slots.map((slot) => {
                const active = slot === time;
                return (
                  <label key={slot} className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="preferredTime"
                      value={slot}
                      checked={active}
                      onChange={() => onTime(slot)}
                      className="peer sr-only"
                    />
                    <span
                      className={cn(
                        "block rounded-[11px] border-[1.5px] bg-white px-2 py-3 text-center text-[14px] font-semibold transition-[border-color,box-shadow,transform,color] duration-[250ms] motion-reduce:transition-none",
                        "hover:-translate-y-[2px] hover:border-[rgba(46,58,115,0.4)]",
                        "peer-checked:border-slate peer-checked:text-slate peer-checked:shadow-[0_0_0_3px_rgba(46,58,115,0.14)]",
                        "peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-slate",
                        active ? "border-slate text-slate" : "border-line text-ink",
                      )}
                    >
                      {formatTime(slot)}
                    </span>
                  </label>
                );
              })}
            </div>

            <p aria-live="polite" className="mt-3 text-[12.5px] text-muted">
              {slots.length} open {slots.length === 1 ? "time" : "times"} on this date.
            </p>
          </>
        )}

        <p
          id="booking-time-error"
          hidden={!errors?.preferredTime}
          className="mt-[9px] text-[12.5px] font-semibold text-[#b23b3b]"
        >
          {errors?.preferredTime}
        </p>
      </fieldset>

      {date && time ? (
        <div className="rounded-[16px] border border-line bg-ivory p-[18px]">
          <p className="mb-3 text-[13px] font-bold tracking-[0.02em] text-ink">
            Give us a fallback{" "}
            <span className="font-medium text-muted">(optional, but it helps)</span>
          </p>

          {alternatives.length > 0 ? (
            <div className="relative mb-3">
              <label htmlFor="alternateTime" className="sr-only">
                Second-choice time
              </label>
              <select
                id="alternateTime"
                name="alternateTime"
                value={alternateTime ?? ""}
                onChange={(event) => onAlternateTime(event.target.value || null)}
                aria-invalid={errors?.alternateTime ? true : undefined}
                aria-describedby={
                  errors?.alternateTime ? "booking-alternate-error" : undefined
                }
                className={cn(
                  "w-full cursor-pointer appearance-none rounded-[11px] border-[1.5px] bg-white px-[15px] py-[11px] pr-[42px] text-[14px] font-semibold text-ink focus:border-slate focus:outline-none",
                  errors?.alternateTime ? "border-[#b23b3b]" : "border-line",
                )}
              >
                <option value="">No second choice</option>
                {alternatives.map((slot) => (
                  <option key={slot} value={slot}>
                    {formatTime(slot)} also works
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <p
            id="booking-alternate-error"
            hidden={!errors?.alternateTime}
            className="mb-3 text-[12.5px] font-semibold text-[#b23b3b]"
          >
            {errors?.alternateTime}
          </p>

          <label className="flex cursor-pointer select-none items-start gap-[11px] text-[13.5px] leading-[1.5] text-muted">
            <input
              type="checkbox"
              name="flexibleTime"
              checked={flexible}
              onChange={(event) => onFlexible(event.target.checked)}
              className="mt-[2px] h-[18px] w-[18px] flex-none accent-[var(--slate)]"
            />
            <span>
              I&rsquo;m flexible — any of {educator.name.split(" ")[0]}&rsquo;s open times
              that week works for us.
            </span>
          </label>
        </div>
      ) : null}
    </div>
  );
}
