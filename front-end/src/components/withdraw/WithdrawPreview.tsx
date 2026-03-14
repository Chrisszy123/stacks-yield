interface WithdrawPreviewProps {
  shares:       number;
  sbtcPerShare: number;
}

export function WithdrawPreview({ shares, sbtcPerShare }: WithdrawPreviewProps) {
  const gross = shares * sbtcPerShare;
  const fee   = gross * 0.005;
  const net   = gross - fee;

  return (
    <div
      className="rounded-input px-[16px] py-[14px] flex flex-col gap-2"
      style={{ background: "#12121c", border: "1px solid var(--border)" }}
    >
      {[
        { label: "You burn:",       value: `${shares.toFixed(8)} ysBTC`  },
        { label: "Gross sBTC:",     value: `${gross.toFixed(8)} sBTC`    },
        { label: "Protocol fee:",   value: `-${fee.toFixed(8)} sBTC (0.5%)` },
        { label: "You receive:",    value: `${net.toFixed(8)} sBTC`      },
      ].map((row, i) => (
        <div key={row.label} className="flex items-center justify-between">
          <span className="font-mono text-[12px]" style={{ color: "var(--text-muted)" }}>{row.label}</span>
          <span
            className="font-mono text-[12px]"
            style={{ color: i === 2 ? "var(--red)" : i === 3 ? "#3dd68c" : "var(--text)" }}
          >
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
}
