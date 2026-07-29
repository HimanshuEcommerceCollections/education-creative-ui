import { ClosingCta } from "@/components/common/closing-cta";
import { Highlight } from "@/components/common/highlight";
import { Button } from "@/components/ui/button";
import { CAREERS_MEDIA } from "@/data/careers";

/** Closing call-to-action: start a conversation, or read more about the team. */
export function CareersCta() {
  return (
    <ClosingCta
      imageSrc={CAREERS_MEDIA.ctaBg.src}
      overlayClassName="after:bg-[linear-gradient(180deg,rgba(16,16,18,0.74)_0%,rgba(12,12,14,0.86)_100%)]"
      title={
        <>
          Let&rsquo;s build something <Highlight tone="gold">families trust.</Highlight>
        </>
      }
      description={
        <>
          Whether a role above fits or you have something else in mind, we&rsquo;d love to hear from
          you. Say hello and start the conversation.
        </>
      }
    >
      <Button href="/contact" variant="primary">
        Get in touch
      </Button>
      <Button href="/about" variant="ghost">
        Learn about us
      </Button>
    </ClosingCta>
  );
}
