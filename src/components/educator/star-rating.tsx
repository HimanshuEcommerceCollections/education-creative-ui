import { cn } from "@/lib/utils";

interface StarRatingProps {
  /** Rating out of 5; filled stars = rounded value. */
  value: number;
  /** Star size in px. */
  size?: number;
  className?: string;
}

const STAR_PATH =
  "M12 2l2.9 6.1 6.7.9-4.9 4.6 1.2 6.6L12 18.6 6.1 20.8l1.2-6.6L2.4 9.6l6.7-.9z";

/**
 * A row of five stars, filled to the nearest whole rating.
 *
 * Only rendered where a real rating exists — there is no "empty" state here on
 * purpose. Five hollow stars for an educator nobody has reviewed reads as a score
 * of zero, so the callers omit this component entirely rather than pass it a 0.
 */
export function StarRating({ value, size = 16, className }: StarRatingProps) {
  const filled = Math.round(value);

  return (
    <span
      role="img"
      aria-label={`${value} out of 5`}
      className={cn("inline-flex gap-[3px]", className)}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <svg
          key={index}
          viewBox="0 0 24 24"
          width={size}
          height={size}
          aria-hidden="true"
          className={index < filled ? "fill-gold" : "fill-[rgba(22,24,29,0.16)]"}
        >
          <path d={STAR_PATH} />
        </svg>
      ))}
    </span>
  );
}
