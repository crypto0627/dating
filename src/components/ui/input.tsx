import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground/70 selection:bg-primary selection:text-primary-foreground border-input flex h-12 w-full min-w-0 rounded-2xl border bg-white/70 px-4 py-1 text-base shadow-sm transition-[color,box-shadow,background-color] outline-none backdrop-blur-md file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/10",
        "focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-[3px] focus-visible:bg-white/90",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/25",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
