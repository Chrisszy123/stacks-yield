"use client";
import { createContext, useContext } from 'react';
import { devnetWallets } from './devnet-wallets';

export type { DevnetWallet } from './devnet-wallets';
export { devnetWallets } from './devnet-wallets';

export interface DevnetWalletContextType {
  currentWallet: import('./devnet-wallets').DevnetWallet | null;
  wallets:       import('./devnet-wallets').DevnetWallet[];
  setCurrentWallet: (wallet: import('./devnet-wallets').DevnetWallet) => void;
}

export const DevnetWalletContext = createContext<DevnetWalletContextType>({
  currentWallet:    null,
  wallets:          devnetWallets,
  setCurrentWallet: () => {},
});

export const useDevnetWallet = () => useContext(DevnetWalletContext);
