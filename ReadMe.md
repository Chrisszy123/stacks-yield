# StackYield

**sBTC Yield Aggregator — Built on Stacks, Secured by Bitcoin**

StackYield is a non-custodial yield aggregator that routes sBTC across Stacks DeFi protocols to maximize Bitcoin-native yield. Users deposit sBTC, choose a risk strategy, and receive `ysBTC` receipt tokens representing their vault share. Yield accrues automatically. Withdraw anytime by burning `ysBTC`.

---

## Project Structure

```
stackyield/
├── my-smart-contracts/     # Clarity smart contracts (Clarinet)
└── front-end/              # Next.js application
```

---

## Smart Contracts (`my-smart-contracts/`)

Written in Clarity 2, deployed to **Stacks Testnet**.

### Contracts

| Contract | Description |
|---|---|
| `mock-sbtc` | SIP-010 mock sBTC token with a public faucet for testnet testing |
| `ysbtc-token` | SIP-010 receipt token minted on deposit, burned on withdrawal |
| `strategy-zest` | Conservative adapter — simulates Zest Protocol (~2% APY) |
| `strategy-bitflow` | Balanced adapter — simulates Bitflow LP (~12% APY) |
| `strategy-alex` | Aggressive adapter — simulates ALEX farming (~47% APY) |
| `sbtc-yield-aggregator` | Main vault — handles deposits, share math, withdrawals, fees |

### How the vault works

- **Deposit** — user sends sBTC, vault mints `ysBTC` shares using the ratio `shares = (deposit / total_assets) * total_supply`. First deposit is always 1:1.
- **Withdraw** — user burns `ysBTC`, vault returns `sBTC` proportional to their share, minus a 0.5% protocol fee.
- **Strategies** — `0` = Conservative, `1` = Balanced, `2` = Aggressive. Each routes to a different protocol adapter.

### Prerequisites

- [Clarinet](https://docs.hiro.so/clarinet) — for local development and testing
- [Docker Desktop](https://www.docker.com/products/docker-desktop) — required for devnet (optional, we use testnet)

### Setup

```bash
cd my-smart-contracts
clarinet check        # Validate all contracts
clarinet test         # Run the full test suite
```

### Deploy to Testnet

```bash
clarinet deployments apply --devnet   # local only
clarinet deployments apply --testnet  # deployed — this is what we use
```

> **Note:** Devnet requires Docker. This project is deployed to **Stacks Testnet** instead. All contract addresses below reference testnet deployments.

### Deployed Contract Addresses (Testnet)

Update these in `front-end/.env.local` after deployment:

```
NEXT_PUBLIC_DEPLOYER_ADDRESS=<your-testnet-deployer-address>
```

### Running Tests

```bash
cd my-smart-contracts
clarinet test
```

The test suite covers:
- First deposit mints shares 1:1
- Subsequent deposits mint proportional shares
- Withdrawal returns sBTC minus 0.5% fee
- Zero amount deposits are rejected
- Invalid strategy IDs are rejected
- Withdrawing with no position is rejected
- Vault pause guard blocks deposits and withdrawals

---

## Frontend (`front-end/`)

Built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**. Wallet integration via `@stacks/connect`.

### Tech Stack

| Library | Purpose |
|---|---|
| `next` | App framework, App Router |
| `@stacks/connect` | Wallet connection and transaction signing |
| `@stacks/transactions` | Clarity value encoding (`Cl`), read-only calls |
| `@stacks/network` | Network config (testnet/mainnet/devnet) |
| `@tanstack/react-query` | All on-chain data fetching and caching |
| `framer-motion` | Page transitions, component animations |
| `lucide-react` | Icons |
| `tailwindcss` | Styling |

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)

### Setup

```bash
cd front-end
pnpm install
cp .env.example .env.local
```

### Environment Variables

Edit `front-end/.env.local`:

```bash
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_STACKS_API_URL=https://api.testnet.hiro.so
NEXT_PUBLIC_DEPLOYER_ADDRESS=<your-testnet-deployer-address>
```

| Variable | Values | Description |
|---|---|---|
| `NEXT_PUBLIC_NETWORK` | `testnet` / `mainnet` / `devnet` | Active network |
| `NEXT_PUBLIC_STACKS_API_URL` | See below | Stacks API endpoint |
| `NEXT_PUBLIC_DEPLOYER_ADDRESS` | Your STX address | Address that deployed the contracts |

**API URLs:**
- Testnet: `https://api.testnet.hiro.so`
- Mainnet: `https://api.hiro.so`
- Devnet: `http://localhost:3999`

### Run the app

```bash
cd front-end
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Wallet Integration

Powered by `@stacks/connect`. Supports **Leather** and **Xverse** wallets.

**To test on testnet:**
1. Install [Leather Wallet](https://leather.io) browser extension
2. Switch Leather to Testnet mode in settings
3. Get testnet STX from the [Stacks Testnet Faucet](https://explorer.hiro.so/sandbox/faucet?chain=testnet)
4. Get mock sBTC by calling the `faucet` function on the `mock-sbtc` contract

---

## How to Use

### Deposit
1. Connect your Leather or Xverse wallet
2. Go to the **Deposit** tab
3. Enter an sBTC amount and choose a strategy
4. Confirm the transaction in your wallet
5. You receive `ysBTC` tokens representing your vault share

### Withdraw
1. Go to the **Withdraw** tab
2. Enter the amount of `ysBTC` to burn
3. Confirm the transaction in your wallet
4. You receive sBTC back at the current share price, minus the 0.5% fee

### View your position
The **Dashboard** shows your deposited amount, ysBTC shares, current APY, and accrued yield in real time.

---

## Strategies

| Strategy | Protocols | Expected APY | Risk |
|---|---|---|---|
| 🌱 Conservative | Zest Protocol | ~2% | Low |
| ⚖️ Balanced | Bitflow + Zest | ~12% | Medium |
| 🔥 Aggressive | ALEX + Bitflow | ~47% | High |

> APYs are simulated on testnet. Protocol adapters are scaffolded for mainnet integration — replace the `deposit-to-protocol` and `withdraw-from-protocol` function bodies with real protocol contract calls.

---

## Network Note

This project targets **Stacks Testnet**. Devnet (local Docker blockchain) is not required to run or test the app. All contract interactions go through the Hiro testnet API.

To switch to mainnet, update `NEXT_PUBLIC_NETWORK=mainnet` and `NEXT_PUBLIC_STACKS_API_URL=https://api.hiro.so` in your `.env.local`, and redeploy contracts with `clarinet deployments apply --mainnet`.

---

## Links

- [Stacks Documentation](https://docs.stacks.co)
- [Stacks.js Reference](https://docs.stacks.co/stacks.js/overview)
- [Clarity Language Reference](https://docs.stacks.co/clarity)
- [Hiro Explorer (Testnet)](https://explorer.hiro.so/?chain=testnet)
- [Hiro Testnet Faucet](https://explorer.hiro.so/sandbox/faucet?chain=testnet)
- [BuidlBattle #2](https://dorahacks.io/hackathon/buidlbattle2/detail)

---

## License

MIT