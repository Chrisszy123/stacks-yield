"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { pageVariants, itemVariants } from "@/lib/motion";
import { HeroBackground } from "@/components/HeroBackground";
import { HowItWorksIllustration } from "@/components/HowItWorksIllustration";

const stats = [
  { label: "Protocols Supported", value: "3"     },
  { label: "Max APY",             value: "~100%" },
  { label: "Asset",               value: "sBTC"  },
  { label: "Network",             value: "Stacks"},
];

const protocols = ["Zest Protocol", "Bitflow", "ALEX"];

/* ── Reusable CTA link styles ──────────────────────────────────────── */
function usePrimaryHover() {
  return {
    onMouseEnter: (e: React.MouseEvent<HTMLAnchorElement>) => {
      const el = e.currentTarget;
      el.style.background  = "#ffaa47";
      el.style.transform   = "translateY(-2px)";
      el.style.boxShadow   = "0 8px 28px rgba(247,147,26,0.40)";
    },
    onMouseLeave: (e: React.MouseEvent<HTMLAnchorElement>) => {
      const el = e.currentTarget;
      el.style.background  = "#f7931a";
      el.style.transform   = "";
      el.style.boxShadow   = "none";
    },
  };
}

function useGhostHover() {
  return {
    onMouseEnter: (e: React.MouseEvent<HTMLAnchorElement>) => {
      const el = e.currentTarget;
      el.style.background  = "rgba(255,255,255,0.05)";
      el.style.borderColor = "rgba(255,255,255,0.28)";
      el.style.boxShadow   = "0 4px 16px rgba(0,0,0,0.25)";
    },
    onMouseLeave: (e: React.MouseEvent<HTMLAnchorElement>) => {
      const el = e.currentTarget;
      el.style.background  = "transparent";
      el.style.borderColor = "rgba(255,255,255,0.18)";
      el.style.boxShadow   = "none";
    },
  };
}

export default function HomePage() {
  const primaryHover = usePrimaryHover();
  const ghostHover   = useGhostHover();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <header
        className="flex items-center justify-between px-6 h-16 relative z-20"
        style={{
          backdropFilter: "blur(20px)",
          background:     "rgba(4,4,10,0.82)",
          borderBottom:   "1px solid var(--border)",
        }}
      >
        <div className="flex items-center select-none">
          <span className="font-syne font-[800] text-[20px]" style={{ color: "var(--text)" }}>Stack</span>
          <span className="font-syne font-[800] text-[20px]" style={{ color: "#f7931a"    }}>Yield</span>
        </div>
        <Link
          href="/dashboard"
          className="font-sans font-medium text-[14px]"
          style={{ color: "var(--text-2)", transition: "color 0.18s ease" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-2)")}
        >
          Dashboard
        </Link>
      </header>

      <main className="flex-1">

        {/* ── Hero ────────────────────────────────────────────────────── */}
        <section
          className="relative flex items-center justify-center overflow-hidden"
          style={{ minHeight: "88vh" }}
        >
          {/* Background layers */}
          <HeroBackground />

          {/* Hero content */}
          <motion.div
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            className="relative flex flex-col items-center text-center px-6 py-20 max-w-4xl mx-auto"
            style={{ zIndex: 10 }}
          >
            {/* Eyebrow pill */}
            <motion.div variants={itemVariants}>
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-10"
                style={{
                  background: "rgba(247,147,26,0.09)",
                  border:     "1px solid rgba(247,147,26,0.28)",
                }}
              >
                <span className="relative flex h-[6px] w-[6px]">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                    style={{ background: "#f7931a" }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-[6px] w-[6px]"
                    style={{ background: "#f7931a" }}
                  />
                </span>
                <span
                  className="font-mono text-[11px] uppercase tracking-[0.12em]"
                  style={{ color: "#f7931a" }}
                >
                  Built on Stacks · Secured by Bitcoin
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="font-syne font-[800] tracking-[-0.03em] mb-6"
              style={{
                fontSize:   "clamp(44px, 7vw, 80px)",
                color:      "var(--text)",
                lineHeight: 1.05,
              }}
            >
              Stack<span style={{ color: "#f7931a" }}>Yield</span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              variants={itemVariants}
              className="font-sans text-[17px] leading-relaxed mb-12 max-w-xl"
              style={{ color: "var(--text-2)" }}
            >
              Maximize your sBTC yield across the Stacks DeFi ecosystem.
              <br />
              One vault. Multiple protocols. Fully non-custodial.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex gap-3 flex-wrap justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center font-syne font-[800] text-[15px] tracking-[0.01em] rounded-[11px] px-8 py-[14px] active:scale-[0.97]"
                style={{
                  background: "#f7931a",
                  color:      "#ffffff",
                  transition: "background 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
                }}
                {...primaryHover}
              >
                Launch App →
              </Link>
              <a
                href="https://github.com/your-repo/stackyield"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center font-syne font-[800] text-[15px] tracking-[0.01em] rounded-[11px] px-8 py-[14px] active:scale-[0.97]"
                style={{
                  background:  "transparent",
                  border:      "1.5px solid rgba(255,255,255,0.18)",
                  color:       "#edecf2",
                  transition:  "all 0.18s ease",
                }}
                {...ghostHover}
              >
                View Code
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* ── Stats row ───────────────────────────────────────────────── */}
        <motion.section
          variants={pageVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="max-w-4xl mx-auto px-6 pb-24"
        >
          <div
            className="grid grid-cols-2 md:grid-cols-4 rounded-[16px] overflow-hidden"
            style={{
              background:           "rgba(255,255,255,0.04)",
              backdropFilter:       "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border:               "1px solid rgba(255,255,255,0.09)",
              boxShadow:            "0 2px 4px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.07)",
            }}
          >
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                variants={itemVariants}
                className={`p-8 text-center ${
                  i < stats.length - 1 ? "border-r" : ""
                } ${i < 2 ? "border-b md:border-b-0" : ""}`}
                style={{ borderColor: "rgba(255,255,255,0.06)" }}
              >
                <p className="font-mono font-medium text-[28px] mb-1" style={{ color: "#f7931a" }}>
                  {s.value}
                </p>
                <p className="font-sans text-[13px]" style={{ color: "var(--text-muted)" }}>
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── How it works ────────────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-6 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12"
          >
            <p
              className="font-mono text-[11px] uppercase tracking-[0.12em] mb-3"
              style={{ color: "#f7931a" }}
            >
              How it works
            </p>
            <h2
              className="font-syne font-bold text-[30px] tracking-tight"
              style={{ color: "var(--text)" }}
            >
              Simple by design
            </h2>
          </motion.div>

          <HowItWorksIllustration />
        </section>

        {/* ── Protocol pills ──────────────────────────────────────────── */}
        <motion.div
          variants={pageVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex items-center gap-3 flex-wrap justify-center pb-20 px-6"
        >
          <motion.span
            variants={itemVariants}
            className="font-mono text-[11px] uppercase tracking-[0.12em] mr-2"
            style={{ color: "var(--text-muted)" }}
          >
            Powered by
          </motion.span>
          {protocols.map((name) => (
            <motion.span
              key={name}
              variants={itemVariants}
              className="font-mono text-[11px] px-[9px] py-[3px] rounded-[6px]"
              style={{
                background:   "rgba(255,255,255,0.04)",
                border:       "1px solid rgba(255,255,255,0.09)",
                color:        "var(--text-2)",
              }}
            >
              {name}
            </motion.span>
          ))}
        </motion.div>

      </main>
    </div>
  );
}
