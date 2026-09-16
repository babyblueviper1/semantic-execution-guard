# Architecture and boundaries

Pavlo implements the relation between evidence declarations and a derived claim.
Fede implements the Solidity guard and protected action. Tiago / Merlini implement
Robinhood Chain evidence collection and deployment. Interfaces here are proposed
handoff contracts; teammate agreement and integration remain pending.

1. Evidence adapter produces typed, source-bound, identity-preserving quote and
   multiplier records plus externally justified consumer/effective-state context.
   This adapter is not implemented; v0 uses explicitly synthetic normalized fixtures.
2. Relation validates semantic roles, full asset/chain/contract identity, USD and
   quote side, temporal/effective context, witness bindings and declared scales.
3. BigInt arithmetic derives the exact product and establishes the requested
   adjusted price only if representable without rounding.
4. A PASS result can be formatted as the small JSON handoff. FAIL and
   CANNOT_ESTABLISH have no executable value and format to null.
5. Fede's future guard must separately bind authenticated evidence/result to
   the intended action and consumer context. A caller-supplied PASS boolean or
   this JSON object alone must never confer execution authority.

The relation is not the upstream Semantic ABI linker. It uses the pre-existing
conceptual separation of claim, authority, scope and time with a new domain-specific
conversion rule. The fixtures and evaluator are authored in the same lane: mutation
testing supplies falsifiability, not author/operator independence or an RSI audit.

Does not establish: authenticated evidence, oracle status, real-world truth,
independent freshness/latest multiplier state, authorization, executed action,
deployed contract, finality, successful testnet use, independent verification,
production suitability, or hackathon eligibility.

All outcome-affecting inputs are retained in vectors and input_digest. Expected
results live outside that digest and are never read by recompute(). The result's
context_digest binds consumer requirements; evidence_digest identifies full input
bytes under the documented canonicalization. Neither digest proves authenticity.

No external calls in tests, no floating-point price arithmetic, no package install,
no frontend framework, no production trading, and no teammate Solidity replacement.
New code has no license grant yet; pre-existing licenses are documented but not
silently applied to this project.
