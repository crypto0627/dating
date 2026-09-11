import * as React from "react";

import { cn } from "@/lib/utils";

function Ear({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("size-16", className)} aria-hidden="true">
      <circle cx="20" cy="20" r="19" fill="var(--bear-fur)" />
      <circle cx="20" cy="21" r="10.5" fill="var(--bear-inner)" opacity="0.9" />
    </svg>
  );
}

/**
 * 長了熊耳朵的玻璃卡片。
 * 耳朵用 z-index 疊在卡片後面，所以只會露出上緣那一半。
 */
export function BearCard({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section className={cn("relative", className)} {...props}>
      <span
        className="pointer-events-none absolute -top-9 right-0 left-0 z-0 flex justify-between px-10"
        aria-hidden="true"
      >
        <Ear className="-rotate-12 drop-shadow-[0_-2px_6px_rgba(214,45,99,0.28)]" />
        <Ear className="rotate-12 drop-shadow-[0_-2px_6px_rgba(214,45,99,0.28)]" />
      </span>

      <div className="glass-card relative z-10 rounded-[1.75rem] p-5 sm:p-6">
        {children}
      </div>
    </section>
  );
}
