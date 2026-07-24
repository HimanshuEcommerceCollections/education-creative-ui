"use client";

import { useState, type CSSProperties, type MouseEvent } from "react";

import { CONTACT_DETAILS } from "@/data/contact";
import { cn } from "@/lib/utils";

import { CONTACT_DETAIL_ICONS, PinFilledIcon, ShieldIcon } from "./contact-icons";
import styles from "./contact-info-card.module.css";

const RING = "absolute left-0 top-0 h-[22px] w-[22px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[rgba(210,162,65,0.75)]";

/**
 * Dark "reach us" card that tilts toward the cursor in 3D, above a stylised
 * map panel with a pulsing Raleigh marker. Tilt is skipped under reduced motion.
 */
export function ContactInfoCard() {
  const [transform, setTransform] = useState<CSSProperties["transform"]>();

  const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion()) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    setTransform(
      `rotateY(${(px * 7).toFixed(2)}deg) rotateX(${(-py * 7).toFixed(2)}deg) translateY(-4px)`,
    );
  };

  const handleLeave = () => setTransform("rotateY(0deg) rotateX(0deg) translateY(0)");

  return (
    <div className={styles.infoWrap}>
      <div
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ transform }}
        className={cn(
          styles.infoCard,
          "relative overflow-hidden rounded-[24px] bg-[linear-gradient(158deg,var(--slate)_0%,var(--slate-deep)_100%)] p-10 text-white",
          "shadow-[0_40px_80px_-44px_rgba(46,58,115,0.75)] will-change-transform max-[560px]:p-[30px]",
          "transition-[transform,box-shadow] duration-500 ease-brand",
        )}
      >
        <div className="mb-[14px] text-[11px] font-bold uppercase tracking-[0.26em] text-gold">
          Reach us
        </div>
        <h3 className="mb-[26px] font-serif text-[28px] font-semibold tracking-[-0.01em]">
          Talk to a human.
        </h3>

        <ul className="mb-6 grid list-none gap-5">
          {CONTACT_DETAILS.map((detail) => {
            const Icon = CONTACT_DETAIL_ICONS[detail.icon];
            return (
              <li key={detail.label} className="flex items-start gap-[14px]">
                <span className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-[12px] bg-white/10 text-gold">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <b className="mb-0.5 block font-serif text-[12.5px] font-semibold tracking-[0.02em] text-white/60">
                    {detail.label}
                  </b>
                  {detail.href ? (
                    <a
                      href={detail.href}
                      className="text-[15.5px] font-medium text-white transition-colors hover:text-gold"
                    >
                      {detail.value}
                    </a>
                  ) : (
                    <span className="text-[15.5px] font-medium text-white">{detail.value}</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <p className="flex items-start gap-[11px] rounded-[14px] border border-white/[0.13] bg-white/[0.06] px-4 py-[14px] text-[13.5px] leading-[1.55] text-[rgba(244,241,234,0.82)]">
          <ShieldIcon className="mt-px h-[18px] w-[18px] flex-none text-gold" />
          A parent or guardian is always the point of contact for learners under 18.
        </p>

        <div
          aria-hidden="true"
          className="relative mt-6 h-[190px] overflow-hidden rounded-[16px] border border-white/[0.13] bg-[radial-gradient(130%_120%_at_50%_42%,#33407e_0%,#232c59_68%,#1b2350_100%)]"
        >
          <div className={cn(styles.mapGrid, "absolute inset-0")} />
          <span className="absolute left-[-10%] top-[60%] h-[2px] w-[120%] -rotate-[14deg] rounded-[2px] bg-white/[0.12]" />
          <span className="absolute left-[-10%] top-[30%] h-[2px] w-[120%] rotate-[9deg] rounded-[2px] bg-[rgba(210,162,65,0.22)]" />

          <div className="absolute left-1/2 top-[48%]">
            <span className={cn(styles.ring, RING)} />
            <span className={cn(styles.ring, styles.ring2, RING)} />
            <span className="absolute left-0 top-0 block h-10 w-8 -translate-x-1/2 -translate-y-[86%] text-gold [filter:drop-shadow(0_7px_10px_rgba(0,0,0,0.42))]">
              <PinFilledIcon className="h-full w-full" />
            </span>
          </div>

          <div className="absolute bottom-3 left-[14px] rounded-[20px] bg-[rgba(18,19,28,0.42)] px-[11px] py-[5px] text-[10.5px] font-bold uppercase tracking-[0.14em] text-white/75">
            Raleigh, NC
          </div>
        </div>
      </div>
    </div>
  );
}
