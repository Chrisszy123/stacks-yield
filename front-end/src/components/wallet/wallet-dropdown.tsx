"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWallet } from "@/components/providers/wallet-provider";
import { formatStxAddress } from "@/lib/address-utils";
import { toast } from "sonner";
import { useStxBalance, useSbtcBalance } from "@/hooks/balanceQueries";

export function WalletDropdown() {
  const { address, disconnectWallet } = useWallet();
  const { data: stxBalance, isLoading: stxLoading } = useStxBalance(address || null);
  const { data: sbtcBalance, isLoading: sbtcLoading } = useSbtcBalance(address || null);

  const copyAddress = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      toast.success("Address copied");
    } catch {
      toast.error("Failed to copy address");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 px-[14px] py-[8px] rounded-[11px] border transition-all duration-[180ms] cursor-pointer outline-none"
          style={{
            background: "var(--surface-2)",
            borderColor: "var(--border)",
            color: "var(--text-2)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-hover)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-2)";
          }}
        >
          {/* Green pulse dot */}
          <span className="relative flex h-[6px] w-[6px] shrink-0">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ background: "var(--green)" }}
            />
            <span
              className="relative inline-flex rounded-full h-[6px] w-[6px]"
              style={{ background: "var(--green)" }}
            />
          </span>
          <span className="font-mono text-[13px]">
            {formatStxAddress(address || "")}
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 rounded-[12px] border p-1"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
          boxShadow: "none",
        }}
      >
        <DropdownMenuLabel className="px-3 py-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px]" style={{ color: "var(--text-muted)" }}>STX</span>
              <span className="font-mono text-[13px]" style={{ color: "var(--text)" }}>
                {stxLoading ? "—" : stxBalance}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px]" style={{ color: "var(--text-muted)" }}>sBTC</span>
              <span className="font-mono text-[13px]" style={{ color: "var(--accent)" }}>
                {sbtcLoading ? "—" : sbtcBalance}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator style={{ background: "var(--border)" }} />

        <DropdownMenuItem
          onClick={copyAddress}
          className="rounded-[8px] px-3 py-2 cursor-pointer transition-colors duration-[180ms]"
          style={{ color: "var(--text-2)" }}
        >
          <span className="font-mono text-[11px] truncate w-full">{address}</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator style={{ background: "var(--border)" }} />

        <DropdownMenuItem
          onClick={disconnectWallet}
          className="rounded-[8px] px-3 py-2 cursor-pointer transition-colors duration-[180ms]"
          style={{ color: "var(--red)" }}
        >
          <span className="font-sans text-[13px]">Disconnect</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
