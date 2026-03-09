export type NetworkType = "devnet" | "testnet" | "mainnet"

export interface NetworkConfig {
  name: NetworkType
  label: string
  variant: "default" | "accent" | "green" | "red" | "yellow" | "outline"
}

export const NETWORKS: Record<NetworkType, NetworkConfig> = {
  devnet:  { name: "devnet",   label: "Devnet",   variant: "yellow" },
  testnet: { name: "testnet",  label: "Testnet",  variant: "default" },
  mainnet: { name: "mainnet",  label: "Mainnet",  variant: "green" },
}

export function getNetworkConfig(network: NetworkType): NetworkConfig {
  return NETWORKS[network]
}
