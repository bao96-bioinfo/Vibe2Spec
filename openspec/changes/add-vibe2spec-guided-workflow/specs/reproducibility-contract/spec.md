# Reproducibility contract

## Purpose

Strengthen behavioral specifications with explicit execution and comparison contracts. Make equivalent independent implementations assessable against approved inputs, methods, outputs, and numerical tolerances.

## ADDED Requirements

### Requirement: Define implementation-independent acceptance

The specification SHALL define the behavior and outputs that independent implementations must reproduce. Source-code identity SHALL NOT be required. Agreement SHALL be assessed using approved comparison rules, alongside each implementation's conformance to the approved method.

#### Scenario: Different code produces conforming results

WHEN two implementations have different source code but each conforms to the approved method and satisfies the same output comparison rules,
THEN source-code differences alone do not make them nonconforming.

#### Scenario: Agreement hides a shared deviation

WHEN two implementations agree with each other but both violate an approved requirement,
THEN their agreement does not establish conformance.

### Requirement: Bind behavior to execution and comparison contracts

Each reproducible step SHALL link its behavioral requirements and scenarios to an approved execution contract and comparison contract. The execution contract SHALL resolve how results are produced. The comparison contract SHALL resolve how outputs are checked.

#### Scenario: A behavioral requirement leaves an algorithm unresolved

WHEN a requirement states that data must be normalized but does not resolve the normalization method or its parameters,
THEN the step remains incomplete until the execution contract resolves those choices through user approval.

### Requirement: Identify exact inputs

The execution contract SHALL identify required input versions, selections, and integrity checks. It SHALL specify relevant ordering, identifiers, partitions, and inclusion or exclusion rules. A mutable source location alone SHALL NOT establish reproducible input identity.

#### Scenario: A dataset changes at the same location

WHEN a downloaded dataset has different contents from the approved version,
THEN the discrepancy is reported and the replacement cannot be silently used under the existing approval.

#### Scenario: Training and evaluation partitions differ

WHEN implementations use different training or evaluation assignments despite the same source dataset,
THEN they fail the contract unless those assignments conform to the same explicitly approved partitioning rule and comparison requirements.

### Requirement: Specify algorithmic and edge-case semantics

The execution contract SHALL define the chosen method and behavior at relevant boundaries. It SHALL resolve operation order, comparison operators, tie-breaking, missing values, duplicates, empty inputs, units, and other conditions that could cause conforming-looking implementations to diverge.

#### Scenario: Implementations use different boundary comparisons

WHEN one implementation retains values equal to a threshold and another removes them,
THEN the approved comparison operator determines which behavior is conforming. An unspecified boundary prevents readiness.

#### Scenario: Sorting ties alter downstream output

WHEN equal-valued items can be ordered differently and that order affects results,
THEN the contract requires an approved tie-breaking rule before execution.

### Requirement: Resolve effective computational settings

The execution contract SHALL specify effective parameters and relevant dependency, numerical precision, device, and execution settings. It SHALL identify the approved sources of those values and rules for conflicting configuration. Unresolved defaults SHALL prevent readiness.

#### Scenario: A dependency update changes a default

WHEN an updated dependency changes behavior used by the approved operation,
THEN the update requires evaluation against the contract and cannot inherit approval merely because the command text is unchanged.

#### Scenario: Precision affects a numerical result

WHEN computational precision affects outputs within the step's comparison scope,
THEN its approved setting or explicitly approved equivalence condition must be recorded before the step is ready.

### Requirement: Control randomness and execution variability

The execution contract SHALL identify relevant sources of randomness and variation. It SHALL specify approved seeds, generation procedures, ordering, parallelism, and environment constraints where needed. A seed alone SHALL NOT establish reproducibility when other variation remains uncontrolled.

#### Scenario: Parallel execution changes a result

WHEN repeated execution with the same seed can produce different outputs because of parallel computation,
THEN the contract must resolve that execution behavior and the permitted comparison criterion before readiness is established.

### Requirement: Specify output identity and representation

The comparison contract SHALL identify the outputs being compared, their schemas, identifier alignment, ordering, units, and serialization requirements. Any ignored field or normalization performed for comparison SHALL require explicit approval.

#### Scenario: Timestamps differ between artifacts

WHEN an artifact contains a runtime-generated timestamp,
THEN the contract must explicitly define its required value or approve how that field is handled during comparison. The checker cannot silently discard it.

#### Scenario: Numerically equal tables have different row order

WHEN two tables contain the same values in different orders,
THEN the approved ordering or alignment rule determines equivalence. A checker cannot invent a sorting rule after observing the outputs.

### Requirement: Approve numerical comparison rules before execution

Each numerical comparison SHALL define its scope, metric, tolerance, boundary rule, and treatment of non-finite or missing values. Every tolerance SHALL have explicit user approval before execution. A library's default comparison tolerance SHALL NOT count as approval.

#### Scenario: A comparison relies on a default tolerance

WHEN a worker uses a numerical comparison function without specifying its effective tolerance,
THEN the reviewer requires the tolerance and its approval to be established before accepting the check.

#### Scenario: Relative error is undefined at a reference value

WHEN an approved comparison can encounter a zero or non-finite reference value,
THEN the contract must define the applicable behavior. The checker cannot silently switch metrics.

### Requirement: Classify every required output's comparison

Every required output and its compared fields SHALL have explicitly approved comparison categories and rules. The contract SHALL distinguish exact file content, exact logical content under approved representation rules, and numerical agreement under approved tolerances. Missing coverage SHALL prevent readiness.

#### Scenario: An output has no assigned comparison category

WHEN a required artifact appears in the output list without an approved comparison rule,
THEN validation reports the missing rule. It does not assume exact equality, choose a tolerance, or exclude the artifact.

### Requirement: Compare independent outputs directly when paired evidence is collected

When a step collects paired independent implementation evidence, its comparison contract SHALL define a direct comparison of the implementations' outputs. Independent agreement with a reference SHALL NOT substitute for pairwise agreement when the claim concerns agreement between implementations.

#### Scenario: Both results pass a reference check but disagree with each other

WHEN each implementation is within its approved tolerance of a reference but their outputs fail the approved pairwise comparison,
THEN the paired comparison fails and the discrepancy is reported.

### Requirement: Preserve comparison criteria when results disagree

The worker and reviewer SHALL NOT relax a tolerance, change a reference, remove an output, or alter a comparison rule to turn a mismatch into a pass without user approval. An approved criterion change SHALL create a distinguishable revision and require fresh applicable verification.

#### Scenario: A result narrowly fails its tolerance

WHEN a result falls outside an approved tolerance,
THEN the check reports failure under that contract. A proposed revised tolerance must be explained and decided by the user before it is used.

#### Scenario: A comparison rule is legitimately revised

WHEN the user approves a new comparison rule after a failure,
THEN the original failure remains recorded under its original contract. Fresh verification under the new revision does not rewrite the original result as a pass.

### Requirement: Establish acceptance evidence before implementation

The step SHALL identify approved fixtures, reference outputs, invariants, or other objective checks sufficient to evaluate its required behavior and output rules. Expected scientific findings SHALL NOT be invented to complete the contract.

#### Scenario: An experiment has an unknown scientific outcome

WHEN the experiment's result is not known in advance,
THEN the contract defines checks on the approved method, valid outputs, and reproducibility without inventing a favorable research result.

#### Scenario: Free-form output has no reproducible comparison

WHEN a required output has no agreed objective comparison rule,
THEN the step remains unresolved with respect to the requested reproducibility standard. The plugin explains the gap and asks the user to define the output or criterion more precisely.

### Requirement: Retain evidence sufficient to assess a run

Execution evidence SHALL identify the approved contract, inputs, implementation, effective settings, relevant environment, outputs, and check outcomes using content fingerprints or immutable references. Missing evidence SHALL prevent the affected reproducibility claim from passing review.

#### Scenario: Outputs cannot be connected to a reviewed version

WHEN the record does not establish which reviewed implementation and settings produced an artifact,
THEN the reviewer reports the missing association and does not certify that artifact as a conforming result.

### Requirement: Report the scope of reproducibility evidence

The plugin SHALL distinguish a specification intended to support independent implementation from evidence of an actual independent comparison. It SHALL report the tested inputs, environments, and criteria and SHALL NOT claim universal equivalence from a limited comparison.

#### Scenario: Only one implementation was exercised

WHEN only one implementation has been tested,
THEN the record describes those tests and does not claim that two independent implementations were compared.

#### Scenario: A comparison uses a limited fixture

WHEN independent implementations agree on one approved fixture,
THEN the report identifies that fixture and its coverage. It does not silently extend the result to untested environments or inputs.

### Requirement: Decide paired validation for each step

Each project step SHALL record an explicit user decision about paired unit validation before implementation readiness. An affirmative decision SHALL identify the units covered. A negative decision SHALL NOT waive the step's specification, acceptance checks, or independent reviewer.

#### Scenario: A step has no paired-validation decision

WHEN the user has not decided whether a step needs paired unit validation,
THEN the plugin requests that decision and does not silently enable or disable it.

### Requirement: Limit paired implementation to approved small units

Paired validation SHALL compare two implementations of the same approved function or small unit on small synthetic fixtures. It SHALL NOT duplicate large code blocks, run a second full project implementation, download production model weights, or train on real data as part of this comparison.

#### Scenario: A foundation-model project needs a function comparison

WHEN the selected unit is a transformation or numerical function within a large model workflow,
THEN the workers implement only that unit and compare its outputs on approved small vectors, tensors, or other synthetic fixtures without starting real-data training.

### Requirement: Give paired workers identical approved inputs and specifications

Before either paired worker prepares code, the unit specification, shared fixtures, comparison rules, and relevant dependency contracts SHALL be complete and approved. Both workers SHALL receive the same content versions. Fixture generation SHALL follow an approved rule and produce identical saved inputs for both workers.

#### Scenario: Workers receive separately generated random vectors

WHEN the fixture inputs differ between workers,
THEN the comparison is invalid even if both workers used a seed. The workflow requires the same approved saved input contents for both implementations.

### Requirement: Preserve implementation independence

Paired workers SHALL implement their assigned unit in separate contexts without receiving the other worker's implementation or results before their own implementation is fixed for comparison. A distinct reviewer SHALL assess each implementation against the shared approved contract.

#### Scenario: One worker copies the other implementation

WHEN a worker obtained the other worker's implementation before fixing its own,
THEN the result cannot be recorded as an independent paired implementation comparison.

### Requirement: Approve fixture coverage and expected behavior

The paired-validation contract SHALL identify normal, boundary, and invalid-input cases relevant to the unit and their expected outcomes or invariants. Both implementations SHALL satisfy those approved correctness checks in addition to direct pairwise comparison. Missing relevant cases SHALL be resolved before implementation.

#### Scenario: Both functions contain the same boundary error

WHEN two functions agree on a synthetic vector but both violate an approved boundary case,
THEN paired validation fails despite their agreement on the vector.

### Requirement: Bound paired-validation resources

The paired-validation contract SHALL specify approved fixture sizes, call counts, execution resources, and time limits. Missing bounds or a need to exceed approved bounds SHALL block the affected validation. The worker SHALL NOT enlarge the test or substitute real data on its own.

#### Scenario: A unit cannot be checked within its approved budget

WHEN the proposed comparison requires more resources than approved,
THEN the worker reports the limitation and requests a revised unit boundary or budget before continuing.

### Requirement: Include paired unit validation in release examples

Release verification SHALL include representative small-unit examples with two independent implementations, identical synthetic fixtures, approved expected behavior, and direct output comparisons. The evidence SHALL identify each contract, implementation, fixture, comparison rule, and result.

#### Scenario: Release examples contain only one implementation

WHEN a release claims paired-validation support but its examples exercise only one implementation,
THEN the paired release verification requirement is unmet.
