"use client";

import { useState } from "react";

import { SUBJECT_CHIPS } from "@/data/auth";
import { cn } from "@/lib/utils";

import styles from "./subject-chips.module.css";

interface SubjectChipsProps {
  /** Form field name. Emitted once per selected subject. */
  name?: string;
}

/**
 * Optional multi-select subject chips on the sign-up form.
 *
 * The chips are buttons, which `FormData` ignores, so each selection also renders
 * a hidden input. Without those the selection stayed a purely visual flourish —
 * it never left the browser.
 */
export function SubjectChips({ name = "subjectsOfInterest" }: SubjectChipsProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [popping, setPopping] = useState<string | null>(null);

  function toggle(subject: string) {
    setSelected((current) =>
      current.includes(subject)
        ? current.filter((item) => item !== subject)
        : [...current, subject],
    );
    setPopping(subject);
  }

  return (
    <div>
      <div className="mb-[10px] mt-1 text-[12.5px] font-bold text-ink">
        Which subjects are you exploring?{" "}
        <span className="font-medium text-muted">(optional)</span>
      </div>
      <div className="mb-2 flex flex-wrap gap-2">
        {SUBJECT_CHIPS.map((subject) => {
          const on = selected.includes(subject);
          return (
            <button
              key={subject}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(subject)}
              onAnimationEnd={() => setPopping((current) => (current === subject ? null : current))}
              className={cn(
                "rounded-[30px] border-[1.5px] px-[15px] py-2 text-[13px] font-semibold transition-[transform,background-color,color,border-color] duration-[250ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                on
                  ? "border-slate bg-slate text-white"
                  : "border-line bg-white text-ink hover:-translate-y-[2px] hover:border-[rgba(var(--slate-rgb),0.4)]",
                popping === subject && styles.pop,
              )}
            >
              {subject}
            </button>
          );
        })}
      </div>

      {selected.map((subject) => (
        <input key={subject} type="hidden" name={name} value={subject} />
      ))}

      <p className="mb-4 text-[12px] text-muted">
        {selected.length > 0
          ? `${selected.length} selected — you can change this anytime.`
          : "Pick any that interest your family — you can change this anytime."}
      </p>
    </div>
  );
}
