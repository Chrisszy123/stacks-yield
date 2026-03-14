"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useWithdraw } from "@/hooks/useWithdraw";
import { useUserPosition } from "@/hooks/useUserPosition";
import { useWallet } from "@/components/providers/wallet-provider";
import { GLASS_BASE } from "@/components/ui/card";
import { WithdrawPreview } from "./WithdrawPreview";

interface WithdrawFormProps {
  userAddress: string;
  onSuccess?:  () => void;
}

export function WithdrawForm({ userAddress, onSuccess }: WithdrawFormProps) {
  const [amount, setAmount]      = useState("");
  const { withdraw, isLoading }  = useWithdraw();
  const { data: position }       = useUserPosition(userAddress);

  const maxShares  = position?.ysBtcShares ?? 0;
  const numAmount  = Number(amount);
  const hasAmount  = !isNaN(numAmount) && numAmount > 0 && numAmount <= maxShares;

  async function handleWithdraw() {
    if (!hasAmount) return;
    try {
      await withdraw(numAmount);
      setAmount("");
      onSuccess?.();
    } catch { /* error handled in hook */ }
  }

  return (
    <div className="rounded-card p-[26px]" style={{ ...GLASS_BASE }}>
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] mb-4" style={{ color: "#f7931a" }}>
        WITHDRAW
      </p>

      {/* Amount input */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-[7px]">
          <label className="font-mono text-[11px] uppercase tracking-[0.10em]" style={{ color: "var(--text-2)" }}>
            AMOUNT (ysBTC)
          </label>
          <span className="font-mono text-[11px]" style={{ color: "var(--text-muted)" }}>
            Balance: {maxShares.toFixed(8)} ysBTC
          </span>
        </div>

        <div
          className="withdraw-amount-wrap flex items-center rounded-input overflow-hidden"
          style={{
            background:  "#12121c",
            borderWidth: "1.5px",
            borderStyle: "solid",
            borderColor: "rgba(255,255,255,0.06)",
            transition:  "border-color 0.18s ease, box-shadow 0.18s ease",
          }}
        >
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00000000"
            min="0"
            max={maxShares}
            step="0.00000001"
            className="flex-1 bg-transparent outline-none px-[18px] py-4 font-mono font-medium text-[22px]"
            style={{ color: "var(--text)" }}
            onFocus={(e) => {
              const wrap = e.currentTarget.closest(".withdraw-amount-wrap") as HTMLDivElement | null;
              if (wrap) { wrap.style.borderColor = "rgba(247,147,26,0.28)"; wrap.style.boxShadow = "0 0 0 3px rgba(247,147,26,0.06)"; }
            }}
            onBlur={(e) => {
              const wrap = e.currentTarget.closest(".withdraw-amount-wrap") as HTMLDivElement | null;
              if (wrap) { wrap.style.borderColor = "rgba(255,255,255,0.06)"; wrap.style.boxShadow = "none"; }
            }}
          />
          <div className="flex items-center gap-2 pr-3">
            <span className="font-mono text-[14px]" style={{ color: "var(--text-muted)" }}>ysBTC</span>
            {maxShares > 0 && (
              <button
                type="button"
                onClick={() => setAmount(String(maxShares))}
                className="font-mono text-[10px] px-[9px] py-[3px] rounded-pill uppercase tracking-[0.06em]"
                style={{ background: "var(--accent-dim)", border: "1px solid var(--border-accent)", color: "#f7931a" }}
              >
                MAX
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Preview */}
      {hasAmount && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <WithdrawPreview shares={numAmount} sbtcPerShare={1} />
        </motion.div>
      )}

      {/* CTA */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => { void handleWithdraw(); }}
        disabled={isLoading || !hasAmount}
        className="w-full py-[14px] rounded-btn font-display font-black text-[15px] disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: "#f7931a",
          color:      "#fff",
          border:     "none",
          transition: "background 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
        }}
        onMouseEnter={(e) => {
          if (!(e.currentTarget as HTMLButtonElement).disabled) {
            (e.currentTarget as HTMLButtonElement).style.background = "#ffaa47";
            (e.currentTarget as HTMLButtonElement).style.transform  = "translateY(-2px)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow  = "0 8px 28px rgba(247,147,26,0.40)";
          }
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "#f7931a";
          (e.currentTarget as HTMLButtonElement).style.transform  = "";
          (e.currentTarget as HTMLButtonElement).style.boxShadow  = "none";
        }}
      >
        {isLoading ? "Awaiting signature…" : "Withdraw sBTC"}
      </motion.button>
    </div>
  );
}
