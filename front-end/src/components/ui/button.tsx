"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-syne font-bold cursor-pointer",
    "disabled:pointer-events-none disabled:opacity-40",
    "transition-all duration-[180ms] ease-[ease]",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    "focus-visible:outline-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "bg-accent text-black rounded-[11px] px-[26px] py-[13px]",
          "hover:shadow-[0_5px_22px_rgba(247,147,26,0.3)]",
          "active:scale-[0.97]",
        ].join(" "),
        ghost: [
          "bg-transparent border border-[var(--border)] text-[var(--text-2)] rounded-[11px] px-[26px] py-[13px]",
          "hover:border-[var(--border-hover)] hover:text-[var(--text)]",
          "active:scale-[0.97]",
        ].join(" "),
        outline: [
          "bg-transparent border border-[var(--border)] text-[var(--text-2)] rounded-[11px] px-[26px] py-[13px]",
          "hover:border-[var(--border-hover)] hover:text-[var(--text)]",
          "active:scale-[0.97]",
        ].join(" "),
        destructive: [
          "bg-red text-white rounded-[11px] px-[26px] py-[13px]",
          "hover:opacity-90",
          "active:scale-[0.97]",
        ].join(" "),
        link: "text-accent underline-offset-4 hover:underline p-0",
      },
      size: {
        default: "text-[14px]",
        sm:      "text-[13px] px-4 py-[10px] rounded-[9px]",
        lg:      "text-[16px] px-8 py-[15px]",
        icon:    "h-9 w-9 p-0 rounded-[9px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size:    "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={cn(buttonVariants({ variant, size, className }))}
          {...props}
        />
      );
    }
    return (
      <motion.button
        ref={ref as React.Ref<HTMLButtonElement>}
        whileTap={{ scale: 0.97 }}
        whileHover={variant === "primary" ? { y: -1 } : undefined}
        className={cn(buttonVariants({ variant, size, className }))}
        {...(props as React.ComponentProps<typeof motion.button>)}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
