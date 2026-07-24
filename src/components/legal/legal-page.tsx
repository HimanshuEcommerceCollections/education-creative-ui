import { Section } from "@/components/common/section";
import type { LegalPageContent } from "@/data/legal";

import { LegalContent } from "./legal-content";
import { LegalHero } from "./legal-hero";
import { LegalToc } from "./legal-toc";

/**
 * Shared shell for every legal / policy page: the light hero over a two-column
 * body — a sticky, scroll-spied table of contents beside the prose column. Feed
 * it a `LegalPageContent` (see `@/data/legal`) and it renders the whole page.
 */
export function LegalPage({ content }: { content: LegalPageContent }) {
  const tocItems = content.sections.map((section) => ({
    id: section.id,
    label: section.heading,
  }));

  return (
    <>
      <LegalHero content={content} />

      <Section className="pb-[8vh] pt-14">
        <div className="grid grid-cols-[260px_1fr] items-start gap-14 max-[900px]:grid-cols-1 max-[900px]:gap-[30px]">
          <LegalToc items={tocItems} />
          <LegalContent sections={content.sections} />
        </div>
      </Section>
    </>
  );
}
