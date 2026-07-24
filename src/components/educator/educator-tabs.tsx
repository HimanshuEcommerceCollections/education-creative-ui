"use client";

import { useId, useState } from "react";

import { cn } from "@/lib/utils";
import type { EducatorProfile } from "@/data/educators";

import { CheckIcon } from "./educator-icons";
import { Monogram } from "./monogram";
import { StarRating } from "./star-rating";
import styles from "./educator-tabs.module.css";

const TABS = [
  { id: "about", label: "About" },
  { id: "subjects", label: "Subjects" },
  { id: "reviews", label: "Reviews" },
] as const;

type TabId = (typeof TABS)[number]["id"];

/** About / Subjects / Reviews tab strip with an animated underline and panels. */
export function EducatorTabs({ profile }: { profile: EducatorProfile }) {
  const [active, setActive] = useState<TabId>("about");
  const baseId = useId();

  return (
    <div>
      <div role="tablist" aria-label="Educator details" className="flex gap-7 border-b border-line">
        {TABS.map((tab) => {
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              role="tab"
              type="button"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.id}`}
              onClick={() => setActive(tab.id)}
              className={cn(
                "relative -mb-px cursor-pointer border-0 bg-transparent pb-[14px] pt-1 text-[15px] font-semibold transition-colors",
                "after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:origin-left after:bg-slate after:transition-transform after:duration-300 after:content-['']",
                selected
                  ? "text-ink after:scale-x-100"
                  : "text-muted after:scale-x-0 hover:text-ink",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        key={active}
        role="tabpanel"
        id={`${baseId}-panel-${active}`}
        aria-labelledby={`${baseId}-tab-${active}`}
        className={cn("pt-8", styles.panel)}
      >
        {active === "about" && (
          <>
            <h2 className="mb-4 font-serif text-[clamp(22px,2.4vw,28px)] font-semibold tracking-[-0.01em]">
              About {profile.firstName}
            </h2>
            <div className="flex flex-col gap-4">
              {profile.about.map((paragraph, index) => (
                <p key={index} className="text-[15.5px] leading-[1.7] text-slate-deep">
                  {paragraph}
                </p>
              ))}
            </div>
          </>
        )}

        {active === "subjects" && (
          <>
            <h2 className="mb-5 font-serif text-[clamp(22px,2.4vw,28px)] font-semibold tracking-[-0.01em]">
              Subjects &amp; skills
            </h2>
            <ul className="grid grid-cols-2 gap-3 max-[520px]:grid-cols-1">
              {profile.subjects.map((subject) => (
                <li
                  key={subject}
                  className="flex items-center gap-3 rounded-[14px] border border-line bg-white px-4 py-[14px] text-[15px] font-medium text-ink"
                >
                  <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[rgba(46,58,115,0.1)] text-slate">
                    <CheckIcon className="h-[14px] w-[14px]" />
                  </span>
                  {subject}
                </li>
              ))}
            </ul>
          </>
        )}

        {active === "reviews" && (
          <>
            <h2 className="mb-5 font-serif text-[clamp(22px,2.4vw,28px)] font-semibold tracking-[-0.01em]">
              What parents say
            </h2>
            <div className="flex flex-col gap-4">
              {profile.reviews.map((review, index) => (
                <article
                  key={index}
                  className="rounded-[18px] border border-line bg-white p-6 shadow-[0_20px_44px_-36px_rgba(22,24,29,0.5)]"
                >
                  <header className="mb-3 flex items-center gap-3">
                    <Monogram
                      initials={review.initial}
                      size="text-[18px]"
                      className="h-11 w-11 flex-none rounded-full"
                    />
                    <div>
                      <b className="block text-[14.5px] font-semibold text-ink">{review.role}</b>
                      <StarRating value={review.rating} size={14} className="mt-1" />
                    </div>
                  </header>
                  <p className="text-[14.5px] leading-[1.65] text-slate-deep">{review.body}</p>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
