# Semantic Execution Guard

**The data can be valid while its meaning is wrong.**

New Colosseum Crypto World's Fair 2026 product repository, owned by
[Pavlo](https://github.com/pipavlo82). See [PROVENANCE.md](PROVENANCE.md) before
attributing any work to this hackathon. Event naming is user-provided; eligibility
is not independently established by this repository.

Implemented locally on Pavlo's feature branch: a hermetic Robinhood Stock Token
semantic relation, exact BigInt recomputation, 26 synthetic vectors, deterministic
receipts, seven killed source mutations, and guard/deployment handoff contracts.
There is no implemented Solidity guard, frontend, deployment or onchain execution.

```text
Robinhood evidence          [live adapter pending: Tiago / Merlini]
         |
Semantic ABI relation       [local synthetic relation implemented: Pavlo]
         |
onchain execution guard     [pending: Fede]
         |
REVERT or EXECUTE           [testnet demonstration pending]
```

The mandatory counterexample has multiplier = 1 and equal numeric values, but
directly promoting UNDERLYING_EQUITY_QUOTE to MULTIPLIER_ADJUSTED_TOKEN_PRICE fails.
The matching explicit-conversion control passes. The boundary is semantic typing,
not `rawPrice != adjustedPrice`.

Run from the repository root with Node >=22; no npm install, packages or lockfile:

```sh
node --test
node relations/robinhood-stock-token-v0/recompute.mjs
node relations/robinhood-stock-token-v0/mutations.mjs
node demo/relation-demo.mjs
forge fmt --check
forge build
forge test -vvv
```

Foundry currently has zero Solidity sources/tests; an empty run is not guard
verification. Fede owns that implementation. Testnet integration belongs to Tiago.

- [Relation contract and policy](relations/robinhood-stock-token-v0/README.md)
- [Receipts](artifacts/recomputation-receipts.json) / [mutation proof](artifacts/mutation-report.json)
- [Architecture and claim limits](docs/architecture.md)
- [Fede handoff](docs/fede-handoff.md) / [Tiago handoff](integrations/robinhood-chain/README.md)
- [Official sources](provenance/SOURCES.md) / [foundation pins](provenance/BASELINES.md)

Local test != testnet deployment; implemented != merged != deployed != used
successfully; public != independently verified. No production trading is performed.
