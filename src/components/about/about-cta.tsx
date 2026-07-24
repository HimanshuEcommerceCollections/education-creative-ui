import { ClosingCta } from "@/components/common/closing-cta";
import { Highlight } from "@/components/common/highlight";
import { Button } from "@/components/ui/button";

/** Closing call-to-action: browse educators or reach out, over a dark photo. */
export function AboutCta() {
  return (
    <ClosingCta
      imageSrc="/assets/about/images/cta-bg.jpg"
      title={
        <>
          Find an educator that fits your <Highlight tone="gold">family.</Highlight>
        </>
      }
      description={
        <>
          Browse vetted independent educators across six subjects in Raleigh — in your home or
          online, always with a parent in control.
        </>
      }
    >
      <Button href="/browse" variant="primary">
        Browse Educators
      </Button>
      <Button href="/contact" variant="ghost">
        Contact Us
      </Button>
    </ClosingCta>
  );
}
