import { NextRequest, NextResponse } from "next/server";
import { callReadOnly } from "@/lib/stacks-api";
import { cvToJSON, hexToCV, principalCV } from "@stacks/transactions";
import { DEPLOYER_ADDRESS } from "@/constants/contracts";

function cvToHex(cv: { type: number }): string {
  const serialized = (cv as any).serialize
    ? (cv as any).serialize()
    : require("@stacks/transactions").serializeCV(cv);
  return Buffer.from(serialized).toString("hex");
}

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");
  if (!address) {
    return NextResponse.json({ error: "address required" }, { status: 400 });
  }

  try {
    const senderArg = cvToHex(principalCV(address));

    const permsData = await callReadOnly(
      DEPLOYER_ADDRESS,
      "agent-permissions",
      "get-permissions",
      DEPLOYER_ADDRESS,
      [senderArg]
    );

    let config = null;
    let enabled = false;

    if (permsData?.okay && permsData?.result) {
      const parsed = cvToJSON(hexToCV(permsData.result));
      if (parsed.value && parsed.value.type !== "none") {
        const v = parsed.value?.value ?? parsed.value;
        config = {
          agentEnabled: v["agent-enabled"]?.value === true,
          maxStrategyTier: Number(v["max-strategy-tier"]?.value ?? 0),
          minRebalanceInterval: Number(v["min-rebalance-interval"]?.value ?? 0),
          maxFeePerRebalance: Number(v["max-fee-per-rebalance"]?.value ?? 0),
          lastRebalanceBlock: Number(v["last-rebalance-block"]?.value ?? 0),
          keeperAddress: v["keeper-address"]?.value ?? "",
        };
        enabled = config.agentEnabled;
      }
    }

    // Activity is stored in the keeper's explanation-store.
    // For the frontend, serve static demo data when not connected to the keeper.
    const activity = enabled
      ? [
          {
            id: "demo-1",
            status: "confirmed",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            userAddress: address,
            decision: {
              action: "hold",
              confidence: 0.85,
              reason: "Current strategy is performing well, no changes needed.",
            },
            blockHeight: 0,
            txId: "hold",
          },
        ]
      : [];

    return NextResponse.json({ enabled, config, activity });
  } catch (e: any) {
    console.error("[api/agent/status]", e);
    return NextResponse.json(
      { enabled: false, config: null, activity: [] },
      { status: 200 }
    );
  }
}
