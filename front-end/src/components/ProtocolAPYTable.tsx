"use client";
import { useProtocolAPYs } from "@/hooks/useProtocolAPYs";
import { Skeleton } from "@/components/ui/skeleton";

const protocols = [
  {
    name: "Zest Protocol",
    key: "zest" as const,
    risk: "Low",
    tier: "Conservative",
    apy_color: "var(--green)",
    risk_badge: "green" as const,
  },
  {
    name: "Bitflow",
    key: "bitflow" as const,
    risk: "Medium",
    tier: "Balanced",
    apy_color: "var(--yellow)",
    risk_badge: "yellow" as const,
  },
  {
    name: "ALEX",
    key: "alex" as const,
    risk: "High",
    tier: "Aggressive",
    apy_color: "var(--red)",
    risk_badge: "red" as const,
  },
];

const badgeStyle = {
  green:  { color: "var(--green)",  background: "rgba(61,214,140,0.1)",  border: "1px solid rgba(61,214,140,0.3)"  },
  yellow: { color: "var(--yellow)", background: "rgba(245,200,66,0.1)",  border: "1px solid rgba(245,200,66,0.3)"  },
  red:    { color: "var(--red)",    background: "rgba(241,106,106,0.1)", border: "1px solid rgba(241,106,106,0.3)" },
};

export function ProtocolAPYTable() {
  const { data: apys, isLoading } = useProtocolAPYs();

  return (
    <div
      className="rounded-[16px] overflow-hidden"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="p-[26px] pb-0">
        <h3 className="font-syne font-bold text-[15px] mb-5" style={{ color: "var(--text)" }}>
          Live Protocol APYs
        </h3>
      </div>

      <div>
        {protocols.map((p, i) => (
          <div
            key={p.name}
            className="flex items-center justify-between px-[26px] py-4 transition-colors duration-[180ms]"
            style={{
              borderTop: i === 0 ? "none" : "1px solid var(--border)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = "var(--surface-2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = "";
            }}
          >
            <div className="flex items-center gap-3">
              <div>
                <p className="font-syne font-bold text-[14px]" style={{ color: "var(--text)" }}>
                  {p.name}
                </p>
                <p className="font-sans text-[13px]" style={{ color: "var(--text-muted)" }}>
                  {p.tier} tier
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className="font-mono text-[11px] px-[9px] py-[3px] rounded-[6px]"
                style={badgeStyle[p.risk_badge]}
              >
                {p.risk}
              </span>
              <div className="text-right min-w-[56px]">
                {isLoading ? (
                  <Skeleton className="h-6 w-14" />
                ) : (
                  <p className="font-mono font-medium text-[20px]" style={{ color: p.apy_color }}>
                    {apys?.[p.key] !== undefined ? `${apys[p.key].toFixed(1)}%` : "—"}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
