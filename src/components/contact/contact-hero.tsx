import Link from "next/link";

import { Eyebrow } from "@/components/common/eyebrow";
import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { Section } from "@/components/common/section";

/**
 * Light contact hero: breadcrumb, eyebrow, headline, and lead paragraph over a
 * pair of soft radial washes (slate top-right, gold bottom-left) on ivory.
 */
export function ContactHero() {
  return (
    <Section className="relative overflow-hidden bg-[radial-gradient(120%_90%_at_80%_8%,rgba(46,58,115,0.11)_0%,rgba(46,58,115,0)_55%),radial-gradient(90%_80%_at_4%_96%,rgba(210,162,65,0.13),rgba(210,162,65,0)_58%),var(--color-ivory)] pb-[84px] pt-[188px]">
      <Reveal>
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-[9px] text-[12.5px] font-semibold text-muted"
        >
          <Link href="/" className="text-muted transition-colors hover:text-slate">
            Home
          </Link>
          <span aria-hidden="true" className="opacity-45">
            /
          </span>
          <b className="font-semibold text-ink">Contact</b>
        </nav>
      </Reveal>

      <Reveal delay={1}>
        <Eyebrow>Contact</Eyebrow>
      </Reveal>

      <Reveal delay={2}>
        <h1 className="mt-1 max-w-[14ch] font-serif text-[clamp(42px,6.6vw,86px)] font-semibold leading-[0.98] tracking-[-0.03em]">
          Let&rsquo;s find the right <Highlight>fit.</Highlight>
        </h1>
      </Reveal>

      <Reveal delay={3}>
        <p className="mt-[26px] max-w-[60ch] text-[18px] leading-[1.62] text-muted">
          Reach out with questions about educators, subjects, scheduling, or pricing. A parent or
          guardian gets in touch on behalf of any learner under 18 — you stay the point of contact
          from the first message to the first session.
        </p>
      </Reveal>
    </Section>
  );
}
