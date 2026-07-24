import { ClosingCta } from "@/components/common/closing-cta";
import { Highlight } from "@/components/common/highlight";
import { Button } from "@/components/ui/button";

/** Closing call-to-action nudging visitors to browse educators first. */
export function ContactCta() {
  return (
    <ClosingCta
      imageSrc="/assets/how-it-works/images/cta-bg.jpg"
      title={
        <>
          Prefer to <Highlight tone="gold">browse</Highlight> first?
        </>
      }
      description={
        <>
          Explore vetted independent educators by subject, format, and schedule — then reach out
          when you find a fit. A parent or guardian books and supervises for any learner under 18.
        </>
      }
    >
      <Button href="/browse" variant="primary">
        Browse Educators
      </Button>
      <Button href="/how-it-works" variant="ghost">
        How It Works
      </Button>
    </ClosingCta>
  );
}
