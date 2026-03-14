"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@/components/providers/wallet-provider";
import { useAgentStatus } from "@/hooks/useAgentStatus";
import { GLASS_BASE } from "@/components/ui/card";
import { DEPLOYER_ADDRESS } from "@/constants/contracts";
import {
  request,
  type ContractCallRegularOptions,
} from "@stacks/connect";
import {
  uintCV,
  boolCV,
  principalCV,
  PostConditionMode,
} from "@stacks/transactions";
import { openContractCall, isDevnetEnvironment } from "@/lib/contract-utils";
import { DevnetWallet } from "@/lib/devnet-wallet-context";

const STRATEGY_LABELS: Record<number, string> = {
  0: "Conservative",
  1: "Balanced",
  2: "Aggressive",
};

const INTERVAL_OPTIONS = [
  { label: "Every block", value: 1 },
  { label: "Every 6 hours", value: 36 },
  { label: "Daily", value: 144 },
];

const SIMULATION_ACTIONS = [
  {
    action: "rebalance",
    reason: "Would have moved to Bitflow when APY jumped from 8% to 14%",
    gain: "+0.12% yield captured",
    color: "#f7931a",
  },
  {
    action: "compound",
    reason: "Would have auto-compounded 0.003 sBTC of accrued yield",
    gain: "+0.003 sBTC reinvested",
    color: "#3dd68c",
  },
  {
    action: "defensive",
    reason: "Would have moved to conservative when TVL dropped 25%",
    gain: "Protected against potential loss",
    color: "#f16a6a",
  },
];

export function AgentModeCard() {
  const { address, isConnected, devnetWallet } = useWallet();
  const { data: agentStatus, isLoading, refetch } = useAgentStatus();
  const [formState, setFormState] = useState({
    maxTier: 1,
    interval: 36,
    maxFee: 10000,
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isConnected || !address) return null;

  const enabled = agentStatus?.enabled ?? false;

  async function handleEnable() {
    if (!address) return;
    setSubmitting(true);

    try {
      const txOptions: ContractCallRegularOptions = {
        contractAddress: DEPLOYER_ADDRESS,
        contractName: "agent-permissions",
        functionName: "set-permissions",
        functionArgs: [
          boolCV(true),
          uintCV(formState.maxTier),
          uintCV(formState.interval),
          uintCV(formState.maxFee),
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
      console.error("Failed to enable agent:", e);
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePause() {
    if (!address) return;
    setSubmitting(true);

    try {
      const txOptions: ContractCallRegularOptions = {
        contractAddress: DEPLOYER_ADDRESS,
        contractName: "agent-permissions",
        functionName: "set-permissions",
        functionArgs: [
          boolCV(false),
          uintCV(agentStatus?.config?.maxStrategyTier ?? 1),
          uintCV(agentStatus?.config?.minRebalanceInterval ?? 36),
          uintCV(agentStatus?.config?.maxFeePerRebalance ?? 10000),
          principalCV(agentStatus?.config?.keeperAddress ?? DEPLOYER_ADDRESS),
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
      console.error("Failed to pause agent:", e);
    } finally {
      setSubmitting(false);
    }
  }

  if (enabled) {
    const lastAction = agentStatus?.activity?.[0];
    return (
      <div className="rounded-[16px] p-[26px]" style={{ ...GLASS_BASE }}>
        <div className="flex items-center justify-between mb-5">
          <h3
            className="font-syne font-bold text-[15px]"
            style={{ color: "var(--text)" }}
          >
            AI Agent Mode
          </h3>
          <span
            className="font-mono text-[11px] px-[9px] py-[3px] rounded-[6px]"
            style={{
              color: "#3dd68c",
              background: "rgba(61,214,140,0.1)",
              border: "1px solid rgba(61,214,140,0.3)",
            }}
          >
            Agent Active
          </span>
        </div>

        {lastAction && (
          <div className="mb-4">
            <p
              className="font-sans text-[13px]"
              style={{ color: "var(--text-2)" }}
            >
              Last action:{" "}
              <span style={{ color: "var(--text)" }}>
                {lastAction.decision.reason}
              </span>
            </p>
          </div>
        )}

        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex-1 rounded-[8px] p-3"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <p
              className="font-mono text-[10px] uppercase tracking-wider mb-1"
              style={{ color: "var(--text-muted)" }}
            >
              Strategy Cap
            </p>
            <p
              className="font-mono text-[14px]"
              style={{ color: "var(--text)" }}
            >
              {STRATEGY_LABELS[agentStatus?.config?.maxStrategyTier ?? 0]}
            </p>
          </div>
          <div
            className="flex-1 rounded-[8px] p-3"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <p
              className="font-mono text-[10px] uppercase tracking-wider mb-1"
              style={{ color: "var(--text-muted)" }}
            >
              Frequency
            </p>
            <p
              className="font-mono text-[14px]"
              style={{ color: "var(--text)" }}
            >
              {INTERVAL_OPTIONS.find(
                (o) => o.value === agentStatus?.config?.minRebalanceInterval
              )?.label ?? `${agentStatus?.config?.minRebalanceInterval} blocks`}
            </p>
          </div>
        </div>

        <button
          onClick={handlePause}
          disabled={submitting}
          className="w-full py-3 rounded-[11px] font-syne font-bold text-[14px] active:scale-[0.97] disabled:opacity-40"
          style={{
            background: "transparent",
            borderWidth: "1.5px",
            borderStyle: "solid",
            borderColor: "rgba(255,255,255,0.18)",
            color: "#edecf2",
            transition: "all 0.18s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
          }}
        >
          {submitting ? "Pausing..." : "Pause Agent"}
        </button>
      </div>
    );
  }

  // Disabled state — simulation + enable form
  return (
    <div className="rounded-[16px] p-[26px]" style={{ ...GLASS_BASE }}>
      <h3
        className="font-syne font-bold text-[15px] mb-2"
        style={{ color: "var(--text)" }}
      >
        AI Agent Mode
      </h3>
      <p
        className="font-sans text-[13px] mb-5"
        style={{ color: "var(--text-2)" }}
      >
        If the agent had been running for the past 7 days, here is what it would
        have done:
      </p>

      <div className="space-y-3 mb-6">
        {SIMULATION_ACTIONS.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-3 rounded-[10px] p-3"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <div
              className="w-2 h-2 rounded-full mt-1.5 shrink-0"
              style={{ background: item.color }}
            />
            <div className="flex-1 min-w-0">
              <p
                className="font-sans text-[13px]"
                style={{ color: "var(--text)" }}
              >
                {item.reason}
              </p>
              <p
                className="font-mono text-[11px] mt-1"
                style={{ color: item.color }}
              >
                {item.gain}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div
        className="rounded-[10px] p-4 mb-4"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <p
          className="font-mono text-[11px] uppercase tracking-wider mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          Configure Agent
        </p>

        <div className="space-y-3">
          <div>
            <label
              className="font-sans text-[12px] block mb-1"
              style={{ color: "var(--text-2)" }}
            >
              Max Strategy Tier
            </label>
            <select
              value={formState.maxTier}
              onChange={(e) =>
                setFormState((s) => ({ ...s, maxTier: Number(e.target.value) }))
              }
              className="w-full rounded-[8px] px-3 py-2 font-mono text-[13px]"
              style={{
                background: "rgba(0,0,0,0.3)",
                color: "var(--text)",
                border: "1px solid rgba(255,255,255,0.1)",
                outline: "none",
              }}
            >
              <option value={0}>Conservative (Zest only)</option>
              <option value={1}>Balanced (Zest + Bitflow)</option>
              <option value={2}>Aggressive (all protocols)</option>
            </select>
          </div>

          <div>
            <label
              className="font-sans text-[12px] block mb-1"
              style={{ color: "var(--text-2)" }}
            >
              Rebalance Frequency
            </label>
            <select
              value={formState.interval}
              onChange={(e) =>
                setFormState((s) => ({
                  ...s,
                  interval: Number(e.target.value),
                }))
              }
              className="w-full rounded-[8px] px-3 py-2 font-mono text-[13px]"
              style={{
                background: "rgba(0,0,0,0.3)",
                color: "var(--text)",
                border: "1px solid rgba(255,255,255,0.1)",
                outline: "none",
              }}
            >
              {INTERVAL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="font-sans text-[12px] block mb-1"
              style={{ color: "var(--text-2)" }}
            >
              Max Fee per Rebalance (sats)
            </label>
            <input
              type="number"
              value={formState.maxFee}
              onChange={(e) =>
                setFormState((s) => ({
                  ...s,
                  maxFee: Number(e.target.value),
                }))
              }
              className="w-full rounded-[8px] px-3 py-2 font-mono text-[13px]"
              style={{
                background: "rgba(0,0,0,0.3)",
                color: "var(--text)",
                border: "1px solid rgba(255,255,255,0.1)",
                outline: "none",
              }}
              min={0}
            />
          </div>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleEnable}
        disabled={submitting}
        className="w-full py-[14px] rounded-[11px] font-syne font-[800] text-[15px] tracking-[0.01em] disabled:opacity-40"
        style={{
          background: "#f7931a",
          color: "#ffffff",
          transition:
            "background 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#ffaa47";
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow =
            "0 8px 28px rgba(247,147,26,0.40)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#f7931a";
          e.currentTarget.style.transform = "";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {submitting ? "Enabling..." : "Enable Agent Mode"}
      </motion.button>
    </div>
  );
}
