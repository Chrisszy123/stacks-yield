import dotenv from "dotenv";
dotenv.config();

import {
  makeContractCall,
  broadcastTransaction,
  uintCV,
  principalCV,
  listCV,
  bufferCV,
  PostConditionMode,
} from "@stacks/transactions";
import { STACKS_TESTNET, STACKS_MAINNET } from "@stacks/network";

import { observe } from "./observation-engine.js";
import { askClaude } from "./claude-client.js";
import { validate } from "./decision-validator.js";
import { checkPermissions } from "./permission-checker.js";
import {
  storePending,
  confirm,
  fail,
  recoverOnStartup,
  getExpiredTxIds,
} from "./explanation-store.js";
import { clearCycleCache } from "./molbot/x402-client.js";
import { startX402Server } from "./molbot/x402-server.js";
import { getRiskScore } from "./molbot/specialist-clients/risk-auditor.js";
import { getMarketSentiment } from "./molbot/specialist-clients/market-analyst.js";

const DEPLOYER = process.env.DEPLOYER_ADDRESS!;
const KEEPER_KEY = process.env.KEEPER_PRIVATE_KEY!;
const KEEPER_ADDRESS = process.env.KEEPER_STX_ADDRESS!;
const INTERVAL = Math.max(
  parseInt(process.env.AGENT_LOOP_INTERVAL_MS || "600000"),
  60000
);
const NETWORK =
  process.env.STACKS_NETWORK === "mainnet" ? STACKS_MAINNET : STACKS_TESTNET;

async function pruneExpiredTxIds(blockHeight: number) {
  const expiredTxIds = getExpiredTxIds(blockHeight);
  if (expiredTxIds.length === 0) return;

  try {
    const buffers = expiredTxIds.slice(0, 50).map((txId) => {
      const clean = txId.startsWith("0x") ? txId.slice(2) : txId;
      return bufferCV(Buffer.from(clean.padEnd(64, "0").slice(0, 64), "hex"));
    });

    const tx = await makeContractCall({
      contractAddress: DEPLOYER,
      contractName: "x402-verifier",
      functionName: "prune-expired",
      functionArgs: [listCV(buffers)],
      senderKey: KEEPER_KEY,
      network: NETWORK,
      postConditionMode: PostConditionMode.Allow,
      fee: 1000,
    });

    const result = await broadcastTransaction({ transaction: tx, network: NETWORK });
    if ("error" in result) {
      console.warn(`[agent-loop] Prune broadcast error: ${result.error}`);
    } else {
      console.log(`[agent-loop] Pruned ${buffers.length} expired txIds: ${result.txid}`);
    }
  } catch (e: any) {
    console.warn(`[agent-loop] Prune failed: ${e.message}`);
  }
}

async function executeAction(
  action: string,
  userAddress: string,
  targetStrategy: number | undefined,
  fee: number
): Promise<string> {
  let functionName: string;
  let functionArgs: any[];

  switch (action) {
    case "rebalance":
      functionName = "keeper-rebalance";
      functionArgs = [
        principalCV(userAddress),
        uintCV(targetStrategy ?? 0),
        uintCV(fee),
      ];
      break;
    case "compound":
      functionName = "keeper-compound";
      functionArgs = [principalCV(userAddress), uintCV(fee)];
      break;
    case "defensive":
      functionName = "keeper-rebalance";
      functionArgs = [principalCV(userAddress), uintCV(0), uintCV(fee)];
      break;
    default:
      throw new Error(`Unsupported on-chain action: ${action}`);
  }

  const tx = await makeContractCall({
    contractAddress: DEPLOYER,
    contractName: "sbtc-yield-aggregator",
    functionName,
    functionArgs,
    senderKey: KEEPER_KEY,
    network: NETWORK,
    postConditionMode: PostConditionMode.Allow,
    fee: 1000,
  });

  const result = await broadcastTransaction({ transaction: tx, network: NETWORK });
  if ("error" in result) {
    throw new Error(`Broadcast failed: ${result.error}`);
  }
  return result.txid;
}

async function runCycle() {
  const cycleStart = Date.now();
  console.log(`\n${"=".repeat(60)}`);
  console.log(`[agent-loop] Cycle start: ${new Date().toISOString()}`);

  // Step 1: Clear cycle-scoped cache
  clearCycleCache();

  // Step 2: Observe
  const context = await observe();
  console.log(
    `[agent-loop] Block ${context.blockHeight} | TVL: ${context.tvl} | Users: ${context.userPositions.length}`
  );

  if (context.blockHeight === 0) {
    console.warn("[agent-loop] Could not get block height, skipping cycle");
    return;
  }

  // Step 3: Prune expired txIds
  await pruneExpiredTxIds(context.blockHeight);

  let actionsExecuted = 0;
  let totalFees = 0;

  // Step 4: Process each user
  for (const user of context.userPositions) {
    try {
      // 4a: Check permissions
      const { allowed, permissions } = await checkPermissions(user.address, {
        strategy: user.strategy,
        fee: 0,
      });
      if (!allowed || !permissions) {
        console.log(`[agent-loop] Skipping ${user.address}: permissions check failed`);
        continue;
      }

      // 4b: Enrich with molbot data if triggers warrant it
      let riskScore: any = null;
      let marketSentiment: any = null;
      const molbotCalls: { service: string; cost: number; response: any }[] = [];

      if (context.triggers.apyShift || context.triggers.tvlDrop) {
        try {
          riskScore = await getRiskScore("stacks-defi", DEPLOYER, context.blockHeight);
          molbotCalls.push({
            service: "risk-auditor",
            cost: riskScore.source === "default" ? 0 : 100,
            response: riskScore,
          });
        } catch (e: any) {
          console.warn(`[agent-loop] Risk score fetch failed: ${e.message}`);
        }

        try {
          marketSentiment = await getMarketSentiment(
            context.btcPriceUsd,
            context.blockHeight
          );
          molbotCalls.push({
            service: "market-analyst",
            cost: marketSentiment.source === "default" ? 0 : 100,
            response: marketSentiment,
          });
        } catch (e: any) {
          console.warn(`[agent-loop] Market sentiment fetch failed: ${e.message}`);
        }
      }

      // 4c: Ask Claude
      const decision = await askClaude(context, permissions, {
        riskScore,
        marketSentiment,
      });
      console.log(
        `[agent-loop] Claude decision for ${user.address}: ${decision.action} (confidence: ${decision.confidence})`
      );

      // 4d: Validate
      const validated = validate(decision, permissions, context.triggers);
      if (!validated) {
        console.log(`[agent-loop] Decision rejected by validator for ${user.address}`);
        continue;
      }

      // 4e: Write pending record
      const recordId = storePending(validated, context, user.address, molbotCalls);

      // 4f: Execute if not hold
      if (validated.action !== "hold" && validated.action !== "alert") {
        try {
          const txId = await executeAction(
            validated.action,
            user.address,
            validated.targetStrategy,
            0
          );
          confirm(recordId, txId);
          actionsExecuted++;
          console.log(
            `[agent-loop] Action ${validated.action} executed for ${user.address}: ${txId}`
          );
        } catch (e: any) {
          fail(recordId, e.message);
          console.error(
            `[agent-loop] Action failed for ${user.address}: ${e.message}`
          );
        }
      } else {
        confirm(recordId, "hold");
      }
    } catch (e: any) {
      console.error(`[agent-loop] Error processing user ${user.address}: ${e.message}`);
    }
  }

  const elapsed = Date.now() - cycleStart;
  console.log(
    `[agent-loop] Cycle complete: ${actionsExecuted} actions, ${totalFees} sats fees, ${elapsed}ms`
  );
}

async function main() {
  console.log("=== StackYield Autonomous Agent ===");
  console.log(`Keeper: ${KEEPER_ADDRESS}`);
  console.log(`Network: ${process.env.STACKS_NETWORK}`);
  console.log(`Deployer: ${DEPLOYER}`);
  console.log(`Interval: ${INTERVAL}ms`);

  // Start the x402 molbot server
  startX402Server();

  // Recover any abandoned records from previous crashes
  const recovered = recoverOnStartup();
  if (recovered > 0) {
    console.log(`[agent-loop] Recovered ${recovered} abandoned records from previous run`);
  }

  // Run first cycle immediately
  await runCycle();

  // Schedule recurring cycles
  setInterval(async () => {
    try {
      await runCycle();
    } catch (e: any) {
      console.error(`[agent-loop] Unhandled cycle error: ${e.message}`);
    }
  }, INTERVAL);
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
