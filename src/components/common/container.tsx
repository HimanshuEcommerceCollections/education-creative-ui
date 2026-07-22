import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * The source `.wrap`: centered, max-width 1320px, 44px side padding that
 * narrows to 22px below 760px.
 */
export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1320px] px-[22px] min-[760px]:px-11",
        className,
      )}
    >
      {children}
    </div>
  );
}
