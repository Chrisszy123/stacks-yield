"use client";
import { GLASS_BASE } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TxItem {
  id:        string;
  type:      "DEPOSIT" | "WITHDRAW";
  amount:    string;
  strategy:  string;
  txId:      string;
  timestamp: string;
}

interface TxHistoryProps {
  items?: TxItem[];
}

function TxRow({ item }: { item: TxItem }) {
  const isDeposit = item.type === "DEPOSIT";
  return (
    <div
      className="flex items-center gap-3 py-3"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <Badge color={isDeposit ? "green" : "red"}>{item.type}</Badge>
      <span className="font-mono text-[13px] flex-1" style={{ color: "var(--text)" }}>
        {item.amount}
      </span>
      <span className="font-mono text-[11px] hidden sm:block" style={{ color: "var(--text-2)" }}>
        {item.strategy}
      </span>
      <a
        href={`https://explorer.hiro.so/txid/${item.txId}?chain=testnet`}
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-[11px] transition-colors duration-[180ms]"
        style={{ color: "var(--text-muted)" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#f7931a")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
      >
        {item.txId.slice(0, 6)}...{item.txId.slice(-4)} ↗
      </a>
      <span className="font-mono text-[10px] shrink-0" style={{ color: "var(--text-muted)" }}>
        {item.timestamp}
      </span>
    </div>
  );
}

export function TxHistory({ items = [] }: TxHistoryProps) {
  return (
    <div className="rounded-card p-[26px]" style={{ ...GLASS_BASE }}>
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] mb-1" style={{ color: "#f7931a" }}>
        HISTORY
      </p>
      <p className="font-display font-black text-[15px] mb-5" style={{ color: "var(--text)" }}>
        Transaction History
      </p>

      {items.length === 0 ? (
        <p className="font-mono text-[12px] text-center py-8" style={{ color: "var(--text-muted)" }}>
          No transactions yet.
        </p>
      ) : (
        <div>
          {items.map((item) => (
            <TxRow key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
