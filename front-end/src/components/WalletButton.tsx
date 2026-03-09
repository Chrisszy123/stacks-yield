"use client";

import { useWallet } from "@/hooks/useWallet";
import { formatStxAddress } from "@/lib/address-utils";

export function WalletButton() {
  const { connected, stxAddress, connecting, connect, disconnect } = useWallet();

  if (connected && stxAddress) {
    return (
      <button
        onClick={disconnect}
        className="flex items-center gap-2 px-[14px] py-[8px] rounded-[11px] border transition-all duration-[180ms] cursor-pointer font-mono text-[13px]"
        style={{
          background: "transparent",
          borderColor: "color-mix(in srgb, var(--green) 30%, transparent)",
          color: "var(--text)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor =
            "color-mix(in srgb, var(--green) 55%, transparent)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor =
            "color-mix(in srgb, var(--green) 30%, transparent)";
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
      className="font-syne font-bold text-[14px] rounded-[11px] px-[20px] py-[10px] border transition-all duration-[180ms] disabled:opacity-40 disabled:cursor-not-allowed"
      style={{
        background: "transparent",
        borderColor: "var(--border)",
        color: "var(--text)",
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
