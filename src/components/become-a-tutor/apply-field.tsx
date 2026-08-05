import type { ReactNode } from "react";

/**
 * Shared field styling for the application form, mirroring the source `.fField`
 * (sand fill, 1.5px line border, slate focus ring) and `.fField.invalid`.
 *
 * Border color and background live in the two state strings rather than the
 * base, because `cn()` does not resolve conflicting Tailwind utilities — a base
 * `border-line` would fight the error color and win at random.
 */
export const APPLY_FIELD =
  "w-full rounded-[11px] border-[1.5px] px-[15px] py-[13px] font-sans text-[15px] text-ink " +
  "transition-[border-color,background-color,box-shadow] duration-300 placeholder:text-[rgba(99,99,110,0.6)] " +
  "focus:border-slate focus:bg-white focus:shadow-[0_0_0_3px_rgba(46,58,115,0.12)] focus:outline-none";

export const APPLY_FIELD_REST = "border-line bg-sand";

export const APPLY_FIELD_ERROR = "border-[#b23b3b] bg-[#fdf3f2]";

interface FieldRowProps {
  id: string;
  label: string;
  /**
   * The message to show, or undefined when valid. Now the server's own copy
   * rather than a fixed string toggled by a boolean, so a rule change on the API
   * doesn't leave stale wording here.
   */
  error?: string;
  children: ReactNode;
  className?: string;
}

/**
 * One labelled row of the application form: label with a required marker, the
 * control, and its inline error message. The error keeps a stable id so the
 * control can point at it with `aria-describedby`.
 */
export function FieldRow({ id, label, error, children, className }: FieldRowProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-[13px] font-bold tracking-[0.02em] text-ink">
        {label} <span className="text-slate">*</span>
      </label>
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
