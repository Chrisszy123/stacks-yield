"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { devnetWallets, type DevnetWallet } from "@/lib/devnet-wallet-context"
import { useWallet } from "@/components/providers/wallet-provider"
import { formatStxAddress } from "@/lib/address-utils"
import { cn } from "@/lib/utils"
import { useStxBalance, useSbtcBalance } from "@/hooks/balanceQueries"
import { useFaucet } from "@/hooks/useFaucet"

function DevnetWalletItem({
  wallet,
  isSelected,
  onSelect,
}: {
  wallet: DevnetWallet
  isSelected: boolean
  onSelect: () => void
}) {
  const { data: stxBalance, isLoading: stxLoading } = useStxBalance(wallet.stxAddress)
  const { data: sbtcBalance, isLoading: sbtcLoading } = useSbtcBalance(wallet.stxAddress)

  return (
    <DropdownMenuItem
      onClick={onSelect}
      className={cn(isSelected && "bg-accent")}
    >
      <div className="flex flex-col gap-0.5 w-full">
        <div className="flex items-center justify-between">
          <span className="font-medium">{wallet.label}</span>
          {isSelected && (
            <span className="text-[10px] font-mono" style={{ color: "var(--green)" }}>
              active
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="font-mono">{formatStxAddress(wallet.stxAddress)}</span>
          <span>·</span>
          <span className={stxLoading ? "opacity-40" : ""}>
            {stxLoading ? "—" : `${(stxBalance ?? 0).toLocaleString()} STX`}
          </span>
          <span>·</span>
          <span className={sbtcLoading ? "opacity-40" : ""}>
            {sbtcLoading ? "—" : `${sbtcBalance ?? 0} sBTC`}
          </span>
        </div>
      </div>
    </DropdownMenuItem>
  )
}

export function DevnetWalletSelector() {
  const { devnetWallet, setDevnetWallet, isConnected } = useWallet()
  const { drip, isLoading: faucetLoading } = useFaucet()

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="font-mono text-xs">
            {devnetWallet ? (
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ background: "var(--green)" }}
                />
                {formatStxAddress(devnetWallet.stxAddress)}
              </span>
            ) : (
              "Select Test Wallet"
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <div className="px-3 py-1.5">
            <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
              Clarinet pre-funded accounts
            </p>
          </div>
          <DropdownMenuSeparator />
          {devnetWallets.map((wallet) => (
            <DevnetWalletItem
              key={wallet.stxAddress}
              wallet={wallet}
              isSelected={devnetWallet?.stxAddress === wallet.stxAddress}
              onSelect={() => setDevnetWallet(wallet)}
            />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Faucet — mint 1 mock sBTC to the selected wallet */}
      {isConnected && devnetWallet && (
        <button
          onClick={() => drip(1)}
          disabled={faucetLoading}
          title="Mint 1 mock sBTC to your wallet"
          className="font-mono text-[11px] px-[10px] py-[6px] rounded-[8px] border transition-all duration-[180ms] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: "transparent",
            borderColor: "rgba(61,214,140,0.3)",
            color: "var(--green)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(61,214,140,0.6)";
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(61,214,140,0.06)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(61,214,140,0.3)";
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          {faucetLoading ? "minting…" : "+ 1 sBTC"}
        </button>
      )}
    </div>
  )
}
