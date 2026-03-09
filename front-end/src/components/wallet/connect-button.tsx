"use client";

import { motion } from "framer-motion";
import { useWallet } from "@/components/providers/wallet-provider";
import { DevnetWalletSelector } from "./devnet-wallet-selector";

export function ConnectButton() {
  const { isDevnet, isConnecting, connectWallet } = useWallet();

  if (isDevnet) {
    return <DevnetWalletSelector />;
  }

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -1 }}
      onClick={connectWallet}
      disabled={isConnecting}
      className="font-syne font-bold text-[14px] rounded-[11px] px-[20px] py-[10px] transition-all duration-[180ms] disabled:opacity-40 disabled:cursor-not-allowed"
      style={{ background: "var(--accent)", color: "#000" }}
      onMouseEnter={(e) => {
        if (!(e.currentTarget as HTMLButtonElement).disabled) {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 5px 22px rgba(247,147,26,0.3)";
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "";
      }}
    >
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </motion.button>
  );
}
