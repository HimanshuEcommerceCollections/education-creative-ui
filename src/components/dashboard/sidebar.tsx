"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import type { UserRole } from "@contracts/roles.ts";

import { SITE } from "@/constants/site";
import { type DashboardNavSection, visibleSections } from "@/data/dashboard-nav";
import { cn } from "@/lib/utils";

import { DASHBOARD_ICONS } from "./dashboard-icons";

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrator",
  coordinator: "Coordinator",
  educator: "Educator",
  customer: "Parent",
};

interface SidebarProps {
  sections: DashboardNavSection[];
  role: UserRole;
  fullName: string;
  email: string;
  /** Rendered at the foot of the sidebar — the sign-out form. */
  footer: React.ReactNode;
}

/**
 * Dashboard sidebar: brand, role badge, grouped navigation, and the signed-in
 * identity.
 *
 * A Client Component because the active item is derived from `usePathname` and
 * the mobile drawer needs local open state. The nav data itself is resolved on
 * the server and passed in already filtered for this role, so an item the role
 * can't see never reaches the browser.
 */
export function Sidebar({ sections, role, fullName, email, footer }: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const sections_ = visibleSections(sections, role);

  // Prevent the page behind the drawer from scrolling while it's open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      {/* Mobile bar — the drawer trigger, plus the brand so there's always a way home. */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-ivory px-5 py-3 min-[1000px]:hidden">
        <Link
          href="/"
          className="flex items-center gap-[9px] font-serif text-[17px] font-bold text-ink no-underline"
        >
          <Image
            src="/assets/brand/logo-mark.svg"
            alt=""
            width={26}
            height={26}
            unoptimized
            className="h-[26px] w-[26px]"
          />
          {SITE.name}
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="dashboard-sidebar"
          className="rounded-[30px] border-[1.5px] border-line px-[15px] py-2 text-[12.5px] font-semibold uppercase tracking-[0.08em] text-ink"
        >
          Menu
        </button>
      </div>

      {open ? (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-[rgba(20,20,22,0.45)] min-[1000px]:hidden"
        />
      ) : null}

      <aside
        id="dashboard-sidebar"
        className={cn(
          "z-50 flex w-[268px] shrink-0 flex-col border-r border-[rgba(255,255,255,0.08)] bg-ink-deep text-[#e9e7e1]",
          // Desktop: a sticky full-height column. Mobile: an off-canvas drawer.
          "min-[1000px]:sticky min-[1000px]:top-0 min-[1000px]:h-screen",
          "max-[999px]:fixed max-[999px]:inset-y-0 max-[999px]:left-0 max-[999px]:w-[290px]",
          "max-[999px]:transition-transform max-[999px]:duration-300 max-[999px]:ease-brand",
          open ? "max-[999px]:translate-x-0" : "max-[999px]:-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-6 pb-5 pt-6">
          <Link
            href="/"
            className="flex items-center gap-[10px] font-serif text-[17px] font-bold tracking-[0.005em] text-white no-underline"
          >
            <Image
              src="/assets/brand/logo-mark.svg"
              alt=""
              width={28}
              height={28}
              unoptimized
              className="h-7 w-7 shrink-0"
            />
            {SITE.name}
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
            className="text-[20px] leading-none text-[#b9b6ad] min-[1000px]:hidden"
          >
            &times;
          </button>
        </div>

        <p className="mx-6 mb-6 inline-flex w-fit rounded-[30px] border border-[rgba(210,162,65,0.4)] bg-[rgba(210,162,65,0.14)] px-[13px] py-[5px] text-[11px] font-bold uppercase tracking-[0.1em] text-gold">
          {ROLE_LABELS[role]}
        </p>

        <nav aria-label="Dashboard" className="flex-1 overflow-y-auto px-3 pb-4">
          {sections_.map((section) => (
            <div key={section.title} className="mb-6 last:mb-0">
              <h2 className="mb-2 px-3 text-[10.5px] font-bold uppercase tracking-[0.13em] text-[#8d8a82]">
                {section.title}
              </h2>
              <ul className="flex flex-col gap-[2px]">
                {section.items.map((item) => {
                  const Icon = DASHBOARD_ICONS[item.icon];
                  // Exact match for section roots so /dashboard doesn't stay lit
                  // while a child page is open.
                  const active =
                    pathname === item.href ||
                    (item.href !== "/dashboard" &&
                      item.href !== "/educator" &&
                      pathname.startsWith(`${item.href}/`));

                  if (item.phase) {
                    return (
                      <li key={item.href}>
                        <span
                          aria-disabled="true"
                          title={`Not built yet — ${item.phase}`}
                          className="flex cursor-not-allowed items-center gap-[11px] rounded-[11px] px-3 py-[9px] text-[14px] font-medium text-[#6f6d67]"
                        >
                          <Icon className="h-[18px] w-[18px] shrink-0" />
                          <span className="flex-1 truncate">{item.label}</span>
                          <span className="shrink-0 rounded-[20px] bg-[rgba(255,255,255,0.07)] px-[7px] py-[2px] text-[9.5px] font-bold uppercase tracking-[0.06em]">
                            {item.phase.replace("Phase ", "P")}
                          </span>
                        </span>
                      </li>
                    );
                  }

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        // Closed here rather than in an effect on `pathname`: the
                        // layout persists across navigations, so reacting to the
                        // result would mean setState inside an effect.
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-[11px] rounded-[11px] px-3 py-[9px] text-[14px] font-semibold no-underline transition-[background-color,color] duration-200",
                          active
                            ? "bg-[rgba(210,162,65,0.16)] text-gold"
                            : "text-[#d6d3cb] hover:bg-[rgba(255,255,255,0.06)] hover:text-white",
                        )}
                      >
                        <Icon className="h-[18px] w-[18px] shrink-0" />
                        <span className="flex-1 truncate">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-[rgba(255,255,255,0.09)] px-6 py-5">
          <p className="truncate text-[13.5px] font-semibold text-white">{fullName}</p>
          <p className="mb-4 truncate text-[12px] text-[#918e86]">{email}</p>
          {footer}
          <Link
            href="/"
            className="mt-3 inline-block text-[12px] font-semibold text-[#918e86] no-underline transition-colors hover:text-gold"
          >
            &larr; Back to site
          </Link>
        </div>
      </aside>
    </>
  );
}
