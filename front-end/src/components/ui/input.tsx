import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  inputType?: "text" | "number" | "amount";
  rightSlot?: React.ReactNode;
  label?:     string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, inputType, rightSlot, label, id, ...props }, ref) => {
    const isAmount = inputType === "amount";

    const inputEl = (
      <input
        id={id}
        type={type ?? (isAmount ? "number" : "text")}
        className={cn(
          "flex w-full outline-none placeholder:text-[var(--text-muted)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-[border-color,box-shadow] duration-[180ms] ease-[ease]",
          isAmount
            ? "font-mono font-medium text-[22px] px-[18px] py-4 rounded-input"
            : "font-body text-[14px] px-[15px] py-[13px] rounded-input",
          rightSlot ? "pr-0" : "",
          className
        )}
        style={{
          background:  "#12121c",
          borderWidth: "1.5px",
          borderStyle: "solid",
          borderColor: "rgba(255,255,255,0.06)",
          color:       "var(--text)",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "rgba(247,147,26,0.28)";
          e.currentTarget.style.boxShadow   = "0 0 0 3px rgba(247,147,26,0.06)";
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
          e.currentTarget.style.boxShadow   = "none";
          props.onBlur?.(e);
        }}
        ref={ref}
        {...props}
      />
    );

    const wrapped = rightSlot ? (
      <div
        className="flex items-center rounded-input overflow-hidden"
        style={{
          background:  "#12121c",
          borderWidth: "1.5px",
          borderStyle: "solid",
          borderColor: "rgba(255,255,255,0.06)",
          transition:  "border-color 0.18s ease, box-shadow 0.18s ease",
        }}
        onFocus={(e: React.FocusEvent<HTMLDivElement>) => {
          e.currentTarget.style.borderColor = "rgba(247,147,26,0.28)";
          e.currentTarget.style.boxShadow   = "0 0 0 3px rgba(247,147,26,0.06)";
        }}
        onBlur={(e: React.FocusEvent<HTMLDivElement>) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
            e.currentTarget.style.boxShadow   = "none";
          }
        }}
      >
        {React.cloneElement(inputEl, {
          className: cn(inputEl.props.className, "border-none !shadow-none flex-1 bg-transparent"),
          style: { background: "transparent", border: "none", boxShadow: "none", color: "var(--text)" },
        } as React.ComponentProps<"input">)}
        <div className="pr-3 shrink-0">{rightSlot}</div>
      </div>
    ) : inputEl;

    if (!label) return wrapped;

    return (
      <div className="flex flex-col">
        <label
          htmlFor={id}
          className="font-mono text-[11px] uppercase tracking-[0.10em] mb-[7px]"
          style={{ color: "var(--text-2)" }}
        >
          {label}
        </label>
        {wrapped}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
export type { InputProps };
