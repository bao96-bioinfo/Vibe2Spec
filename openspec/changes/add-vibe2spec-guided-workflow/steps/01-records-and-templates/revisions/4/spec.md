# Step 1: records and specification templates

## Status and authority

This is the detailed Step 1 specification proposed for user approval. Its companion files are `record-format.md`, `fixtures.md`, and `verification.md`. These four files form one specification package. The package is not implementation-ready until the user approves its exact version and a separate specification review passes.

The user has already approved editable drafts with preserved presented and reviewed versions, fixed workflow fields with a designated project-settings section, and no paired implementations for Step 1. Those decisions are recorded at repository-relative path `openspec/planning/vibe2spec-step-01-interview.md`. The remaining technical conventions in this package are proposals. A reviewer cannot approve them on the user's behalf.

## Purpose and boundary

Step 1 supplies a precise format for recording project intent, decisions, approvals, step and unit contracts, reviews, runs, comparisons, acceptance, and amendments. It implements tasks 1.1 through 1.5, then supplies the evidence required for task 1.6. Step 2 remains provisional until the user accepts Step 1's delivered result.

Deliverables are Markdown and JSON files. Step 1 adds no executable product function, validation helper, host package, network service, dependency, or real scientific dataset. The existing Node.js installation is used only for the explicitly specified read-only verification. Fictional run and approval records are examples, not reports of actions taken in this project.

## Proposed decision groups

| Group | Proposed decisions | Consequence |
| --- | --- | --- |
| S1-FORMAT | Format version 1; the closed record definitions in `record-format.md`; explicit workspace and external path rules; declared incomplete drafts; a designated `project_settings` section | The later validator has exact names, types, and validity rules. Unknown workflow fields cannot be silently accepted. |
| S1-VERSIONS | Preserve exact presented or reviewed bytes; separate approval and state records; SHA-256 content references; immutable frozen revisions | Recording approval does not change the content approved. Changed content needs a new revision and applicable approval. |
| S1-EXAMPLES | The exact template construction, fictional fixture graphs, negative cases, expected findings, and output comparison rules in this package | Two implementers can produce the same structured artifacts. Deliberate errors remain visible and cannot authorize project work. |
| S1-CHECKS | Existing Node.js v26.11.1 for Step 1 checks; read-only parsing and hashing; manual contract assessment; separate pre-execution and results reviews; stated resource limits | Verification stays within this documents-only step. This does not select the release runtime range or implement the Step 2 validator. |

Each group can be accepted or revised independently. A required unresolved group keeps Step 1 unready. Approval of these groups does not accept the eventual delivered result.

## Exact deliverable inventory

All paths below are relative to the Vibe2Spec repository. Only these product paths may be created during Step 1. No existing product file is modified. Planning, review, and acceptance evidence is retained separately under this step's planning directory. The task tracker is updated only when its corresponding task is fully satisfied.

| Path | Required contents and comparison |
| --- | --- |
| `docs/record-format.md` | Exact bytes of the approved companion `record-format.md` |
| `templates/project.md` | Exact Markdown template specified below |
| `templates/project.json` | Draft template for kind `project` |
| `templates/decision.json` | Draft template for kind `decision` |
| `templates/evidence.json` | Draft template for kind `evidence` |
| `templates/approval.json` | Draft template for kind `approval` |
| `templates/step/spec.md` | Exact behavior template specified below |
| `templates/step/design.md` | Exact execution-design template specified below |
| `templates/step/tasks.md` | Exact task template specified below |
| `templates/step/contract.json` | Draft template for kind `step` |
| `templates/step/unit.json` | Draft template for kind `unit` |
| `templates/review.json` | Draft template for kind `review` |
| `templates/run.json` | Draft template for kind `run` |
| `templates/comparison.json` | Draft template for kind `comparison` |
| `templates/acceptance.json` | Draft template for kind `acceptance` |
| `templates/amendment.json` | Draft template for kind `amendment` |
| `templates/snapshot.json` | Draft template for kind `snapshot` |
| `tests/fixtures/records/base.json` | The exact fictional virtual file graph defined in `fixtures.md` |
| `tests/fixtures/records/cases.json` | The exact case definitions and expected findings defined in `fixtures.md` |
| `tests/fixtures/records/README.md` | Exact explanation specified in `fixtures.md` |

This inventory contains twenty product files. It includes eleven workflow record kinds and one supporting snapshot kind. No per-project `.vibe2spec/` directory is created in this step. The templates describe that future workspace convention; the example graph uses relative virtual paths.

## Template construction

Each JSON template has the common envelope from `record-format.md`. Its `schema_version` is `1`; `kind` is the listed kind; `id` is `template-` followed by the kind; `revision` is `1`; `project_id` is `template-project`; `context` is `authoring`; and `lifecycle` is `draft`. Its `content` contains every field listed for that kind in the declared order, with JSON null as each value. No extra field is permitted. Null in an unresolved draft is not an approved value.

JSON files use UTF-8 without a byte-order mark, two-space indentation, a final line feed, and the declared field order. Array order is preserved. Numeric values use ordinary decimal integer notation in these templates and fixtures. Object keys supplied by the fixture tables follow their listed order. There are no comments, trailing commas, or duplicate keys. File fingerprints use exact bytes, including whitespace.

JSON deliverables must have exact logical content, including ordered arrays and every specified value. Whitespace and object-key order are separately checked against the serialization convention. No field is ignored for content comparison. Numeric equality in Step 1 is exact; no tolerance is used.

The following fenced contents define the four Markdown templates exactly, with a final line feed. Placeholder text is intentionally unresolved authoring content. It must be replaced and reviewed in an actual project before readiness can pass.

`templates/project.md`:

```markdown
# {{project_title}}

## Outcome

{{Describe the requested outcome and the user-approved success criteria.}}

## Constraints and evidence

{{Link decisions about scope, data, resources, cost, and relevant evidence.}}

## Ordered overview

{{Show the user-agreed steps, dependencies, and current status as an ASCII diagram.}}

## Current step

{{Identify the current step and unresolved decisions. Future steps remain provisional.}}

## Approval references

{{Link the exact overview version and its user approval.}}
```

`templates/step/spec.md`:

```markdown
# {{step_title}}

## Purpose

{{State the current step's outcome and boundaries.}}

## Dependencies

{{Identify accepted input contracts and decisions needed by this step.}}

## Requirements

### Requirement: {{requirement_id}} {{requirement_name}}

The step SHALL {{state one observable behavior}}.

#### Scenario: {{scenario_name}}

WHEN {{state the triggering condition}},
THEN {{state the required observable outcome}}.

## Decision and check references

{{Link each requirement to its approved decisions and acceptance checks.}}
```

`templates/step/design.md`:

```markdown
# {{step_title}} execution contract

## Inputs and interfaces

{{Specify identities, locations, types, shapes, units, ordering, and dependency contracts.}}

## Method and effective settings

{{Specify the method, every effective argument, derivations, defaults, and configuration precedence.}}

## Boundaries and failures

{{Specify comparisons, ties, empty and missing values, invalid inputs, side effects, and permitted recovery.}}

## Environment and resources

{{Specify relevant versions, precision, randomness, concurrency, execution limits, and approved variation.}}

## Outputs and verification

{{Specify paths, schemas, ordering, fixtures, expected results, and every comparison rule.}}

## Paired-validation decision

{{Link the explicit enable or decline decision. If enabled, specify small units and identical synthetic fixtures.}}
```

`templates/step/tasks.md`:

```markdown
# {{step_title}} tasks

The complete current-step specification must have user approval and a passing separate review before implementation. Prepared work requires review before execution. Checks, results review, and explicit user acceptance must pass before the next step begins.

## 1. {{authorized_unit}}

- [ ] 1.1 {{Describe the approved work, exact file scope, and verification.}}

## Completion evidence

{{Link the assessed implementation, run evidence, passing checks, separate results review, and user acceptance.}}
```

## Behavioral acceptance requirements

### Requirement: S1-01 represent unresolved drafts without authorizing work

Delivered templates SHALL parse as JSON and contain the complete declared envelope and content field names. They SHALL remain authoring drafts. Their null fields SHALL indicate unresolved content and SHALL NOT be treated as effective values, user approvals, or passing reviews.

#### Scenario: A blank template is inspected

WHEN `templates/step/contract.json` is inspected,
THEN it has the declared fields, contains unresolved content, and cannot establish implementation readiness.

### Requirement: S1-02 preserve exact approved content

The format SHALL separate decision contents from approval evidence. Presented or reviewed versions SHALL remain retrievable. References SHALL identify exact target bytes. Approval of a snapshot SHALL NOT authorize changed bytes under the same identity.

#### Scenario: A decision changes after approval

WHEN the changed-decision case in `fixtures.md` changes the decision while retaining its identifier,
THEN the expected finding identifies the changed content and the case cannot establish current approval.

### Requirement: S1-03 represent the complete review and completion sequence

The format SHALL distinguish specification, pre-execution, and results reviews. It SHALL represent separate author and reviewer contexts, run evidence, checks, explicit acceptance, and affected historical evidence. It SHALL not use an author-written completion claim as a substitute for those records.

#### Scenario: A review is absent

WHEN a fixture omits a required passing independent review,
THEN its current gate remains blocked even if another record claims the step is finished.

### Requirement: S1-04 constrain extensions and examples

Unknown workflow fields SHALL be invalid. Project-specific setting names SHALL appear only in `project_settings` and reference recorded decisions. Example records SHALL be clearly fictional and SHALL NOT authorize real project actions.

#### Scenario: A misspelled workflow field is supplied

WHEN a record adds `review_stats` outside its declared fields,
THEN the expected finding reports an unknown field. It does not interpret that spelling as an approved alias.

### Requirement: S1-05 preserve closed completed steps

Amendment records SHALL name every proposed affected file, its planned modification, the necessary reason, and affected dependencies. Approval to reopen SHALL remain distinct from approval of revised decisions and acceptance of revised results.

#### Scenario: An amendment needs another script edit

WHEN a fixture adds a file modification outside the approved amendment scope,
THEN the additional work remains unauthorized and the expected finding identifies the scope expansion.

## Completion and handoff

The separate specification reviewer assesses the complete four-file package and identifies unresolved choices. After user approval and a passing review of the same version, the worker creates only the listed deliverables. The verification protocol then receives separate pre-execution review before checks run. Results review assesses the actual files and evidence.

Tasks 1.1 through 1.5 are marked complete only after their stated deliverables and verification are satisfied. Task 1.6 remains incomplete until the user explicitly accepts the assessed delivered snapshot. No Step 2 detailed work begins earlier. There is no paired-implementation claim for Step 1.
