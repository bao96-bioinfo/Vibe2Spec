# Step specification

## Purpose

Describe a project's overall route and elaborate the current step into a specification that resolves the decisions a worker needs. Keep approved decisions traceable while future steps remain provisional.

## ADDED Requirements

### Requirement: Establish a project-specific overview

The plugin SHALL present an ordered overview whose steps are justified by the user's outcome and constraints. It SHALL explain dependencies and request agreement on the overview before elaborating the first step for execution.

#### Scenario: The example workflow does not fit the project

WHEN a user's task requires a different sequence from an example included in the plugin,
THEN the plugin proposes a task-specific sequence and explains its dependencies. It does not impose the example sequence.

### Requirement: Elaborate steps sequentially

The plugin SHALL develop the comprehensive execution specification for the current step through its own interview. Future steps SHALL remain provisional until the preceding step has satisfied the accepted completion process. Each newly current step SHALL repeat the interview and specification review before implementation.

#### Scenario: The current step is awaiting acceptance

WHEN a worker has produced outputs but the current step has not been accepted,
THEN the plugin keeps the next step provisional and does not begin its detailed specification or execution. It may clarify a dependency needed to complete the current step.

#### Scenario: The preceding step is accepted

WHEN the current step satisfies its completion requirements and another planned step remains,
THEN the next step becomes current and receives its own interview, complete specification, and specification review. Approval of the overview does not authorize its implementation.

#### Scenario: A dependency requires early clarification

WHEN the current step's output must satisfy a later step's input requirement,
THEN the plugin clarifies that dependency before finalizing the current specification. It does not represent the later step as completed or fully resolved.

### Requirement: Specify the complete input and output contract

Each actionable step SHALL identify its purpose, prerequisites, inputs, outputs, processing behavior, and acceptance criteria. It SHALL specify relevant locations, formats, versions, ordering, units, missing-value handling, and failure behavior through user-approved decisions.

#### Scenario: A data-processing specification is incomplete

WHEN the dataset is selected but the download location or filtering criteria are unresolved,
THEN the step remains unready for execution and the plugin asks for the missing decisions.

#### Scenario: An output format affects a downstream step

WHEN a later consumer requires a particular format or column meaning,
THEN the current step's specification records the approved format and interpretation as part of its output contract.

### Requirement: Account for effective arguments

Each actionable step SHALL specify the arguments and effective settings required to perform its approved behavior. Omitted settings, configuration overrides, and dependency defaults SHALL be treated as decisions requiring approval when they supply an execution value or change behavior.

#### Scenario: A command hides a default

WHEN a command omits a random seed that the dependency supplies automatically,
THEN the effective behavior must be resolved and approved before the step is ready.

#### Scenario: A configuration overrides an argument

WHEN a configuration file or environment setting changes a proposed operation's effective value,
THEN the specification must resolve that value and its source before execution is approved.

### Requirement: Require approval for computed values

When an execution value is computed from other values, the specification SHALL define the calculation and its required inputs as approved behavior. A worker SHALL NOT introduce an unstated calculation as a substitute for an unresolved user decision.

#### Scenario: A value depends on the input data

WHEN a threshold is to be calculated from an input statistic,
THEN the user must approve the calculation, its inputs, and relevant edge cases before the worker derives the threshold.

### Requirement: Preserve the relationship between decisions and behavior

The step record SHALL link each specified choice to its user approval and each required behavior to an acceptance check. A recommendation or unresolved record SHALL NOT satisfy a required approval link.

#### Scenario: A requirement has no accepted decision

WHEN a worker-facing setting references a recommendation without user acceptance,
THEN the step is reported as incomplete and the missing approval is identified.

### Requirement: Save readable and structured project records

The plugin SHALL save readable Markdown specifications and structured records containing decision values, approval status, and evidence references. Validation helpers SHALL detect missing required values and invalid references. Conflicting representations SHALL be reported for resolution.

#### Scenario: A structured record has a broken reference

WHEN a setting points to an approval or evidence record that does not exist,
THEN validation reports the affected setting and does not certify the step as ready.

#### Scenario: The document and record disagree

WHEN the readable specification and its structured setting describe different values,
THEN the discrepancy is surfaced and the affected work stops until the intended approved value is established.

### Requirement: Bind approval to the exact decision content

Each approval SHALL identify the exact decision content accepted by the user. Changing a decision's value, scope, or derivation SHALL require a new approval even when the record identifier remains unchanged. The previous approval and its content SHALL remain distinguishable.

#### Scenario: A JSON decision value changes under the same identifier

WHEN an approved decision record is edited to contain a different value,
THEN its prior approval does not authorize the new value. Validation reports the changed decision until a new applicable approval is recorded.

### Requirement: Make readiness explicit

The plugin SHALL report whether the current step has the information and approvals needed to begin implementation. Missing choices, unresolved contradictions, and unapproved acceptance criteria SHALL prevent readiness. Workers SHALL NOT prepare code for unresolved behavior while waiting for its specification.

#### Scenario: A future decision is not needed yet

WHEN a later step contains an unresolved choice that does not affect the current step's contract,
THEN the plugin keeps that choice visible as provisional without inventing its value or requiring the later step to be fully specified now.

#### Scenario: Tests lack an approved comparison rule

WHEN the proposed acceptance check has no approved expected result or comparison criterion,
THEN the step remains unready and the plugin asks the user to resolve the criterion.

#### Scenario: A small function still contains an unresolved choice

WHEN a worker could write a function but its threshold boundary, return shape, or failure behavior is unresolved,
THEN it requests the missing decisions before writing that function. A small implementation does not waive specification readiness.

### Requirement: Define unit boundaries within the complete relevant step context

An implementation unit SHALL have an approved boundary, inputs, outputs, behavior, dependencies, and verification rules linked to the current step. The complete current-step contract and all context affecting the unit SHALL be approved and reviewed before implementation. Unit readiness SHALL NOT bypass an unresolved current-step contract. Unrelated future-step details SHALL remain provisional.

#### Scenario: The unit depends on an earlier output convention

WHEN a function consumes an accepted earlier output whose units or ordering affect its behavior,
THEN those conventions and the exact accepted dependency must appear in its approved contract before implementation.

#### Scenario: One unit is complete but the current step is unresolved

WHEN a unit has a complete interface but the current step still has an unresolved required decision,
THEN implementation remains blocked until the complete current-step specification is resolved, approved, and reviewed. The worker cannot use the small unit boundary to bypass that condition.
