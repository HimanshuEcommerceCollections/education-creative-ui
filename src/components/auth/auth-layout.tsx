import Link from "next/link";
import type { ReactNode } from "react";

import { Reveal } from "@/components/common/reveal";
import { Section } from "@/components/common/section";
import type { AuthPanel } from "@/data/auth";
import { cn } from "@/lib/utils";

import { BrandPanel } from "./brand-panel";

interface AuthLayoutProps {
  /** Current page label for the breadcrumb (e.g. "Sign in"). */
  crumb: string;
  panel: AuthPanel;
  /** Form-panel contents: inner form plus the success overlay and confetti. */
  children: ReactNode;
  /** Place the brand panel on the right (sign-up) instead of the left. */
  reverse?: boolean;
}

/**
 * Split auth card — brand panel beside the form — centered in its own full-height
 * canvas. Auth routes live in the `(auth)` route group, which deliberately omits
 * the shared site header and footer. The form panel is the positioning context
 * for its success overlay.
 */
export function AuthLayout({ crumb, panel, children, reverse }: AuthLayoutProps) {
  return (
    <main>
      <Section className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-ivory bg-[radial-gradient(120%_90%_at_80%_8%,rgba(46,58,115,0.11)_0%,rgba(46,58,115,0)_55%),radial-gradient(90%_80%_at_4%_96%,rgba(210,162,65,0.13),rgba(210,162,65,0)_58%)] py-[72px]">
        <Reveal>
          <nav
            aria-label="Breadcrumb"
            className="mx-auto mb-6 flex max-w-[1060px] items-center gap-[9px] text-[12.5px] font-semibold text-muted"
          >
            <Link href="/" className="text-muted transition-colors hover:text-slate">
              Home
            </Link>
            <span aria-hidden="true" className="opacity-45">
              /
            </span>
            <b className="font-semibold text-ink">{crumb}</b>
          </nav>
        </Reveal>

        <Reveal delay={1}>
          <div className="mx-auto grid max-w-[1060px] grid-cols-1 overflow-hidden rounded-[28px] border border-line bg-white shadow-[0_50px_100px_-50px_rgba(22,24,29,0.5)] min-[900px]:grid-cols-2">
            <BrandPanel panel={panel} className={cn(reverse && "min-[900px]:order-2")} />
            <div
              className={cn(
                "relative flex items-center justify-center p-12 max-[560px]:p-7",
                reverse && "min-[900px]:order-1",
              )}
            >
              {children}
            </div>
          </div>
        </Reveal>
      </Section>
    </main>
  );
}
