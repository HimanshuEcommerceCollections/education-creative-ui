import { Container } from "@/components/common/container";
import { CoppaBand } from "@/components/common/coppa-band";
import { Reveal } from "@/components/common/reveal";
import { ShieldIcon } from "@/components/how-it-works/how-it-works-icons";
import type { EducatorProfile } from "@/data/educators";
import { COPPA_POINTS } from "@/data/coppa";

import { AvailabilityWeek } from "./availability-week";
import { BookingSidebar } from "./booking-sidebar";
import { EducatorCta } from "./educator-cta";
import { EducatorHero } from "./educator-hero";
import { EducatorTabs } from "./educator-tabs";
import { RatingBars } from "./rating-bars";
import { TrustFlipCard } from "./trust-flip-card";

/** Composes the full educator profile: hero, detail column, booking rail, CTA. */
export function EducatorPage({ profile }: { profile: EducatorProfile }) {
  return (
    <>
      <EducatorHero profile={profile} />

      <section className="bg-ivory py-[clamp(48px,8vh,88px)]">
        <Container>
          <div className="grid grid-cols-[1.55fr_0.9fr] items-start gap-14 max-[960px]:grid-cols-1">
            <div className="min-w-0">
              <Reveal>
                <EducatorTabs profile={profile} />
              </Reveal>
              <Reveal className="mt-11">
                <TrustFlipCard />
              </Reveal>
              <Reveal className="mt-11">
                <RatingBars facets={profile.ratingBreakdown} />
              </Reveal>
              <Reveal className="mt-11">
                <AvailabilityWeek days={profile.availability} />
              </Reveal>
            </div>

            <BookingSidebar profile={profile} />
          </div>
        </Container>
      </section>

      <CoppaBand
        points={COPPA_POINTS}
        imageSrc="/assets/how-it-works/images/coppa-bg.jpg"
        icon={<ShieldIcon className="h-7 w-7" />}
        stripClassName="bg-ivory"
        bandClassName="bg-sand"
      />

      <EducatorCta profile={profile} />
    </>
  );
}
