import { NextRequest, NextResponse } from "next/server";
import { DEPLOYER_ADDRESS } from "@/constants/contracts";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      maxStrategyTier,
      minRebalanceInterval,
      maxFeePerRebalance,
      keeperAddress,
    } = body;

    // Return unsigned transaction parameters for the frontend to sign
    // The frontend will call request('stx_callContract', ...) with these params
    const txParams = {
      contractAddress: DEPLOYER_ADDRESS,
      contractName: "agent-permissions",
      functionName: "set-permissions",
      functionArgs: {
        agentEnabled: true,
        maxStrategyTier: maxStrategyTier ?? 1,
        minRebalanceInterval: minRebalanceInterval ?? 6,
        maxFeePerRebalance: maxFeePerRebalance ?? 10000,
        keeperAddress: keeperAddress || DEPLOYER_ADDRESS,
      },
    };

    return NextResponse.json({ txParams });
  } catch (e: any) {
    console.error("[api/agent/enable]", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
