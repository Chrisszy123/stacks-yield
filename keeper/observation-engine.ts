import axios from "axios";
import {
  callReadOnlyFunction,
  cvToJSON,
  ClarityValue,
  principalCV,
  uintCV,
} from "@stacks/transactions";
import dotenv from "dotenv";

dotenv.config();

const STACKS_API = process.env.STACKS_API_URL || "https://api.testnet.hiro.so";
const DEPLOYER = process.env.DEPLOYER_ADDRESS!;
const NETWORK = process.env.STACKS_NETWORK || "testnet";
const AGGREGATOR_CONTRACT =
  NETWORK === "testnet" ? "sbtc-yield-aggregator-v2" : "sbtc-yield-aggregator";

export interface ProtocolAPYs {
  zest: number;
  bitflow: number;
  alex: number;
}

export interface UserPosition {
  address: string;
  ysbtcShares: number;
  strategy: number;
  depositBlock: number;
  sbtcDeposited: number;
}

export interface Triggers {
  apyShift: boolean;
  tvlDrop: boolean;
  compoundDue: boolean;
  btcVolatility: boolean;
}

export interface ObservationContext {
  blockHeight: number;
  apys: ProtocolAPYs;
  previousApys: ProtocolAPYs | null;
  tvl: number;
  userPositions: UserPosition[];
  btcPriceUsd: number;
  recentWithdrawals: number[];
  triggers: Triggers;
  timestamp: string;
}

let previousApys: ProtocolAPYs | null = null;
let previousTvl: number | null = null;
let previousBtcPrice: number | null = null;
let previousBtcPriceTime: number | null = null;

async function callReadOnly(
  contractName: string,
  functionName: string,
  args: ClarityValue[] = []
): Promise<any> {
  const url = `${STACKS_API}/v2/contracts/call-read/${DEPLOYER}/${contractName}/${functionName}`;
  const res = await axios.post(url, {
    sender: DEPLOYER,
    arguments: args.map((a) => Buffer.from(a.serialize()).toString("hex")),
  });
  if (!res.data.okay) throw new Error(`call-read ${contractName}::${functionName} failed`);
  return res.data;
}

async function getBlockHeight(): Promise<number> {
  try {
    const res = await axios.get(`${STACKS_API}/v2/info`);
    return res.data.stacks_tip_height;
  } catch (e) {
    console.error("[observation] Failed to get block height:", e);
    return 0;
  }
}

async function getProtocolAPYs(): Promise<ProtocolAPYs> {
  const strategies = ["strategy-zest", "strategy-bitflow", "strategy-alex"];
  const results: number[] = [];

  for (const strat of strategies) {
    try {
      const data = await callReadOnly(strat, "get-apy");
      const parsed = cvToJSON(data.result);
      results.push(Number(parsed.value?.value ?? parsed.value ?? 0));
    } catch {
      results.push(0);
    }
  }

  return { zest: results[0], bitflow: results[1], alex: results[2] };
}

async function getVaultTvl(): Promise<number> {
  try {
    const data = await callReadOnly(AGGREGATOR_CONTRACT, "get-vault-stats");
    const parsed = cvToJSON(data.result);
    const v = parsed.value?.value ?? parsed.value;
    return Number(v["total-sbtc"]?.value ?? 0);
  } catch {
    return 0;
  }
}

async function getUserPositions(): Promise<UserPosition[]> {
  // In production, index on-chain events to find all depositors.
  // For hackathon, scan known test addresses from recent tx history.
  const positions: UserPosition[] = [];

  try {
    const res = await axios.get(
      `${STACKS_API}/extended/v1/contract/${DEPLOYER}.${AGGREGATOR_CONTRACT}/events?limit=50`
    );

    const depositors = new Set<string>();
    for (const event of res.data.results || []) {
      if (event.contract_log?.value?.repr?.includes("deposit")) {
        const match = event.contract_log.value.repr.match(/user\s+(S[A-Z0-9]+)/);
        if (match) depositors.add(match[1]);
      }
    }

    for (const addr of depositors) {
      try {
        const data = await callReadOnly(AGGREGATOR_CONTRACT, "get-user-position", [
          principalCV(addr),
        ]);
        const parsed = cvToJSON(data.result);
        if (parsed.value) {
          const v = parsed.value?.value ?? parsed.value;
          const permsData = await callReadOnly("agent-permissions", "get-permissions", [
            principalCV(addr),
          ]);
          const perms = cvToJSON(permsData.result);
          const agentEnabled = perms.value?.value?.["agent-enabled"]?.value === true;

          if (agentEnabled) {
            positions.push({
              address: addr,
              ysbtcShares: Number(v["ysbtc-shares"]?.value ?? 0),
              strategy: Number(v["strategy"]?.value ?? 0),
              depositBlock: Number(v["deposit-block"]?.value ?? 0),
              sbtcDeposited: Number(v["sbtc-deposited"]?.value ?? 0),
            });
          }
        }
      } catch {
        // skip individual user failures
      }
    }
  } catch (e) {
    console.error("[observation] Failed to get user positions:", e);
  }

  return positions;
}

async function getBtcPrice(): Promise<number> {
  try {
    const res = await axios.get(
      "https://api.coinbase.com/v2/prices/BTC-USD/spot"
    );
    return parseFloat(res.data.data.amount);
  } catch {
    try {
      const res = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
      );
      return res.data.bitcoin.usd;
    } catch {
      console.error("[observation] Failed to get BTC price from all sources");
      return 0;
    }
  }
}

async function getRecentWithdrawals(blockHeight: number): Promise<number[]> {
  const withdrawals: number[] = [];
  try {
    const res = await axios.get(
      `${STACKS_API}/extended/v1/contract/${DEPLOYER}.${AGGREGATOR_CONTRACT}/events?limit=50`
    );
    for (const event of res.data.results || []) {
      if (event.contract_log?.value?.repr?.includes("withdraw")) {
        const match = event.contract_log.value.repr.match(/sbtc-returned\s+u(\d+)/);
        if (match) {
          const eventBlock = event.block_height || 0;
          if (blockHeight - eventBlock <= 10) {
            withdrawals.push(Number(match[1]));
          }
        }
      }
    }
  } catch {
    console.error("[observation] Failed to get recent withdrawals");
  }
  return withdrawals;
}

function computeTriggers(
  apys: ProtocolAPYs,
  prevApys: ProtocolAPYs | null,
  tvl: number,
  prevTvl: number | null,
  btcPrice: number,
  userPositions: UserPosition[]
): Triggers {
  let apyShift = false;
  if (prevApys) {
    const delta = Math.max(
      Math.abs(apys.zest - prevApys.zest),
      Math.abs(apys.bitflow - prevApys.bitflow),
      Math.abs(apys.alex - prevApys.alex)
    );
    apyShift = delta > 300;
  }

  const tvlDrop = prevTvl !== null && prevTvl > 0 && (prevTvl - tvl) / prevTvl > 0.2;

  const compoundDue = userPositions.some((u) => u.sbtcDeposited > 100000); // 0.001 sBTC = 100000 sats

  let btcVolatility = false;
  if (previousBtcPrice !== null && previousBtcPriceTime !== null) {
    const hoursSince = (Date.now() - previousBtcPriceTime) / (1000 * 60 * 60);
    if (hoursSince <= 4) {
      const pctChange = Math.abs(btcPrice - previousBtcPrice) / previousBtcPrice;
      btcVolatility = pctChange > 0.08;
    }
  }

  return { apyShift, tvlDrop, compoundDue, btcVolatility };
}

export async function observe(): Promise<ObservationContext> {
  const [blockHeight, apys, tvl, btcPrice] = await Promise.allSettled([
    getBlockHeight(),
    getProtocolAPYs(),
    getVaultTvl(),
    getBtcPrice(),
  ]);

  const bh = blockHeight.status === "fulfilled" ? blockHeight.value : 0;
  const currentApys =
    apys.status === "fulfilled" ? apys.value : { zest: 0, bitflow: 0, alex: 0 };
  const currentTvl = tvl.status === "fulfilled" ? tvl.value : 0;
  const currentBtcPrice = btcPrice.status === "fulfilled" ? btcPrice.value : 0;

  const userPositions = await getUserPositions();
  const recentWithdrawals = await getRecentWithdrawals(bh);

  const triggers = computeTriggers(
    currentApys,
    previousApys,
    currentTvl,
    previousTvl,
    currentBtcPrice,
    userPositions
  );

  const context: ObservationContext = {
    blockHeight: bh,
    apys: currentApys,
    previousApys,
    tvl: currentTvl,
    userPositions,
    btcPriceUsd: currentBtcPrice,
    recentWithdrawals,
    triggers,
    timestamp: new Date().toISOString(),
  };

  previousApys = currentApys;
  previousTvl = currentTvl;
  if (currentBtcPrice > 0) {
    previousBtcPrice = currentBtcPrice;
    previousBtcPriceTime = Date.now();
  }

  return context;
}
