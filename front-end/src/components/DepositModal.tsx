"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StrategySelector } from "./StrategySelector";
import { useDeposit } from "@/hooks/useDeposit";
import { StrategyId } from "@/constants/protocols";
import { modalVariants, backdropVariants } from "@/lib/motion";

/* ── Shared glass surface for the modal shell ───────────────────────── */
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

/* ── Inner surface (inputs, preview) ───────────────────────────────── */
const INNER_STYLE: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border:     "1px solid rgba(255,255,255,0.08)",
};

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const [amount, setAmount]     = useState("");
  const [strategy, setStrategy] = useState<StrategyId>(1);
  const { deposit, isLoading }  = useDeposit();

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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-0 z-50"
            style={{ background: "rgba(4,4,10,0.85)" }}
            onClick={onClose}
          />

          {/* Centering shell — flex, no transform, so framer-motion scale/y never conflict */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          {/* Animated modal */}
          <motion.div
            key="modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[16px] p-8 pointer-events-auto"
            style={MODAL_STYLE}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-7">
              <h2 className="font-syne font-bold text-[22px]" style={{ color: "var(--text)" }}>
                Deposit sBTC
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

            {/* Amount input */}
            <div className="mb-7">
              <label
                className="font-mono text-[11px] uppercase tracking-[0.12em] block mb-2"
                style={{ color: "var(--text-muted)" }}
              >
                Amount (sBTC)
              </label>
              <div
                className="deposit-amount-wrap flex items-center rounded-[11px] px-4"
                style={{
                  background:  "rgba(255,255,255,0.04)",
                  borderWidth: "1.5px",
                  borderStyle: "solid",
                  borderColor: "rgba(255,255,255,0.08)",
                  transition:  "border-color 0.18s ease, box-shadow 0.18s ease",
                }}
              >
                <span className="font-mono text-[18px] mr-3" style={{ color: "#f7931a" }}>₿</span>
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
                      wrap.style.borderColor = "rgba(247,147,26,0.40)";
                      wrap.style.boxShadow   = "0 0 0 3px rgba(247,147,26,0.06)";
                    }
                  }}
                  onBlur={(e) => {
                    const wrap = e.currentTarget.closest(".deposit-amount-wrap") as HTMLDivElement;
                    if (wrap) {
                      wrap.style.borderColor = "rgba(255,255,255,0.08)";
                      wrap.style.boxShadow   = "none";
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
                style={INNER_STYLE}
              >
                <p className="font-sans text-[13px] mb-1" style={{ color: "var(--text-muted)" }}>
                  You will receive approximately
                </p>
                <p className="font-mono font-medium text-[22px]" style={{ color: "#f7931a" }}>
                  {Number(amount).toFixed(8)} ysBTC
                </p>
                <p className="font-sans text-[12px] mt-1" style={{ color: "var(--text-muted)" }}>
                  Exact amount calculated at time of deposit
                </p>
              </motion.div>
            )}

            {/* CTA — primary button spec */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleDeposit}
              disabled={isLoading || !amount || Number(amount) <= 0}
              className="w-full py-[14px] rounded-[11px] font-syne font-[800] text-[15px] tracking-[0.01em] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: "#f7931a",
                color:      "#ffffff",
                transition: "background 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
              }}
              onMouseEnter={(e) => {
                if (!(e.currentTarget as HTMLButtonElement).disabled) {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = "#ffaa47";
                  el.style.transform  = "translateY(-2px)";
                  el.style.boxShadow  = "0 8px 28px rgba(247,147,26,0.40)";
                }
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = "#f7931a";
                el.style.transform  = "";
                el.style.boxShadow  = "none";
              }}
            >
              {isLoading ? "Awaiting signature..." : "Deposit sBTC"}
            </motion.button>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
