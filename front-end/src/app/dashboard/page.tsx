"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@/components/providers/wallet-provider";
import { WalletButton } from "@/components/WalletButton";
import { DevnetWalletSelector } from "@/components/wallet/devnet-wallet-selector";
import { Navbar } from "@/components/layout/Navbar";
import { TabNav } from "@/components/layout/TabNav";
import { AmbientBackground } from "@/components/layout/AmbientBackground";
import { AgentHeroBanner } from "@/components/agent/AgentHeroBanner";
import { AgentModeCard } from "@/components/agent/AgentModeCard";
import { AgentActivityFeed } from "@/components/agent/AgentActivityFeed";
import { MolbotPanel } from "@/components/agent/MolbotPanel";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { PositionHero } from "@/components/dashboard/PositionHero";
import { StrategyCards } from "@/components/dashboard/StrategyCards";
import { TxHistory } from "@/components/dashboard/TxHistory";
import { DepositForm } from "@/components/deposit/DepositForm";
import { WithdrawForm } from "@/components/withdraw/WithdrawForm";
import { GLASS_BASE } from "@/components/ui/card";
import { stagger, fadeUp, tabPanel } from "@/lib/motion";
import { Footer } from "@/components/Footer";

const TABS = [
  { id: "overview",  label: "Overview"  },
  { id: "deposit",   label: "Deposit"   },
  { id: "withdraw",  label: "Withdraw"  },
  { id: "history",   label: "History"   },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const { address, isConnected, isDevnet } = useWallet();

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <AmbientBackground />
      <Navbar />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-[960px] mx-auto px-6 py-8 flex flex-col gap-4"
      >
        {/* Page header */}
        <motion.div variants={fadeUp} custom={0} className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] mb-2" style={{ color: "#f7931a" }}>
              DASHBOARD
            </p>
            <h1 className="font-display font-black text-[30px] tracking-tight" style={{ color: "var(--text)" }}>
              sBTC Yield Aggregator
            </h1>
            <p className="font-body text-[15px] mt-1" style={{ color: "var(--text-2)" }}>
              Earn Bitcoin-native yield across multiple protocols
            </p>
          </div>
        </motion.div>

        {/* Agent hero banner — always above tabs */}
        {isConnected && (
          <motion.div variants={fadeUp} custom={1}>
            <AgentHeroBanner onEnableClick={() => setActiveTab("overview")} />
          </motion.div>
        )}

        {/* Tab navigation */}
        <motion.div variants={fadeUp} custom={2}>
          <TabNav tabs={TABS} active={activeTab} onChange={setActiveTab} />
        </motion.div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              variants={tabPanel}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col gap-4"
            >
              <StatsRow />

              {isConnected && address ? (
                <>
                  {/* Agent Mode */}
                  <AgentModeCard />

                  {/* Agent Activity */}
                  <AgentActivityFeed />

                  {/* Position + Strategy side by side */}
                  <div className="grid grid-cols-1 lg:grid-cols-[40fr_60fr] gap-4">
                    <PositionHero userAddress={address} />
                    <StrategyCards />
                  </div>
                </>
              ) : (
                <EmptyState />
              )}

              {/* Molbot Panel */}
              <MolbotPanel />
            </motion.div>
          )}

          {activeTab === "deposit" && (
            <motion.div
              key="deposit"
              variants={tabPanel}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {isConnected && address ? (
                <DepositForm onSuccess={() => setActiveTab("overview")} />
              ) : (
                <EmptyState />
              )}
            </motion.div>
          )}

          {activeTab === "withdraw" && (
            <motion.div
              key="withdraw"
              variants={tabPanel}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {isConnected && address ? (
                <WithdrawForm userAddress={address} onSuccess={() => setActiveTab("overview")} />
              ) : (
                <EmptyState />
              )}
            </motion.div>
          )}

          {activeTab === "history" && (
            <motion.div
              key="history"
              variants={tabPanel}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <TxHistory />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <Footer />
    </div>
  );
}

function EmptyState() {
  const { isDevnet } = useWallet();

  return (
    <div
      className="rounded-card p-[26px] flex flex-col items-center justify-center min-h-[14rem] gap-5"
      style={{ ...GLASS_BASE }}
    >
      <p className="font-mono text-[13px] text-center" style={{ color: "var(--text-muted)" }}>
        Connect your wallet to view your position
      </p>
      <WalletButton />
      {isDevnet && (
        <div className="flex flex-col items-center gap-2 w-full max-w-xs">
          <div className="flex items-center gap-3 w-full">
            <span className="flex-1 border-t" style={{ borderColor: "var(--border)" }} />
            <span className="font-mono text-[10px] uppercase tracking-[0.1em]" style={{ color: "var(--text-muted)" }}>
              or use a test wallet
            </span>
            <span className="flex-1 border-t" style={{ borderColor: "var(--border)" }} />
          </div>
          <DevnetWalletSelector />
          <p className="font-mono text-[10px] text-center" style={{ color: "var(--text-muted)" }}>
            Pre-funded Clarinet devnet accounts
          </p>
        </div>
      )}
    </div>
  );
}
