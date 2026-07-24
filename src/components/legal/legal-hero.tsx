import Link from "next/link";

import { Eyebrow } from "@/components/common/eyebrow";
import { Highlight } from "@/components/common/highlight";
import { Reveal } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import { SITE } from "@/constants/site";
import type { LegalPageContent } from "@/data/legal";

import { WarningTriangleIcon } from "./legal-icons";

/**
 * Light hero for the legal pages: breadcrumb, eyebrow, split headline, a
 * "last updated" meta line, and the shared draft-placeholder flag. Sits on a
 * soft radial wash and clears the fixed header with its top padding.
 */
export function LegalHero({ content }: { content: LegalPageContent }) {
  return (
    <>
      <div id="top" />
      <Section className="relative bg-[radial-gradient(120%_90%_at_82%_-6%,#EFEDE7_0%,var(--color-ivory)_60%)] pb-[60px] pt-[180px]">
        <Reveal>
          <nav
            aria-label="Breadcrumb"
            className="mb-[18px] flex items-center gap-2 text-[12.5px] tracking-[0.06em] text-muted"
          >
            <Link href="/" className="transition-colors hover:text-slate">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <b className="font-semibold text-ink">{content.crumb}</b>
          </nav>
        </Reveal>

        <Reveal>
          <Eyebrow>{content.eyebrow}</Eyebrow>
        </Reveal>

        <Reveal delay={1}>
          <h1 className="font-serif text-[clamp(34px,4.6vw,56px)] font-semibold leading-[1.03] tracking-[-0.02em] text-ink">
            {content.titleLead}
            <Highlight>{content.titleAccent}</Highlight>
          </h1>
        </Reveal>

        <Reveal delay={2}>
          <p className="mt-4 text-[14px] text-muted">
            Last updated: {content.updated} &nbsp;·&nbsp; Applies to the {SITE.name} demo site
          </p>
        </Reveal>

        <Reveal>
          <div className="mt-[26px] flex max-w-[760px] items-start gap-[13px] rounded-xl border border-l-[3px] border-line border-l-gold bg-white px-5 py-4">
            <WarningTriangleIcon className="mt-px h-5 w-5 flex-none text-gold" />
            <p className="text-[13.5px] leading-[1.55] text-ink">
              <b>Draft placeholder.</b> This page is sample content for a demo site — it is
              not legal advice and is not binding. Replace with policy reviewed by qualified
              counsel before launch.
            </p>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
