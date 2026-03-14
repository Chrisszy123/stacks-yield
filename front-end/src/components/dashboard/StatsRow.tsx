"use client";
import { StatCard } from "./StatCard";
import { useVaultStats } from "@/hooks/useVaultStats";
import { useCurrentBtcBlock } from "@/hooks/chainQueries";

export function StatsRow() {
  const { data: vault, isLoading: vaultLoading } = useVaultStats();
  const { data: block, isLoading: blockLoading }  = useCurrentBtcBlock();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        eyebrow="TOTAL TVL"
        value={vaultLoading ? "—" : `${(vault?.totalSbtc ?? 0).toFixed(8)} sBTC`}
        label="across all strategies"
        loading={vaultLoading}
      />
      <StatCard
        eyebrow="YOUR YIELD"
        value="0.00000000 sBTC"
        label="accrued since deposit"
      />
      <StatCard
        eyebrow="BLOCK HEIGHT"
        value={blockLoading ? "—" : `#${(block ?? 0).toLocaleString()}`}
        label="Stacks testnet"
        loading={blockLoading}
      />
    </div>
  );
}
