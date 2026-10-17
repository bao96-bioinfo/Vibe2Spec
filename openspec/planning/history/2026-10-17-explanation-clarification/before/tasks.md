# Tasks

This is the implementation roadmap. Task checkboxes record verified deliverables. The numbered groups are sequential project steps. The complete current-step specification, user approval, and passing separate specification review are prerequisites for writing its implementation. Each group must pass its checks and results review and receive explicit user acceptance before the next group's detailed specification begins. Necessary clarification of a later interface is allowed when the current step depends on it.

The six capability specifications define release behavior. Each group receives a detailed execution specification when it becomes current. That specification fixes its exact files, interfaces, arguments, fixture contents, expected outcomes, comparison rules, runtime, resource bounds, and paired-validation decision. Proposed paths below are reviewable scope, not approval of unstated values. A checkbox records delivered work; it does not replace review evidence or user acceptance.

The project loop applies during development of Vibe2Spec itself. Before the product helpers exist, the agents maintain and review the same evidence manually. New code and tests require pre-execution review before running. A necessary change to an accepted earlier group requires an amendment listing every affected script and explicitly reopening that group. It cannot be folded silently into a later task.

## 1. Records and specification templates

This step implements the record and template responsibilities in `step-specification`, `reproducibility-contract`, and `step-lifecycle`. Its detailed contract must resolve exact fields, identities, reference rules, and representative examples before implementation begins.

- [x] 1.1 Deliver `docs/record-format.md` with the approved versioned field definitions for project, decision, evidence, approval, step, unit, review, run, comparison, acceptance, and amendment records. Verify every required state and reference has an explicit meaning and an approved example.
- [x] 1.2 Add `templates/project.md`, `templates/project.json`, and decision, evidence, and approval templates. Verify their examples preserve unanswered and partially answered choices and bind approval to exact presented contents.
- [x] 1.3 Add `templates/step/` containing behavior, design, task, contract, and unit templates. Incorporate the accepted writing conventions into all prose templates. Verify a filled example covers every approved current-step contract area, maps requirements to decisions and checks, and follows those conventions.
- [x] 1.4 Add review, run, comparison, acceptance, and amendment templates under `templates/`. Verify separate review phases, per-output comparison coverage, every affected script, and accepted revision provenance can be represented without ambiguous fields.
- [x] 1.5 Add approved complete and incomplete record examples under `tests/fixtures/records/`. Verify their JSON parses and manually assess missing values, broken references, conflicting prose, changed decisions, and absent paired-validation decisions against the documented expected findings.
- [ ] 1.6 Record Step 1 checks, separate results review, and explicit user acceptance of the delivered artifacts. Verify the accepted snapshot and completion record before beginning Step 2.

## 2. Validation and readiness

This step implements structural and version checks from `step-specification` and `reviewed-execution`. Semantic completeness continues to require separate review.

- [ ] 2.1 Add the approved Node.js development metadata and helper entry structure in `package.json` and `scripts/`. Verify the specified runtime can invoke the documented helper interface and test command without additional undeclared prerequisites.
- [ ] 2.2 Implement record loading and validation in `scripts/records.mjs`. Add `tests/records.test.mjs` for unsupported versions, invalid types, duplicate identities, missing required values, and broken references; verify the approved diagnostics and exit behavior.
- [ ] 2.3 Implement snapshot and content-reference verification in `scripts/snapshots.mjs`. Add tests showing that a decision value changed under the same identifier invalidates its approval, while retained historical references still resolve to the original contents.
- [ ] 2.4 Implement structural readiness checks in `scripts/readiness.mjs` for the complete current step, linked units, comparison coverage, decision approvals, and required review evidence. Verify that a complete unit cannot bypass an unresolved step and that missing or indeterminate specification review cannot yield readiness.
- [ ] 2.5 Document the helper interface and its structural limits in `docs/validation.md`. Verify documented examples reproduce approved findings and do not claim that a validator establishes semantic completeness or human identity.
- [ ] 2.6 Record Step 2 checks, separate results review, and explicit user acceptance. Verify the versioned completion evidence before beginning Step 3.

## 3. Interview and research

This step implements `request-discovery` through shared coordinator instructions and their evidence format.

- [ ] 3.1 Add the interview entry workflow in `skills/vibe2spec/SKILL.md` and its references. Verify approved software and research dialogue cases first resolve outcomes, relevant constraints, and overview dependencies without inventing a topic, dataset, or method.
- [ ] 3.2 Add decision grouping and question-dependency instructions. Verify dialogue cases with independent settings, dependent questions, partial grouped acceptance, silence, and uncertainty produce the specified decision statuses.
- [ ] 3.3 Add research and feasibility guidance linked to evidence records. Verify cases with conflicting sources, inaccessible literature, resource limits, and a common published default preserve the distinction between evidence, recommendation, and approval.
- [ ] 3.4 Incorporate the accepted writing conventions directly in the new coordinator instructions and verify their use of the accepted Step 1 templates. Document the interview in `docs/interview.md`; verify explanations define unfamiliar terms, explain consequences, and provide enough information to decide. Any necessary change to an accepted template requires reopening Step 1.
- [ ] 3.5 Preserve the reviewed dialogue fixtures and outcomes under `tests/fixtures/interview/`. Verify no example treats a recommendation, missing answer, or conventional default as accepted behavior.
- [ ] 3.6 Record Step 3 checks, separate results review, and explicit user acceptance. Verify completion before beginning Step 4.

## 4. Step authoring and diagrams

This step implements the authoring behavior in `step-specification` and the overview presentation in `host-integration`.

- [ ] 4.1 Add current-step authoring instructions under `skills/vibe2spec/references/`. Verify a complete example separates behavioral requirements, method decisions, effective settings, outputs, checks, and small implementation units while preserving traceability.
- [ ] 4.2 Add coverage assessment instructions and approved findings for missing defaults, threshold boundaries, shapes, errors, ordering, randomness, and relevant environment behavior. Verify each case returns to the interview before code preparation.
- [ ] 4.3 Implement the approved ASCII renderer in `scripts/overview.mjs` with checks in `tests/overview.test.mjs`. Verify it displays ordered steps, the current step, future provisional steps, the repeated step cycle, reopened steps, and blocked dependencies.
- [ ] 4.4 Add `docs/specification-authoring.md` and `docs/project-overview.md`. Verify examples use named SHALL or MUST requirements with WHEN/THEN scenarios and show that overview agreement does not approve future detailed settings.
- [ ] 4.5 Record Step 4 checks, separate results review, and explicit user acceptance. Verify completion before beginning Step 5.

## 5. Worker and reviewer protocol

This step implements `reviewed-execution`. Host-specific delegation details remain in Step 8, while the shared handoff and separate-session fallback are established here.

- [ ] 5.1 Add `skills/vibe2spec-worker/SKILL.md` and handoff references. Verify the worker receives the exact complete approved current-step context and stops before implementing a missing argument, derivation, fallback, or unit behavior.
- [ ] 5.2 Add `skills/vibe2spec-review/SKILL.md` with distinct specification, pre-execution, and results assessments. Verify the specification reviewer can block code preparation and cannot approve unresolved decisions for the user.
- [ ] 5.3 Add prepared-work review examples covering explicit arguments, omitted defaults, environment overrides, configuration precedence, dependency changes, and altered acceptance checks. Verify findings identify the actual location and missing approved decision.
- [ ] 5.4 Add run-evidence and results-review instructions. Verify mismatched input identity, incomplete settings, changed code after review, and unapproved tolerance changes cannot obtain a passing assessment.
- [ ] 5.5 Add separate-session handoff and review-result validation. Verify unavailable native delegation leaves the relevant gate pending. Verify worker self-review, artifact-author self-review including a coordinator reviewing its own specification, missing evidence, and indeterminate findings cannot satisfy it.
- [ ] 5.6 Document the three review phases and instruction-based control boundary in `docs/review.md`. Preserve assessed cases under `tests/fixtures/review/`; verify the documentation does not claim technical prevention or retroactive approval.
- [ ] 5.7 Record Step 5 checks, separate results review, and explicit user acceptance. Verify completion before beginning Step 6.

## 6. Paired unit validation

This step implements comparison helpers and the paired protocol from `reproducibility-contract`. All pairing uses approved small synthetic cases. Its detailed contract must fix the supported comparison formulas and numeric representations before code preparation.

- [ ] 6.1 Implement approved byte, logical JSON, and finite-number comparisons in `scripts/compare.mjs`. Add `tests/compare.test.mjs` for alignment, ordering, boundary equality, zero references, missing and non-finite values, and unsupported numeric representations; verify exact approved outcomes without implicit tolerances or normalization.
- [ ] 6.2 Add pair-handoff instructions that give two separate workers the same approved specification and saved fixture contents. Verify neither context receives the other's code or results before its own implementation is fixed, and a distinct reviewer assesses both.
- [ ] 6.3 Implement comparison-record validation for contract, fixture, implementation, review, result, and resource references. Verify different saved vectors, incomplete step readiness, copied implementations, or a worker paired with its reviewer cannot establish independent paired evidence.
- [ ] 6.4 Verify the approved cases where both implementations share an error and where both pass a reference check but fail the direct comparison. Preserve both individual correctness findings and the direct paired outcome.
- [ ] 6.5 Add bounds and failure instructions for fixture size, call counts, execution resources, and time. Verify missing bounds and a request to exceed them return to the user without enlarging the run or starting real-data training.
- [ ] 6.6 Document the protocol and supported checker scope in `docs/paired-validation.md`. Verify it distinguishes tested-unit evidence from general equivalence and from integration or scientific validation.
- [ ] 6.7 Record Step 6 checks, separate results review, and explicit user acceptance. Verify completion before beginning Step 7.

## 7. Completion, resume, and necessary reopening

This step implements `step-lifecycle` and connects the already defined records and reviews into the repeated project-step workflow.

- [ ] 7.1 Implement the approved lifecycle checks in `scripts/lifecycle.mjs`. Add `tests/lifecycle.test.mjs` verifying that all checks, passing review, and explicit result acceptance are required before marking a step finished or starting the next step's detailed work.
- [ ] 7.2 Add coordinator resume instructions and state validation. Verify another session identifies the current step, unfinished questions, accepted revisions, and pending reviews without inferring approval from a completion claim.
- [ ] 7.3 Add amendment proposal and scope checks. Verify convenience-only changes do not establish necessity, every affected script has its planned edit, and proposed but unapproved changes leave completed work closed.
- [ ] 7.4 Implement reopening and dependency reassessment according to the approved state contract. Verify a reopened step returns to interview and specification review, retains its old accepted revision, and suspends affected dependent work until the new revision is accepted.
- [ ] 7.5 Verify direct and transitive affected evidence becomes stale for current reliance. Test expanded amendment scope, unresolved revised decisions, renewed acceptance, and project completion blocked by required stale evidence.
- [ ] 7.6 Document the project loop and reopening protocol in `docs/lifecycle.md`. Verify a multi-step fixture demonstrates finishing one step, interviewing the next, reopening a necessary correction, and repeating the applicable cycle before completion.
- [ ] 7.7 Record Step 7 checks, separate results review, and explicit user acceptance. Verify completion before beginning Step 8.

## 8. Host packages and installation documentation

This step implements distribution responsibilities in `host-integration`. Its detailed contract fixes supported Node.js and host versions, documented package formats, installation commands, and delegation behavior before packaging work begins.

- [ ] 8.1 Add the approved Claude installation metadata and adapter under `packaging/claude/`, including the required distributed manifest location. Verify documented host validation recognizes the shared skills and the separate-reviewer workflow.
- [ ] 8.2 Add the approved Codex installation metadata and adapter under `packaging/codex/`, including the required distributed manifest location. Verify documented host validation recognizes the shared skills without assuming Claude agent definitions are portable.
- [ ] 8.3 Add package assembly and content checks under `scripts/` and `tests/packaging.test.mjs`. Verify every referenced template and helper is included and no package requires the author's folders, OpenSpec, Spec Kit, SpecViz, or a separate writing-style bundle.
- [ ] 8.4 Perform clean local installation checks in both approved host environments. Verify declared runtime requirements, native reviewer delegation where available, separate-session fallback, and explicit failures when research access or helper execution is unavailable.
- [ ] 8.5 Write `docs/installation.md`, `docs/host-compatibility.md`, and the product `README.md`. Verify the documented setup, command examples, workspace record location, update behavior, and unsupported-version response match the observed installations.
- [ ] 8.6 Record Step 8 checks, separate results review, and explicit user acceptance. Verify completion before beginning Step 9. Marketplace publication is not part of these installation tasks.

## 9. Release examples and integrated verification

This final group integrates components already checked in their owning steps. The exact release functions, synthetic fixtures, expected outcomes, tolerances where needed, and resource bounds receive approval in this step's specification. Required paired release examples cannot be replaced by a single implementation.

- [ ] 9.1 Create approved small-unit example projects under `examples/paired-units/` and their explanatory records. Verify each has a complete contract, exact fixture identity, normal and boundary cases, invalid-input behavior, and approved direct comparison rules before either worker prepares code.
- [ ] 9.2 Obtain two independent unit implementations for each selected release example and separate pre-execution reviews. Run only the approved synthetic cases; verify individual correctness, direct agreement, evidence identity, and resource bounds. Preserve actual independent worker provenance.
- [ ] 9.3 Demonstrate the full multi-step workflow under `examples/project-cycle/`. Verify the sequence includes a fresh interview and specification review for each step, all three completion conditions, an explicitly reopened necessary correction, and renewed affected evidence.
- [ ] 9.4 Exercise the integrated examples through both host packages using the approved compatibility matrix. Verify portable records and the same gate outcomes, including reviewer-unavailable and helper-unavailable cases.
- [ ] 9.5 Deliver a release verification record linking each capability to its checks, example evidence, tested environment, and known limitations. Verify all required tasks and evidence are complete without claiming universal equivalence from finite unit tests.
- [ ] 9.6 Obtain separate final results review and explicit user acceptance of the release candidate. Verify every required step is finished under its current revision and no necessary amendment or required stale evidence remains open.

Marketplace submission remains a subsequent explicitly authorized action after release acceptance. Archiving these OpenSpec planning artifacts also remains separate from implementing the product.
