import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeColor = "orange" | "green" | "red" | "yellow" | "muted";

const COLOR_STYLES: Record<BadgeColor, React.CSSProperties> = {
  orange: {
    background: "rgba(247,147,26,0.09)",
    borderColor: "rgba(247,147,26,0.2)",
    color: "#f7931a",
  },
  green: {
    background: "rgba(61,214,140,0.07)",
    borderColor: "rgba(61,214,140,0.2)",
    color: "#3dd68c",
  },
  red: {
    background: "rgba(241,106,106,0.07)",
    borderColor: "rgba(241,106,106,0.2)",
    color: "#f16a6a",
  },
  yellow: {
    background: "rgba(245,200,66,0.07)",
    borderColor: "rgba(245,200,66,0.2)",
    color: "#f5c842",
  },
  muted: {
    background: "#12121c",
    borderColor: "rgba(255,255,255,0.06)",
    color: "#47465a",
  },
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: BadgeColor;
  dot?:   boolean;
  /** legacy variant prop — maps to color */
  variant?: "default" | "green" | "red" | "yellow" | "accent" | "outline";
}

function variantToColor(variant: BadgeProps["variant"]): BadgeColor {
  switch (variant) {
    case "green":   return "green";
    case "red":     return "red";
    case "yellow":  return "yellow";
    case "accent":  return "orange";
    default:        return "muted";
  }
}

function Badge({ className, color, dot, variant, children, style, ...props }: BadgeProps) {
  const resolvedColor = color ?? variantToColor(variant);
  const colorStyle = COLOR_STYLES[resolvedColor];
  const dotColor = colorStyle.color as string;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill border font-mono text-[10px] font-medium",
        "px-[9px] py-[3px] uppercase tracking-[0.06em]",
        "transition-all duration-[180ms] ease-[ease]",
        className
      )}
      style={{ borderWidth: "1px", borderStyle: "solid", ...colorStyle, ...style }}
      {...props}
    >
      {dot && (
        <span
          className="inline-block w-[5px] h-[5px] rounded-full shrink-0 animate-pulse-dot"
          style={{ background: dotColor }}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}

export { Badge };
export type { BadgeColor };
