import Image from "next/image";

import { Highlight } from "@/components/common/highlight";
import { Reveal, type RevealDelay } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { GOOD_TO_KNOW } from "@/data/requirements";

import { GOOD_TO_KNOW_ICONS } from "./requirements-icons";

/** Honest expectations before applying — photo-topped cards on a gold spine. */
export function GoodToKnow() {
  return (
    <Section className="bg-ivory py-[12vh]">
      <Reveal>
        <SectionHeading
          className="mb-[76px]"
          eyebrow="A few honest notes"
          title={
            <>
              Good to <Highlight>know</Highlight>
            </>
          }
          description="Some things worth understanding before you apply, so there are no surprises later."
        />
      </Reveal>

      <div className="grid grid-cols-3 gap-[22px] max-[860px]:grid-cols-1">
        {GOOD_TO_KNOW.map((note, index) => {
          const Icon = GOOD_TO_KNOW_ICONS[note.icon];
          return (
            <Reveal key={note.title} delay={(index + 1) as RevealDelay}>
              <div className="group h-full overflow-hidden rounded-[14px] border border-l-[3px] border-line border-l-gold bg-white transition-[transform,box-shadow] duration-[400ms] ease-brand hover:-translate-y-1 hover:shadow-[0_22px_46px_-26px_rgba(46,58,115,0.4)]">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={note.image.src}
                    alt={note.image.alt}
                    fill
                    sizes="(max-width: 860px) 100vw, 33vw"
                    className="object-cover transition-transform duration-1000 ease-brand group-hover:scale-[1.06]"
                  />
                </div>

                <div className="px-7">
                  <span className="mb-4 mt-[22px] flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-[var(--chip-a)] text-slate">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mb-2 font-serif text-[17.5px] font-semibold tracking-[-0.01em]">
                    {note.title}
                  </h3>
                  <p className="pb-[26px] text-[14.5px] leading-[1.62] text-muted">{note.body}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
