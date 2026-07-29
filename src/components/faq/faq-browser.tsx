"use client";

import { useState } from "react";

import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";
import {
  FAQ_BROWSER,
  FAQ_CATEGORY_LABELS,
  FAQ_FILTERS,
  FAQ_ITEMS,
  type FaqCategory,
  type FaqItem,
} from "@/data/faq";
import { cn } from "@/lib/utils";

import { CloseIcon, SearchIcon } from "./faq-icons";
import { FaqQuestion } from "./faq-question";

/**
 * Lower-cased haystack per question — the visible question, its answer copy,
 * and its category label. Built once, since the questions are static.
 */
const SEARCH_INDEX = new Map<string, string>(
  FAQ_ITEMS.map((item) => [
    item.id,
    [
      item.question,
      FAQ_CATEGORY_LABELS[item.category],
      ...item.answer.map((segment) =>
        typeof segment === "string" ? segment : segment.text,
      ),
    ]
      .join(" ")
      .toLowerCase(),
  ]),
);

function matchesQuery(item: FaqItem, needle: string): boolean {
  if (!needle) return true;
  return (SEARCH_INDEX.get(item.id) ?? "").includes(needle);
}

function isVisible(
  item: FaqItem,
  needle: string,
  category: FaqCategory | null,
): boolean {
  return (category === null || item.category === category) && matchesQuery(item, needle);
}

/**
 * The searchable, filterable question list: a sticky search + pill row above an
 * accordion. Rows stay mounted and are hidden rather than unmounted, so their
 * reveal doesn't replay on every keystroke; any answer a filter change hides is
 * collapsed so it doesn't reappear already open.
 */
export function FaqBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<FaqCategory | null>(null);
  const [openIds, setOpenIds] = useState<ReadonlySet<string>>(new Set());

  const needle = query.trim().toLowerCase();
  const shownCount = FAQ_ITEMS.filter((item) =>
    isVisible(item, needle, category),
  ).length;

  /** Applies new filter criteria, collapsing answers they hide. */
  const filter = (nextQuery: string, nextCategory: FaqCategory | null) => {
    setQuery(nextQuery);
    setCategory(nextCategory);
    setOpenIds((open) => {
      const kept = FAQ_ITEMS.filter(
        (item) =>
          open.has(item.id) &&
          isVisible(item, nextQuery.trim().toLowerCase(), nextCategory),
      );
      return new Set(kept.map((item) => item.id));
    });
  };

  const toggle = (id: string) => {
    setOpenIds((open) => {
      const next = new Set(open);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-[840px]">
      <Reveal className="sticky top-[78px] z-20 mb-[14px] border-b border-line bg-ivory pb-[18px] pt-[22px]">
        <div className="relative mb-4">
          <SearchIcon className="pointer-events-none absolute left-[18px] top-1/2 h-[19px] w-[19px] -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(event) => filter(event.target.value, category)}
            placeholder={FAQ_BROWSER.searchPlaceholder}
            aria-label={FAQ_BROWSER.searchLabel}
            autoComplete="off"
            className="w-full rounded-[40px] border border-line bg-white py-[15px] pl-12 pr-[46px] font-sans text-[15.5px] text-ink outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-muted focus:border-slate focus:shadow-[0_0_0_4px_rgba(var(--slate-rgb),0.1)]"
          />
          {query ? (
            <button
              type="button"
              onClick={() => filter("", category)}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 flex h-[30px] w-[30px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-muted transition-colors duration-[250ms] hover:bg-sand hover:text-ink"
            >
              <CloseIcon className="h-[15px] w-[15px]" />
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-[9px]" role="group" aria-label="Filter questions by category">
          {FAQ_FILTERS.map((pill) => {
            const active = pill.category === category;
            const count = FAQ_ITEMS.filter((item) =>
              isVisible(item, needle, pill.category),
            ).length;

            return (
              <button
                key={pill.label}
                type="button"
                aria-pressed={active}
                onClick={() => filter(query, pill.category)}
                className={cn(
                  "cursor-pointer rounded-[30px] border px-[18px] py-[9px] font-sans text-[13.5px] font-semibold tracking-[0.01em] transition-[background-color,color,border-color,transform] duration-300",
                  active
                    ? "border-slate bg-slate text-white"
                    : "border-[rgba(var(--slate-rgb),0.28)] bg-transparent text-slate hover:-translate-y-px hover:bg-[var(--chip-a)]",
                )}
              >
                {pill.label}
                <span className="ml-[5px] text-[12px] font-medium opacity-60">
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </Reveal>

      <div className="mt-2">
        {FAQ_ITEMS.map((item) => (
          <Reveal
            key={item.id}
            className={cn(!isVisible(item, needle, category) && "hidden")}
          >
            <FaqQuestion
              item={item}
              open={openIds.has(item.id)}
              onToggle={() => toggle(item.id)}
            />
          </Reveal>
        ))}
      </div>

      {shownCount === 0 ? (
        <div role="status" className="px-5 py-16 text-center text-muted">
          <span className="mx-auto mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-sand text-slate">
            <SearchIcon className="h-6 w-6" />
          </span>
          <h3 className="mb-2 font-serif text-[20px] font-semibold text-ink">
            {FAQ_BROWSER.empty.title}
          </h3>
          <p className="mx-auto max-w-[38ch] text-[15px] leading-[1.6]">
            {FAQ_BROWSER.empty.body}
          </p>
          <Button
            variant="outline"
            className="mt-5"
            onClick={() => filter("", null)}
          >
            {FAQ_BROWSER.empty.action}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
