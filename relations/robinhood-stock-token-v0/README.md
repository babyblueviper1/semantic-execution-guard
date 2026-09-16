# Robinhood Stock Token relation v0

The data can be valid while its meaning is wrong.

An UNDERLYING_EQUITY_QUOTE establishes a MULTIPLIER_ADJUSTED_TOKEN_PRICE only
through an explicit, digest-bound exact conversion with a same-asset
SHARES_PER_TOKEN_MULTIPLIER, matching currency/side and declared effective state,
and consistent decimal metadata. Numeric equality never supplies that conversion.

## Scope and policy

This is a new, independently implemented, concept-compatible Semantic ABI relation;
it neither imports nor claims wire conformance with the upstream draft manifest.
See ../../provenance/BASELINES.md for inspected source pins and reuse boundaries.

Inputs are normalized SYNTHETIC_RELATION_FIXTURE declarations. Asset identity is the
full (asset_id, chain_id, contract_address) tuple, never a ticker. Chain 31337 and
all fixture addresses are invented local identifiers, not observed Robinhood assets.
Source/authority labels describe supplied evidence roles; they do not authenticate
a response. V0 allows only the declared REST prices + REST assets route. The
ALREADY_ADJUSTED_ONCHAIN_PRICE role is recognized solely to reject double adjustment.
Direct consumption of an adjusted feed requires a separate future profile.

All input fields are committed by SHA-256 over UTF-8, recursively key-sorted JSON,
with array order retained and no whitespace. All numeric prices/multipliers are
positive integer strings (up to 78 digits); decimal counts are integers 0..36.
JSON inputs only, no duplicate keys or non-JSON objects. Times are safe integer
Unix seconds. Asset addresses use lowercase normalization in this internal format.
The witness binds complete quote and multiplier objects with the same digest rule.

The context is a separately supplied consumer requirement, not inferred from quote
fields by the evaluator. It pins asset, currency, side, scales, quote time and the
expected multiplier effective state/interval. Quote time must be in [from, until),
multiplier observation in [from, quote_time], context observation >= quote_time;
state IDs and interval bounds must agree exactly. These are SYNTHETIC TEST
ASSUMPTIONS, not a Robinhood cache/freshness guarantee or production timing policy.
No wall-clock call or network request participates in recomputation. An earlier
state is rejected relative to supplied context, not relative to independently known
latest chain state. Relabeling every declaration consistently is not detectable here.

Prices use USD/share and multipliers shares/token. BigInt multiplication produces
an exact reduced rational in USD/token, followed by explicit output decimal scaling.
Inconsistent scale declarations FAIL. A consistent conversion requiring a fractional
output mantissa returns CANNOT_ESTABLISH / ROUNDING_UNSPECIFIED; no rounding rule
is invented. REST multiplier scale is 18, per the official documentation; quote
and output decimal scales remain declared, never inferred from token decimals.

## Outcomes and receipt

- PASS: supplied declarations establish this local relation and an exact derived value.
- FAIL: a declared semantic boundary is violated.
- CANNOT_ESTABLISH: required evidence is missing, input is unsupported/malformed,
  or output needs an unspecified rounding rule. This is not false and never PASS.

Receipts retain inputs' semantic coordinates, a context digest, exact rational and
derived mantissa/decimals only when established. Null means not established/not
present, never zero. `explicit_boundary_hit` marks an enforced semantic rule;
it does not assert an upstream linker was executed. `input_digest` covers the full
input, excluding the vector's independently specified expected result.

This does not establish truth, source authentication, an oracle, real freshness,
authorization, execution, deployment, independent verification, or market suitability.
Semantic compatibility != truth != freshness != authorization != execution.

## Run (repository root, Node >=22)

```sh
node relations/robinhood-stock-token-v0/recompute.mjs
node --test
```

The corpus contains 26 cases, including all ten required adversarial/control cases.
The mutation runner patches one rule at a time in temporary module copies, keeps
both positive controls passing, and requires a negative vector to become PASS.
Crashes and control failures do not count as kills. Reports bind implementation,
schema, validator, vectors and mutation-runner source digests. Regenerate with:

```sh
node relations/robinhood-stock-token-v0/recompute.mjs artifacts/recomputation-receipts.json
node relations/robinhood-stock-token-v0/mutations.mjs artifacts/mutation-report.json
```

No Solidity guard or testnet route is implemented in this lane.
