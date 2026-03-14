"use client";

import { useWallet } from "@/hooks/useWallet";
import { formatStxAddress } from "@/lib/address-utils";

export function WalletButton() {
  const { connected, stxAddress, connecting, connect, disconnect } = useWallet();

  if (connected && stxAddress) {
    return (
      <button
        onClick={disconnect}
        className="flex items-center gap-2 px-[12px] py-[7px] rounded-[10px] transition-all duration-[180ms] cursor-pointer font-mono text-[12px]"
        style={{
          background:  "#0d0d15",
          border:      "1px solid var(--border)",
          color:       "var(--text)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-green)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
        }}
      >
        <span className="relative flex h-[6px] w-[6px] shrink-0" aria-hidden="true">
          <span className="wallet-pulse-ring" />
          <span className="wallet-pulse-dot" />
        </span>
        {formatStxAddress(stxAddress, { start: 5, end: 4 })}
      </button>
    );
  }

  return (
    <button
      onClick={() => { void connect(); }}
      disabled={connecting}
      className="font-body font-medium text-[13px] rounded-[11px] px-[20px] py-[10px] border transition-all duration-[180ms] disabled:opacity-40 disabled:cursor-not-allowed"
      style={{
        background:  "transparent",
        borderColor: "var(--border)",
        color:       "var(--text)",
      }}
      onMouseEnter={(e) => {
        if (!(e.currentTarget as HTMLButtonElement).disabled) {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-hover)";
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
      }}
    >
      {connecting ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
