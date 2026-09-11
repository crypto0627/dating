import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

import { cn } from "@/lib/utils";

/** 打勾 = 蓋一個熊掌印 */
function PawMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g fill="currentColor">
        <ellipse cx="50" cy="67" rx="25" ry="21" />
        <ellipse cx="20" cy="41" rx="9" ry="11" transform="rotate(-22 20 41)" />
        <ellipse cx="38" cy="26" rx="9" ry="11.5" transform="rotate(-8 38 26)" />
        <ellipse cx="62" cy="26" rx="9" ry="11.5" transform="rotate(8 62 26)" />
        <ellipse cx="80" cy="41" rx="9" ry="11" transform="rotate(22 80 41)" />
      </g>
    </svg>
  );
}

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-input size-5 shrink-0 rounded-lg border bg-white/80 shadow-sm transition-all outline-none",
        "focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-[3px]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:border-transparent data-[state=checked]:bg-[linear-gradient(135deg,#ff9dc2_0%,#ef5b8f_50%,#d62d63_100%)] data-[state=checked]:text-white",
        "dark:bg-white/10",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="animate-pop-in flex items-center justify-center text-current"
      >
        <PawMark className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
