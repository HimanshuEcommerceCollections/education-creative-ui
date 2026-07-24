import Image from "next/image";
import type { ReactNode } from "react";

import { Eyebrow } from "@/components/common/eyebrow";
import { Reveal, type RevealDelay } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import type { ImageAsset } from "@/types/media";

interface FeatureSplitProps {
  image: ImageAsset;
  /** Headline; use <Highlight> for the accent. */
  title: ReactNode;
  paragraphs: string[];
  features: string[];
  /** Optional decoration layered over the photo (e.g. drifting notes). */
  photoOverlay?: ReactNode;
  /** Optional content below the feature list (e.g. an equalizer). */
  belowContent?: ReactNode;
}

function FeatureListItem({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-[14px]">
      <span className="mt-[7px] h-2 w-2 flex-none rounded-full bg-gold" />
      <p className="text-[15px]">{children}</p>
    </div>
  );
}

/** Two-column feature split: photo + copy, with optional decorations. */
export function FeatureSplit({
  image,
  title,
  paragraphs,
  features,
  photoOverlay,
  belowContent,
}: FeatureSplitProps) {
  return (
    <Section className="pb-[14vh] pt-[12vh]">
      <div className="grid grid-cols-2 items-center gap-[60px] max-[960px]:grid-cols-1 max-[960px]:gap-[30px]">
        <Reveal className="group relative h-[480px] overflow-hidden rounded-[22px] shadow-[0_50px_90px_-50px_rgba(24,24,24,0.4)]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 960px) 100vw, 50vw"
            className="object-cover transition-transform duration-[1200ms] ease-brand group-hover:scale-[1.04]"
          />
          {photoOverlay}
        </Reveal>

        <div>
          <Reveal>
            <Eyebrow>The approach</Eyebrow>
          </Reveal>
          <Reveal>
            <h2 className="mb-5 font-serif text-[clamp(28px,3.4vw,44px)] font-semibold leading-[1.05] tracking-[-0.02em]">
              {title}
            </h2>
          </Reveal>
          {paragraphs.map((paragraph, index) => (
            <Reveal key={paragraph} delay={(index + 1) as RevealDelay}>
              <p className="mb-4 text-[16px] leading-[1.7] text-muted">
                {paragraph}
              </p>
            </Reveal>
          ))}

          <div className="mt-6 grid gap-[14px]">
            {features.map((feature, index) => (
              <Reveal key={feature} delay={(index + 1) as RevealDelay}>
                <FeatureListItem>{feature}</FeatureListItem>
              </Reveal>
            ))}
          </div>

          {belowContent ? (
            <Reveal delay={3}>{belowContent}</Reveal>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
