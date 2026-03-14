"use client";
import { useState } from "react";
import { useProtocolAPYs } from "@/hooks/useProtocolAPYs";
import { GLASS_BASE } from "@/components/ui/card";

const STRATEGIES = [
  { id: 0, name: "Zest Protocol",  tier: "Conservative", color: "#3dd68c", keyName: "zest"    as const },
  { id: 1, name: "Bitflow",        tier: "Balanced",      color: "#f5c842", keyName: "bitflow" as const },
  { id: 2, name: "ALEX",           tier: "Aggressive",    color: "#f16a6a", keyName: "alex"    as const },
];

interface StrategyCardsProps {
  selectedId?: number;
  onSelect?:   (id: number) => void;
}

export function StrategyCards({ selectedId, onSelect }: StrategyCardsProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const { data: apys, isLoading } = useProtocolAPYs();

  return (
    <div className="rounded-card p-[26px]" style={{ ...GLASS_BASE }}>
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] mb-4" style={{ color: "#f7931a" }}>
        PROTOCOLS
      </p>

      <div className="flex flex-col gap-2">
        {STRATEGIES.map((s) => {
          const apy      = apys?.[s.keyName];
          const isSelected = selectedId === s.id;
          const isHovered  = hovered === s.id;

          return (
            <div
              key={s.id}
              onClick={() => onSelect?.(s.id)}
              onMouseEnter={() => setHovered(s.id)}
              onMouseLeave={() => setHovered(null)}
              className="flex items-center justify-between px-[14px] py-[12px] rounded-input cursor-pointer transition-all duration-[180ms]"
              style={{
                background:  isSelected || isHovered ? `${s.color}08` : "#12121c",
                border:      `1px solid ${isSelected ? `${s.color}66` : isHovered ? "rgba(255,255,255,0.11)" : "var(--border)"}`,
                boxShadow:   isSelected ? `0 0 18px ${s.color}1A` : "none",
              }}
            >
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-[14px]" style={{ color: "var(--text)" }}>
                    {s.name}
                  </span>
                  {isSelected && (
                    <span
                      className="font-mono text-[10px] uppercase px-[7px] py-[2px] rounded-[5px] tracking-[0.06em]"
                      style={{ background: `${s.color}14`, border: `1px solid ${s.color}33`, color: s.color }}
                    >
                      ACTIVE
                    </span>
                  )}
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.06em]" style={{ color: "var(--text-muted)" }}>
                  {s.tier}
                </span>
              </div>
              <span className="font-mono font-medium text-[16px]" style={{ color: s.color }}>
                {isLoading ? "—" : apy !== undefined ? `${apy.toFixed(1)}%` : "—"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
