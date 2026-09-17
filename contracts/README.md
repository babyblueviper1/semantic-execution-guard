# Fede's lane

`SemanticExecutionGuard.sol` implements the on-chain enforcement layer this repo's
off-chain relation profile (`relations/robinhood-stock-token-v0/`) names but does not
itself enforce (see `docs/fede-handoff.md`).

Design summary (see the contract's own NatSpec for the full reasoning): the guard
enforces the relation by **source authority, not numeric comparison** -- the protected
action (`executeAtOraclePrice`) takes no price parameter of any kind, so an off-chain
`UnderlyingEquityQuote` has no argument through which it could ever become the
executable price, regardless of whether it happens to numerically match the on-chain
value. The only price this contract ever uses is its own fresh
`AggregatorV3Interface.latestRoundData()` read, bound to a registered
`(assetId, feed)` pair and checked for staleness/completeness/positivity before use.
No multiplier is applied on-chain -- Robinhood's own Chainlink feed already returns
the multiplier-adjusted price (docs.robinhood.com/chain/oracles-and-price-feeds).

Tests: `test/SemanticExecutionGuard.t.sol` (10 passing), including a structural test
of the exact failure mode the off-chain relation's own
`V2_NUMERIC_COINCIDENCE_DIRECT_PROMOTION` vector targets -- a numeric-match-based
guard would fail open the moment a real corporate action makes raw and adjusted
values diverge; this design makes that shape unrepresentable rather than checking
for it at runtime.

Pending integration acceptance per `docs/fede-handoff.md`: run the same named
bad/control vectors through this implementation and confirm the bad-path reverts /
control-path changes state as expected (not yet run end-to-end against a live
Robinhood-chain deployment).
