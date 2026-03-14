import { motion } from "framer-motion";
import { GLASS_BASE } from "@/components/ui/card";

interface Allocation {
  label:   string;
  pct:     number;
  color:   string;
}

interface AllocationBarsProps {
  allocations?: Allocation[];
}

const DEFAULT_ALLOCATIONS: Allocation[] = [
  { label: "Zest",    pct: 20,  color: "#3dd68c" },
  { label: "Bitflow", pct: 35,  color: "#f5c842" },
  { label: "ALEX",    pct: 45,  color: "#f16a6a" },
];

export function AllocationBars({ allocations = DEFAULT_ALLOCATIONS }: AllocationBarsProps) {
  return (
    <div className="rounded-card p-[26px]" style={{ ...GLASS_BASE }}>
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] mb-4" style={{ color: "#f7931a" }}>
        ALLOCATION
      </p>

      <div className="flex flex-col gap-3">
        {allocations.map((a) => (
          <div key={a.label}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[12px]" style={{ color: "var(--text-2)" }}>{a.label}</span>
              <span className="font-mono text-[12px]" style={{ color: a.color }}>{a.pct}%</span>
            </div>
            <div className="h-[3px] rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${a.pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
                className="h-full rounded-full"
                style={{ background: a.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
