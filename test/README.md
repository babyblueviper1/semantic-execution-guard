# Onchain tests

`SemanticExecutionGuard.t.sol` -- 10 tests, all passing (`forge test`). Covers the
V1/V2 on-chain analogs of `relations/robinhood-stock-token-v0/vectors.json`'s own
named cases, plus staleness/incomplete-round/unregistered-asset/feed-immutability
vectors that only exist on-chain. See the test file's own header comment and
`contracts/README.md` for the design rationale.

Relation-layer (off-chain, JS) tests are unrelated to this directory and live under
`relations/robinhood-stock-token-v0/test/`.
