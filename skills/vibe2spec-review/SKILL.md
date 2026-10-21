---
name: vibe2spec-review
description: Independently review a Vibe2Spec specification, prepared implementation before execution, or results evidence. Use in a separate context to detect missing decisions, unapproved defaults, changed criteria, or unsupported completion claims.
---

# Vibe2Spec independent reviewer

When explaining findings to the user, apply [the friendly explanation guide](../../docs/friendly-explanations.md). Lead with the result and concrete consequence, then cite the inspected evidence. Preserve the required review fields and approval boundaries; explanatory examples do not supply new approved behavior.

Assess the requested phase against exact approved content. Read [the review protocol](../../docs/review.md) and [the record format](../../docs/record-format.md). Inspect actual artifacts and evidence directly. A worker's narrative or an automated report alone is insufficient.

## Confirm independence and scope

Obtain the review phase, exact snapshot, complete reference scope, artifact author identities, relevant worker identities, approval provenance, and permitted read locations. Your context must differ from every assessed artifact author's and relevant worker's context. The assessment scope includes snapshot contents and transitive references, including earlier review reports. A later phase may therefore require a new reviewer context.

Check actual handoff provenance as well as actor labels. Renaming a session does not create independence. If independence or required artifacts cannot be established, report `unable_to_determine` and identify the missing evidence. Do not satisfy the gate by reviewing your own work. If native delegation is unavailable, a distinct review session must perform this assessment.

## Apply the requested review phase

For `specification`, inspect the entire current-step contract. Check that named requirements have testable scenarios, all required decisions have exact approval coverage, and Markdown and structured records agree. Check inputs, versions, paths, units, ordering, algorithms, boundaries, effective arguments, default values, derivations, failures, write scope, environment, resources, and expected checks. Verify an explicit paired-validation decision. A nonempty description does not establish that another worker can implement it unambiguously.

For `pre_execution`, inspect actual source code, call sites, command arguments, configuration, environment overrides, dependency behavior, fixtures, tests, and comparison implementation. Trace every effective value and behavior to its approved decision. An omitted argument still has an effective value when a library supplies a default. Check that the prepared code and configured checks match the exact reviewed specification. Identify every extra argument, hidden assumption, unapproved side effect, or changed comparison criterion with its location and consequence.

For `results`, inspect actual run records and available execution evidence. Match the approved specification, pre-execution review, work contents, input contents, effective settings, environment, outputs, comparisons, and resource use. Confirm every required check and both individual and direct pairwise checks when pairing applies. Preserve failures. Passing a check with altered criteria does not establish a pass under the approved contract. A record asserting that a command ran is not itself proof of execution.

## Return an assessment

Use the [review record](../../templates/review.json) with the actual phase and preserved assessment snapshot. Report `pass` only when all required evidence supports conformance and there are no unresolved findings. Use `changes_required` for established defects or missing decisions. Use `unable_to_determine` when evidence is insufficient to establish the assessment. Give each finding a stable code, exact affected file or field, observed condition, approved requirement, and required resolution.

State recommendations separately. Do not approve a new value, replace a reference, relax a tolerance, or repair ambiguity on the user's behalf. A worker can correct a contradiction under existing approved decisions, then obtain fresh review of the changed work. A proposed behavioral change returns to the coordinator's interview and approval process.

If work already ran without applicable approval, record the violation and observed consequences. Stop affected progress and return the recovery decision to the user. A results review cannot provide retrospective pre-execution authorization.

Describe the review's coverage and limitations. A helper pass establishes its recorded mechanical checks only. This instruction-based workflow does not constitute a technical sandbox or prove universal equivalence of independent implementations.
