"use client";
import { motion } from "framer-motion";
import { pageVariants, itemVariants } from "@/lib/motion";
import { useVaultStats } from "@/hooks/useVaultStats";
import { useProtocolAPYs } from "@/hooks/useProtocolAPYs";

const GLASS = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.09)",
  boxShadow:
    "0 2px 4px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.07)",
};

export function LiveMetrics() {
  const { data: vault } = useVaultStats();
  const { data: apys } = useProtocolAPYs();

  const tvl = vault?.totalSbtc ?? 0;
  const totalShares = vault?.totalYsbtc ?? 0;

  const apyValues = apys ? [apys.zest, apys.bitflow, apys.alex] : [];
  const bestApy = apyValues.length > 0 ? Math.max(...apyValues) : 0;
  const avgApy = apyValues.length > 0
    ? apyValues.reduce((s, v) => s + v, 0) / apyValues.length
    : 0;

  const sharePrice = totalShares > 0 ? tvl / totalShares : 1;

  const metrics = [
    {
      label: "Total Value Locked",
      value: tvl > 0 ? `${tvl.toFixed(4)} sBTC` : "0 sBTC",
      color: "#f7931a",
      live: true,
    },
    {
      label: "Protocols Integrated",
      value: "3",
      color: "#f7931a",
      live: false,
    },
    {
      label: "Best Strategy APY",
      value: bestApy > 0 ? `${bestApy.toFixed(1)}%` : "—",
      color: "#3dd68c",
      live: true,
    },
    {
      label: "Average APY",
      value: avgApy > 0 ? `${avgApy.toFixed(1)}%` : "—",
      color: "#f5c842",
      live: true,
    },
    {
      label: "ysBTC Share Price",
      value: `${sharePrice.toFixed(6)}`,
      color: "var(--text)",
      live: true,
    },
    {
      label: "Network",
      value: "Stacks",
      color: "var(--text)",
      live: false,
    },
  ];

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div variants={itemVariants} className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-2">
          <span className="relative flex h-[6px] w-[6px]">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
              style={{ background: "#3dd68c" }}
            />
            <span
              className="relative inline-flex rounded-full h-[6px] w-[6px]"
              style={{ background: "#3dd68c" }}
            />
          </span>
          <span
            className="font-mono text-[11px] uppercase tracking-[0.12em]"
            style={{ color: "#3dd68c" }}
          >
            Live on-chain data
          </span>
        </div>
      </motion.div>

      <div
        className="grid grid-cols-2 md:grid-cols-3 rounded-[16px] overflow-hidden"
        style={GLASS}
      >
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            variants={itemVariants}
            className="p-7 text-center relative"
            style={{
              borderRight: (i + 1) % 3 !== 0 ? "1px solid rgba(255,255,255,0.06)" : undefined,
              borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.06)" : undefined,
            }}
          >
            {m.live && (
              <span
                className="absolute top-3 right-3 w-[5px] h-[5px] rounded-full"
                style={{ background: "#3dd68c", opacity: 0.6 }}
              />
            )}
            <p className="font-mono font-medium text-[26px] mb-1" style={{ color: m.color }}>
              {m.value}
            </p>
            <p className="font-sans text-[12px]" style={{ color: "var(--text-muted)" }}>
              {m.label}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
