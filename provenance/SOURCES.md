# Sources and evidence classifications

Only official Robinhood documentation supplies normative Robinhood semantics.
Access times and SHA-256 of fetched HTML bytes are also machine-readable in
[source-capture-manifest.json](source-capture-manifest.json). Documentation snapshots
were captured outside the repository; CI never fetches them. Their digests identify
the observed page bytes, not authenticated trading evidence or permanent page versions.

## S1 - Stock Token APIs

- URL: https://docs.robinhood.com/chain/stock-token-apis/
- Access: 2026-09-16T17:59:27.548Z
- Classification: normative documentation (examples on this page are examples only).
- Exact relied-upon statements: "The REST `/prices` endpoint returns the raw underlying-equity bid/ask (not multiplier-adjusted)." And multiplier field: "18-dp shares-per-token."
- Applied interpretation: the REST price and asset multiplier are distinct evidence
  roles. The documented conversion uses currentMultiplier. Currency, bid/ask,
  generatedAt and deployment coordinates are preserved by normalization.
- The same page uses token-denominated introductory wording; the explicit raw-price
  field descriptions govern this narrow relation. No broader equivalence is inferred.
- UNVERIFIED: live wire parsing, actual asset IDs, deployed addresses, multiplier
  observations, pending-state history and trustworthy effective interval discovery.

## S2 - Building with Stock Tokens

- URL: https://docs.robinhood.com/chain/building-with-stock-tokens/
- Access: 2026-09-16T17:59:27.626Z
- Classification: normative documentation; code examples are examples, not executions.
- Exact relied-upon excerpt: "The Chainlink price already includes the corporate-action multiplier (dividends, splits)".
- Applied interpretation: an already-adjusted feed value must not pass through raw
  conversion. Multiplier updates have effective times; the documentation describes
  current/pending onchain methods. No contract implementation or feed observation
  is imported from this page, and no testnet availability claim is made.
- UNVERIFIED: authoritative rounding for price conversion at a chosen output scale.
  Example integer division is not promoted into a normative rounding rule.

## S3 - Oracles & Price Feeds

- URL: https://docs.robinhood.com/chain/oracles-and-price-feeds/
- Access: 2026-09-16T17:59:27.663Z
- Classification: normative documentation; feed addresses and examples are not live evidence here.
- Exact relied-upon statement: "Decimals: prices are returned as integers — call `decimals()` to scale."
- Applied interpretation: feed decimal metadata must be captured explicitly in a
  future adapter; ERC-20 decimals cannot supply price-feed decimals. V0 does not
  accept feed inputs for conversion or prescribe feed freshness parameters.

## Local fixture policy

- Source: user task and relations/robinhood-stock-token-v0/README.md, authored 2026-09-16.
- Classification: synthetic test assumption, marked SYNTHETIC_RELATION_FIXTURE.
- Invented: asset A/B, chain 31337/31338, contract identities, all numeric values,
  epoch/state names, timestamps, effective intervals, consumer context and output
  decimal choice. They are not production observations or literal Robinhood API responses.
- Temporal compatibility means consistency with supplied context, not independently
  established latest state or freshness. Source labels are declarations, not credentials.
- Exact arithmetic with unspecified rounding returns CANNOT_ESTABLISH. No inference
  fills gaps in Robinhood semantics.

## Foundation inspection

See BASELINES.md and source-capture-manifest.json for exact commit and file digests.
This is read-only repository inspection, separate from normative Robinhood sources.
No RSI/Semantic ABI source/history was modified. No external REST price, RPC,
Blockscout, Chainlink or testnet transaction evidence was captured in this task.
