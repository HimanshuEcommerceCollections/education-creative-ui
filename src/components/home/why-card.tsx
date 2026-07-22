import Image from "next/image";

import type { WhyItem } from "@/types/why";

interface WhyCardProps {
  item: WhyItem;
}

/** Tall image card with an ordinal badge and bottom-aligned title + copy. */
export function WhyCard({ item }: WhyCardProps) {
  return (
    <div className="group relative flex h-[60vh] min-h-[420px] flex-col justify-end overflow-hidden rounded-[12px] p-[26px] after:absolute after:inset-0 after:z-[1] after:bg-[linear-gradient(180deg,rgba(16,22,18,0.12)_30%,rgba(14,20,16,0.86)_100%)] after:content-[''] max-[900px]:h-[46vh]">
      <Image
        src={item.image.src}
        alt={item.image.alt}
        fill
        sizes="(max-width: 520px) 100vw, (max-width: 900px) 50vw, 25vw"
        className="z-0 object-cover [filter:saturate(0.92)] transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,0.7,0.2,1)] group-hover:scale-[1.06]"
      />

      <span className="absolute left-[26px] top-[22px] z-[2] text-[12px] font-semibold tracking-[0.16em] text-white/[0.72]">
        {item.number}
      </span>

      <div className="relative z-[2] text-white">
        <h3 className="font-serif text-[clamp(22px,1.7vw,27px)] font-semibold leading-[1.05] tracking-[-0.01em]">
          {item.title}
        </h3>
        <p className="mt-2 text-[13px] leading-[1.5] text-white/[0.85]">
          {item.description}
        </p>
      </div>
    </div>
  );
}
