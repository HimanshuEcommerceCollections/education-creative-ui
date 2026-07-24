import Image from "next/image";

import { Eyebrow } from "@/components/common/eyebrow";
import { Highlight } from "@/components/common/highlight";
import type { AuthPanel } from "@/data/auth";
import { cn } from "@/lib/utils";

import { TickIcon } from "./auth-icons";

/**
 * The dark marketing side of the auth card: slate gradient with a gold glow and
 * a faint photo, carrying the headline, reassurance ticks, and a demo footnote.
 */
export function BrandPanel({
  panel,
  className,
}: {
  panel: AuthPanel;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex min-h-[560px] flex-col justify-between overflow-hidden p-[54px] text-white",
        "bg-[linear-gradient(150deg,#2E3A73_0%,#232C59_60%,#1b2350_100%)]",
        "max-[900px]:min-h-0 max-[900px]:p-9",
        className,
      )}
    >
      {/* Faint photo under a slate wash. */}
      <div aria-hidden="true" className="absolute inset-0 z-0">
        <Image
          src={panel.image}
          alt=""
          fill
          sizes="(max-width: 900px) 100vw, 50vw"
          className="object-cover opacity-[0.6]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(24,29,72,0.9)_0%,rgba(26,32,78,0.68)_42%,rgba(30,36,84,0.32)_100%)]" />
      </div>

      {/* Gold corner glow. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 z-0 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(210,162,65,0.28),rgba(210,162,65,0)_70%)]"
      />

      <Eyebrow tone="gold" className="relative z-[1] mb-0">
        {panel.eyebrow}
      </Eyebrow>

      <div className="relative z-[1] mt-8 max-w-[420px]">
        <h2 className="font-serif text-[clamp(28px,3.4vw,42px)] font-semibold leading-[1.08] tracking-[-0.02em]">
          {panel.heading} <Highlight tone="gold">{panel.accent}</Highlight>
        </h2>
        <p className="mt-4 text-[15.5px] leading-[1.6] text-[rgba(244,241,234,0.82)]">
          {panel.description}
        </p>
        <ul className="mt-[26px] grid gap-3">
          {panel.ticks.map((tick) => (
            <li
              key={tick}
              className="flex items-center gap-[11px] text-sm text-[rgba(244,241,234,0.9)]"
            >
              <TickIcon className="h-[18px] w-[18px] shrink-0 text-gold" />
              {tick}
            </li>
          ))}
        </ul>
      </div>

      <p className="relative z-[1] mt-10 text-[12px] text-[rgba(244,241,234,0.5)]">
        {panel.footnote}
      </p>
    </div>
  );
}
