# Cross-repository composition and event-time safety audit v0

The smallest defensible first slice retains Pavlo's typed relation and adds a trusted evidence/context boundary, an authenticated action-bound authorization, and Fede's atomic current-state check, nonce consumption and protected action. Existing conformance, receipt and monitoring systems do not substitute for that consumer. No inspected artifact establishes a deployed SEG event-time guard.

## 1. Audit identity

- Timestamp: 2026-09-16T18:58:40.249Z
- Product: https://github.com/pipavlo82/semantic-execution-guard
- Frozen product base: `8c786d8134632cdb4892ed32051377e739495300` (draft PR #1).
- Frozen provenance-only main: `093dc4f7832c1e18ede0bf9de6fb590aad6fbea8`.
- Local audit branch: `research/cross-repo-composition-audit-v0`.
- Scope: Read-only source audit plus two local report files; no product implementation, push, PR or deployment changes.

gh repo list for user/org, paginated user/repos; exact GitHub default-branch commit/tree/branch/open-PR metadata. Relevant linked sources followed; unrelated applications excluded. Pinned source bytes fetched by gh API; full source-file SHA-256 recorded. No external repository test/install code executed. No external RPC or trading calls. Local formatter experiment only. Source inspection independently observed in this audit; deployment and third-party verification narratives remain upstream reported. Conclusions about composition are explicitly proposals/inferences.

23 repositories inspected/screened; 28 primitives reviewed. {"EVENT_ATOMIC":5,"EVENT_BOUND":1,"EVENT_CHECKED_NONATOMIC":2,"PERIODIC_ONLY":2,"AUDIT_ONLY":7,"CONFORMANCE_ONLY":9,"UNKNOWN":2}. 0 PROVEN_GAP; 16 STRUCTURAL_RISK; **0 proven live vulnerabilities**. Counts are scoped primitives, not independent incident counts. SAFE_BY_CONSTRUCTION is narrow source-level reasoning with stated assumptions, not formal verification or deployment assurance.

| Repository / exact inspected SHA | Default branch / status | Relevant paths / depth | License |
| --- | --- | --- | --- |
| pipavlo82/Chronicle<br>`c467b48fd18fc8ec86f10582befa35946ce41914` | main; merged/main tree (master for pq-receipt-profile); component may be experimental/spec-only | src/chronicle_receiptos_admission.mjs; docs/verification-before-history.md; LICENSE; docs/LICENSE_POLICY_V0.md<br>Targeted code/spec and caller-boundary inspection | Apache-2.0; brand and underlying proof rights separately reserved |
| pipavlo82/crystal-receipt<br>`45b46bf7df3a60b32583291f577a36bf19d22f00` | main; merged/main tree (master for pq-receipt-profile); component may be experimental/spec-only | conformance/tsei-invariant-discrimination-v0/independent-authority-model.ts; src/receiptos/verify/verify-receipt.ts; LICENSE<br>Targeted code/spec and caller-boundary inspection | Apache-2.0 |
| pipavlo82/pq-receipt-profile<br>`54cf1a3784a56f4624b41357148bbe9ba301c470` | master; merged/main tree (master for pq-receipt-profile); component may be experimental/spec-only | README.md<br>README/license/tree screening | No license found in inspected tree |
| pipavlo82/protected-relation-fixtures<br>`07075d874c75da43f5ac8ed8769d5dbc01d56427` | main; merged/main tree (master for pq-receipt-profile); component may be experimental/spec-only | tools/relation_discrimination.py; LICENSE<br>Targeted code/spec and caller-boundary inspection | MIT |
| pipavlo82/receiptos-mvp<br>`0e70ebe85f4dd1b8b2a24be9c29f1b9757e25a71` | main; merged/main tree (master for pq-receipt-profile); component may be experimental/spec-only | src/api.py<br>Targeted code/spec and caller-boundary inspection | No license found in inspected tree |
| pipavlo82/receiptos-pq-lab<br>`a705d9c1942c0f30725c9bddec6606a0cddf4fc6` | main; merged/main tree (master for pq-receipt-profile); component may be experimental/spec-only | README.md<br>README/license/tree screening | No license found in inspected tree |
| pipavlo82/recomputable-verification-receipts<br>`287c0ea1c2578c1833405bc2476975f95addbada` | main; merged/main tree (master for pq-receipt-profile); component may be experimental/spec-only | docs/spec/RECOMPUTABLE_VERIFICATION_RECEIPTS_V0.md; LICENSE<br>Targeted code/spec and caller-boundary inspection | Apache-2.0 |
| pipavlo82/relational-security-invariants<br>`e8fb81904af2ffe19e974383cf78d9d18d259b98` | main; merged/main tree (master for pq-receipt-profile); component may be experimental/spec-only | runner/execution.py; LICENSE<br>Targeted code/spec and caller-boundary inspection | License decision pending; no reuse grant |
| pipavlo82/semantic-execution-guard<br>`8c786d8134632cdb4892ed32051377e739495300` | main; draft/branch (frozen PR #1) | relations/robinhood-stock-token-v0/recompute.mjs; relations/robinhood-stock-token-v0/relation.schema.json; docs/guard-result.schema.json; docs/fede-handoff.md; docs/architecture.md<br>Targeted code/spec and caller-boundary inspection | No license grant; team decision pending |
| trustless-ai/agent-contracts-examples<br>`60855b200745d2f6dfd24b266f95ca92ce102ed2` | main; merged/main tree (master for pq-receipt-profile); component may be experimental/spec-only | recovery-receipt/contracts/src/MiniRecoveryEscrow.sol; LICENSE<br>Targeted code/spec and caller-boundary inspection | Apache-2.0 |
| trustless-ai/agent-ercs<br>`01283ca57305f915afb560d23359a27fd748eb5a` | main; merged/main tree (master for pq-receipt-profile); component may be experimental/spec-only | contracts/verify/ERC8354/PolicyAction.sol; contracts/settlement/ConsultEscrow/ConsultEscrow.sol; LICENSE<br>Targeted code/spec and caller-boundary inspection | Apache-2.0 root; inspected ConsultEscrow MIT; PolicyAction CC0-1.0 |
| trustless-ai/agent-sdk<br>`e41b117893fb56bc869922de378daf91aad63def` | main; merged/main tree (master for pq-receipt-profile); component may be experimental/spec-only | testkit/contracts/mocks/verify/ERC8354/ConfidentialPolicyVerdict.sol; LICENSE<br>Targeted code/spec and caller-boundary inspection | Apache-2.0 root; inspected CAPV mock CC0-1.0 |
| trustless-ai/ccip-router<br>`d6f5c96d31490213e932eb63c83b9989b2073900` | main; merged/main tree (master for pq-receipt-profile); component may be experimental/spec-only | src/integrations/tseiProfileA.ts; src/integrations/tseiProfileARouter.ts; src/verify/binding.ts; contracts/OffchainResolver.sol; src/mesh/cron.ts; contracts/GenericCommitRevealSettler.sol; LICENSE<br>Targeted code/spec and caller-boundary inspection | MIT |
| trustless-ai/composed-attestation-note<br>`b1ba7a24d492804a2382576170404baa2998ff77` | main; merged/main tree (master for pq-receipt-profile); component may be experimental/spec-only | LICENSE; README.md<br>README/license/tree screening | CC0-1.0 |
| trustless-ai/cross-reference-console<br>`268c77b795aef5f13b018e76e4f7d9307a81b395` | main; merged/main tree (master for pq-receipt-profile); component may be experimental/spec-only | .github/workflows/watcher.yml; LICENSE<br>Targeted code/spec and caller-boundary inspection | CC0-1.0 |
| trustless-ai/eip7702-rescue<br>`31133de1ca5428947580f53a486d97aae461e33e` | main; merged/main tree (master for pq-receipt-profile); component may be experimental/spec-only | contracts/RescueDelegate.sol; LICENSE<br>Targeted code/spec and caller-boundary inspection | CC0-1.0 |
| trustless-ai/observation-conditions-note<br>`05e8fda42996ea138c6728df4c02931122dc7f98` | main; merged/main tree (master for pq-receipt-profile); component may be experimental/spec-only | LICENSE; README.md<br>README/license/tree screening | CC0-1.0 |
| trustless-ai/pq-agent-binding<br>`4f934ad31e96979002d818cd8a5f12909c1b6713` | main; merged/main tree (master for pq-receipt-profile); component may be experimental/spec-only | spec/v1-temporal-authority.md; LICENSE<br>Targeted code/spec and caller-boundary inspection | CC0-1.0 |
| trustless-ai/primitives<br>`6b39e9540d4bd0a78decb588c0a8e328c303f208` | main; merged/main tree (master for pq-receipt-profile); component may be experimental/spec-only | LICENSE; README.md<br>README/license/tree screening | CC0-1.0 |
| trustless-ai/recompute-kit<br>`f5a25bd6bbf555c710d63915d4e5092548e3702c` | main; merged/main tree (master for pq-receipt-profile); component may be experimental/spec-only | conformance/verdict-profile-binding-v0/verdict-profile-binding-v0.reference.mjs; conformance/profile-amendment-v0/profile-amendment-v0.reference.mjs; conformance/captured-admission-v0/README.md; conformance/pq-recovery-classes-v0/README.md; conformance/pq-recovery-classes-v0/recovery_check.py; conformance/pq-key-binding-v1/cutoff_enforce.py; conformance/predicate-conformance-v0/gate.ts; LICENSE<br>Targeted code/spec and caller-boundary inspection | CC0-1.0 |
| trustless-ai/semantic-abi<br>`d15c666dfccff17f7350fe97d2fc7b71cb2cbaee` | main; merged/main tree (master for pq-receipt-profile); component may be experimental/spec-only | runner/src/linker.mjs; runner/src/evaluate.mjs; LICENSE; README.md<br>Targeted code/spec and caller-boundary inspection | Apache-2.0 code; CC0 schema/spec |
| trustless-ai/trustless-agent-substrate<br>`a344ef80f7c52c03b9183814d1874b8054639c3e` | feature/tas-poc; experimental default feature/tas-poc; not main | src/core/workflow/sourceGate.ts; src/core/workflow/operationService.ts; src/clients/workflow/agentSdkClient.ts; LICENSE<br>Targeted code/spec and caller-boundary inspection | Apache-2.0 |
| trustless-ai/verify-layer<br>`84afc4b738dc37269089c858404eed8086435f5d` | main; merged/main tree (master for pq-receipt-profile); component may be experimental/spec-only | verify.mjs; LICENSE<br>Targeted code/spec and caller-boundary inspection | CC0-1.0 |

All exact source links below use these SHAs. JSON includes source-file SHA-256 values, branch/open-PR inventory and license evidence. Main-tree presence is distinguished from product implementation status. TAS is on default `feature/tas-poc`, not merged main; the product branch is unmerged; spec/demo repositories are not live services merely because files are on main.

Accessible inventory was searched for semantic ABI, recomputation, receipts, relational fixtures, TSEI, authority/PQ binding and execution/verification. No separate accessible TSEI repository was assumed: concrete TSEI surfaces were found in Crystal Receipt and ccip-router. The linked gateway source could not be resolved; no alternate owner was guessed. Gaming/RNG, presentation, unrelated application and unrelated proof-system projects were excluded unless a distinct boundary was found.

## 2. Primitive inventory

The JSON contains purpose, inputs, outputs, trust root, authority model, state/time dependencies, cadence, status, independent-verification limits and reuse constraints for every primitive. The following is the human-readable inventory.

### SEG_RELATION

Exact typed quote-to-adjusted-price conversion. **REQUIRED_FOR_FIRST_SLICE**.

- Inputs: Synthetic normalized quote, multiplier, conversion witness and consumer context. Outputs: PASS / FAIL / CANNOT_ESTABLISH, exact value, input/context digests.
- Trust root: Caller-supplied fixture/context; no credential verification. Authority: Declared source and authority labels only.
- Boundary: Semantic compatibility of the supplied tuple.
- State: Asset tuple, currency/side, scale, effective interval/state and explicit witness. Time: Supplied observations and intervals; no clock or latest-state resolver.
- Location/status: Offchain local Node evaluator; Frozen draft PR #1; relation implementation only.
- Does not establish: Authenticity, truth, event freshness, authorization, replay prevention, execution.
- Evidence: [pipavlo82/semantic-execution-guard:relations/robinhood-stock-token-v0/recompute.mjs L23-98](https://github.com/pipavlo82/semantic-execution-guard/blob/8c786d8134632cdb4892ed32051377e739495300/relations/robinhood-stock-token-v0/recompute.mjs#L23-L98); [pipavlo82/semantic-execution-guard:relations/robinhood-stock-token-v0/relation.schema.json L1-24](https://github.com/pipavlo82/semantic-execution-guard/blob/8c786d8134632cdb4892ed32051377e739495300/relations/robinhood-stock-token-v0/relation.schema.json#L1-L24); [pipavlo82/semantic-execution-guard:docs/guard-result.schema.json L1-26](https://github.com/pipavlo82/semantic-execution-guard/blob/8c786d8134632cdb4892ed32051377e739495300/docs/guard-result.schema.json#L1-L26); [pipavlo82/semantic-execution-guard:docs/fede-handoff.md L15-38](https://github.com/pipavlo82/semantic-execution-guard/blob/8c786d8134632cdb4892ed32051377e739495300/docs/fede-handoff.md#L15-L38); [pipavlo82/semantic-execution-guard:docs/architecture.md L7-30](https://github.com/pipavlo82/semantic-execution-guard/blob/8c786d8134632cdb4892ed32051377e739495300/docs/architecture.md#L7-L30).

### SABI_LINKER

Claim-level consumes/establishes compatibility. **USEFUL_AFTER_FIRST_SLICE**.

- Inputs: Producer establishes/does_not_establish and required claim. Outputs: Valid edge or TYPE_ERROR with counterexample.
- Trust root: Declared manifests. Authority: Claim, authority-class, scope and temporal-boundary comparison.
- Boundary: Evidence meaning, not credential verification.
- State: Manifest claims. Time: Equal supplied temporal fields; no expiry clock.
- Location/status: Offchain pure library/runner; Present at inspected default branch; runtime/deployment status limited to cited evidence.
- Does not establish: Provider identity, live state, truth, execution authorization.
- Evidence: [trustless-ai/semantic-abi:runner/src/linker.mjs L1-100](https://github.com/trustless-ai/semantic-abi/blob/d15c666dfccff17f7350fe97d2fc7b71cb2cbaee/runner/src/linker.mjs#L1-L100); [trustless-ai/semantic-abi:runner/src/evaluate.mjs L1-54](https://github.com/trustless-ai/semantic-abi/blob/d15c666dfccff17f7350fe97d2fc7b71cb2cbaee/runner/src/evaluate.mjs#L1-L54).

### RSI_DISCRIMINATION

Independent-adapter relation testing. **INDEPENDENT_VERIFICATION_ONLY**.

- Inputs: Pinned profile, fixtures, adapter and validation plan. Outputs: Observed relation compared with expected relation.
- Trust root: Profile/fixture oracle and independently selected adapter. Authority: Declared independent lane must be separately demonstrated.
- Boundary: Falsifiability and adapter agreement.
- State: Pinned request digest and plan. Time: No event clock.
- Location/status: Offchain runner; Present at inspected default branch; runtime/deployment status limited to cited evidence.
- Does not establish: Production enforcement or independence of SEG merely because tests pass.
- Evidence: [pipavlo82/relational-security-invariants:runner/execution.py L24-79](https://github.com/pipavlo82/relational-security-invariants/blob/e8fb81904af2ffe19e974383cf78d9d18d259b98/runner/execution.py#L24-L79).

### PRF_AXES

Identity/type/multiplicity/direction/scope discrimination. **INDEPENDENT_VERIFICATION_ONLY**.

- Inputs: Explicit relation policy and fixture pair. Outputs: PRESERVED / VIOLATED / UNVERIFIABLE.
- Trust root: Fixture policy. Authority: Semantic extraction under declared policy.
- Boundary: Explicit protected axes.
- State: Policy and relation pair. Time: No live freshness dependency.
- Location/status: Offchain conformance; Present at inspected default branch; runtime/deployment status limited to cited evidence.
- Does not establish: Truth, source authority, current state or execution.
- Evidence: [pipavlo82/protected-relation-fixtures:tools/relation_discrimination.py L9-94](https://github.com/pipavlo82/protected-relation-fixtures/blob/07075d874c75da43f5ac8ed8769d5dbc01d56427/tools/relation_discrimination.py#L9-L94).

### RK_PROFILE_BINDING

Bind verdict to effective policy and authorized amendment shape. **USEFUL_AFTER_FIRST_SLICE**.

- Inputs: Verdict core, supplied task-effective profile and amendment signatures-as-records. Outputs: Bound/unbound or effective profile selection.
- Trust root: Supplied commitments and signer records. Authority: Reference compares signed_digest strings; does not verify cryptography.
- Boundary: Policy identity must be consumed, not merely recorded.
- State: Profile and escrow/task commitments. Time: No proof effective profile is latest at execution.
- Location/status: Offchain reference; Present at inspected default branch; runtime/deployment status limited to cited evidence.
- Does not establish: Real signatures, live amendment authority or atomic action.
- Evidence: [trustless-ai/recompute-kit:conformance/verdict-profile-binding-v0/verdict-profile-binding-v0.reference.mjs L1-49](https://github.com/trustless-ai/recompute-kit/blob/f5a25bd6bbf555c710d63915d4e5092548e3702c/conformance/verdict-profile-binding-v0/verdict-profile-binding-v0.reference.mjs#L1-L49); [trustless-ai/recompute-kit:conformance/profile-amendment-v0/profile-amendment-v0.reference.mjs L8-67](https://github.com/trustless-ai/recompute-kit/blob/f5a25bd6bbf555c710d63915d4e5092548e3702c/conformance/profile-amendment-v0/profile-amendment-v0.reference.mjs#L8-L67).

### RK_CAPTURED_ADMISSION

Admission history, deadline and duplicate classification. **USEFUL_AFTER_FIRST_SLICE**.

- Inputs: Captured immutable history, explicit as_of, admission/event IDs and policy. Outputs: Admission/deadline/idempotency findings.
- Trust root: Supplied captured history and policy. Authority: Independent of caller latest-state assertions only within supplied history.
- Boundary: History-sensitive recomputation versus construction-time exclusion.
- State: History prefix, request identity and policy. Time: Explicit as_of and policy deadline.
- Location/status: Offchain reference; Present at inspected default branch; runtime/deployment status limited to cited evidence.
- Does not establish: Atomic uniqueness at storage write, live completeness or actual authorization.
- Evidence: [trustless-ai/recompute-kit:conformance/captured-admission-v0/README.md L27-59](https://github.com/trustless-ai/recompute-kit/blob/f5a25bd6bbf555c710d63915d4e5092548e3702c/conformance/captured-admission-v0/README.md#L27-L59); [trustless-ai/recompute-kit:conformance/captured-admission-v0/README.md L97-126](https://github.com/trustless-ai/recompute-kit/blob/f5a25bd6bbf555c710d63915d4e5092548e3702c/conformance/captured-admission-v0/README.md#L97-L126).

### RK_STANDING_TERMINALITY

Terminal recovery class as a standing bind constraint. **USEFUL_AFTER_FIRST_SLICE**.

- Inputs: Prior recovery statements and proposed bind including supplied anchors. Outputs: bind_gate permitted/blocked and recovery class.
- Trust root: Supplied anchored statements; synthetic key derivation. Authority: Terminal owner kill or incident recovery rules in reference.
- Boundary: Standing constraint is required conceptually; checker alone is insufficient.
- State: Prior terminality, seed rotation coverage and agent binding. Time: Ordering of supplied anchor times.
- Location/status: Offchain vector-first reference; Present at inspected default branch; runtime/deployment status limited to cited evidence.
- Does not establish: Actual cryptography, live terminality registry, or every-event enforcement.
- Evidence: [trustless-ai/recompute-kit:conformance/pq-recovery-classes-v0/README.md L42-82](https://github.com/trustless-ai/recompute-kit/blob/f5a25bd6bbf555c710d63915d4e5092548e3702c/conformance/pq-recovery-classes-v0/README.md#L42-L82); [trustless-ai/recompute-kit:conformance/pq-recovery-classes-v0/recovery_check.py L36-119](https://github.com/trustless-ai/recompute-kit/blob/f5a25bd6bbf555c710d63915d4e5092548e3702c/conformance/pq-recovery-classes-v0/recovery_check.py#L36-L119).

### RK_CUTOFF

Tri-state authority-window and cutoff recomputation. **USEFUL_AFTER_FIRST_SLICE**.

- Inputs: Supplied bindings, revocations, artifact anchor time, cutoff and companion result. Outputs: Evidence verified/refuted/unverifiable with separate ADMIT/REJECT.
- Trust root: Supplied binding/anchor/companion verification records. Authority: Only verified projects to admit; legacy pre-baseline admit is distinct from PQ governance.
- Boundary: Temporal governance versus legacy admission.
- State: Binding chain and revoked_at. Time: Anchor/activation/cutoff times.
- Location/status: Offchain reference port; Present at inspected default branch; runtime/deployment status limited to cited evidence.
- Does not establish: Classical signature verification, live chain completeness or guard integration.
- Evidence: [trustless-ai/recompute-kit:conformance/pq-key-binding-v1/cutoff_enforce.py L2-35](https://github.com/trustless-ai/recompute-kit/blob/f5a25bd6bbf555c710d63915d4e5092548e3702c/conformance/pq-key-binding-v1/cutoff_enforce.py#L2-L35); [trustless-ai/recompute-kit:conformance/pq-key-binding-v1/cutoff_enforce.py L62-177](https://github.com/trustless-ai/recompute-kit/blob/f5a25bd6bbf555c710d63915d4e5092548e3702c/conformance/pq-key-binding-v1/cutoff_enforce.py#L62-L177).

### RK_PREDICATE_PRECOMMIT

Bind falsification run to frozen predicate and canonicalization. **INDEPENDENT_VERIFICATION_ONLY**.

- Inputs: Precommit, mutant, predicate attribution and observed run. Outputs: PASS / CONFORMANCE_FAILED / UNRESOLVED.
- Trust root: Declared author strings and frozen predicate. Authority: Hash reproduction and explicit consumed precommit; real attribution deferred.
- Boundary: A run consumes a predicate; unavailable is not disagreement.
- State: Predicate canon_id, precommit hash and gate identity. Time: No live clock; git ancestry separate.
- Location/status: Offchain conformance; Present at inspected default branch; runtime/deployment status limited to cited evidence.
- Does not establish: Real authorship/control independence, git ancestry or execution enforcement.
- Evidence: [trustless-ai/recompute-kit:conformance/predicate-conformance-v0/gate.ts L1-75](https://github.com/trustless-ai/recompute-kit/blob/f5a25bd6bbf555c710d63915d4e5092548e3702c/conformance/predicate-conformance-v0/gate.ts#L1-L75).

### TSEI_AUTHORITY_SCAFFOLD

Separate external oracle grounding from originator/self attribution. **INDEPENDENT_VERIFICATION_ONLY**.

- Inputs: Blind problem digest, oracle payload and provider observations. Outputs: Grounding/provenance outcome with claim boundary.
- Trust root: Declared external provider trust_root_id; production verifier injected. Authority: Human-primary independent judgment is not mechanically manufactured.
- Boundary: Independent semantic authority versus mechanical observation.
- State: Problem package and oracle byte digests. Time: Publication order/provider facts; provider implementation not supplied.
- Location/status: Offchain scaffold; Present at inspected default branch; runtime/deployment status limited to cited evidence.
- Does not establish: Production provider verification or a general Robinhood authority resolver.
- Evidence: [pipavlo82/crystal-receipt:conformance/tsei-invariant-discrimination-v0/independent-authority-model.ts L69-100](https://github.com/pipavlo82/crystal-receipt/blob/45b46bf7df3a60b32583291f577a36bf19d22f00/conformance/tsei-invariant-discrimination-v0/independent-authority-model.ts#L69-L100); [pipavlo82/crystal-receipt:conformance/tsei-invariant-discrimination-v0/independent-authority-model.ts L275-299](https://github.com/pipavlo82/crystal-receipt/blob/45b46bf7df3a60b32583291f577a36bf19d22f00/conformance/tsei-invariant-discrimination-v0/independent-authority-model.ts#L275-L299).

### CCIP_TSEI_OBSERVATIONS

Transport signed observations and expose divergent receipt bytes. **NOT_JUSTIFIED_YET**.

- Inputs: Receipt bytes, instance hash, observer signatures and DB observations. Outputs: Single/divergent observation set and signer identity.
- Trust root: Observer keys and stored bytes. Authority: Signature authenticates observation, not TSEI semantics or independent authority.
- Boundary: Identity/hash of observed evidence versus semantic authority.
- State: Stored receipt versions and signers. Time: Timestamp recorded; no execution freshness enforcement.
- Location/status: Offchain router; Present at inspected default branch; runtime/deployment status limited to cited evidence.
- Does not establish: Private opening, semantic rerun, finality, observer independence or action authorization.
- Evidence: [trustless-ai/ccip-router:src/integrations/tseiProfileA.ts L45-100](https://github.com/trustless-ai/ccip-router/blob/d6f5c96d31490213e932eb63c83b9989b2073900/src/integrations/tseiProfileA.ts#L45-L100); [trustless-ai/ccip-router:src/integrations/tseiProfileARouter.ts L83-126](https://github.com/trustless-ai/ccip-router/blob/d6f5c96d31490213e932eb63c83b9989b2073900/src/integrations/tseiProfileARouter.ts#L83-L126).

### CCIP_BINDING_OBSERVER

Observe NFT/registry ownership binding. **NOT_JUSTIFIED_YET**.

- Inputs: Binding coordinates and RPC configuration. Outputs: valid/invalid observation with owners.
- Trust root: Configured RPC endpoints. Authority: Latest contract reads, no common block pin in inspected route.
- Boundary: Ownership observation is not event authorization.
- State: Owner and registry account state across calls. Time: Request-time RPC answers without shared block identity.
- Location/status: Offchain RPC observer; Present at inspected default branch; runtime/deployment status limited to cited evidence.
- Does not establish: Atomic state snapshot, future ownership, executor rights or action execution.
- Evidence: [trustless-ai/ccip-router:src/verify/binding.ts L38-95](https://github.com/trustless-ai/ccip-router/blob/d6f5c96d31490213e932eb63c83b9989b2073900/src/verify/binding.ts#L38-L95).

### CCIP_EXPIRING_RESPONSE

Authenticate expiring CCIP-Read callback result. **USEFUL_AFTER_FIRST_SLICE**.

- Inputs: extraData, result, expiry and resolver signature. Outputs: Verified read result.
- Trust root: Current authorized signer mapping. Authority: Address-domain signature over expiry, request extraData and result.
- Boundary: Authenticated read response is not single-use execution authority.
- State: Signer set and signed read payload. Time: block.timestamp <= supplied expiry.
- Location/status: Onchain view callback; Present at inspected default branch; runtime/deployment status limited to cited evidence.
- Does not establish: Chain-separated execution permit, nonce consumption, current external truth or protected action.
- Evidence: [trustless-ai/ccip-router:contracts/OffchainResolver.sol L83-142](https://github.com/trustless-ai/ccip-router/blob/d6f5c96d31490213e932eb63c83b9989b2073900/contracts/OffchainResolver.sol#L83-L142).

### CCIP_PEER_SYNC

Periodic peer evidence replication. **NOT_JUSTIFIED_YET**.

- Inputs: Peer list and syncInterval. Outputs: Replicated observations.
- Trust root: Configured peers. Authority: Transport, not independent authority.
- Boundary: Eventual observation availability.
- State: Peer/local stores. Time: Configurable cron cadence and availability.
- Location/status: Offchain cron; Present at inspected default branch; runtime/deployment status limited to cited evidence.
- Does not establish: Event-time safety or current evidence at every action.
- Evidence: [trustless-ai/ccip-router:src/mesh/cron.ts L1-28](https://github.com/trustless-ai/ccip-router/blob/d6f5c96d31490213e932eb63c83b9989b2073900/src/mesh/cron.ts#L1-L28).

### CCIP_COMMIT_REVEAL

Commit/reveal consistency for a local record. **NOT_JUSTIFIED_YET**.

- Inputs: Sender, period, record and prior commitment. Outputs: One accepted reveal.
- Trust root: msg.sender and onchain mapping. Authority: Commitment and deadline in same EVM transaction.
- Boundary: Atomic reveal does not establish truth or challenge resolution.
- State: Commit and revealed flag. Time: Reveal window in contract.
- Location/status: Onchain prototype source; no deployment verified; Present at inspected default branch; runtime/deployment status limited to cited evidence.
- Does not establish: Semantic price validity or arbitrary protected action.
- Evidence: [trustless-ai/ccip-router:contracts/GenericCommitRevealSettler.sol L79-145](https://github.com/trustless-ai/ccip-router/blob/d6f5c96d31490213e932eb63c83b9989b2073900/contracts/GenericCommitRevealSettler.sol#L79-L145).

### CAPV_CONSUME

Policy-verdict verification and atomic nullifier consumption. **USEFUL_AFTER_FIRST_SLICE**.

- Inputs: Verdict tuple, executor authorization and verifier proof. Outputs: Consumed nullifier and emitted verdict event.
- Trust root: EIP-712 domain, current policy registry and verifier. Authority: Executor, expiry, active domain/root and proof checked at consumption.
- Boundary: A consumed authorization is not proof its advertised action ran.
- State: Policy root/domain active status and consumed mapping. Time: Expiry evaluated onchain.
- Location/status: Onchain testkit mock/reference source; Present at inspected default branch; runtime/deployment status limited to cited evidence.
- Does not establish: Protected action execution, atomic consume-and-execute, source truth or deployability as-is.
- Evidence: [trustless-ai/agent-sdk:testkit/contracts/mocks/verify/ERC8354/ConfidentialPolicyVerdict.sol L18-54](https://github.com/trustless-ai/agent-sdk/blob/e41b117893fb56bc869922de378daf91aad63def/testkit/contracts/mocks/verify/ERC8354/ConfidentialPolicyVerdict.sol#L18-L54); [trustless-ai/agent-sdk:testkit/contracts/mocks/verify/ERC8354/ConfidentialPolicyVerdict.sol L57-138](https://github.com/trustless-ai/agent-sdk/blob/e41b117893fb56bc869922de378daf91aad63def/testkit/contracts/mocks/verify/ERC8354/ConfidentialPolicyVerdict.sol#L57-L138).

### ACTION_COMMITMENT

Canonical commitment to intended action coordinates. **USEFUL_AFTER_FIRST_SLICE**.

- Inputs: chainId, domainId, agentId, target, value, calldata hash, actionNonce. Outputs: Action hash.
- Trust root: None: pure hashing primitive. Authority: Consumer must derive hash from actual action and enforce nonce.
- Boundary: Action identity versus authorization.
- State: Action fields; no mutable state reader. Time: No expiry in this helper.
- Location/status: Solidity pure helper; Present at inspected default branch; runtime/deployment status limited to cited evidence.
- Does not establish: Signature, rights, current state, expiry or nonce enforcement.
- Evidence: [trustless-ai/agent-ercs:contracts/verify/ERC8354/PolicyAction.sol L1-29](https://github.com/trustless-ai/agent-ercs/blob/01283ca57305f915afb560d23359a27fd748eb5a/contracts/verify/ERC8354/PolicyAction.sol#L1-L29).

### CONSULT_ESCROW

Attested result releases one funded job. **NOT_JUSTIFIED_YET**.

- Inputs: Job ID, result hash and configured attestor signature. Outputs: Job marked released and payment.
- Trust root: Job attestor and local job storage. Authority: Personal-sign job/result; paid recipient fixed in job.
- Boundary: Local single settlement versus cross-domain price authorization.
- State: Open job and phase. Time: Refund deadline checked on refund; release has no expiry check.
- Location/status: Onchain example source; Present at inspected default branch; runtime/deployment status limited to cited evidence.
- Does not establish: Chain/consumer-domain signature separation, expiry of release permission or semantic price relation.
- Evidence: [trustless-ai/agent-ercs:contracts/settlement/ConsultEscrow/ConsultEscrow.sol L21-55](https://github.com/trustless-ai/agent-ercs/blob/01283ca57305f915afb560d23359a27fd748eb5a/contracts/settlement/ConsultEscrow/ConsultEscrow.sol#L21-L55).

### RECOVERY_ESCROW

Check receipt and ownership atomically before reward. **USEFUL_AFTER_FIRST_SLICE**.

- Inputs: Funded job, expected artifact hash and verifier payload. Outputs: Closed/spent job and fee payment.
- Trust root: Pinned verifier and token ownerOf. Authority: Receipt match and current output ownership in same transaction.
- Boundary: Useful consume-and-act pattern, not a stock-token guard.
- State: Job open/spent and token ownership. Time: No expiry rule in inspected release.
- Location/status: Illustrative onchain source, explicitly not production-ready; Present at inspected default branch; runtime/deployment status limited to cited evidence.
- Does not establish: Robinhood source authenticity, price policy, arbitrary authorization or verified deployment.
- Evidence: [trustless-ai/agent-contracts-examples:recovery-receipt/contracts/src/MiniRecoveryEscrow.sol L10-50](https://github.com/trustless-ai/agent-contracts-examples/blob/60855b200745d2f6dfd24b266f95ca92ce102ed2/recovery-receipt/contracts/src/MiniRecoveryEscrow.sol#L10-L50).

### TAS_SOURCE_GATE

Invalidate stale workflow source contexts before dispatch. **USEFUL_AFTER_FIRST_SLICE**.

- Inputs: Accepted workflow context and newly resolved context. Outputs: Approved dispatch context or fail-closed error.
- Trust root: Configured source resolver and accepted fingerprint. Authority: Revision rechecked during resolution; block-hash selectors checked for members.
- Boundary: Source check precedes dispatch but does not bind transaction to checked block.
- State: Gate revision, workflow manifest/fingerprint, chain and RPC. Time: Pinned snapshot is not execution-time state.
- Location/status: Offchain experimental feature branch; local Foundry-chain restriction; Default feature/tas-poc branch; experimental, not main.
- Does not establish: Atomic state use, general deployed safety or absence of downstream contract protections.
- Evidence: [trustless-ai/trustless-agent-substrate:src/core/workflow/sourceGate.ts L18-74](https://github.com/trustless-ai/trustless-agent-substrate/blob/a344ef80f7c52c03b9183814d1874b8054639c3e/src/core/workflow/sourceGate.ts#L18-L74); [trustless-ai/trustless-agent-substrate:src/core/workflow/operationService.ts L230-298](https://github.com/trustless-ai/trustless-agent-substrate/blob/a344ef80f7c52c03b9183814d1874b8054639c3e/src/core/workflow/operationService.ts#L230-L298); [trustless-ai/trustless-agent-substrate:src/clients/workflow/agentSdkClient.ts L202-236](https://github.com/trustless-ai/trustless-agent-substrate/blob/a344ef80f7c52c03b9183814d1874b8054639c3e/src/clients/workflow/agentSdkClient.ts#L202-L236).

### STATE_PROOF_VERIFIER

Verify account/storage proofs against selected state root. **USEFUL_AFTER_FIRST_SLICE**.

- Inputs: Account/storage proof, block and expected root. Outputs: Proof validity with trust tier.
- Trust root: Configured RPC header source; light-client source is stub. Authority: MPT validity relative to root, not independent consensus validation.
- Boundary: Proof correctness relative to root versus root authority and current state.
- State: Exact root/block and proof slots. Time: Historical/finalized selection; no consumer expiry.
- Location/status: Offchain proof verifier sketch; Present at inspected default branch; runtime/deployment status limited to cited evidence.
- Does not establish: Trusted consensus root, current action state, replay or execution.
- Evidence: [trustless-ai/verify-layer:verify.mjs L44-86](https://github.com/trustless-ai/verify-layer/blob/84afc4b738dc37269089c858404eed8086435f5d/verify.mjs#L44-L86); [trustless-ai/verify-layer:verify.mjs L90-142](https://github.com/trustless-ai/verify-layer/blob/84afc4b738dc37269089c858404eed8086435f5d/verify.mjs#L90-L142).

### RECEIPT_ROOT

Recompute canonical receipt payload commitment. **USEFUL_AFTER_FIRST_SLICE**.

- Inputs: Receipt payload and declared root. Outputs: Root comparison result.
- Trust root: Hash/canonicalization implementation. Authority: Integrity comparison, no signer authority.
- Boundary: Payload integrity is not truth or source authorization.
- State: Receipt payload. Time: No freshness consumer.
- Location/status: Offchain receipt verifier; Present at inspected default branch; runtime/deployment status limited to cited evidence.
- Does not establish: Source truth, authorization, current state or performed action.
- Evidence: [pipavlo82/crystal-receipt:src/receiptos/verify/verify-receipt.ts L1-35](https://github.com/pipavlo82/crystal-receipt/blob/45b46bf7df3a60b32583291f577a36bf19d22f00/src/receiptos/verify/verify-receipt.ts#L1-L35).

### CHRONICLE_ADMISSION

Recompute evidence before constructing history entry. **USEFUL_AFTER_FIRST_SLICE**.

- Inputs: Capsule/evidence/proof objects. Outputs: Checked Chronicle entry.
- Trust root: Pinned recomputation rules and supplied source objects. Authority: Root rederived rather than trusting supplied ok.
- Boundary: Verification-before-history is not authorization-before-action.
- State: Evidence/capsule/receipt identifiers and roots. Time: No live execution deadline.
- Location/status: Offchain synchronous entry builder; Present at inspected default branch; runtime/deployment status limited to cited evidence.
- Does not establish: Durable atomic append, current external authority or original protected event gating.
- Evidence: [pipavlo82/Chronicle:src/chronicle_receiptos_admission.mjs L31-41](https://github.com/pipavlo82/Chronicle/blob/c467b48fd18fc8ec86f10582befa35946ce41914/src/chronicle_receiptos_admission.mjs#L31-L41); [pipavlo82/Chronicle:src/chronicle_receiptos_admission.mjs L82-143](https://github.com/pipavlo82/Chronicle/blob/c467b48fd18fc8ec86f10582befa35946ce41914/src/chronicle_receiptos_admission.mjs#L82-L143); [pipavlo82/Chronicle:docs/verification-before-history.md L23-40](https://github.com/pipavlo82/Chronicle/blob/c467b48fd18fc8ec86f10582befa35946ce41914/docs/verification-before-history.md#L23-L40).

### RECEIPTOS_INGEST

Signed receipt admission with replay bookkeeping. **NOT_JUSTIFIED_YET**.

- Inputs: Receipt with ID/nonce and local seen state. Outputs: Appended receipt or duplicate refusal.
- Trust root: Configured demo signer secret and local files. Authority: Receipt verify then duplicate check then separate file writes.
- Boundary: Per-request replay check is not atomic replay consumption.
- State: JSON seen file and JSONL ledger. Time: No transactional freshness bound.
- Location/status: Offchain Flask demo, not independently deployed; Present at inspected default branch; runtime/deployment status limited to cited evidence.
- Does not establish: Concurrent/crash-safe replay exclusion, current external authority or trading execution.
- Evidence: [pipavlo82/receiptos-mvp:src/api.py L18-27](https://github.com/pipavlo82/receiptos-mvp/blob/0e70ebe85f4dd1b8b2a24be9c29f1b9757e25a71/src/api.py#L18-L27); [pipavlo82/receiptos-mvp:src/api.py L58-76](https://github.com/pipavlo82/receiptos-mvp/blob/0e70ebe85f4dd1b8b2a24be9c29f1b9757e25a71/src/api.py#L58-L76).

### RVR_PROFILE_RECEIPT

Portable profile/evidence/result recomputation identity. **INDEPENDENT_VERIFICATION_ONLY**.

- Inputs: Pinned verification profile, evidence and claimed outcome/reason. Outputs: Semantic outcome plus reproduced/diverged/cannot_recompute.
- Trust root: Closed verification profile and externally named evidence authority. Authority: Recompute result identity; unavailable is separate from refuted.
- Boundary: Semantic outcome versus recomputation outcome.
- State: Profile/evidence/result commitments. Time: Time only if profile defines and binds it.
- Location/status: Offchain experimental specification/adapter; Present at inspected default branch; runtime/deployment status limited to cited evidence.
- Does not establish: Settlement authority, freshness, independent source truth or onchain execution.
- Evidence: [pipavlo82/recomputable-verification-receipts:docs/spec/RECOMPUTABLE_VERIFICATION_RECEIPTS_V0.md L3-79](https://github.com/pipavlo82/recomputable-verification-receipts/blob/287c0ea1c2578c1833405bc2476975f95addbada/docs/spec/RECOMPUTABLE_VERIFICATION_RECEIPTS_V0.md#L3-L79).

### PQ_TEMPORAL_AUTHORITY

Commit every outcome-affecting authority boundary. **USEFUL_AFTER_FIRST_SLICE**.

- Inputs: Acceptance chain, owner transition authorization, anchored head and manifests. Outputs: Derived authority window under proposed settled construction.
- Trust root: Owner authorization and independently resolved anchors. Authority: Design-frozen temporal authority specification; live implementation not verified.
- Boundary: Committed temporal authority versus uncommitted local temporal labels.
- State: Ordered acceptance chain, complete manifests and predecessors. Time: Externally anchored temporal activation, not mutable local submitted_at.
- Location/status: Specification and upstream historical report; Present at inspected default branch; runtime/deployment status limited to cited evidence.
- Does not establish: PQ necessity for SEG, deployed compliance or generic stop-trading enforcement.
- Evidence: [trustless-ai/pq-agent-binding:spec/v1-temporal-authority.md L1-62](https://github.com/trustless-ai/pq-agent-binding/blob/4f934ad31e96979002d818cd8a5f12909c1b6713/spec/v1-temporal-authority.md#L1-L62); [trustless-ai/pq-agent-binding:spec/v1-temporal-authority.md L345-387](https://github.com/trustless-ai/pq-agent-binding/blob/4f934ad31e96979002d818cd8a5f12909c1b6713/spec/v1-temporal-authority.md#L345-L387).

### CRC_WATCHER

Poll and validate observation registry updates. **NOT_JUSTIFIED_YET**.

- Inputs: Ledger intake and registry tree. Outputs: Validated registry commit or unverifiable intake summary.
- Trust root: Ledger resolution and validation rules. Authority: CI gates publication of observations, not financial actions.
- Boundary: Monitoring truth is not synchronous event authorization.
- State: Fetched ledger and checked tree. Time: Cron every 30 minutes nominal; failures/delays unbounded.
- Location/status: Offchain GitHub workflow; Present at inspected default branch; runtime/deployment status limited to cited evidence.
- Does not establish: Every-event safety, atomic action gating or an actual 30-minute maximum exposure.
- Evidence: [trustless-ai/cross-reference-console:.github/workflows/watcher.yml L1-84](https://github.com/trustless-ai/cross-reference-console/blob/268c77b795aef5f13b018e76e4f7d9307a81b395/.github/workflows/watcher.yml#L1-L84).

### RESCUE_FIXED_DESTINATION

Fixed-destination atomic asset rescue. **NOT_JUSTIFIED_YET**.

- Inputs: Token and token IDs. Outputs: Transfers from delegated account to immutable SAFE.
- Trust root: Immutable destination and token transfer semantics. Authority: No caller-selectable recipient.
- Boundary: Destination cannot be substituted; unrelated to price evidence.
- State: Current token ownership and fixed destination. Time: No generic expiry.
- Location/status: Onchain source, deployment not checked; Present at inspected default branch; runtime/deployment status limited to cited evidence.
- Does not establish: Stock-token semantic conversion, evidence authenticity or generalized permissions.
- Evidence: [trustless-ai/eip7702-rescue:contracts/RescueDelegate.sol L18-36](https://github.com/trustless-ai/eip7702-rescue/blob/31133de1ca5428947580f53a486d97aae461e33e/contracts/RescueDelegate.sol#L18-L36).

## 3. Enforcement-cadence matrix

Flags describe the exact primitive scope in binding_scope, NOT a universal security guarantee. A fixture commitment or signed read can be state_bound without proving current state. null means insufficient evidence/not instantiated. **EVENT_ATOMIC never follows merely from a checker existing.** A pure reference run is CONFORMANCE_ONLY; post-event evidence verification is AUDIT_ONLY; a per-request observer is not an authorization gate.

| Primitive/predicate | Repo/SHA | Protected event | Mode | State bound? | Action bound? | Freshness bound? | Replay bound? | Exposure window | Finding |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SEG_RELATION | pipavlo82/semantic-execution-guard@8c786d8134632cdb4892ed32051377e739495300 | Future protected action; presently only receipt generation | AUDIT_ONLY | yes (scoped) | no | no | no | UNBOUNDED / UNKNOWN if a stored PASS is accepted later; supplied effective interval is not enforced against execution time. | STRUCTURAL_RISK |
| SABI_LINKER | trustless-ai/semantic-abi@d15c666dfccff17f7350fe97d2fc7b71cb2cbaee | Semantic link decision, not an irreversible action | CONFORMANCE_ONLY | yes (scoped) | no | no | no | Not a live gate; promoting a past link result to execution would leave UNBOUNDED / UNKNOWN exposure. | OUT_OF_SCOPE |
| RSI_DISCRIMINATION | pipavlo82/relational-security-invariants@e8fb81904af2ffe19e974383cf78d9d18d259b98 | Conformance run | CONFORMANCE_ONLY | yes (scoped) | no | no | no | No live action gate; exposure not bounded by test cadence. | OUT_OF_SCOPE |
| PRF_AXES | pipavlo82/protected-relation-fixtures@07075d874c75da43f5ac8ed8769d5dbc01d56427 | Fixture evaluation | CONFORMANCE_ONLY | yes (scoped) | no | no | no | No authorization path; not an event-time mitigation. | OUT_OF_SCOPE |
| RK_PROFILE_BINDING | trustless-ai/recompute-kit@f5a25bd6bbf555c710d63915d4e5092548e3702c | Reference verdict acceptance | CONFORMANCE_ONLY | yes (scoped) | no | no | no | From actual policy change until consumer revalidation; UNBOUNDED / UNKNOWN. | STRUCTURAL_RISK |
| RK_CAPTURED_ADMISSION | trustless-ai/recompute-kit@f5a25bd6bbf555c710d63915d4e5092548e3702c | Modeled admission/write | CONFORMANCE_ONLY | yes (scoped) | yes (scoped) | yes (scoped) | no | Concurrent write or later state change until actual atomic lookup-or-create; UNBOUNDED / UNKNOWN in an unwired consumer. | STRUCTURAL_RISK |
| RK_STANDING_TERMINALITY | trustless-ai/recompute-kit@f5a25bd6bbf555c710d63915d4e5092548e3702c | Proposed key bind in fixture | CONFORMANCE_ONLY | yes (scoped) | yes (scoped) | yes (scoped) | no | Terminal state becomes effective -> next actual enforced bind gate; absent wiring UNBOUNDED / UNKNOWN. | STRUCTURAL_RISK |
| RK_CUTOFF | trustless-ai/recompute-kit@f5a25bd6bbf555c710d63915d4e5092548e3702c | Modeled artifact admission | CONFORMANCE_ONLY | yes (scoped) | yes (scoped) | yes (scoped) | no | From authority invalidation until consumer resolves new chain; UNBOUNDED / UNKNOWN for actual deployment. | STRUCTURAL_RISK |
| RK_PREDICATE_PRECOMMIT | trustless-ai/recompute-kit@f5a25bd6bbf555c710d63915d4e5092548e3702c | Conformance run | CONFORMANCE_ONLY | yes (scoped) | yes (scoped) | no | no | No live authorization; not an exposure limiter. | OUT_OF_SCOPE |
| TSEI_AUTHORITY_SCAFFOLD | pipavlo82/crystal-receipt@45b46bf7df3a60b32583291f577a36bf19d22f00 | Independent grounding run | CONFORMANCE_ONLY | yes (scoped) | yes (scoped) | UNKNOWN | no | Not live admission; production exposure UNKNOWN. | OUT_OF_SCOPE |
| CCIP_TSEI_OBSERVATIONS | trustless-ai/ccip-router@d6f5c96d31490213e932eb63c83b9989b2073900 | Observation/read API | AUDIT_ONLY | yes (scoped) | no | no | no | Conflicting/new observation until next read/sync; UNBOUNDED / UNKNOWN. | STRUCTURAL_RISK |
| CCIP_BINDING_OBSERVER | trustless-ai/ccip-router@d6f5c96d31490213e932eb63c83b9989b2073900 | HTTP ownership observation | AUDIT_ONLY | no | no | no | no | Between independent owner/account reads and any later use; UNBOUNDED / UNKNOWN. | STRUCTURAL_RISK |
| CCIP_EXPIRING_RESPONSE | trustless-ai/ccip-router@d6f5c96d31490213e932eb63c83b9989b2073900 | Specific CCIP read response | EVENT_BOUND | yes (scoped) | yes (scoped) | yes (scoped) | no | For mutable external truth: state change -> expiry or earlier signer revocation; bound duration depends on supplied expiry, not numerically fixed. | STRUCTURAL_RISK |
| CCIP_PEER_SYNC | trustless-ai/ccip-router@d6f5c96d31490213e932eb63c83b9989b2073900 | Peer sync, not protected action | PERIODIC_ONLY | no | no | no | no | New peer fact -> successful sync; UNBOUNDED / UNKNOWN on failure; no fixed duration established. | STRUCTURAL_RISK |
| CCIP_COMMIT_REVEAL | trustless-ai/ccip-router@d6f5c96d31490213e932eb63c83b9989b2073900 | Reveal state transition only | EVENT_ATOMIC | yes (scoped) | yes (scoped) | yes (scoped) | yes (scoped) | No inter-transaction check/use window for this local reveal transition. | SAFE_BY_CONSTRUCTION |
| CAPV_CONSUME | trustless-ai/agent-sdk@e41b117893fb56bc869922de378daf91aad63def | Nullifier consumption, NOT the protected target action | EVENT_ATOMIC | yes (scoped) | yes (scoped) | yes (scoped) | yes (scoped) | Nullifier burn itself atomic; if verify/consume/action are separate, state change -> later action is UNBOUNDED / UNKNOWN. | STRUCTURAL_RISK |
| ACTION_COMMITMENT | trustless-ai/agent-ercs@01283ca57305f915afb560d23359a27fd748eb5a | No event consumer shown by helper | UNKNOWN | no | yes (scoped) | no | yes (scoped) | UNKNOWN until wired to an atomic consumer. | OUT_OF_SCOPE |
| CONSULT_ESCROW | trustless-ai/agent-ercs@01283ca57305f915afb560d23359a27fd748eb5a | Job release/payment | EVENT_ATOMIC | yes (scoped) | yes (scoped) | no | yes (scoped) | Release is atomic locally; matching signatures can outlive refund deadline until job is refunded. Cross-deployment domain scope is not bound. | STRUCTURAL_RISK |
| RECOVERY_ESCROW | trustless-ai/agent-contracts-examples@60855b200745d2f6dfd24b266f95ca92ce102ed2 | Recovery reward release | EVENT_ATOMIC | yes (scoped) | yes (scoped) | no | yes (scoped) | No inter-transaction check/use gap in the inspected reward path, under the pinned verifier/token semantics. | SAFE_BY_CONSTRUCTION |
| TAS_SOURCE_GATE | trustless-ai/trustless-agent-substrate@a344ef80f7c52c03b9183814d1874b8054639c3e | SDK dispatch after source validation | EVENT_CHECKED_NONATOMIC | yes (scoped) | no | no | no | Successful sourceGate return -> awaited wallet/address work -> transaction execution; UNBOUNDED / UNKNOWN. | STRUCTURAL_RISK |
| STATE_PROOF_VERIFIER | trustless-ai/verify-layer@84afc4b738dc37269089c858404eed8086435f5d | Offline/on-demand proof verification | AUDIT_ONLY | yes (scoped) | no | no | no | Verified block -> later protected event; UNBOUNDED / UNKNOWN without consumer freshness/state rule. | STRUCTURAL_RISK |
| RECEIPT_ROOT | pipavlo82/crystal-receipt@45b46bf7df3a60b32583291f577a36bf19d22f00 | Receipt audit | AUDIT_ONLY | yes (scoped) | no | no | no | Post-event audit; cannot limit an authorization exposure window. | OUT_OF_SCOPE |
| CHRONICLE_ADMISSION | pipavlo82/Chronicle@c467b48fd18fc8ec86f10582befa35946ce41914 | History entry construction after execution | AUDIT_ONLY | yes (scoped) | yes (scoped) | no | no | History admission only; no bound on original action exposure. | OUT_OF_SCOPE |
| RECEIPTOS_INGEST | pipavlo82/receiptos-mvp@0e70ebe85f4dd1b8b2a24be9c29f1b9757e25a71 | Local API receipt append | EVENT_CHECKED_NONATOMIC | yes (scoped) | yes (scoped) | no | no | Seen check -> ledger append -> separate seen save; concurrent/crash window UNKNOWN; crash can leave stale replay state indefinitely. | STRUCTURAL_RISK |
| RVR_PROFILE_RECEIPT | pipavlo82/recomputable-verification-receipts@287c0ea1c2578c1833405bc2476975f95addbada | Independent verification receipt | AUDIT_ONLY | yes (scoped) | no | no | no | Audit only; no synchronous protected action gate. | OUT_OF_SCOPE |
| PQ_TEMPORAL_AUTHORITY | trustless-ai/pq-agent-binding@4f934ad31e96979002d818cd8a5f12909c1b6713 | Key authority resolution; runtime wiring UNKNOWN | UNKNOWN | yes (scoped) | UNKNOWN | yes (scoped) | UNKNOWN | Legacy mutable boundary / skipped intermediate rotation until resolvable anchors; deployment window UNKNOWN here. Reported 1435 seconds is upstream historical evidence, not fresh measurement. | STRUCTURAL_RISK |
| CRC_WATCHER | trustless-ai/cross-reference-console@268c77b795aef5f13b018e76e4f7d9307a81b395 | Registry intake/publication; not trading close | PERIODIC_ONLY | yes (scoped) | no | no | no | Fact change -> next successful fetch/check/publication; nominal <=30 minutes only under ideal scheduling; no finite worst-case bound. | STRUCTURAL_RISK |
| RESCUE_FIXED_DESTINATION | trustless-ai/eip7702-rescue@31133de1ca5428947580f53a486d97aae461e33e | Rescue transfers in one transaction | EVENT_ATOMIC | yes (scoped) | yes (scoped) | no | no | No inter-transaction check/use gap within this scoped transfer loop; not a generic price gate. | SAFE_BY_CONSTRUCTION |

Starts at first outcome-affecting state/event making predicate false; ends only at enforced recheck, consumer rejection, expiry or resolution. Offline/periodic results do not bound action authorization absent consumer wiring. No numeric duration is invented. CRC's nominal 30-minute schedule is not a worst-case guarantee; mesh cadence is configurable. The user's roughly three-hour / 13-close incident is motivation supplied by the user, not an independently audited incident in these repositories.

## 4. TOCTOU findings

### F1_UNTRUSTED_PASS — STRUCTURAL_RISK

The formatter accepts a changed numeric value in caller-controlled PASS receipt data and the schema accepts it. Intentional unauthenticated handoff, not an exploit of an absent guard.

- Checked state: Caller-supplied quote/multiplier/context.
- Result binding: SHA-256 input/context, but formatter does not recompute or authenticate them. Consumer: No execution consumer exists in frozen branch.
- Inputs that may change: Source facts, current effective state, policy and action are not authoritative here.
- Replay/expiry/atomicity: No action/nonce/guard domain/expiry consumption.
- Exact evidence: [pipavlo82/semantic-execution-guard:relations/robinhood-stock-token-v0/recompute.mjs L23-98](https://github.com/pipavlo82/semantic-execution-guard/blob/8c786d8134632cdb4892ed32051377e739495300/relations/robinhood-stock-token-v0/recompute.mjs#L23-L98); [pipavlo82/semantic-execution-guard:relations/robinhood-stock-token-v0/relation.schema.json L1-24](https://github.com/pipavlo82/semantic-execution-guard/blob/8c786d8134632cdb4892ed32051377e739495300/relations/robinhood-stock-token-v0/relation.schema.json#L1-L24); [pipavlo82/semantic-execution-guard:docs/guard-result.schema.json L1-26](https://github.com/pipavlo82/semantic-execution-guard/blob/8c786d8134632cdb4892ed32051377e739495300/docs/guard-result.schema.json#L1-L26); [pipavlo82/semantic-execution-guard:docs/fede-handoff.md L15-38](https://github.com/pipavlo82/semantic-execution-guard/blob/8c786d8134632cdb4892ed32051377e739495300/docs/fede-handoff.md#L15-L38); [pipavlo82/semantic-execution-guard:docs/architecture.md L7-30](https://github.com/pipavlo82/semantic-execution-guard/blob/8c786d8134632cdb4892ed32051377e739495300/docs/architecture.md#L7-L30).

### F2_ASYNC_CHECK_USE — STRUCTURAL_RISK

A valid per-operation source check or mixed-block ownership observation does not establish the state consumed by a later transaction.

- Checked state: TAS source revision/block selector; CCIP independently fetched current owners.
- Result binding: TAS checked snapshot not passed to transaction invocation; CCIP no shared block pin. Consumer: Inspected client adapter/RPC route, downstream contract safety not established.
- Inputs that may change: Chain state and accepted workflow can change after source gate or between RPC calls.
- Replay/expiry/atomicity: No exact execution permit at this boundary.
- Exact evidence: [trustless-ai/trustless-agent-substrate:src/core/workflow/sourceGate.ts L18-74](https://github.com/trustless-ai/trustless-agent-substrate/blob/a344ef80f7c52c03b9183814d1874b8054639c3e/src/core/workflow/sourceGate.ts#L18-L74); [trustless-ai/trustless-agent-substrate:src/core/workflow/operationService.ts L230-298](https://github.com/trustless-ai/trustless-agent-substrate/blob/a344ef80f7c52c03b9183814d1874b8054639c3e/src/core/workflow/operationService.ts#L230-L298); [trustless-ai/trustless-agent-substrate:src/clients/workflow/agentSdkClient.ts L202-236](https://github.com/trustless-ai/trustless-agent-substrate/blob/a344ef80f7c52c03b9183814d1874b8054639c3e/src/clients/workflow/agentSdkClient.ts#L202-L236); [trustless-ai/ccip-router:src/verify/binding.ts L38-95](https://github.com/trustless-ai/ccip-router/blob/d6f5c96d31490213e932eb63c83b9989b2073900/src/verify/binding.ts#L38-L95).

### F3_CONSUME_IS_NOT_EXECUTE — STRUCTURAL_RISK

CAPV atomically burns a nullifier against advertised actionCommitment; it has no target call. A separate verify/consume/action integration would still need atomic composition.

- Checked state: Current policy registry and nullifier state.
- Result binding: Typed verdict plus domain and action commitment. Consumer: Mock consume function.
- Inputs that may change: Root/authority/action environment may change before a separately executed action.
- Replay/expiry/atomicity: Local nullifier enforced; actual action binding must be rederived by wrapper.
- Exact evidence: [trustless-ai/agent-sdk:testkit/contracts/mocks/verify/ERC8354/ConfidentialPolicyVerdict.sol L18-54](https://github.com/trustless-ai/agent-sdk/blob/e41b117893fb56bc869922de378daf91aad63def/testkit/contracts/mocks/verify/ERC8354/ConfidentialPolicyVerdict.sol#L18-L54); [trustless-ai/agent-sdk:testkit/contracts/mocks/verify/ERC8354/ConfidentialPolicyVerdict.sol L57-138](https://github.com/trustless-ai/agent-sdk/blob/e41b117893fb56bc869922de378daf91aad63def/testkit/contracts/mocks/verify/ERC8354/ConfidentialPolicyVerdict.sol#L57-L138); [trustless-ai/agent-ercs:contracts/verify/ERC8354/PolicyAction.sol L1-29](https://github.com/trustless-ai/agent-ercs/blob/01283ca57305f915afb560d23359a27fd748eb5a/contracts/verify/ERC8354/PolicyAction.sol#L1-L29).

### F4_PERIODIC_OR_REFERENCE_ONLY — STRUCTURAL_RISK

Standing-constraint specifications, duplicate detectors and periodic watchers cannot be promoted to every-event enforcement without a consumer.

- Checked state: Fixture history or last fetched snapshot.
- Result binding: Profile/receipt/predicate varies; no financial action consumed. Consumer: Conformance runner or scheduled observation publisher.
- Inputs that may change: Authority, safety threshold or current state changes between runs.
- Replay/expiry/atomicity: No live action nonce tied to checks.
- Exact evidence: [trustless-ai/recompute-kit:conformance/pq-recovery-classes-v0/README.md L42-82](https://github.com/trustless-ai/recompute-kit/blob/f5a25bd6bbf555c710d63915d4e5092548e3702c/conformance/pq-recovery-classes-v0/README.md#L42-L82); [trustless-ai/recompute-kit:conformance/pq-recovery-classes-v0/recovery_check.py L36-119](https://github.com/trustless-ai/recompute-kit/blob/f5a25bd6bbf555c710d63915d4e5092548e3702c/conformance/pq-recovery-classes-v0/recovery_check.py#L36-L119); [trustless-ai/recompute-kit:conformance/captured-admission-v0/README.md L27-59](https://github.com/trustless-ai/recompute-kit/blob/f5a25bd6bbf555c710d63915d4e5092548e3702c/conformance/captured-admission-v0/README.md#L27-L59); [trustless-ai/recompute-kit:conformance/captured-admission-v0/README.md L97-126](https://github.com/trustless-ai/recompute-kit/blob/f5a25bd6bbf555c710d63915d4e5092548e3702c/conformance/captured-admission-v0/README.md#L97-L126); [trustless-ai/cross-reference-console:.github/workflows/watcher.yml L1-84](https://github.com/trustless-ai/cross-reference-console/blob/268c77b795aef5f13b018e76e4f7d9307a81b395/.github/workflows/watcher.yml#L1-L84); [trustless-ai/ccip-router:src/mesh/cron.ts L1-28](https://github.com/trustless-ai/ccip-router/blob/d6f5c96d31490213e932eb63c83b9989b2073900/src/mesh/cron.ts#L1-L28).

### F5_RECEIPT_INGEST_RACE — STRUCTURAL_RISK

Per-request receipt verification and seen-file checking precede separate append/save operations. Concurrent requests or a crash can separate check from replay-state consumption.

- Checked state: Local seen.json snapshot.
- Result binding: Receipt ID/nonce validated but storage update nontransactional. Consumer: Local Flask ingest route.
- Inputs that may change: Another request or process crash.
- Replay/expiry/atomicity: No lock/transaction in inspected route; no production reachability claim.
- Exact evidence: [pipavlo82/receiptos-mvp:src/api.py L18-27](https://github.com/pipavlo82/receiptos-mvp/blob/0e70ebe85f4dd1b8b2a24be9c29f1b9757e25a71/src/api.py#L18-L27); [pipavlo82/receiptos-mvp:src/api.py L58-76](https://github.com/pipavlo82/receiptos-mvp/blob/0e70ebe85f4dd1b8b2a24be9c29f1b9757e25a71/src/api.py#L58-L76).

### F6_TEMPORAL_AUTHORITY_COMPLETENESS — STRUCTURAL_RISK

Upstream v0 documents verdict-bearing local time outside commitments and skipped between-batch bindings. The transferable lesson is complete, immutable temporal authority; no PQ integration is required.

- Checked state: Supplied/anchored binding history and temporal boundary.
- Result binding: Settled proposal binds acceptance order/coverage; reference cutoff assumes supplied resolved chain. Consumer: Live gateway source unavailable; deployed compliance UNKNOWN.
- Inputs that may change: Local boundary, missing intermediate transition or unavailable predecessor.
- Replay/expiry/atomicity: Historical governance differs from permission to execute now.
- Exact evidence: [trustless-ai/pq-agent-binding:spec/v1-temporal-authority.md L1-62](https://github.com/trustless-ai/pq-agent-binding/blob/4f934ad31e96979002d818cd8a5f12909c1b6713/spec/v1-temporal-authority.md#L1-L62); [trustless-ai/pq-agent-binding:spec/v1-temporal-authority.md L345-387](https://github.com/trustless-ai/pq-agent-binding/blob/4f934ad31e96979002d818cd8a5f12909c1b6713/spec/v1-temporal-authority.md#L345-L387); [trustless-ai/recompute-kit:conformance/pq-key-binding-v1/cutoff_enforce.py L2-35](https://github.com/trustless-ai/recompute-kit/blob/f5a25bd6bbf555c710d63915d4e5092548e3702c/conformance/pq-key-binding-v1/cutoff_enforce.py#L2-L35); [trustless-ai/recompute-kit:conformance/pq-key-binding-v1/cutoff_enforce.py L62-177](https://github.com/trustless-ai/recompute-kit/blob/f5a25bd6bbf555c710d63915d4e5092548e3702c/conformance/pq-key-binding-v1/cutoff_enforce.py#L62-L177).

### F7_READ_SIGNATURE_SCOPE — STRUCTURAL_RISK

Expiry, signature and one-time local storage are different protections. The read callback has expiry and address/request binding but no chain or single-use action domain; ConsultEscrow has local phase replay control but no release expiry/domain in the signature.

- Checked state: Current signers or local job phase.
- Result binding: Read extraData/result or job/result only. Consumer: Read callback or scoped job release.
- Inputs that may change: External truth may change within signed lifetime; matching jobs/domains need separate review.
- Replay/expiry/atomicity: Intentional read replay until expiry; local job phase does not prevent cross-deployment reinterpretation.
- Exact evidence: [trustless-ai/ccip-router:contracts/OffchainResolver.sol L83-142](https://github.com/trustless-ai/ccip-router/blob/d6f5c96d31490213e932eb63c83b9989b2073900/contracts/OffchainResolver.sol#L83-L142); [trustless-ai/agent-ercs:contracts/settlement/ConsultEscrow/ConsultEscrow.sol L21-55](https://github.com/trustless-ai/agent-ercs/blob/01283ca57305f915afb560d23359a27fd748eb5a/contracts/settlement/ConsultEscrow/ConsultEscrow.sol#L21-L55).

### F8_ATOMIC_PATTERNS — SAFE_BY_CONSTRUCTION

These sources demonstrate scoped same-transaction checks and state transitions. This is useful design evidence, not proof that SEG already has an atomic guard.

- Checked state: Local commit/job/ownership and immutable destination.
- Result binding: Inputs consumed by the same call. Consumer: Scoped source contracts only.
- Inputs that may change: Pinned dependency semantics remain assumptions.
- Replay/expiry/atomicity: As described per primitive; no generic authorization claim.
- Exact evidence: [trustless-ai/ccip-router:contracts/GenericCommitRevealSettler.sol L79-145](https://github.com/trustless-ai/ccip-router/blob/d6f5c96d31490213e932eb63c83b9989b2073900/contracts/GenericCommitRevealSettler.sol#L79-L145); [trustless-ai/agent-contracts-examples:recovery-receipt/contracts/src/MiniRecoveryEscrow.sol L10-50](https://github.com/trustless-ai/agent-contracts-examples/blob/60855b200745d2f6dfd24b266f95ca92ce102ed2/recovery-receipt/contracts/src/MiniRecoveryEscrow.sol#L10-L50); [trustless-ai/eip7702-rescue:contracts/RescueDelegate.sol L18-36](https://github.com/trustless-ai/eip7702-rescue/blob/31133de1ca5428947580f53a486d97aae461e33e/contracts/RescueDelegate.sol#L18-L36).

Every event-checked route above identifies state, binding, consumer, mutable inputs, replay scope and atomicity. No live reachable capital-loss path was demonstrated. The formatter experiment established a documented unauthenticated boundary, not a new vulnerability: replacing control value 1543125 with 999999 produced schema_errors=[] and guard_execution=NOT_PRESENT, with zero network calls and no file edits.

The highest-priority future test is **PASS at state S0 -> multiplier/policy/authority changes to S1 -> submission of the old permit**. Reject at actual consumption even before expiry. If no authoritative event-visible state/version exists, the stronger current-state claim is blocked; a short-lived attestation only limits age. Also test timestamp-only effective transitions and A -> B -> A identity changes.

## 5. Current PR #1 trust seam

Frozen `docs/fede-handoff.md`, `docs/guard-result.schema.json`, `docs/architecture.md` and the complete relation directory remain unchanged. Existing context and evidence digests commit supplied data, while the temporal predicate compares supplied state and intervals. The formatter is deliberately not a verifier. A consumer cannot trust arbitrary JSON with relation_status=PASS, and source_surface/authority_class strings are declarations, not credentials.

[pipavlo82/semantic-execution-guard:relations/robinhood-stock-token-v0/recompute.mjs L23-98](https://github.com/pipavlo82/semantic-execution-guard/blob/8c786d8134632cdb4892ed32051377e739495300/relations/robinhood-stock-token-v0/recompute.mjs#L23-L98); [pipavlo82/semantic-execution-guard:relations/robinhood-stock-token-v0/relation.schema.json L1-24](https://github.com/pipavlo82/semantic-execution-guard/blob/8c786d8134632cdb4892ed32051377e739495300/relations/robinhood-stock-token-v0/relation.schema.json#L1-L24); [pipavlo82/semantic-execution-guard:docs/guard-result.schema.json L1-26](https://github.com/pipavlo82/semantic-execution-guard/blob/8c786d8134632cdb4892ed32051377e739495300/docs/guard-result.schema.json#L1-L26); [pipavlo82/semantic-execution-guard:docs/fede-handoff.md L15-38](https://github.com/pipavlo82/semantic-execution-guard/blob/8c786d8134632cdb4892ed32051377e739495300/docs/fede-handoff.md#L15-L38); [pipavlo82/semantic-execution-guard:docs/architecture.md L7-30](https://github.com/pipavlo82/semantic-execution-guard/blob/8c786d8134632cdb4892ed32051377e739495300/docs/architecture.md#L7-L30).

| Field/group | Need | Reason and enforcement |
| --- | --- | --- |
| Profile + implementation identity | REQUIRED | Bind immutable relation/version and normalization/rounding policy digest. Text profile ID alone cannot identify changed code. Guard allowlist/config must match at consumption. |
| Evidence + context digests | REQUIRED | Bind exact canonical input and externally justified context, including source identity and effective state. Existing 0x SHA-256 fields identify bytes; they do not authenticate them. One commitment can cover both if its preimage/domain are fixed. |
| Asset / chain / contract / claim / currency / side / adjusted mantissa + scale | REQUIRED | These change the meaning or economic effect. Full identity tuple must match guard policy and actual target asset. Stock-token address is distinct from guard and action target. |
| Quote time + multiplier effective version | REQUIRED | Consumer enforces accepted age/validity policy and active state at event time. Signed version alone does not prove latest; value-only comparison misses A -> B -> A transitions. Include effective schedule semantics if outcome changes solely with time. |
| Action target / value / calldata / recipient / amount / limits | REQUIRED | Commit all outcome-affecting action fields; consumer rehashes actual call. Economic fields inside calldata need not be duplicated flat. Permit no alternate unguarded entry to the same protected transition. |
| Executor | CONDITIONAL | Bind intended executor if rights or economic result depend on it. Otherwise allow relayers explicitly while binding beneficiary and action; msg.sender may be a relayer, not the beneficiary. |
| Nonce / replay domain | REQUIRED | One-use action ID scoped to authorization domain, checked and written atomically with execution. Recording a nonce or emitting an event does not consume it. |
| Expiry / not-before / freshness rule | REQUIRED | Check at consumption, not only record. Exact boundary inequality, clock, max age and future-time handling are policy decisions still open. Expiry bounds age, not intervening state transitions. |
| Guard / deployment / chain domain | REQUIRED | Bind chain ID and consuming contract, plus version/epoch where address reuse or upgrades change semantics. EIP-712 is one possible encoding, not an imposed implementation. |
| Block hash / number / state root | CONDITIONAL | Required when input authority is a chain snapshot: pin chain, block hash/root, finality policy and relevant state. Number alone is not reorg-stable. A historical proof still needs a current-state rule; no universal demand for a separate block field for non-chain sources. |

The minimum seam is an agreed trusted producer or in-contract verifier, immutable profile/implementation identity, authenticated full semantic result and action digest, authoritative event-state validation, plus atomic one-use consumption and action. No signature scheme, contract rewrite or flat all-fields ABI is imposed. SHA-256 and keccak256 are not interchangeable; canonical encoding and hash domain must be explicit.

## 6. Minimal first-slice composition

`external quote + multiplier evidence -> trusted normalization/context -> frozen semantic relation -> authenticated event/action authorization -> atomic guard -> protected action`

`independent recomputation / mutation / conformance / post-event receipts` remain outside that authorization path unless a later demonstrated requirement makes them synchronous.

### R1_TYPED_RELATION

**REQUIRED_FOR_FIRST_SLICE** — SEG_RELATION; pre-existing Semantic ABI concepts.

Without this primitive, a raw equity quote, including multiplier=1 numeric coincidence, can be promoted to an adjusted token-price claim without conversion.

Retain the exact frozen relation as the semantic reference. Its input schema explicitly requires SYNTHETIC_RELATION_FIXTURE: live evidence needs a separately reviewed adapter/profile boundary preserving identity, scale and explicit conversion, not falsely relabeling live data as synthetic. Leave PR #1 intact. Do not run a second generic linker merely to restate the same boundary.

### R2_TRUSTED_EVIDENCE_CONTEXT

**REQUIRED_FOR_FIRST_SLICE** — New narrow integration seam; no existing source resolver proven sufficient.

Without this primitive, caller-supplied quote, multiplier and mutually consistent context can manufacture PASS with no authority for those inputs.

Choose one explicit trust root for each quote and effective multiplier source. A constrained attestor may authenticate captured responses under a declared trust model; it is not an independently verified oracle. Guard policy fixes permitted source/asset/profile and who may authorize. Unknown source or unavailable current state blocks the action.

### R3_EVENT_DOMAIN_AUTHORIZATION

**REQUIRED_FOR_FIRST_SLICE** — Action-commitment and CAPV patterns; no whole SDK dependency required.

Without this primitive, a valid result can authorize a different target, asset, recipient, amount, chain, consumer, policy or executor than the one checked, or be replayed.

Authenticate an immutable profile/implementation-bound semantic result and exact action commitment in a chain/guard/deployment domain. Consumer derives the action hash from the call it will actually execute; enforce signer/actor rights and a single-use nonce. A proof route or direct trusted in-contract evaluation may replace an attestor, but a JSON PASS never does.

### R4_ATOMIC_CURRENT_STATE_USE

**REQUIRED_FOR_FIRST_SLICE** — Scoped atomic settlement patterns; Fede owns the actual guard.

Without this primitive, an authentic earlier PASS remains usable after an outcome-affecting multiplier, policy, authority or safety-state change; separate consumption can succeed without the action.

In the same reverting transaction, check the active policy/source authority and event-relevant state/version and effective-time rule, enforce expiry, mark the nonce consumed, and execute the protected action. Prevent callbacks/reentrancy from invalidating checked assumptions. Revert rolls back consumption and action together. Freshness alone is not current-state identity.

These four properties do not imply four new libraries. One narrow attestor/adapter and one guard can implement the missing seam. The simplest defensible demo uses a declared trusted attestor plus an event-visible authoritative state/version condition. If Robinhood supplies no usable state condition, demonstrate only the explicitly bounded attestor snapshot or a labeled test asset; do not claim latest-state safety for a real Stock Token.

A 2–3 minute demo explains V2's numerically equal but wrongly typed quote, shows rejection/no protected action, then explicit conversion and a permitted control action. Add one stale-permit-after-state-change rejection to make event-time safety visible. These are future acceptance targets, not observed results.

## 7. Deferred primitives and exact reason

| Candidate | Role | Distinct reason |
| --- | --- | --- |
| Generic Semantic ABI linker | USEFUL_AFTER_FIRST_SLICE | SEG already embodies the required typed conversion; a second linker adds no distinct first-slice runtime protection. |
| RSI, PRF, predicate precommit, TSEI oracle scaffold, RVR | INDEPENDENT_VERIFICATION_ONLY | Strengthen falsifiability/independent evidence; cannot authenticate current multiplier or gate execution merely by producing audit output. |
| recompute-kit policy/history/recovery/cutoff profiles | USEFUL_AFTER_FIRST_SLICE | Borrow temporal/profile/fail-closed lessons; importing conformance runners does not wire a live consumer. Full PQ recovery adds no price-specific protection. |
| CAPV, PolicyAction, MiniRecoveryEscrow | USEFUL_AFTER_FIRST_SLICE | Reference patterns for the required seam; whole confidential-policy stack, agent identity and recovery workflow are unnecessary for one action. |
| TAS, verify-layer, ReceiptOS roots, Chronicle | USEFUL_AFTER_FIRST_SLICE | Workflow UX, verified historical state and portable audit history add value after the narrow trusted source/guard seam exists. |
| CCIP mesh, TSEI observation transport, binding observer, CRC | NOT_JUSTIFIED_YET | Replication/observation/divergence does not add an authoritative Robinhood source or atomic event binding. |
| Commit/reveal, ConsultEscrow, EIP-7702 rescue, ReceiptOS demo ingestion | NOT_JUSTIFIED_YET | Different protected events and trust assumptions; code should not be generalized into price authorization by name. |
| pipavlo82/pq-receipt-profile | NOT_JUSTIFIED_YET | Historical-signature longevity is a different threat; README explicitly says receipts gate nothing. No first-slice event-time protection added. |
| pipavlo82/receiptos-pq-lab | NOT_JUSTIFIED_YET | Match-integrity demo and signature-agility work; no distinct stock-token state/action boundary justified. README screening only. |
| trustless-ai/composed-attestation-note | NOT_JUSTIFIED_YET | Useful vocabulary for input/decision/action/seam commitments; README says it specifies no legs. No runtime primitive imported, worked-example deployment not verified. |
| trustless-ai/observation-conditions-note | NOT_JUSTIFIED_YET | Draft conceptual unification, explicitly under review; conditions are preserved in this audit without adding a dependency. |
| trustless-ai/primitives | NOT_JUSTIFIED_YET | Discovery index only; README explicitly defers authority to code/chain/package. Live labels and addresses were not independently verified. |

No candidate is required solely because it belongs to the workstream. [trustless-ai/recompute-kit:tools/run_conformance.py L96-108](https://github.com/trustless-ai/recompute-kit/blob/f5a25bd6bbf555c710d63915d4e5092548e3702c/tools/run_conformance.py#L96-L108); [pipavlo82/semantic-execution-guard:provenance/SOURCES.md L1-54](https://github.com/pipavlo82/semantic-execution-guard/blob/8c786d8134632cdb4892ed32051377e739495300/provenance/SOURCES.md#L1-L54).

## 8. Robinhood application

The protected relation stays: **an underlying-equity quote establishes an adjusted token price only through explicit exact conversion with a matching asset multiplier, scale and compatible effective context; numeric equality alone never establishes the type.**

Frozen official-documentation sources are [Stock Token APIs](https://docs.robinhood.com/chain/stock-token-apis/), [Building with Stock Tokens](https://docs.robinhood.com/chain/building-with-stock-tokens/) and [Oracles & Price Feeds](https://docs.robinhood.com/chain/oracles-and-price-feeds/), captured at 2026-09-16T17:59:27.548Z/.626Z/.663Z respectively in the base's provenance/SOURCES.md and source-capture manifest. They are normative-documentation references already in PR #1, **not newly observed APIs, contracts or feeds**. This audit does not add or infer Robinhood semantics.

- Quote authenticity: an agreed trusted acquisition/attestation route must establish it; the fixture label does not.
- Multiplier authority: establish source and effective state independently of caller-supplied context. Live methods, transition ordering and available version identifiers remain UNVERIFIED.
- Current at event: compare authoritative active state/version and effective time in the protected path. A signed old version and an unexpired quote do not prove current multiplier. If this cannot be enforced, decline the stronger claim.
- Scope: bind exact stock-token/chain/contract, semantic claim, currency/side/value/scale and actual action. A correctly typed price cannot authorize arbitrary calldata.
- Corporate action / policy transition: old permits must become unusable under the consumer's current version rule, including transitions that restore the same numeric value.
- CANNOT_ESTABLISH: preserve it diagnostically while denying execution; do not reuse a last good PASS on source failure.
- Already-adjusted feed: remains rejected by this raw-conversion relation. A separately justified direct-feed relation would be a new profile, not a source-label substitution.
- Unknown rounding stays CANNOT_ESTABLISH. Runtime EVM range/scaling must be agreed without changing frozen relation bytes.

## 9. Required Fede guard properties

Properties only; Fede retains Solidity design ownership.

1. Every protected entry path enforces the guard. No cached/periodic PASS authorizes an action by itself.
2. Verify trusted result production and source/profile authority, or recompute using authenticated inputs in the event path; reject forged PASS and unauthorized context.
3. Derive actual action commitment and domain from actual execution inputs; preserve asset/type/value/scale. Check implementation/profile policy identity and executor rights as applicable.
4. Check event-relevant current state/version, time/effective schedule and expiry at consumption. A static historical proof is insufficient for mutable current-state authorization.
5. Check/consume nonce and execute atomically; if action fails, revert both. Guard against reentrancy/callback state changes and unguarded entry paths. A consume event alone is not execution evidence.
6. Distinguish FAIL from CANNOT_ESTABLISH in diagnostics; both deny. No stale-success fallback. Define safe integer bounds and reject unsupported conversion/encoding.
7. Emit enough identity to match consumed authorization to target action and resulting state, without presenting logs as source truth.

Evidence supporting these requirements is in SEG_RELATION, ACTION_COMMITMENT, CAPV_CONSUME, TAS_SOURCE_GATE, RK_STANDING_TERMINALITY and RECOVERY_ESCROW; they are derived integration requirements, not implemented behavior.

## 10. Required Tiago evidence/deployment artifacts

1. Actual chain ID; RPC URL used (redact credentials); capture timestamp; eth_chainId and raw JSON-RPC bytes with SHA-256. Declare transport trust and finality policy.
2. Block number AND hash/state root where relevant; quote source and exact response bytes/headers/timestamps, authenticated acquisition method, asset identity, currency/side and declared price decimals.
3. Observed Stock Token/test asset, multiplier source and oracle/feed addresses if they exist; code bytes/hash and ABI/version. Do not infer existence from documentation or a schema address.
4. Current/pending multiplier raw responses, scale, observation block/time, effective schedule and authoritative state/version mechanism. Demonstrate how the consumer detects changes at execution; timestamp freshness alone is insufficient.
5. Guard address; deployment transaction hash, constructor/configuration, bytecode/compiler/source pin and explorer URLs. Record configured signer/source/policy/domain and any upgrade or governance authority.
6. Exact control/bad calldata, target/action parameters, caller/executor, action digest, evidence/context digests, nonce and expiry. Publish no private keys or credential-bearing RPC URLs.
7. Transaction receipts; reverted transaction receipt and trace; successful control receipt and before/after protected-state delta; logs connecting consumed authorization to the actual action. If bad path is only eth_call simulation, label it simulation, not mined revert.
8. Raw RPC request/response captures and SHA-256 digests; timestamps and explorer URLs; independent re-fetch comparison. All Robinhood testnet existence/deployment/success claims remain UNVERIFIED until supplied and checked.

## 11. Independent verification plan

1. Freeze Fede guard, trusted adapter, policy/profile, signer configuration and deployment bytes separately from PR #1. Pin all exact SHAs and build/compiler settings.
2. Run an independent relation implementation over the frozen inputs. Keep semantic result separate from conformance match; unavailable dependencies produce CANNOT_ESTABLISH and block execution. Do not reuse producer expected outputs as the independent oracle.
3. Carry V2 numeric coincidence, wrong-asset, stale/missing multiplier, scale and already-adjusted cases through the actual guard. Preserve the 26-case baseline and 7 mutations as frozen evidence, not new audit test counts.
4. Add future integration tests: forged PASS/value/context; wrong signer/profile/chain/guard/asset/target/recipient/executor; duplicate nonce; expired/future timestamp; policy or multiplier change between signing and mining; A -> B -> A state; pending time-only activation; source outage and conflicting snapshots.
5. Test atomicity: induce callback/reentrancy or relevant mutable-state changes after checking; failed action must roll back nonce consumption and protected state. View verify at t0 followed by transaction at t1 must not be the authorization design.
6. Tiago captures bad-path trace/no action and control state delta at exact blocks. An independent reviewer recomputes action/evidence/domain digests, signer and nonce consumption from calldata/logs/state; confirmations/finality remain explicit.
7. Independent verification labels require named independently produced reasoning/code and pinned inputs. RSI/PRF/RVR and TSEI scaffolds can organize that evidence; running a producer suite or differing declared author strings does not establish independence.

The frozen product's recorded 26 expected vector outcomes (2 PASS / 21 FAIL / 3 CANNOT_ESTABLISH), 7 killed mutations and absent Solidity guard are baseline evidence, not fresh counts from this audit. This audit ran the single in-memory formatter experiment described above; it did not rerun foreign suites, deploy contracts or simulate independent authorship. Report validation checks JSON structure, source references, counts, LF encoding, file scope and unchanged frozen refs.

## 12. License/reuse constraints

The repository table and JSON license_evidence point to exact license bytes. No source code was copied, no license chosen and no license file changed. Root labels do not override file/subcomponent licenses.

- Apache-2.0 candidates: preserve applicable license, attribution/NOTICE and modification notices when redistributing adapted code; inspect dependencies and exceptions before copying. Chronicle reserves brand rights and underlying proof objects retain their own rights.
- MIT candidates: preserve copyright and permission notices with copied/substantial source. ConsultEscrow's file is MIT despite the agent-ercs root Apache label.
- CC0 candidates: explicit public-domain dedication in the inspected source; keep provenance even where no attribution obligation is imposed. CAPV mock and PolicyAction have per-file CC0 headers.
- No grant: product new code, RSI pending-license source, receiptos-mvp, receiptos-pq-lab and pq-receipt-profile cannot be treated as open-source copy permission merely because public. Absence statements are bounded to inspected trees.
- Composition through a small independently implemented interface and pinned external audit inputs is cleaner than vendoring whole repositories. A dependency still carries its license; linking is not a blanket escape from obligations.
- Team decision is required on license and contribution terms before inviting external contributions under an assumed grant. This audit grants none.

## 13. Open unknowns

- No inspected Fede guard or agreed protected action implementation; atomicity, all guarded entry points, runtime uint256 range, EVM encoding and revert behavior remain open. The frozen input schema accepts synthetic fixtures only; any live adapter/profile agreement is future work, not a silent reinterpretation of this schema.
- Robinhood testnet token/feed/contract availability, source authenticity route, current/pending multiplier semantics in deployed code and authoritative state version remain UNVERIFIED.
- Who may attest/authorize, how source acquisition is trusted, how policy/signer revocation becomes current onchain, and which mutable predicates affect the actual action are team decisions.
- Without an authoritative event-visible multiplier version (or equivalent state/proof rule), a real current-multiplier atomic guarantee cannot be made. Short expiry leaves a bounded stale interval; it does not solve it. Label any attestor-snapshot-only demo accordingly.
- RPC/finality/reorg assumptions, state-proof header authority, exact max-age/expiry inequality and pending effective transitions are not yet agreed.
- Referenced trustless-ai/vertice-gateway was not in accessible inventory; gh repo view could not resolve it. The cutoff reference claims a live enforcer, but callers/deployed wiring could not be inspected.
- Existing upstream deployment/independence reports are source claims only here. No broad repository-wide absence theorem, formal verification or exploitability assessment is claimed.
- recompute-kit open PRs #42/#43/#44 and other branches were inventoried, not treated as merged. At pinned main, tools/run_conformance.py classifies ordinary nonzero exit (including 2) as suite failure absent special environmental rules; do not infer full tri-state process reporting from per-profile tri-state semantics.
- New product code has no license grant. Team contribution/reuse policy and eventual license decision remain pending.

## 14. Claims we MUST NOT make yet

- Relation PASS is authenticated, true, fresh, authorized or executed.
- Semantic equality follows from numeric equality, or supplied matching context proves current external state.
- A recomputable/fail-closed checker is enforced on every protected event.
- A per-event check is atomic check-and-use, or consuming a nullifier proves the protected action executed.
- Signed historical state, proof at a block or unexpired receipt necessarily represents the latest effective multiplier.
- Public code, producer tests, declared independent identity strings or a receipt hash constitute independent verification.
- The draft PR is merged, Solidity-tested, deployed or used successfully; Robinhood addresses/feeds exist on testnet.
- Synthetic fixtures are production observations; normative documentation is live evidence; RPC corroboration is independently verified consensus.
- PQ, TSEI, ReceiptOS, RSI, a full SDK or an observation mesh are necessary runtime dependencies for this slice.
- Any structural risk in this audit is a proven live-capital vulnerability; this audit establishes none.

This audit changes only the two requested report files on a new local branch. Existing main, frozen relation branch, PR #1, external repository histories, Solidity, relation code, workflows and licensing remain untouched. No production trading, private-key use, deployment, push, merge or new PR was performed.
