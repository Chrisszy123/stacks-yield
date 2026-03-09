"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-syne font-[800] cursor-pointer select-none",
    "disabled:pointer-events-none disabled:opacity-40",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    "focus-visible:outline-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:     "text-[15px] rounded-[11px] px-8 py-[14px] tracking-[0.01em] border-none",
        ghost:       "text-[15px] rounded-[11px] px-8 py-[14px] tracking-[0.01em]",
        outline:     "text-[14px] rounded-[11px] px-[22px] py-[11px]",
        destructive: "text-[14px] rounded-[11px] px-[22px] py-[11px]",
        link:        "text-[14px] p-0 underline-offset-4",
      },
      size: {
        default: "",
        sm:  "!text-[13px] !px-4 !py-[9px] !rounded-[9px]",
        lg:  "!text-[16px] !px-10 !py-[16px]",
        icon:"!h-9 !w-9 !p-0 !rounded-[9px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size:    "default",
    },
  }
);

const INITIAL_STYLE: Record<string, React.CSSProperties> = {
  primary: {
    background:  "#f7931a",
    color:       "#ffffff",
    boxShadow:   "none",
    transition:  "background 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
  },
  ghost: {
    background:  "transparent",
    borderWidth: "1.5px",
    borderStyle: "solid",
    borderColor: "rgba(255,255,255,0.18)",
    color:       "#edecf2",
    transition:  "all 0.18s ease",
  },
  outline: {
    background:  "transparent",
    borderWidth: "1.5px",
    borderStyle: "solid",
    borderColor: "rgba(255,255,255,0.18)",
    color:       "#edecf2",
    transition:  "all 0.18s ease",
  },
  destructive: {
    background: "var(--red)",
    color:      "#fff",
    transition: "all 0.18s ease",
  },
  link: {
    color:      "var(--accent)",
    transition: "color 0.18s ease",
  },
};

function applyHover(el: HTMLElement, variant: string) {
  if (variant === "primary") {
    el.style.background  = "#ffaa47";
    el.style.boxShadow   = "0 8px 28px rgba(247,147,26,0.40)";
    el.style.transform   = "translateY(-2px)";
  } else if (variant === "ghost" || variant === "outline") {
    el.style.background  = "rgba(255,255,255,0.05)";
    el.style.borderColor = "rgba(255,255,255,0.28)";
    el.style.boxShadow   = "0 4px 16px rgba(0,0,0,0.25)";
  } else if (variant === "destructive") {
    el.style.opacity = "0.88";
  }
}

function resetHover(el: HTMLElement, variant: string) {
  if (variant === "primary") {
    el.style.background  = "#f7931a";
    el.style.boxShadow   = "none";
    el.style.transform   = "";
  } else if (variant === "ghost" || variant === "outline") {
    el.style.background  = "transparent";
    el.style.borderColor = "rgba(255,255,255,0.18)";
    el.style.boxShadow   = "none";
  } else if (variant === "destructive") {
    el.style.opacity = "1";
  }
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size,
      asChild = false,
      style: externalStyle,
      onMouseEnter: extEnter,
      onMouseLeave: extLeave,
      ...props
    },
    ref
  ) => {
    const v = variant ?? "primary";
    const baseStyle: React.CSSProperties = { ...(INITIAL_STYLE[v] ?? {}), ...externalStyle };

    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={cn(buttonVariants({ variant, size, className }))}
          style={baseStyle}
          {...props}
        />
      );
    }

    return (
      <motion.button
        ref={ref as React.Ref<HTMLButtonElement>}
        whileTap={{ scale: 0.97 }}
        className={cn(buttonVariants({ variant, size, className }))}
        style={baseStyle}
        onMouseEnter={(e) => {
          applyHover(e.currentTarget as HTMLElement, v);
          extEnter?.(e as React.MouseEvent<HTMLButtonElement>);
        }}
        onMouseLeave={(e) => {
          resetHover(e.currentTarget as HTMLElement, v);
          extLeave?.(e as React.MouseEvent<HTMLButtonElement>);
        }}
        {...(props as React.ComponentProps<typeof motion.button>)}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
