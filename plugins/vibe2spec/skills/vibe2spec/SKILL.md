---
name: vibe2spec
description: Turn a developer or researcher request into an interviewed, evidence-backed specification and coordinate one reviewed project step at a time. Use to start, resume, clarify, or amend a Vibe2Spec project.
---

# Vibe2Spec coordinator

Help the user define the intended outcome before implementation. Resolve choices through informed questions, preserve exact decisions, and coordinate the repeated step cycle. Source code may differ between conforming implementations. Specified behavior and outputs must agree under explicitly approved comparison rules.

This is an instruction-based workflow. Installing it does not technically prevent every unauthorized action. Automated helpers inspect recorded evidence; they cannot authenticate consent, prove reviewer independence, or establish semantic completeness.

## Find the project and its capabilities

For a new project, begin with the next missing fact that determines the direction, using a situation the user recognizes. Keep an internal list covering the outcome, intended users or scientific question, success criteria, constraints, workspace, and record-store location. Resolve these as they become relevant; do not read the list out as a questionnaire. A paper request needs its topic and intended venue before a detailed research plan. Do not turn an illustrative example into the user's chosen project.

For an existing project, obtain its explicit entry-record path and workspace from the user or retained approved context. Read the entry and its exact references. Do not discover a supposedly authoritative revision by scanning for the newest file. Read [the record format](../../docs/record-format.md) before writing records. Keep project files in the approved workspace, outside the installed plugin.

Inspect available files, runtime, research tools, and separate agent contexts where permitted. Ask the user only for information or choices that inspection and applicable approved context cannot supply. Explain a missing capability through its effect on the work. Use a separate review session if native delegation is unavailable. Keep that gate pending until a separate reviewer returns an assessment of the exact artifacts.

## Interview and agree on the overview

Read [the interview guide](../../docs/interview.md). Before asking, reuse answers already settled by applicable approved context and retain their provenance. Distinguish those answers from examples, drafts, recommendations, and guesses. Clarify conflicting or no-longer-applicable approvals without reopening unrelated choices.

Introduce one unfamiliar decision at a time. Match the user's demonstrated vocabulary and explain what each choice changes in their work. Prioritize feasibility and decisions that determine the next question. Group only independent settings the user already understands; preserve separate selections and leave partial or uncertain answers unresolved. Keep the coverage checklist and later technical questions internal.

Explain the situation and observable consequences before asking one focused selection question. For that decision, give a recommendation grounded in established project facts or evidence before asking the user to choose. If those facts do not support a recommendation, explain what is missing and ask the focused question needed to resolve it. A later recommendation about a different setting does not complete this explanation. Research primary literature or documentation when it would help the user choose, recording supported claims, versions or access dates, and limitations. Examples remain illustrative until approved.

When explaining technical material or a choice, read and apply [the friendly explanation guide](../../docs/friendly-explanations.md). Answer a specific question with one bold sentence first; use a short Big Picture for unfamiliar-topic onboarding. Explain why before how, connect necessary jargon to concrete meanings while retaining the source terms, and follow supplied material in its original order. Use short paragraphs, labeled lists, and comparison tables as appropriate. Inspect local sources before giving counts or file-linked claims, and interpret numbers without inventing success criteria. This explanation style supersedes earlier no-bold and no-list conventions while preserving exact specification and approval requirements.

When the user is confused, change the explanation or example and show the consequence directly. Summarize understood behavior for correction before moving on when meaning is uncertain. A summary is not approval. Translate approved meaning into precise records without adding unstated values; present any additional detail for approval before implementation.

Propose a project-specific ordered overview with dependencies. Use [the overview guide](../../docs/project-overview.md) to show both the full project and the cycle repeated within each step. Preserve the presented version and obtain explicit overview approval. An approved overview establishes sequence and scope; detailed future steps remain provisional.

## Specify only the current step

Read [the authoring guide](../../docs/specification-authoring.md). Use its internal coverage checklist to settle the current step's complete inputs, behavior, arguments, defaults, derivations, boundaries, outputs, environment, resources, checks, and failures. Reuse applicable approvals and scoped delegation before asking about a remaining gap. Explain each gap as a choice about observable behavior, not as a record field to fill. Clarify a future dependency only when it affects this step. Do not elaborate the next step while the current one awaits acceptance.

Use the [specification](../../templates/step/spec.md), [execution design](../../templates/step/design.md), and [task](../../templates/step/tasks.md) templates. Write named requirements with SHALL or MUST and observable WHEN/THEN scenarios. Link the requirements, independent decisions, units, and checks using the JSON templates and fixed fields in the record format. Keep project-specific settings in `project_settings`; do not add fields that weaken workflow gates.

Every step needs an explicit decision to enable or decline paired unit validation. If enabled, read [the paired-validation guide](../../docs/paired-validation.md). Specify only approved small functions, identical saved synthetic fixtures, both individual correctness and direct pairwise comparisons, and bounded resources. Never duplicate a full experiment or train on real data for this comparison.

Preserve every version presented for approval or review. Editable drafts can change before presentation. A later change to a presented version starts a new revision. A frozen record means preserved contents; it does not mean approval. Preserve actual response provenance. Do not manufacture session identifiers, message identifiers, user replies, or successful checks.

Before implementation, obtain user approval covering the exact complete specification and a passing separate specification review. Read [the review guide](../../docs/review.md), then delegate [the reviewer skill](../vibe2spec-review/SKILL.md) with direct access to the artifacts. Missing choices or contradictions return to interview. A structurally valid JSON document or a worker-ready unit cannot bypass an unresolved current-step contract.

Use one consolidated reviewer per phase and a [compact handoff](../../templates/review-handoff.md); do not copy the entire conversation into each review. Plan one full assessment and one correction assessment per phase unless applicable user-approved limits say otherwise. Manage all reviewer dispatch centrally. If blockers remain at the limit, report them and request an explicit budget extension or narrower scope; never infer a pass. For a correction, follow [review continuation](../../docs/review-continuation.md): preserve the baseline, keep the complete current snapshot, reuse explicit passing coverage only when still applicable, and check the fixes plus affected dependencies. Continue with the same independent reviewer when available; a replacement receives the durable evidence instead of an unbounded transcript.

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
