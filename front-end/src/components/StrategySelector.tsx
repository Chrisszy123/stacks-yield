"use client";
import { motion } from "framer-motion";
import { STRATEGIES, StrategyId } from "@/constants/protocols";
import { useProtocolAPYs } from "@/hooks/useProtocolAPYs";
import { cn } from "@/lib/utils";
import { cardSelectVariants } from "@/lib/motion";

interface StrategySelectorProps {
  selected: StrategyId;
  onSelect: (id: StrategyId) => void;
}

const APY_KEYS = ["zest", "bitflow", "alex"] as const;

const riskColor: Record<string, string> = {
  Low:    "var(--green)",
  Medium: "var(--yellow)",
  High:   "var(--red)",
};

const riskBadgeStyle = (risk: string) => ({
  color: riskColor[risk] ?? "var(--text-2)",
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

export function StrategySelector({ selected, onSelect }: StrategySelectorProps) {
  const { data: apys, isLoading } = useProtocolAPYs();

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {STRATEGIES.map((strategy) => {
        const isSelected = selected === strategy.id;
        const liveAPY = apys?.[APY_KEYS[strategy.id]];

        return (
          <motion.button
            key={strategy.id}
            variants={cardSelectVariants}
            animate={isSelected ? "selected" : "idle"}
            onClick={() => onSelect(strategy.id as StrategyId)}
            className={cn(
              "rounded-[16px] p-5 text-left transition-all duration-[180ms] cursor-pointer outline-none"
            )}
            style={{
              background: isSelected ? "var(--accent-dim)" : "var(--surface-2)",
              border: `1px solid ${isSelected ? "var(--border-accent)" : "var(--border)"}`,
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-hover)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
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
