import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";
import { join } from "path";
import dotenv from "dotenv";
import type { ObservationContext } from "./observation-engine.js";

dotenv.config();

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const systemPromptPath = join(import.meta.dirname || __dirname, "prompts", "agent-system.txt");
let systemPrompt: string;

try {
  systemPrompt = readFileSync(systemPromptPath, "utf-8");
} catch {
  throw new Error(
    `System prompt not found at ${systemPromptPath}. Create keeper/prompts/agent-system.txt before starting.`
  );
}

export interface AgentDecision {
  action: "rebalance" | "compound" | "defensive" | "hold" | "alert";
  targetStrategy?: number;
  confidence: number;
  reason: string;
  urgency?: "low" | "medium" | "high" | "immediate";
  dataPoints?: string[];
}

export interface UserPermissions {
  agentEnabled: boolean;
  maxStrategyTier: number;
  minRebalanceInterval: number;
  maxFeePerRebalance: number;
  lastRebalanceBlock: number;
  keeperAddress: string;
}

export async function askClaude(
  context: ObservationContext,
  userPermissions: UserPermissions,
  enrichedData?: { riskScore?: any; marketSentiment?: any }
): Promise<AgentDecision> {
  const userMessage = JSON.stringify(
    {
      context: {
        blockHeight: context.blockHeight,
        apys: context.apys,
        previousApys: context.previousApys,
        tvl: context.tvl,
        btcPriceUsd: context.btcPriceUsd,
        triggers: context.triggers,
        recentWithdrawals: context.recentWithdrawals,
      },
      userPermissions,
      enrichedData: enrichedData || null,
    },
    null,
    2
  );

  const response = await client.messages.create({
    model: "claude-sonnet-4-5-20250514",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  try {
    const decision: AgentDecision = JSON.parse(text);
    return decision;
  } catch {
    throw new Error(
      `Claude returned invalid JSON. Raw response: ${text.slice(0, 500)}`
    );
  }
}
