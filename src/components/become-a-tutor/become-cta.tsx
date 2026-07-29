import { ClosingCta } from "@/components/common/closing-cta";
import { Highlight } from "@/components/common/highlight";
import { Button } from "@/components/ui/button";

/** Closing call-to-action: jump back to the application, or read requirements. */
export function BecomeCta() {
  return (
    <ClosingCta
      imageSrc="/assets/become-a-tutor/images/cta-bg.jpg"
      overlayClassName="after:bg-[linear-gradient(180deg,rgba(16,16,18,0.74)_0%,rgba(12,12,14,0.86)_100%)]"
      title={
        <>
          Ready to teach <Highlight tone="gold">on your terms?</Highlight>
        </>
      }
      description={
        <>
          Apply to join a vetted marketplace of independent educators supporting families across
          Raleigh &mdash; you set the rate, you choose the format.
        </>
      }
    >
      <Button href="#apply" variant="primary">
        Start Your Application
      </Button>
      <Button href="/requirements" variant="ghost">
        View Requirements
      </Button>
    </ClosingCta>
  );
}
