import Image from "next/image";

import { Highlight } from "@/components/common/highlight";
import { Reveal, type RevealDelay } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { SESSION_FORMATS } from "@/data/how-it-works";

/** In-home vs online session formats, as two photo cards. */
export function SessionFormats() {
  return (
    <Section className="bg-sand py-[16vh]">
      <Reveal>
        <SectionHeading
          eyebrow="How Sessions Run"
          title={
            <>
              Learn <Highlight>in your home,</Highlight> or anywhere online.
            </>
          }
        />
      </Reveal>

      <div className="grid grid-cols-2 gap-7 max-[760px]:grid-cols-1">
        {SESSION_FORMATS.map((format, index) => (
          <Reveal key={format.tag} delay={(index + 1) as RevealDelay}>
            <article className="group overflow-hidden rounded-[20px] border border-line bg-ivory shadow-[0_30px_60px_-40px_rgba(24,24,24,0.25)] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,0.7,0.2,1)] hover:-translate-y-2 hover:shadow-[0_40px_76px_-32px_rgba(24,24,24,0.32)]">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={format.image.src}
                  alt={format.image.alt}
                  fill
                  sizes="(max-width: 760px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,0.7,0.2,1)] group-hover:scale-[1.06]"
                />
              </div>
              <div className="px-8 pb-8 pt-[30px]">
                <div className="mb-[10px] text-[11px] font-bold uppercase tracking-[0.14em] text-slate">
                  {format.tag}
                </div>
                <h3 className="mb-[10px] font-serif text-[22px] font-semibold tracking-[-0.01em]">
                  {format.title}
                </h3>
                <p className="text-[14.5px] leading-[1.6] text-muted">{format.body}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
