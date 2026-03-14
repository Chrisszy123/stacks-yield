"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "ghost" | "icon-ghost" | "outline" | "destructive" | "link";
type ButtonSize    = "sm" | "md" | "lg" | "default" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:   ButtonVariant;
  size?:      ButtonSize;
  loading?:   boolean;
  fullWidth?: boolean;
  asChild?:   boolean;
}

const SIZE_CLASSES: Record<string, string> = {
  sm:      "text-[13px] px-4 py-[9px] rounded-[9px]",
  md:      "text-[15px] px-8 py-[14px] rounded-btn",
  lg:      "text-[16px] px-10 py-[16px] rounded-btn",
  default: "text-[15px] px-8 py-[14px] rounded-btn",
  icon:    "h-9 w-9 p-0 rounded-[9px]",
};

const BASE_STYLES: Record<string, React.CSSProperties> = {
  primary: {
    background:  "#f7931a",
    color:       "#ffffff",
    border:      "none",
    transition:  "background 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
  },
  ghost: {
    background:  "transparent",
    borderWidth: "1.5px",
    borderStyle: "solid",
    borderColor: "rgba(255,255,255,0.14)",
    color:       "var(--text-2)",
    transition:  "all 0.18s ease",
  },
  "icon-ghost": {
    background:  "var(--accent-dim)",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "var(--border-accent)",
    color:       "var(--accent)",
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
    border:     "none",
    transition: "all 0.18s ease",
  },
  link: {
    background:  "transparent",
    border:      "none",
    color:       "var(--accent)",
    padding:     "0",
    transition:  "color 0.18s ease",
  },
};

function applyHover(el: HTMLElement, variant: string) {
  if (variant === "primary") {
    el.style.background = "#ffaa47";
    el.style.boxShadow  = "0 8px 28px rgba(247,147,26,0.40)";
    el.style.transform  = "translateY(-2px)";
  } else if (variant === "ghost" || variant === "outline") {
    el.style.background  = "rgba(255,255,255,0.05)";
    el.style.borderColor = "rgba(255,255,255,0.26)";
    el.style.color       = "var(--text)";
  } else if (variant === "icon-ghost") {
    el.style.background = "rgba(247,147,26,0.16)";
  } else if (variant === "destructive") {
    el.style.opacity = "0.88";
  }
}

function resetHover(el: HTMLElement, variant: string) {
  if (variant === "primary") {
    el.style.background = "#f7931a";
    el.style.boxShadow  = "none";
    el.style.transform  = "";
  } else if (variant === "ghost" || variant === "outline") {
    el.style.background  = "transparent";
    el.style.borderColor = variant === "ghost" ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.18)";
    el.style.color       = variant === "ghost" ? "var(--text-2)" : "#edecf2";
  } else if (variant === "icon-ghost") {
    el.style.background = "var(--accent-dim)";
  } else if (variant === "destructive") {
    el.style.opacity = "1";
  }
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "default",
      loading = false,
      fullWidth = false,
      asChild = false,
      style: externalStyle,
      onMouseEnter: extEnter,
      onMouseLeave: extLeave,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const v = variant;
    const baseStyle: React.CSSProperties = { ...(BASE_STYLES[v] ?? {}), ...externalStyle };

    const sizeClass = SIZE_CLASSES[size] ?? SIZE_CLASSES.default;

    const variantClass =
      v === "primary"     ? "font-display font-black" :
      v === "ghost"       ? "font-display font-black" :
      v === "icon-ghost"  ? "font-mono text-[11px]" :
      v === "link"        ? "font-body text-[14px] underline-offset-4" :
                            "font-display font-black";

    const classes = cn(
      "inline-flex items-center justify-center gap-2 whitespace-nowrap",
      "cursor-pointer select-none",
      "disabled:pointer-events-none disabled:opacity-40",
      "focus-visible:outline-none",
      variantClass,
      sizeClass,
      fullWidth && "w-full",
      className
    );

    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={classes}
          style={baseStyle}
          {...props}
        />
      );
    }

    return (
      <motion.button
        ref={ref as React.Ref<HTMLButtonElement>}
        whileTap={{ scale: 0.97 }}
        className={classes}
        style={baseStyle}
        disabled={disabled || loading}
        onMouseEnter={(e) => {
          if (!disabled && !loading) applyHover(e.currentTarget as HTMLElement, v);
          extEnter?.(e as React.MouseEvent<HTMLButtonElement>);
        }}
        onMouseLeave={(e) => {
          if (!disabled && !loading) resetHover(e.currentTarget as HTMLElement, v);
          extLeave?.(e as React.MouseEvent<HTMLButtonElement>);
        }}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {loading ? (
          <span
            className="inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin"
            aria-hidden="true"
          />
        ) : (
          children
        )}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
