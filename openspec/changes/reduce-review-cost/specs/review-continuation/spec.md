# Review continuation

## Purpose

Reduce repeated review effort through explicit reusable coverage, bounded correction scope, and compact evidence while preserving exact approval and execution gates.

## ADDED Requirements

### Requirement: Preserve explicit reviewed coverage

Reviews SHALL optionally record named coverage items with exact input and dependency references, check identities, and outcomes. Legacy reviews retain full-review behavior but cannot supply reusable item-level evidence. A passing covered review SHALL cover the current scope and required checks with passing items.

#### Scenario: A baseline has one defect

WHEN a review reports changes required but explicitly passes one independent item,
THEN a correction can reuse that item while freshly reviewing the failed item; absence of a finding cannot establish a reusable pass.

#### Scenario: Coverage is incomplete

WHEN a current artifact or required check is absent from the declared coverage,
THEN the helper rejects the claimed coverage and the review cannot establish readiness.

### Requirement: Verify continuation applicability

A correction SHALL bind the complete current snapshot and reference a valid frozen same-phase baseline separately. Reused items SHALL match passing baseline items by identity, exact input and dependency reference sets, and check sets. The baseline chain SHALL remain valid and acyclic.

#### Scenario: A dependency changes

WHEN a direct input is unchanged but an item's dependency or comparison definition changes,
THEN reuse of that item is rejected and the affected obligation receives fresh review.

#### Scenario: Baseline content is overwritten

WHEN a preserved baseline reference no longer matches its bytes,
THEN the helper reports the mismatch instead of approving the changed content under historical evidence.

### Requirement: Account for prior findings

A continuation SHALL identify resolved baseline findings by their exact code and path and cite fresh passing coverage with an explanation. A passing continuation SHALL resolve every baseline finding, contain no current unresolved findings, and have all current items passing.

#### Scenario: A defect disappears from the report

WHEN a corrected review omits a prior defect without a resolution associated with fresh passing coverage,
THEN it cannot pass even when other items are reusable.

### Requirement: Preserve reviewer independence

The continuation baseline SHALL be historical evidence outside the current assessment scope. The same independent reviewer can assess corrections without becoming an author of the current product merely by writing the baseline. Separation from current artifact authors and relevant workers SHALL remain required; legacy independence checks remain unchanged.

#### Scenario: The original reviewer verifies a fix

WHEN the worker corrects code and the prior reviewer receives the baseline through the continuation reference only,
THEN the reviewer can assess the correction if separate from all current assessed authors and workers.

### Requirement: Bound correction reviews

The coordinator SHALL supply focused file-based handoffs and consolidate specification-conformance and relevant quality checks within each phase. The normal limit SHALL be one initial review and one correction review per phase. Further rounds require an explicit budget extension or narrower scope. Budget exhaustion SHALL never establish a pass.

#### Scenario: A second assessment still finds a defect

WHEN the initial and correction reviews exhaust the planned rounds with a blocker unresolved,
THEN the coordinator reports the blocker and required next work instead of automatically starting more reviewers or marking the step complete.

#### Scenario: A fix affects unchanged callers

WHEN a correction changes an interface or shared behavior,
THEN the reviewer checks affected callers under a named risk; unchanged file bytes do not exempt affected behavior.

### Requirement: Provide a read-only inspection packet

A helper SHALL report the current and baseline identities, suggested reusable and fresh items, inspection paths, prior finding locations, and measured artifact byte counts without dumping artifact contents or writing files. It SHALL use existing explicit read locations and limits. Its output SHALL state that it is advisory and grants no approval.

#### Scenario: A draft correction is prepared

WHEN the caller selects a structurally valid draft review with exact references,
THEN the helper returns a deterministic compact packet identifying candidate reuse and fresh inspection without claiming the draft passed review.

### Requirement: Preserve useful evidence and defects

Reviews SHALL inspect available execution evidence before requesting repeat tests, collect findings together, and distinguish optional recommendations from requirement violations. Genuine defects outside the fix remain blockers for affected readiness. Reviewers SHALL request expanded scope through the coordinator rather than dispatch duplicate reviewers automatically.

#### Scenario: An unrelated suggestion appears

WHEN a reviewer suggests a refactor that does not address an approved requirement violation,
THEN it is retained as optional feedback without restarting the correction loop.
