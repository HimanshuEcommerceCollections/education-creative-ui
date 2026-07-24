"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/** One entry in the sticky table of contents. */
export interface TocItem {
  id: string;
  label: string;
}

/** Progress-ring geometry; circumference drives the stroke-dash math. */
const RING_RADIUS = 20;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
/** A section becomes "current" once its top rises past this offset (px). */
const ACTIVE_OFFSET = 140;

/**
 * Sticky in-page navigation: a scroll-progress ring plus a scroll-spied list of
 * section links. The ring and percentage update imperatively (via refs) so a
 * scroll frame never triggers a re-render; only the active link uses state.
 */
export function LegalToc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id);
  const ringRef = useRef<SVGCircleElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      const root = document.documentElement;
      const max = root.scrollHeight - root.clientHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, root.scrollTop / max)) : 0;

      if (ringRef.current) {
        ringRef.current.style.strokeDashoffset = (CIRCUMFERENCE * (1 - progress)).toFixed(2);
      }
      if (percentRef.current) {
        percentRef.current.textContent = `${Math.round(progress * 100)}%`;
      }

      let current = 0;
      items.forEach((item, index) => {
        const node = document.getElementById(item.id);
        if (node && node.getBoundingClientRect().top < ACTIVE_OFFSET) {
          current = index;
        }
      });
      setActiveId(items[current]?.id);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  return (
    <aside className="sticky top-[104px] max-[900px]:static">
      <div className="mb-5 flex items-center gap-[14px]">
        <div className="relative h-[46px] w-[46px] flex-none">
          <svg viewBox="0 0 46 46" className="h-[46px] w-[46px] -rotate-90">
            <circle
              cx="23"
              cy="23"
              r={RING_RADIUS}
              className="fill-none [stroke-width:4] [stroke:var(--sand2)]"
            />
            <circle
              ref={ringRef}
              cx="23"
              cy="23"
              r={RING_RADIUS}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE}
              className="fill-none stroke-gold transition-[stroke-dashoffset] duration-200 ease-linear [stroke-linecap:round] [stroke-width:4]"
            />
          </svg>
          <span
            ref={percentRef}
            className="absolute inset-0 flex items-center justify-center font-serif text-[11px] font-bold text-slate"
          >
            0%
          </span>
        </div>
        <b className="font-serif text-[12px] font-bold uppercase tracking-[0.14em] text-muted">
          On this page
        </b>
      </div>

      <ul className="list-none border-l border-line">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                "-ml-px block border-l-2 py-[9px] pl-4 text-[13.5px] no-underline transition-[color,border-color] duration-300",
                activeId === item.id
                  ? "border-gold font-semibold text-slate"
                  : "border-transparent text-muted hover:text-ink",
              )}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
