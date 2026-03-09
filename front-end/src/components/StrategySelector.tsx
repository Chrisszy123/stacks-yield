"use client";
import { motion } from "framer-motion";
import { STRATEGIES, StrategyId } from "@/constants/protocols";
import { useProtocolAPYs } from "@/hooks/useProtocolAPYs";
import { cn } from "@/lib/utils";
import { cardSelectVariants } from "@/lib/motion";
import { GLASS_BASE } from "@/components/ui/card";

interface StrategySelectorProps {
  selected: StrategyId;
  onSelect: (id: StrategyId) => void;
}

const APY_KEYS = ["zest", "bitflow", "alex"] as const;

const STRATEGY_COLORS: Record<string, { ring: string; glow: string }> = {
  Low:    { ring: "rgba(61,214,140,0.6)",   glow: "rgba(61,214,140,0.18)"   },
  Medium: { ring: "rgba(245,200,66,0.6)",   glow: "rgba(245,200,66,0.18)"   },
  High:   { ring: "rgba(241,106,106,0.6)",  glow: "rgba(241,106,106,0.18)"  },
};

const riskBadgeStyle = (risk: string) => ({
  color:
    risk === "Low"    ? "var(--green)"  :
    risk === "Medium" ? "var(--yellow)" : "var(--red)",
  background:
    risk === "Low"    ? "rgba(61,214,140,0.1)"  :
    risk === "Medium" ? "rgba(245,200,66,0.1)"  :
    "rgba(241,106,106,0.1)",
  border: `1px solid ${
    risk === "Low"    ? "rgba(61,214,140,0.3)"  :
    risk === "Medium" ? "rgba(245,200,66,0.3)"  :
    "rgba(241,106,106,0.3)"
  }`,
});

function selectedBoxShadow(risk: string): string {
  const c = STRATEGY_COLORS[risk];
  return [
    "0 4px 8px rgba(0,0,0,0.35)",
    "0 16px 40px rgba(0,0,0,0.25)",
    "inset 0 1px 0 rgba(255,255,255,0.10)",
    `0 0 28px ${c.glow}`,
  ].join(", ");
}

export function StrategySelector({ selected, onSelect }: StrategySelectorProps) {
  const { data: apys, isLoading } = useProtocolAPYs();

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {STRATEGIES.map((strategy) => {
        const isSelected = selected === strategy.id;
        const liveAPY    = apys?.[APY_KEYS[strategy.id]];
        const colors     = STRATEGY_COLORS[strategy.risk];

        const cardStyle: React.CSSProperties = isSelected
          ? {
              ...GLASS_BASE,
              background:   "rgba(255,255,255,0.065)",
              borderColor:  colors.ring,
              boxShadow:    selectedBoxShadow(strategy.risk),
            }
          : { ...GLASS_BASE };

        return (
          <motion.button
            key={strategy.id}
            variants={cardSelectVariants}
            animate={isSelected ? "selected" : "idle"}
            onClick={() => onSelect(strategy.id as StrategyId)}
            className={cn("rounded-[16px] p-5 text-left cursor-pointer outline-none")}
            style={cardStyle}
            onMouseEnter={(e) => {
              if (!isSelected) {
                const el = e.currentTarget as HTMLElement;
                el.style.background   = "rgba(255,255,255,0.065)";
                el.style.borderColor  = "rgba(255,255,255,0.15)";
                el.style.transform    = "translateY(-4px)";
                el.style.boxShadow    = [
                  "0 4px 8px rgba(0,0,0,0.35)",
                  "0 16px 40px rgba(0,0,0,0.25)",
                  "inset 0 1px 0 rgba(255,255,255,0.10)",
                ].join(", ");
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                const el = e.currentTarget as HTMLElement;
                el.style.background   = "rgba(255,255,255,0.04)";
                el.style.borderColor  = "rgba(255,255,255,0.09)";
                el.style.transform    = "";
                el.style.boxShadow    = [
                  "0 2px 4px rgba(0,0,0,0.30)",
                  "0 8px 24px rgba(0,0,0,0.20)",
                  "inset 0 1px 0 rgba(255,255,255,0.07)",
                ].join(", ");
              }
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-syne font-bold text-[14px]" style={{ color: "var(--text)" }}>
                {strategy.name}
              </span>
              <span
                className="font-mono text-[11px] px-[9px] py-[3px] rounded-[6px]"
                style={riskBadgeStyle(strategy.risk)}
              >
                {strategy.risk}
              </span>
            </div>

            <p className="font-sans text-[13px] leading-relaxed mb-4" style={{ color: "var(--text-2)" }}>
              {strategy.description}
            </p>

            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] mb-1" style={{ color: "var(--text-muted)" }}>
                APY
              </p>
              <p className="font-mono font-medium text-[22px]" style={{ color: "var(--accent)" }}>
                {isLoading ? "—" : liveAPY !== undefined ? `${liveAPY.toFixed(1)}%` : strategy.expectedAPY}
              </p>
            </div>

            <p className="font-mono text-[11px] mt-3" style={{ color: "var(--text-muted)" }}>
              {strategy.protocols.join(" · ")}
            </p>
          </motion.button>
        );
      })}
    </div>
  );
}
