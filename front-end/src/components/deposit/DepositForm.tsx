"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useDeposit } from "@/hooks/useDeposit";
import { useSbtcBalance } from "@/hooks/balanceQueries";
import { useFaucet } from "@/hooks/useFaucet";
import { useProtocolAPYs } from "@/hooks/useProtocolAPYs";
import { useWallet } from "@/components/providers/wallet-provider";
import { GLASS_BASE } from "@/components/ui/card";
import { StrategySelector } from "./StrategySelector";
import { DepositPreview } from "./DepositPreview";

const APY_KEYS = ["zest", "bitflow", "alex"] as const;

export function DepositForm({ onSuccess }: { onSuccess?: () => void }) {
  const [amount, setAmount]    = useState("");
  const [strategy, setStrategy] = useState(2);

  const { address, isDevnet }  = useWallet();
  const { deposit, isLoading } = useDeposit();
  const { data: balance }      = useSbtcBalance(address ?? null);
  const { drip, isLoading: faucetLoading } = useFaucet();
  const { data: apys }         = useProtocolAPYs();

  const numAmount  = Number(amount);
  const hasAmount  = !isNaN(numAmount) && numAmount > 0;
  const apyKey     = APY_KEYS[strategy];
  const currentApy = apys?.[apyKey] ?? 0;

  async function handleDeposit() {
    if (!hasAmount) return;
    try {
      await deposit(numAmount, strategy);
      setAmount("");
      onSuccess?.();
    } catch { /* error handled in hook */ }
  }

  return (
    <div className="rounded-card p-[26px]" style={{ ...GLASS_BASE }}>
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] mb-4" style={{ color: "#f7931a" }}>
        DEPOSIT
      </p>

      {/* Amount input */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-[7px]">
          <label className="font-mono text-[11px] uppercase tracking-[0.10em]" style={{ color: "var(--text-2)" }}>
            AMOUNT
          </label>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px]" style={{ color: "var(--text-muted)" }}>
              Balance: {balance !== undefined ? `${balance.toFixed(8)} sBTC` : "—"}
            </span>
            {isDevnet && (
              <button
                onClick={() => drip(1)}
                disabled={faucetLoading}
                className="font-mono text-[10px] px-[7px] py-[2px] rounded-[5px] disabled:opacity-40"
                style={{ background: "rgba(61,214,140,0.07)", border: "1px solid rgba(61,214,140,0.2)", color: "#3dd68c" }}
              >
                {faucetLoading ? "…" : "+1 faucet"}
              </button>
            )}
          </div>
        </div>

        <div
          className="deposit-amount-wrap flex items-center rounded-input overflow-hidden"
          style={{
            background:  "#12121c",
            borderWidth: "1.5px",
            borderStyle: "solid",
            borderColor: "rgba(255,255,255,0.06)",
            transition:  "border-color 0.18s ease, box-shadow 0.18s ease",
          }}
          onFocus={() => {}}
        >
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00000000"
            min="0"
            step="0.00000001"
            className="flex-1 bg-transparent outline-none px-[18px] py-4 font-mono font-medium text-[22px]"
            style={{ color: "var(--text)" }}
            onFocus={(e) => {
              const wrap = e.currentTarget.closest(".deposit-amount-wrap") as HTMLDivElement | null;
              if (wrap) { wrap.style.borderColor = "rgba(247,147,26,0.28)"; wrap.style.boxShadow = "0 0 0 3px rgba(247,147,26,0.06)"; }
            }}
            onBlur={(e) => {
              const wrap = e.currentTarget.closest(".deposit-amount-wrap") as HTMLDivElement | null;
              if (wrap) { wrap.style.borderColor = "rgba(255,255,255,0.06)"; wrap.style.boxShadow = "none"; }
            }}
          />
          <div className="flex items-center gap-2 pr-3">
            <span className="font-mono text-[14px]" style={{ color: "var(--text-muted)" }}>sBTC</span>
            {balance !== undefined && balance > 0 && (
              <button
                type="button"
                onClick={() => setAmount(String(balance))}
                className="font-mono text-[10px] px-[9px] py-[3px] rounded-pill uppercase tracking-[0.06em]"
                style={{ background: "var(--accent-dim)", border: "1px solid var(--border-accent)", color: "#f7931a" }}
              >
                MAX
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Strategy selector */}
      <div className="mb-6">
        <label className="font-mono text-[11px] uppercase tracking-[0.10em] block mb-3" style={{ color: "var(--text-2)" }}>
          STRATEGY
        </label>
        <StrategySelector selected={strategy} onSelect={setStrategy} />
      </div>

      {/* Preview */}
      {hasAmount && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <DepositPreview amount={numAmount} apy={currentApy} />
        </motion.div>
      )}

      {/* CTA */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => { void handleDeposit(); }}
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
        {isLoading ? "Awaiting signature…" : "Deposit sBTC"}
      </motion.button>
    </div>
  );
}
