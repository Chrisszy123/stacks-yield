import { STACKS_TESTNET, StacksNetwork } from "@stacks/network";

export const DEVNET_STACKS_BLOCKCHAIN_API_URL = "http://localhost:3999";

// Proxy through Next.js to avoid CORS when hitting the Stacks node from the browser.
// The route handler at /api/stacks-node/[...path] forwards to localhost:20443.
export const DEVNET_NODE_RPC_URL = "/api/stacks-node";

export const DEVNET_NETWORK: StacksNetwork = {
  ...STACKS_TESTNET,
  client: { baseUrl: DEVNET_NODE_RPC_URL },
};
