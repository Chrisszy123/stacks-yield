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
import { HowItWorksIllustration } from "@/components/HowItWorksIllustration";
import { pageVariants, itemVariants } from "@/lib/motion";
import { GLASS_BASE } from "@/components/ui/card";

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
              style={{ color: "#f7931a" }}
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
              onClick={() => setDepositOpen(true)}
              className="font-syne font-[800] text-[15px] tracking-[0.01em] rounded-[11px] px-8 py-[14px] disabled:opacity-40"
              style={{
                background: "#f7931a",
                color:      "#ffffff",
                transition: "background 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = "#ffaa47";
                el.style.transform  = "translateY(-2px)";
                el.style.boxShadow  = "0 8px 28px rgba(247,147,26,0.40)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = "#f7931a";
                el.style.transform  = "";
                el.style.boxShadow  = "none";
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
            className="rounded-[16px] p-8"
            style={{ ...GLASS_BASE }}
          >
            <HowItWorksIllustration />
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
      style={{ ...GLASS_BASE }}
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
