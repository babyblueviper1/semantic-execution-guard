# Fede: semantic result handoff v0

Fede owns SemanticExecutionGuard Solidity and the protected action. No Solidity
implementation, ABI choice, signature scheme or trust architecture is imposed here.

- Input relation schema: ../relations/robinhood-stock-token-v0/relation.schema.json
- Result schema: guard-result.schema.json
- Producer: `toGuardResult(recompute(input))` in recompute.mjs.
- Example: ../artifacts/guard-result-control.json (synthetic only).
- Bad path: V2_NUMERIC_COINCIDENCE_DIRECT_PROMOTION -> FAIL /
  EXPLICIT_CONVERSION_REQUIRED -> no result (`null`).
- Good path: V1_CONTROL_CONVERSION -> PASS / EXACT_CONVERSION_ESTABLISHED ->
  value `1543125`, decimals `4`, meaning `154.3125 USD/token` at BID.

Full asset identity, chain, token contract, currency, side, quote time, effective
state and context digest remain explicit. `value` is a decimal integer string;
`decimals` is its base-10 scale. Digests are 0x-prefixed SHA-256, not keccak256.
`evidence_digest` equals the receipt input_digest, including full consumer context
and witness. `context_digest` separately binds the exact context object.
Fixture chain/addresses are invented; the JSON is not EVM calldata.

This schema is NOT authenticated evidence, an oracle, proof of freshness, proof of
truth, proof of authorization, or proof that execution occurred. The formatter only
formats a receipt and is not an admission/security gate for untrusted receipt JSON.
A caller can forge this shape. The guard's trusted route must evaluate/bind evidence
and separately establish authorization, freshness and action scope. Those decisions
belong to Fede's implementation and team agreement.

Expected integration behavior: FAIL and CANNOT_ESTABLISH both block the protected
action, while remaining distinct diagnostic states. PASS is only semantic
compatibility; execution additionally requires all of the guard's other checks.
Do not accept a bare PASS status from an arbitrary caller.

Pending integration acceptance: execute the same named bad/control vectors through
Fede's own implementation; observe a bad-path revert and no protected action, and
a control-path state change. Neither is demonstrated in this repository yet.
No runtime uint256 bounds, EVM encoding or onchain rounding policy is invented by
this interface; v0 integer strings can exceed uint256 and must be rejected or
handled explicitly at an agreed adapter boundary.
