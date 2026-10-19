# Bounded independent implementation comparisons

Paired validation compares two independently written implementations of one approved small unit. Each implementation must satisfy the unit's approved expected behavior, and their outputs must satisfy an approved direct comparison. Different source code is permitted. The evidence covers the recorded fixtures, environments, and criteria.

Decide whether to enable pairing separately for every project step. Declining it leaves the complete specification, ordinary checks, and separate reviewer requirements intact. Enabling it names the units and requires their full relevant step context before either implementation begins.

## Specify the unit before delegating

Identify the function boundary, arguments, input and output types, shape, units, method, ordering, mutation, invalid-input behavior, dependencies, and output paths. Record all effective settings and approved derivations. Define normal, boundary, and invalid-input fixtures with expected outputs or invariants. Save the actual fixture bytes and reference their fingerprints.

Approve both individual correctness rules and direct pairwise rules. They can differ, but their meanings must be explicit. Record limits on fixture sizes, total bytes, calls, runtime, and relevant computing resources. If a unit requires more than these limits, return its scope or budget to the user before expanding it.

In a large model project, a suitable unit might calculate a small loss vector, apply a masking rule, or normalize a synthetic tensor. Pairing must not duplicate large implementations, download production model weights, or start real-data training. The approved ordinary project can separately contain those operations with its own contracts and checks.

## Preserve implementation independence

Give two distinct worker contexts the same approved complete specification and identical saved fixtures. Keep their write paths distinct. Each worker must fix its own implementation before receiving the other's code or results. Preserve source fingerprints at that point. A copied implementation or a worker and its reviewer do not constitute two independent implementations.

Identical random seeds alone are insufficient. A generator can differ across versions or environments. If generation is required, specify and approve the generation procedure, save the resulting bytes once, and give both workers those same contents.

Each prepared implementation needs a passing separate pre-execution review against the common contract. The reviewer inspects both source and checks directly. The reviewer context differs from relevant artifact authors and workers. When separate contexts are unavailable, use separate sessions before claiming independence; otherwise retain the evidence as uncompleted.

## Compare against expected behavior and each other

The following synthetic fixtures illustrate an inclusive filter that preserves order and repeats. Their values become an actual contract only after explicit approval.

| Input | Threshold | Expected output |
| --- | ---: | --- |
| `[-1, 0, 2, 2, 5]` | 2 | `[2, 2, 5]` |
| `[2]` | 2 | `[2]` |
| `[1]` | 2 | `[]` |
| `[]` | 2 | `[]` |
| `[5, 2, 4, 1]` | 2 | `[5, 2, 4]` |

Both workers must pass every required expected result. Then compare their results directly using the separately specified pairwise rule. If both remove equality at the threshold, their outputs agree on `[2]`, but both are wrong. A paired comparison therefore fails when either correctness assessment fails, even if the direct comparison passes.

Numerical comparisons need the same discipline. Against reference `1.00`, observations `0.91` and `1.09` each meet an inclusive absolute tolerance of `0.10`. Their direct difference is `0.18`. A pairwise tolerance of `0.10` fails. Do not infer pairwise agreement from two successful reference checks or silently double the tolerance.

## Retain bounded evidence

Record both worker identities and implementation fingerprints, the shared contract and input snapshot, pre-execution reviews, actual runs, individual checks, direct comparisons, and resource use. The [comparison template](../templates/comparison.json) represents these links. Preserve errors and failed checks under their original criteria.

A separate results reviewer assesses this evidence before user acceptance. Report the actual tested units, fixtures, environments, and limitations. A single implementation with two runs is a repeatability check, not independent paired implementation evidence. Two agreeing small implementations do not establish equivalence on untested inputs or satisfy a separately required integration check.
