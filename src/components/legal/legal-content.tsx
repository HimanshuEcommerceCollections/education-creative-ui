import type { LegalSection } from "@/data/legal";

import { ChevronUpIcon } from "./legal-icons";

/**
 * The prose column: each section is an anchored block (its id feeds both the
 * scroll spy and the "Back to top" flow) with a hairline divider between
 * entries, followed by the return-to-top link.
 */
export function LegalContent({ sections }: { sections: LegalSection[] }) {
  return (
    <div>
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="mb-11 scroll-mt-[100px] border-b border-line pb-11 last:mb-0 last:border-b-0 last:pb-0"
        >
          <h2 className="mb-[14px] font-serif text-[clamp(21px,2.4vw,28px)] font-semibold tracking-[-0.01em] text-ink">
            {section.heading}
          </h2>

          {section.blocks.map((block, index) =>
            block.kind === "text" ? (
              <p key={index} className="mb-[14px] text-[15.5px] leading-[1.7] text-muted last:mb-0">
                {block.body}
              </p>
            ) : (
              <ul key={index} className="mb-[14px] mt-[6px] list-disc pl-5 last:mb-0">
                {block.items.map((item) => (
                  <li key={item.term} className="mb-2 text-[15px] leading-[1.6] text-muted last:mb-0">
                    <b className="text-ink">{item.term}</b> — {item.description}
                  </li>
                ))}
              </ul>
            ),
          )}
        </section>
      ))}

      <a
        href="#top"
        className="mt-2 inline-flex items-center gap-2 text-[13px] font-bold text-slate no-underline"
      >
        <ChevronUpIcon className="h-[15px] w-[15px]" />
        Back to top
      </a>
    </div>
  );
}
