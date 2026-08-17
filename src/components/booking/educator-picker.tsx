"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { BROWSE_FILTERS } from "@/data/browse";
import type { BookingEducator } from "@/data/booking";
import { liveRatePerHour, type LivePricing } from "@/lib/booking/pricing";
import type { EducatorRating } from "@/lib/educators/rating";
import { cn } from "@/lib/utils";

import { CheckIcon, StarIcon } from "./booking-icons";

interface EducatorPickerProps {
  /**
   * Who can actually be booked, resolved by the page against the pricing
   * snapshot. Passed in rather than read from `data/booking` here, because a card
   * for an educator the API has never heard of is a 404 at the final submit.
   */
  educators: readonly BookingEducator[];
  selected: BookingEducator;
  onSelect: (educator: BookingEducator) => void;
  /**
   * Live hourly rates from the pricing snapshot, keyed by educator slug and then
   * priced subject slug. A card falls back to its in-repo figure when the map has
   * nothing unambiguous for it, so the picker still prices with the API down.
   */
  rates?: LivePricing["rates"];
  /**
   * Published ratings by educator slug, from the API's public directory. Sparse
   * on purpose: a card whose slug is absent shows no stars at all, so an educator
   * nobody has reviewed yet is never made to look worse than one who was rated
   * badly.
   */
  ratings?: Record<string, EducatorRating>;
  /**
   * The priced category currently chosen, so each card shows *that* subject's
   * rate. A multi-subject educator has more than one, and showing the wrong one is
   * how a parent watches a music price and is charged a cooking one.
   */
  subjectSlug: string | null;
  /** Validation message for `educatorSlug`, if the contract ever rejects it. */
  error?: string;
  /**
   * The slug asked for by `?educator=` that isn't bookable, or null.
   *
   * Said plainly rather than silently swapping in someone else, which is how a
   * parent who followed "Book with Marcus" pays for a session with Elena. The slug
   * itself isn't echoed — it comes from the query string, and the parent knows
   * whose page they came from.
   */
  unavailableSlug?: string | null;
}

/**
 * Step 1 — which educator the parent would *like*.
 *
 * Framed as a request throughout, because under the locked flow it is one: the
 * parent pays, a coordinator confirms and assigns, and the coordinator may need
 * to assign someone else. Calling this "your educator" here and then substituting
 * later is how you earn a refund request, so the copy commits to no more than the
 * system can keep.
 *
 * The subject filter is here rather than only on `/browse` because a parent who
 * arrived wanting music shouldn't have to read nine cards to find two.
 */
export function EducatorPicker({
  educators,
  selected,
  onSelect,
  rates,
  ratings = {},
  subjectSlug,
  error,
  unavailableSlug,
}: EducatorPickerProps) {
  const [filter, setFilter] = useState("all");

  const shown = useMemo(() => {
    if (filter === "all") return educators;
    return educators.filter((educator) =>
      educator.subject.toLowerCase().includes(filter),
    );
  }, [educators, filter]);

  return (
    <div>
      {unavailableSlug ? (
        <p
          role="status"
          className="mb-5 rounded-[11px] border-[1.5px] border-[rgba(210,162,65,0.45)] bg-[rgba(210,162,65,0.09)] px-4 py-3 text-[13px] leading-[1.55] text-ink"
        >
          <b className="font-semibold">The educator you asked for can&rsquo;t be booked
          here at the moment</b>, so we haven&rsquo;t pre-selected them — everyone below is
          available instead. If it has to be them,{" "}
          <Link href="/contact" className="font-semibold text-slate underline">
            ask us
          </Link>{" "}
          and a coordinator will arrange it directly.
        </p>
      ) : null}

      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filter by subject">
        {BROWSE_FILTERS.map((option) => {
          const active = filter === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilter(option.value)}
              aria-pressed={active}
              className={cn(
                "cursor-pointer rounded-[30px] border px-[15px] py-[7px] text-[12.5px] font-semibold transition-[background-color,color,border-color]",
                active
                  ? "border-slate bg-slate text-white"
                  : "border-[rgba(46,58,115,0.18)] bg-[var(--chip-a)] text-slate hover:bg-[var(--chip-b)]",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <fieldset>
        <legend className="sr-only">Choose the educator you&rsquo;d like</legend>

        <div className="grid grid-cols-3 gap-[14px] max-[860px]:grid-cols-2 max-[560px]:grid-cols-1">
          {shown.map((educator) => {
            const active = educator.slug === selected.slug;
            return (
              <label key={educator.slug} className="relative block cursor-pointer">
                <input
                  type="radio"
                  name="educatorSlug"
                  value={educator.slug}
                  checked={active}
                  onChange={() => onSelect(educator)}
                  className="peer sr-only"
                />

                <span
                  className={cn(
                    "flex h-full flex-col gap-3 rounded-[16px] border-[1.5px] bg-white p-4",
                    "transition-[border-color,box-shadow,transform] duration-300 ease-brand motion-reduce:transition-none",
                    "hover:-translate-y-[3px] hover:border-[rgba(46,58,115,0.35)]",
                    "peer-checked:border-slate peer-checked:shadow-[0_0_0_3px_rgba(46,58,115,0.14)]",
                    "peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-slate",
                    active ? "border-slate" : "border-line",
                  )}
                >
                  <span className="relative block h-14 w-14 overflow-hidden rounded-full border-2 border-sand">
                    <Image
                      src={educator.image.src}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover object-[50%_18%]"
                    />
                  </span>

                  <span className="block">
                    <b className="block font-serif text-[15.5px] font-semibold">
                      {educator.name}
                    </b>
                    <span className="mt-[2px] block text-[12.5px] leading-[1.4] text-muted">
                      {educator.subject}
                    </span>
                    <span className="mt-[6px] flex items-center gap-[5px] text-[13px] font-bold text-slate">
                      {ratings[educator.slug] ? (
                        <>
                          <StarIcon className="h-[13px] w-[13px] text-gold" />
                          {ratings[educator.slug].average.toFixed(1)}
                          <span aria-hidden="true" className="text-muted">
                            ·
                          </span>
                        </>
                      ) : null}
                      <span>
                        $
                        {liveRatePerHour(
                          rates,
                          educator.slug,
                          subjectSlug,
                          educator.price,
                        )}
                        /hr
                      </span>
                    </span>
                  </span>
                </span>

                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute right-3 top-3 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-slate text-white",
                    "transition-[opacity,transform] duration-[250ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none",
                    "opacity-0 [transform:scale(0.6)] peer-checked:opacity-100 peer-checked:[transform:scale(1)]",
                  )}
                >
                  <CheckIcon className="h-[13px] w-[13px]" />
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {shown.length === 0 ? (
        <p className="py-6 text-center text-[14px] text-muted">
          No educators listed for that subject yet.
        </p>
      ) : null}

      <p
        id="booking-educator-error"
        hidden={!error}
        className="mt-[9px] text-[12.5px] font-semibold text-[#b23b3b]"
      >
        {error}
      </p>

      <p className="mt-4 text-[12.5px] leading-[1.55] text-muted">
        This is who you&rsquo;d like. A coordinator checks they&rsquo;re free for your time
        and confirms — if they aren&rsquo;t, we&rsquo;ll contact you before assigning anyone
        else.
      </p>
    </div>
  );
}
