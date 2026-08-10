import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { ChevronDownIcon } from "./field-icons";

/**
 * Shared form-field styling, mirroring the source `.fField` (sand fill, 1.5px
 * line border, slate focus ring) and `.fField.invalid`.
 *
 * Lifted out of the educator application form when the booking flow became its
 * second consumer — two forms rendering visibly different inputs is the kind of
 * drift that is invisible in review and obvious on the page.
 *
 * Border color and background live in the two state strings rather than the base,
 * because `cn()` does not resolve conflicting Tailwind utilities — a base
 * `border-line` would fight the error color and win at random.
 */
export const FIELD =
  "w-full rounded-[11px] border-[1.5px] px-[15px] py-[13px] font-sans text-[15px] text-ink " +
  "transition-[border-color,background-color,box-shadow] duration-300 placeholder:text-[rgba(99,99,110,0.6)] " +
  "focus:border-slate focus:bg-white focus:shadow-[0_0_0_3px_rgba(46,58,115,0.12)] focus:outline-none";

export const FIELD_REST = "border-line bg-sand";

export const FIELD_ERROR = "border-[#b23b3b] bg-[#fdf3f2]";

/** Base + state + caller extras, in the order that keeps the states winning. */
export function fieldClasses(hasError: boolean, extra?: string): string {
  return cn(FIELD, extra, hasError ? FIELD_ERROR : FIELD_REST);
}

interface FieldRowProps {
  id: string;
  label: string;
  /**
   * The message to show, or undefined when valid. The server's own copy rather
   * than a fixed string toggled by a boolean, so a rule change on the API doesn't
   * leave stale wording here.
   */
  error?: string;
  /** Swaps the required marker for an "optional" hint. */
  optional?: boolean;
  /** Quiet guidance under the label, for fields that need a reason. */
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * One labelled row: label with a required marker, the control, and its inline
 * error. The error keeps a stable id so the control can point at it with
 * `aria-describedby`, and is rendered-but-hidden rather than conditional so
 * assistive tech sees a stable node it can announce into.
 */
export function FieldRow({
  id,
  label,
  error,
  optional,
  hint,
  children,
  className,
}: FieldRowProps) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-2 block text-[13px] font-bold tracking-[0.02em] text-ink"
      >
        {label}{" "}
        {optional ? (
          <span className="font-medium text-muted">(optional)</span>
        ) : (
          <span className="text-slate">*</span>
        )}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="mb-2 text-[12.5px] leading-[1.5] text-muted">
          {hint}
        </p>
      ) : null}
      {children}
      <p
        id={`${id}-error`}
        hidden={!error}
        className="mt-[7px] text-[12.5px] font-semibold text-[#b23b3b]"
      >
        {error}
      </p>
    </div>
  );
}

/** Chevron indicator for native selects, which render `appearance-none`. */
export function SelectChevron() {
  return (
    <span className="pointer-events-none absolute right-[15px] top-1/2 -translate-y-1/2 text-muted">
      <ChevronDownIcon className="h-4 w-4" />
    </span>
  );
}
