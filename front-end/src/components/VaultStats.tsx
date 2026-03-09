"use client";
import { useVaultStats } from "@/hooks/useVaultStats";

export function VaultStats() {
  const { data, isLoading } = useVaultStats();

  const stats = [
    {
      label: "Total Value Locked",
      value: data ? `${data.totalSbtc.toFixed(4)} sBTC` : "—",
    },
    {
      label: "ysBTC in Circulation",
      value: data ? `${data.totalYsbtc.toFixed(4)} ysBTC` : "—",
    },
    {
      label: "Protocol Fee",
      value: data ? `${(data.feeBps / 100).toFixed(2)}%` : "—",
    },
    {
      label: "Status",
      value: data?.paused ? "⚠️ Paused" : "✅ Active",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl bg-zinc-900 border border-zinc-800 p-5"
        >
          <p className="text-zinc-500 text-sm mb-1">{stat.label}</p>
          <p className="text-white font-bold text-xl font-mono">
            {isLoading ? (
              <span className="animate-pulse text-zinc-600">Loading...</span>
            ) : (
              stat.value
            )}
          </p>
        </div>
      ))}
    </div>
  );
}
