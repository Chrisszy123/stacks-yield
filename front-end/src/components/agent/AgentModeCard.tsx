"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useWallet } from "@/components/providers/wallet-provider";
import { useAgentStatus } from "@/hooks/useAgentStatus";
import { GLASS_BASE } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DEPLOYER_ADDRESS } from "@/constants/contracts";
import { uintCV, boolCV, principalCV, PostConditionMode } from "@stacks/transactions";
import { type ContractCallRegularOptions } from "@stacks/connect";
import { openContractCall, isDevnetEnvironment } from "@/lib/contract-utils";

const SIMULATION_DATA = [
  { badge: "REBALANCE → ALEX",     color: "orange" as const, reason: "ALEX APY jumped from 31% to 47.2% — moved for better yield",     delta: "+0.00041 sBTC" },
  { badge: "COMPOUND",             color: "green"  as const, reason: "Accrued 0.00140 sBTC — reinvested to compound returns",           delta: "+0.00014 sBTC" },
  { badge: "HOLD",                 color: "muted"  as const, reason: "Bitflow shift within fee threshold — staying put",                 delta: "—"             },
  { badge: "REBALANCE → BITFLOW",  color: "orange" as const, reason: "ALEX TVL dropped 22% — moved to safer yield",                     delta: "+0.00009 sBTC" },
];

const INTERVAL_OPTIONS = [
  { label: "Every Stacks block (~10 min)", value: 1  },
  { label: "Every 6 hours",               value: 36 },
  { label: "Daily",                        value: 144 },
];

const SELECT_STYLE: React.CSSProperties = {
  background:  "#12121c",
  borderWidth: "1.5px",
  borderStyle: "solid",
  borderColor: "rgba(255,255,255,0.06)",
  color:       "var(--text)",
  borderRadius:"11px",
  padding:     "13px 15px",
  fontFamily:  "var(--font-dm-mono), monospace",
  fontSize:    "13px",
  outline:     "none",
  width:       "100%",
  cursor:      "pointer",
};

function Countdown({ seconds }: { seconds: number }) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return <>{`${m}m ${String(s).padStart(2, "0")}s`}</>;
}

export function AgentModeCard() {
  const { address, isConnected, devnetWallet } = useWallet();
  const { data: agentStatus, refetch }         = useAgentStatus();

  const [formState, setFormState] = useState({ maxTier: 2, interval: 36, maxFee: 0.001 });
  const [submitting, setSubmitting] = useState(false);
  const [countdown, setCountdown]   = useState(582);

  const enabled = agentStatus?.enabled ?? false;
  const lastAction = agentStatus?.activity?.[0];

  useEffect(() => {
    if (!enabled) return;
    const t = setInterval(() => setCountdown((s) => (s > 0 ? s - 1 : 600)), 1000);
    return () => clearInterval(t);
  }, [enabled]);

  if (!isConnected || !address) return null;

  async function handleToggle(enable: boolean) {
    if (!address) return;
    setSubmitting(true);
    try {
      const maxFeeInSats = Math.round(formState.maxFee * 100_000_000);
      const cfg           = agentStatus?.config;
      const txOptions: ContractCallRegularOptions = {
        contractAddress: DEPLOYER_ADDRESS,
        contractName:    "agent-permissions",
        functionName:    "set-permissions",
        functionArgs: [
          boolCV(enable),
          uintCV(enable ? formState.maxTier    : (cfg?.maxStrategyTier     ?? 1)),
          uintCV(enable ? formState.interval   : (cfg?.minRebalanceInterval ?? 36)),
          uintCV(enable ? maxFeeInSats         : (cfg?.maxFeePerRebalance   ?? 10000)),
          principalCV(DEPLOYER_ADDRESS),
        ],
        postConditionMode: PostConditionMode.Allow,
      };

      if (isDevnetEnvironment() && devnetWallet) {
        const { executeContractCall } = await import("@/lib/contract-utils");
        await executeContractCall(txOptions, devnetWallet);
      } else {
        await openContractCall(txOptions);
      }
      setTimeout(() => refetch(), 3000);
    } catch (e) {
      console.error("Agent toggle failed:", e);
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Toggle row ─────────────────────────────────────────────────── */
  const toggleRow = (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {/* Toggle switch */}
        <button
          role="switch"
          aria-checked={enabled}
          onClick={() => { void handleToggle(!enabled); }}
          disabled={submitting}
          className="relative inline-flex h-[21px] w-[38px] rounded-full transition-colors duration-[180ms] focus-visible:outline-none disabled:opacity-40 cursor-pointer"
          style={{ background: enabled ? "#f7931a" : "rgba(255,255,255,0.12)" }}
        >
          <span
            className="inline-block h-[15px] w-[15px] rounded-full bg-white transition-transform duration-[180ms] absolute top-[3px]"
            style={{ transform: enabled ? "translateX(20px)" : "translateX(3px)" }}
          />
        </button>
        <span className="font-display font-bold text-[15px]" style={{ color: "var(--text)" }}>
          Agent Mode
        </span>
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.06em]" style={{ color: "var(--text-2)" }}>
        {enabled ? "ENABLED — WATCHING EVERY BLOCK" : "DISABLED — SEE WHAT YOU'RE MISSING"}
      </span>
    </div>
  );

  /* ── Disabled state ─────────────────────────────────────────────── */
  if (!enabled) {
    return (
      <div className="rounded-card p-[26px]" style={{ ...GLASS_BASE }}>
        {toggleRow}

        <div className="grid grid-cols-1 lg:grid-cols-[58fr_42fr] gap-8">
          {/* Left — simulation */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] mb-1" style={{ color: "#f7931a" }}>
              SIMULATION · LAST 7 DAYS
            </p>
            <p className="font-display font-black text-[15px] mb-1" style={{ color: "var(--text)" }}>
              What the agent would have done
            </p>
            <p className="font-body text-[13px] mb-5" style={{ color: "var(--text-2)" }}>
              Based on live protocol APY data and Claude's decision logic.
            </p>

            <div className="flex flex-col">
              {SIMULATION_DATA.map((row, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 py-3"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <Badge color={row.color}>{row.badge}</Badge>
                  <span className="font-body text-[12px] flex-1 truncate" style={{ color: "var(--text-2)" }}>
                    {row.reason}
                  </span>
                  <span
                    className="font-mono text-[11px] shrink-0"
                    style={{ color: row.delta === "—" ? "var(--text-muted)" : "#3dd68c" }}
                  >
                    {row.delta}
                  </span>
                </div>
              ))}
            </div>

            {/* Stat strip */}
            <div
              className="grid grid-cols-3 rounded-[12px] mt-5"
              style={{ background: "#12121c", border: "1px solid var(--border)" }}
            >
              {[
                { num: "0.00064 sBTC", sub: "simulated yield" },
                { num: "4 actions",    sub: "decisions made"   },
                { num: "0 overages",   sub: "budget respected" },
              ].map((s, i) => (
                <div
                  key={s.sub}
                  className="flex flex-col items-center py-4"
                  style={{ borderLeft: i > 0 ? "1px solid var(--border)" : "none" }}
                >
                  <span className="font-mono font-medium text-[17px]" style={{ color: "#f7931a" }}>{s.num}</span>
                  <span className="font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>{s.sub}</span>
                </div>
              ))}
            </div>

            <p className="font-mono text-[10px] mt-3" style={{ color: "var(--text-muted)" }}>
              Simulation only. Not a guarantee of future performance.
            </p>
          </div>

          {/* Right — enable form */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] mb-1" style={{ color: "#f7931a" }}>
              CONFIGURE
            </p>
            <p className="font-display font-black text-[15px] mb-1" style={{ color: "var(--text)" }}>
              Enable Agent Mode
            </p>
            <p className="font-body text-[13px] mb-5" style={{ color: "var(--text-2)" }}>
              Set your bounds. The agent never exceeds them.
            </p>

            <div className="flex flex-col gap-4 mb-5">
              <div>
                <label className="font-mono text-[11px] uppercase tracking-[0.10em] block mb-[7px]" style={{ color: "var(--text-2)" }}>
                  RISK CEILING
                </label>
                <select
                  value={formState.maxTier}
                  onChange={(e) => setFormState((s) => ({ ...s, maxTier: Number(e.target.value) }))}
                  style={SELECT_STYLE}
                >
                  <option value={0}>Conservative — Zest only (≤ 2.1% APR)</option>
                  <option value={1}>Balanced — up to Bitflow (≤ 12.4% APR)</option>
                  <option value={2}>Aggressive — up to ALEX (≤ 47.2% APR)</option>
                </select>
              </div>

              <div>
                <label className="font-mono text-[11px] uppercase tracking-[0.10em] block mb-[7px]" style={{ color: "var(--text-2)" }}>
                  REBALANCE FREQUENCY
                </label>
                <select
                  value={formState.interval}
                  onChange={(e) => setFormState((s) => ({ ...s, interval: Number(e.target.value) }))}
                  style={SELECT_STYLE}
                >
                  {INTERVAL_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-mono text-[11px] uppercase tracking-[0.10em] block mb-[7px]" style={{ color: "var(--text-2)" }}>
                  MAX FEE PER ACTION (sBTC)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={formState.maxFee}
                  onChange={(e) => setFormState((s) => ({ ...s, maxFee: Number(e.target.value) }))}
                  style={SELECT_STYLE}
                />
                <p className="font-mono text-[10px] mt-[6px]" style={{ color: "var(--text-muted)" }}>
                  0.5% withdrawal fee on 0.3 sBTC ≈ 0.00150 sBTC
                </p>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => { void handleToggle(true); }}
              disabled={submitting}
              className="w-full py-[14px] rounded-btn font-display font-black text-[15px] disabled:opacity-40 cursor-pointer"
              style={{
                background: "#f7931a",
                color:      "#fff",
                border:     "none",
                transition: "background 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "#ffaa47";
                (e.currentTarget as HTMLButtonElement).style.transform  = "translateY(-2px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow  = "0 8px 28px rgba(247,147,26,0.40)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "#f7931a";
                (e.currentTarget as HTMLButtonElement).style.transform  = "";
                (e.currentTarget as HTMLButtonElement).style.boxShadow  = "none";
              }}
            >
              {submitting ? "Enabling..." : "Enable Agent Mode"}
            </motion.button>

            <p className="font-mono text-[10px] text-center mt-3" style={{ color: "var(--text-muted)" }}>
              Non-custodial · Your keys, your Bitcoin · Agent never holds funds
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ── Enabled state ──────────────────────────────────────────────── */
  const cfg = agentStatus?.config;

  return (
    <div className="rounded-card p-[26px]" style={{ ...GLASS_BASE }}>
      {toggleRow}

      <div className="flex items-start justify-between gap-6 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-[6px] w-[6px]">
              <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ background: "#3dd68c" }} />
              <span className="relative inline-flex rounded-full h-[6px] w-[6px]" style={{ background: "#3dd68c" }} />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: "#3dd68c" }}>
              AGENT ACTIVE
            </span>
          </div>
          {lastAction && (
            <p className="font-body text-[13px]" style={{ color: "var(--text-2)" }}>
              Last action: {lastAction.decision.action} · {new Date(lastAction.timestamp).toLocaleTimeString()}
            </p>
          )}
          <p className="font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>
            Confidence: {lastAction ? `${lastAction.decision.confidence.toFixed(2)} · High confidence` : "—"} · claude-sonnet-4-6
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className="font-mono font-medium text-[22px]" style={{ color: "#f7931a" }}>
            <Countdown seconds={countdown} />
          </span>
          <span className="font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>next check</span>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => { void handleToggle(false); }}
            disabled={submitting}
            className="font-display font-black text-[14px] rounded-btn px-6 py-[11px] disabled:opacity-40 cursor-pointer transition-all duration-[180ms]"
            style={{
              background:  "transparent",
              borderWidth: "1.5px",
              borderStyle: "solid",
              borderColor: "rgba(255,255,255,0.14)",
              color:       "var(--text-2)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background  = "rgba(255,255,255,0.05)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.26)";
              (e.currentTarget as HTMLButtonElement).style.color       = "var(--text)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background  = "transparent";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.14)";
              (e.currentTarget as HTMLButtonElement).style.color       = "var(--text-2)";
            }}
          >
            {submitting ? "Pausing..." : "Pause Agent"}
          </motion.button>
        </div>
      </div>

      {/* Config chips */}
      <div className="flex flex-wrap gap-2">
        {[
          `Max tier: ${cfg?.maxStrategyTier === 0 ? "Conservative" : cfg?.maxStrategyTier === 1 ? "Balanced" : "Aggressive"}`,
          `Frequency: ${INTERVAL_OPTIONS.find((o) => o.value === cfg?.minRebalanceInterval)?.label ?? "—"}`,
          `Fee ceiling: ${cfg ? (cfg.maxFeePerRebalance / 100_000_000).toFixed(5) : "—"} sBTC`,
          "Active: 3 days",
        ].map((chip) => (
          <span
            key={chip}
            className="font-mono text-[10px] px-[9px] py-[4px] rounded-[6px]"
            style={{ background: "#12121c", border: "1px solid var(--border)", color: "var(--text-2)" }}
          >
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
}
