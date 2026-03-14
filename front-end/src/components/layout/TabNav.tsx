"use client";
import { cn } from "@/lib/utils";

interface Tab {
  id:    string;
  label: string;
}

interface TabNavProps {
  tabs:     Tab[];
  active:   string;
  onChange: (id: string) => void;
  className?: string;
}

export function TabNav({ tabs, active, onChange, className }: TabNavProps) {
  return (
    <div
      className={cn("flex items-center gap-1 p-1 rounded-[12px]", className)}
      style={{
        background:  "#0d0d15",
        border:      "1px solid var(--border)",
        width:       "fit-content",
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "font-mono text-[12px] font-medium uppercase tracking-[0.06em]",
              "px-[14px] py-[7px] rounded-[8px] cursor-pointer",
              "transition-all duration-[180ms] ease-[ease]",
              "focus-visible:outline-none"
            )}
            style={
              isActive
                ? {
                    background:  "rgba(247,147,26,0.1)",
                    border:      "1px solid rgba(247,147,26,0.28)",
                    color:       "#f7931a",
                  }
                : {
                    background:  "transparent",
                    border:      "1px solid transparent",
                    color:       "var(--text-muted)",
                  }
            }
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.color = "var(--text-2)";
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
