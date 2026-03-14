"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAgentStatus, type ActivityItem } from "@/hooks/useAgentStatus";
import { GLASS_BASE } from "@/components/ui/card";
import { Badge, type BadgeColor } from "@/components/ui/badge";
import { slideExpand } from "@/lib/motion";
import { format as timeago } from "timeago.js";

const ACTION_COLOR: Record<string, BadgeColor> = {
  rebalance: "orange",
  defensive: "red",
  compound:  "green",
  hold:      "muted",
  alert:     "yellow",
};

function confidenceColor(c: number): string {
  if (c >= 0.8) return "#3dd68c";
  if (c >= 0.5) return "#f7931a";
  return "#f16a6a";
}

function ConfidenceBar({ confidence }: { confidence: number }) {
  return (
    <div className="w-[52px] h-[3px] rounded-full shrink-0" style={{ background: "#12121c" }}>
      <div
        className="h-full rounded-full"
        style={{
          width:      `${Math.round(confidence * 100)}%`,
          background: confidenceColor(confidence),
        }}
      />
    </div>
  );
}

function ActivityRow({
  item,
  expanded,
  onToggle,
}: {
  item:     ActivityItem;
  expanded: boolean;
  onToggle: () => void;
}) {
  const color  = ACTION_COLOR[item.decision.action] ?? "muted";
  const label  = item.decision.action.toUpperCase();

  return (
    <div
      className="cursor-pointer rounded-[8px] transition-colors duration-[150ms]"
      onClick={onToggle}
      style={{ margin: "0 -8px", padding: "0 8px" }}
      onMouseEnter={(e) => {
        if (!expanded) (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.02)";
      }}
      onMouseLeave={(e) => {
        if (!expanded) (e.currentTarget as HTMLDivElement).style.background = "transparent";
      }}
    >
      <div
        className="flex items-center gap-3 py-3"
        style={{ borderBottom: expanded ? "none" : "1px solid var(--border)" }}
      >
        <Badge color={color}>{label}</Badge>
        <p className="font-body text-[12px] flex-1 truncate" style={{ color: "var(--text-2)" }}>
          {item.decision.reason.slice(0, 80)}{item.decision.reason.length > 80 ? "…" : ""}
        </p>
        <ConfidenceBar confidence={item.decision.confidence} />
        <span className="font-mono text-[10px] shrink-0" style={{ color: "var(--text-muted)" }}>
          {timeago(item.timestamp)}
        </span>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            key="expand"
            variants={slideExpand}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden"
          >
            <div
              className="mt-2 mb-3 rounded-input px-[14px] py-[14px]"
              style={{
                background:  "#12121c",
                border:      "1px solid var(--border)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <p className="font-mono text-[11px] leading-[1.9]" style={{ color: "var(--text)" }}>
                "{item.decision.reason}"
              </p>

              {item.decision.dataPoints && item.decision.dataPoints.length > 0 && (
                <>
                  <p className="font-mono text-[10px] uppercase tracking-[0.08em] mt-3 mb-1" style={{ color: "var(--text-muted)" }}>
                    Data points considered:
                  </p>
                  {item.decision.dataPoints.map((dp, i) => (
                    <p key={i} className="font-mono text-[11px] leading-[1.9]" style={{ color: "var(--text-2)" }}>
                      · {dp}
                    </p>
                  ))}
                </>
              )}

              <p className="font-mono text-[11px] mt-2" style={{ color: "var(--text-muted)" }}>
                Decision confidence:{" "}
                <span style={{ color: confidenceColor(item.decision.confidence) }}>
                  {item.decision.confidence.toFixed(2)}
                </span>
                {item.decision.confidence >= 0.8 ? " · High confidence" : item.decision.confidence >= 0.5 ? " · Moderate confidence" : " · Low confidence"}
              </p>

              {item.txId && item.txId !== "hold" && (
                <p className="font-mono text-[11px] mt-1">
                  <span style={{ color: "var(--text-muted)" }}>On-chain tx: </span>
                  <a
                    href={`https://explorer.hiro.so/txid/${item.txId}?chain=testnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#f7931a" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.txId.slice(0, 6)}...{item.txId.slice(-4)} ↗
                  </a>
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AgentActivityFeed() {
  const { data: agentStatus }       = useAgentStatus();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const activity   = agentStatus?.activity ?? [];
  const isEnabled  = agentStatus?.enabled ?? false;

  return (
    <div className="rounded-card p-[26px]" style={{ ...GLASS_BASE }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] mb-1" style={{ color: "#f7931a" }}>
            ACTIVITY
          </p>
          <p className="font-display font-black text-[15px]" style={{ color: "var(--text)" }}>
            Agent Decisions
          </p>
        </div>
        {isEnabled && (
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-[5px] w-[5px]">
              <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ background: "#3dd68c" }} />
              <span className="relative inline-flex rounded-full h-[5px] w-[5px]" style={{ background: "#3dd68c" }} />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.06em]" style={{ color: "#3dd68c" }}>
              LIVE
            </span>
          </div>
        )}
      </div>

      {activity.length === 0 ? (
        <p className="font-mono text-[12px] text-center py-8" style={{ color: "var(--text-muted)" }}>
          Agent is watching. No actions taken yet.
        </p>
      ) : (
        <div>
          {activity.map((item) => (
            <ActivityRow
              key={item.id}
              item={item}
              expanded={expandedId === item.id}
              onToggle={() => setExpandedId((p) => (p === item.id ? null : item.id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
