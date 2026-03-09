import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  [
    "inline-flex items-center rounded-[6px]",
    "font-mono text-[11px] font-medium",
    "px-[9px] py-[3px]",
    "border",
    "transition-all duration-[180ms] ease-[ease]",
  ].join(" "),
  {
    variants: {
      variant: {
        default:  "border-[var(--border)] text-[var(--text-2)]",
        green:    "border-[rgba(61,214,140,0.3)] text-[var(--green)]   bg-[rgba(61,214,140,0.1)]",
        red:      "border-[rgba(241,106,106,0.3)] text-[var(--red)]    bg-[rgba(241,106,106,0.1)]",
        yellow:   "border-[rgba(245,200,66,0.3)]  text-[var(--yellow)] bg-[rgba(245,200,66,0.1)]",
        accent:   "border-[var(--border-accent)] text-accent           bg-[var(--accent-dim)]",
        outline:  "border-[var(--border)] text-[var(--text-2)]         bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      style={{ background: variant === "default" || variant === "outline" ? "var(--surface-2)" : undefined }}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
