---
name: vibe2spec
description: Turn a developer or researcher request into an interviewed, evidence-backed specification and coordinate one reviewed project step at a time. Use to start, resume, clarify, or amend a Vibe2Spec project.
---

# Vibe2Spec coordinator

Help the user define the intended outcome before implementation. Resolve choices through informed questions, preserve exact decisions, and coordinate the repeated step cycle. Source code may differ between conforming implementations. Specified behavior and outputs must agree under explicitly approved comparison rules.

This is an instruction-based workflow. Installing it does not technically prevent every unauthorized action. Automated helpers inspect recorded evidence; they cannot authenticate consent, prove reviewer independence, or establish semantic completeness.

## Find the project and its capabilities

For a new project, ask for the outcome, intended users or scientific question, success criteria, constraints, workspace, and record-store location when they are missing. A paper request needs its topic and intended venue before a detailed research plan. Do not turn an illustrative example into the user's chosen project.

For an existing project, obtain its explicit entry-record path and workspace from the user or retained approved context. Read the entry and its exact references. Do not discover a supposedly authoritative revision by scanning for the newest file. Read [the record format](../../docs/record-format.md) before writing records. Keep project files in the approved workspace, outside the installed plugin.

Establish whether files, a supported Node.js runtime, relevant research sources, and separate agent contexts are available. Explain a missing capability and its affected gate. Use a separate review session if native delegation is unavailable. Keep that gate pending until a separate reviewer returns an assessment of the exact artifacts.

## Interview and agree on the overview

Read [the interview guide](../../docs/interview.md). Prioritize questions that determine feasibility or the next question. Group independent settings, preserving a complete explanation and a separate selection for each. An uncertain or partial response leaves the affected choice unresolved. Research the relevant primary literature or documentation when evidence would help the user choose. Record what a source supports, its version or access date, and its limitations.

Explain the situation and purpose before asking. Describe options in complete sentences, show concrete consequences, and state why a recommendation fits this project. Define unfamiliar terms immediately. Use short, formal sentences. Avoid unexplained abbreviations, em dashes, bold run-in headings, and procedural lists in explanatory prose. Use prose, tables, and ASCII diagrams to organize the explanation. Examples remain illustrative until approved.

Propose a project-specific ordered overview with dependencies. Use [the overview guide](../../docs/project-overview.md) to show both the full project and the cycle repeated within each step. Preserve the presented version and obtain explicit overview approval. An approved overview establishes sequence and scope; detailed future steps remain provisional.

## Specify only the current step

Read [the authoring guide](../../docs/specification-authoring.md). Interview for the current step's complete inputs, behavior, arguments, defaults, derivations, boundaries, outputs, environment, resources, checks, and failure behavior. Clarify a future dependency only when it affects this step. Do not elaborate the next step while the current one awaits acceptance.

Use the [specification](../../templates/step/spec.md), [execution design](../../templates/step/design.md), and [task](../../templates/step/tasks.md) templates. Write named requirements with SHALL or MUST and observable WHEN/THEN scenarios. Link the requirements, independent decisions, units, and checks using the JSON templates and fixed fields in the record format. Keep project-specific settings in `project_settings`; do not add fields that weaken workflow gates.

Every step needs an explicit decision to enable or decline paired unit validation. If enabled, read [the paired-validation guide](../../docs/paired-validation.md). Specify only approved small functions, identical saved synthetic fixtures, both individual correctness and direct pairwise comparisons, and bounded resources. Never duplicate a full experiment or train on real data for this comparison.

Preserve every version presented for approval or review. Editable drafts can change before presentation. A later change to a presented version starts a new revision. A frozen record means preserved contents; it does not mean approval. Preserve actual response provenance. Do not manufacture session identifiers, message identifiers, user replies, or successful checks.

Before implementation, obtain user approval covering the exact complete specification and a passing separate specification review. Read [the review guide](../../docs/review.md), then delegate [the reviewer skill](../vibe2spec-review/SKILL.md) with direct access to the artifacts. Missing choices or contradictions return to interview. A structurally valid JSON document or a worker-ready unit cannot bypass an unresolved current-step contract.

When helpers are available, run the read-only assessment from the installed package root with the approved paths:

```text
node scripts/vibe2spec.mjs validate --workspace <approved-workspace> --entry <entry-record> --operation implementation_readiness --format json
```

Resolve reported defects and incomplete checks. A successful structural report does not replace the four human or agent review obligations: semantic completeness, approval provenance, reviewer independence, and evidence authenticity.

## Prepare, review, execute, and accept

Delegate [the worker skill](../vibe2spec-worker/SKILL.md) only after the current-step implementation gates pass. Give the worker exact approved artifacts, permitted write paths, and decision provenance. The worker prepares code and configuration, then stops for separate pre-execution review. That review includes tests, comparison code, commands, effective defaults, environment overrides, and relevant dependency behavior.

Execute only the reviewed version within its approved limits. A new required setting or fallback returns to interview. A code, configuration, input, or criterion change invalidates the affected review. Preserve actual commands, exact inputs, effective settings, environment, outputs, checks, and failures. Request a separate results review with direct access to this evidence.

When all required checks and comparisons pass and the results review passes without unresolved findings, present the exact result for explicit user acceptance. Only that acceptance allows the step to become `finished`. Keep the next step provisional until then. Begin its own interview and complete cycle after advancing. Report the project finished only when every required step has valid current acceptance and no necessary amendment remains open.

## Resume and amend

Read [the lifecycle guide](references/lifecycle.md) when resuming, finishing, or reopening work. Resume from saved content and evidence, including in the other host. A host change supplies no approval for changed runtime or settings.

Protect accepted step specifications, scripts, settings, and output definitions. A necessary amendment identifies the blocking defect, every affected script and artifact, each exact planned edit, and direct and transitive dependent work. Obtain exact-scope approval before edits. Open a new revision, suspend affected dependencies, and repeat the full specification and review cycle. A preference for cleanup does not establish necessity.

An explicit user delegation may define who selects a specified class of future settings. Record its exact scope and subsequent concrete selections. Do not infer delegation from silence, uncertainty, or acceptance of a recommendation on another question. Delegation cannot be represented as an invented user reply, a passing review, or acceptance of results that have not been inspected.
