import type { AgentDecision, UserPermissions } from "./claude-client.js";
import type { Triggers } from "./observation-engine.js";
import dotenv from "dotenv";

dotenv.config();

const MIN_CONFIDENCE =
  parseFloat(process.env.MIN_CONFIDENCE_THRESHOLD || "0.6");

const VALID_ACTIONS = new Set([
  "rebalance",
  "compound",
  "defensive",
  "hold",
  "alert",
]);

export function validate(
  decision: AgentDecision,
  userPermissions: UserPermissions,
  triggers: Triggers
): AgentDecision | null {
  if (!VALID_ACTIONS.has(decision.action)) {
    console.warn(
      `[validator] Rejected: invalid action "${decision.action}"`
    );
    return null;
  }

  if (
    decision.action === "rebalance" &&
    (decision.targetStrategy === undefined || decision.targetStrategy === null)
  ) {
    console.warn(
      "[validator] Rejected: rebalance action missing targetStrategy"
    );
    return null;
  }

  if (
    decision.action === "rebalance" &&
    decision.targetStrategy! > userPermissions.maxStrategyTier
  ) {
    console.warn(
      `[validator] Rejected: targetStrategy ${decision.targetStrategy} exceeds user max ${userPermissions.maxStrategyTier}`
    );
    return null;
  }

  if (
    typeof decision.confidence !== "number" ||
    decision.confidence < 0 ||
    decision.confidence > 1
  ) {
    console.warn(
      `[validator] Rejected: confidence ${decision.confidence} is not a valid number between 0 and 1`
    );
    return null;
  }

  if (
    decision.confidence < MIN_CONFIDENCE &&
    decision.urgency !== "immediate"
  ) {
    console.warn(
      `[validator] Rejected: confidence ${decision.confidence} below threshold ${MIN_CONFIDENCE} (urgency: ${decision.urgency})`
    );
    return null;
  }

  if (
    !decision.reason ||
    typeof decision.reason !== "string" ||
    decision.reason.length === 0 ||
    decision.reason.length > 300
  ) {
    console.warn(
      `[validator] Rejected: reason is empty or exceeds 300 characters`
    );
    return null;
  }

  if (
    !triggers.apyShift &&
    !triggers.tvlDrop &&
    !triggers.compoundDue &&
    (decision.action === "rebalance" || decision.action === "compound")
  ) {
    console.warn(
      `[validator] Rejected: ${decision.action} action with no active trigger`
    );
    return null;
  }

  return decision;
}
