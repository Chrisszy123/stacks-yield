import axios from "axios";
import { cvToJSON, principalCV } from "@stacks/transactions";
import type { UserPermissions } from "./claude-client.js";
import dotenv from "dotenv";

dotenv.config();

const STACKS_API = process.env.STACKS_API_URL || "https://api.testnet.hiro.so";
const DEPLOYER = process.env.DEPLOYER_ADDRESS!;
const KEEPER_ADDRESS = process.env.KEEPER_STX_ADDRESS!;

export async function checkPermissions(
  userAddress: string,
  proposedAction: { strategy: number; fee: number }
): Promise<{ allowed: boolean; permissions: UserPermissions | null }> {
  try {
    const url = `${STACKS_API}/v2/contracts/call-read/${DEPLOYER}/agent-permissions/get-permissions`;
    const res = await axios.post(url, {
      sender: DEPLOYER,
      arguments: [
        Buffer.from(principalCV(userAddress).serialize()).toString("hex"),
      ],
    });

    if (!res.data.okay) {
      console.warn(`[permissions] Failed to read permissions for ${userAddress}`);
      return { allowed: false, permissions: null };
    }

    const parsed = cvToJSON(res.data.result);
    if (!parsed.value || parsed.value.type === "none") {
      console.warn(`[permissions] No permissions set for ${userAddress}`);
      return { allowed: false, permissions: null };
    }

    const v = parsed.value?.value ?? parsed.value;

    const permissions: UserPermissions = {
      agentEnabled: v["agent-enabled"]?.value === true,
      maxStrategyTier: Number(v["max-strategy-tier"]?.value ?? 0),
      minRebalanceInterval: Number(v["min-rebalance-interval"]?.value ?? 0),
      maxFeePerRebalance: Number(v["max-fee-per-rebalance"]?.value ?? 0),
      lastRebalanceBlock: Number(v["last-rebalance-block"]?.value ?? 0),
      keeperAddress: v["keeper-address"]?.value ?? "",
    };

    if (!permissions.agentEnabled) {
      console.warn(`[permissions] Agent disabled for ${userAddress}`);
      return { allowed: false, permissions };
    }

    if (permissions.keeperAddress !== KEEPER_ADDRESS) {
      console.warn(
        `[permissions] Keeper mismatch for ${userAddress}: expected ${KEEPER_ADDRESS}, got ${permissions.keeperAddress}`
      );
      return { allowed: false, permissions };
    }

    return { allowed: true, permissions };
  } catch (e) {
    console.error(`[permissions] Error checking permissions for ${userAddress}:`, e);
    return { allowed: false, permissions: null };
  }
}
