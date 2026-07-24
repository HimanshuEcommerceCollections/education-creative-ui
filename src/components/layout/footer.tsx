import Image from "next/image";

import { Container } from "@/components/common/container";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { SOCIAL_ICONS } from "@/components/layout/social-icons";
import { SITE } from "@/constants/site";
import { FOOTER_NAV, SOCIAL_LINKS } from "@/data/navigation";

export function Footer() {
  const groups = FOOTER_NAV;

  return (
    <footer className="bg-slate-deep pb-[34px] pt-20 text-[rgba(244,241,234,0.7)]">
      <Container>
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-10 border-b border-[rgba(244,241,234,0.14)] pb-[50px] max-[900px]:grid-cols-2 max-[520px]:grid-cols-1">
          <div>
            <div className="mb-[14px] flex items-center gap-[10px]">
              <Image
                src="/assets/brand/logo-mark-bare.svg"
                alt=""
                width={32}
                height={32}
                unoptimized
                className="h-8 w-8 shrink-0"
              />
              <span className="font-serif text-2xl text-ivory">{SITE.name}</span>
            </div>
            <p className="mb-5 max-w-[280px] text-sm leading-[1.6]">
              {SITE.tagline}
            </p>
            <NewsletterForm />
          </div>

          {groups.map((group) => (
            <div key={group.title}>
              <h2 className="mb-[18px] text-[12px] font-semibold uppercase tracking-[0.14em] text-ivory">
                {group.title}
              </h2>
              {group.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="mb-3 block text-[14.5px] text-[rgba(244,241,234,0.66)] no-underline transition-colors hover:text-ivory"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-[30px]">
          <div className="flex gap-4">
            {SOCIAL_LINKS.map((social) => {
              const Icon = SOCIAL_ICONS[social.icon];
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.ariaLabel}
                  className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-[rgba(244,241,234,0.24)] text-[rgba(244,241,234,0.7)] no-underline transition-all hover:bg-[rgba(244,241,234,0.12)] hover:text-white"
                >
                  <Icon className="h-[17px] w-[17px]" />
                </a>
              );
            })}
          </div>

          <p className="text-[11px] text-[rgba(244,241,234,0.4)]">
            Demo — sample content, synthetic data, no student records collected.
            © 2026 {SITE.name}. &nbsp;·&nbsp;{" "}
            <a href="/privacy" className="text-inherit">
              Privacy Policy
            </a>
            &nbsp;·&nbsp;{" "}
            <a href="/terms" className="text-inherit">
              Terms
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
