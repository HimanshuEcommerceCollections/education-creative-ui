import { Eyebrow } from "@/components/common/eyebrow";
import { Section } from "@/components/common/section";
import { HeroVideo } from "@/components/common/hero-video";
import { Button } from "@/components/ui/button";

const HERO_VIDEO_SRC = "/assets/home/videos/hero.mp4";

/** Trust badges beneath the hero CTAs. */
const HERO_BADGES = [
  "Background Verified",
  "Flexible Scheduling",
  "Online & In-Home",
] as const;

/**
 * Full-viewport hero. The source always enables its `hasVideo` mode (the
 * background video is present in markup), so the light-text-over-video
 * treatment is implemented directly.
 */
export function HeroSection() {
  return (
    <Section
      id="hero"
      container={false}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ivory pt-24"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 overflow-hidden bg-[linear-gradient(180deg,#EFE8DD_0%,#F8F5EF_60%)] after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(16,22,18,0.26),rgba(14,20,16,0.34))] after:content-['']"
      >
        <HeroVideo src={HERO_VIDEO_SRC} />
      </div>

      <div className="relative z-[5] mt-6 max-w-[680px] rounded-[22px] border border-white/[0.14] bg-[rgba(16,22,18,0.20)] px-11 py-10 text-center shadow-[0_30px_70px_-34px_rgba(0,0,0,0.5)] [backdrop-filter:blur(10px)_saturate(130%)] [-webkit-backdrop-filter:blur(10px)_saturate(130%)] max-[640px]:px-[26px]">
        <Eyebrow tone="gold" align="center">
          Raleigh · in-home and online
        </Eyebrow>

        <h1 className="mx-auto max-w-[16ch] font-serif text-[clamp(30px,4.2vw,58px)] font-semibold leading-[1.05] tracking-[-0.025em] text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.5)]">
          Find trusted educators for{" "}
          <i className="text-gold not-italic">every stage</i> of learning.
        </h1>

        <p className="mx-auto mt-[22px] max-w-[600px] text-[17px] leading-[1.55] text-white/[0.92]">
          Book vetted tutors for academics, music, arts, languages, cooking, and
          more — online or in your home.
        </p>

        <div className="mt-[30px] flex flex-wrap justify-center gap-[14px]">
          <Button href="#subjects2" variant="primary">
            Find Tutors
          </Button>
          <Button href="#tutors" variant="secondary">
            Become an Educator
          </Button>
        </div>

        <ul className="mt-[26px] flex flex-wrap justify-center gap-6">
          {HERO_BADGES.map((badge) => (
            <li
              key={badge}
              className="flex items-center gap-[7px] text-[13px] text-white/90"
            >
              <span aria-hidden="true" className="font-bold text-gold">
                ✓
              </span>
              {badge}
            </li>
          ))}
        </ul>
      </div>

      <span className="absolute bottom-[26px] left-1/2 z-[5] -translate-x-1/2 text-[10px] uppercase tracking-[0.18em] text-white/80">
        Scroll
      </span>
    </Section>
  );
}
