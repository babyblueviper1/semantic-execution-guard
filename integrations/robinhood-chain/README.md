# Tiago / Merlini: Robinhood Chain evidence handoff

Status: UNVERIFIED / NOT_DEPLOYED. No live Stock Token or Chainlink feed on testnet
has been independently observed in this task. Empty/null fields in config are
pending evidence, not zero values or claims of absence. Do not send a transaction
using the synthetic fixture identities.

Provide a capture manifest with the following exact artifacts, each tied to the
source/guard commit, capture UTC timestamp and chain context:

| Artifact | Required content |
| --- | --- |
| Network | Chain ID observed with eth_chainId; RPC used (public endpoint identifier, no embedded credentials) |
| Block | Block number, hash and timestamp; raw eth_getBlockByNumber response |
| Deployment | Deployment tx hash, guard address, deployer-independent code observation, compiler/config and bytecode digest |
| Token/test asset | Address and provenance if one exists; explicitly distinguish real Stock Token from custom test asset |
| Feed/oracle | Address, source role, decimals and observed contract identity if one exists; otherwise mark UNVERIFIED/absent evidence |
| Calls | Exact calldata, sender, target, value, chain ID, nonce and block context; do not include signing secrets |
| Bad path | Exact V2-derived input, transaction hash/receipt if broadcast; revert trace/eth_call error plus proof no protected action/state change |
| Good path | Exact V1-derived input, successful transaction receipt, decoded action events and independently observed state change |
| Explorer | URLs for deployment, addresses, block and both transaction paths |
| Raw capture | Original JSON-RPC requests/responses and any REST response bytes used; capture timestamps and SHA-256 of each external response |
| Mapping | Evidence normalization version, original quote/multiplier fields, semantic types, asset UID/deployments, USD, bid/ask, declared scales and effective-state justification |

A revert may fail during estimation/eth_call without a mined transaction receipt;
identify that case accurately and do not fabricate a receipt or transaction hash.
If an RPC URL/request carries credentials, sanitize before storage and record that
the stored digest covers sanitized bytes; do not claim it hashes the original raw
response/request. Keep keys, tokens, cookies and credentials outside Git and memory.

Capture multiplier observation/effective times, current and pending state where
relevant, and the evidence supporting the selected state at quote time. An API
cache window does not itself prove freshness. Source identifiers need independent
binding; a self-declared source string is insufficient.

Decide with Fede how a verified relation result reaches the guard and binds the
intended protected action. V0 is a hermetic fixture profile and has no live adapter;
do not just relabel LIVE_OBSERVATION as SYNTHETIC_RELATION_FIXTURE to obtain PASS.
A live profile/adapter requires separately reviewed mapping and evidence rules.

Store reviewed captures in artifacts/ with a manifest; config/ is currently a
placeholder with no asserted network details. Core CI/tests must stay hermetic.
Documentation != live evidence; synthetic != production; local test != deployment;
deployed != used successfully. No testnet success or execution is claimed yet.
