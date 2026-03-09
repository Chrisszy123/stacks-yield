"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useWallet } from "@/components/providers/wallet-provider";
import { ConnectButton } from "@/components/wallet/connect-button";
import { WalletDropdown } from "@/components/wallet/wallet-dropdown";
import { useCurrentBtcBlock } from "@/hooks/chainQueries";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { isConnected } = useWallet();
  const { data: blockHeight } = useCurrentBtcBlock();
  const [flash, setFlash] = useState(false);
  const prevBlock = useRef<number | null>(null);

  useEffect(() => {
    if (blockHeight !== undefined && prevBlock.current !== null && blockHeight !== prevBlock.current) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 280);
      return () => clearTimeout(t);
    }
    prevBlock.current = blockHeight ?? null;
  }, [blockHeight]);

  return (
    <nav
      className="sticky top-0 z-40 flex items-center justify-between px-6 h-16"
      style={{
        backdropFilter: "blur(20px)",
        background: "rgba(4,4,10,0.82)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-0 select-none">
        <span className="font-syne font-[800] text-[20px]" style={{ color: "var(--text)" }}>
          Stack
        </span>
        <span className="font-syne font-[800] text-[20px]" style={{ color: "#f7931a" }}>
          Yield
        </span>
      </Link>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-6">
        <Link
          href="/dashboard"
          className="font-sans font-medium text-[14px] transition-colors duration-[180ms]"
          style={{ color: "var(--text-2)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-2)")}
        >
          Dashboard
        </Link>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Block counter */}
        {blockHeight !== undefined && (
          <div
            className={cn(
              "font-mono text-[11px] px-[9px] py-[3px] rounded-[6px] transition-colors duration-[180ms]",
              flash ? "block-flash" : ""
            )}
            style={{
              color:                flash ? "#f7931a" : "var(--text-muted)",
              background:           "rgba(255,255,255,0.04)",
              backdropFilter:       "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border:               "1px solid rgba(255,255,255,0.08)",
            }}
          >
            #{blockHeight.toLocaleString()}
          </div>
        )}

        {/* Wallet */}
        {isConnected ? <WalletDropdown /> : <ConnectButton />}
      </div>
    </nav>
  );
}
