import axios from "axios";
import { createHash } from "crypto";
import {
  makeContractCall,
  broadcastTransaction,
  uintCV,
  principalCV,
  PostConditionMode,
} from "@stacks/transactions";
import { STACKS_TESTNET, STACKS_MAINNET } from "@stacks/network";
import dotenv from "dotenv";

dotenv.config();

const STACKS_API = process.env.STACKS_API_URL || "https://api.testnet.hiro.so";
const KEEPER_KEY = process.env.KEEPER_PRIVATE_KEY!;
const NETWORK =
  process.env.STACKS_NETWORK === "mainnet" ? STACKS_MAINNET : STACKS_TESTNET;

const requestCache = new Map<string, any>();

export function clearCycleCache() {
  requestCache.clear();
}

function fingerprint(
  endpoint: string,
  body: any,
  blockHeight: number
): string {
  const data = endpoint + JSON.stringify(body) + blockHeight;
  return createHash("sha256").update(data).digest("hex");
}

async function waitForConfirmation(txId: string, maxWaitMs = 120_000): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    try {
      const res = await axios.get(`${STACKS_API}/extended/v1/tx/${txId}`);
      if (res.data.tx_status === "success") return true;
      if (res.data.tx_status === "abort_by_response" || res.data.tx_status === "abort_by_post_condition") {
        return false;
      }
    } catch {
      // tx not yet indexed
    }
    await new Promise((r) => setTimeout(r, 5000));
  }
  return false;
}

export async function callMolbot(
  endpoint: string,
  requestBody: any,
  blockHeight: number
): Promise<any> {
  const fp = fingerprint(endpoint, requestBody, blockHeight);

  if (requestCache.has(fp)) {
    console.log(`[x402-client] Cache hit for ${endpoint}`);
    return requestCache.get(fp);
  }

  let res;
  try {
    res = await axios.get(endpoint, {
      params: requestBody,
      validateStatus: (s) => s === 200 || s === 402,
    });
  } catch (e: any) {
    throw new Error(`[x402-client] Request to ${endpoint} failed: ${e.message}`);
  }

  if (res.status === 200) {
    requestCache.set(fp, res.data);
    return res.data;
  }

  if (res.status !== 402) {
    throw new Error(`[x402-client] Unexpected status ${res.status} from ${endpoint}`);
  }

  const paymentHeader = res.headers["x-payment-required"];
  if (!paymentHeader) {
    throw new Error("[x402-client] 402 response missing X-Payment-Required header");
  }

  let paymentDetails: { amount: number; currency: string; recipient: string };
  try {
    paymentDetails =
      typeof paymentHeader === "string"
        ? JSON.parse(paymentHeader)
        : paymentHeader;
  } catch {
    throw new Error(`[x402-client] Invalid X-Payment-Required header: ${paymentHeader}`);
  }

  console.log(
    `[x402-client] Payment required: ${paymentDetails.amount} ${paymentDetails.currency} to ${paymentDetails.recipient}`
  );

  const DEPLOYER = process.env.DEPLOYER_ADDRESS!;
  let txId: string;
  try {
    const tx = await makeContractCall({
      contractAddress: DEPLOYER,
      contractName: "mock-sbtc",
      functionName: "transfer",
      functionArgs: [
        uintCV(paymentDetails.amount),
        principalCV(process.env.KEEPER_STX_ADDRESS!),
        principalCV(paymentDetails.recipient),
        { type: 9 } as any, // none for memo
      ],
      senderKey: KEEPER_KEY,
      network: NETWORK,
      postConditionMode: PostConditionMode.Allow,
      fee: 1000,
    });

    const broadcast = await broadcastTransaction({ transaction: tx, network: NETWORK });
    if ("error" in broadcast) {
      throw new Error(`Broadcast failed: ${broadcast.error}`);
    }
    txId = broadcast.txid;
    console.log(`[x402-client] Payment broadcast: ${txId}`);
  } catch (e: any) {
    throw new Error(`[x402-client] Payment failed: ${e.message}`);
  }

  const confirmed = await waitForConfirmation(txId);
  if (!confirmed) {
    throw new Error(`[x402-client] Payment ${txId} not confirmed`);
  }

  try {
    const retryRes = await axios.get(endpoint, {
      params: requestBody,
      headers: { "X-Payment-Proof": txId },
      validateStatus: (s) => s === 200 || s === 402 || s === 409,
    });

    if (retryRes.status === 200) {
      requestCache.set(fp, retryRes.data);
      return retryRes.data;
    }

    throw new Error(
      `[x402-client] Retry after payment returned status ${retryRes.status}`
    );
  } catch (e: any) {
    throw new Error(`[x402-client] Retry request failed: ${e.message}`);
  }
}
