"use client";

import { useId, useState } from "react";

import { STAR_VALUES, StarIcon } from "@/components/ui/stars";
import { cn } from "@/lib/utils";

/** What each star means, so the choice reads as a judgement rather than a number. */
const RATING_WORDS: Record<number, string> = {
  1: "Poor",
  2: "Below par",
  3: "Fine",
  4: "Good",
  5: "Excellent",
};

interface StarRatingInputProps {
  /** Form field name — matches the contract key the action validates. */
  name: string;
  legend: string;
  /** Optional facets may be left unanswered, and get a control that says so. */
  optional?: boolean;
  /** Quiet guidance under the legend. */
  hint?: string;
  /** The server's own message for this field, or undefined when valid. */
  error?: string;
  size?: "large" | "small";
}

/**
 * A five-star rating input built out of five real radio buttons.
 *
 * This is a single-choice control, so it is a radio group and nothing else: the
 * radios are the actual inputs (visually hidden, never `display:none`, so they
 * stay focusable), each labelled "3 stars" for a screen reader, and the drawn
 * stars are `aria-hidden` decoration painted by the label. That buys the whole of
 * the platform's own keyboard behaviour for free — Tab moves to the group,
 * arrow keys move *and* select within it, and the value posts with the form with
 * no JavaScript involved in the submission at all. Click handlers on spans would
 * have none of that.
 *
 * The one thing radios can't do is go back to *unset*, which an optional facet
 * needs — so a real "Clear" button appears beside the group once something is
 * chosen, rather than a sixth phantom star.
 */
export function StarRatingInput({
  name,
  legend,
  optional = false,
  hint,
  error,
  size = "small",
}: StarRatingInputProps) {
  const [value, setValue] = useState(0);
  const fieldId = useId();
  const errorId = `${fieldId}-error`;
  const hintId = `${fieldId}-hint`;

  const describedBy = [hint ? hintId : null, error ? errorId : null]
    .filter(Boolean)
    .join(" ");

  const starSize = size === "large" ? "h-9 w-9" : "h-[26px] w-[26px]";

  return (
    <fieldset
      className={cn(
        "rounded-[14px] border-[1.5px] px-4 py-[14px]",
        error ? "border-[#b23b3b] bg-[#fdf3f2]" : "border-line bg-sand",
      )}
      aria-describedby={describedBy || undefined}
    >
      <legend className="px-[6px] text-[13px] font-bold tracking-[0.02em] text-ink">
        {legend}{" "}
        {optional ? (
          <span className="font-medium text-muted">(optional)</span>
        ) : (
          <span className="text-slate">*</span>
        )}
      </legend>

      {hint ? (
        <p id={hintId} className="mb-2 text-[12.5px] leading-[1.5] text-muted">
          {hint}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <div className="flex items-center gap-[2px]">
          {STAR_VALUES.map((star) => (
            <label
              key={star}
              className="relative cursor-pointer rounded-[8px] p-[3px] text-gold"
            >
              <input
                type="radio"
                name={name}
                value={star}
                checked={value === star}
                onChange={() => setValue(star)}
                className="peer sr-only"
              />
              <span className="sr-only">
                {star === 1 ? "1 star" : `${star} stars`}
              </span>
              <StarIcon
                filled={star <= value}
                className={cn(
                  starSize,
                  "transition-colors duration-200",
                  star <= value ? "text-gold" : "text-[rgba(22,24,29,0.3)]",
                )}
              />
              {/*
                The radio itself is clipped to a pixel, so the browser's focus
                ring lands somewhere invisible. This paints the ring on the star
                the keyboard is actually sitting on.
              */}
              <span className="pointer-events-none absolute inset-0 rounded-[8px] peer-focus-visible:shadow-[0_0_0_3px_var(--color-slate)]" />
            </label>
          ))}
        </div>

        <p aria-hidden="true" className="text-[13px] font-semibold text-muted">
          {value > 0 ? RATING_WORDS[value] : optional ? "Not rated" : "Pick a rating"}
        </p>

        {optional && value > 0 ? (
          <button
            type="button"
            onClick={() => setValue(0)}
            className="text-[12.5px] font-semibold text-slate transition-colors hover:text-gold"
          >
            Clear
            <span className="sr-only"> the {legend.toLowerCase()} rating</span>
          </button>
        ) : null}
      </div>

      {/*
        Rendered-but-hidden rather than conditional, so assistive tech has a stable
        node to announce into — the same shape `FieldRow` uses.
      */}
      <p
        id={errorId}
        hidden={!error}
        className="mt-2 text-[12.5px] font-semibold text-[#b23b3b]"
      >
        {error}
      </p>
    </fieldset>
  );
}
