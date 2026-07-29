import { ClosingCta } from "@/components/common/closing-cta";
import { Highlight } from "@/components/common/highlight";
import { Button } from "@/components/ui/button";

/** Closing call-to-action: apply, or read the FAQ first. */
export function RequirementsCta() {
  return (
    <ClosingCta
      imageSrc="/assets/requirements/images/cta-bg.jpg"
      overlayClassName="after:bg-[linear-gradient(180deg,rgba(16,16,18,0.74)_0%,rgba(12,12,14,0.86)_100%),radial-gradient(120%_120%_at_85%_8%,rgba(210,162,65,0.14),rgba(210,162,65,0)_50%)]"
      title={
        <>
          Ready to <Highlight tone="gold">apply?</Highlight>
        </>
      }
      description={
        <>
          If this sounds like a fit, start your application. Have questions first? Our FAQ covers
          how joining works, how sessions run, and how families find you.
        </>
      }
    >
      <Button href="/become-a-tutor" variant="primary">
        Become an Educator
      </Button>
      <Button href="/faq" variant="ghost">
        Read the FAQ
      </Button>
    </ClosingCta>
  );
}
