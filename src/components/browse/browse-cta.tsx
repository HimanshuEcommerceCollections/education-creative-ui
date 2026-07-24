import { ClosingCta } from "@/components/common/closing-cta";
import { Highlight } from "@/components/common/highlight";
import { Button } from "@/components/ui/button";

/** Closing call-to-action: reach out for help narrowing down, over a dark photo. */
export function BrowseCta() {
  return (
    <ClosingCta
      imageSrc="/assets/browse/images/cta-bg.jpg"
      title={
        <>
          Find the right <Highlight tone="gold">fit</Highlight> for your family.
        </>
      }
      description={
        <>
          Have a subject in mind or need a hand narrowing down? Reach out and we&rsquo;ll help you
          explore educators who suit your goals, schedule, and learning style.
        </>
      }
    >
      <Button href="/contact" variant="primary">
        Contact Us
      </Button>
      <Button href="/how-it-works" variant="ghost">
        How It Works
      </Button>
    </ClosingCta>
  );
}
