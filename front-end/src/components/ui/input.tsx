import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-[11px] px-4 py-[14px]",
          "text-[15px] font-mono",
          "placeholder:text-[var(--text-muted)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "outline-none",
          "transition-all duration-[180ms] ease-[ease]",
          className
        )}
        style={{
          background: "var(--surface-2)",
          border: "1.5px solid var(--border)",
          color: "var(--text)",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--border-accent)";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(247,147,26,0.06)";
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.boxShadow = "none";
          props.onBlur?.(e);
        }}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
