import { callMolbot } from "../x402-client.js";
import { getBestService } from "../molbot-registry.js";

export interface RiskScore {
  protocolName: string;
  score: number; // 0-100
  assessment: string;
  source: string;
}

export async function getRiskScore(
  protocolName: string,
  contractAddress: string,
  blockHeight: number
): Promise<RiskScore> {
  const service = await getBestService("risk-audit");

  if (!service) {
    console.warn("[risk-auditor] No risk-audit molbot available, using default score");
    return {
      protocolName,
      score: 50,
      assessment: "No risk audit service available — using default moderate risk score",
      source: "default",
    };
  }

  try {
    const response = await callMolbot(
      service.endpoint,
      { protocol: protocolName, contract: contractAddress },
      blockHeight
    );

    return {
      protocolName,
      score: Number(response.score ?? response.riskScore ?? 50),
      assessment: response.assessment || response.summary || "Assessment received",
      source: service.name,
    };
  } catch (e: any) {
    console.error(`[risk-auditor] Failed to get risk score from ${service.name}:`, e.message);
    return {
      protocolName,
      score: 50,
      assessment: `Risk audit failed: ${e.message}`,
      source: "fallback",
    };
  }
}
