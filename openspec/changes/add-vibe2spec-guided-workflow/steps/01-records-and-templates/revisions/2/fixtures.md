# Step 1 fixture contract

## Representation and construction

The delivered `base.json` contains a fictional record graph. It is not execution evidence. Its top-level fields, in order, are `schema_version: 1`, `context: example`, `description: Fictional records for format verification; no real approval or execution.`, and `files`.

The `files` object maps each relative virtual path below to a descriptor with `encoding` and `content`, in that order. Encoding is `json` or `text`. JSON content is the specified parsed JSON value. Its virtual bytes are that value serialized with two-space indentation and a final line feed. Text content is the exact stated string encoded in UTF-8. The `files` keys are sorted by UTF-8 path bytes. All virtual files are embedded in `base.json`; Step 1 does not materialize them or execute their commands.

In the construction tables, `ref(name)` means a Ref whose path is the named virtual file and whose digest is SHA-256 of its virtual bytes. `snapshot_entries(names)` means the corresponding sorted path, digest, and exact-byte-size entries. `size(name)` means the virtual file's byte length. These are approved derivations proposed for this fixture, not literal JSON strings. They must be resolved in delivered `base.json`. There are no placeholder hashes or unresolved references in the positive graph. Construct dependencies before their referring records.

All record files use the envelope from `record-format.md`, with `schema_version: 1`, `revision: 1`, `project_id: example-project`, `context: example`, and `lifecycle: frozen`. Their kind and identity are given below. The default author is `{"session_id":"example-session","context_id":"example-author"}`. The worker Actor changes `context_id` to `example-worker`. The specification reviewer changes it to `example-spec-reviewer`, the pre-execution reviewer to `example-work-reviewer`, and the results reviewer to `example-results-reviewer`. Review records use their respective reviewer as author. The run record uses the worker as author. Other records use the default author. The worker authors the non-record `work` and `output` artifacts; the default author authors the other supporting files.

For readability, the tables use names as construction labels. They are not aliases allowed in the delivered reference format. Each record named `name` below is stored at `records/<kind>/<name>/r1.json`. In a record's content, field order follows the format dictionary. Objects written inline below use their displayed field order. No unlisted field or value is added.

## Supporting files

| Name and path | Encoding and exact content |
| --- | --- |
| `overview`, `artifacts/overview.md` | Text: `# Fictional copy project\n\nOne copy step. No real approval or execution is represented.\n` |
| `behavior`, `artifacts/spec.md` | Text: `# Copy vector\n\n### Requirement: preserve-vector\n\nThe step SHALL copy the vector without changing its values or order.\n\n#### Scenario: Three values\n\nWHEN the input is [1, 2, 3],\nTHEN the output is [1, 2, 3] and the input is unchanged.\n` |
| `method`, `artifacts/design.md` | Text: `# Copy contract\n\nCopy the exact approved JSON array from artifacts/input.json to artifacts/output.json. Preserve values and order. Do not mutate the input. Missing input or contents differing from the approved input stop without an output. No retry or fallback is allowed. The fictional example-copy tool performs exactly one call within the approved resource limits. Runtime is fictional-copy-1 and platform is fictional. There are no environment variables, random choices, or concurrent operations.\n` |
| `tasks`, `artifacts/tasks.md` | Text: `# Fictional tasks\n\n- [ ] 1.1 Copy the approved vector and check exact JSON equality.\n\nThis preserved task definition precedes implementation. Completion is recorded separately in acceptance and project state.\n` |
| `input`, `artifacts/input.json` | JSON array `[1, 2, 3]` |
| `output`, `artifacts/output.json` | JSON array `[1, 2, 3]` |
| `work`, `artifacts/work.txt` | Text: `Fictional prepared operation: example-copy artifacts/input.json artifacts/output.json\n` |

The `\n` sequences above represent line feeds in text content. They are escaped when embedded as JSON strings. The fictional tool is not implemented, installed, or run in Step 1. This graph demonstrates how evidence is represented, not that a real execution has been verified.

## Decision and evidence records

| Name; kind | Exact content |
| --- | --- |
| `example-source`; `evidence` | `source_uri: example:copy-contract`; `source_title: Fictional copy contract`; `source_version: 1`; `accessed_at: 2000-01-01T00:00:00Z`; `claim: This example defines an unchanged copy.`; `location: Method paragraph`; `limitations: [Fictional source; no external claim.]`. All scalar values in this row are strings. |
| `method-choice`; `decision` | `question: Use the stated unchanged-copy contract?`; `options: []`; `selection: {mode: literal, value: {operation: copy, input: artifacts/input.json, output: artifacts/output.json, comparison: exact_json, runtime: fictional-copy-1, platform: fictional}}`; `rationale: Preserve the approved vector exactly.`; `evidence_refs: [ref(example-source)]`. All literal values here are strings. |
| `resource-choice`; `decision` | `question: Use these example limits?`; `options: []`; `selection: {mode: literal, value: {max_calls: 1, max_elapsed_ms: 1000, max_input_bytes: 1024, max_output_bytes: 1024}}`; `rationale: Bound a single fictional copy operation.`; `evidence_refs: []`. The four limit values are integers. |
| `pair-choice`; `decision` | `question: Enable paired implementations for this example?`; `options: []`; `selection: {mode: literal, value: disabled}`; `rationale: This example illustrates a single fictional run.`; `evidence_refs: []`. `disabled` is a string. |

The method choice includes fixed argument paths and the exact-JSON comparison category. The linked design document defines the complete fictional method. Whole-specification approval below covers both. Resource and pairing choices are separate so partial approval can be demonstrated.

## Unit and step records

The `copy-unit` record has kind `unit`. Its content is as follows. The strings containing punctuation are literal strings.

| Field | Value |
| --- | --- |
| `name` | String `copy_vector` |
| `step_id` | String `copy-step` |
| `step_revision` | Integer `1` |
| `requirement_ids` | Array `[preserve-vector]` of strings |
| `interface` | String `Read the JSON array at artifacts/input.json and write the same JSON array at artifacts/output.json. Preserve integer values and array order. Do not mutate the input.` |
| `method` | String `Copy the exact approved array unchanged in its existing order using one fictional example-copy call. Stop without output if the input is absent or its contents differ from the approved input.` |
| `argument_decision_refs` | `[ref(method-choice)]` |
| `environment_decision_refs` | `[ref(method-choice)]` |
| `failure_rules` | String array `[Stop on missing or changed input without creating output., No retry or fallback is allowed.]` |
| `fixture_refs` | `[ref(input)]` |
| `check_ids` | String array `[same-vector]` |
| `write_paths` | String array `[artifacts/output.json]` |
| `project_settings` | Object `{copy-method: ref(method-choice)}` |

The `copy-step` record has kind `step`.

| Field | Value |
| --- | --- |
| `title` | String `Copy the approved vector` |
| `documents` | `{spec: ref(behavior), design: ref(method), tasks: ref(tasks)}` |
| `depends_on` | `[]` |
| `requirements` | One Requirement: `{id: preserve-vector, text: The step SHALL copy the vector without changing its values or order., decision_refs: [ref(method-choice)], check_ids: [same-vector]}` |
| `decision_refs` | `[ref(method-choice), ref(resource-choice), ref(pair-choice)]` |
| `input_refs` | `[ref(input)]` |
| `unit_refs` | `[ref(copy-unit)]` |
| `outputs` | One Output: `{id: copied-vector, path: artifacts/output.json, description: Unchanged approved vector., rule: {category: exact_json, array_order: preserved, object_key_order: ignored}, decision_refs: [ref(method-choice)]}` |
| `checks` | One Check: `{id: same-vector, description: Check unchanged input and output in the same order., expected: {input: [1, 2, 3], output: [1, 2, 3]}, rule: {category: exact_json, array_order: preserved, object_key_order: ignored}, decision_refs: [ref(method-choice)]}` |
| `paired_validation` | `{decision_ref: ref(pair-choice), mode: disabled, unit_ids: []}` |
| `resource_decision_refs` | `[ref(resource-choice)]` |
| `project_settings` | `{copy-method: ref(method-choice)}` |

All unquoted scalar words in these object descriptions are strings, except the explicit integers and JSON arrays of integers. Keys are exactly as shown. A table cell is a construction instruction, not permissive prose for choosing another value.

## Snapshots, approval, and reviews

| Name; kind | Exact content |
| --- | --- |
| `input-snapshot`; `snapshot` | `purpose: Fictional execution inputs`; `entries: snapshot_entries([input])` |
| `spec-snapshot`; `snapshot` | `purpose: Complete fictional specification`; `entries: snapshot_entries([overview, behavior, method, tasks, input, example-source, method-choice, resource-choice, pair-choice, copy-unit, copy-step])` |
| `spec-approval`; `approval` | `purpose: step_specification`; `snapshot_ref: ref(spec-snapshot)`; `target_paths`: every path in `spec-snapshot` entries in their sorted order; `response: {session_id: example-user-session, message_id: example-approve-spec, text: Fictional approval of all listed specification contents.}` |
| `spec-review`; `review` | `phase: specification`; `snapshot_ref: ref(spec-snapshot)`; `reviewer`: specification reviewer Actor; `artifact_authors`: `[default author]`; `workers: []`; `outcome: pass`; `findings: []` |
| `work-snapshot`; `snapshot` | `purpose: Fictional prepared work`; `entries: snapshot_entries([work, spec-snapshot, spec-approval, spec-review])` |
| `work-review`; `review` | `phase: pre_execution`; `snapshot_ref: ref(work-snapshot)`; `reviewer`: pre-execution reviewer Actor; `artifact_authors`: `[default author, specification reviewer, worker]`; `workers: [worker]`; `outcome: pass`; `findings: []` |
| `output-snapshot`; `snapshot` | `purpose: Fictional output and unchanged input after the operation`; `entries: snapshot_entries([input, output])` |

The actor names above expand to the exact Actor objects defined in the construction section. They do not appear as placeholders in the delivered JSON. Author lists include all transitively assessed authors in the format's sorted order.

## Run, comparison, acceptance, and state

The `copy-run` record has kind `run`, with the worker as author.

| Field | Value |
| --- | --- |
| `step_id`, `step_revision` | String `copy-step`, integer `1` |
| `spec_snapshot_ref`, `work_snapshot_ref`, `pre_execution_review_ref`, `input_snapshot_ref` | Respectively `ref(spec-snapshot)`, `ref(work-snapshot)`, `ref(work-review)`, `ref(input-snapshot)` |
| `commands` | `[{program: example-copy, args: [artifacts/input.json, artifacts/output.json], cwd: ., environment: []}]` |
| `effective_settings` | `[{name: copy-method, value: {operation: copy, input: artifacts/input.json, output: artifacts/output.json, comparison: exact_json, runtime: fictional-copy-1, platform: fictional}, decision_ref: ref(method-choice), source: Approved method choice.}]` |
| `environment` | `{runtime: fictional-copy-1, platform: fictional, details: Deterministic example data only; no execution occurred.}` |
| `output_snapshot_ref` | `ref(output-snapshot)` |
| `check_results` | `[{check_id: same-vector, outcome: pass, observed: {input: [1, 2, 3], output: [1, 2, 3]}, detail: Fictional output and retained input equal the approved array.}]` |
| `worker` | Worker Actor |
| `started_at`, `finished_at` | Strings `2000-01-01T00:00:00Z`, `2000-01-01T00:00:01Z` |
| `resource_use` | `{elapsed_ms: 1000, input_bytes: size(input), output_bytes: size(output), calls: 1}` |

The remaining records follow this table.

| Name; kind | Exact content |
| --- | --- |
| `copy-comparison`; `comparison` | `mode: single`; `unit_ref: ref(copy-unit)`; `input_snapshot_ref: ref(input-snapshot)`; `run_refs: [ref(copy-run)]`; `worker_contexts: [worker]`; `correctness_results: [{run_ref: ref(copy-run), results: copy-run check_results}]`, where `copy-run check_results` expands to its exact one-element CheckResult array; `pairwise_results: []`; `rules: [{check_id: same-vector, rule: {category: exact_json, array_order: preserved, object_key_order: ignored}}]` |
| `results-snapshot`; `snapshot` | `purpose: Fictional results for review`; `entries: snapshot_entries([spec-snapshot, work-snapshot, copy-run, copy-comparison, output-snapshot])` |
| `results-review`; `review` | `phase: results`; `snapshot_ref: ref(results-snapshot)`; `reviewer`: results reviewer Actor; `artifact_authors: [default author, specification reviewer, pre-execution reviewer, worker]`; `workers: [worker]`; `outcome: pass`; `findings: []` |
| `copy-acceptance`; `acceptance` | `step_id: copy-step`; `step_revision: 1`; `spec_snapshot_ref: ref(spec-snapshot)`; `work_snapshot_ref: ref(work-snapshot)`; `run_refs: [ref(copy-run)]`; `comparison_refs: [ref(copy-comparison)]`; `results_review_ref: ref(results-review)`; `response: {session_id: example-user-session, message_id: example-accept-result, text: Fictional acceptance of the assessed copy result.}` |
| `project-state`; `project` | `title: Fictional copy project`; `overview_ref: ref(overview)`; `step_order: [copy-step]`; `current_step_id: null`; `states: [{step_id: copy-step, revision: 1, state: finished, acceptance_ref: ref(copy-acceptance), amendment_ref: null, blocked_by: []}]`; `evidence_refs: [ref(spec-approval), ref(spec-review), ref(work-review), ref(copy-run), ref(copy-comparison), ref(results-review), ref(copy-acceptance)]`; `project_settings: {copy-method: ref(method-choice)}` |
| `proposed-amendment`; `amendment` | `step_id: copy-step`; `previous_acceptance_ref: ref(copy-acceptance)`; `proposed_revision: 2`; `reason: A newly required output representation cannot be supplied by the accepted artifact.`; `blocking_requirement: The revised downstream contract requires a named values field.`; `edits`: the eight Edit objects in the amendment table below; `affected_step_ids: []`; `superseded_decision_refs: [ref(method-choice)]` |
| `amendment-snapshot`; `snapshot` | `purpose: Proposed fictional amendment`; `entries: snapshot_entries([proposed-amendment])` |
| `reopen-approval`; `approval` | `purpose: reopen`; `snapshot_ref: ref(amendment-snapshot)`; `target_paths: [path(proposed-amendment)]`; `response: {session_id: example-user-session, message_id: example-approve-reopen, text: Fictional approval to reopen only the listed amendment scope.}` |

The amendment's `edits` array follows this table's order. Each object has the format's fields `path`, `operation`, `planned_change`, and `necessity`. Operation is the string `create` for every row. Necessity is the exact string `Supply the required downstream representation while preserving accepted revision 1.` for every row. The path and planned change are the exact strings below. These are planned revisions only; none of these eight files is added to the base virtual graph.

| Path | Planned change |
| --- | --- |
| `artifacts/spec-r2.md` | Specify an output object containing the unchanged vector under values. |
| `artifacts/design-r2.md` | Define wrapping the array and writing artifacts/output-r2.json. |
| `artifacts/tasks-r2.md` | Define the revised implementation and verification work without claiming completion. |
| `records/decision/method-choice/r2.json` | Propose the revised object representation and output path for user approval. |
| `records/unit/copy-unit/r2.json` | Revise the interface, method, decisions, checks, and output path for step revision 2. |
| `records/step/copy-step/r2.json` | Reference revised documents, decision, and unit; specify the object output and expected checks. |
| `artifacts/work-r2.txt` | Prepare the fictional operation specified by the revised approved contract. |
| `artifacts/output-r2.json` | Produce the revised object with the unchanged vector in its values field. |

The original project-state record remains historically finished. A separate state case below describes the reopened revision. Reopening approval is included in the fictional graph but does not rewrite that historical record or approve a revised output contract. The `affected_step_ids` array is empty because the example overview contains only the copy step. The stated downstream requirement is evidence motivating the proposed future contract, not an invented second finished step.

The base graph is a historical sequence, not a claim that its old project-state record is the latest active state. The completion assessment checks the accepted copy result at its original completion point. The later reopening assessment checks the approved amendment and the new state. A real resume operation must not infer that the old finished state remains current after the reopening approval.

## Case container and evaluation

Delivered `cases.json` has fields `schema_version: 1`, `context: example`, and `cases`, in that order. Each case has fields `id`, `description`, `changes`, `reference_policy`, `assessment`, and `expected_codes`, in that order. Case order follows the table below. Description is the table's description verbatim.

Each Change has `file`, `target`, `pointer`, `operation`, and `value`, in that order. File is the exact virtual path. Target is `file`, `envelope`, or `content`. Pointer is an array of object-key strings or nonnegative array indices leading into the selected target; an empty array addresses the complete target. Operation is `set` or `remove`. A remove has `value: null`. Each case starts from the untouched base graph, not from the previous case. Values shown below are exact JSON values or the specified expanded Ref or Actor.

For `reference_policy: rebuild`, recompute existing references and snapshot sizes after applying the changes, in dependency order. References to deliberately absent targets retain their prior path and digest so that absence can be assessed. For `reference_policy: preserve`, leave reference values and manifests unchanged. Neither policy represents permission to rewrite actual historical evidence; both construct separate fictional test cases.

Assessment is `structure`, `references`, `approval`, `reviews`, `completion`, `reopening`, or `representation`. It scopes the expected findings, so a fixture deliberately testing one gate does not claim to test every later gate. Findings are unique code strings sorted by UTF-8 order. `expected_codes` is the exact set for that assessment. Example context always makes a real-project authorization request fail with `example-only`; this universal restriction is recorded separately from the scoped expected codes.

| ID | Description | Exact changes | Reference policy | Assessment | Expected codes |
| --- | --- | --- | --- | --- | --- |
| `complete-example` | Coherent fictional accepted result. | `[]` | rebuild | completion | `[]` |
| `unknown-field` | Reject an undeclared workflow field. | Set `project-state` at `[review_stats]` to string `pass` | rebuild | structure | `[unknown-field]` |
| `missing-value` | Preserve an unresolved draft without readiness. | Set `method-choice` envelope `lifecycle` to `draft`; set its content `[selection]` to null | rebuild | approval | `[unresolved-decision]` |
| `partial-approval` | Group approval leaves the resource choice unapproved. | Set `spec-approval` content `[target_paths]` to the base array with `path(resource-choice)` removed | rebuild | approval | `[unapproved-decision]` |
| `missing-reference` | Report an absent referenced artifact. | Remove virtual file `artifacts/input.json` | preserve | references | `[missing-reference]` |
| `changed-decision` | Changed bytes cannot retain earlier approval. | Set `method-choice` content `[selection, value, operation]` to string `reverse` | preserve | references | `[digest-mismatch]` |
| `conflicting-prose` | Readable and structured methods conflict. | Set `method` text content to `# Copy contract\n\nReverse the array before writing the output.\n` | rebuild | representation | `[representation-conflict]` |
| `missing-pair-decision` | A step must record its pairing decision. | Set `copy-step` envelope `lifecycle` to `draft`; set its content `[paired_validation]` to null | rebuild | approval | `[missing-pair-decision]` |
| `self-review` | An artifact author cannot supply its own separate review. | Set `spec-review` envelope `[author]` and content `[reviewer]` to the default author Actor; set `work-review` content `[artifact_authors]` to `[default author, worker]`; set `results-review` content `[artifact_authors]` to `[default author, pre-execution reviewer, worker]` | rebuild | reviews | `[review-not-independent]` |
| `indeterminate-review` | An indeterminate assessment cannot pass a gate. | Set `spec-review` content `[outcome]` to string `unable_to_determine` | rebuild | reviews | `[review-not-passing]` |
| `stale-review` | Changed prepared work invalidates its prior review. | Set `work` text to `Fictional changed operation: reverse the vector.\n` | preserve | references | `[digest-mismatch]` |
| `missing-acceptance` | Checks and review cannot replace user acceptance. | Set `project-state` content `[states, 0, acceptance_ref]` to null | rebuild | completion | `[missing-acceptance]` |
| `expanded-amendment` | An extra modification needs a new reopening approval. | Set `proposed-amendment` content `[edits]` to its eight base edits followed by `{path: artifacts/extra.txt, operation: create, planned_change: Add an extra output., necessity: Newly discovered requirement.}` | preserve | reopening | `[amendment-scope-changed]` |
| `reopened-state` | Reopening returns the affected step to specification. | Set `project-state` content `[current_step_id]` to `copy-step`; set `[states]` to `[{step_id: copy-step, revision: 2, state: reopened, acceptance_ref: null, amendment_ref: ref(proposed-amendment), blocked_by: []}]`; append `ref(reopen-approval)` to its base `evidence_refs` | rebuild | reopening | `[]` |

A file removal uses `target: file`, `pointer: []`, `operation: remove`, and `value: null`. Envelope changes use the indicated envelope field. All other changes use `target: content`, including replacement of a text file's content. Multiple changes in a table row become multiple Change objects in the written order. Appending is expressed as setting the complete resulting array. `file` and all reference values are expanded to exact paths and digests in the delivered case container.

## Additional representation examples

Step 1 also needs to show that paired comparisons and suspended dependencies can be recorded without claiming they occurred. These examples appear as two additional cases in `cases.json`, after the cases above. Their assessment is `representation`, their reference policy is `rebuild`, and their expected codes are `[incomplete-example]`.

The `paired-draft` description is `A draft can request paired evidence without fabricating a second run.` Its changes set the `copy-comparison` envelope lifecycle to `draft`, its content mode to `paired`, its `run_refs` to null, its `worker_contexts` to null, and its `pairwise_results` to null. The absence of a second worker remains unresolved. This is a representation example, not paired implementation evidence.

The `suspended-draft` description is `A draft can identify a suspended dependent step without inventing its accepted contract.` Its changes set `project-state` lifecycle to `draft`, its `step_order` to `[copy-step, later-step]`, its `current_step_id` to `copy-step`, and its `states` to a reopened copy-step state followed by `{step_id: later-step, revision: 1, state: suspended, acceptance_ref: null, amendment_ref: null, blocked_by: [copy-step]}`. The reopened copy-step state is the one in `reopened-state`. Its `evidence_refs` are the base list followed by `ref(reopen-approval)`. The later step is explicitly unresolved. This case tests representation only, not dependency-completion validation.

## Fixture README

The delivered README has exactly the following contents, with a final line feed:

```markdown
# Record-format fixtures

These files contain fictional examples. Their approvals, reviews, commands, and results do not authorize or describe real project execution.

base.json contains a virtual file graph with exact record contents and content references. cases.json defines independent modifications of that graph and the expected finding categories for each named assessment. No case is applied to the user's actual project files.

The complete example illustrates one fictional copy operation. The draft examples preserve missing information explicitly. Step 1 performs no paired implementation and does not execute the commands stored in these records.

Use the approved Step 1 fixture contract for construction and interpretation. Actual helpers and automated fixture evaluation are implemented in later approved steps.
```
