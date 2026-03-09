import * as React from "react";
import { cn } from "@/lib/utils";

const GLASS_BASE: React.CSSProperties = {
  background:              "rgba(255,255,255,0.04)",
  backdropFilter:          "blur(16px)",
  WebkitBackdropFilter:    "blur(16px)",
  borderWidth:             "1px",
  borderStyle:             "solid",
  borderColor:             "rgba(255,255,255,0.09)",
  boxShadow:               [
    "0 2px 4px rgba(0,0,0,0.30)",
    "0 8px 24px rgba(0,0,0,0.20)",
    "inset 0 1px 0 rgba(255,255,255,0.07)",
  ].join(", "),
  transition:              [
    "transform 0.22s ease",
    "box-shadow 0.22s ease",
    "border-color 0.22s ease",
    "background 0.22s ease",
  ].join(", "),
};

const GLASS_HOVER_ON: React.CSSProperties = {
  background:   "rgba(255,255,255,0.065)",
  borderColor:  "rgba(255,255,255,0.15)",
  transform:    "translateY(-4px)",
  boxShadow:    [
    "0 4px 8px rgba(0,0,0,0.35)",
    "0 16px 40px rgba(0,0,0,0.25)",
    "inset 0 1px 0 rgba(255,255,255,0.10)",
  ].join(", "),
};

const GLASS_HOVER_OFF: React.CSSProperties = {
  background:   "rgba(255,255,255,0.04)",
  borderColor:  "rgba(255,255,255,0.09)",
  transform:    "",
  boxShadow:    [
    "0 2px 4px rgba(0,0,0,0.30)",
    "0 8px 24px rgba(0,0,0,0.20)",
    "inset 0 1px 0 rgba(255,255,255,0.07)",
  ].join(", "),
};

export function applyGlassHover(el: HTMLElement) {
  Object.assign(el.style, GLASS_HOVER_ON);
}
export function resetGlassHover(el: HTMLElement) {
  Object.assign(el.style, GLASS_HOVER_OFF);
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive = false, onMouseEnter, onMouseLeave, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-[16px] p-[26px]", className)}
      style={{ ...GLASS_BASE, ...style }}
      onMouseEnter={
        interactive
          ? (e) => {
              applyGlassHover(e.currentTarget);
              onMouseEnter?.(e);
            }
          : onMouseEnter
      }
      onMouseLeave={
        interactive
          ? (e) => {
              resetGlassHover(e.currentTarget);
              onMouseLeave?.(e);
            }
          : onMouseLeave
      }
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 mb-4", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("font-syne font-bold text-[15px] leading-none tracking-tight", className)}
      style={{ color: "var(--text)" }}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-[14px] leading-relaxed", className)}
      style={{ color: "var(--text-2)" }}
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center pt-4", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
export { GLASS_BASE };
