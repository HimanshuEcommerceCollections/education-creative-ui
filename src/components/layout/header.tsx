"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Container } from "@/components/common/container";
import { BOOK_HREF, SIGNIN_HREF, SITE } from "@/constants/site";
import { MAIN_NAV } from "@/data/navigation";
import { cn } from "@/lib/utils";
import type { NavLink } from "@/types/navigation";

/** Scroll distance after which the header switches to its solid state. */
const SOLID_THRESHOLD = 40;

function DesktopNavLink({ link, solid }: { link: NavLink; solid: boolean }) {
  return (
    <a
      href={link.href}
      className={cn(
        "relative whitespace-nowrap py-[6px] text-[15px] font-semibold tracking-[0.005em] no-underline transition-opacity duration-[350ms]",
        "after:absolute after:bottom-0 after:left-0 after:right-full after:h-px after:bg-gold after:transition-[right] after:duration-[400ms] after:ease-[cubic-bezier(0.16,0.7,0.2,1)] hover:after:right-0",
        solid
          ? "text-ink opacity-[0.82] hover:opacity-100"
          : "text-[#F6F3EC] opacity-95 [text-shadow:0_2px_12px_rgba(0,0,0,0.55)] hover:opacity-100",
      )}
    >
      {link.label}
    </a>
  );
}

/**
 * Fixed site header: transparent over the hero, solid once scrolled. One
 * navigation set (the canonical `MAIN_NAV`) is shared across every page.
 */
export function Header() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > SOLID_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[60] border-b py-[18px] transition-[background-color,border-color,box-shadow] duration-[450ms] ease-in-out",
        solid
          ? "border-line bg-ivory shadow-[0_8px_30px_-20px_rgba(24,24,24,0.22)]"
          : "border-transparent bg-transparent",
      )}
    >
      <Container className="flex items-center justify-between gap-5">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-[10px] whitespace-nowrap font-serif text-[20px] font-bold tracking-[0.005em] no-underline transition-colors duration-[450ms]",
            solid
              ? "text-ink"
              : "text-[#F6F3EC] [text-shadow:0_2px_12px_rgba(0,0,0,0.5)]",
          )}
        >
          <Image
            src="/assets/brand/logo-mark.svg"
            alt=""
            width={32}
            height={32}
            priority
            unoptimized
            className="h-8 w-8 shrink-0"
          />
          {SITE.name}
        </Link>

        <nav
          aria-label="Primary"
          className="hidden flex-1 justify-center gap-[22px] min-[1240px]:flex min-[1360px]:gap-[32px]"
        >
          {MAIN_NAV.map((link) => (
            <DesktopNavLink key={link.href} link={link} solid={solid} />
          ))}
        </nav>

        <div className="hidden items-center gap-2 min-[1240px]:flex">
          <Link
            href={SIGNIN_HREF}
            className={cn(
              "whitespace-nowrap rounded-[40px] px-[18px] py-3 text-[14px] font-semibold tracking-[0.01em] no-underline transition-[background-color,color] duration-[400ms] ease-[cubic-bezier(0.16,0.7,0.2,1)]",
              solid
                ? "text-ink hover:bg-[rgba(var(--slate-rgb),0.06)]"
                : "text-[#F6F3EC] [text-shadow:0_1px_8px_rgba(0,0,0,0.4)] hover:bg-white/10",
            )}
          >
            Sign in
          </Link>

          <a
            href={BOOK_HREF}
            className={cn(
              "whitespace-nowrap rounded-[40px] border px-[26px] py-3 text-[14px] font-semibold tracking-[0.01em] no-underline transition-all duration-[400ms] ease-[cubic-bezier(0.16,0.7,0.2,1)] hover:bg-slate hover:tracking-[0.03em] hover:text-ivory",
              solid
                ? "border-ink bg-transparent text-ink"
                : "border-white/60 bg-white/[0.14] text-[#F6F3EC] [text-shadow:0_1px_8px_rgba(0,0,0,0.4)]",
            )}
          >
            Book
          </a>
        </div>

        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
          className={cn(
            "cursor-pointer border-none bg-transparent text-[13px] uppercase tracking-[0.1em] min-[1240px]:hidden",
            solid ? "text-ink" : "text-[#F6F3EC]",
          )}
        >
          Menu
        </button>
      </Container>

      {menuOpen ? (
        <nav id="mobile-menu" aria-label="Mobile" className="min-[1240px]:hidden">
          <Container className="flex flex-col gap-1 border-t border-line bg-ivory py-4">
            {MAIN_NAV.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-2 text-[15px] font-semibold text-ink no-underline"
              >
                {link.label}
              </a>
            ))}
            <Link
              href={SIGNIN_HREF}
              onClick={() => setMenuOpen(false)}
              className="py-2 text-[15px] font-semibold text-ink no-underline"
            >
              Sign in
            </Link>
            <a
              href={BOOK_HREF}
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-[40px] border border-ink px-[26px] py-3 text-center text-[14px] font-semibold text-ink no-underline"
            >
              Book
            </a>
          </Container>
        </nav>
      ) : null}
    </header>
  );
}
