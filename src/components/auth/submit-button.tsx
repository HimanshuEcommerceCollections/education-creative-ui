"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SubmitButtonProps {
  children: React.ReactNode;
  /** Replaces the label while the action is in flight. */
  pendingLabel: string;
  className?: string;
}

/**
 * Submit button that reads its own pending state from the enclosing form via
 * `useFormStatus`, so no form has to thread an `isSubmitting` flag down.
 *
 * Disabling during submission is what stops a double-signup: two POSTs racing
 * would both clear the email pre-check and one would die on the unique index.
 *
 * The pending styles use `disabled:` modifiers rather than conditional classes
 * because `cn` doesn't de-duplicate Tailwind conflicts — a bare `cursor-wait`
 * would tie with the base `cursor-pointer` and resolve by stylesheet order.
 * The `:disabled` pseudo-class gives these the specificity to actually win.
 */
export function SubmitButton({ children, pendingLabel, className }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={cn(
        "w-full disabled:cursor-wait disabled:opacity-70",
        "disabled:hover:translate-y-0 disabled:hover:tracking-[0.01em] disabled:hover:shadow-none",
        className,
      )}
    >
      {pending ? pendingLabel : children}
    </Button>
  );
}
