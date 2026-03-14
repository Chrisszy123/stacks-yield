import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  eyebrow: string;
  value:   string;
  label:   string;
  loading?: boolean;
}

export function StatCard({ eyebrow, value, label, loading }: StatCardProps) {
  return (
    <div
      className="flex flex-col rounded-card p-[26px]"
      style={{
        background:    "rgba(255,255,255,0.04)",
        backdropFilter:"blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border:        "1px solid rgba(255,255,255,0.09)",
        boxShadow:     "0 2px 4px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.07)",
      }}
    >
      <p
        className="font-mono text-[11px] uppercase tracking-[0.12em] mb-3"
        style={{ color: "#f7931a" }}
      >
        {eyebrow}
      </p>
      {loading ? (
        <Skeleton className="h-8 w-32 mb-1" />
      ) : (
        <p className="font-mono font-medium text-[28px] leading-none mb-1" style={{ color: "var(--text)" }}>
          {value}
        </p>
      )}
      <p className="font-mono text-[12px]" style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
    </div>
  );
}
