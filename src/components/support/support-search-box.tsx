"use client";

import type { FormEvent } from "react";

import { SUPPORT_HERO } from "@/data/support";

import { SearchIcon } from "./support-icons";
import { useSupportSearch } from "./support-search-context";

/**
 * The hero's search pill. Filtering happens as you type, so submitting is a
 * no-op — it only exists so Enter and the button behave as expected.
 */
export function SupportSearchBox() {
  const { query, setQuery } = useSupportSearch();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="flex items-center gap-3 rounded-[44px] border-[1.5px] border-line bg-white py-2 pl-[22px] pr-2 shadow-[0_22px_50px_-30px_rgba(var(--slate-rgb),0.5)] transition-[border-color,box-shadow] duration-300 focus-within:border-slate focus-within:shadow-[0_22px_55px_-26px_rgba(var(--slate-rgb),0.6)]"
    >
      <SearchIcon className="h-[22px] w-[22px] flex-none text-slate" />
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={SUPPORT_HERO.searchPlaceholder}
        aria-label="Search help topics"
        autoComplete="off"
        className="min-w-0 flex-1 border-none bg-transparent py-3 font-sans text-[16px] text-ink outline-none placeholder:text-muted"
      />
      <button
        type="submit"
        className="flex-none cursor-pointer rounded-[36px] bg-slate px-6 py-[13px] font-sans text-[14px] font-bold text-white transition-colors duration-300 hover:bg-slate-deep"
      >
        Search
      </button>
    </form>
  );
}
