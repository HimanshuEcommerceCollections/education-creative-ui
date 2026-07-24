import Image from "next/image";
import type { ReactNode } from "react";

import { Reveal } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import type { CoppaPoint } from "@/data/coppa";
import { cn } from "@/lib/utils";

interface CoppaBandProps {
  points: CoppaPoint[];
  /** Faint background photo inside the band. */
  imageSrc: string;
  /** The shield icon element (each page passes its own icon set's instance). */
  icon: ReactNode;
  /** Outer strip background. */
  stripClassName?: string;
  /** Inner band background. */
  bandClassName?: string;
}

/**
 * Shared parent-supervision (COPPA) band: a shield + reassuring headline beside
 * three parent-control points, over a faint photo. Strip/band backgrounds and
 * the icon are props so each page keeps its exact look.
 */
export function CoppaBand({
  points,
  imageSrc,
  icon,
  stripClassName = "bg-sand",
  bandClassName = "bg-ivory",
}: CoppaBandProps) {
  return (
    <Section className={cn("py-[12vh]", stripClassName)}>
      <Reveal>
        <div
          className={cn(
            "relative grid grid-cols-[0.8fr_1.2fr] items-center gap-11 overflow-hidden rounded-[24px] border border-line p-[52px] max-[860px]:grid-cols-1 max-[860px]:gap-7 max-[860px]:p-[34px]",
            bandClassName,
          )}
        >
          <div aria-hidden="true" className="absolute inset-0 z-0 opacity-[0.14]">
            <Image src={imageSrc} alt="" fill sizes="100vw" className="object-cover" />
          </div>

          <div className="relative z-[1] flex items-center gap-[18px]">
            <div className="flex h-[60px] w-[60px] flex-none items-center justify-center rounded-[16px] bg-slate text-white">
              {icon}
            </div>
            <h3 className="font-serif text-[clamp(20px,2.2vw,26px)] font-semibold tracking-[-0.01em]">
              For learners under 18, a parent or guardian books and supervises every session —
              always.
            </h3>
          </div>

          <div className="relative z-[1] grid grid-cols-3 gap-6 max-[640px]:grid-cols-1">
            {points.map((point) => (
              <div key={point.title} className="border-l-2 border-gold pl-4">
                <b className="mb-1 block font-serif text-[14.5px] font-semibold">{point.title}</b>
                <span className="text-[13.5px] leading-[1.5] text-muted">{point.body}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
