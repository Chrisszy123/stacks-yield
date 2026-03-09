"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StrategySelector } from "./StrategySelector";
import { useDeposit } from "@/hooks/useDeposit";
import { StrategyId } from "@/constants/protocols";
import { modalVariants, backdropVariants } from "@/lib/motion";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const [amount, setAmount] = useState("");
  const [strategy, setStrategy] = useState<StrategyId>(1);
  const { deposit, isLoading } = useDeposit();

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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50"
            style={{ background: "rgba(4,4,10,0.85)" }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-y-auto rounded-[16px] p-8"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-7">
              <h2 className="font-syne font-bold text-[22px]" style={{ color: "var(--text)" }}>
                Deposit sBTC
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-[8px] font-mono text-[16px] transition-all duration-[180ms] active:scale-[0.97]"
                style={{ color: "var(--text-muted)", background: "transparent" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--surface-2)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                }}
              >
                ✕
              </button>
            </div>

            {/* Amount input */}
            <div className="mb-7">
              <label
                className="font-mono text-[11px] uppercase tracking-[0.12em] block mb-2"
                style={{ color: "var(--text-muted)" }}
              >
                Amount (sBTC)
              </label>
              <div
                className="deposit-amount-wrap flex items-center rounded-[11px] px-4 transition-all duration-[180ms]"
                style={{
                  background: "var(--surface-2)",
                  border: "1.5px solid var(--border)",
                }}
              >
                <span className="font-mono text-[18px] mr-3" style={{ color: "var(--accent)" }}>
                  ₿
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00000000"
                  min="0"
                  step="0.00000001"
                  className="flex-1 bg-transparent outline-none py-[14px] font-mono text-[22px]"
                  style={{ color: "var(--text)" }}
                  onFocus={(e) => {
                    const wrap = e.currentTarget.closest(".deposit-amount-wrap") as HTMLDivElement;
                    if (wrap) {
                      wrap.style.borderColor = "var(--border-accent)";
                      wrap.style.boxShadow = "0 0 0 3px rgba(247,147,26,0.06)";
                    }
                  }}
                  onBlur={(e) => {
                    const wrap = e.currentTarget.closest(".deposit-amount-wrap") as HTMLDivElement;
                    if (wrap) {
                      wrap.style.borderColor = "var(--border)";
                      wrap.style.boxShadow = "none";
                    }
                  }}
                />
                <span className="font-mono text-[13px] ml-2" style={{ color: "var(--text-muted)" }}>
                  sBTC
                </span>
              </div>
            </div>

            {/* Strategy */}
            <div className="mb-7">
              <label
                className="font-mono text-[11px] uppercase tracking-[0.12em] block mb-3"
                style={{ color: "var(--text-muted)" }}
              >
                Select Strategy
              </label>
              <StrategySelector selected={strategy} onSelect={setStrategy} />
            </div>

            {/* Preview */}
            {amount && Number(amount) > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                className="mb-7 p-5 rounded-[12px]"
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                }}
              >
                <p className="font-sans text-[13px] mb-1" style={{ color: "var(--text-muted)" }}>
                  You will receive approximately
                </p>
                <p className="font-mono font-medium text-[22px]" style={{ color: "var(--accent)" }}>
                  {Number(amount).toFixed(8)} ysBTC
                </p>
                <p className="font-sans text-[12px] mt-1" style={{ color: "var(--text-muted)" }}>
                  Exact amount calculated at time of deposit
                </p>
              </motion.div>
            )}

            {/* CTA */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ y: -1 }}
              onClick={handleDeposit}
              disabled={isLoading || !amount || Number(amount) <= 0}
              className="w-full py-4 rounded-[11px] font-syne font-bold text-[15px] transition-all duration-[180ms] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "var(--accent)", color: "#000" }}
              onMouseEnter={(e) => {
                if (!(e.currentTarget as HTMLButtonElement).disabled) {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 5px 22px rgba(247,147,26,0.3)";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "";
              }}
            >
              {isLoading ? "Awaiting signature..." : "Deposit sBTC"}
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
