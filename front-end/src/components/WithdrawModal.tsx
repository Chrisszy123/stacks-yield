"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWithdraw } from "@/hooks/useWithdraw";
import { useUserPosition } from "@/hooks/useUserPosition";
import { modalVariants, backdropVariants } from "@/lib/motion";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  userAddress: string;
}

export function WithdrawModal({ isOpen, onClose, userAddress }: WithdrawModalProps) {
  const [amount, setAmount] = useState("");
  const { withdraw, isLoading } = useWithdraw();
  const { data: position } = useUserPosition(userAddress);

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
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-[16px] p-8"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-7">
              <h2 className="font-syne font-bold text-[22px]" style={{ color: "var(--text)" }}>
                Withdraw sBTC
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

            {/* Available balance */}
            {position && (
              <div
                className="mb-6 p-5 rounded-[12px] flex items-center justify-between"
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                }}
              >
                <span className="font-sans text-[13px]" style={{ color: "var(--text-muted)" }}>
                  Available ysBTC
                </span>
                <span className="font-mono font-medium text-[16px]" style={{ color: "var(--accent)" }}>
                  {maxShares.toFixed(6)} ysBTC
                </span>
              </div>
            )}

            {/* Amount input */}
            <div className="mb-6">
              <label
                className="font-mono text-[11px] uppercase tracking-[0.12em] block mb-2"
                style={{ color: "var(--text-muted)" }}
              >
                Amount (ysBTC)
              </label>
              <div
                className="withdraw-amount-wrap flex items-center rounded-[11px] px-4 transition-all duration-[180ms]"
                style={{
                  background: "var(--surface-2)",
                  border: "1.5px solid var(--border)",
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
                  className="flex-1 bg-transparent outline-none py-[14px] font-mono text-[22px]"
                  style={{ color: "var(--text)" }}
                  onFocus={(e) => {
                    const wrap = e.currentTarget.closest(".withdraw-amount-wrap") as HTMLDivElement;
                    if (wrap) {
                      wrap.style.borderColor = "var(--border-accent)";
                      wrap.style.boxShadow = "0 0 0 3px rgba(247,147,26,0.06)";
                    }
                  }}
                  onBlur={(e) => {
                    const wrap = e.currentTarget.closest(".withdraw-amount-wrap") as HTMLDivElement;
                    if (wrap) {
                      wrap.style.borderColor = "var(--border)";
                      wrap.style.boxShadow = "none";
                    }
                  }}
                />
                {/* MAX button */}
                <button
                  onClick={setMax}
                  className="font-mono text-[11px] font-medium px-[9px] py-[5px] rounded-[6px] ml-2 transition-all duration-[180ms] active:scale-[0.97]"
                  style={{
                    background: "var(--accent-dim)",
                    border: "1px solid var(--border-accent)",
                    color: "var(--accent)",
                  }}
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Fee note */}
            <div
              className="mb-7 p-4 rounded-[12px]"
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
              }}
            >
              <p className="font-sans text-[12px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                A 0.5% protocol fee is deducted on withdrawal. You will receive sBTC equivalent to your ysBTC shares minus fees.
              </p>
            </div>

            {/* CTA */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleWithdraw}
              disabled={isLoading || !amount || Number(amount) <= 0 || Number(amount) > maxShares}
              className="w-full py-4 rounded-[11px] font-syne font-bold text-[15px] border transition-all duration-[180ms] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: "transparent",
                borderColor: "var(--border)",
                color: "var(--text-2)",
              }}
              onMouseEnter={(e) => {
                if (!(e.currentTarget as HTMLButtonElement).disabled) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-hover)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text)";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-2)";
              }}
            >
              {isLoading ? "Awaiting signature..." : "Withdraw sBTC"}
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
