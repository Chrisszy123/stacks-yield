"use client";
import { motion } from "framer-motion";

/* ── Step icon components ────────────────────────────────────────────── */

function DepositIcon() {
  return (
    <svg width="22" height="20" viewBox="0 0 22 20" fill="none" aria-hidden="true">
      {/* Downward arrow */}
      <line x1="11" y1="1" x2="11" y2="13" stroke="rgba(247,147,26,0.9)" strokeWidth="2" strokeLinecap="round" />
      <path d="M 7,9 L 11,14 L 15,9" stroke="rgba(247,147,26,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Base line (vault shelf) */}
      <line x1="2" y1="18" x2="20" y2="18" stroke="rgba(247,147,26,0.65)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function EarnIcon() {
  return (
    <svg width="22" height="20" viewBox="0 0 22 20" fill="none" aria-hidden="true">
      {/* Trending line */}
      <polyline points="2,16 7,10 12,12 19,4" stroke="rgba(247,147,26,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Spark at top */}
      <line x1="19" y1="4" x2="19" y2="1"   stroke="rgba(247,147,26,0.7)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="17" y1="5" x2="15" y2="3"   stroke="rgba(247,147,26,0.5)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="21" y1="5" x2="22" y2="3"   stroke="rgba(247,147,26,0.5)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function WithdrawIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      {/* Circle */}
      <circle cx="11" cy="11" r="8" stroke="rgba(247,147,26,0.55)" strokeWidth="1.5" />
      {/* Outward arrow */}
      <line x1="11" y1="11" x2="17" y2="11" stroke="rgba(247,147,26,0.9)" strokeWidth="2" strokeLinecap="round" />
      <path d="M 14,8 L 17,11 L 14,14" stroke="rgba(247,147,26,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/* ── Connector — horizontal (desktop) ───────────────────────────────── */
function HConnector() {
  return (
    <div className="hidden md:flex items-start flex-1 pt-7 px-1">
      <svg
        viewBox="0 0 100 16"
        preserveAspectRatio="none"
        className="w-full"
        height="16"
        aria-hidden="true"
      >
        {/* Dashed line with marching ants */}
        <motion.line
          x1="0" y1="8" x2="100" y2="8"
          stroke="rgba(247,147,26,0.22)"
          strokeWidth="1.5"
          strokeDasharray="5 4"
          animate={{ strokeDashoffset: [0, -18] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        />
        {/* Traveling dot */}
        <motion.circle
          cy="8"
          r="3"
          fill="#f7931a"
          animate={{ cx: [0, 100] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.4 }}
        />
      </svg>
    </div>
  );
}

/* ── Connector — vertical (mobile) ──────────────────────────────────── */
function VConnector() {
  return (
    <div className="flex md:hidden justify-center my-1" aria-hidden="true">
      <svg viewBox="0 0 16 48" width="16" height="48">
        <motion.line
          x1="8" y1="0" x2="8" y2="48"
          stroke="rgba(247,147,26,0.22)"
          strokeWidth="1.5"
          strokeDasharray="5 4"
          animate={{ strokeDashoffset: [0, -18] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        />
        <motion.circle
          cx="8"
          r="3"
          fill="#f7931a"
          animate={{ cy: [0, 48] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.4 }}
        />
      </svg>
    </div>
  );
}

/* ── Step node ───────────────────────────────────────────────────────── */
const ICONS = [<DepositIcon key="d" />, <EarnIcon key="e" />, <WithdrawIcon key="w" />];

const steps = [
  {
    step: "01",
    title: "Deposit sBTC",
    desc:  "Lock sBTC in the vault. Choose Conservative, Balanced, or Aggressive.",
  },
  {
    step: "02",
    title: "Receive ysBTC",
    desc:  "Get ysBTC receipt tokens representing your proportional vault share.",
  },
  {
    step: "03",
    title: "Earn & Withdraw",
    desc:  "Your sBTC earns across protocols. Withdraw anytime by burning ysBTC.",
  },
];

const nodeVariants = {
  hidden:  { opacity: 0, scale: 0.8, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    scale:   1,
    y:       0,
    transition: {
      type:      "spring" as const,
      stiffness: 300,
      damping:   24,
      delay:     i * 0.15,
    },
  }),
};

/* ── Main export ─────────────────────────────────────────────────────── */
export function HowItWorksIllustration() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="flex flex-col md:flex-row items-center md:items-start"
    >
      {steps.map((s, i) => (
        <div key={s.step} className="flex flex-col md:flex-row items-center flex-1 w-full md:w-auto">
          {/* Node */}
          <motion.div
            custom={i}
            variants={nodeVariants}
            className="flex flex-col items-center text-center w-full md:w-auto flex-shrink-0"
            style={{ maxWidth: "200px" }}
          >
            {/* Circle */}
            <div
              className="flex items-center justify-center mb-4 relative"
              style={{
                width:              "56px",
                height:             "56px",
                borderRadius:       "50%",
                background:         "rgba(255,255,255,0.04)",
                backdropFilter:     "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border:             "1.5px solid rgba(247,147,26,0.35)",
                boxShadow:          "0 0 20px rgba(247,147,26,0.08)",
                flexShrink:         0,
              }}
            >
              {ICONS[i]}
              {/* Step number badge */}
              <span
                className="absolute -top-2 -right-2 font-syne font-[800] text-[10px] flex items-center justify-center"
                style={{
                  width:        "18px",
                  height:       "18px",
                  borderRadius: "50%",
                  background:   "#f7931a",
                  color:        "#000",
                }}
              >
                {i + 1}
              </span>
            </div>

            {/* Label */}
            <p className="font-syne font-bold text-[14px] mb-1" style={{ color: "var(--text)" }}>
              {s.title}
            </p>
            <p className="font-sans text-[13px] leading-relaxed" style={{ color: "var(--text-2)", maxWidth: "160px" }}>
              {s.desc}
            </p>
          </motion.div>

          {/* Connector (only between nodes, not after the last) */}
          {i < steps.length - 1 && (
            <>
              <HConnector />
              <VConnector />
            </>
          )}
        </div>
      ))}
    </motion.div>
  );
}
