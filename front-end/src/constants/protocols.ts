export const STRATEGIES = [
  {
    id: 0,
    name: "Conservative",
    emoji: "🟢",
    protocols: ["Zest Protocol"],
    risk: "Low",
    expectedAPY: "1–3%",
    description: "Supply sBTC to Zest for stable Bitcoin-native yield. Lowest risk, lowest reward.",
    color: "#22c55e",
  },
  {
    id: 1,
    name: "Balanced",
    emoji: "🟡",
    protocols: ["Bitflow", "Zest Protocol"],
    risk: "Medium",
    expectedAPY: "8–20%",
    description: "Split between Bitflow LP and Zest supply. Balanced risk-reward profile.",
    color: "#eab308",
  },
  {
    id: 2,
    name: "Aggressive",
    emoji: "🔴",
    protocols: ["ALEX", "Bitflow"],
    risk: "High",
    expectedAPY: "30–100%",
    description: "ALEX yield farming + Bitflow LP. Maximum yield, impermanent loss risk.",
    color: "#ef4444",
  },
] as const;

export type StrategyId = 0 | 1 | 2;
