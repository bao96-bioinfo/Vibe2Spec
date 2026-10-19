# Independent review and execution evidence

Vibe2Spec uses three review phases. Each assesses exact preserved content in a context separate from the material's authors and relevant workers. A phase passes only when its required evidence supports conformance and no finding remains unresolved. The protocol is instruction based. It does not technically intercept every tool call.

| Phase | Materials inspected directly | Question resolved |
| --- | --- | --- |
| Specification | Complete current-step documents, decisions, approvals, unit interfaces, fixtures, comparison rules, resources, and prerequisite acceptances | Can a worker implement the approved behavior without choosing missing settings or criteria? |
| Pre-execution | Actual prepared source, calls, commands, configuration, effective defaults, environment overrides, dependency behavior, fixtures, tests, and comparison code | Does this exact prepared work follow every relevant approved choice before it runs? |
| Results | Exact work and input identities, actual execution evidence, settings, environment, outputs, checks, comparisons, failures, and resource use | Did the actual run follow the reviewed contract and satisfy its specified checks? |

The specification review occurs before code preparation. User approval and the passing review must cover the same complete version. Pre-execution review occurs before running prepared work, including its tests and comparison scripts. Results review occurs after execution and before explicit user acceptance. A check performed after an action cannot authorize that action retroactively.

## Build a direct, versioned handoff

The coordinator supplies the reviewer with a Markdown handoff and exact referenced artifacts. The handoff identifies the review phase, workspace, allowed read locations, snapshot, target step revision, decisions and responses, prior reviews, run evidence when applicable, and author and worker identities. It distinguishes records from commands to execute. The reviewer reads actual source and evidence; summaries serve only as navigation.

```text
Review phase: pre_execution
Target: <step identity and revision>
Workspace: <explicit approved location>
Assessment snapshot: <exact path and SHA-256 digest>
Complete specification: <exact snapshot reference>
Approval responses: <actual source references>
Prepared source, configuration, commands, checks: <snapshot entries>
Artifact authors: <actual session and context identities>
Relevant workers: <actual session and context identities>
Permitted reads: <workspace scope and approved external files>
Requested output: review record and explanatory findings
Execution: do not execute the prepared step during this review
```

The displayed angle-bracket values are handoff placeholders, not usable project evidence. Fill them with actual available information. Missing identity or response provenance remains unresolved. Do not invent a message identifier to make a record structurally complete.

Preserve the exact assessment snapshot. Trace its entries and referenced evidence transitively. The author list includes authors of earlier review records within that scope. The reviewer cannot share a context identity with any assessed author or relevant worker. A new session label for the same context does not create independence. Later phases may therefore need new reviewers.

If the host supports delegation, launch a separate reviewer with the shared reviewer skill and the actual handoff. If delegation is unavailable, present the handoff for a separate review session. Keep the gate pending. A coordinator adopting a reviewer role in its existing context does not satisfy the independence requirement.

## Inspect effective settings

The worker prepares a setting inventory, and the reviewer checks it against actual use sites. Inventory entries describe every explicit argument, omitted-argument default, configuration setting, environment override, and approved derivation that supplies an execution value or changes behavior.

| Setting | Actual source and use | Approved value or derivation | Review consequence |
| --- | --- | --- | --- |
| Filtering boundary | A call evaluates `value >= threshold` | Decision specifies inclusive retention | Compare the actual operator and threshold source with the exact decision |
| Random seed | A library creates its own seed because the argument was omitted | No decision supplies a seed policy | Report the unresolved effective setting before execution |
| Worker count | An environment variable overrides a configuration file | Decision requires one worker | Report the discrepancy even if the command text matches the plan |
| Numerical tolerance | A test imports a helper with a default tolerance | Decision specifies an explicit threshold | Inspect the helper's actual effective value and comparison boundary |
| Retry source | Error handling downloads an alternate dataset | No fallback decision exists | Report the unapproved input substitution |

An extra function argument needs a specification entry even when it appears harmless. Local implementation choices that do not alter approved behavior, arguments, side effects, or reproducibility constraints can differ across implementations. Review the boundary carefully: source-code identity is not required, but unresolved behavior cannot be concealed as coding style.

## Describe findings and remedies precisely

Use `changes_required` for a confirmed defect or unresolved decision. Use `unable_to_determine` when missing evidence prevents an assessment. Use `pass` only with complete required evidence and no unresolved findings. Identify the file or field, observed behavior, applicable requirement, and decision or correction needed.

For example: “`src/filter.mjs:18` sorts retained values before returning them. Decision `output-order` approves preservation of input order. Remove the sorting operation under that existing decision, then preserve and review the corrected work before execution.” This remedy does not introduce a new choice.

A proposed new behavior has a different resolution: “The source lacks a rule for numeric strings. Decide whether to reject, discard, or explicitly convert them, with the resulting error or conversion rules. Return the current step to interview before implementing that behavior.” The reviewer cannot choose the remedy for the user.

## Assess results without rewriting history

Match the actual run's implementation, inputs, commands, effective settings, environment, and outputs with the reviewed versions. Check actual evidence of execution when available. A run record is a declaration that needs supporting observations. Missing logs or identity associations can prevent a pass even when an output looks plausible.

Check every approved criterion. Paired evidence needs each implementation's correctness results and direct comparisons between their outputs. An output that passes a relaxed tolerance does not pass its original rule. Preserve original failures, then record a legitimate revised criterion under a new approved version with fresh applicable verification.

If an unapproved action already occurred, record what happened and the observed consequence. Stop affected progress and request a recovery decision. Do not describe the action as previously authorized. Acceptance follows successful checks and a passing results review; it does not substitute for either.

## Verification limits

Automated helpers can assess structured fields, fingerprints, approval coverage, and recorded relationships. They cannot determine whether an explanation fully settled a scientific choice, whether a human actually authored a response, or whether two labeled contexts were truly separate. The reviewer must inspect those obligations explicitly. Static package tests confirm available references and fixture integrity. They do not establish that every model will obey the instructions.
