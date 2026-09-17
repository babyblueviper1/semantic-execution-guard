# Onchain tests

`SemanticExecutionGuard.t.sol` -- 14 tests, all passing (`forge test`). Covers the
V1/V2 on-chain analogs of `relations/robinhood-stock-token-v0/vectors.json`'s own
named cases, staleness/incomplete-round/unregistered-asset/feed-immutability
vectors that only exist on-chain, and four `HARDENED_*` regression tests for an
independent audit's findings (zero/non-contract feed address, zero/future
`updatedAt`). See the test file's own header comment and `contracts/README.md` for
the full design rationale.

Relation-layer (off-chain, JS) tests are unrelated to this directory and live under
`relations/robinhood-stock-token-v0/test/`.
