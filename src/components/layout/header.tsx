"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Container } from "@/components/common/container";
import { BOOK_HREF, SITE } from "@/constants/site";
import { MAIN_NAV, SITE_NAV } from "@/data/navigation";
import { cn } from "@/lib/utils";
import type { NavLink } from "@/types/navigation";

/** Scroll distance after which the header switches to its solid state. */
const SOLID_THRESHOLD = 40;

/** Which site-nav entry is "current" for a given route (subjects live under Browse). */
function activeHref(pathname: string): string | null {
  if (pathname === "/") return null;
  if (pathname.startsWith("/subjects")) return "/browse";
  const match = SITE_NAV.find(
    (link) => link.href !== "/" && pathname.startsWith(link.href),
  );
  return match?.href ?? null;
}

function DesktopNavLink({
  link,
  solid,
  current,
}: {
  link: NavLink;
  solid: boolean;
  current: boolean;
}) {
  return (
    <a
      href={link.href}
      aria-current={current ? "page" : undefined}
      className={cn(
        "relative py-[6px] text-[15px] font-semibold tracking-[0.005em] no-underline transition-opacity duration-[350ms]",
        "after:absolute after:bottom-0 after:left-0 after:h-px after:bg-gold after:transition-[right] after:duration-[400ms] after:ease-[cubic-bezier(0.16,0.7,0.2,1)]",
        current ? "after:right-0" : "after:right-full hover:after:right-0",
        solid
          ? current
            ? "text-slate opacity-100"
            : "text-ink opacity-[0.82] hover:opacity-100"
          : current
            ? "text-gold opacity-100 [text-shadow:0_2px_12px_rgba(0,0,0,0.55)]"
            : "text-[#F6F3EC] opacity-95 [text-shadow:0_2px_12px_rgba(0,0,0,0.55)] hover:opacity-100",
      )}
    >
      {link.label}
    </a>
  );
}

/**
 * Fixed site header: transparent over the hero, solid once scrolled. Adapts
 * its navigation to the route — section anchors on the one-page home, site
 * routes (with a current-page highlight) elsewhere.
 */
export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const nav = isHome ? MAIN_NAV : SITE_NAV;
  const homeHref = isHome ? "#top" : "/";
  const bookHref = isHome ? BOOK_HREF : "/contact";
  const current = isHome ? null : activeHref(pathname);

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
        <a
          href={homeHref}
          className={cn(
            "flex items-center gap-[10px] whitespace-nowrap font-serif text-[20px] font-bold tracking-[0.005em] no-underline transition-colors duration-[450ms]",
            solid
              ? "text-ink"
              : "text-[#F6F3EC] [text-shadow:0_2px_12px_rgba(0,0,0,0.5)]",
          )}
        >
          <span className="h-2 w-2 shrink-0 translate-y-px rounded-full bg-gold" />
          {SITE.name}
        </a>

        <nav
          aria-label="Primary"
          className="hidden flex-1 justify-center gap-[38px] min-[1081px]:flex"
        >
          {nav.map((link) => (
            <DesktopNavLink
              key={link.href}
              link={link}
              solid={solid}
              current={link.href === current}
            />
          ))}
        </nav>

        <a
          href={bookHref}
          className={cn(
            "hidden whitespace-nowrap rounded-[40px] border px-[26px] py-3 text-[14px] font-semibold tracking-[0.01em] no-underline transition-all duration-[400ms] ease-[cubic-bezier(0.16,0.7,0.2,1)] hover:bg-slate hover:tracking-[0.03em] hover:text-ivory min-[1081px]:inline-block",
            solid
              ? "border-ink bg-transparent text-ink"
              : "border-white/60 bg-white/[0.14] text-[#F6F3EC] [text-shadow:0_1px_8px_rgba(0,0,0,0.4)]",
          )}
        >
          Book
        </a>

        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
          className={cn(
            "cursor-pointer border-none bg-transparent text-[13px] uppercase tracking-[0.1em] min-[1081px]:hidden",
            solid ? "text-ink" : "text-[#F6F3EC]",
          )}
        >
          Menu
        </button>
      </Container>

      {menuOpen ? (
        <nav id="mobile-menu" aria-label="Mobile" className="min-[1081px]:hidden">
          <Container className="flex flex-col gap-1 border-t border-line bg-ivory py-4">
            {nav.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={link.href === current ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "py-2 text-[15px] font-semibold no-underline",
                  link.href === current ? "text-slate" : "text-ink",
                )}
              >
                {link.label}
              </a>
            ))}
            <a
              href={bookHref}
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
