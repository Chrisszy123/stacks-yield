"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import { connect, disconnect, isConnected, getLocalStorage } from "@stacks/connect"
import { DevnetWallet } from "@/lib/devnet-wallet-context"
import { NetworkType } from "@/lib/networks"

interface WalletContextType {
  // Connection state
  isConnected: boolean
  isConnecting: boolean

  // User data
  address: string | null
  network: NetworkType

  // Actions
  connectWallet: () => Promise<void>
  disconnectWallet: () => void

  // Devnet specific
  isDevnet: boolean
  devnetWallet: DevnetWallet | null
  setDevnetWallet: (wallet: DevnetWallet | null) => void
}

const WalletContext = createContext<WalletContextType | null>(null)

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  // Get network from environment, default to devnet
  const network = (process.env.NEXT_PUBLIC_STACKS_NETWORK || "devnet") as NetworkType
  const isDevnet = network === "devnet"

  // State
  const [mounted, setMounted] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [leatherConnected, setLeatherConnected] = useState(false)
  const [devnetWallet, setDevnetWallet] = useState<DevnetWallet | null>(null)

  // Mount effect - hydrate Leather session on all networks
  useEffect(() => {
    setMounted(true)
    setLeatherConnected(isConnected())
  }, [])

  // Real Leather wallet connection — works on devnet, testnet, and mainnet
  const connectWallet = useCallback(async () => {
    try {
      setIsConnecting(true)
      await connect()
      setLeatherConnected(isConnected())
    } catch {
      // user cancelled — swallow silently
    } finally {
      setIsConnecting(false)
    }
  }, [])

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    disconnect()
    setLeatherConnected(false)
    setDevnetWallet(null)
  }, [])

  // Compute current address — Leather takes priority; devnet mnemonic is a fallback
  const address = useMemo(() => {
    if (!mounted) return null

    if (leatherConnected) {
      const data = getLocalStorage()
      const stxAddresses = data?.addresses?.stx || []
      return stxAddresses.length > 0 ? stxAddresses[0].address : null
    }

    if (isDevnet && devnetWallet) {
      return devnetWallet.stxAddress
    }

    return null
  }, [mounted, isDevnet, devnetWallet, leatherConnected])

  // Compute connection state
  const isConnectedValue = useMemo(() => {
    if (!mounted) return false
    return leatherConnected || (isDevnet && devnetWallet !== null)
  }, [mounted, isDevnet, devnetWallet, leatherConnected])

  const contextValue = useMemo<WalletContextType>(
    () => ({
      isConnected: isConnectedValue,
      isConnecting,
      address,
      network,
      connectWallet,
      disconnectWallet,
      isDevnet,
      devnetWallet,
      setDevnetWallet,
    }),
    [
      isConnectedValue,
      isConnecting,
      address,
      network,
      connectWallet,
      disconnectWallet,
      isDevnet,
      devnetWallet,
    ]
  )

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet(): WalletContextType {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
