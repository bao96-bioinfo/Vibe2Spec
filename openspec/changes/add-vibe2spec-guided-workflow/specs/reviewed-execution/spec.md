# Reviewed execution

## Purpose

Review the complete specification before implementation, prepared work before execution, and evidence after results. Guide workers through approved work, detect unapproved choices, and preserve what was reviewed and performed.

## ADDED Requirements

### Requirement: Review the specification before implementation

A separate reviewer SHALL assess the current step's complete proposed specification for missing decisions, inconsistent contracts, unapproved values, and inadequate checks before code preparation. Implementation readiness SHALL require both user approval of the exact specification and a passing review of that version. A reviewer SHALL NOT resolve a missing decision for the user.

#### Scenario: A specification omits an argument

WHEN specification review discovers that a required function argument or effective default has no approved value or derivation,
THEN the reviewer returns the gap to the interview. The worker does not begin the affected implementation until the specification is resolved, approved, and reviewed again.

#### Scenario: The specification changes after review

WHEN an interview answer changes a reviewed contract,
THEN the changed version requires the applicable specification review and user approval before implementation. A previous passing review does not authorize the changed version.

#### Scenario: Specification review passes

WHEN the complete current-step specification has user approval and a passing separate review,
THEN the worker may prepare the approved code. Prepared code, commands, configuration, and checks still require a separate pre-execution assessment before running.

### Requirement: Bind worker instructions to the approved step

The worker SHALL receive the complete relevant approved step and unit specifications and their decision records before preparing code. It SHALL prepare and perform only the behavior described by those records. Discovering a missing decision SHALL stop the affected work and return the question to the user.

#### Scenario: The worker discovers a missing filtering criterion

WHEN the worker needs a criterion that the specification does not define,
THEN it reports the missing choice and asks for a decision. It does not fill the gap using convention, a library default, or a recommendation that lacks approval.

#### Scenario: A paired worker is asked to start before the unit is specified

WHEN one of the paired workers lacks an approved interface, behavior, fixture, or comparison rule required for its task,
THEN it does not begin implementing the unit and returns the missing decision to the interview.

### Requirement: Review in a separate context

The reviewer SHALL assess the specification, actual implementation, and available evidence in a context separate from the author of the assessed artifact and the relevant implementation workers. It SHALL inspect those materials directly and SHALL NOT rely solely on their summaries.

#### Scenario: Native delegation is available

WHEN the host can create a separate reviewer context,
THEN the workflow provides that reviewer with the approved records and actual work to assess.

#### Scenario: The coordinator reviews its own specification

WHEN the coordinator that authored the specification performs a self-review,
THEN that assessment cannot satisfy the separate specification-review gate. The workflow obtains an assessment in a distinct context.

#### Scenario: Native delegation is unavailable

WHEN the host cannot create a separate reviewer context,
THEN the workflow requests a separate review session and supplies the materials needed for that review. The applicable specification, execution, or completion gate remains blocked until a passing assessment of the exact work is received. The worker's self-review cannot satisfy that gate.

### Requirement: Review prepared work before execution

The workflow SHALL obtain an explicit passing reviewer assessment of prepared code, commands, configuration, and acceptance checks before executing the step's work. Missing, incomplete, or indeterminate assessments, unapproved choices, and unresolved findings SHALL prevent the workflow from authorizing execution.

#### Scenario: Prepared code introduces an extra argument

WHEN the worker adds a method parameter that has no approved specification entry,
THEN the reviewer identifies the argument, its location, and the missing approval. The workflow returns the decision to the user before execution.

### Requirement: Inspect effective settings and assumptions

The reviewer SHALL examine explicit arguments, omitted-argument defaults, configuration values, environment overrides, and relevant dependency behavior. It SHALL report any effective setting or behavior that cannot be traced to the approved specification.

#### Scenario: An omitted argument supplies an unapproved value

WHEN a library supplies a default value for an omitted argument,
THEN the reviewer checks that effective value against the approved records and reports it if approval is missing.

#### Scenario: The environment changes the effective configuration

WHEN an environment variable overrides the reviewed configuration,
THEN the reviewer identifies the discrepancy and requires resolution before treating the operation as compliant.

### Requirement: Preserve review scope and version identity

Each review SHALL bind its scope to content fingerprints or immutable references for the assessed specification, work, effective configuration, inputs, and relevant environment records. A change to reviewed behavior, arguments, configuration, inputs, or acceptance criteria SHALL require another applicable review before execution or acceptance proceeds.

#### Scenario: The worker edits code after review

WHEN the code to be executed differs from the code assessed by the reviewer,
THEN the previous review cannot authorize the changed work. The workflow requests a review of the changed version.

### Requirement: Review actual execution and outputs

After execution, the reviewer SHALL compare the actual commands, effective settings, outputs, and acceptance evidence with the approved step. Missing evidence and mismatches SHALL remain unresolved findings.

#### Scenario: A different input was used at runtime

WHEN execution records show an input version different from the approved version,
THEN the reviewer reports the mismatch even if the resulting output passes another check.

#### Scenario: Evidence of execution is incomplete

WHEN the reviewer cannot establish which settings produced an output,
THEN it reports the missing evidence and does not issue a passing assessment for the affected work.

### Requirement: Preserve user authority over remedies

The reviewer SHALL describe findings and the decisions needed to resolve them. It SHALL NOT approve new values, change acceptance criteria, or silently repair an ambiguous specification on the user's behalf.

#### Scenario: The reviewer prefers another threshold

WHEN the reviewer believes a different threshold is appropriate,
THEN it presents the reasoning as a recommendation requiring user decision. Its recommendation does not alter the approved threshold.

#### Scenario: A finding can be corrected under existing decisions

WHEN implementation contradicts an already approved value,
THEN the reviewer identifies the contradiction. Any corrected work remains subject to review against the same approved specification.

### Requirement: Detect unapproved fallback behavior

The worker SHALL stop when an error would require a new method, parameter, input, retry policy, or fallback that the specification does not authorize. The reviewer SHALL check for such substitutions in prepared work and execution evidence.

#### Scenario: A dataset cannot be downloaded

WHEN the approved source fails and no fallback source has been approved,
THEN the worker reports the failure and asks how to proceed. It does not select another dataset.

### Requirement: Review acceptance checks against their approved criteria

The reviewer SHALL verify that the checks, expected outputs, and comparison tolerances match the approved criteria. Passing checks SHALL NOT establish compliance when the worker changed those criteria without approval.

#### Scenario: The worker relaxes a failing tolerance

WHEN the worker increases a numerical tolerance to make a check pass without user approval,
THEN the reviewer reports the unapproved change and the result cannot pass review under the original specification.

### Requirement: Describe the instruction-based control boundary accurately

The plugin SHALL describe its execution and review rules as an instruction-based protocol. It SHALL NOT claim that installing the plugin technically prevents every unauthorized action. A review after execution SHALL NOT be presented as prior authorization for that action.

#### Scenario: Review finds an action already performed

WHEN review discovers that an unapproved action has already occurred,
THEN the workflow records the action and its consequences, stops affected work, and requests a user decision about recovery. It does not describe the action as having been approved beforehand.
