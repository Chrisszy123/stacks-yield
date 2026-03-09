"use client";
import { useState } from "react";
import { StrategySelector } from "./StrategySelector";
import { useDeposit } from "@/hooks/useDeposit";
import { StrategyId } from "@/constants/protocols";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const [amount, setAmount] = useState("");
  const [strategy, setStrategy] = useState<StrategyId>(1);
  const { deposit, isLoading } = useDeposit();

  if (!isOpen) return null;

  const handleDeposit = async () => {
    const num = Number(amount);
    if (!amount || isNaN(num) || num <= 0) return;
    try {
      await deposit(num, strategy);
      setAmount("");
      onClose();
    } catch {
      // error handled in hook via toast
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-2xl font-black">Deposit sBTC</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Amount input */}
        <div className="mb-6">
          <label className="text-zinc-400 text-sm mb-2 block">Amount (sBTC)</label>
          <div className="flex items-center border border-zinc-700 rounded-xl bg-zinc-900 px-4 py-3 focus-within:border-orange-500 transition-colors">
            <span className="text-orange-400 mr-2 text-lg">₿</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00000000"
              min="0"
              step="0.00000001"
              className="flex-1 bg-transparent text-white text-xl outline-none font-mono"
            />
            <span className="text-zinc-500 text-sm ml-2">sBTC</span>
          </div>
        </div>

        {/* Strategy selection */}
        <div className="mb-6">
          <label className="text-zinc-400 text-sm mb-3 block">Select Strategy</label>
          <StrategySelector selected={strategy} onSelect={setStrategy} />
        </div>

        {/* Preview */}
        {amount && Number(amount) > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
            <p className="text-zinc-500 text-sm mb-1">You will receive approximately</p>
            <p className="text-orange-400 font-bold text-xl font-mono">
              {Number(amount).toFixed(8)} ysBTC
            </p>
            <p className="text-zinc-600 text-xs mt-1">
              Exact amount calculated at time of deposit
            </p>
          </div>
        )}

        <button
          onClick={handleDeposit}
          disabled={isLoading || !amount || Number(amount) <= 0}
          className="w-full py-4 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-50 
                     disabled:cursor-not-allowed text-white font-bold text-lg transition-all duration-200"
        >
          {isLoading ? "Awaiting wallet signature..." : "Deposit sBTC"}
        </button>
      </div>
    </div>
  );
}
