"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMolbotActivity, type MolbotService } from "@/hooks/useMolbotActivity";
import { GLASS_BASE } from "@/components/ui/card";
import { slideExpand } from "@/lib/motion";

const SELF_OWNER_SUFFIX = "stackyield"; // treat any endpoint containing this as "self"

const STATIC_SERVICES = [
  { serviceId: 1, name: "Risk Auditor Molbot",    skillType: "risk-audit",       priceSbtc: 100, active: true, self: false },
  { serviceId: 2, name: "Market Analyst Bot",     skillType: "market-analysis",  priceSbtc: 100, active: true, self: false },
  { serviceId: 3, name: "StackYield Yield Data",  skillType: "yield-data",       priceSbtc: 100, active: true, self: true  },
];

function ServiceCard({ svc }: { svc: typeof STATIC_SERVICES[0] }) {
  return (
    <div
      className="rounded-[12px] p-[14px] flex flex-col gap-2"
      style={{
        background:  "#12121c",
        border:      `1px solid ${svc.self ? "rgba(247,147,26,0.28)" : "var(--border)"}`,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="font-display font-bold text-[13px]" style={{ color: "var(--text)" }}>
          {svc.name}
        </span>
        {svc.self && (
          <span
            className="font-mono text-[10px] px-[7px] py-[2px] rounded-[5px] uppercase tracking-[0.06em]"
            style={{
              background: "rgba(61,214,140,0.07)",
              border:     "1px solid rgba(61,214,140,0.2)",
              color:      "#3dd68c",
            }}
          >
            You earn this
          </span>
        )}
      </div>

      <span
        className="font-mono text-[10px] px-[7px] py-[2px] rounded-[5px] w-fit"
        style={{ background: "#0d0d15", border: "1px solid var(--border)", color: "var(--text-muted)" }}
      >
        {svc.skillType}
      </span>

      <span className="font-mono text-[11px]" style={{ color: "var(--text-2)" }}>
        {svc.priceSbtc} sats / call
      </span>

      <div className="flex items-center gap-1.5">
        <span className="relative flex h-[5px] w-[5px]">
          <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ background: "#3dd68c" }} />
          <span className="relative inline-flex rounded-full h-[5px] w-[5px]" style={{ background: "#3dd68c" }} />
        </span>
        <span className="font-mono text-[10px]" style={{ color: "#3dd68c" }}>Active</span>
      </div>
    </div>
  );
}

function ServiceCardLive({ service }: { service: MolbotService }) {
  const price = service.priceSbtc > 0 ? `${service.priceSbtc} sats / call` : service.priceUstx > 0 ? `${service.priceUstx} uSTX / call` : "Free";
  const isSelf = service.endpoint?.includes(SELF_OWNER_SUFFIX);

  return (
    <div
      className="rounded-[12px] p-[14px] flex flex-col gap-2"
      style={{
        background:  "#12121c",
        border:      `1px solid ${isSelf ? "rgba(247,147,26,0.28)" : "var(--border)"}`,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="font-display font-bold text-[13px]" style={{ color: "var(--text)" }}>{service.name}</span>
        {isSelf && (
          <span className="font-mono text-[10px] px-[7px] py-[2px] rounded-[5px] uppercase tracking-[0.06em]"
            style={{ background: "rgba(61,214,140,0.07)", border: "1px solid rgba(61,214,140,0.2)", color: "#3dd68c" }}>
            You earn this
          </span>
        )}
      </div>
      <span className="font-mono text-[10px] px-[7px] py-[2px] rounded-[5px] w-fit"
        style={{ background: "#0d0d15", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
        {service.skillType}
      </span>
      <span className="font-mono text-[11px]" style={{ color: "var(--text-2)" }}>{price}</span>
      <div className="flex items-center gap-1.5">
        <span className="inline-block h-[5px] w-[5px] rounded-full" style={{ background: service.active ? "#3dd68c" : "#f16a6a" }} />
        <span className="font-mono text-[10px]" style={{ color: service.active ? "#3dd68c" : "#f16a6a" }}>
          {service.active ? "Active" : "Inactive"}
        </span>
      </div>
    </div>
  );
}

export function MolbotPanel() {
  const { data: liveServices } = useMolbotActivity();
  const [open, setOpen]        = useState(false);

  const services = liveServices && liveServices.length > 0 ? null : STATIC_SERVICES;

  return (
    <div className="rounded-card p-[26px]" style={{ ...GLASS_BASE }}>
      {/* Header */}
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setOpen((v) => !v)}
      >
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[14px]" style={{ color: "#f7931a" }}>⬡</span>
            <span className="font-display font-bold text-[15px]" style={{ color: "var(--text)" }}>
              Molbot Network
            </span>
            <span
              className="font-mono text-[10px] px-[7px] py-[2px] rounded-[5px]"
              style={{ background: "#12121c", border: "1px solid var(--border)", color: "var(--text-muted)" }}
            >
              3 services
            </span>
          </div>
          <p className="font-body text-[13px]" style={{ color: "var(--text-2)" }}>
            Services your agent can hire autonomously via x402
          </p>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="font-mono text-[10px]"
          style={{ color: "var(--text-muted)" }}
        >
          {open ? "▴ collapse" : "▾ expand"}
        </motion.span>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="molbot-content"
            variants={slideExpand}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden"
          >
            <div className="mt-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                {services
                  ? services.map((svc) => <ServiceCard key={svc.serviceId} svc={svc} />)
                  : liveServices!.map((svc) => <ServiceCardLive key={svc.serviceId} service={svc} />)
                }
              </div>

              <p
                className="font-mono text-[10px] pt-3"
                style={{ borderTop: "1px solid var(--border)", color: "var(--text-muted)" }}
              >
                ⓘ Your agent pays other molbots automatically via sBTC and the x402 protocol. No wallet approval required.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
