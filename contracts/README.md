# Fede's lane

`SemanticExecutionGuard.sol` implements the on-chain enforcement layer this repo's
off-chain relation profile (`relations/robinhood-stock-token-v0/`) names but does not
itself enforce (see `docs/fede-handoff.md`).

Design summary (see the contract's own NatSpec for the full reasoning): the guard
enforces the relation by **source authority, not numeric comparison** -- the price
step (`establishExecutablePrice`) takes no price parameter of any kind, so an
off-chain `UnderlyingEquityQuote` has no argument through which it could ever become
the executable price, regardless of whether it happens to numerically match the
on-chain value. The only price this contract ever uses is its own fresh
`AggregatorV3Interface.latestRoundData()` read, bound to a registered
`(assetId, feed)` pair and checked for staleness/completeness/positivity/valid-
timestamp before use. No multiplier is applied on-chain -- Robinhood's own Chainlink
feed already returns the multiplier-adjusted price
(docs.robinhood.com/chain/oracles-and-price-feeds).

**v0 scope, named explicitly per an independent audit** (Pavlo, ethglobal build
thread, against commit `8dc4f92`): this contract *establishes* an executable price
and receipts it -- it does not itself execute a protected state transition (no
token transfer, no trade settlement), hence `establishExecutablePrice`, not
`executeAtOraclePrice`. It also does not compute or expose any amount-scaled
"notional" figure, since no ERC-20 decimals are bound to a feed registration; a
future consumer that knows its own token's decimals owns that arithmetic.

**Hardening applied same-day per that audit** (all four findings, all with new
regression tests):
1. `registerFeed` rejects the zero address and any address with no deployed code.
2. `getExecutablePrice` rejects `updatedAt == 0` and `updatedAt > block.timestamp`
   explicitly, with a typed error, before the staleness subtraction -- previously
   a future `updatedAt` underflowed that subtraction and reverted with a bare
   `Panic(0x11)` instead. Independently reproduced against the pre-fix contract
   before writing the fix, to confirm the bug was real rather than theoretical.
3. Dropped the `notional` computation entirely (see v0 scope above).
4. Renamed the price-establishment function and documented the claim boundary
   explicitly in NatSpec.

Tests: `test/SemanticExecutionGuard.t.sol` (14 passing), including a structural test
of the exact failure mode the off-chain relation's own
`V2_NUMERIC_COINCIDENCE_DIRECT_PROMOTION` vector targets -- a numeric-match-based
guard would fail open the moment a real corporate action makes raw and adjusted
values diverge; this design makes that shape unrepresentable rather than checking
for it at runtime -- plus one regression test per hardening finding above.

Pending integration acceptance per `docs/fede-handoff.md`: run the same named
bad/control vectors through this implementation and confirm the bad-path reverts /
control-path changes state as expected (not yet run end-to-end against a live
Robinhood-chain deployment).
