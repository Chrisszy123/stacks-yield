import { DEVNET_STACKS_BLOCKCHAIN_API_URL, DEVNET_NODE_RPC_URL } from "@/constants/devnet";
import { createClient } from "@stacks/blockchain-api-client";
import { STACKS_TESTNET, STACKS_DEVNET, STACKS_MAINNET } from "@stacks/network";
import { Network } from "./contract-utils";

type HTTPHeaders = Record<string, string>;

export const STACKS_API_MAINNET_URL = "https://api.mainnet.hiro.so";
export const STACKS_API_TESTNET_URL = "https://api.testnet.hiro.so";

const isDevnet = () => process.env.NEXT_PUBLIC_STACKS_NETWORK === "devnet";

/**
 * Returns the base URL for the stacks-api indexer (extended endpoints).
 * On devnet the indexer often lags behind the node — prefer getNodeRpcUrl()
 * or callReadOnly() for contract reads.
 */
export function getStacksUrl() {
  if (isDevnet()) return DEVNET_STACKS_BLOCKCHAIN_API_URL;
  if (process.env.NEXT_PUBLIC_STACKS_NETWORK === "testnet") return STACKS_API_TESTNET_URL;
  return STACKS_API_MAINNET_URL;
}

/**
 * Returns the base URL for the Stacks node RPC (v2 endpoints).
 * On devnet this is port 20443; on testnet/mainnet Hiro hosts both
 * the indexer and the node behind the same origin.
 */
export function getNodeRpcUrl() {
  if (isDevnet()) return DEVNET_NODE_RPC_URL;
  if (process.env.NEXT_PUBLIC_STACKS_NETWORK === "testnet") return STACKS_API_TESTNET_URL;
  return STACKS_API_MAINNET_URL;
}

/**
 * Shared helper for calling read-only contract functions via the node RPC.
 * Always routes through the node (not the indexer) so it works immediately
 * on devnet even when the stacks-api hasn't finished indexing.
 */
export async function callReadOnly(
  contractAddress: string,
  contractName: string,
  functionName: string,
  sender: string,
  args: string[] = []
) {
  const url = `${getNodeRpcUrl()}/v2/contracts/call-read/${contractAddress}/${contractName}/${functionName}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sender, arguments: args }),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`call-read ${contractAddress}.${contractName}::${functionName} failed: ${text}`);
  }
  return response.json();
}

export function getStacksNetworkString(): Network {
  return (process.env.NEXT_PUBLIC_STACKS_NETWORK || "devnet") as Network;
}

export function getStacksNetwork() {
  if (process.env.NEXT_PUBLIC_STACKS_NETWORK === "devnet") {
    return STACKS_DEVNET;
  } else if (process.env.NEXT_PUBLIC_STACKS_NETWORK === "testnet") {
    return STACKS_TESTNET;
  } else {
    return STACKS_MAINNET;
  }
}

export type StacksApiClient = ReturnType<typeof createClient>;

export const getApi = (stacksApiUrl: string, headers?: HTTPHeaders): StacksApiClient => {
  const client = createClient({ baseUrl: stacksApiUrl });

  if (headers) {
    client.use({
      onRequest({ request }) {
        Object.entries(headers).forEach(([key, value]) => {
          request.headers.set(key, value);
        });
        return request;
      },
    });
  }

  return client;
};
