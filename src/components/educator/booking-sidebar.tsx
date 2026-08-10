import { Button } from "@/components/ui/button";
import { bookHrefFor } from "@/constants/site";
import type { EducatorProfile } from "@/data/educators";

import { ArrowRightIcon, ShieldIcon } from "./educator-icons";

/** Sticky booking card: price, availability summary, CTA and supervision note. */
export function BookingSidebar({ profile }: { profile: EducatorProfile }) {
  return (
    <aside className="sticky top-[100px] rounded-[22px] border border-line bg-white p-7 shadow-[0_30px_60px_-38px_rgba(22,24,29,0.4)]">
      <div className="font-serif text-[30px] font-bold text-ink">
        ${profile.price}{" "}
        <span className="text-[15px] font-medium text-muted">/ {profile.priceUnit}</span>
      </div>

      <div className="mt-5 rounded-[16px] border-l-[3px] border-gold bg-ivory px-[18px] py-4">
        <b className="mb-1 block text-[13px] font-semibold uppercase tracking-[0.12em] text-slate">
          Usually available
        </b>
        <p className="text-[14px] leading-[1.55] text-muted">{profile.availabilitySummary}</p>
      </div>

      <Button href={bookHrefFor(profile.slug)} variant="primary" className="mt-6 w-full">
        Book a Session
        <ArrowRightIcon className="h-[17px] w-[17px]" />
      </Button>

      <p className="mt-4 flex items-start gap-2 text-[12.5px] leading-[1.5] text-muted">
        <ShieldIcon className="mt-px h-4 w-4 flex-none text-slate" />
        A parent or guardian books and supervises every session. You pay when you book;
        a coordinator then confirms the time.
      </p>
    </aside>
  );
}
