"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { stagger, fadeUp } from "@/lib/motion";
import { AmbientBackground } from "@/components/layout/AmbientBackground";
import { Footer } from "@/components/Footer";

/* ─── Hero chart SVG path ─────────────────────────────────────────── */
const CHART_PATH = "M0 260 C80 240 130 220 200 200 C280 178 310 130 400 90 C490 50 560 30 700 10";

const protocols = [
  { id: "zest",    name: "ZEST",    apy: "2.1%",  apr: 2.1,  label: "Conservative", color: "#3dd68c", bar: 4  },
  { id: "bitflow", name: "BITFLOW", apy: "12.4%", apr: 12.4, label: "Balanced",      color: "#f5c842", bar: 26 },
  { id: "alex",    name: "ALEX",    apy: "47.2%", apr: 47.2, label: "Aggressive",    color: "#f16a6a", bar: 100 },
];

const GLASS: React.CSSProperties = {
  background:           "rgba(255,255,255,0.04)",
  backdropFilter:       "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border:               "1px solid rgba(255,255,255,0.09)",
  boxShadow:            "0 2px 4px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.07)",
};

/* ─── Agent preview countdown ─────────────────────────────────────── */
function AgentCountdown() {
  const [secs, setSecs] = useState(582);
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 600)), 1000);
    return () => clearInterval(t);
  }, []);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return <>{`${m}:${String(s).padStart(2, "0")}`}</>;
}

/* ─── Hero background layers ──────────────────────────────────────── */
function HeroLayers() {
  const controls = useAnimation();
  const ref = useRef<SVGPathElement>(null);

  useEffect(() => {
    void controls.start({ pathLength: 1, transition: { duration: 2, ease: "easeInOut" } });
  }, [controls]);

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {/* Horizontal grid lines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:  "repeating-linear-gradient(to bottom, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 56px)",
          maskImage:        "linear-gradient(to top, transparent, black 60%)",
          WebkitMaskImage:  "linear-gradient(to top, transparent, black 60%)",
        }}
      />

      {/* Rising chart SVG */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        height="280"
        viewBox="0 0 700 280"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="chartGlow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        {/* Glow line */}
        <path
          d={CHART_PATH}
          fill="none"
          stroke="rgba(247,147,26,0.12)"
          strokeWidth="8"
          filter="url(#chartGlow)"
        />
        {/* Primary line */}
        <motion.path
          ref={ref}
          d={CHART_PATH}
          fill="none"
          stroke="rgba(247,147,26,0.45)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={controls}
        />
        {/* Volume bars */}
        {Array.from({ length: 24 }, (_, i) => {
          const x = (i / 23) * 680 + 10;
          const h = 8 + ((i * 37 + 7) % 41);
          return (
            <rect
              key={i}
              x={x - 5}
              y={280 - h}
              width="10"
              height={h}
              fill="rgba(247,147,26,0.05)"
            />
          );
        })}
        {/* Leading dot */}
        <motion.circle
          cx="700"
          cy="10"
          r="5"
          fill="#f7931a"
          animate={{ scale: [1, 1.6, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 90% 70% at 50% 110%, transparent 30%, #04040a 75%)",
        }}
      />
    </div>
  );
}

/* ─── How it works ────────────────────────────────────────────────── */
const HOW_STEPS = [
  {
    num: "1",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title:  "Deposit sBTC",
    desc:   "Connect your wallet and choose a risk tier. Your principal is always in your control.",
  },
  {
    num: "2",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title:  "Agent watches",
    desc:   "Claude monitors live APYs every 10 minutes and decides when to rebalance — based on your limits.",
  },
  {
    num: "3",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
      </svg>
    ),
    title:  "Earn yield",
    desc:   "Withdraw any time. Your ysBTC receipt tokens represent your growing share of the vault.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: "var(--bg)" }}>
      <AmbientBackground />

      {/* ── Header ────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 h-16"
        style={{
          backdropFilter:       "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          background:           "rgba(4,4,10,0.82)",
          borderBottom:         "1px solid var(--border)",
        }}
      >
        <div className="flex items-center select-none" style={{ letterSpacing: "-0.02em" }}>
          <span className="font-display font-black text-[20px]" style={{ color: "var(--text)" }}>Stack</span>
          <span className="font-display font-black text-[20px]" style={{ color: "#f7931a" }}>Yield</span>
        </div>
        <nav className="flex items-center gap-6">
          {(["Protocol", "Dashboard", "Docs"] as const).map((label) => (
            <a
              key={label}
              href={label === "Dashboard" ? "/dashboard" : label === "Protocol" ? "#features" : "#"}
              className="font-body font-medium text-[14px] hidden sm:block transition-colors duration-[180ms]"
              style={{ color: "var(--text-2)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-2)")}
            >
              {label}
            </a>
          ))}
          <Link
            href="/dashboard"
            className="font-display font-black text-[14px] rounded-btn px-5 py-[9px] transition-[background,box-shadow,transform] duration-[180ms]"
            style={{ background: "#f7931a", color: "#fff" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#ffaa47";
              e.currentTarget.style.transform  = "translateY(-2px)";
              e.currentTarget.style.boxShadow  = "0 8px 28px rgba(247,147,26,0.40)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#f7931a";
              e.currentTarget.style.transform  = "";
              e.currentTarget.style.boxShadow  = "none";
            }}
          >
            Launch App
          </Link>
        </nav>
      </header>

      <main className="flex-1 relative z-10">
        {/* ── Hero ──────────────────────────────────────────────── */}
        <section
          className="relative flex items-center justify-center overflow-hidden"
          style={{ minHeight: "88vh" }}
        >
          <HeroLayers />

          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="relative flex flex-col items-center text-center px-6 py-20 max-w-[700px] mx-auto"
            style={{ zIndex: 10 }}
          >
            {/* Eyebrow */}
            <motion.div variants={fadeUp} custom={0}>
              <span
                className="inline-block font-mono text-[12px] uppercase tracking-[0.14em] mb-10"
                style={{ color: "#f7931a" }}
              >
                STACKS DEFI · BUIDLBATTLE #2
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-display font-black tracking-[-0.03em] mb-6"
              style={{
                fontSize:   "clamp(44px, 7vw, 80px)",
                lineHeight: 1.05,
                color:      "var(--text)",
              }}
            >
              Stack<span style={{ color: "#f7931a" }}>Yield</span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              variants={fadeUp}
              custom={2}
              className="font-body text-[18px] leading-[1.65] mb-12 max-w-[520px]"
              style={{ color: "var(--text-2)" }}
            >
              StackYield routes your sBTC across Zest, Bitflow, and ALEX, automatically rebalancing for the best yield. Claude-powered. Non-custodial.
            </motion.p>

            {/* CTA row */}
            <motion.div variants={fadeUp} custom={3} className="flex gap-3 flex-wrap justify-center mb-12">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center font-display font-black text-[15px] rounded-btn px-8 py-[14px] transition-[background,box-shadow,transform] duration-[180ms]"
                style={{ background: "#f7931a", color: "#fff" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#ffaa47";
                  e.currentTarget.style.transform  = "translateY(-2px)";
                  e.currentTarget.style.boxShadow  = "0 8px 28px rgba(247,147,26,0.40)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f7931a";
                  e.currentTarget.style.transform  = "";
                  e.currentTarget.style.boxShadow  = "none";
                }}
              >
                Launch App
              </Link>
              <a
                href="https://github.com/Chrisszy123/stacks-yield"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center font-display font-black text-[15px] rounded-btn px-8 py-[14px] transition-all duration-[180ms]"
                style={{
                  background:  "transparent",
                  borderWidth: "1.5px",
                  borderStyle: "solid",
                  borderColor: "rgba(255,255,255,0.18)",
                  color:       "#edecf2",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background   = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.borderColor  = "rgba(255,255,255,0.28)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background   = "transparent";
                  e.currentTarget.style.borderColor  = "rgba(255,255,255,0.18)";
                }}
              >
                Read the Docs
              </a>
            </motion.div>

            {/* Stat strip */}
            <motion.div
              variants={fadeUp}
              custom={4}
              className="flex items-center gap-0 rounded-[12px] overflow-hidden"
              style={{ border: "1px solid var(--border)" }}
            >
              {[
                { num: "47.2%", label: "Peak APY" },
                { num: "0.30 sBTC", label: "TVL" },
                { num: "3", label: "Protocols" },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center px-7 py-4"
                  style={{
                    borderLeft: i > 0 ? "1px solid var(--border)" : "none",
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  <span className="font-mono font-medium text-[14px]" style={{ color: "var(--text)" }}>
                    {stat.num}
                  </span>
                  <span className="font-mono text-[11px]" style={{ color: "var(--text-muted)" }}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ── Protocol stats bar ─────────────────────────────── */}
        <section
          style={{
            background:   "#0d0d15",
            borderTop:    "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
            padding:      "24px 0",
          }}
        >
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {protocols.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-[0.10em]" style={{ color: "var(--text-muted)" }}>
                      {p.name}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.06em] px-[7px] py-[2px] rounded-[5px]" style={{
                      background: `${p.color}11`,
                      border:     `1px solid ${p.color}33`,
                      color:      p.color,
                    }}>
                      {p.label}
                    </span>
                  </div>
                  <span className="font-mono font-medium text-[28px] leading-none" style={{ color: p.color }}>
                    {p.apy}
                    <span className="font-mono text-[13px] ml-1" style={{ color: "var(--text-muted)" }}>APR</span>
                  </span>
                  <div className="h-[3px] rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${p.bar}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
                      className="h-full rounded-full"
                      style={{ background: p.color }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ──────────────────────────────────── */}
        <section id="features" className="max-w-5xl mx-auto px-6 py-28">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] mb-3" style={{ color: "#f7931a" }}>
              HOW IT WORKS
            </p>
            <h2 className="font-display font-black text-[30px] tracking-tight" style={{ color: "var(--text)" }}>
              Three steps to earning Bitcoin yield.
            </h2>
          </motion.div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-0">
            {HOW_STEPS.map((step, i) => (
              <div key={step.num} className="flex flex-col md:flex-row items-center flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center text-center gap-4 flex-1 px-4"
                >
                  <div
                    className="flex items-center justify-center w-14 h-14 rounded-full shrink-0"
                    style={{
                      background:    "rgba(255,255,255,0.04)",
                      backdropFilter:"blur(12px)",
                      border:        "1.5px solid rgba(247,147,26,0.35)",
                    }}
                  >
                    <span className="font-display font-black text-[18px]" style={{ color: "#f7931a" }}>
                      {step.num}
                    </span>
                  </div>
                  <div style={{ color: "var(--text-2)" }}>{step.icon}</div>
                  <p className="font-display font-bold text-[15px]" style={{ color: "var(--text)" }}>{step.title}</p>
                  <p className="font-body text-[13px] leading-relaxed max-w-[200px]" style={{ color: "var(--text-2)" }}>
                    {step.desc}
                  </p>
                </motion.div>

                {i < HOW_STEPS.length - 1 && (
                  <div className="hidden md:flex items-center flex-shrink-0 w-16 mt-[-60px]">
                    <svg width="64" height="12" viewBox="0 0 64 12">
                      <line
                        x1="0" y1="6" x2="64" y2="6"
                        stroke="rgba(247,147,26,0.22)"
                        strokeWidth="1.5"
                        strokeDasharray="5 4"
                        className="animate-march"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Agent Section ──────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 pb-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left column */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] mb-3" style={{ color: "#f7931a" }}>
                POWERED BY CLAUDE
              </p>
              <h2 className="font-display font-black text-[30px] tracking-tight mb-5" style={{ color: "var(--text)" }}>
                Your Bitcoin has an agent watching it.
              </h2>
              <p className="font-body text-[15px] mb-7 leading-relaxed" style={{ color: "var(--text-2)" }}>
                StackYield's autonomous agent monitors Zest, Bitflow, and ALEX every 10 minutes. When yields shift past your threshold, it rebalances — no wallet popup, no manual check.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  "Claude explains every decision in plain English",
                  "You set the risk ceiling — the agent never exceeds it",
                  "Powered by the x402 Molbot Network — agents hiring agents",
                ].map((line) => (
                  <div key={line} className="flex items-start gap-3">
                    <span className="font-mono text-[13px] shrink-0 mt-[2px]" style={{ color: "#f7931a" }}>→</span>
                    <span className="font-body text-[14px]" style={{ color: "var(--text-2)" }}>{line}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right column — mock agent card */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-card p-0 overflow-hidden"
              style={{ ...GLASS }}
            >
              {/* Card header */}
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <div className="flex items-center gap-2">
                  <span className="relative flex h-[6px] w-[6px]">
                    <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ background: "#f7931a" }} />
                    <span className="relative inline-flex rounded-full h-[6px] w-[6px]" style={{ background: "#f7931a" }} />
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: "#f7931a" }}>
                    AGENT ACTIVE
                  </span>
                </div>
                <span className="font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>
                  Last: Rebalanced to ALEX · 2m ago
                </span>
              </div>

              {/* Decision row */}
              <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.06em] px-[9px] py-[3px] rounded-pill" style={{
                    background: "rgba(247,147,26,0.09)",
                    border: "1px solid rgba(247,147,26,0.2)",
                    color: "#f7931a",
                  }}>
                    REBALANCE → ALEX
                  </span>
                  <span className="font-mono text-[11px]" style={{ color: "var(--text-2)" }}>
                    Confidence{" "}
                    <span className="font-mono" style={{ color: "#3dd68c" }}>0.87</span>
                  </span>
                </div>
                <p className="font-mono text-[12px] leading-relaxed" style={{ color: "var(--text-2)" }}>
                  "ALEX APY jumped to 47.2% — moved position for better yield"
                </p>
              </div>

              {/* Countdown */}
              <div className="px-5 py-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.10em] mb-1" style={{ color: "var(--text-muted)" }}>
                  NEXT CHECK IN
                </p>
                <p className="font-mono font-medium text-[22px]" style={{ color: "#f7931a" }}>
                  <AgentCountdown />
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Strategies ─────────────────────────────────────── */}
        <section id="strategies" className="max-w-5xl mx-auto px-6 pb-28">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-14"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] mb-3" style={{ color: "#f7931a" }}>
              STRATEGIES
            </p>
            <h2 className="font-display font-black text-[30px] tracking-tight" style={{ color: "var(--text)" }}>
              Pick your risk profile.
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {[
              {
                name: "Conservative", protocol: "Zest Protocol", apy: "1–3%",
                color: "#3dd68c", bg: "rgba(61,214,140,0.06)", border: "rgba(61,214,140,0.2)",
                desc: "Supply sBTC to Zest's lending protocol for stable, predictable Bitcoin-native yield with minimal risk.",
              },
              {
                name: "Balanced", protocol: "Bitflow", apy: "8–20%",
                color: "#f5c842", bg: "rgba(245,200,66,0.06)", border: "rgba(245,200,66,0.2)",
                desc: "Provide liquidity to sBTC/STX pools on Bitflow DEX. Higher yield with moderate impermanent loss risk.",
              },
              {
                name: "Aggressive", protocol: "ALEX", apy: "30–100%",
                color: "#f16a6a", bg: "rgba(241,106,106,0.06)", border: "rgba(241,106,106,0.2)",
                desc: "ALEX yield farming with leveraged strategies. Maximum returns for those comfortable with higher volatility.",
              },
            ].map((s) => (
              <motion.div
                key={s.name}
                variants={fadeUp}
                className="rounded-card p-7 flex flex-col"
                style={{ ...GLASS, borderColor: s.border }}
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-[10px] uppercase px-[9px] py-[3px] rounded-pill tracking-[0.06em]"
                    style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                    {s.name.includes("Con") ? "Low" : s.name.includes("Bal") ? "Medium" : "High"} Risk
                  </span>
                  <span className="font-mono text-[11px]" style={{ color: "var(--text-muted)" }}>{s.protocol}</span>
                </div>
                <p className="font-display font-bold text-[18px] mb-2" style={{ color: "var(--text)" }}>{s.name}</p>
                <p className="font-mono font-medium text-[28px] mb-4" style={{ color: s.color }}>
                  {s.apy} <span className="text-[14px]" style={{ color: "var(--text-muted)" }}>APY</span>
                </p>
                <p className="font-body text-[13px] leading-relaxed flex-1" style={{ color: "var(--text-2)" }}>{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── CTA Banner ─────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-6 pb-28">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-[20px] p-12 text-center relative overflow-hidden"
            style={{ ...GLASS, borderColor: "rgba(247,147,26,0.18)" }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(247,147,26,0.06) 0%, transparent 70%)" }}
            />
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] mb-4 relative" style={{ color: "#f7931a" }}>
              Ready to earn?
            </p>
            <h2 className="font-display font-black text-[28px] tracking-tight mb-4 relative" style={{ color: "var(--text)" }}>
              Start earning Bitcoin-native yield today
            </h2>
            <p className="font-body text-[15px] mb-8 max-w-md mx-auto relative" style={{ color: "var(--text-2)" }}>
              Connect your wallet, deposit sBTC, and let the vault do the rest. No lock-ups, no intermediaries.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center font-display font-black text-[15px] rounded-btn px-8 py-[14px] relative transition-[background,box-shadow,transform] duration-[180ms]"
              style={{ background: "#f7931a", color: "#fff" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#ffaa47";
                e.currentTarget.style.transform  = "translateY(-2px)";
                e.currentTarget.style.boxShadow  = "0 8px 28px rgba(247,147,26,0.40)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#f7931a";
                e.currentTarget.style.transform  = "";
                e.currentTarget.style.boxShadow  = "none";
              }}
            >
              Launch App →
            </Link>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
