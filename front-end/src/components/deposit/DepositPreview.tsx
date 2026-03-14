interface DepositPreviewProps {
  amount:  number;
  apy:     number;
}

export function DepositPreview({ amount, apy }: DepositPreviewProps) {
  const received        = amount * 0.9995;
  const annualYield     = amount * (apy / 100);

  return (
    <div
      className="rounded-input px-[16px] py-[14px] flex flex-col gap-2"
      style={{ background: "#12121c", border: "1px solid var(--border)" }}
    >
      {[
        { label: "You deposit:",          value: `${amount.toFixed(8)} sBTC` },
        { label: "You receive:",          value: `${received.toFixed(8)} ysBTC` },
        { label: "Strategy APY:",         value: `${apy.toFixed(1)}%` },
        { label: "Est. annual yield:",    value: `${annualYield.toFixed(8)} sBTC` },
      ].map((row) => (
        <div key={row.label} className="flex items-center justify-between">
          <span className="font-mono text-[12px]" style={{ color: "var(--text-muted)" }}>{row.label}</span>
          <span className="font-mono text-[12px]" style={{ color: "var(--text)" }}>{row.value}</span>
        </div>
      ))}
    </div>
  );
}
