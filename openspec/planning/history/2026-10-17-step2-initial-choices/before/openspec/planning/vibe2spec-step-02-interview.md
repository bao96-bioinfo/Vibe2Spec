# Step 2 interview: validation and readiness

## Current status

Step 1 is finished under [its acceptance record](../changes/add-vibe2spec-guided-workflow/steps/01-records-and-templates/evidence/acceptance-v1.md). The user stated `Step 1 review result is accepted`. Tasks 1.1 through 1.6 are complete, giving 6 of 56 tasks complete. Step 2 is now current for interview and specification. Its implementation is not authorized while required decisions remain unresolved.

## Established scope

Step 2 covers tasks 2.1 through 2.6 in [the roadmap](../changes/add-vibe2spec-guided-workflow/tasks.md). It supplies Node.js record loading and validation, snapshot and reference verification, structural readiness checks, tests, and explanatory documentation. The approved Step 1 record format is its input contract. Changes to that accepted format require necessity and the explicit reopening process.

The helper must distinguish a structurally valid document from a step that has the required approval and review evidence. It cannot establish human identity or decide whether a scientific explanation is semantically complete. The separate reviewer retains those responsibilities. Values stored as commands are data; validation does not execute them.

## First grouped questions

These questions were presented through the conversation's question interface. Each remains unresolved until the user answers. Recommendations are proposals and supply no approval. Exact interfaces, fixtures, reports, limits, and commands still need a complete reviewed specification afterward.

### S2-DEPENDENCIES: helper dependencies

The helpers need to read JSON, check declared fields, fingerprint file contents, and run small tests. Using Node.js built-in modules avoids installing additional packages and reduces dependencies in both host packages. The project would maintain its own field-checking logic. A third-party validator could supply reusable type-checking machinery, but introduces a dependency and still cannot establish semantic completeness or genuine user approval.

The presented recommendation is to use only Node.js built-in modules. The alternative permits a third-party library after its purpose and exact version are reviewed. The user has already selected Node.js and JSON; this question concerns additional packages. Status: unresolved.

### S2-REPORTS: report interfaces

A JSON report gives agents stable named fields to inspect. A readable mode can explain the same finding, for example: “The field review_stats is not defined; this record cannot pass validation.” The recommended option provides JSON and readable output modes from the same findings. The alternative provides JSON only and leaves its explanation to the agent. Providing both requires specifying and checking two representations; providing JSON only makes the helper smaller.

The example wording is illustrative. Exact field names, message text, output ordering, and exit codes remain undecided. Status: unresolved.

### S2-PAIR: small independent implementation comparison

The recommended option compares two independent implementations of one small validation function. A candidate checks format version and required record identification fields. Both workers would receive the same complete specification and saved small JSON examples. Each result would be checked against expected findings and compared directly with the other result.

Pairing adds implementation and review work and can reveal ambiguous interpretation. Finite examples cannot prove correctness for every input. The alternative uses one implementation with specified tests and separate review. Neither option duplicates the full validator or uses real datasets. The exact selected function, input cases, expected results, and resource limits require subsequent approval. Status: unresolved.

## Remaining specification work

The interview must resolve the development runtime and module interface, command-line entry points, required arguments, report schema and ordering, exit status meanings, and permitted filesystem access. It must define error accumulation, malformed JSON handling, reference traversal, record identity checks, resource bounds, and the distinction between a failed check and an assessment that cannot be completed.

The specification must map accepted Step 1 rules to deterministic checks without inventing new record fields. It must identify which obligations require semantic review and which lifecycle operations remain in their later steps. The fixture plan must preserve accepted examples and use new, separately specified artifacts for additional cases. Any selected paired unit receives the same complete current-step context as the primary implementation.

The read-only planning audit by `/root/step2_contract_gaps` found no necessary amendment to Step 1. It identified additional decisions for later interview groups: callable functions and command-line access; read-only validation versus explicit report-writing operations; selection of the entry record and bounded reference traversal; decoding and numeric-token checks; and treatment of partial assessments when limits or access failures prevent completion. These are open decisions, not authorizations.

The input selection must not combine historical evidence with unrelated later records merely because both exist in a directory. The accepted fixture graph contains multiple historical states. Assessment must follow the selected state and its applicable references. An external path appearing inside a record does not itself authorize reading that location.

The parser design must preserve information needed to reject invalid or unsupported input before ordinary parsing loses it. Examples include repeated object keys and integers beyond the safe range. The accepted format already prohibits silent rounding. Step 2 must specify a conforming detection method and its checks without changing that rule.

Not every existing fixture is a purely mechanical check. For example, detecting that a Markdown instruction says to reverse an array while a structured method says to copy it requires semantic assessment. The detailed coverage map must distinguish automated cases from reviewer obligations and later lifecycle behavior. It must not alter accepted examples or claim that all twenty-four cases are automatically evaluated.

## Research and environment observations

Read-only environment inspection found Node.js `v26.11.1`, npm `11.20.0`, and Darwin arm64. These observations do not approve a Step 2 runtime or define the distributed compatibility range. The first step's runtime approval applied only to that step's verification.

The [Node.js release page](https://nodejs.org/en/about/previous-releases), accessed on 2026-10-18 UTC, identifies Node.js 24 as a long-term support line and Node.js 26 as Current. Long-term support provides an extended maintenance period. The exact development version and any additional installation or compatibility checks remain for user decision.

Node.js documents a [built-in test runner](https://nodejs.org/api/test.html) and [cryptographic hashing](https://nodejs.org/api/crypto.html). These support the proposed dependency policy. API availability and the exact commands must still be checked against the selected runtime before the execution specification is approved.
