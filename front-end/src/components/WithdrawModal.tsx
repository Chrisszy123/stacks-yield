"use client";
import { useState } from "react";
import { useWithdraw } from "@/hooks/useWithdraw";
import { useUserPosition } from "@/hooks/useUserPosition";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  userAddress: string;
}

export function WithdrawModal({ isOpen, onClose, userAddress }: WithdrawModalProps) {
  const [amount, setAmount] = useState("");
  const { withdraw, isLoading } = useWithdraw();
  const { data: position } = useUserPosition(userAddress);

  if (!isOpen) return null;

  const maxShares = position?.ysBtcShares ?? 0;

  const handleWithdraw = async () => {
    const num = Number(amount);
    if (!amount || isNaN(num) || num <= 0) return;
    try {
      await withdraw(num);
      setAmount("");
      onClose();
    } catch {
      // error handled in hook via toast
    }
  };

  const setMax = () => setAmount(maxShares.toFixed(8));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 w-full max-w-lg mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-2xl font-black">Withdraw sBTC</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Balance display */}
        {position && (
          <div className="mb-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 text-sm">Available ysBTC</span>
              <span className="text-orange-400 font-mono font-bold">
                {maxShares.toFixed(6)} ysBTC
              </span>
            </div>
          </div>
        )}

        {/* Amount input */}
        <div className="mb-6">
          <label className="text-zinc-400 text-sm mb-2 block">Amount (ysBTC)</label>
          <div className="flex items-center border border-zinc-700 rounded-xl bg-zinc-900 px-4 py-3 focus-within:border-orange-500 transition-colors">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00000000"
              min="0"
              max={maxShares}
              step="0.00000001"
              className="flex-1 bg-transparent text-white text-xl outline-none font-mono"
            />
            <button
              onClick={setMax}
              className="text-orange-400 text-sm font-bold hover:text-orange-300 ml-2 px-2 py-1 rounded-lg hover:bg-orange-500/10 transition-colors"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Fee note */}
        <div className="mb-6 p-3 rounded-lg bg-zinc-900 border border-zinc-800">
          <p className="text-zinc-500 text-xs">
            A 0.5% protocol fee is deducted on withdrawal. You will receive sBTC equivalent to your ysBTC shares minus fees.
          </p>
        </div>

        <button
          onClick={handleWithdraw}
          disabled={isLoading || !amount || Number(amount) <= 0 || Number(amount) > maxShares}
          className="w-full py-4 rounded-xl border border-zinc-600 hover:border-orange-500 
                     hover:bg-orange-500/10 disabled:opacity-50 disabled:cursor-not-allowed 
                     text-zinc-300 hover:text-orange-400 font-bold text-lg transition-all duration-200"
        >
          {isLoading ? "Awaiting wallet signature..." : "Withdraw sBTC"}
        </button>
      </div>
    </div>
  );
}
