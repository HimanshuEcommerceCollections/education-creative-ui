"use client";

import Link from "next/link";

import { Reveal, type RevealDelay } from "@/components/common/reveal";
import { SUPPORT_TOPICS, type SupportTopic } from "@/data/support";
import { cn } from "@/lib/utils";

import { ArrowRightIcon, SUPPORT_TOPIC_ICONS } from "./support-icons";
import { useSupportSearch } from "./support-search-context";

function matches(topic: SupportTopic, query: string): boolean {
  if (!query) return true;
  return `${topic.title} ${topic.body} ${topic.keywords}`
    .toLowerCase()
    .includes(query);
}

/** One topic card: icon tile that inverts on hover, blurb, and an arrow row. */
function TopicCard({ topic }: { topic: SupportTopic }) {
  const Icon = SUPPORT_TOPIC_ICONS[topic.icon];

  return (
    <Link
      href={topic.href}
      className="group block h-full rounded-[20px] border border-line bg-white px-[30px] pb-[30px] pt-8 no-underline transition-[transform,box-shadow,border-color] duration-[400ms] ease-brand hover:-translate-y-[6px] hover:border-[rgba(var(--slate-rgb),0.28)] hover:shadow-[0_26px_55px_-30px_rgba(var(--slate-rgb),0.42)]"
    >
      <span className="mb-[22px] flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-[var(--chip-a)] text-slate transition-[background-color,color] duration-[400ms] group-hover:bg-slate group-hover:text-white">
        <Icon className="h-[26px] w-[26px]" />
      </span>
      <h3 className="mb-2 font-serif text-[19px] font-semibold tracking-[-0.01em]">
        {topic.title}
      </h3>
      <p className="text-[14px] leading-[1.55] text-muted">{topic.body}</p>
      <span className="mt-[18px] inline-flex items-center gap-[7px] text-[13px] font-bold text-slate">
        Open topic
        <ArrowRightIcon className="h-[15px] w-[15px] transition-transform duration-300 group-hover:translate-x-[4px]" />
      </span>
    </Link>
  );
}

/**
 * The browse-topics grid, filtered by the hero's search field. Cards stay
 * mounted and are hidden instead of unmounted, so their reveal doesn't replay
 * on every keystroke.
 */
export function SupportTopicGrid() {
  const { query } = useSupportSearch();
  const needle = query.trim().toLowerCase();
  const shown = SUPPORT_TOPICS.filter((topic) => matches(topic, needle));

  return (
    <>
      <div className="grid grid-cols-3 gap-[22px] max-[960px]:grid-cols-2 max-[600px]:grid-cols-1">
        {SUPPORT_TOPICS.map((topic, index) => (
          <Reveal
            key={topic.title}
            delay={(index + 1) as RevealDelay}
            className={cn("h-full", !matches(topic, needle) && "hidden")}
          >
            <TopicCard topic={topic} />
          </Reveal>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="pt-10 text-center text-[15.5px] text-muted">
          No topics match your search. Try a different word, or{" "}
          <Link href="/contact" className="font-bold text-slate hover:text-gold">
            contact us
          </Link>
          .
        </p>
      ) : null}
    </>
  );
}
