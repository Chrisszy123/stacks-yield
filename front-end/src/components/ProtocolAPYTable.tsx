"use client";
import { useProtocolAPYs } from "@/hooks/useProtocolAPYs";

const protocols = [
  {
    name: "Zest Protocol",
    key: "zest" as const,
    risk: "Low",
    tier: "Conservative",
    color: "#22c55e",
  },
  {
    name: "Bitflow",
    key: "bitflow" as const,
    risk: "Medium",
    tier: "Balanced",
    color: "#eab308",
  },
  {
    name: "ALEX",
    key: "alex" as const,
    risk: "High",
    tier: "Aggressive",
    color: "#ef4444",
  },
];

export function ProtocolAPYTable() {
  const { data: apys, isLoading } = useProtocolAPYs();

  return (
    <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-6">
      <h3 className="text-white font-bold text-lg mb-4">Live Protocol APYs</h3>
      <div className="space-y-1">
        {protocols.map((p) => (
          <div
            key={p.name}
            className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0"
          >
            <div>
              <p className="text-white font-medium">{p.name}</p>
              <p className="text-zinc-500 text-sm">{p.tier} tier</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-xl font-mono" style={{ color: p.color }}>
                {isLoading ? (
                  <span className="text-zinc-600 animate-pulse">...</span>
                ) : (
                  `${apys?.[p.key].toFixed(1) ?? "—"}%`
                )}
              </p>
              <p className="text-zinc-500 text-xs">{p.risk} risk</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
