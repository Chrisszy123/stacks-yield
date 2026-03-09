"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWithdraw } from "@/hooks/useWithdraw";
import { useUserPosition } from "@/hooks/useUserPosition";
import { modalVariants, backdropVariants } from "@/lib/motion";

const MODAL_STYLE: React.CSSProperties = {
  background:              "rgba(13,13,21,0.92)",
  backdropFilter:          "blur(24px)",
  WebkitBackdropFilter:    "blur(24px)",
  border:                  "1px solid rgba(255,255,255,0.09)",
  boxShadow: [
    "0 4px 8px rgba(0,0,0,0.5)",
    "0 24px 64px rgba(0,0,0,0.4)",
    "inset 0 1px 0 rgba(255,255,255,0.07)",
  ].join(", "),
};

const INNER_STYLE: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border:     "1px solid rgba(255,255,255,0.08)",
};

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  userAddress: string;
}

export function WithdrawModal({ isOpen, onClose, userAddress }: WithdrawModalProps) {
  const [amount, setAmount]        = useState("");
  const { withdraw, isLoading }    = useWithdraw();
  const { data: position }         = useUserPosition(userAddress);
  const maxShares                  = position?.ysBtcShares ?? 0;

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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-0 z-50"
            style={{ background: "rgba(4,4,10,0.85)" }}
            onClick={onClose}
          />

          {/* Centering shell — flex, no transform */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          {/* Animated modal */}
          <motion.div
            key="modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-lg rounded-[16px] p-8 pointer-events-auto"
            style={MODAL_STYLE}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-7">
              <h2 className="font-syne font-bold text-[22px]" style={{ color: "var(--text)" }}>
                Withdraw sBTC
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-[8px] font-mono text-[16px] active:scale-[0.97]"
                style={{ color: "var(--text-muted)", background: "transparent", transition: "all 0.18s ease" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.07)";
                  (e.currentTarget as HTMLButtonElement).style.color      = "var(--text)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color      = "var(--text-muted)";
                }}
              >
                ✕
              </button>
            </div>

            {/* Available balance */}
            {position && (
              <div
                className="mb-6 p-5 rounded-[12px] flex items-center justify-between"
                style={INNER_STYLE}
              >
                <span className="font-sans text-[13px]" style={{ color: "var(--text-muted)" }}>
                  Available ysBTC
                </span>
                <span className="font-mono font-medium text-[16px]" style={{ color: "#f7931a" }}>
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
                className="withdraw-amount-wrap flex items-center rounded-[11px] px-4"
                style={{
                  background:  "rgba(255,255,255,0.04)",
                  borderWidth: "1.5px",
                  borderStyle: "solid",
                  borderColor: "rgba(255,255,255,0.08)",
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
                  className="flex-1 bg-transparent outline-none py-[14px] font-mono text-[22px]"
                  style={{ color: "var(--text)" }}
                  onFocus={(e) => {
                    const wrap = e.currentTarget.closest(".withdraw-amount-wrap") as HTMLDivElement;
                    if (wrap) {
                      wrap.style.borderColor = "rgba(247,147,26,0.40)";
                      wrap.style.boxShadow   = "0 0 0 3px rgba(247,147,26,0.06)";
                    }
                  }}
                  onBlur={(e) => {
                    const wrap = e.currentTarget.closest(".withdraw-amount-wrap") as HTMLDivElement;
                    if (wrap) {
                      wrap.style.borderColor = "rgba(255,255,255,0.08)";
                      wrap.style.boxShadow   = "none";
                    }
                  }}
                />
                {/* MAX button */}
                <button
                  onClick={setMax}
                  className="font-mono text-[11px] font-medium px-[9px] py-[5px] rounded-[6px] ml-2 active:scale-[0.97]"
                  style={{
                    background: "rgba(247,147,26,0.09)",
                    border:     "1px solid rgba(247,147,26,0.28)",
                    color:      "#f7931a",
                    transition: "all 0.18s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(247,147,26,0.16)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(247,147,26,0.09)";
                  }}
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Fee note */}
            <div className="mb-7 p-4 rounded-[12px]" style={INNER_STYLE}>
              <p className="font-sans text-[12px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                A 0.5% protocol fee is deducted on withdrawal. You will receive sBTC equivalent to
                your ysBTC shares minus fees.
              </p>
            </div>

            {/* CTA — ghost button spec */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleWithdraw}
              disabled={isLoading || !amount || Number(amount) <= 0 || Number(amount) > maxShares}
              className="w-full py-[14px] rounded-[11px] font-syne font-[800] text-[15px] tracking-[0.01em] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background:  "transparent",
                borderWidth: "1.5px",
                borderStyle: "solid",
                borderColor: "rgba(255,255,255,0.18)",
                color:       "#edecf2",
                transition:  "all 0.18s ease",
              }}
              onMouseEnter={(e) => {
                if (!(e.currentTarget as HTMLButtonElement).disabled) {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background  = "rgba(255,255,255,0.05)";
                  el.style.borderColor = "rgba(255,255,255,0.28)";
                  el.style.boxShadow   = "0 4px 16px rgba(0,0,0,0.25)";
                }
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background  = "transparent";
                el.style.borderColor = "rgba(255,255,255,0.18)";
                el.style.boxShadow   = "none";
              }}
            >
              {isLoading ? "Awaiting signature..." : "Withdraw sBTC"}
            </motion.button>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
