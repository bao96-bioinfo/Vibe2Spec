# Tasks

Development authorization: the user has requested autonomous completion using recommended remaining choices. [The recorded instruction](../../planning/development-authorization.md) supersedes development-only interview and acceptance pauses below. Product workflow gates remain required. Historical completion evidence is preserved.

This is the implementation roadmap. Task checkboxes record verified deliverables. The numbered groups identify product capabilities and their development history. The user subsequently authorized parallel autonomous development using recommended choices. The released product still requires a complete approved current step, separate specification review, reviewed work, passing checks and explicit result acceptance before advancing.

The six capability specifications define release behavior. Each group receives a detailed execution specification when it becomes current. That specification fixes its exact files, interfaces, arguments, fixture contents, expected outcomes, comparison rules, runtime, resource bounds, and paired-validation decision. Proposed paths below are reviewable scope, not approval of unstated values. A checkbox records delivered work; it does not replace review evidence or user acceptance.

The historical development plan applied the project loop to Vibe2Spec itself. Autonomous development authorization supersedes those development-only pauses. Source reviews, regression checks and release evidence remain required. Accepted Step 1 files remain unchanged.

## 1. Records and specification templates

This step implements the record and template responsibilities in `step-specification`, `reproducibility-contract`, and `step-lifecycle`. Its detailed contract must resolve exact fields, identities, reference rules, and representative examples before implementation begins.

- [x] 1.1 Deliver `docs/record-format.md` with the approved versioned field definitions for project, decision, evidence, approval, step, unit, review, run, comparison, acceptance, and amendment records. Verify every required state and reference has an explicit meaning and an approved example.
- [x] 1.2 Add `templates/project.md`, `templates/project.json`, and decision, evidence, and approval templates. Verify their examples preserve unanswered and partially answered choices and bind approval to exact presented contents.
- [x] 1.3 Add `templates/step/` containing behavior, design, task, contract, and unit templates. Incorporate the accepted writing conventions into all prose templates. Verify a filled example covers every approved current-step contract area, maps requirements to decisions and checks, and follows those conventions.
- [x] 1.4 Add review, run, comparison, acceptance, and amendment templates under `templates/`. Verify separate review phases, per-output comparison coverage, every affected script, and accepted revision provenance can be represented without ambiguous fields.
- [x] 1.5 Add approved complete and incomplete record examples under `tests/fixtures/records/`. Verify their JSON parses and manually assess missing values, broken references, conflicting prose, changed decisions, and absent paired-validation decisions against the documented expected findings.
- [x] 1.6 Record Step 1 checks, separate results review, and explicit user acceptance of the delivered artifacts. Verify the accepted snapshot and completion record before beginning Step 2.

Step 1 is finished. Its exact accepted version and actual user response are recorded in [the acceptance record](steps/01-records-and-templates/evidence/acceptance-v1.md). Subsequent work follows the autonomous development authorization and the final implementation contracts under each step directory.

## 2. Validation and readiness

This step implements structural and version checks from `step-specification` and `reviewed-execution`. Semantic completeness continues to require separate review.

- [x] 2.1 Add the approved Node.js development metadata and helper entry structure in `package.json` and `scripts/`. Verify the specified runtime can invoke the documented helper interface and test command without additional undeclared prerequisites.
- [x] 2.2 Implement record loading and validation in `scripts/records.mjs`. Add `tests/records.test.mjs` for unsupported versions, invalid types, duplicate identities, missing required values, and broken references; verify the approved diagnostics and exit behavior.
- [x] 2.3 Implement snapshot and content-reference verification in `scripts/graph.mjs`. Add tests showing that a decision value changed under the same identifier invalidates its approval, while retained historical references still resolve to the original contents.
- [x] 2.4 Implement structural readiness checks in `scripts/readiness.mjs` for the complete current step, linked units, comparison coverage, decision approvals, and required review evidence. Verify that a complete unit cannot bypass an unresolved step and that missing or indeterminate specification review cannot yield readiness.
- [x] 2.5 Document the helper interface and its structural limits in `docs/validation.md`. Verify documented examples reproduce approved findings and do not claim that a validator establishes semantic completeness or human identity.
- [x] 2.6 Record Step 2 checks and separate results review under autonomous development authorization. Preserve the versioned verification evidence for release review.

## 3. Interview and research

This step implements `request-discovery` through shared coordinator instructions and their evidence format.

- [x] 3.1 Add the interview entry workflow in `skills/vibe2spec/SKILL.md` and its references. Verify approved software and research dialogue cases first resolve outcomes, relevant constraints, and overview dependencies without inventing a topic, dataset, or method.
- [x] 3.2 Add decision grouping and question-dependency instructions. Verify dialogue cases with independent settings, dependent questions, partial grouped acceptance, silence, and uncertainty produce the specified decision statuses.
- [x] 3.3 Add research and feasibility guidance linked to evidence records. Verify cases with conflicting sources, inaccessible literature, resource limits, and a common published default preserve the distinction between evidence, recommendation, and approval.
- [x] 3.4 Incorporate the accepted writing conventions directly in the new coordinator instructions and verify their use of the accepted Step 1 templates. Document the interview in `docs/interview.md`; verify each decision explains its situation and purpose, defines unfamiliar terms, illustrates alternatives with meaningful shared input/output or before/after examples where applicable, explains benefits and drawbacks, and asks a clear selection question. Check that grouped settings retain individual explanations, non-output choices describe concrete workflow or resource consequences, examples do not invent differences or imply approval, and recommendations remain distinct from user choices. Any necessary change to an accepted template requires reopening Step 1.
- [x] 3.5 Preserve the reviewed dialogue fixtures and outcomes under `tests/fixtures/interview/`. Include cases exposing terse unexplained options, indistinguishable examples, omitted data loss or input changes, unsupported verification claims, and user uncertainty after the first explanation. Verify that corrected questions supply the missing decision context and that no example treats a recommendation, illustrative value, missing answer, or conventional default as accepted behavior.
- [x] 3.6 Record Step 3 checks and separate results review under autonomous development authorization. Preserve its verification evidence for release review.

## 4. Step authoring and diagrams

This step implements the authoring behavior in `step-specification` and the overview presentation in `host-integration`.

- [x] 4.1 Add current-step authoring instructions under `skills/vibe2spec/references/`. Verify a complete example separates behavioral requirements, method decisions, effective settings, outputs, checks, and small implementation units while preserving traceability.
- [x] 4.2 Add coverage assessment instructions and approved findings for missing defaults, threshold boundaries, shapes, errors, ordering, randomness, and relevant environment behavior. Verify each case returns to the interview before code preparation.
- [x] 4.3 Implement the approved ASCII renderer in `scripts/overview.mjs` with checks in `tests/overview.test.mjs`. Verify it displays ordered steps, the current step, future provisional steps, the repeated step cycle, reopened steps, and blocked dependencies.
- [x] 4.4 Add `docs/specification-authoring.md` and `docs/project-overview.md`. Verify examples use named SHALL or MUST requirements with WHEN/THEN scenarios and show that overview agreement does not approve future detailed settings.
- [x] 4.5 Record Step 4 checks and separate results review under autonomous development authorization. Preserve its verification evidence for release review.

## 5. Worker and reviewer protocol

This step implements `reviewed-execution`. Host-specific delegation details remain in Step 8, while the shared handoff and separate-session fallback are established here.

- [x] 5.1 Add `skills/vibe2spec-worker/SKILL.md` and handoff references. Verify the worker receives the exact complete approved current-step context and stops before implementing a missing argument, derivation, fallback, or unit behavior.
- [x] 5.2 Add `skills/vibe2spec-review/SKILL.md` with distinct specification, pre-execution, and results assessments. Verify the specification reviewer can block code preparation and cannot approve unresolved decisions for the user.
- [x] 5.3 Add prepared-work review examples covering explicit arguments, omitted defaults, environment overrides, configuration precedence, dependency changes, and altered acceptance checks. Verify findings identify the actual location and missing approved decision.
- [x] 5.4 Add run-evidence and results-review instructions. Verify mismatched input identity, incomplete settings, changed code after review, and unapproved tolerance changes cannot obtain a passing assessment.
- [x] 5.5 Add separate-session handoff and review-result validation. Verify unavailable native delegation leaves the relevant gate pending. Verify worker self-review, artifact-author self-review including a coordinator reviewing its own specification, missing evidence, and indeterminate findings cannot satisfy it.
- [x] 5.6 Document the three review phases and instruction-based control boundary in `docs/review.md`. Preserve assessed cases under `tests/fixtures/review/`; verify the documentation does not claim technical prevention or retroactive approval.
- [x] 5.7 Record Step 5 checks and separate results review under autonomous development authorization. Preserve its verification evidence for release review.

## 6. Paired unit validation

This step implements comparison helpers and the paired protocol from `reproducibility-contract`. All pairing uses approved small synthetic cases. Its detailed contract must fix the supported comparison formulas and numeric representations before code preparation.

- [x] 6.1 Implement approved byte, logical JSON, and finite-number comparisons in `scripts/compare.mjs`. Add `tests/compare.test.mjs` for alignment, ordering, boundary equality, zero references, missing and non-finite values, and unsupported numeric representations; verify exact approved outcomes without implicit tolerances or normalization.
- [x] 6.2 Add pair-handoff instructions that give two separate workers the same approved specification and saved fixture contents. Verify neither context receives the other's code or results before its own implementation is fixed, and a distinct reviewer assesses both.
- [x] 6.3 Implement comparison-record validation for contract, fixture, implementation, review, result, and resource references. Verify different saved vectors, incomplete step readiness, copied implementations, or a worker paired with its reviewer cannot establish independent paired evidence.
- [x] 6.4 Verify the approved cases where both implementations share an error and where both pass a reference check but fail the direct comparison. Preserve both individual correctness findings and the direct paired outcome.
- [x] 6.5 Add bounds and failure instructions for fixture size, call counts, execution resources, and time. Verify missing bounds and a request to exceed them return to the user without enlarging the run or starting real-data training.
- [x] 6.6 Document the protocol and supported checker scope in `docs/paired-validation.md`. Verify it distinguishes tested-unit evidence from general equivalence and from integration or scientific validation.
- [x] 6.7 Record Step 6 checks and separate results review under autonomous development authorization. Preserve its verification evidence for release review.

## 7. Completion, resume, and necessary reopening

This step implements `step-lifecycle` and connects the already defined records and reviews into the repeated project-step workflow.

- [x] 7.1 Implement the approved lifecycle checks in `scripts/lifecycle.mjs`. Add `tests/lifecycle.test.mjs` verifying that all checks, passing review, and explicit result acceptance are required before marking a step finished or starting the next step's detailed work.
- [x] 7.2 Add coordinator resume instructions and state validation. Verify another session identifies the current step, unfinished questions, accepted revisions, and pending reviews without inferring approval from a completion claim.
- [x] 7.3 Add amendment proposal and scope checks. Verify convenience-only changes do not establish necessity, every affected script has its planned edit, and proposed but unapproved changes leave completed work closed.
- [x] 7.4 Implement reopening and dependency reassessment according to the approved state contract. Verify a reopened step returns to interview and specification review, retains its old accepted revision, and suspends affected dependent work until the new revision is accepted.
- [x] 7.5 Verify direct and transitive affected evidence becomes stale for current reliance. Test expanded amendment scope, unresolved revised decisions, renewed acceptance, and project completion blocked by required stale evidence.
- [x] 7.6 Document the project loop and reopening protocol in `docs/lifecycle.md`. Verify a multi-step fixture demonstrates finishing one step, interviewing the next, reopening a necessary correction, and repeating the applicable cycle before completion.
- [x] 7.7 Record Step 7 checks and separate results review under autonomous development authorization. Preserve its verification evidence for release review.

## 8. Host packages and installation documentation

This step implements marketplace distribution responsibilities in `host-integration`. Its detailed contract fixes supported Node.js versions, host surfaces and versions, package formats, catalog identities, installation commands, update and removal behavior, and delegation before packaging work begins. It also fixes the applicable public submission materials using current official requirements.

- [x] 8.1 Add the approved Claude Code package metadata and adapter under `packaging/claude/` and its project-maintained marketplace catalog at the approved distributed location. Validate both the plugin and catalog, and verify discovery of shared skills and the separate-reviewer workflow.
- [x] 8.2 Add the approved Codex package metadata and adapter under `packaging/codex/` and its project-maintained marketplace catalog at the approved distributed location. Verify the selected format and installation surface against current host documentation without assuming Claude agent definitions are portable.
- [x] 8.3 Add package assembly and content checks under `scripts/` and `tests/packaging.test.mjs`. Verify manifest and catalog identities, release versions, all referenced templates, helpers, and assets, and absence of author-only dependencies on OpenSpec, Spec Kit, SpecViz, or a separate writing-style bundle.
- [x] 8.4 Perform actual marketplace discovery and installation checks in both approved clean host environments. Verify packaged resource resolution, runtime requirements, reviewer delegation or the required separate-session fallback, versioned update, removal, and preservation of workspace records. Record host surface, versions, package identity, catalog, and source. A development-only load cannot replace these checks.
- [x] 8.5 Write `docs/installation.md`, `docs/host-compatibility.md`, `docs/publishing.md`, and the product `README.md`. Prepare the approved public submission archives and listing materials. Verify documented installation, update, removal, capability failures, and unsupported-version behavior against observations. Distinguish project-maintained marketplace availability from official submission, approval, and published listing.
- [x] 8.6 Record Step 8 checks and separate results review under autonomous development authorization. Preserve its verification evidence for release review. External directory submission and publication follow release acceptance; preparing marketplace catalogs and submission materials is required in this step.

## 9. Release examples and integrated verification

This final group integrates components already checked in their owning steps. The exact release functions, synthetic fixtures, expected outcomes, tolerances where needed, and resource bounds receive approval in this step's specification. Required paired release examples cannot be replaced by a single implementation.

- [x] 9.1 Create approved small-unit example projects under `examples/paired-units/` and their explanatory records. Verify each has a complete contract, exact fixture identity, normal and boundary cases, invalid-input behavior, and approved direct comparison rules before either worker prepares code.
- [x] 9.2 Obtain two independent unit implementations for each selected release example and separate pre-execution reviews. Run only the approved synthetic cases; verify individual correctness, direct agreement, evidence identity, and resource bounds. Preserve actual independent worker provenance.
- [x] 9.3 Demonstrate the full multi-step workflow under `examples/project-cycle/`. Verify the sequence includes a fresh interview and specification review for each step, all three completion conditions, an explicitly reopened necessary correction, and renewed affected evidence.
- [x] 9.4 Exercise the integrated examples through both marketplace-installed host packages using the approved compatibility matrix. Verify cross-host resumption, portable records, and the same gate outcomes, including reviewer-unavailable and helper-unavailable cases.
- [x] 9.5 Deliver a release verification record linking each capability to its checks, example evidence, tested environment, and known limitations. Verify both marketplace installation routes and public submission readiness against current requirements. Report external listing status separately and avoid claims of universal equivalence from finite unit tests.
- [x] 9.6 Obtain separate final results review of the release candidate under autonomous development authorization. Verify every required deliverable and disclose remaining external publication actions. Do not invent user acceptance of unobserved results.

Marketplace submission remains a subsequent explicitly authorized action after release acceptance. Archiving these OpenSpec planning artifacts also remains separate from implementing the product.
