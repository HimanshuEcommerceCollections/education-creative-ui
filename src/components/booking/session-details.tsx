"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import {
  BOOKING_FORMATS,
  type BookingFormat,
  type SessionDuration,
} from "@contracts/bookings.ts";

import {
  FORMAT_BLURBS,
  FORMAT_LABELS,
  SESSION_LENGTH_OPTIONS,
  type BookingEducator,
  type BookingTopic,
} from "@/data/booking";
import { cn } from "@/lib/utils";

import { HomeIcon, ScreenIcon } from "./booking-icons";

const FORMAT_ICONS: Record<BookingFormat, (props: { className?: string }) => ReactNode> = {
  in_home: HomeIcon,
  online: ScreenIcon,
};

/** A pill radio — subjects and session lengths. */
function ChoiceChip({
  name,
  value,
  label,
  checked,
  onSelect,
}: {
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onSelect: () => void;
}) {
  return (
    <label className="relative cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onSelect}
        className="peer sr-only"
      />
      <span
        className={cn(
          "block rounded-[30px] border-[1.5px] px-5 py-[11px] text-[14px] font-semibold transition-[border-color,background-color,color] duration-[250ms]",
          "hover:border-[rgba(46,58,115,0.4)]",
          "peer-checked:border-slate peer-checked:bg-slate peer-checked:text-white",
          "peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-slate",
          checked ? "border-slate bg-slate text-white" : "border-line",
        )}
      >
        {label}
      </span>
    </label>
  );
}

interface SessionDetailsProps {
  educator: BookingEducator;
  /** The chosen topic, or null. Carries its priced category with it. */
  subject: BookingTopic | null;
  format: BookingFormat;
  duration: SessionDuration;
  /**
   * Validation messages for this step's three fields. All three have to be rendered,
   * not just the subject one: the flow collects them from the shared contract, and a
   * rejected format or length with nowhere to appear produces "please check the
   * highlighted fields" with nothing highlighted.
   */
  errors?: {
    subject?: string;
    format?: string;
    duration?: string;
  };
  onSubject: (subject: BookingTopic) => void;
  onFormat: (format: BookingFormat) => void;
  onDuration: (duration: SessionDuration) => void;
}

/**
 * Step 2 — what the session is, how it's delivered, and how long.
 *
 * Subject is a real field rather than an assumption: the booking carries a
 * `subject_id`, rates are per (educator, subject), and several educators teach
 * across two areas — Rosa does cooking *and* music. A flat per-educator rate with
 * no subject can't express any of that.
 */
export function SessionDetails({
  educator,
  subject,
  format,
  duration,
  errors,
  onSubject,
  onFormat,
  onDuration,
}: SessionDetailsProps) {
  return (
    <div className="grid gap-7">
      <fieldset>
        <legend className="mb-3 block text-[13px] font-bold tracking-[0.02em] text-ink">
          What would you like {educator.name.split(" ")[0]} to cover?{" "}
          <span className="text-slate">*</span>
        </legend>

        {educator.subjects.length > 0 ? (
          <div className="flex flex-wrap gap-[10px]">
            {educator.subjects.map((option) => (
              <ChoiceChip
                key={option.label}
                name="subjectTopic"
                value={option.label}
                label={option.label}
                checked={subject?.label === option.label}
                onSelect={() => onSubject(option)}
              />
            ))}
          </div>
        ) : (
          /* Reachable when the pricing snapshot has no priced category for anything
           * this educator teaches. Saying so beats offering a chip the API refuses. */
          <p className="text-[14px] leading-[1.55] text-muted">
            We can&rsquo;t price any of {educator.name.split(" ")[0]}&rsquo;s subjects at
            the moment, so this booking can&rsquo;t be taken online. Choose another
            educator above, or{" "}
            <Link href="/contact" className="font-semibold text-slate underline">
              contact us
            </Link>{" "}
            and a coordinator will arrange it.
          </p>
        )}

        <p
          id="booking-subject-error"
          hidden={!errors?.subject}
          className="mt-[9px] text-[12.5px] font-semibold text-[#b23b3b]"
        >
          {errors?.subject}
        </p>
      </fieldset>

      <fieldset>
        <legend className="mb-3 block text-[13px] font-bold tracking-[0.02em] text-ink">
          Where should it happen? <span className="text-slate">*</span>
        </legend>

        <div className="grid grid-cols-2 gap-3 max-[560px]:grid-cols-1">
          {BOOKING_FORMATS.map((option) => {
            const Icon = FORMAT_ICONS[option];
            const offered = educator.formats.includes(option);
            const checked = format === option;

            return (
              <label
                key={option}
                className={cn(
                  "relative block",
                  offered ? "cursor-pointer" : "cursor-not-allowed opacity-50",
                )}
              >
                <input
                  type="radio"
                  name="format"
                  value={option}
                  checked={checked}
                  disabled={!offered}
                  onChange={() => onFormat(option)}
                  className="peer sr-only"
                />
                <span
                  className={cn(
                    "flex items-center gap-[13px] rounded-[14px] border-[1.5px] px-[18px] py-4 transition-[border-color,box-shadow] duration-300",
                    offered && "hover:border-[rgba(46,58,115,0.35)]",
                    "peer-checked:border-slate peer-checked:shadow-[0_0_0_3px_rgba(46,58,115,0.14)]",
                    "peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-slate",
                    checked ? "border-slate" : "border-line",
                  )}
                >
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-[11px] bg-[var(--chip-a)] text-slate">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="block">
                    <b className="block font-serif text-[15px] font-semibold">
                      {FORMAT_LABELS[option]}
                    </b>
                    <span className="block text-[12.5px] text-muted">
                      {offered
                        ? FORMAT_BLURBS[option]
                        : `${educator.name.split(" ")[0]} doesn't offer this`}
                    </span>
                  </span>
                </span>
              </label>
            );
          })}
        </div>

        <p
          id="booking-format-error"
          hidden={!errors?.format}
          className="mt-[9px] text-[12.5px] font-semibold text-[#b23b3b]"
        >
          {errors?.format}
        </p>
      </fieldset>

      <fieldset>
        <legend className="mb-3 block text-[13px] font-bold tracking-[0.02em] text-ink">
          How long? <span className="text-slate">*</span>
        </legend>

        <div className="flex flex-wrap gap-[10px]">
          {SESSION_LENGTH_OPTIONS.map((option) => (
            <ChoiceChip
              key={option.minutes}
              name="durationMinutes"
              value={String(option.minutes)}
              label={option.label}
              checked={duration === option.minutes}
              onSelect={() => onDuration(option.minutes as SessionDuration)}
            />
          ))}
        </div>

        <p
          id="booking-duration-error"
          hidden={!errors?.duration}
          className="mt-[9px] text-[12.5px] font-semibold text-[#b23b3b]"
        >
          {errors?.duration}
        </p>
      </fieldset>
    </div>
  );
}
