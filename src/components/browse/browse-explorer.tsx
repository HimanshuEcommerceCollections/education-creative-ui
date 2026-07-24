"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState, type MouseEvent } from "react";

import { Container } from "@/components/common/container";
import { Eyebrow } from "@/components/common/eyebrow";
import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { useInView } from "@/hooks/use-in-view";
import { revealClassName, type RevealDelay } from "@/lib/reveal";
import {
  BROWSE_FILTERS,
  EDUCATORS,
  PROFILE_HREF,
  type BrowseSort,
  type Educator,
} from "@/data/browse";
import { cn } from "@/lib/utils";

import { ArrowRightIcon, SearchIcon, StarIcon } from "./browse-icons";
import styles from "./browse-explorer.module.css";

/** A single educator card — entrance reveal, hover-lift, and cursor tilt. */
function EducatorCard({ educator, delay }: { educator: Educator; delay: RevealDelay }) {
  const { ref, inView } = useInView<HTMLElement>({ rootMargin: "0px 0px -8% 0px" });
  const innerRef = useRef<HTMLDivElement>(null);

  const tilt = (e: MouseEvent<HTMLDivElement>) => {
    const inner = innerRef.current;
    if (!inner || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    inner.style.transform = `rotateY(${(px * 8).toFixed(2)}deg) rotateX(${(-py * 8).toFixed(2)}deg)`;
  };
  const resetTilt = () => {
    if (innerRef.current) innerRef.current.style.transform = "";
  };

  return (
    <article ref={ref} className={revealClassName(inView, delay)}>
      <div
        onMouseMove={tilt}
        onMouseLeave={resetTilt}
        className={cn(styles.card, "group relative cursor-pointer")}
      >
        <div
          ref={innerRef}
          className={cn(
            styles.inner,
            "relative overflow-hidden rounded-[20px] bg-slate-deep shadow-[0_26px_58px_-28px_rgba(24,24,24,0.34),0_8px_18px_-12px_rgba(24,24,24,0.22)] group-hover:shadow-[0_46px_88px_-30px_rgba(24,24,24,0.42),0_12px_26px_-14px_rgba(24,24,24,0.28)]",
          )}
        >
          <div className="relative h-[390px] overflow-hidden">
            <Image
              src={educator.image.src}
              alt={educator.image.alt}
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 980px) 50vw, 33vw"
              className="object-cover object-[50%_12%] transition-transform duration-[600ms] ease-brand group-hover:scale-[1.06]"
            />
          </div>

          <div className="absolute inset-x-0 bottom-0 z-[2] bg-[linear-gradient(180deg,rgba(14,14,16,0)_0%,rgba(14,14,16,0.5)_42%,rgba(12,12,14,0.94)_100%)] p-[22px]">
            <div>
              <h3 className="font-serif text-[21px] font-semibold tracking-[-0.01em] text-white">
                {educator.name}
              </h3>
              <div className="mt-[3px] text-[13px] font-semibold tracking-[0.02em] text-gold">
                {educator.subject}
              </div>
            </div>

            <div className={styles.reveal}>
              <div className="mb-2 flex items-center gap-4">
                <span className="inline-flex items-center gap-[5px] text-[14px] font-bold text-white">
                  <StarIcon className="h-[15px] w-[15px] text-gold" />
                  {educator.rating.toFixed(1)}
                </span>
                <span className="font-serif text-[16px] font-bold text-white">
                  ${educator.price}
                  <i className="text-[12px] font-medium not-italic text-[rgba(244,241,234,0.6)]">/hr</i>
                </span>
              </div>
              <p className="mb-3 text-[13px] leading-[1.55] text-[rgba(244,241,234,0.82)]">
                {educator.description}
              </p>
              <Link
                href={PROFILE_HREF}
                className="group/link inline-flex items-center gap-[7px] text-[13px] font-bold text-gold"
              >
                View profile
                <ArrowRightIcon className="h-[14px] w-[14px] transition-transform duration-300 group-hover/link:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * The interactive browse experience: a dark hero with a live search field above
 * a filterable, sortable educator grid. Search + subject filter + sort are all
 * derived in one memo; the hero and grid share this component's state.
 */
export function BrowseExplorer() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState<BrowseSort>("rating");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = EDUCATORS.filter((educator) => {
      const subject = educator.subject.toLowerCase();
      const okFilter = filter === "all" || subject.includes(filter);
      const okQuery = !q || educator.name.toLowerCase().includes(q) || subject.includes(q);
      return okFilter && okQuery;
    });
    return filtered.sort((a, b) => {
      if (sort === "priceLow") return a.price - b.price;
      if (sort === "priceHigh") return b.price - a.price;
      return b.rating - a.rating;
    });
  }, [query, filter, sort]);

  return (
    <>
      <section className="relative overflow-hidden bg-ink-deep pb-24 pt-[150px]">
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 before:absolute before:inset-0 before:z-[1] before:bg-[linear-gradient(100deg,rgba(10,10,12,0.9)_0%,rgba(11,11,13,0.74)_40%,rgba(14,14,16,0.34)_72%,rgba(14,14,16,0.08)_100%)] before:content-[''] after:absolute after:inset-0 after:z-[2] after:bg-[radial-gradient(70%_80%_at_74%_20%,rgba(210,162,65,0.1),rgba(14,14,16,0)_58%),linear-gradient(0deg,rgba(14,14,16,0.5)_0%,rgba(14,14,16,0)_34%)] after:content-['']"
        >
          <Image
            src="/assets/browse/images/hero-bg.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-[0.72]"
          />
        </div>

        <Container className="relative z-[3] max-w-[880px]">
          <Reveal>
            <Eyebrow tone="gold">Find Your Educator</Eyebrow>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="mt-[6px] font-serif text-[clamp(38px,6vw,72px)] font-semibold leading-[1.02] tracking-[-0.025em] text-white [text-shadow:0_2px_22px_rgba(0,0,0,0.5)]">
              Browse vetted educators
              <br />
              across <Highlight tone="gold">six subjects.</Highlight>
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-5 max-w-[560px] text-[17px] leading-[1.6] text-[rgba(244,241,234,0.9)] [text-shadow:0_1px_12px_rgba(0,0,0,0.6)]">
              Explore independent tutors, coaches, and mentors across academics, admissions, music,
              languages, arts, and cooking. Filter by subject, sort by rating or price, and find a
              fit for your family.
            </p>
          </Reveal>
          <Reveal delay={3}>
            <div className="relative mt-[34px] max-w-[520px]">
              <SearchIcon className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/55" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or subject…"
                aria-label="Search educators by name or subject"
                autoComplete="off"
                className="w-full rounded-[40px] border border-white/[0.22] bg-white/[0.08] py-[17px] pl-[52px] pr-[22px] text-[15.5px] text-white transition-[border-color,background-color] placeholder:text-white/50 focus:border-gold focus:bg-white/[0.12] focus:outline-none"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-ivory pb-[13vh] pt-[7vh]">
        <Container>
          <Reveal>
            <div className="mb-[34px] flex flex-wrap items-end justify-between gap-6">
              <div className="flex flex-wrap gap-[10px]" role="group" aria-label="Filter by subject">
                {BROWSE_FILTERS.map((option) => {
                  const active = filter === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFilter(option.value)}
                      aria-pressed={active}
                      className={cn(
                        "cursor-pointer rounded-[30px] border px-[17px] py-[9px] text-[13.5px] font-semibold transition-[background-color,color,border-color,box-shadow]",
                        active
                          ? "border-slate bg-slate text-white shadow-[0_10px_24px_-12px_rgba(46,58,115,0.5)]"
                          : "border-[rgba(46,58,115,0.18)] bg-[var(--chip-a)] text-slate hover:bg-[var(--chip-b)]",
                      )}
                    >
                      {active ? (
                        <span
                          aria-hidden="true"
                          className="mr-2 inline-block h-[7px] w-[7px] rounded-full bg-gold align-middle"
                        />
                      ) : null}
                      {option.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3">
                <label
                  htmlFor="eduSort"
                  className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted"
                >
                  Sort
                </label>
                <select
                  id="eduSort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as BrowseSort)}
                  aria-label="Sort educators"
                  className="cursor-pointer rounded-[30px] border border-line bg-white px-4 py-[10px] text-[14px] font-semibold text-ink focus:border-slate focus:outline-none"
                >
                  <option value="rating">By Rating</option>
                  <option value="priceLow">Price (low to high)</option>
                  <option value="priceHigh">Price (high to low)</option>
                </select>
              </div>
            </div>
          </Reveal>

          <p className="mb-7 text-[13.5px] font-semibold text-muted" aria-live="polite">
            Showing <b className="text-slate">{results.length}</b> of {EDUCATORS.length} educators
          </p>

          {results.length > 0 ? (
            <div className="grid grid-cols-3 gap-[26px] max-[980px]:grid-cols-2 max-[600px]:grid-cols-1">
              {results.map((educator, i) => (
                <EducatorCard
                  key={educator.name}
                  educator={educator}
                  delay={((i % 3) + 1) as RevealDelay}
                />
              ))}
            </div>
          ) : (
            <p className="py-16 text-center text-[15px] text-muted">
              No educators match your search yet. Try a different subject or clear your search.
            </p>
          )}
        </Container>
      </section>
    </>
  );
}
