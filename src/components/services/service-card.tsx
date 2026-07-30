import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon, SERVICE_ICONS } from "@/components/services/service-icons";
import type { ServiceItem } from "@/data/services";

/**
 * A subject card on the Services hub: a photo that bleeds to the card edges, an
 * icon chip straddling the seam below it, then copy and a footer carrying the
 * starting rate and the link into the subject page.
 */
export function ServiceCard({ service }: { service: ServiceItem }) {
  const Icon = SERVICE_ICONS[service.icon];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-line bg-white px-7 pb-[30px] shadow-[0_24px_50px_-40px_rgba(24,24,24,0.3)] transition-[transform,box-shadow,border-color] duration-[400ms] ease-brand hover:-translate-y-[6px] hover:border-[rgba(46,58,115,0.24)] hover:shadow-[0_34px_66px_-34px_rgba(46,58,115,0.4)]">
      <div className="relative -mx-7 h-[186px] overflow-hidden bg-sand after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(16,16,18,0)_46%,rgba(16,16,18,0.34)_100%)] after:content-['']">
        <Image
          src={service.image.src}
          alt={service.image.alt}
          fill
          sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
          className="object-cover transition-transform duration-[600ms] ease-brand group-hover:scale-[1.06]"
        />
      </div>

      <div className="relative z-[2] -mt-11 mb-5 flex h-[54px] w-[54px] items-center justify-center rounded-[15px] border-[3px] border-white bg-white text-slate shadow-[0_12px_26px_-12px_rgba(24,24,24,0.55)] transition-[transform,background-color,color] duration-[450ms] ease-brand group-hover:-rotate-[4deg] group-hover:scale-[1.08] group-hover:bg-slate group-hover:text-white">
        <Icon className="h-[26px] w-[26px]" />
      </div>

      <h3 className="mb-[9px] font-serif text-[20px] font-semibold tracking-[-0.01em]">
        {service.title}
      </h3>
      <p className="mb-[18px] text-[14.5px] leading-[1.6] text-muted">
        {service.description}
      </p>

      <div className="mt-auto flex items-center justify-between border-t border-line pt-4">
        <span className="font-serif text-[15px] font-bold text-ink">
          from {service.rateFrom}
          <i className="font-sans text-[11.5px] font-semibold not-italic text-muted">
            /hr
          </i>
        </span>
        <Link
          href={service.href}
          className="inline-flex items-center gap-[6px] text-[13.5px] font-bold text-slate transition-[gap,color] duration-300 group-hover:gap-[11px] group-hover:text-gold"
        >
          Explore
          <ArrowRightIcon className="h-[15px] w-[15px]" />
        </Link>
      </div>
    </article>
  );
}
