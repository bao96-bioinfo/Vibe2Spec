# Integrated release evidence

## Authority and complete contract

This step is implemented under the user's autonomous development authorization recorded in `openspec/planning/development-authorization.md`. The release decisions are fixed in `openspec/planning/release-implementation-contract.md`. These supersede development-only pauses in historical drafts. Product approval gates remain mandatory.

The complete field, behavior, interface, error and comparison definitions for this step are in `docs/release/verification.md`. These are normative release contracts alongside the accepted `docs/record-format.md` and the six capability specifications. Future product-user choices are not filled by these development decisions.

## Scope

The implementation artifacts are `examples/paired-units/`, `examples/project-cycle/`, `README.md`. Accepted Step 1 artifacts are unchanged. Any defective behavior is corrected against the existing requirement; tests and reviewers cannot invent user approvals or loosen a project comparison criterion.

## Required outcomes

The implementation SHALL satisfy the named capability requirements applicable to this step. WHEN required evidence or input is absent, invalid or unapproved, THEN the affected product gate remains pending and the diagnostic preserves the actual limitation. WHEN all required mechanical checks pass, THEN the report describes only that mechanical scope and preserves independent-review obligations.

The implementation SHALL use the exact runtime and fixture identities in its verification evidence. WHEN compared results differ, THEN the discrepancy remains visible and the expected result is not changed to match the implementation.

## Verification

Required checks are `tests/paired-envelope.test.mjs`, `tests/project-cycle.test.mjs`, `docs/release/independent-code-review.md`. Helpers run with bounded synthetic fixtures. Both Node.js 24.22.0 and 26.11.1 receive the same automated suite. Separate review inspects actual source and evidence. The final release record reports observed pass counts, source identities and limitations without implying external marketplace publication.
