import { devnetWallets } from "@/lib/devnet-wallets";

const DEPLOYER_ADDRESS =
  process.env.NEXT_PUBLIC_STACKS_NETWORK === "devnet"
    ? devnetWallets[0].stxAddress
    : process.env.NEXT_PUBLIC_STACKS_NETWORK === "testnet"
    ? (process.env.NEXT_PUBLIC_CONTRACT_DEPLOYER_TESTNET_ADDRESS ?? "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM")
    : (process.env.NEXT_PUBLIC_CONTRACT_DEPLOYER_MAINNET_ADDRESS ?? "SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM");

export { DEPLOYER_ADDRESS };

export const COUNTER_CONTRACT = {
  address: DEPLOYER_ADDRESS,
  name: "counter",
} as const;

export const CONTRACTS = {
  aggregator: `${DEPLOYER_ADDRESS}.${process.env.NEXT_PUBLIC_STACKS_NETWORK === "testnet" ? "sbtc-yield-aggregator-v2" : "sbtc-yield-aggregator"}`,
  ysbtcToken: `${DEPLOYER_ADDRESS}.ysbtc-token`,
  mockSbtc: `${DEPLOYER_ADDRESS}.mock-sbtc`,
  strategyZest: `${DEPLOYER_ADDRESS}.strategy-zest`,
  strategyBitflow: `${DEPLOYER_ADDRESS}.strategy-bitflow`,
  strategyAlex: `${DEPLOYER_ADDRESS}.strategy-alex`,
  agentPermissions: `${DEPLOYER_ADDRESS}.agent-permissions`,
  molbotRegistry: `${DEPLOYER_ADDRESS}.molbot-registry`,
  x402Verifier: `${DEPLOYER_ADDRESS}.x402-verifier`,
} as const;
