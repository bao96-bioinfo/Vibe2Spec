# Step lifecycle

## Purpose

Advance a project only when each step has met its agreed completion requirements. Preserve accepted work and expose necessary amendments before they change completed specifications or scripts.

## ADDED Requirements

### Requirement: Repeat the complete cycle for each project step

After agreement on the overall plan, the workflow SHALL select one current step and repeat interview, specification review and approval, implementation, pre-execution review, execution, results review, and user acceptance. Only then SHALL it mark that step finished and advance. The project SHALL finish only when every required step is finished under its current accepted revision.

#### Scenario: A project contains several steps

WHEN the first step is accepted and marked finished,
THEN the second step begins its own interview and specification process. The same cycle repeats for every subsequent step.

#### Scenario: All required steps are finished

WHEN all planned required steps have valid completion records and no necessary amendment is open,
THEN the workflow reports the project as finished and preserves the accepted step records.

### Requirement: Require all completion conditions

A step SHALL become final only when its specified checks pass, the reviewer reports no unresolved issues, and the user explicitly accepts the result. The workflow SHALL keep the step incomplete when any condition is missing.

#### Scenario: Checks pass but user acceptance is absent

WHEN the specified checks and review pass but the user has not accepted the result,
THEN the step remains awaiting user acceptance and the next step does not begin.

#### Scenario: The user responds while a finding remains unresolved

WHEN a reviewer finding or required check remains unresolved,
THEN the workflow explains the outstanding condition. It does not report the step as final under the existing specification.

### Requirement: Associate acceptance with the assessed result

User acceptance SHALL identify the specification, reviewed implementation, and results being accepted. Acceptance of an earlier version SHALL NOT finalize a changed version without the applicable checks, review, and user acceptance.

#### Scenario: Results change after the user accepts

WHEN a new run produces different results after a prior result was accepted,
THEN the prior acceptance remains associated with the prior result. The new result must satisfy the applicable completion conditions.

### Requirement: Preserve completed steps

The plugin SHALL preserve the accepted specification and completion evidence for a final step. Workers SHALL NOT silently change its specification, parameters, scripts, or accepted output definitions while working on another step.

#### Scenario: A later step requests a different preprocessing rule

WHEN a later analysis would benefit from a different preprocessing rule,
THEN the worker reports the conflict and follows the amendment process before changing the completed step.

### Requirement: Establish necessity before reopening completed work

A proposed amendment to a completed step SHALL explain why it is necessary to proceed, identify the blocking requirement or evidence, and explain the consequences of preserving the accepted step. A preference for a different implementation SHALL NOT by itself establish necessity.

#### Scenario: A change is only a convenience

WHEN a worker proposes rewriting completed code solely to simplify its preferred implementation,
THEN the workflow does not treat that convenience as sufficient grounds to reopen the completed step.

#### Scenario: A required input is absent from accepted outputs

WHEN a later step cannot satisfy its approved contract using the accepted earlier outputs,
THEN the amendment proposal identifies the missing input and explains why the project cannot proceed under the existing contracts.

### Requirement: Disclose every planned script modification

Before a completed step is amended, the proposal SHALL list every affected script and the planned modification to each. It SHALL also identify affected specifications, configuration, outputs, checks, and downstream steps. The exact amendment scope SHALL receive recorded user approval before edits begin.

#### Scenario: An amendment changes several scripts

WHEN resolving a blocked step requires changes to a preprocessing script and its evaluation helper,
THEN the proposal names both scripts, explains each planned edit, and states why each edit is needed.

#### Scenario: The user has reviewed but not approved an amendment

WHEN the user has seen an amendment proposal but has not explicitly approved its scope,
THEN the completed step remains protected and the proposed edits do not begin.

#### Scenario: Additional affected work is discovered

WHEN implementation of an approved amendment reveals another required script modification,
THEN the worker stops the newly affected work and requests approval of the expanded amendment scope.

### Requirement: Preserve amendment history

An approved amendment SHALL create a distinguishable revision while retaining the previously accepted specification and its evidence. It SHALL identify which earlier decisions or requirements it replaces and which remain valid.

#### Scenario: A completed step is revised

WHEN the user approves a necessary amendment,
THEN the earlier accepted version remains available for comparison and the revised version is identified as requiring the applicable verification and acceptance.

### Requirement: Reopen an amended step and repeat its specification process

An approved necessary amendment SHALL explicitly reopen the affected step in a new revision. Its affected decisions SHALL return to interview, specification review, and approval before implementation. The revised work SHALL pass pre-execution review, checks, results review, and explicit user acceptance before the step is finished again. Unchanged accepted decisions MAY be carried forward with explicit provenance.

#### Scenario: An accepted data-processing step needs a necessary correction

WHEN the user approves reopening that step to correct a blocking output defect,
THEN the workflow records the reopened revision and repeats the complete step process for the affected scope. It does not edit the completed scripts under a later step's authority.

#### Scenario: Reopening is approved but revised decisions are unresolved

WHEN the user approves reopening but has not resolved the revised method or acceptance criteria,
THEN the step remains in interview and specification. Approval to reopen does not authorize unresolved decisions or accept future results.

#### Scenario: Later work depends on the reopened step

WHEN a necessary amendment reopens a dependency of the current step,
THEN affected downstream work is suspended until the revised dependency is accepted. Unaffected completed steps remain closed.

### Requirement: Reassess affected downstream evidence

An amendment SHALL identify directly and transitively affected results and reviews whose assumptions it changes. Those records SHALL remain historical evidence for the old revision but SHALL NOT establish current passing status. Required affected checks, reviews, and user acceptance SHALL be renewed before dependent progress or project completion.

#### Scenario: A data revision changes evaluation inputs

WHEN an accepted amendment changes data used by an evaluation,
THEN the workflow identifies the affected evaluation evidence and requires the checks and review appropriate to the revised inputs before that evidence is accepted again.

#### Scenario: The revised dependency is accepted

WHEN a reopened step satisfies all completion conditions for its new revision,
THEN the workflow closes that revision and resumes the suspended sequence only as each affected dependency and its required evidence become valid. Unresolved affected evidence prevents project completion.

### Requirement: Resume from recorded project state

When a project resumes, the plugin SHALL use the saved decisions, step specifications, reviews, and completion records to identify the current step and unresolved work. Missing or conflicting records SHALL be disclosed before the affected work proceeds.

#### Scenario: A new worker resumes the project

WHEN another agent opens the project after a session ends,
THEN it can identify accepted steps, the current unfinished step, and pending decisions from the project records. It does not infer approval from an unchecked assumption or a worker's completion claim.

#### Scenario: The recorded state is inconsistent

WHEN a completion record claims acceptance but required review evidence is missing,
THEN the workflow reports the inconsistency and asks for resolution before treating the step as final.
