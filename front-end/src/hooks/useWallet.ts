"use client";

import { useMemo } from 'react';
import { useWallet as useWalletContext } from '@/components/providers/wallet-provider';
import { getBtcAddress } from '@/lib/wallet';
import type { DevnetWallet } from '@/lib/devnet-wallet-context';

export interface UseWalletReturn {
  connected: boolean;
  connecting: boolean;
  stxAddress: string | null;
  btcAddress: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  // devnet helpers — null on testnet/mainnet
  isDevnet: boolean;
  devnetWallet: DevnetWallet | null;
  setDevnetWallet: (wallet: DevnetWallet | null) => void;
}

export function useWallet(): UseWalletReturn {
  const {
    isConnected: connected,
    isConnecting: connecting,
    address: stxAddress,
    connectWallet: connect,
    disconnectWallet: disconnect,
    isDevnet,
    devnetWallet,
    setDevnetWallet,
  } = useWalletContext();

  const btcAddress = useMemo((): string | null => {
    if (isDevnet || !connected) return null;
    return getBtcAddress();
  }, [connected, isDevnet]);

  return {
    connected,
    connecting,
    stxAddress,
    btcAddress,
    connect,
    disconnect,
    isDevnet,
    devnetWallet,
    setDevnetWallet,
  };
}
