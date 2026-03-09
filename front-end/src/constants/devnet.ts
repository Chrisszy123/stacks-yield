import { STACKS_TESTNET, StacksNetwork } from "@stacks/network";

export const DEVNET_STACKS_BLOCKCHAIN_API_URL = "http://localhost:3999";

// The Stacks node RPC — available immediately, no indexing lag.
// Use this on devnet for balance reads instead of the stacks-api.
export const DEVNET_NODE_RPC_URL = "http://localhost:20443";

export const DEVNET_NETWORK: StacksNetwork = {
  ...STACKS_TESTNET,
  client: { baseUrl: DEVNET_STACKS_BLOCKCHAIN_API_URL },
};
