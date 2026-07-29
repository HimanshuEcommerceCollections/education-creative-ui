"use client";

import { useState } from "react";

import { Reveal, type RevealDelay } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";
import { OPEN_ROLES, type OpenRole } from "@/data/careers";
import { cn } from "@/lib/utils";

import { CheckIcon, PlusIcon, ROLE_ICONS } from "./careers-icons";

const CHIP =
  "inline-flex items-center gap-[6px] rounded-[20px] px-3 py-[5px] text-[11.5px] font-semibold tracking-[0.02em]";

interface RoleCardProps {
  role: OpenRole;
  open: boolean;
  onToggle: () => void;
}

/**
 * One role: an always-visible header and summary, plus responsibilities that
 * expand from `0fr` to `1fr` — a grid transition rather than the source's fixed
 * max-height, so a longer role can never be clipped.
 */
function RoleCard({ role, open, onToggle }: RoleCardProps) {
  const Icon = ROLE_ICONS[role.icon];
  const buttonId = `role-head-${role.id}`;
  const panelId = `role-body-${role.id}`;

  return (
    <article
      className={cn(
        "overflow-hidden rounded-[18px] border bg-ivory transition-[box-shadow,border-color,transform] duration-[400ms] ease-brand",
        open
          ? "border-[rgba(46,58,115,0.28)] shadow-[0_24px_50px_-28px_rgba(46,58,115,0.4)]"
          : "border-line hover:border-[rgba(46,58,115,0.2)] hover:shadow-[0_20px_44px_-28px_rgba(46,58,115,0.34)]",
      )}
    >
      <button
        type="button"
        id={buttonId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center gap-[22px] border-none bg-transparent px-7 py-[26px] text-left font-sans max-[640px]:flex-wrap max-[640px]:gap-[14px] max-[640px]:px-5 max-[640px]:py-[22px]"
      >
        <span className="min-w-0 flex-1">
          <span className="mb-[10px] block font-serif text-[20px] font-semibold tracking-[-0.01em] text-ink">
            {role.title}
          </span>
          <span className="flex flex-wrap gap-2">
            <span className={cn(CHIP, "bg-[var(--chip-a)] text-slate")}>
              <Icon className="h-3 w-3" />
              {role.department}
            </span>
            <span className={cn(CHIP, "bg-[var(--chip-a)] text-slate")}>{role.location}</span>
            <span className={cn(CHIP, "border border-line text-muted")}>{role.type}</span>
          </span>
        </span>

        <span
          aria-hidden="true"
          className={cn(
            "flex h-10 w-10 flex-none items-center justify-center rounded-full transition-[background-color,color,transform] duration-[400ms] ease-brand motion-reduce:transition-none",
            open ? "rotate-45 bg-slate text-white" : "bg-[var(--chip-a)] text-slate",
          )}
        >
          <PlusIcon className="h-[18px] w-[18px]" />
        </span>
      </button>

      <p className="-mt-[6px] max-w-[70ch] px-7 pb-1 text-[14.5px] leading-[1.6] text-muted max-[640px]:px-5">
        {role.summary}
      </p>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-[500ms] ease-brand motion-reduce:transition-none",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div id={panelId} role="region" aria-labelledby={buttonId} className="overflow-hidden">
          <div className="mt-[18px] border-t border-line px-7 pb-[30px] pt-5 max-[640px]:px-5 max-[640px]:pb-[26px]">
            <h4 className="mb-[14px] font-serif text-[13px] font-semibold uppercase tracking-[0.08em] text-slate">
              What you&rsquo;ll do
            </h4>
            <ul className="mb-6 flex flex-col gap-[11px]">
              {role.responsibilities.map((item) => (
                <li key={item} className="flex gap-3 text-[14.5px] leading-[1.55] text-ink">
                  <CheckIcon className="mt-px h-[18px] w-[18px] flex-none text-gold" />
                  {item}
                </li>
              ))}
            </ul>
            <Button href="/contact" variant="primary">
              Apply for this role
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

/** The roles accordion. Rows open independently, as in the source. */
export function RoleList() {
  const [openIds, setOpenIds] = useState<ReadonlySet<string>>(new Set());

  const toggle = (id: string) => {
    setOpenIds((open) => {
      const next = new Set(open);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  };

  return (
    <div className="mx-auto flex max-w-[940px] flex-col gap-4">
      {OPEN_ROLES.map((role, index) => (
        <Reveal key={role.id} delay={(index + 1) as RevealDelay}>
          <RoleCard
            role={role}
            open={openIds.has(role.id)}
            onToggle={() => toggle(role.id)}
          />
        </Reveal>
      ))}
    </div>
  );
}
