import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
  const limit = 10;

  // In production, this would read from the keeper's explanation-store log file
  // or a shared database. For the hackathon, return demo activity data.
  const demoActivity = [
    {
      id: "demo-1",
      status: "confirmed",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      userAddress: address || "",
      decision: {
        action: "hold",
        confidence: 0.85,
        reason: "Current strategy is performing well, no changes needed.",
        dataPoints: [
          "Zest APY: 2.00%",
          "Bitflow APY: 12.00%",
          "Current strategy: balanced",
        ],
      },
      blockHeight: 150234,
      txId: "hold",
    },
    {
      id: "demo-2",
      status: "confirmed",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      userAddress: address || "",
      decision: {
        action: "rebalance",
        targetStrategy: 1,
        confidence: 0.78,
        reason:
          "Bitflow is offering significantly better returns right now with low risk.",
        dataPoints: [
          "Zest APY dropped from 5.00% to 2.00%",
          "Bitflow APY stable at 12.00%",
          "Risk score: 35 (low)",
        ],
      },
      blockHeight: 150220,
      txId: "0xdemo123",
    },
    {
      id: "demo-3",
      status: "confirmed",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      userAddress: address || "",
      decision: {
        action: "compound",
        confidence: 0.92,
        reason: "Compounding your earned yield back into the vault for better returns.",
        dataPoints: [
          "Accrued yield: 0.0015 sBTC",
          "Compound threshold met",
        ],
      },
      blockHeight: 150100,
      txId: "0xdemo456",
    },
  ];

  const start = (page - 1) * limit;
  const paginated = demoActivity.slice(start, start + limit);

  return NextResponse.json({
    activity: paginated,
    page,
    totalPages: Math.ceil(demoActivity.length / limit),
  });
}
