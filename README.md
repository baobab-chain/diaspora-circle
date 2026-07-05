# DiasporaCircle

**An open Soroban protocol for cross-border Ajo/Esusu (rotating savings and credit) circles.**

Part of [Baobab Chain Labs](https://github.com/baobab-chain) — built on [Stellar](https://stellar.org).

---

## The problem

Ajo/Esusu — rotating savings groups where members contribute a fixed amount
on a schedule and take turns receiving the pooled payout — are one of the
oldest and most widely used informal financial tools in Nigeria and across
West Africa. They run on trust, and that trust breaks in two common ways:

1. **The treasurer disappears** with the pooled funds.
2. **Diaspora members are structurally excluded.** A relative in London or
   Toronto who wants to contribute to a family circle back home has to
   wire money through slow, expensive remittance rails, often arriving
   after their turn in the rotation has already passed.

Several apps (closed, Naira-only) already solve problem #1 with escrow.
Almost none solve problem #2, because it requires cheap, fast, borderless
settlement — which is exactly what Stellar is for.

## What this is

DiasporaCircle is a **protocol**, not a closed app. Anyone can build a
front-end or bot on top of it. The core logic lives in a Soroban smart
contract that:

- Creates a savings circle with a fixed contribution amount, schedule, and member list
- Accepts contributions in XLM or USDC from any member, anywhere
- Holds funds in on-chain escrow until each round's payout condition is met
- Releases the payout automatically to that round's recipient — no treasurer required
- Tracks a portable on-chain reputation score per member (contribution history, missed payments) that can travel with them into future circles

## Why Stellar / Soroban

- **Settlement in seconds**, not the 3–5 days of a bank wire
- **Sub-cent transaction fees**, so contributing $20 from abroad doesn't lose 15% to fees like traditional remittance
- **USDC on Stellar** gives diaspora contributors a stable-value option without relying on Naira volatility
- **Soroban smart contracts** let escrow and payout logic be enforced by code, not by a treasurer's honesty

## Status

Early-stage / MVP skeleton. The contract in `contracts/diaspora-circle`
compiles and covers the core circle lifecycle, but it is **not audited and
not production-ready**. See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
for the current design and known gaps.

## Repo layout

- **`contracts/diaspora-circle/`** — the Soroban smart contract (Rust)
- **`api/`** — a NestJS REST layer over the contract, for front-ends that don't want to embed Stellar SDK contract calls directly
- **`web/`** — static landing page explaining the protocol

## Getting started

**Contract:**
```bash
# prerequisites: Rust, the soroban-cli
cd contracts/diaspora-circle
cargo build --target wasm32-unknown-unknown --release
cargo test
```

**API:**
```bash
cd api
npm install
cp .env.example .env   # fill in CONTRACT_ID and SERVICE_ACCOUNT_SECRET
npm run start:dev
```

**Landing page:**
```bash
cd web
python3 -m http.server 8080
```

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for how to run tests and submit changes.

## Roadmap

- [ ] Core contract: create/join/contribute/payout (in progress)
- [ ] Reputation scoring module
- [ ] Reference front-end (web + USSD/SMS fallback for low-connectivity users)
- [ ] Multi-currency support (XLM, USDC, and local stablecoins as they emerge)
- [ ] Security review before any mainnet use with real funds

## License

MIT — see [`LICENSE`](LICENSE).
