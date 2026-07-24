import { ClosingCta } from "@/components/common/closing-cta";
import { Highlight } from "@/components/common/highlight";
import { Button } from "@/components/ui/button";

/** Closing call-to-action: browse educators or reach out, over a dark photo. */
export function HowItWorksCta() {
  return (
    <ClosingCta
      imageSrc="/assets/how-it-works/images/cta-bg.jpg"
      bgClassName="bg-[#0F1120]"
      overlayClassName="after:bg-[linear-gradient(180deg,rgba(15,17,32,0.82)_0%,rgba(28,32,56,0.88)_100%)]"
      title={
        <>
          Ready to find the right <Highlight tone="gold">fit?</Highlight>
        </>
      }
      description={
        <>
          Browse six subjects of vetted, independent educators — or reach out first if you have
          questions.
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
