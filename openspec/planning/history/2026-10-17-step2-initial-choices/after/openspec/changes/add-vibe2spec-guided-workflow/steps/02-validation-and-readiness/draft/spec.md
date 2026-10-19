# Step 2: validation and recorded readiness

## Status and authority

This is the current behavior-specification draft. It incorporates ten explicitly selected policies from [the response evidence](../decisions/policy-responses-v1.md). It remains incomplete and unapproved as a whole. It authorizes no implementation or test execution. Detailed interfaces, fixture bytes, resource limits, execution commands, and their exact comparison rules must be completed, preserved, approved, and independently reviewed first.

Step 1 is finished under [its accepted result](../../01-records-and-templates/evidence/acceptance-v1.md). Its record format, templates, and twenty-four cases are fixed dependencies. This step proposes new helpers that read that format. It does not revise an accepted file or broaden an earlier approval.

## Intended result

The helpers inspect a selected record and its explicit references. They return deterministic findings about structure, content identity, and the evidence recorded for current-step implementation readiness. A command-line interface exposes the same rules as reusable JavaScript functions. Both JSON and readable output are generated from one findings representation.

The helper's readiness conclusion concerns recorded evidence. Actual user approval, semantic completeness, reviewer independence, and execution evidence remain responsibilities of the separate review process. No helper result changes project state or grants tool authority.

```text
Explicit entry + approved locations + explicit resource limits
                              |
                              v
                   Read exact bounded bytes
                              |
                              v
               Inspect JSON and record structure
                              |
                              v
             Verify exact references and snapshots
                              |
                  +-----------+-----------+
                  |                       |
             Structure only       Current-step readiness
                  |                       |
                  |               Inspect declared gates
                  |                       |
                  +-----------+-----------+
                              |
                              v
             One findings report, JSON or readable
                              |
                              v
           Separate reviewer assesses meaning and provenance
```

A failure stops the affected branch. Independent checks continue within their approved bounds. Known defects remain visible when another branch cannot be assessed. Historical evidence is interpreted within the selected state; directory proximity does not establish authority.

## Specification components

| Component | Purpose and present status |
| --- | --- |
| [Policy responses](../decisions/policy-responses-v1.md) | Actual selected policies and exact received answers. This is manual development evidence, not a fabricated version 1 approval record. |
| [Interface explanations](interface-options.md) | Context and consequences for the selected policies and remaining interface choices. |
| [Coverage map](coverage.md) | All twelve record families, all twenty-four accepted cases, mechanical coverage, reviewer obligations, and later-step responsibilities. |
| [Input contract proposal](input-contract-proposal.md) | Raw bytes, JSON interpretation, explicit read authority, reference traversal, and filesystem failures. |
| [Report proposal](report-contract-proposal.md) | Proposed report schema, finding registry, exact rendering, deterministic ordering, and exit statuses. |
| [Paired envelope-unit proposal](envelope-unit-proposal.md) | Proposed pure function, exact predicates and diagnostic precedence, sixty-four shared cases, individual correctness, direct comparison, and input preservation. |
| [Runtime and verification proposal](runtime-and-verification-proposal.md) | Development and compatibility environments, test organization, resource counting, and the selected small paired unit. |

The proposal components explain a candidate design. Their unresolved items are not defaults. Cross-document inconsistencies must be resolved before the complete package is presented for approval.

## Requirements

### Requirement: S2-01 preserve the accepted format

The helpers SHALL assess version 1 records against the accepted field inventories, order, types, references, contexts, and relationships. They SHALL distinguish a violation of that format from a representation or check outside the helper's approved support. Unknown workflow fields SHALL remain invalid, including in drafts.

#### Scenario: A workflow field is misspelled

WHEN the accepted unknown-field case adds `review_stats`,
THEN the helper reports the applicable `unknown-field` finding and does not interpret it as another field.

### Requirement: S2-02 preserve source information

The loader SHALL retain enough original information to assess exact bytes, field order, repeated decoded keys, and unsupported numeric conversion. It SHALL NOT rely on conversion that has already discarded information required by an approved check.

#### Scenario: Decimal conversion would erase a distinction

WHEN JSON contains `0.10000000000000001`,
THEN the helper reports the unsupported precision loss before relying on a converted `0.1`. Supported `0.1` and `1e-1` use the explicitly selected standard JavaScript representation. No comparison tolerance is inferred.

### Requirement: S2-03 use explicit input scope

The assessment SHALL start from the caller's selected entry and workspace. It SHALL follow only declared references within the approved read locations. It SHALL NOT discover another project state or use an external path as its own authorization.

#### Scenario: An older approval is stored beside a new draft

WHEN a caller selects the new draft's state,
THEN the helper uses that state's applicable references. An unrelated older approval cannot satisfy the new revision's gate.

### Requirement: S2-04 verify exact evidence

References and snapshots SHALL be checked against exact available file bytes and the applicable record relationships. Changed bytes, incorrect sizes, missing artifacts, invalid target kinds, and cycles SHALL receive their specified findings. No fallback to another revision is permitted.

#### Scenario: Approved decision contents change

WHEN a decision retains its identifier but its bytes no longer match an approval's preserved reference,
THEN the changed bytes cannot establish approval. Retained historical bytes remain assessable through their original exact references.

### Requirement: S2-05 assess the complete current step

Recorded implementation readiness SHALL require the whole current-step contract, linked units, required decisions, complete applicable approval scope, output and check comparison coverage, resource decisions, accepted dependency evidence, and a passing separate specification review. An isolated complete unit SHALL NOT bypass an unresolved current step.

#### Scenario: A unit is complete but its step is unresolved

WHEN a selected unit supplies all its fields while a required current-step decision remains unresolved,
THEN recorded implementation readiness remains blocked.

### Requirement: S2-06 retain independent findings

The helper SHALL collect independent findings using an approved deterministic traversal and report order. It SHALL stop a broken branch and suppress conclusions that depend on unavailable premises. Established defects SHALL remain visible when an independent check is incomplete.

#### Scenario: A field error and read failure occur together

WHEN one record contains an unknown field and an independent required file cannot be inspected,
THEN the report contains both findings and identifies the incomplete assessment. It cannot report a complete pass.

### Requirement: S2-07 expose the same assessment through both interfaces

Reusable functions and the command-line interface SHALL apply one implementation of the assessment rules. JSON and readable reports SHALL represent the same findings, completeness, and limitations. Their exact schemas, bytes, and exit behavior require the companion interface contract.

#### Scenario: An agent and a person inspect the same assessment

WHEN JSON and readable modes render the same completed assessment,
THEN every finding and conclusion appears in both forms with the specified deterministic order.

### Requirement: S2-08 keep helpers read-only

The product helpers SHALL return or print reports without creating or modifying project files. They SHALL NOT execute stored commands, repair records, create approvals, or advance states. Any test setup or evidence retention SHALL have its own explicit approved write scope.

#### Scenario: A recorded command names a real executable

WHEN validation reads that command value,
THEN it treats the value as data and never launches it.

### Requirement: S2-09 report automation limits

The report SHALL distinguish structural validity, unresolved requirements, incomplete assessment, and recorded readiness. It SHALL retain the separate-review obligations for semantic completeness, genuine approval, actual context independence, and authentic evidence.

#### Scenario: A review record contains different actor labels

WHEN the declared labels satisfy mechanical independence checks,
THEN the helper may report that those recorded checks pass. It cannot claim that the actual independent handoff occurred solely from those labels.

### Requirement: S2-10 bound assessment resources

All relevant resource limits and counting rules SHALL be explicit. Exceeding an approved limit SHALL prevent a complete passing assessment. The helper SHALL NOT increase its own limits, truncate a successful report silently, or retry without approved behavior.

#### Scenario: A reference would exceed the artifact limit

WHEN the next reference requires work beyond the selected limit,
THEN the assessment reports incomplete work and preserves established findings. The limit does not change automatically.

### Requirement: S2-11 verify long-term-support compatibility

Implementation SHALL use Node.js built-in modules and the approved development runtime, Node.js 26.11.1. The same prepared source and approved fixtures SHALL undergo specified checks in an explicitly selected long-term-support environment. Compatibility claims SHALL identify the tested versions and platform.

#### Scenario: Only development-runtime verification passes

WHEN no successful long-term-support verification evidence exists,
THEN the Step 2 compatibility requirement remains unmet.

### Requirement: S2-12 compare only the selected small unit

Two separate workers SHALL implement the record-envelope checker from the same approved complete context and saved synthetic cases. Each implementation SHALL pass the expected findings independently. Their outputs SHALL also pass the approved direct comparison. The record-specific validators are not duplicated.

#### Scenario: The two implementations share a mistake

WHEN both functions return the same result but that result violates the approved expected finding list,
THEN the paired verification fails despite agreement between the workers.

### Requirement: S2-13 preserve accepted examples and their assessment scope

The twenty-four Step 1 cases SHALL remain unchanged. The new test adapter SHALL preserve each case's selected assessment, mutation order, reference policy, and expected category. Cases requiring semantic review or later lifecycle behavior SHALL retain that distinction.

#### Scenario: A case contains conflicting prose

WHEN structured values and digests pass but the readable method describes a different operation,
THEN mechanical checks cannot claim to have resolved the accepted representation-conflict case. The separate reviewer assesses it.

### Requirement: S2-14 retain review and completion gates

Complete specification approval and a passing separate specification review SHALL precede implementation. Prepared source, fixtures, commands, and effective settings SHALL receive separate pre-execution review. The specified checks and results review SHALL pass before explicit user result acceptance can finish Step 2.

#### Scenario: All helper checks pass but result acceptance is pending

WHEN verification and results review pass without the user's explicit acceptance,
THEN Step 2 remains unfinished and Step 3 detailed work does not begin.

## Work still required for a complete specification

| Area | Required completion before approval |
| --- | --- |
| Public interface | Exact exported functions, argument and return shapes, command names, complete required options, invalid invocation behavior, and configuration precedence. |
| Input method | Exact token normalization, negative zero, Unicode edge cases, byte-order marks, authority representation, case rules, filesystem change detection, and bounded traversal. |
| Check definitions | Finite predicate-to-finding mapping for every supported field and relationship; exact target selection and prerequisites for readiness. |
| Paired unit | Complete function contract, fixed shared fixture contents and expected findings, isolation procedure, integrated implementation selection, and bounded calls. |
| Runtime and resources | Exact long-term-support binary and acquisition identity, all assessment and aggregate test limits, exact commands, environment, scratch locations, and evidence-writing behavior. |
| Output acceptance | Fixed report examples, exact comparisons, fixture adapter rules, complete file inventory, and the manual-review checklist. |

No current Step 2 implementation task is complete. This draft makes the selected behavior and remaining work inspectable. A subsequent preserved revision must resolve the table before requesting approval of the complete step.
