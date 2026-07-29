"use client";

import Link from "next/link";

import { FAQ_CATEGORY_LABELS, type FaqItem, type FaqSegment } from "@/data/faq";
import { cn } from "@/lib/utils";

/** Renders one answer run: prose, an inline link, or a bolded term. */
function AnswerSegment({ segment }: { segment: FaqSegment }) {
  if (typeof segment === "string") return <>{segment}</>;

  if (segment.kind === "strong") return <b className="font-semibold">{segment.text}</b>;

  return (
    <Link
      href={segment.href}
      className="border-b border-[rgba(var(--slate-rgb),0.3)] font-semibold text-slate no-underline transition-colors hover:border-slate"
    >
      {segment.text}
    </Link>
  );
}

/**
 * The plus glyph that rotates into a cross when the answer opens: two bars
 * rather than the source's pseudo-elements, so it stays in Tailwind.
 */
function ToggleGlyph({ open }: { open: boolean }) {
  const bar = cn(
    "absolute rounded-sm transition-[background-color,transform] duration-[400ms] ease-brand motion-reduce:transition-none",
    open ? "bg-gold" : "bg-slate",
  );

  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative mt-1 h-[26px] w-[26px] flex-none transition-transform duration-[400ms] ease-brand motion-reduce:transition-none",
        open && "rotate-[135deg]",
      )}
    >
      <span className={cn(bar, "left-1/2 top-1 h-[18px] w-0.5 -translate-x-1/2")} />
      <span className={cn(bar, "left-1 top-1/2 h-0.5 w-[18px] -translate-y-1/2")} />
    </span>
  );
}

interface FaqQuestionProps {
  item: FaqItem;
  open: boolean;
  onToggle: () => void;
}

/**
 * One accordion row: category chip, question, and a panel that grows from
 * `0fr` to `1fr` so long answers are never clipped by a fixed max-height.
 */
export function FaqQuestion({ item, open, onToggle }: FaqQuestionProps) {
  const buttonId = `faq-q-${item.id}`;
  const panelId = `faq-a-${item.id}`;

  return (
    <div className="border-b border-line">
      <button
        type="button"
        id={buttonId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className="group flex w-full cursor-pointer items-start gap-5 border-none bg-transparent pb-[26px] pr-1 pt-[26px] text-left font-serif text-ink transition-colors duration-300 hover:text-slate max-[640px]:flex-wrap max-[640px]:gap-[14px]"
      >
        <span className="mt-[3px] flex-none rounded-[20px] bg-[var(--chip-a)] px-[11px] py-[5px] font-sans text-[10.5px] font-bold uppercase tracking-[0.12em] text-slate max-[640px]:order-2">
          {FAQ_CATEGORY_LABELS[item.category]}
        </span>
        <span className="flex-1 text-[clamp(17px,2vw,20px)] font-semibold leading-[1.3] tracking-[-0.01em]">
          {item.question}
        </span>
        <ToggleGlyph open={open} />
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-[450ms] ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          className="overflow-hidden"
        >
          <p className="pb-7 pl-[92px] pr-[46px] text-[15.5px] leading-[1.66] text-muted max-[640px]:px-1">
            {item.answer.map((segment, index) => (
              <AnswerSegment key={index} segment={segment} />
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}
