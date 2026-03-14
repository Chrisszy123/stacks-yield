"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMolbotActivity, type MolbotService } from "@/hooks/useMolbotActivity";
import { GLASS_BASE } from "@/components/ui/card";

const SKILL_COLORS: Record<string, string> = {
  "risk-audit": "#f16a6a",
  "market-analysis": "#f5c842",
  "contract-review": "#7c8aff",
  "yield-data": "#3dd68c",
};

export function MolbotPanel() {
  const { data: services, isLoading } = useMolbotActivity();
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="rounded-[16px] p-[26px]" style={{ ...GLASS_BASE }}>
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setCollapsed((v) => !v)}
      >
        <div>
          <h3
            className="font-syne font-bold text-[15px]"
            style={{ color: "var(--text)" }}
          >
            Molbot Network
          </h3>
          <p
            className="font-sans text-[13px] mt-0.5"
            style={{ color: "var(--text-2)" }}
          >
            Services your agent can hire
          </p>
        </div>
        <motion.span
          animate={{ rotate: collapsed ? 0 : 180 }}
          transition={{ duration: 0.2 }}
          className="font-mono text-[14px]"
          style={{ color: "var(--text-muted)" }}
        >
          &#9660;
        </motion.span>
      </div>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-2">
              {isLoading ? (
                <p
                  className="font-mono text-[12px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  Loading services...
                </p>
              ) : !services || services.length === 0 ? (
                <p
                  className="font-mono text-[12px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  No molbot services registered yet.
                </p>
              ) : (
                services.map((svc) => (
                  <ServiceCard key={svc.serviceId} service={svc} />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ServiceCard({ service }: { service: MolbotService }) {
  const skillColor = SKILL_COLORS[service.skillType] ?? "var(--text-muted)";
  const price =
    service.priceSbtc > 0
      ? `${service.priceSbtc} sats`
      : service.priceUstx > 0
        ? `${service.priceUstx} uSTX`
        : "Free";

  return (
    <div
      className="flex items-center gap-3 rounded-[10px] p-3"
      style={{ background: "rgba(255,255,255,0.03)" }}
    >
      <div
        className="w-2 h-2 rounded-full shrink-0"
        style={{
          background: service.active ? "#3dd68c" : "#f16a6a",
        }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p
            className="font-sans text-[13px] font-medium truncate"
            style={{ color: "var(--text)" }}
          >
            {service.name}
          </p>
          <span
            className="font-mono text-[10px] px-[6px] py-[1px] rounded-[4px] shrink-0"
            style={{
              color: skillColor,
              background: `${skillColor}15`,
              border: `1px solid ${skillColor}30`,
            }}
          >
            {service.skillType}
          </span>
        </div>
        <p
          className="font-mono text-[11px] mt-0.5"
          style={{ color: "var(--text-muted)" }}
        >
          {price}
        </p>
      </div>
      <span
        className="font-mono text-[10px] shrink-0"
        style={{ color: service.active ? "#3dd68c" : "#f16a6a" }}
      >
        {service.active ? "Active" : "Inactive"}
      </span>
    </div>
  );
}
