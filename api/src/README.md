# DiasporaCircle API

A thin NestJS REST layer over the DiasporaCircle Soroban contract, so
front-ends (like `web/` or a future mobile app) don't need to embed
Stellar SDK contract-calling logic directly.

## ⚠️ Before you use this for anything real

This is a **testnet demo scaffold**, not production auth architecture.
`contribute` currently signs with a single service keypair — meaning as
written, it can't actually represent an individual member's own
contribution with their own authorization. Real member actions need to
be signed client-side by the member's own wallet (Freighter, xBull, etc.)
and submitted here already-signed. This is tracked in the repo's
`ISSUES.md` — please pick it up if you want a meaningful, high-impact
contribution.

## Setup

```bash
cd api
npm install
cp .env.example .env
# fill in CONTRACT_ID (from deploying the contract) and SERVICE_ACCOUNT_SECRET
# (generate a fresh testnet keypair — never reuse a mainnet key here)
npm run start:dev
```

## Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/circles` | Create a new circle. Body: `{ tokenContractId, contributionAmount, memberAddresses }` |
| `GET` | `/circles/:id` | Fetch current circle state |
| `POST` | `/circles/:id/contribute` | Contribute for the current round. Body: `{ memberAddress }` |
| `POST` | `/circles/:id/close-round` | Close the round and trigger payout if everyone has paid in |

## Generating a testnet service account

```bash
node -e "console.log(require('@stellar/stellar-sdk').Keypair.random().secret())"
```

Then fund it via [Friendbot](https://friendbot.stellar.org) before use.
