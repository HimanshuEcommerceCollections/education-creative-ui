import { cn } from "@/lib/utils";

interface FormAlertProps {
  /** Nothing renders when absent, so callers don't need to branch. */
  message?: string;
  tone?: "error" | "success";
  className?: string;
}

/**
 * Form-level message — the failures that aren't about one field (bad
 * credentials, a locked account, the API being unreachable).
 *
 * `role="alert"` so a screen reader announces it when the action returns; the
 * inline per-field messages are wired through `aria-describedby` instead.
 */
export function FormAlert({ message, tone = "error", className }: FormAlertProps) {
  if (!message) return null;

  return (
    <p
      role="alert"
      className={cn(
        "mb-4 rounded-[12px] border-[1.5px] px-4 py-3 text-[13.5px] leading-[1.5]",
        tone === "error"
          ? "border-[rgba(194,72,60,0.35)] bg-[rgba(194,72,60,0.07)] text-[#a63a30]"
          : "border-[rgba(46,58,115,0.25)] bg-[rgba(var(--slate-rgb),0.05)] text-slate",
        className,
      )}
    >
      {message}
    </p>
  );
}
