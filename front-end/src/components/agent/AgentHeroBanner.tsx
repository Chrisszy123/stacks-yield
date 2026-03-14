"use client";
import { useEffect, useState } from "react";
import { useAgentStatus } from "@/hooks/useAgentStatus";
import { GLASS_BASE } from "@/components/ui/card";

interface AgentHeroBannerProps {
  onEnableClick?: () => void;
}

function Countdown({ seconds }: { seconds: number }) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return <>{`${m}m ${String(s).padStart(2, "0")}s`}</>;
}

export function AgentHeroBanner({ onEnableClick }: AgentHeroBannerProps) {
  const { data: agentStatus } = useAgentStatus();
  const [countdown, setCountdown] = useState(582);

  useEffect(() => {
    if (!agentStatus?.enabled) return;
    const t = setInterval(() => setCountdown((s) => (s > 0 ? s - 1 : 600)), 1000);
    return () => clearInterval(t);
  }, [agentStatus?.enabled]);

  const enabled   = agentStatus?.enabled ?? false;
  const lastAction = agentStatus?.activity?.[0];

  return (
    <div
      className="flex items-center justify-between gap-4 rounded-[14px] px-5 py-0 h-[66px] overflow-hidden"
      style={{
        ...GLASS_BASE,
        borderLeft: `2px solid ${enabled ? "#3dd68c" : "var(--text-muted)"}`,
        padding:    "0 20px",
      }}
    >
      {/* Left */}
      <div className="shrink-0">
        {enabled ? (
          <div className="flex items-center gap-2">
            <span className="relative flex h-[6px] w-[6px] shrink-0">
              <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ background: "#3dd68c" }} />
              <span className="relative inline-flex rounded-full h-[6px] w-[6px]" style={{ background: "#3dd68c" }} />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: "#3dd68c" }}>
              AGENT ACTIVE
            </span>
          </div>
        ) : (
          <span className="font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: "var(--text-muted)" }}>
            AGENT OFFLINE
          </span>
        )}
      </div>

      {/* Center */}
      <div className="flex-1 min-w-0">
        {enabled ? (
          <p className="font-body text-[13px] truncate" style={{ color: "var(--text-2)" }}>
            {lastAction
              ? `Last action: ${lastAction.decision.action} · ${new Date(lastAction.timestamp).toLocaleTimeString()}`
              : "Watching. No actions taken yet."}
          </p>
        ) : (
          <p className="font-body text-[13px]" style={{ color: "var(--red)" }}>
            Your Bitcoin is earning 0% right now.
          </p>
        )}
      </div>

      {/* Right */}
      <div className="shrink-0 flex items-center gap-3">
        {enabled ? (
          <div className="flex flex-col items-end">
            <span className="font-mono font-medium text-[16px]" style={{ color: "#f7931a" }}>
              Next check: <Countdown seconds={countdown} />
            </span>
            <span className="font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>
              claude-sonnet-4-6 · {lastAction ? `${lastAction.decision.confidence.toFixed(2)} confidence` : "—"}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="font-mono text-[12px]" style={{ color: "var(--text-2)" }}>
              Best available:{" "}
              <span style={{ color: "#f7931a" }}>47.2%</span> APR on ALEX
              <span className="cursor-blink ml-[1px]" style={{ color: "#f7931a" }}>▋</span>
            </span>
            <button
              onClick={onEnableClick}
              className="font-mono text-[10px] px-3 py-[5px] rounded-[8px] cursor-pointer transition-opacity duration-[180ms] hover:opacity-80"
              style={{ background: "#f7931a", color: "#fff", border: "none" }}
            >
              ↳ Enable Agent
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
