import { HeroSection } from "@/components/home/hero-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { SubjectsSection } from "@/components/home/subjects-section";
import { TrustStatsSection } from "@/components/home/trust-stats-section";
import { TutorsSection } from "@/components/home/tutors-section";
import { WhyChooseSection } from "@/components/home/why-choose-section";

/**
 * Home page. Sections are composed here incrementally across implementation
 * phases (Hero → Subjects → How It Works → ...). The `#top` anchor is the
 * target for the header brand/"Home" link.
 */
export default function HomePage() {
  return (
    <main id="top">
      <HeroSection />
      <SubjectsSection />
      <HowItWorksSection />
      <TrustStatsSection />
      <WhyChooseSection />
      <TutorsSection />
    </main>
  );
}
