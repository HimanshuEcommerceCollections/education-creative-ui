import type { ReactNode } from "react";

import { Container } from "@/components/common/container";

interface SectionProps {
  children: ReactNode;
  id?: string;
  /** Classes for the outer <section> (spacing, background, positioning). */
  className?: string;
  /** Classes for the inner Container, when `container` is enabled. */
  containerClassName?: string;
  /**
   * Wrap children in a Container. Enabled by default; disable for sections
   * that place elements outside the centered wrap (e.g. full-bleed media,
   * ghost text, edge-to-edge marquees).
   */
  container?: boolean;
}

/** Semantic <section> wrapper that optionally applies the standard Container. */
export function Section({
  children,
  id,
  className,
  containerClassName,
  container = true,
}: SectionProps) {
  return (
    <section id={id} className={className}>
      {container ? (
        <Container className={containerClassName}>{children}</Container>
      ) : (
        children
      )}
    </section>
  );
}
