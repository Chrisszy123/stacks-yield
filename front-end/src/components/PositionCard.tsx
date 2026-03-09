"use client";
import { useState } from "react";
import { useUserPosition } from "@/hooks/useUserPosition";
import { STRATEGIES } from "@/constants/protocols";
import { WithdrawModal } from "./WithdrawModal";
import { Skeleton } from "@/components/ui/skeleton";

interface PositionCardProps {
  userAddress: string;
}

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

export function PositionCard({ userAddress }: PositionCardProps) {
  const { data: position, isLoading } = useUserPosition(userAddress);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  if (isLoading) {
    return (
      <div
        className="rounded-[16px] p-[26px] space-y-4"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full mt-4" />
      </div>
    );
  }

  if (!position || position.ysBtcShares === 0) {
    return (
      <div
        className="rounded-[16px] p-[26px] flex flex-col items-center justify-center min-h-[14rem]"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <p
          className="font-mono text-[13px] text-center"
          style={{ color: "var(--text-muted)" }}
        >
          No active position
        </p>
      </div>
    );
  }

  const strategy = STRATEGIES[position.strategy];

  return (
    <>
      <div
        className="rounded-[16px] p-[26px] transition-all duration-[180ms]"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-syne font-bold text-[15px]" style={{ color: "var(--text)" }}>
            Your Position
          </h3>
          <span
            className="font-mono text-[11px] px-[9px] py-[3px] rounded-[6px]"
            style={riskBadgeStyle(strategy.risk)}
          >
            {strategy.name}
          </span>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-5 mb-6">
          <Metric label="Deposited" value={`${position.sbtcDeposited.toFixed(6)} sBTC`} />
          <Metric
            label="ysBTC Shares"
            value={position.ysBtcShares.toFixed(6)}
            valueColor="var(--accent)"
          />
          <Metric
            label="Strategy APY"
            value={strategy.expectedAPY}
            valueColor="var(--green)"
          />
          <Metric label="Since Block" value={`#${position.depositBlock}`} />
        </div>

        {/* Withdraw */}
        <button
          onClick={() => setWithdrawOpen(true)}
          className="w-full py-3 rounded-[11px] border font-syne font-bold text-[14px] transition-all duration-[180ms] active:scale-[0.97]"
          style={{
            background: "transparent",
            borderColor: "var(--border)",
            color: "var(--text-2)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-hover)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-2)";
          }}
        >
          Withdraw
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

function Metric({
  label,
  value,
  valueColor = "var(--text)",
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div>
      <p className="font-sans text-[12px] mb-1" style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
      <p className="font-mono font-medium text-[18px]" style={{ color: valueColor }}>
        {value}
      </p>
    </div>
  );
}
