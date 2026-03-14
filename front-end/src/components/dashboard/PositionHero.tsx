"use client";
import { useState } from "react";
import { useUserPosition } from "@/hooks/useUserPosition";
import { STRATEGIES } from "@/constants/protocols";
import { Skeleton } from "@/components/ui/skeleton";
import { GLASS_BASE } from "@/components/ui/card";
import { WithdrawModal } from "@/components/WithdrawModal";

interface PositionHeroProps {
  userAddress: string;
}

const RISK_COLOR: Record<string, string> = {
  Low:    "#3dd68c",
  Medium: "#f5c842",
  High:   "#f16a6a",
};

function InfoRow({ label, value, valueColor = "var(--text)" }: { label: string; value: string; valueColor?: string }) {
  return (
    <div
      className="flex items-center justify-between py-[10px]"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <span className="font-body text-[13px]" style={{ color: "var(--text-2)" }}>{label}</span>
      <span className="font-mono text-[13px]" style={{ color: valueColor }}>{value}</span>
    </div>
  );
}

export function PositionHero({ userAddress }: PositionHeroProps) {
  const { data: position, isLoading } = useUserPosition(userAddress);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="rounded-card p-[26px] space-y-4" style={{ ...GLASS_BASE }}>
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-[1px] w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-10 w-full mt-2" />
      </div>
    );
  }

  if (!position || position.ysBtcShares === 0) {
    return (
      <div
        className="rounded-card p-[26px] flex flex-col items-center justify-center min-h-[14rem]"
        style={{ ...GLASS_BASE }}
      >
        <p className="font-mono text-[12px]" style={{ color: "var(--text-muted)" }}>
          No active position.
        </p>
      </div>
    );
  }

  const strategy  = STRATEGIES[position.strategy];
  const riskColor = RISK_COLOR[strategy.risk] ?? "var(--text-2)";

  return (
    <>
      <div className="rounded-card p-[26px]" style={{ ...GLASS_BASE }}>
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] mb-4" style={{ color: "#f7931a" }}>
          YOUR POSITION
        </p>

        <p className="font-mono font-medium text-[28px] leading-none mb-1" style={{ color: "var(--text)" }}>
          {position.sbtcDeposited.toFixed(8)} sBTC
        </p>
        <p className="font-mono text-[12px] mb-5" style={{ color: "var(--text-muted)" }}>
          ≈ $— USD
        </p>

        <div style={{ borderTop: "1px solid var(--border)" }}>
          <InfoRow label="Strategy" value={strategy.name} valueColor="#f7931a" />
          <InfoRow label="Current APY" value={strategy.expectedAPY} valueColor={riskColor} />
          <InfoRow label="ysBTC Balance" value={`${position.ysBtcShares.toFixed(8)} ysBTC`} />
          <InfoRow label="Accrued Yield" value="0.00000000 sBTC" valueColor="#3dd68c" />
        </div>

        <button
          onClick={() => setWithdrawOpen(true)}
          className="w-full mt-5 py-[14px] rounded-btn font-display font-black text-[15px] transition-all duration-[180ms]"
          style={{
            background:  "transparent",
            borderWidth: "1.5px",
            borderStyle: "solid",
            borderColor: "rgba(255,255,255,0.14)",
            color:       "var(--text-2)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background  = "rgba(255,255,255,0.05)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.26)";
            e.currentTarget.style.color       = "var(--text)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background  = "transparent";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
            e.currentTarget.style.color       = "var(--text-2)";
          }}
        >
          Withdraw sBTC
        </button>
      </div>

      <WithdrawModal
        isOpen={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        userAddress={userAddress}
      />
    </>
  );
}
