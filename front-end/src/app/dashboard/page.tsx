"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useWallet } from "@/components/providers/wallet-provider";
import { ConnectButton } from "@/components/wallet/connect-button";
import { Navbar } from "@/components/navbar";
import { VaultStats } from "@/components/VaultStats";
import { PositionCard } from "@/components/PositionCard";
import { ProtocolAPYTable } from "@/components/ProtocolAPYTable";
import { DepositModal } from "@/components/DepositModal";
import { pageVariants, itemVariants } from "@/lib/motion";

export default function DashboardPage() {
  const [depositOpen, setDepositOpen] = useState(false);
  const { address, isConnected } = useWallet();

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />

      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-6 py-10 space-y-10"
      >
        {/* Page header */}
        <motion.div
          variants={itemVariants}
          className="flex items-end justify-between flex-wrap gap-4"
        >
          <div>
            <p
              className="font-mono text-[11px] uppercase tracking-[0.12em] mb-3"
              style={{ color: "var(--accent)" }}
            >
              Dashboard
            </p>
            <h1
              className="font-syne font-bold text-[30px] tracking-tight"
              style={{ color: "var(--text)" }}
            >
              sBTC Yield Aggregator
            </h1>
            <p className="font-sans text-[15px] mt-1" style={{ color: "var(--text-2)" }}>
              Earn Bitcoin-native yield across multiple protocols
            </p>
          </div>

          {isConnected && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ y: -1 }}
              onClick={() => setDepositOpen(true)}
              className="font-syne font-bold text-[14px] rounded-[11px] px-[26px] py-[13px] transition-all duration-[180ms]"
              style={{ background: "var(--accent)", color: "#000" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 5px 22px rgba(247,147,26,0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "";
              }}
            >
              + Deposit sBTC
            </motion.button>
          )}
        </motion.div>

        {/* Vault stats */}
        <motion.section variants={itemVariants}>
          <SectionLabel>Vault Overview</SectionLabel>
          <VaultStats />
        </motion.section>

        {/* Position + APY */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <motion.section variants={itemVariants}>
            <SectionLabel>Your Position</SectionLabel>
            {isConnected && address ? (
              <PositionCard userAddress={address} />
            ) : (
              <EmptyPositionState />
            )}
          </motion.section>

          <motion.section variants={itemVariants}>
            <SectionLabel>Live Protocol APYs</SectionLabel>
            <ProtocolAPYTable />
          </motion.section>
        </div>

        {/* How it works */}
        <motion.section variants={itemVariants}>
          <SectionLabel>How it works</SectionLabel>
          <div
            className="rounded-[16px] grid grid-cols-1 md:grid-cols-3 gap-px overflow-hidden"
            style={{ border: "1px solid var(--border)", background: "var(--border)" }}
          >
            {[
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
            ].map((item) => (
              <div
                key={item.step}
                className="p-7"
                style={{ background: "var(--surface)" }}
              >
                <p
                  className="font-mono text-[11px] uppercase tracking-[0.12em] mb-3"
                  style={{ color: "var(--accent)" }}
                >
                  {item.step}
                </p>
                <p className="font-syne font-bold text-[15px] mb-2" style={{ color: "var(--text)" }}>
                  {item.title}
                </p>
                <p className="font-sans text-[14px] leading-relaxed" style={{ color: "var(--text-2)" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.section>
      </motion.div>

      <DepositModal isOpen={depositOpen} onClose={() => setDepositOpen(false)} />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-mono text-[11px] uppercase tracking-[0.12em] mb-4"
      style={{ color: "var(--text-muted)" }}
    >
      {children}
    </p>
  );
}

function EmptyPositionState() {
  return (
    <div
      className="rounded-[16px] p-[26px] flex flex-col items-center justify-center min-h-[14rem]"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      <p
        className="font-mono text-[13px] text-center mb-5"
        style={{ color: "var(--text-muted)" }}
      >
        Connect your wallet to view your position
      </p>
      <ConnectButton />
    </div>
  );
}
