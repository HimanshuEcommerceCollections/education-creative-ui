import { cn } from "@/lib/utils";

import styles from "./marquee.module.css";

interface MarqueeProps {
  items: readonly string[];
}

/**
 * Edge-to-edge scrolling ticker. Items are rendered twice so the -50%
 * translate loops seamlessly; the animation pauses under reduced motion.
 * Spacing around the marquee is left to the caller.
 */
export function Marquee({ items }: MarqueeProps) {
  const loop = [...items, ...items];

  return (
    <div className="relative overflow-hidden border-y border-line bg-sand py-4">
      <div
        className={cn(
          styles.track,
          "inline-flex whitespace-nowrap will-change-transform",
        )}
      >
        {loop.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="inline-flex items-center font-serif text-[20px] font-semibold tracking-[0.02em] text-ink after:mx-[30px] after:text-[15px] after:text-gold after:content-['✱']"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
