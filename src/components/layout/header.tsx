"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Container } from "@/components/common/container";
import { BOOK_HREF, SIGNIN_HREF, SITE } from "@/constants/site";
import { MAIN_NAV } from "@/data/navigation";
import { accountHref, useSessionSummary } from "@/hooks/use-session-summary";
import { cn } from "@/lib/utils";
import type { NavLink } from "@/types/navigation";

/** Scroll distance after which the header switches to its solid state. */
const SOLID_THRESHOLD = 40;

/**
 * Routes whose hero is light (ivory/soft wash) from the very top. Over these,
 * the not-yet-scrolled header uses dark ink text instead of the white treatment
 * (which would be invisible). Mirrors the source design's `header.onLight`.
 *
 * Any new page that opens on ivory rather than a dark hero image belongs here —
 * `/book` and `/account` have no hero band at all, so they sit straight on the
 * ivory body.
 */
const LIGHT_HERO_ROUTES = [
  "/contact",
  "/privacy",
  "/terms",
  "/cookie-policy",
  "/child-safety",
  "/book",
  "/account",
] as const;

/**
 * Matched as prefixes, so a nested page inherits its parent's treatment —
 * `/account/bookings` is the same ivory shell as `/account` and must not have to
 * be listed twice to be legible.
 */
function hasLightHero(pathname: string): boolean {
  return LIGHT_HERO_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function DesktopNavLink({ link, darkText }: { link: NavLink; darkText: boolean }) {
  return (
    <Link
      href={link.href}
      className={cn(
        "relative whitespace-nowrap py-[6px] text-[15px] font-semibold tracking-[0.005em] no-underline transition-opacity duration-[350ms]",
        "after:absolute after:bottom-0 after:left-0 after:right-full after:h-px after:bg-gold after:transition-[right] after:duration-[400ms] after:ease-brand hover:after:right-0",
        darkText
          ? "text-ink opacity-[0.82] hover:opacity-100"
          : "text-[#F6F3EC] opacity-95 [text-shadow:0_2px_12px_rgba(0,0,0,0.55)] hover:opacity-100",
      )}
    >
      {link.label}
    </Link>
  );
}

/**
 * Fixed site header, shared across every page via the (site) layout. Because
 * that layout persists across client navigations, the header state is re-synced
 * on every route change (scroll position + menu) so nothing stale carries over.
 *
 * Two visual axes:
 *  - `opaque`   → solid ivory bar (scrolled past the hero, or mobile menu open).
 *  - `darkText` → ink text (opaque, or the page has a light hero); otherwise the
 *                 white-over-dark-hero treatment.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  /**
   * Undefined until the probe returns, which renders as signed-out. Fetched
   * rather than read server-side so the marketing pages under `(site)` stay
   * statically rendered — `cookies()` in the layout would deopt all of them.
   */
  const session = useSessionSummary();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SOLID_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Client navigation keeps this component mounted; re-sync to the new page.
    const reset = () => {
      setMenuOpen(false);
      setScrolled(window.scrollY > SOLID_THRESHOLD);
    };
    reset();
  }, [pathname]);

  const isLight = hasLightHero(pathname);
  const opaque = scrolled || menuOpen;
  const darkText = opaque || isLight;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[60] border-b py-[18px] transition-[background-color,border-color,box-shadow] duration-[450ms] ease-in-out",
        opaque
          ? "border-line bg-ivory shadow-[0_8px_30px_-20px_rgba(24,24,24,0.22)]"
          : "border-transparent bg-transparent",
      )}
    >
      <Container className="flex items-center justify-between gap-5">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-[10px] whitespace-nowrap font-serif text-[20px] font-bold tracking-[0.005em] no-underline transition-colors duration-[450ms]",
            darkText
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
            <DesktopNavLink key={link.href} link={link} darkText={darkText} />
          ))}
        </nav>

        <div className="hidden items-center gap-2 min-[1240px]:flex">
          <Link
            href={session?.signedIn ? accountHref(session) : SIGNIN_HREF}
            className={cn(
              "whitespace-nowrap rounded-[40px] px-[18px] py-3 text-[14px] font-semibold tracking-[0.01em] no-underline transition-[background-color,color] duration-[400ms] ease-brand",
              darkText
                ? "text-ink hover:bg-[rgba(var(--slate-rgb),0.06)]"
                : "text-[#F6F3EC] [text-shadow:0_1px_8px_rgba(0,0,0,0.4)] hover:bg-white/10",
            )}
          >
            {session?.signedIn ? session.firstName || "My account" : "Sign in"}
          </Link>

          <Link
            href={BOOK_HREF}
            className={cn(
              "whitespace-nowrap rounded-[40px] border px-[26px] py-3 text-[14px] font-semibold tracking-[0.01em] no-underline transition-all duration-[400ms] ease-brand hover:bg-slate hover:tracking-[0.03em] hover:text-ivory",
              darkText
                ? "border-ink bg-transparent text-ink"
                : "border-white/60 bg-white/[0.14] text-[#F6F3EC] [text-shadow:0_1px_8px_rgba(0,0,0,0.4)]",
            )}
          >
            Book
          </Link>
        </div>

        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
          className={cn(
            "cursor-pointer border-none bg-transparent text-[13px] uppercase tracking-[0.1em] min-[1240px]:hidden",
            darkText ? "text-ink" : "text-[#F6F3EC]",
          )}
        >
          Menu
        </button>
      </Container>

      {menuOpen ? (
        <nav id="mobile-menu" aria-label="Mobile" className="min-[1240px]:hidden">
          <Container className="flex flex-col gap-1 border-t border-line bg-ivory py-4">
            {MAIN_NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-2 text-[15px] font-semibold text-ink no-underline"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={session?.signedIn ? accountHref(session) : SIGNIN_HREF}
              onClick={() => setMenuOpen(false)}
              className="py-2 text-[15px] font-semibold text-ink no-underline"
            >
              {session?.signedIn ? "My account" : "Sign in"}
            </Link>
            <Link
              href={BOOK_HREF}
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-[40px] border border-ink px-[26px] py-3 text-center text-[14px] font-semibold text-ink no-underline"
            >
              Book
            </Link>
          </Container>
        </nav>
      ) : null}
    </header>
  );
}
