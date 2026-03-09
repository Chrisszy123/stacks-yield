"use client";
import { useState } from "react";
import Link from "next/link";
import { useWallet } from "@/components/providers/wallet-provider";
import { ConnectButton } from "@/components/wallet/connect-button";
import { WalletDropdown } from "@/components/wallet/wallet-dropdown";
import { VaultStats } from "@/components/VaultStats";
import { PositionCard } from "@/components/PositionCard";
import { ProtocolAPYTable } from "@/components/ProtocolAPYTable";
import { DepositModal } from "@/components/DepositModal";

export default function DashboardPage() {
  const [depositOpen, setDepositOpen] = useState(false);
  const { address, isConnected } = useWallet();

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1">
          <span className="text-orange-500 font-black text-xl">Stack</span>
          <span className="text-white font-black text-xl">Yield</span>
        </Link>
        <div className="flex items-center gap-3">
          {isConnected ? <WalletDropdown /> : <ConnectButton />}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Page header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-black">Dashboard</h1>
            <p className="text-zinc-500 mt-1">Earn Bitcoin-native yield with sBTC</p>
          </div>
          {isConnected && (
            <button
              onClick={() => setDepositOpen(true)}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-400 rounded-xl 
                         text-white font-bold transition-all duration-200 shadow-lg shadow-orange-500/20"
            >
              + Deposit sBTC
            </button>
          )}
        </div>

        {/* Vault-wide stats */}
        <section>
          <h2 className="text-zinc-400 text-sm font-semibold uppercase tracking-wider mb-3">
            Vault Overview
          </h2>
          <VaultStats />
        </section>

        {/* User position + APY table */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section>
            <h2 className="text-zinc-400 text-sm font-semibold uppercase tracking-wider mb-3">
              Your Position
            </h2>
            {isConnected && address ? (
              <PositionCard userAddress={address} />
            ) : (
              <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-8 flex flex-col items-center justify-center min-h-[14rem]">
                <p className="text-zinc-500 mb-4 text-center">
                  Connect your wallet to view your position and deposit sBTC
                </p>
                <ConnectButton />
              </div>
            )}
          </section>

          <section>
            <h2 className="text-zinc-400 text-sm font-semibold uppercase tracking-wider mb-3">
              Protocol APYs
            </h2>
            <ProtocolAPYTable />
          </section>
        </div>

        {/* Strategy info */}
        <section className="rounded-xl bg-zinc-900 border border-zinc-800 p-6">
          <h2 className="text-white font-bold text-lg mb-4">How StackYield Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <div key={item.step} className="flex gap-4">
                <span className="text-orange-500 font-black text-2xl font-mono leading-none mt-1">
                  {item.step}
                </span>
                <div>
                  <p className="text-white font-bold mb-1">{item.title}</p>
                  <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <DepositModal isOpen={depositOpen} onClose={() => setDepositOpen(false)} />
    </div>
  );
}
