import { cn } from "@/lib/utils";

/**
 * The one star outline in this app, on the same 24-grid as the dashboard and auth
 * icon sets. `currentColor` for both fill and stroke, so an empty star and a full
 * one differ only by whether they're filled — the colour is the caller's business.
 */
const STAR_PATH =
  "M12 3.6l2.63 5.33 5.88.86-4.25 4.15 1 5.86L12 17.03l-5.26 2.77 1-5.86L3.49 9.79l5.88-.86z";

export const STAR_VALUES = [1, 2, 3, 4, 5] as const;

export function StarIcon({
  filled = false,
  className,
}: {
  filled?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinejoin="round"
      className={className}
    >
      <path d={STAR_PATH} />
    </svg>
  );
}

/**
 * A rating someone has already given, drawn rather than typed.
 *
 * The stars are decorative — the accessible text is the figure itself ("4 out of
 * 5"), because counting five `aria-hidden="false"` glyphs is not how anyone wants
 * to hear a rating read out. `label` prefixes it so a facet row announces as
 * "Communication: 4 out of 5" instead of five unattributed numbers.
 */
export function StarMeter({
  value,
  label,
  className,
  starClassName,
}: {
  value: number;
  /** What the rating is *of*, for the screen-reader text. */
  label?: string;
  className?: string;
  /** Replaces the default star size — `cn` can't merge two `h-*` utilities. */
  starClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-[2px] align-middle", className)}>
      <span className="sr-only">
        {label ? `${label}: ` : ""}
        {value} out of 5
      </span>
      {STAR_VALUES.map((star) => (
        <StarIcon
          key={star}
          filled={star <= value}
          className={cn(
            "shrink-0",
            starClassName ?? "h-[15px] w-[15px]",
            star <= value ? "text-gold" : "text-[rgba(22,24,29,0.25)]",
          )}
        />
      ))}
    </span>
  );
}
