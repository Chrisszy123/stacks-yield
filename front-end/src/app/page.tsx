"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { pageVariants, itemVariants } from "@/lib/motion";

const stats = [
  { label: "Protocols Supported", value: "3" },
  { label: "Max APY", value: "~100%" },
  { label: "Asset", value: "sBTC" },
  { label: "Network", value: "Stacks" },
];

const protocols = ["Zest Protocol", "Bitflow", "ALEX"];

const howItWorks = [
  {
    step: "01",
    title: "Deposit sBTC",
    desc: "Lock your sBTC in the vault and choose a risk strategy — Conservative, Balanced, or Aggressive.",
  },
  {
    step: "02",
    title: "Receive ysBTC",
    desc: "Get ysBTC receipt tokens representing your proportional share of the vault. These accrue yield over time.",
  },
  {
    step: "03",
    title: "Earn & Withdraw",
    desc: "Your sBTC is deployed across Zest, Bitflow, and ALEX. Withdraw anytime by burning your ysBTC shares.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Minimal top bar */}
      <header
        className="flex items-center justify-between px-6 h-16"
        style={{
          backdropFilter: "blur(20px)",
          background: "rgba(4,4,10,0.82)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center gap-0 select-none">
          <span className="font-syne font-[800] text-[20px]" style={{ color: "var(--text)" }}>
            Stack
          </span>
          <span className="font-syne font-[800] text-[20px]" style={{ color: "var(--accent)" }}>
            Yield
          </span>
        </div>
        <Link
          href="/dashboard"
          className="font-sans font-medium text-[14px] transition-colors duration-[180ms]"
          style={{ color: "var(--text-2)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-2)")}
        >
          Dashboard
        </Link>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <motion.section
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center justify-center text-center px-6 pt-28 pb-24 max-w-4xl mx-auto"
        >
          {/* Eyebrow */}
          <motion.div variants={itemVariants}>
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-10"
              style={{
                background: "var(--accent-dim)",
                border: "1px solid var(--border-accent)",
              }}
            >
              <span
                className="relative flex h-[6px] w-[6px]"
              >
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                  style={{ background: "var(--accent)" }}
                />
                <span
                  className="relative inline-flex rounded-full h-[6px] w-[6px]"
                  style={{ background: "var(--accent)" }}
                />
              </span>
              <span
                className="font-mono text-[11px] uppercase tracking-[0.12em]"
                style={{ color: "var(--accent)" }}
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
              fontSize: "clamp(44px, 7vw, 80px)",
              color: "var(--text)",
              lineHeight: 1.05,
            }}
          >
            Stack
            <span style={{ color: "var(--accent)" }}>Yield</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="font-sans text-[17px] leading-relaxed mb-10 max-w-xl"
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
              className="inline-flex items-center justify-center gap-2 font-syne font-bold text-[14px] rounded-[11px] px-[26px] py-[13px] transition-all duration-[180ms] active:scale-[0.97]"
              style={{ background: "var(--accent)", color: "#000" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 5px 22px rgba(247,147,26,0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "";
              }}
            >
              Launch App →
            </Link>
            <a
              href="https://github.com/your-repo/stackyield"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 font-syne font-bold text-[14px] rounded-[11px] px-[26px] py-[13px] transition-all duration-[180ms] active:scale-[0.97]"
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
                color: "var(--text-2)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border-hover)";
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--text)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-2)";
              }}
            >
              View Code
            </a>
          </motion.div>
        </motion.section>

        {/* Stats row */}
        <motion.section
          variants={pageVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="max-w-4xl mx-auto px-6 pb-24"
        >
          <div
            className="grid grid-cols-2 md:grid-cols-4 rounded-[16px]"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                variants={itemVariants}
                className={`p-8 text-center ${
                  i < stats.length - 1 ? "border-r border-[var(--border)]" : ""
                } ${i < 2 ? "border-b md:border-b-0 border-[var(--border)]" : ""}`}
              >
                <p
                  className="font-mono font-medium text-[28px] mb-1"
                  style={{ color: "var(--accent)" }}
                >
                  {s.value}
                </p>
                <p className="font-sans text-[13px]" style={{ color: "var(--text-muted)" }}>
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* How it works */}
        <motion.section
          variants={pageVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-4xl mx-auto px-6 pb-32"
        >
          <motion.div variants={itemVariants} className="mb-10">
            <p
              className="font-mono text-[11px] uppercase tracking-[0.12em] mb-3"
              style={{ color: "var(--accent)" }}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px"
            style={{ background: "var(--border)" }}
          >
            {howItWorks.map((item) => (
              <motion.div
                key={item.step}
                variants={itemVariants}
                className="p-8"
                style={{ background: "var(--surface)" }}
              >
                <p
                  className="font-mono font-medium text-[11px] uppercase tracking-[0.12em] mb-4"
                  style={{ color: "var(--accent)" }}
                >
                  {item.step}
                </p>
                <h3
                  className="font-syne font-bold text-[15px] mb-2"
                  style={{ color: "var(--text)" }}
                >
                  {item.title}
                </h3>
                <p className="font-sans text-[14px] leading-relaxed" style={{ color: "var(--text-2)" }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Protocol pills */}
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
              className="font-mono text-[11px] px-[9px] py-[3px] rounded-[6px] border"
              style={{
                background: "var(--surface-2)",
                borderColor: "var(--border)",
                color: "var(--text-2)",
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
