"use client";
import { useVaultStats } from "@/hooks/useVaultStats";
import { Skeleton } from "@/components/ui/skeleton";

const statConfig = [
  {
    key: "totalSbtc" as const,
    label: "Total Value Locked",
    format: (v: number) => `${v.toFixed(4)} sBTC`,
    color: "var(--text)",
  },
  {
    key: "totalYsbtc" as const,
    label: "ysBTC in Circulation",
    format: (v: number) => `${v.toFixed(4)} ysBTC`,
    color: "var(--text)",
  },
  {
    key: "feeBps" as const,
    label: "Protocol Fee",
    format: (v: number) => `${(v / 100).toFixed(2)}%`,
    color: "var(--text)",
  },
  {
    key: "paused" as const,
    label: "Status",
    format: (v: boolean) => (v ? "Paused" : "Active"),
    color: (v: boolean) => (v ? "var(--yellow)" : "var(--green)"),
  },
];

export function VaultStats() {
  const { data, isLoading } = useVaultStats();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statConfig.map((stat) => {
        const value = data?.[stat.key];
        const color =
          typeof stat.color === "function"
            ? stat.color(value as boolean)
            : stat.color;
        const formatted =
          value !== undefined ? stat.format(value as never) : "—";

        return (
          <div
            key={stat.label}
            className="rounded-[16px] p-[26px] transition-all duration-[180ms]"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-hover)";
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
              (e.currentTarget as HTMLDivElement).style.transform = "";
            }}
          >
            <p
              className="font-sans text-[13px] mb-2"
              style={{ color: "var(--text-muted)" }}
            >
              {stat.label}
            </p>
            {isLoading ? (
              <Skeleton className="h-7 w-28 mt-1" />
            ) : (
              <p
                className="font-mono font-medium text-[20px]"
                style={{ color }}
              >
                {formatted}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
