# Semantic Execution Guard provenance

- Project: Semantic Execution Guard
- Hackathon: Colosseum Crypto World's Fair 2026 (user-designated project context; eligibility not independently established)
- Repository: pipavlo82/semantic-execution-guard
- URL: https://github.com/pipavlo82/semantic-execution-guard
- Repository creation timestamp (GitHub API): 2026-09-16T17:51:51Z
- Initial commit SHA: `093dc4f7832c1e18ede0bf9de6fb590aad6fbea8` (also local main; recorded after creation without rewriting the root commit).

## Pre-existing foundation

- trustless-ai/semantic-abi
- pipavlo82/relational-security-invariants (RSI)
- Existing Semantic ABI schema, linker, and research
- ETHOnline Semantic ABI work
- Any source code subsequently copied or adapted from those projects must be separately attributed and pinned in provenance/BASELINES.md.

These components pre-date this repository and are not claimed as new
hackathon work.

## Intended new work (not implemented by this commit)

- Robinhood Stock Token semantic execution relation
- SemanticExecutionGuard contract integration (Fede)
- Adversarial relation vectors
- Exact price/multiplier recomputation
- Robinhood Chain testnet deployment (Tiago / Merlini)
- Revert/execute demo
- Hackathon-specific UX/demo layer

Pavlo owns the protected relation, semantic type boundary, adversarial vectors,
deterministic recomputation, mutation proof, and later independent RSI verification.
This task closes only the local relation/recompute lane and defines handoffs.
No implementation, deployment, execution, independent verification, or novelty
claim is made by this initial provenance commit.

The owner is Pavlo's personal account per his explicit correction; this is not
an implementation branch in a pre-existing foundation repository.

## Local implementation status after the root commit

New on `feat/robinhood-stock-token-relation-v0`: independently implemented Robinhood
relation/schema; exact integer/rational recomputation; 26 synthetic vectors;
deterministic receipts; seven source mutation proofs; implementation-neutral guard
result schema and example; deployment evidence checklist; local JSON two-path demo;
minimal Foundry directory/config scaffolding and source/provenance records.

Pending: Fede's contract/guard integration, Tiago's live evidence adapter and
Robinhood Chain testnet deployment, actual revert/execute transactions, frontend/UX
and later independent RSI verification. These are not claimed as implemented.
No runtime source was copied or adapted from pre-existing repositories. Semantic
ABI concepts, RSI methodology, existing schema/linker/research and ETHOnline work
remain pre-existing foundations explicitly disclosed above and in BASELINES.md.
