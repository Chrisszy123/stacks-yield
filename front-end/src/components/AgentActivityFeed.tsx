"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAgentStatus, type ActivityItem } from "@/hooks/useAgentStatus";
import { GLASS_BASE } from "@/components/ui/card";
import { format as timeago } from "timeago.js";

const ACTION_COLORS: Record<string, string> = {
  rebalance: "#f7931a",
  defensive: "#f16a6a",
  compound: "#3dd68c",
  hold: "var(--text-muted)",
  alert: "#f5c842",
};

const ACTION_LABELS: Record<string, string> = {
  rebalance: "Rebalance",
  defensive: "Defensive",
  compound: "Compound",
  hold: "Hold",
  alert: "Alert",
};

export function AgentActivityFeed() {
  const { data: agentStatus } = useAgentStatus();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const activity = agentStatus?.activity ?? [];

  if (activity.length === 0) {
    return (
      <div className="rounded-[16px] p-[26px]" style={{ ...GLASS_BASE }}>
        <h3
          className="font-syne font-bold text-[15px] mb-4"
          style={{ color: "var(--text)" }}
        >
          Agent Activity
        </h3>
        <p
          className="font-mono text-[13px]"
          style={{ color: "var(--text-muted)" }}
        >
          Agent is watching. No actions taken yet.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[16px] p-[26px]" style={{ ...GLASS_BASE }}>
      <h3
        className="font-syne font-bold text-[15px] mb-4"
        style={{ color: "var(--text)" }}
      >
        Agent Activity
      </h3>

      <div className="space-y-2">
        {activity.map((item) => (
          <ActivityRow
            key={item.id}
            item={item}
            expanded={expandedId === item.id}
            onToggle={() =>
              setExpandedId((prev) => (prev === item.id ? null : item.id))
            }
          />
        ))}
      </div>
    </div>
  );
}

function ActivityRow({
  item,
  expanded,
  onToggle,
}: {
  item: ActivityItem;
  expanded: boolean;
  onToggle: () => void;
}) {
  const color = ACTION_COLORS[item.decision.action] ?? "var(--text-muted)";
  const label = ACTION_LABELS[item.decision.action] ?? item.decision.action;

  return (
    <div
      className="rounded-[10px] overflow-hidden cursor-pointer"
      style={{
        background: expanded ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
        transition: "background 0.15s ease",
      }}
      onClick={onToggle}
      onMouseEnter={(e) => {
        if (!expanded) e.currentTarget.style.background = "rgba(255,255,255,0.04)";
      }}
      onMouseLeave={(e) => {
        if (!expanded) e.currentTarget.style.background = "rgba(255,255,255,0.02)";
      }}
    >
      <div className="flex items-center gap-3 p-3">
        <div
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: color }}
        />
        <span
          className="font-mono text-[11px] font-bold uppercase tracking-wider shrink-0 min-w-[80px]"
          style={{ color }}
        >
          {label}
        </span>
        <p
          className="font-sans text-[13px] flex-1 truncate"
          style={{ color: "var(--text)" }}
        >
          {item.decision.reason}
        </p>
        <span
          className="font-mono text-[11px] shrink-0"
          style={{ color: "var(--text-muted)" }}
        >
          {timeago(item.timestamp)}
        </span>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              className="px-3 pb-3 pt-1"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center gap-4 mb-2">
                <span
                  className="font-mono text-[11px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  Confidence:{" "}
                  <span style={{ color: "var(--text)" }}>
                    {(item.decision.confidence * 100).toFixed(0)}%
                  </span>
                </span>
                {item.decision.urgency && (
                  <span
                    className="font-mono text-[11px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Urgency:{" "}
                    <span style={{ color: "var(--text)" }}>
                      {item.decision.urgency}
                    </span>
                  </span>
                )}
                {item.txId && item.txId !== "hold" && (
                  <span
                    className="font-mono text-[10px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    tx:{" "}
                    <span style={{ color: "var(--accent)" }}>
                      {item.txId.slice(0, 10)}...
                    </span>
                  </span>
                )}
              </div>

              {item.decision.dataPoints && item.decision.dataPoints.length > 0 && (
                <div className="space-y-1">
                  {item.decision.dataPoints.map((dp, i) => (
                    <p
                      key={i}
                      className="font-mono text-[11px]"
                      style={{ color: "var(--text-2)" }}
                    >
                      &bull; {dp}
                    </p>
                  ))}
                </div>
              )}

              {item.molbotCalls && item.molbotCalls.length > 0 && (
                <div className="mt-2 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                  <p
                    className="font-mono text-[10px] uppercase tracking-wider mb-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Molbot calls
                  </p>
                  {item.molbotCalls.map((call, i) => (
                    <p
                      key={i}
                      className="font-mono text-[11px]"
                      style={{ color: "var(--text-2)" }}
                    >
                      {call.service} — {call.cost} sats
                    </p>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
