# Vibe2Spec record format, version 1

## Scope and terms

A record is a JSON object with the envelope and kind-specific content defined here. A revision is one identified version of a record. A snapshot is a record listing exact file contents by path, size, and digest. A digest is a SHA-256 fingerprint of the complete file bytes. A reference identifies a target path and its digest.

This format represents decisions and evidence. It does not itself enforce tool permissions or authenticate a human response. A separate reviewer checks the underlying artifacts and response provenance. Example records describe fictional events and cannot authorize real work.

## Common envelope

All fields in each table are required and appear in the listed order. Objects are closed: an unlisted field is invalid. Arrays preserve order. An empty array is a specified empty collection; it is not an unresolved value. All identifiers are case-sensitive.

| Field | Type | Meaning |
| --- | --- | --- |
| `schema_version` | Integer, exactly `1` | Format version; any other value is unsupported |
| `kind` | Enumerated string | One of `project`, `decision`, `evidence`, `approval`, `step`, `unit`, `review`, `run`, `comparison`, `acceptance`, `amendment`, `snapshot` |
| `id` | Identifier | Stable identity within a project |
| `revision` | Positive safe integer | Version of this identity, starting at 1 |
| `project_id` | Identifier | Project to which this record belongs |
| `context` | `authoring`, `example`, or `project` | Separates blank templates, fictional demonstrations, and actual project evidence |
| `lifecycle` | `draft` or `frozen` | Drafts are editable; frozen contents are preserved |
| `author` | Actor | Context that authored this record |
| `content` | Object for the declared kind | All kind-specific fields |

An Identifier matches `[a-z][a-z0-9-]*` and has at most 80 characters. The pair `(id, revision)` is unique within one project record graph. After a version is preserved, the next editable version increases its revision by one from the greatest preserved revision. This applies to preserved drafts and frozen records. An identity cannot change kind or project. New independent records begin at revision 1.

An Actor has `session_id` and `context_id`, both nonempty strings. Both fields identify the actual session and context when available. Missing provenance remains unresolved. Fictional actors use explicit `example-` prefixes. Template actors use `template-session` and `template-author`.

Strings are Unicode strings. Workflow integer fields range from 0 through 9007199254740991 unless a field imposes a stricter lower bound. General JSON values may be strings, booleans, null, arrays, objects, or finite numbers. An integer outside the safe range is represented as a string with its meaning specified in the approved decision. A checker must not silently round an unsupported numeric representation. The Step 1 fixtures use only small integers.

## Drafts, frozen revisions, and readiness

In a draft, a declared content field may be null to mean unresolved. The envelope remains complete. A null content object is invalid because its field inventory would be absent. Nested unresolved content may also be null. Unknown fields remain invalid in drafts. Template records use `context: authoring` and cannot pass a project gate.

In a frozen record, required fields and nested fields must satisfy their declared types. Null is allowed only where this document explicitly permits it or as a literal value inside a decision selection. Freezing means preserving contents, not approving them. A frozen recommendation without user approval remains a recommendation.

Before presenting a version for user approval or separate review, the coordinator preserves the exact files and a snapshot of them. Later edits occur in a draft for a new revision. Frozen versions and their response or review records remain retrievable. Intermediate drafts that were never presented or reviewed need not be preserved.

A snapshot may preserve an incomplete record with `lifecycle: draft`. Preservation makes those particular bytes immutable; it does not resolve missing values or change the lifecycle to frozen. The preserved draft remains unready. Completing its contents or changing its lifecycle requires a new editable revision. Thus presentation history includes unresolved interview material without inventing approval or completeness.

Record validity, approval coverage, and implementation readiness are separate assessments. A structurally valid record can be unapproved. An approved unit cannot authorize implementation while its current-step contract is unresolved. A required missing value, approval, or passing separate specification review keeps implementation blocked.

## References and storage

A FilePath is a nonempty UTF-8 string. A relative FilePath resolves from the user-selected workspace root, which contains ordinary project code and data. An external FilePath is absolute, either beginning with `/` on a POSIX system or with an uppercase drive letter and `:/` on a drive-based system. The workspace location and every external location require applicable explicit approval before use. The format does not infer a machine path from another machine's root. Network-share paths and other path forms remain unsupported until a separately approved format revision defines them.

All FilePaths use `/` between segments. After an absolute root prefix, they have no empty, `.`, or `..` segment, backslash, or trailing slash. Paths inside the workspace use their relative form; an absolute spelling of the same location is an invalid alias. References resolve from the workspace, never from the directory of the referring record. Paths are case-sensitive; two paths differing only in case are rejected for portability. An artifact and every ancestor directory must be nonsymbolic. A DirectoryPath follows the same rules, with `.` additionally allowed for the workspace root and an absolute root prefix allowed on its own.

A Ref has two fields in order: `path`, a FilePath, and `sha256`. Its target is an ordinary file at that exact location. External artifacts can remain at an approved external location. Their retained versions must remain available at the referenced paths with the stated bytes. A mutable working file needs a separately preserved version before it can serve as historical approval evidence. No copying into the record store is required by the format itself.

The `sha256` value is 64 lowercase hexadecimal characters computed from the exact target bytes. There is no `latest` reference, wildcard reference, or automatic fallback to a different revision. A mismatched digest, absent file, target of the wrong kind, or cross-project reference is invalid. References among record files must form an acyclic graph. Domain dependency edges also must not form a cycle.

The record store is a user-approved directory inside the workspace, normally `.vibe2spec/`. It is distinct from the workspace root. Within the store, drafts reside under `drafts/`, preserved records under `records/<kind>/<id>/r<revision>.json`, and preserved supporting documents under `artifacts/`. References include the store's workspace-relative prefix. The project index can identify the current project revision, but it is not authoritative evidence and cannot be referenced by an approval snapshot. A future approved location decision supplies the workspace and store paths; these conventions supply no implicit location approval. The fictional fixture container is its own virtual workspace and stores records directly under `records/`. It makes no claim about a real filesystem root.

No record contains a digest of itself. Decisions, contracts, and work snapshots contain no back-reference to their later approval, review, or acceptance. Those later records point to the earlier contents. State is recorded in a later project revision. This direction prevents circular fingerprints and keeps the approved content unchanged.

## Shared nested types

| Type | Fields in order and constraints |
| --- | --- |
| Response | `session_id`, `message_id`, `text`, all nonempty strings; preserve the actual user response, or clearly fictional example text |
| Requirement | `id` Identifier, `text` nonempty string, `decision_refs` array of decision Refs, `check_ids` array of Identifiers |
| Check | `id` Identifier, `description` nonempty string, `expected` JSON value, `rule` Rule, `decision_refs` array of decision Refs |
| Output | `id` Identifier, `path` FilePath, `description` nonempty string, `rule` Rule, `decision_refs` array of decision Refs |
| Finding | `code` Identifier, `path` string identifying the affected file or field, `message` nonempty string |
| CheckResult | `check_id` Identifier, `outcome` `pass`, `fail`, or `unable_to_determine`, `observed` JSON value, `detail` nonempty string |
| EffectiveSetting | `name` nonempty string, `value` JSON value, `decision_ref` decision Ref, `source` nonempty string |
| Command | `program` nonempty string, `args` array of strings, `cwd` DirectoryPath, `environment` array of EffectiveSetting |
| Edit | `path` FilePath, `operation` `create`, `modify`, or `remove`, `planned_change` nonempty string, `necessity` nonempty string |
| ResourceUse | `elapsed_ms` nonnegative safe integer, `input_bytes` nonnegative safe integer, `output_bytes` nonnegative safe integer, `calls` nonnegative safe integer |

Command arguments are literal strings. Their interpretation, including any paths relative to the command's working directory, belongs in the approved method. Command values are data. Loading a record must never execute them.

A Rule is one of three closed objects. Exact-byte rules have only `category: exact_bytes`. Exact-JSON rules have `category: exact_json`, `array_order: preserved`, and `object_key_order: ignored`. Their numbers are compared exactly as supported values; there is no tolerance. Numerical rules have `category: numerical`, `metric`, `tolerance`, `boundary`, `zero_policy`, `nonfinite_policy`, `alignment`, and `checker_ref`. Here `metric`, `zero_policy`, `nonfinite_policy`, and `alignment` are nonempty complete definitions; `tolerance` is a nonnegative finite number or a precisely interpreted decimal string; `boundary` is `inclusive` or `exclusive`; and `checker_ref` identifies an approved checker artifact. Numerical rules require explicit user approval and a separate semantic review. A format-valid string does not establish that its mathematical meaning is sufficiently specified.

The only open field-name namespace for project-defined settings is `project_settings`. Its keys are Identifiers and its values are decision Refs. The map may be empty. Every referenced decision still needs applicable user approval before the setting is used. Objects inside a decision's literal value are data whose meaning must be specified and approved. They cannot add workflow fields or override a gate.

## Project records

| Content field | Type and constraint |
| --- | --- |
| `title` | Nonempty string |
| `overview_ref` | Ref to the readable ordered overview |
| `step_order` | Nonempty array of unique step Identifiers |
| `current_step_id` | Identifier in `step_order`, or null only when all required steps are finished |
| `states` | Array of StepState, exactly one per step in `step_order` order |
| `evidence_refs` | Array of Refs to relevant approval, review, run, comparison, acceptance, and amendment records |
| `project_settings` | Project-settings map |

A StepState has `step_id`, `revision`, `state`, `acceptance_ref`, `amendment_ref`, and `blocked_by`, in that order. Revision is a positive safe integer. The state is one of `provisional`, `interviewing`, `awaiting_specification`, `ready_to_implement`, `awaiting_pre_execution_review`, `ready_to_execute`, `awaiting_results_review`, `awaiting_acceptance`, `finished`, `reopened`, or `suspended`. `acceptance_ref` is an acceptance Ref or null when no acceptance applies. `amendment_ref` is an amendment Ref or null when no amendment applies. `blocked_by` is an array of step Identifiers.

The state revision identifies the step record with that identity and revision in the project graph. A provisional, interviewing, or reopened revision may not yet have a step record. An awaiting-specification revision must have at least a draft step record. Every ready, execution, results, acceptance, or finished state requires the exact frozen step record. A draft project may represent a suspended revision whose contract is still unresolved. A complete suspended state identifies its affected contract and dependency evidence.

For every active state, `current_step_id` is the first step in `step_order` that is not finished. That current step cannot be provisional or suspended; it must be brought into interviewing or reopened state before this complete project record is published. Later steps are provisional or suspended. Earlier steps are finished. An all-finished project has `current_step_id: null`. An unresolved overview remains a draft and cannot establish readiness.

`blocked_by` contains unique existing step identities, excludes the step itself, and is nonempty only for suspended steps. It lists the direct reopened or suspended dependencies blocking the step. Following these dependency links must reach a reopened step without a cycle. A finished state has an acceptance for its exact revision. Every unfinished state has `acceptance_ref: null`; historical acceptance remains accessible through evidence or the amendment. `amendment_ref` is null for an initial revision. A reopened revision and its subsequent states retain the approved amendment reference through its eventual acceptance.

The table defines the evidence required for each state. Evidence must be reachable through `evidence_refs` and their references, match the stated revision and exact snapshots, and satisfy the applicable user approvals. A claimed state with missing evidence cannot authorize its activity. This dictionary defines record meaning; transition automation is a later implementation step.

| State | Meaning and required evidence |
| --- | --- |
| `provisional` | Later step in an approved overview; detailed choices and contract remain unresolved |
| `interviewing` | Current step's required choices are being resolved; the overview is approved; no implementation is authorized |
| `awaiting_specification` | A draft or complete current-step package exists; user specification approval, passing separate specification review, or both remain pending |
| `ready_to_implement` | Complete frozen specification, approval covering its entire required scope, passing separate specification review, explicit pairing decision, and accepted current dependencies |
| `awaiting_pre_execution_review` | Ready-to-implement evidence plus preserved prepared work; a passing separate pre-execution review for that work remains pending |
| `ready_to_execute` | Ready-to-implement evidence and prepared-work snapshot plus a passing separate pre-execution review covering its actual code, commands, and effective settings |
| `awaiting_results_review` | Exact run and output evidence after an authorized execution; check failures remain visible; results assessment is pending or has unresolved findings |
| `awaiting_acceptance` | All required checks and comparisons pass; separate results review passes for those exact results; explicit user result acceptance remains pending |
| `finished` | All awaiting-acceptance evidence plus explicit user acceptance for the exact step revision and results |
| `reopened` | Previously finished step, necessary amendment, exact-scope reopening approval, and new revision; its affected choices require interview and specification again |
| `suspended` | A dependent step has stale evidence because an upstream step was reopened; `blocked_by` and dependency evidence identify that cause; old acceptance cannot establish a current pass |

Approved task documents define required work and retain their original checkbox contents. Task progress is recorded separately in later project and acceptance evidence or a mutable tracker excluded from the approved specification snapshot. Updating progress must not mutate the approved task definition.

## Decision records

| Content field | Type and constraint |
| --- | --- |
| `question` | Nonempty user-facing question |
| `options` | Array of objects with `id`, `label`, and `explanation`, each a nonempty string; option identities are unique |
| `selection` | Selection object, or unresolved null in a draft |
| `rationale` | Nonempty explanation of the proposed or selected choice |
| `evidence_refs` | Array of evidence Refs; empty means no external evidence is claimed |

A literal Selection has `mode: literal` and `value`, a JSON value. A derived Selection has `mode: derived`, `expression`, a complete nonempty definition, and `input_refs`, an array of decision Refs. An inapplicable Selection has `mode: inapplicable` and `reason`, a nonempty explanation. Each selection object is closed for its mode. There is no built-in evaluation of the expression string. A derived value is usable only after its calculation and inputs are approved and reviewed.

Decision records contain no `approved` flag or approval reference. Approval is established by a separate approval record covering that exact decision file. Each independently selectable setting is a separate decision record. Grouped presentation can cover several decisions while approval selects only the accepted records.

## Evidence records

| Content field | Type and constraint |
| --- | --- |
| `source_uri` | Nonempty source locator |
| `source_title` | Nonempty source title |
| `source_version` | Nonempty version description, or null if the source reports no version |
| `accessed_at` | UTC timestamp in `YYYY-MM-DDTHH:MM:SSZ` form |
| `claim` | Nonempty statement supported by this source |
| `location` | Nonempty page, section, or source location |
| `limitations` | Array of nonempty strings; empty explicitly claims none known |

Evidence is not approval. An unversioned source remains identifiable as unversioned. Unavailable evidence cannot be represented as a verified source claim.

## Snapshot records

| Content field | Type and constraint |
| --- | --- |
| `purpose` | Nonempty description of the content being presented or assessed |
| `entries` | Nonempty array of SnapshotEntry sorted by the UTF-8 byte ordering of `path` |

A SnapshotEntry contains `path`, `sha256`, and `size_bytes` in that order. Path and digest follow Ref rules; size is the exact nonnegative byte length. Paths are unique. A snapshot excludes its own file and all later records that approve, review, or accept it. The snapshot may include earlier snapshots and records; its reference graph must remain acyclic. The preserved files, not only the digest list, must remain available.

## Approval records

| Content field | Type and constraint |
| --- | --- |
| `purpose` | `overview`, `decisions`, `step_specification`, or `reopen` |
| `snapshot_ref` | Ref to a frozen snapshot |
| `target_paths` | Nonempty unique array of paths present in that snapshot's entries |
| `response` | Response containing the actual explicit user approval |

Approval covers only the listed target paths and their snapshot digests. It does not implicitly approve every other entry in the snapshot. A step-specification approval must cover its step record, unit records, decision records, and linked normative documents, fixtures, and check definitions needed to perform the step. Any unresolved required target blocks readiness. A reopening approval covers the exact amendment record; it does not approve unresolved revised methods or future results.

## Step records

| Content field | Type and constraint |
| --- | --- |
| `title` | Nonempty string |
| `documents` | Closed object with `spec`, `design`, and `tasks`, each a document Ref |
| `depends_on` | Array of objects with `step_id` Identifier and `revision` positive safe integer |
| `requirements` | Nonempty array of Requirement, with unique identities |
| `decision_refs` | Nonempty array of decision Refs |
| `input_refs` | Array of exact input or dependency Refs |
| `unit_refs` | Nonempty array of unit Refs |
| `outputs` | Nonempty array of Output with unique identities and paths |
| `checks` | Nonempty array of Check with unique identities |
| `paired_validation` | Closed object with `decision_ref`, `mode`, and `unit_ids` |
| `resource_decision_refs` | Nonempty array of decision Refs specifying relevant limits |
| `project_settings` | Project-settings map |

The paired-validation decision reference targets a decision record. Mode is `enabled` or `disabled`. Enabled mode names the covered unit identities; disabled mode has an empty `unit_ids` array. Either mode requires applicable user approval. Check identifiers in requirements and units must exist in the step. Every required output has its own explicit Rule. A unit's `step_id` and `step_revision` identify its owning step without creating a reverse digest reference.

## Unit records

| Content field | Type and constraint |
| --- | --- |
| `name` | Nonempty operation or function name |
| `step_id` | Owning step Identifier |
| `step_revision` | Owning step revision |
| `requirement_ids` | Nonempty array of owning-step requirement Identifiers |
| `interface` | Nonempty complete description of arguments, accepted types, shapes, units, ordering, returns, and mutation |
| `method` | Nonempty complete method definition, including operation order and boundaries |
| `argument_decision_refs` | Array of decision Refs supplying every effective argument or derivation |
| `environment_decision_refs` | Array of decision Refs resolving relevant environment behavior |
| `failure_rules` | Nonempty array of explicit failure and recovery rules |
| `fixture_refs` | Nonempty array of saved synthetic fixture Refs |
| `check_ids` | Nonempty array of owning-step check Identifiers |
| `write_paths` | Array of permitted output FilePaths; empty explicitly permits no writes |
| `project_settings` | Project-settings map |

Interface and method descriptions receive semantic review. Nonempty text alone does not establish completeness. Workers must not implement a new argument, side effect, boundary, or dependency that these approved contents leave unresolved.

## Review records

| Content field | Type and constraint |
| --- | --- |
| `phase` | `specification`, `pre_execution`, or `results` |
| `snapshot_ref` | Ref to the exact frozen assessment scope |
| `reviewer` | Actor; must match this record's author |
| `artifact_authors` | Nonempty array of Actors who authored the assessed material |
| `workers` | Array of implementation-worker Actors |
| `outcome` | `pass`, `changes_required`, or `unable_to_determine` |
| `findings` | Array of Finding |

The reviewer context must differ from every assessed artifact author's and relevant worker's context. Assessment scope includes the snapshot record, its entries, and all transitively referenced evidence. `artifact_authors` lists every distinct author of that scope, including earlier review authors. The list is sorted by UTF-8 bytes of `session_id`, then `context_id`. For non-record artifacts, author provenance comes from the actual handoff. Later phases therefore need a different reviewer when they assess earlier reviewers' reports. Actors with the same context identity are not separate reviewers merely because their session labels differ.

A pass requires no unresolved findings. An absent review, a non-pass outcome, or a changed assessed snapshot does not satisfy the gate. Pending review is represented by absence of a passing assessment and the project state, not an invented passing record. Reviewer independence also requires checking the actual handoff, not only the written actor labels.

## Run records

| Content field | Type and constraint |
| --- | --- |
| `step_id` | Step Identifier |
| `step_revision` | Step revision |
| `spec_snapshot_ref` | Ref to the approved complete specification snapshot |
| `work_snapshot_ref` | Ref to the prepared-work snapshot assessed before execution |
| `pre_execution_review_ref` | Ref to a passing pre-execution review for that work snapshot |
| `input_snapshot_ref` | Ref to exact execution inputs |
| `commands` | Nonempty array of Command in actual execution order |
| `effective_settings` | Array of EffectiveSetting recording actual values and their approved sources |
| `environment` | Closed object with nonempty `runtime`, `platform`, and `details` strings |
| `output_snapshot_ref` | Ref to actual outputs |
| `check_results` | Nonempty array of CheckResult |
| `worker` | Actor; must match the run record author |
| `started_at` | UTC timestamp |
| `finished_at` | UTC timestamp not earlier than `started_at` |
| `resource_use` | ResourceUse |

Run evidence records observed values. A mismatch with the approved value is a finding, even if another check passed. A run reference does not establish that a command actually executed; results review must assess independent available evidence. Retries and fallbacks must appear in approved behavior and actual command evidence.

## Comparison records

| Content field | Type and constraint |
| --- | --- |
| `mode` | `single` or `paired` |
| `unit_ref` | Unit Ref |
| `input_snapshot_ref` | Ref to the saved shared input contents |
| `run_refs` | One run Ref for single mode; two for paired mode |
| `worker_contexts` | Matching Actor list in run order |
| `correctness_results` | One object per run, in `run_refs` order, with fields `run_ref` and nonempty `results` array of CheckResult |
| `pairwise_results` | Empty array for single mode; nonempty array of CheckResult for paired mode |
| `rules` | One object per unit check in `check_ids` order, with fields `check_id` and approved `rule` |

Each correctness group identifies the exact corresponding run by Ref. Its results have exactly the unit's check identities in `check_ids` order. Each rule equals that check's approved Rule in the owning step. Correctness compares each observed value with the check's approved expected value. Every output also retains its Output rule and required coverage in the complete step contract. No positional guess is needed to associate a result with its run or comparison rule.

In paired mode, `pairwise_results` has exactly those same check identities in the same order. Each `observed` value is a closed object with `left` and `right`, holding the corresponding observations from the first and second run. The identified rule compares `left` directly with `right`. This is additional to checking both runs against the expected value. Single mode has no pairwise results.

Paired mode requires two distinct worker contexts, the same approved unit and fixture contents, separate prepared implementations, and a distinct reviewer. Both individual correctness and direct pairwise checks must pass. These declared fields need supporting evidence of independence. Fictional paired examples demonstrate representation only; they are not a release comparison result.

## Acceptance records

| Content field | Type and constraint |
| --- | --- |
| `step_id` | Accepted step Identifier |
| `step_revision` | Accepted step revision |
| `spec_snapshot_ref` | Ref to the approved specification |
| `work_snapshot_ref` | Ref to the reviewed work |
| `run_refs` | Nonempty array of assessed run Refs |
| `comparison_refs` | Array of assessed comparison Refs |
| `results_review_ref` | Ref to a passing results review covering these results |
| `response` | Response with explicit user acceptance of this exact result |

Acceptance requires every specified check and applicable review to pass. A message cannot finalize a result with unresolved findings. Acceptance is retained for its exact revision. Changed work and stale dependencies require renewed applicable evidence and acceptance.

## Amendment records

| Content field | Type and constraint |
| --- | --- |
| `step_id` | Step proposed for reopening |
| `previous_acceptance_ref` | Acceptance Ref for its earlier revision |
| `proposed_revision` | Next positive revision number |
| `reason` | Nonempty explanation of why the correction is necessary |
| `blocking_requirement` | Nonempty requirement or defect preventing correct progress |
| `edits` | Nonempty array of Edit; every affected script and other planned file change is included |
| `affected_step_ids` | Array identifying direct and transitive affected downstream steps |
| `superseded_decision_refs` | Array of decisions that the proposed revision would replace |

A proposed amendment has no authority until its exact scope receives user approval. An additional affected path or changed planned operation needs new approval. After approval, the corresponding step is explicitly reopened. Its affected choices return to interview and specification review. Historical accepted contents remain available; affected downstream evidence cannot establish a current pass until renewed.

The edit inventory includes every affected specification, decision, script, configuration, input, and output artifact. New preserved revisions use new paths, with `operation: create`; accepted historical files are not overwritten. Later approval, review, run, acceptance, snapshot, and state records document the mandatory repeated workflow and are retained separately. Their creation cannot authorize an additional product or specification change beyond the approved edit inventory.

## Assessment order and findings

First assess parseability and envelope structure. Then assess declared field names and types, references and digests, context separation, approval coverage, semantic completeness, review independence, comparison coverage, and lifecycle evidence. Stop following a broken reference and report it; do not infer the missing target or use a different version. Independent findings may be reported together.

The fixture case table defines expected diagnostic categories for Step 1. It is an acceptance reference for later helper implementation. Step 1 performs a manual assessment and read-only parse and fingerprint checks. It does not deliver a schema validator.
