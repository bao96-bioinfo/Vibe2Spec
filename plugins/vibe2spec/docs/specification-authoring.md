# Writing a reproducible current-step specification

The specification states what an independent worker must implement and how its behavior will be checked. The execution contract fixes the choices that would otherwise permit different results. The method, inputs, boundaries, environment, and comparison rules together define the reproducibility claim. Different source code is acceptable when it implements those same approved requirements.

Use [the versioned record format](record-format.md) and [the step templates](../templates/step/spec.md). The readable specification, execution design, and task definitions have distinct roles. A requirement describes observable behavior. The design resolves its method and effective settings. Tasks identify implementation units and permitted work. JSON records link those documents to independent decisions, approval evidence, and objective checks.

## Begin with requirements and scenarios

Give each requirement an identity and a normative SHALL or MUST statement. Add at least one WHEN/THEN scenario with an observable outcome. Include normal operation, relevant boundaries, and invalid input when they change behavior. Connect every required behavior to approved decisions and check identities.

```text
Requirement: inclusive-threshold
The function SHALL retain each input value greater than or equal to the threshold.

Scenario: Equality at the threshold
WHEN the input is [2] and the threshold is 2,
THEN the returned array is [2].
```

This example specifies one boundary only. The complete step still needs its input domain, ordering, repeats, mutation, failures, resources, outputs, and approved checks. A nonempty interface description or a small unit boundary cannot make an incomplete step ready.

## Resolve sources of divergent behavior

Use the following table as an internal completeness check. Before asking about a gap, consult applicable approved context and scoped delegation. Explain the remaining choice through its effect on the user's work, introducing one unfamiliar decision at a time. Record the precise approved meaning afterward. The table is not a script to read to the user; all applicable areas still need to be settled before implementation.

| Contract area | Information needed before implementation | Example of an unresolved choice |
| --- | --- | --- |
| Purpose and dependencies | Current outcome, exclusions, accepted prerequisite revisions, and downstream input requirements that affect this step | An accepted data file lacks a required identifier |
| Input identity | Exact content or version, selection, location, schema, units, ordering, partitions, and integrity checks | A dataset URL points to changing content |
| Interface | Arguments, accepted types and shapes, return values, errors, mutation, and write scope | A numeric string might be converted or rejected |
| Method | Algorithm, operation order, comparison operators, tie rules, duplicates, missing values, and empty inputs | Equality at a filtering threshold has no rule |
| Effective settings | Every explicit argument, omitted default, configuration source, environment override, precedence rule, and approved derivation | A library supplies an unapproved random seed |
| Environment | Relevant dependency versions, precision, device, randomness, ordering, concurrency, and allowed variation | Parallel computation changes reduction order |
| Resources and recovery | Input size, storage, memory or computing limits when relevant, call counts, deadlines, retries, and fallbacks | A failed download triggers an unspecified alternate source |
| Output identity | Files and returned values, schemas, names, ordering, units, serialization, and explicitly ignored fields | A timestamp is dropped by the checker without a decision |
| Verification | Saved fixtures, expected results or invariants, coverage, comparison categories, formulas, boundaries, and required reviews | Two outputs pass a reference tolerance but fail direct comparison |

Relevant settings can be explicitly inapplicable with an approved reason. This differs from omitting an unknown setting. A derived value needs a complete calculation, approved input decisions, and edge-case behavior. Workers must not use an unstated calculation to fill a missing value.

## Define objective comparisons

An exact-byte rule compares complete serialized files. An exact-JSON rule compares supported parsed values with preserved array order and ignored object-key order, as defined by the record format. A numerical rule identifies compared components and alignment, its metric, tolerance, boundary operator, zero behavior, non-finite behavior, and exact checker artifact. A numerical default from a testing library is not approval.

For a numerical example, absolute error is the absolute difference between an observed value and a reference value. An inclusive tolerance of `0.01` would pass an error equal to `0.01`. An exclusive tolerance would fail that boundary. These are illustrative choices. The actual metric, tolerance, and boundary must receive approval before execution. Do not select them after seeing a result.

For paired evidence, specify reference correctness and direct pairwise comparison independently. Two observations of `0.91` and `1.09` are each within `0.10` of reference `1.00`, but differ by `0.18`. They fail a direct pairwise tolerance of `0.10`. Neither reference agreement nor agreement on an incorrect expected result proves conformance.

Unknown scientific findings remain unknown. Specify the approved method, valid output schema, controls, and reproducibility checks without inventing a favorable result. If free-form output has no objective comparison criterion, explain that unresolved part of the requested reproducibility claim and refine the output or criterion with the user.

## Map units to the complete step

A unit is a function or bounded operation with an approved interface, method, dependencies, fixtures, and checks. Give each unit its owning step and revision, requirement identities, argument and environment decisions, failure rules, fixture references, permitted output paths, and comparison checks. Both paired workers receive the same complete relevant step context.

The current step is the readiness boundary. Do not implement a complete unit while another required current-step decision is missing. Future steps remain provisional. Clarify a future consumer's requirement now only if that requirement constrains the current step's outputs.

## Preserve exact approval scope

Use the fixed workflow fields in the record format. Add project-defined named settings only through `project_settings`, whose values reference decision records. Literal decision objects can carry project data; they do not introduce new workflow authority.

Before presentation or review, preserve the exact specification, design, task definitions, step record, units, decisions, fixtures, and check definitions needed to perform the step. Include these normative artifacts in its approval scope. Preserve recorded approvals separately from their target content. Changes produce a new revision and require applicable approval and review again.

The structural helper detects malformed fields, unsupported representations, missing files, mismatched digests, and recorded coverage gaps. A separate specification reviewer checks whether the contents actually settle every necessary choice and whether the readable and structured forms agree. Only a complete approved specification with a passing separate review can authorize preparation.
