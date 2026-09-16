# Pre-existing foundation and minimal reuse decision

Inspected live GitHub default/main on 2026-09-16 using authenticated read-only APIs:

| Foundation | Exact observed main SHA | Use here |
| --- | --- | --- |
| trustless-ai/semantic-abi | d15c666dfccff17f7350fe97d2fc7b71cb2cbaee | Pre-existing claim/authority/scope/time and explicit negative-boundary concepts |
| pipavlo82/relational-security-invariants | e8fb81904af2ffe19e974383cf78d9d18d259b98 | Prior adversarial/mutation/recomputation method; later verification surface only |

Before choosing reuse, inspected Semantic ABI README.md, package.json,
runner/src/linker.mjs, schema/manifest-v0.md, schema/manifest.schema.json and LICENSE
at the pinned commit. Upstream advertises Apache-2.0 code and CC0 schema/spec. Its
manifest is explicitly draft, not frozen. Its linker compares claim, authority,
scope and temporal declarations; it does not perform this price conversion.

Decision: option 3, minimal independently implemented relation compatible with
Semantic ABI concepts. No source code, schema files, fixtures, license files,
packages, submodules or entire repositories are copied/adapted into runtime.
No stable upstream package is needed for this small domain-specific relation.
Conceptual reuse is disclosed, not represented as novel hackathon invention or
as upstream manifest wire conformance. License choice for new project code remains
the owner's decision; public visibility alone does not grant an open-source license.

Existing Semantic ABI schema/linker/research and ETHOnline work pre-date this repo.
RSI code and history remain untouched. No RSI integration or independent verification
has been performed. No semantics are backfilled into legacy artifacts.

Repository creation and initial provenance are in ../PROVENANCE.md. The root commit
contains only PROVENANCE.md. Product work begins on Pavlo's separate feature branch.
