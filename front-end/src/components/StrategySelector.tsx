"use client";
import { STRATEGIES, StrategyId } from "@/constants/protocols";
import { useProtocolAPYs } from "@/hooks/useProtocolAPYs";
import { cn } from "@/lib/utils";

interface StrategySelectorProps {
  selected: StrategyId;
  onSelect: (id: StrategyId) => void;
}

const APY_KEYS = ["zest", "bitflow", "alex"] as const;

export function StrategySelector({ selected, onSelect }: StrategySelectorProps) {
  const { data: apys, isLoading } = useProtocolAPYs();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {STRATEGIES.map((strategy) => {
        const isSelected = selected === strategy.id;
        const liveAPY = apys?.[APY_KEYS[strategy.id]];

        return (
          <button
            key={strategy.id}
            onClick={() => onSelect(strategy.id as StrategyId)}
            className={cn(
              "rounded-xl border-2 p-5 text-left transition-all duration-200",
              "hover:border-orange-500 hover:shadow-lg",
              isSelected
                ? "border-orange-500 bg-orange-500/10 shadow-orange-500/20 shadow-lg"
                : "border-zinc-700 bg-zinc-900"
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{strategy.emoji}</span>
              <span
                className="text-xs font-bold px-2 py-1 rounded-full"
                style={{ backgroundColor: `${strategy.color}20`, color: strategy.color }}
              >
                {strategy.risk} Risk
              </span>
            </div>
            <h3 className="text-white font-bold text-lg mb-1">{strategy.name}</h3>
            <p className="text-zinc-400 text-sm mb-3">{strategy.description}</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500">Expected APY</p>
                <p className="text-orange-400 font-bold text-xl font-mono">
                  {isLoading ? "..." : liveAPY ? `${liveAPY.toFixed(1)}%` : strategy.expectedAPY}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-500">Protocols</p>
                <p className="text-zinc-300 text-sm">{strategy.protocols.join(", ")}</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
