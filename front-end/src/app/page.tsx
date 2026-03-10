"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, RefreshCw, BarChart3, Shield, Activity, ArrowDownToLine, type LucideIcon } from "lucide-react";
import { pageVariants, itemVariants } from "@/lib/motion";
import { HeroBackground } from "@/components/HeroBackground";
import { HowItWorksIllustration } from "@/components/HowItWorksIllustration";
import { LiveMetrics } from "@/components/landing/LiveMetrics";
import { Footer } from "@/components/Footer";

const protocols = ["Zest Protocol", "Bitflow", "ALEX"];

function usePrimaryHover() {
  return {
    onMouseEnter: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
      const el = e.currentTarget;
      el.style.background = "#ffaa47";
      el.style.transform = "translateY(-2px)";
      el.style.boxShadow = "0 8px 28px rgba(247,147,26,0.40)";
    },
    onMouseLeave: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
      const el = e.currentTarget;
      el.style.background = "#f7931a";
      el.style.transform = "";
      el.style.boxShadow = "none";
    },
  };
}

function useGhostHover() {
  return {
    onMouseEnter: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
      const el = e.currentTarget;
      el.style.background = "rgba(255,255,255,0.05)";
      el.style.borderColor = "rgba(255,255,255,0.28)";
      el.style.boxShadow = "0 4px 16px rgba(0,0,0,0.25)";
    },
    onMouseLeave: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
      const el = e.currentTarget;
      el.style.background = "transparent";
      el.style.borderColor = "rgba(255,255,255,0.18)";
      el.style.boxShadow = "none";
    },
  };
}

const GLASS = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.09)",
  boxShadow:
    "0 2px 4px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.07)",
};

const features: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Lock,
    title: "Non-Custodial",
    desc: "Your keys, your sBTC. The vault is a smart contract on Stacks — no intermediary ever holds your funds.",
  },
  {
    icon: RefreshCw,
    title: "Auto-Compounding",
    desc: "Yield from protocols is automatically reinvested. Your ysBTC shares appreciate over time without manual action.",
  },
  {
    icon: BarChart3,
    title: "Risk Tiers",
    desc: "Choose Conservative (Zest, ~2%), Balanced (Bitflow, ~12%), or Aggressive (ALEX, ~45%) to match your risk appetite.",
  },
  {
    icon: Shield,
    title: "Bitcoin-Native",
    desc: "Built on Stacks, secured by Bitcoin. Earn yield on sBTC without leaving the Bitcoin ecosystem.",
  },
  {
    icon: Activity,
    title: "Transparent",
    desc: "All vault state is on-chain. Track TVL, share prices, and strategy allocations in real time.",
  },
  {
    icon: ArrowDownToLine,
    title: "Withdraw Anytime",
    desc: "Burn your ysBTC receipt tokens to redeem sBTC at the current share price. No lock-ups, no delays.",
  },
];

const faqs = [
  {
    q: "What is sBTC?",
    a: "sBTC is a 1:1 Bitcoin-backed asset on the Stacks blockchain. It lets you use your BTC in DeFi applications while maintaining the security guarantees of the Bitcoin network.",
  },
  {
    q: "What is ysBTC?",
    a: "ysBTC is a receipt token you receive when you deposit sBTC into the StackYield vault. It represents your proportional share of the vault's total assets. As the vault earns yield, each ysBTC becomes redeemable for more sBTC over time.",
  },
  {
    q: "How are yields generated?",
    a: "The vault routes your sBTC to DeFi protocols on Stacks — Zest Protocol (lending), Bitflow (liquidity provision), and ALEX (yield farming). Each strategy has a different risk-reward profile.",
  },
  {
    q: "What are the fees?",
    a: "A 0.5% protocol fee is deducted when you withdraw. There are no deposit fees, no management fees, and no performance fees. Gas fees (STX) apply for on-chain transactions.",
  },
  {
    q: "Can I lose my deposit?",
    a: "The vault smart contract is non-custodial — only you can withdraw your funds. However, strategy risks exist: smart contract risk in underlying protocols, impermanent loss in LP strategies, and potential liquidation in lending protocols. Choose a risk tier that matches your comfort level.",
  },
  {
    q: "Which network does StackYield run on?",
    a: "StackYield runs on the Stacks blockchain, which settles transactions on Bitcoin. Currently available on Stacks testnet. Connect with a Leather or Xverse wallet to get started.",
  },
];

const strategiesDetailed = [
  {
    name: "Conservative",
    protocol: "Zest Protocol",
    apy: "1–3%",
    risk: "Low",
    color: "#3dd68c",
    bgColor: "rgba(61,214,140,0.06)",
    borderColor: "rgba(61,214,140,0.2)",
    desc: "Supply sBTC to Zest's lending protocol for stable, predictable Bitcoin-native yield with minimal risk.",
  },
  {
    name: "Balanced",
    protocol: "Bitflow",
    apy: "8–20%",
    risk: "Medium",
    color: "#f5c842",
    bgColor: "rgba(245,200,66,0.06)",
    borderColor: "rgba(245,200,66,0.2)",
    desc: "Provide liquidity to sBTC/STX pools on Bitflow DEX. Higher yield with moderate impermanent loss risk.",
  },
  {
    name: "Aggressive",
    protocol: "ALEX",
    apy: "30–100%",
    risk: "High",
    color: "#f16a6a",
    bgColor: "rgba(241,106,106,0.06)",
    borderColor: "rgba(241,106,106,0.2)",
    desc: "ALEX yield farming with leveraged strategies. Maximum returns for those comfortable with higher volatility.",
  },
];

export default function HomePage() {
  const primaryHover = usePrimaryHover();
  const ghostHover = useGhostHover();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* ── Header ──────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 h-16"
        style={{
          backdropFilter: "blur(20px)",
          background: "rgba(4,4,10,0.82)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center select-none">
          <span className="font-syne font-[800] text-[20px]" style={{ color: "var(--text)" }}>
            Stack
          </span>
          <span className="font-syne font-[800] text-[20px]" style={{ color: "#f7931a" }}>
            Yield
          </span>
        </div>
        <nav className="flex items-center gap-6">
          <a
            href="#features"
            className="font-sans text-[14px] hidden sm:block"
            style={{ color: "var(--text-2)", transition: "color 0.18s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-2)")}
          >
            Features
          </a>
          <a
            href="#strategies"
            className="font-sans text-[14px] hidden sm:block"
            style={{ color: "var(--text-2)", transition: "color 0.18s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-2)")}
          >
            Strategies
          </a>
          <a
            href="#faq"
            className="font-sans text-[14px] hidden sm:block"
            style={{ color: "var(--text-2)", transition: "color 0.18s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-2)")}
          >
            FAQ
          </a>
          <Link
            href="/dashboard"
            className="font-syne font-bold text-[13px] rounded-[9px] px-5 py-[8px]"
            style={{
              background: "#f7931a",
              color: "#fff",
              transition: "background 0.18s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#ffaa47")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#f7931a")}
          >
            Launch App
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* ── Hero ────────────────────────────────────────────────── */}
        <section
          className="relative flex items-center justify-center overflow-hidden"
          style={{ minHeight: "88vh" }}
        >
          <HeroBackground />
          <motion.div
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            className="relative flex flex-col items-center text-center px-6 py-20 max-w-4xl mx-auto"
            style={{ zIndex: 10 }}
          >
            <motion.div variants={itemVariants}>
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-10"
                style={{
                  background: "rgba(247,147,26,0.09)",
                  border: "1px solid rgba(247,147,26,0.28)",
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

            <motion.h1
              variants={itemVariants}
              className="font-syne font-[800] tracking-[-0.03em] mb-6"
              style={{
                fontSize: "clamp(44px, 7vw, 80px)",
                color: "var(--text)",
                lineHeight: 1.05,
              }}
            >
              Stack<span style={{ color: "#f7931a" }}>Yield</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="font-sans text-[17px] leading-relaxed mb-12 max-w-xl"
              style={{ color: "var(--text-2)" }}
            >
              The first sBTC yield aggregator on Stacks. Deposit once, earn across Zest, Bitflow, and
              ALEX, fully non-custodial, fully on-chain.
            </motion.p>

            <motion.div variants={itemVariants} className="flex gap-3 flex-wrap justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center font-syne font-[800] text-[15px] tracking-[0.01em] rounded-[11px] px-8 py-[14px] active:scale-[0.97]"
                style={{
                  background: "#f7931a",
                  color: "#ffffff",
                  transition:
                    "background 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
                }}
                {...primaryHover}
              >
                Launch App →
              </Link>
              <a
                href="https://github.com/Chrisszy123/stacks-yield"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center font-syne font-[800] text-[15px] tracking-[0.01em] rounded-[11px] px-8 py-[14px] active:scale-[0.97]"
                style={{
                  background: "transparent",
                  borderWidth: "1.5px",
                  borderStyle: "solid",
                  borderColor: "rgba(255,255,255,0.18)",
                  color: "#edecf2",
                  transition: "all 0.18s ease",
                }}
                {...ghostHover}
              >
                View Code
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* ── Live Metrics (real-time from chain) ───────────────── */}
        <section className="max-w-5xl mx-auto px-6 pb-28">
          <LiveMetrics />
        </section>

        {/* ── Features Grid ─────────────────────────────────────── */}
        <section id="features" className="max-w-5xl mx-auto px-6 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-14"
          >
            <p
              className="font-mono text-[11px] uppercase tracking-[0.12em] mb-3"
              style={{ color: "#f7931a" }}
            >
              Why StackYield
            </p>
            <h2
              className="font-syne font-bold text-[30px] tracking-tight mb-3"
              style={{ color: "var(--text)" }}
            >
              DeFi yield, Bitcoin security
            </h2>
            <p className="font-sans text-[15px] max-w-lg mx-auto" style={{ color: "var(--text-2)" }}>
              One vault to access the best yield opportunities across the Stacks ecosystem
            </p>
          </motion.div>

          <motion.div
            variants={pageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={itemVariants}
                className="rounded-[16px] p-7 group"
                style={{
                  ...GLASS,
                  transition: "border-color 0.18s ease, box-shadow 0.18s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(247,147,26,0.22)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 4px rgba(0,0,0,0.3), 0 12px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.09)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 4px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.07)";
                }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    marginBottom: "16px",
                  }}
                >
                  <f.icon size={20} strokeWidth={1.5} color="#f7931a" />
                </div>
                <p
                  className="font-syne font-bold text-[15px] mb-2"
                  style={{ color: "var(--text)" }}
                >
                  {f.title}
                </p>
                <p className="font-sans text-[13px] leading-relaxed" style={{ color: "var(--text-2)" }}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── How it works ──────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-6 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-14"
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

        {/* ── Strategies ────────────────────────────────────────── */}
        <section id="strategies" className="max-w-5xl mx-auto px-6 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-14"
          >
            <p
              className="font-mono text-[11px] uppercase tracking-[0.12em] mb-3"
              style={{ color: "#f7931a" }}
            >
              Strategies
            </p>
            <h2
              className="font-syne font-bold text-[30px] tracking-tight mb-3"
              style={{ color: "var(--text)" }}
            >
              Pick your risk profile
            </h2>
            <p className="font-sans text-[15px] max-w-lg mx-auto" style={{ color: "var(--text-2)" }}>
              Each strategy routes your sBTC to different protocols with varying risk-reward profiles
            </p>
          </motion.div>

          <motion.div
            variants={pageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {strategiesDetailed.map((s) => (
              <motion.div
                key={s.name}
                variants={itemVariants}
                className="rounded-[16px] p-7 flex flex-col"
                style={{
                  ...GLASS,
                  borderColor: s.borderColor,
                }}
              >
                <div className="flex items-center justify-between mb-5">
                  <span
                    className="font-mono text-[11px] px-[9px] py-[3px] rounded-[6px]"
                    style={{ background: s.bgColor, color: s.color, border: `1px solid ${s.borderColor}` }}
                  >
                    {s.risk} Risk
                  </span>
                  <span className="font-mono text-[11px]" style={{ color: "var(--text-muted)" }}>
                    {s.protocol}
                  </span>
                </div>
                <p className="font-syne font-bold text-[18px] mb-2" style={{ color: "var(--text)" }}>
                  {s.name}
                </p>
                <p
                  className="font-mono font-medium text-[28px] mb-4"
                  style={{ color: s.color }}
                >
                  {s.apy} <span className="text-[14px]" style={{ color: "var(--text-muted)" }}>APY</span>
                </p>
                <p
                  className="font-sans text-[13px] leading-relaxed flex-1"
                  style={{ color: "var(--text-2)" }}
                >
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── Protocol pills ────────────────────────────────────── */}
        <motion.div
          variants={pageVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex items-center gap-3 flex-wrap justify-center pb-24 px-6"
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
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.09)",
                color: "var(--text-2)",
              }}
            >
              {name}
            </motion.span>
          ))}
        </motion.div>

        {/* ── FAQ ───────────────────────────────────────────────── */}
        <section id="faq" className="max-w-3xl mx-auto px-6 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-14"
          >
            <p
              className="font-mono text-[11px] uppercase tracking-[0.12em] mb-3"
              style={{ color: "#f7931a" }}
            >
              FAQ
            </p>
            <h2
              className="font-syne font-bold text-[30px] tracking-tight"
              style={{ color: "var(--text)" }}
            >
              Frequently asked questions
            </h2>
          </motion.div>

          <motion.div
            variants={pageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="space-y-3"
          >
            {faqs.map((faq) => (
              <FAQItem key={faq.q} question={faq.q} answer={faq.a} />
            ))}
          </motion.div>
        </section>

        {/* ── CTA Banner ────────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-6 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-[20px] p-12 text-center relative overflow-hidden"
            style={{
              ...GLASS,
              borderColor: "rgba(247,147,26,0.18)",
            }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(247,147,26,0.06) 0%, transparent 70%)",
              }}
            />
            <p
              className="font-mono text-[11px] uppercase tracking-[0.12em] mb-4 relative"
              style={{ color: "#f7931a" }}
            >
              Ready to earn?
            </p>
            <h2
              className="font-syne font-bold text-[28px] tracking-tight mb-4 relative"
              style={{ color: "var(--text)" }}
            >
              Start earning Bitcoin-native yield today
            </h2>
            <p
              className="font-sans text-[15px] mb-8 max-w-md mx-auto relative"
              style={{ color: "var(--text-2)" }}
            >
              Connect your wallet, deposit sBTC, and let the vault do the rest. No lock-ups, no
              intermediaries.
            </p>
            <div className="flex gap-3 justify-center relative">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center font-syne font-[800] text-[15px] rounded-[11px] px-8 py-[14px] active:scale-[0.97]"
                style={{
                  background: "#f7931a",
                  color: "#fff",
                  transition:
                    "background 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
                }}
                {...primaryHover}
              >
                Launch App →
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/* ── FAQ Accordion Item ─────────────────────────────────────────────── */
function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <motion.details
      variants={itemVariants}
      className="group rounded-[14px] overflow-hidden"
      style={{
        ...GLASS,
        cursor: "pointer",
      }}
    >
      <summary
        className="flex items-center justify-between px-7 py-5 select-none list-none"
        style={{ color: "var(--text)" }}
      >
        <span className="font-syne font-bold text-[15px] pr-4">{question}</span>
        <span
          className="font-mono text-[18px] flex-shrink-0 transition-transform duration-200 group-open:rotate-45"
          style={{ color: "#f7931a" }}
        >
          +
        </span>
      </summary>
      <div className="px-7 pb-6">
        <p className="font-sans text-[14px] leading-relaxed" style={{ color: "var(--text-2)" }}>
          {answer}
        </p>
      </div>
    </motion.details>
  );
}

