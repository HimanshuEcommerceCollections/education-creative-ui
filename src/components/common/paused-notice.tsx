import Link from "next/link";
import type { ReactNode } from "react";

/**
 * What a visitor sees where a form would be, when an admin has switched that
 * entry point off in site configuration.
 *
 * Written once because the three surfaces it covers — booking, applications,
 * reviews — are otherwise three people's guesses at the same sentence. The shape
 * of the page is kept: the heading, the framing copy and the reasons to be here
 * all stay, and only the control that can't accept anything is replaced. A page
 * that vanishes reads as broken; a page that explains itself reads as closed.
 *
 * Deliberately not styled as an error. Nothing has gone wrong — a switch is off,
 * usually for an afternoon.
 */
export function PausedNotice({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  /** Where to send someone who can't wait. Defaults to the contact page. */
  action?: { href: string; label: string };
}) {
  const link = action ?? { href: "/contact", label: "Send us a message" };

  return (
    <div
      role="status"
      className="rounded-[18px] border-[1.5px] border-dashed border-line bg-white px-7 py-8 max-[560px]:px-5 max-[560px]:py-6"
    >
      <h2 className="font-serif text-[21px] font-semibold tracking-[-0.01em] text-ink">
        {title}
      </h2>
      <p className="mt-3 max-w-[58ch] text-[15px] leading-[1.65] text-muted">
        {children}
      </p>
      <Link
        href={link.href}
        className="mt-6 inline-flex items-center rounded-[40px] border-[1.5px] border-transparent bg-slate px-[22px] py-[11px] text-[13.5px] font-semibold text-white transition-colors hover:bg-slate-deep"
      >
        {link.label}
      </Link>
    </div>
  );
}
