import { callMolbot } from "../x402-client.js";
import { getBestService } from "../molbot-registry.js";

export interface MarketSentiment {
  trend: "bullish" | "bearish" | "neutral";
  confidence: number; // 0-1
  recommendation: string;
  source: string;
}

export async function getMarketSentiment(
  btcPrice: number,
  blockHeight: number
): Promise<MarketSentiment> {
  const service = await getBestService("market-analysis");

  if (!service) {
    console.warn("[market-analyst] No market-analysis molbot available, using default");
    return {
      trend: "neutral",
      confidence: 0.5,
      recommendation: "No market analysis service available — defaulting to neutral outlook",
      source: "default",
    };
  }

  try {
    const response = await callMolbot(
      service.endpoint,
      { btcPrice, timestamp: new Date().toISOString() },
      blockHeight
    );

    return {
      trend: response.trend || "neutral",
      confidence: Number(response.confidence ?? 0.5),
      recommendation: response.recommendation || "Analysis received",
      source: service.name,
    };
  } catch (e: any) {
    console.error(
      `[market-analyst] Failed to get sentiment from ${service.name}:`,
      e.message
    );
    return {
      trend: "neutral",
      confidence: 0.5,
      recommendation: `Market analysis failed: ${e.message}`,
      source: "fallback",
    };
  }
}
