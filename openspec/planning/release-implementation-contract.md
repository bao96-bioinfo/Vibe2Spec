# Release implementation contract

The [autonomous development instruction](development-authorization.md) authorizes the recommended implementation decisions recorded here. Accepted Step 1 artifacts remain unchanged. The product retains the user-controlled workflow in the capability specifications.

## Release boundary

The release version is 0.1.0. All executable runtime helpers use ECMAScript modules and Node.js built-ins. Supported release lines begin at 24.22.0 and 26.11.1. Unsupported major versions cannot establish validation success. The package is licensed Apache-2.0, matching the existing repository license. No installation lifecycle scripts, network service, external tool server, or additional Node package is introduced.

The coordinator, worker and reviewer are portable skills. Control remains instruction-based. A human approval cannot be inferred from a successful helper or fabricated response identifiers. Native delegation is used when available; otherwise a separate reviewer session is required. Project evidence lives in the selected workspace. Installed package caches contain runtime resources only.

## Validation and state

The accepted record-format guide fixes all twelve record shapes and exact reference semantics. The final runtime contracts are documented in `docs/validation.md`, `docs/validation-records.md`, `docs/validation-graph.md` and `docs/lifecycle.md`. The approved numeric ingestion, exact-file read scope and resource profile are retained. Every report distinguishes structural validity, completeness and workflow readiness. A false claim of approval or independence remains a separate-review obligation, even when recorded fields agree.

The CLI requires an explicit workspace, entry and validation operation. `structure`, `implementation_readiness` and `lifecycle` are the supported operations. JSON and readable reports share findings, stable ordering, reviewer obligations and exit status. Combined findings use the selected cap. The overall assessment checks its cooperative deadline. Helpers never modify input records or execute commands stored in records.

## Reproducibility

The comparison contract in `docs/comparison-api.md` supports exact bytes, exact JSON and explicit finite scalar or flat-vector numerical comparisons. Numerical formulas use `absolute_error` or `relative_error`, positional alignment, explicit boundary and tolerance, rejection of non-finite values, and an explicit zero policy. Other representations remain indeterminate. There is no implicit tolerance or normalization.

The paired release unit is the record-envelope checker. Its immutable contract and saved 64-case oracle precede the second worker handoff. Worker A was designated before its implementation. Worker B receives the same contract and oracle in a fresh context without A's source or results. Each implementation is checked against the oracle, then directly against the other, with input preservation. Each runtime executes 128 paired-unit calls; both runtimes execute 256 total. The fixture file is at most 256 KiB and each materialized case at most 16 KiB. No real data, model weights, network access or training is involved. Development regression tests outside this pair are identified separately.

## Packaging and release checks

One self-contained generated package serves both host catalogs. Source manifests live under `packaging/claude/` and `packaging/codex/`. Catalogs identify `vibe2spec@vibe2spec-marketplace` and select `plugins/vibe2spec/`. The assembly helper operates only on an explicitly owned generated directory. Package tests compare runtime source and installed resources. The published archive contains the generated package; authoring tools are excluded.

Installation verification uses actual host marketplace commands with isolated child-process configuration directories. It records host versions, package identity, discovery, installed paths, update and removal. A temporary `0.1.1-smoke` version tests update behavior and is never published. Both installed copies assess identical saved project graphs. Workspace record fingerprints must survive installation, update and removal. The evidence explicitly separates installed-helper tests from model instruction-following assessment.

A fresh-context agent assesses interview and review fixtures using stimuli before held-out outcomes. A separate source reviewer inspects implementation and test defects, applies corrections and preserves their findings. All product tests run on both fixed Node.js runtimes. Public listing copy, manifests, icon, review cases and archive are prepared. Actual official directory submission and account approval remain external actions.

## Delivery

The README retains the cartoon, explanatory example, explicit install commands, repeated-step diagram, reviewer roles and comparison examples. Detailed guides define the CLI, contracts, lifecycle, distribution and known boundaries. The release verification record identifies observed results and remaining external actions. Git commits retain the prior planning evidence and accepted format. No completion checkbox substitutes for an observed check.
