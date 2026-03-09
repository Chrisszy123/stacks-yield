"use client";
import { useState } from "react";
import { useUserPosition } from "@/hooks/useUserPosition";
import { STRATEGIES } from "@/constants/protocols";
import { WithdrawModal } from "./WithdrawModal";

interface PositionCardProps {
  userAddress: string;
}

export function PositionCard({ userAddress }: PositionCardProps) {
  const { data: position, isLoading } = useUserPosition(userAddress);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  if (isLoading) {
    return <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-6 animate-pulse h-56" />;
  }

  if (!position || position.ysBtcShares === 0) {
    return (
      <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-6 flex flex-col items-center justify-center min-h-[14rem]">
        <p className="text-4xl mb-3">₿</p>
        <p className="text-zinc-400 font-medium mb-1">No active position</p>
        <p className="text-zinc-600 text-sm text-center">
          Deposit sBTC to start earning Bitcoin-native yield
        </p>
      </div>
    );
  }

  const strategy = STRATEGIES[position.strategy];

  return (
    <>
      <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-bold text-lg">Your Position</h3>
          <span
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ backgroundColor: `${strategy.color}20`, color: strategy.color }}
          >
            {strategy.emoji} {strategy.name}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-zinc-500 text-sm">Deposited</p>
            <p className="text-white font-bold text-xl font-mono">
              {position.sbtcDeposited.toFixed(6)} sBTC
            </p>
          </div>
          <div>
            <p className="text-zinc-500 text-sm">ysBTC Shares</p>
            <p className="text-orange-400 font-bold text-xl font-mono">
              {position.ysBtcShares.toFixed(6)}
            </p>
          </div>
          <div>
            <p className="text-zinc-500 text-sm">Strategy APY</p>
            <p className="text-green-400 font-bold text-xl">{strategy.expectedAPY}</p>
          </div>
          <div>
            <p className="text-zinc-500 text-sm">Since Block</p>
            <p className="text-white font-bold text-xl font-mono">
              #{position.depositBlock}
            </p>
          </div>
        </div>

        <button
          onClick={() => setWithdrawOpen(true)}
          className="w-full py-3 rounded-xl border border-zinc-700 hover:border-orange-500 
                     text-zinc-300 hover:text-orange-400 font-semibold transition-all duration-200"
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
