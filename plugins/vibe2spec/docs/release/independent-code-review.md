# Independent core code review

The review was performed on 18 October 2026 in the separate agent context `/root/independent_gate_audit`. This context did not author the initial validation, lifecycle or comparison implementations. It inspected their code against the accepted record format, the six change specifications and the corresponding helper documentation. It then corrected the verified defects below and added regression checks. These corrections are changes authored by the reviewing context; the test results are verification evidence, not a claim of an additional independent review of its own corrections.

## Findings and corrections

| Finding | Correction and evidence |
| --- | --- |
| A matching digest could allow traversal through a reference requiring the wrong record kind. | Kind, project and context mismatches now stop that branch before following the target's references. A regression confirms that the wrong-kind target cannot cause an external read attempt. |
| A structurally invalid approval could still supply approval coverage. | The graph retains local record validity, and invalid records cannot establish approvals or valid references. A regression adds an undeclared approval field and confirms that readiness remains blocked. |
| Independently partial approvals could substitute for approval of the complete step package. | Readiness requires a step-specification approval covering the entire normative scope. Project-wide settings now participate consistently in readiness, reviewed specification snapshots and effective-setting checks. |
| A comparison could name an approved decision while using a different pairwise rule. | The supported lifecycle check requires the approved literal decision value to equal the complete pairwise Rule. Mismatches fail; uninterpreted representations remain incomplete. A complete paired fixture also passes, guarding against indiscriminate rejection. |
| Execution input coverage omitted unit fixtures, and additional input or output artifacts were not checked. | Required fixtures must appear in the exact input snapshot. Additional inputs require approved input references. Outputs require an approved output or unit write path, with unchanged retained inputs allowed as nonmutation evidence. |
| A draft run could establish accepted results. | Acceptance requires frozen run records. A targeted regression retains all other passing evidence while changing only the run lifecycle to draft. |
| JavaScript end anchors accepted a trailing line terminator in identifiers and some exact-string fields. | Full-string matching rejects all four Unicode line terminators for identifiers, digests and decimal tolerance strings. The independent paired reviewer initially identified the identifier defect. |
| Exact-JSON comparisons accepted hidden properties and malformed Unicode; depth counted containers inconsistently. | Unsupported object shapes and malformed Unicode remain indeterminate. Container depth now matches the strict parser. Accessor-based rules are rejected without invoking their getter. |
| Some malformed nested records could turn structural defects into internal errors. | Affected semantic branches now defer to their structural findings. Regressions cover null project states, step checks, run results, comparison groups and reviewer authors. |
| Reusable record validation permitted unsafe integers in literal data without the file parser. | Nested literal values now receive safe-integer checks. The envelope-only comparison unit retains its specified independent behavior. |
| Numerical unsupported-input classification depended on whether shapes differed. | Unsupported values remain indeterminate before shape comparison. Additional tests cover overflow in relative error and signed-zero handling. |

The review also verified that honest failed historical attempts can remain in the selected graph without replacing or invalidating separately selected successful results. Existing regressions cover omitted transitive review authors, self-review, wrong snapshot associations, missing unit comparisons, forged passing result labels, effective-setting mismatches, unsupported numerical rules and amendment scope.

## Verification

The audit added `tests/audit-regressions.test.mjs`, containing 20 targeted tests. The final focused run on Node.js 26.11.1 included that file and the graph, lifecycle, record and comparison suites. The release verification document records the authoritative complete runs on both selected Node.js versions after the package is rebuilt from final source.

The reviewer also independently inspected the paired harness correction in `tests/envelope-fixture.mjs`. The source-order operation requires a complete permutation, and a claimed TypeError requires an actual TypeError instance. Deep strict comparison preserves detection of signed-zero input mutation. The six integration-review tests available at that inspection passed. Later package integration tests and their final outcomes belong to the release verification record.

## Interpretation limits

Mechanical agreement does not authenticate a human response, prove that two contexts were independent, establish that recorded commands actually executed, or infer omitted semantic requirements from prose. Those obligations remain assigned to separate reviewers. Arbitrary mathematical definitions are not evaluated as code. Unknown history outside the explicitly selected graph remains unknown. The helpers enforce their documented assessment boundary and never provide a technical barrier against every possible unauthorized worker action.

The accepted Step 1 record format, templates and fixture definitions were not rewritten to accommodate these fixes. The audit does not certify official marketplace acceptance or public-directory publication.
