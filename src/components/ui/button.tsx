import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 select-none active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_10px_30px_-10px_rgba(214,45,99,0.65)] hover:brightness-105",
        /** 熊抱哥主按鈕：草莓漸層 */
        bear: "text-white shadow-[0_14px_38px_-12px_rgba(214,45,99,0.78)] bg-[linear-gradient(135deg,#ff9dc2_0%,#ef5b8f_48%,#d62d63_100%)] hover:brightness-[1.06]",
        /** 蜂蜜色副按鈕 */
        honey:
          "text-[#7a4310] shadow-[0_12px_30px_-14px_rgba(200,130,40,0.7)] bg-[linear-gradient(135deg,#ffe1ad_0%,#ffcb7d_52%,#f7b25a_100%)] hover:brightness-[1.04]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:brightness-105",
        outline:
          "border border-border bg-white/70 backdrop-blur-md shadow-sm hover:bg-white/90 dark:bg-white/10 dark:hover:bg-white/15",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:brightness-[0.98]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2 has-[>svg]:px-4",
        sm: "h-9 gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-13 px-8 text-base has-[>svg]:px-6",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
