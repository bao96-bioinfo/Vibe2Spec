# Completing and reopening project steps

Vibe2Spec repeats the full workflow for each step. The overall plan gives direction; approval of that overview does not approve detailed execution settings for future steps.

```text
Agree on the ordered project overview
                 |
                 v
       Select the current step <----------------------+
                 |                                    |
                 v                                    |
 Interview and research every required choice         |
                 |                                    |
                 v                                    |
 Preserve specification, obtain user approval,         |
 and obtain a separate specification review           |
                 |                                    |
                 v                                    |
 Prepare approved work and obtain separate             |
 pre-execution review                                 |
                 |                                    |
                 v                                    |
 Execute, retain observations, check results,          |
 and obtain a separate results review                 |
                 |                                    |
                 v                                    |
 Obtain explicit user acceptance                      |
                 |                                    |
                 v                                    |
 Preserve the finished step ------ another step ------+
                 |
          all steps finished
                 |
                 v
       Preserve the final project evidence
```

`assessLifecycle(graph)` in `scripts/lifecycle.mjs` inspects a selected project entry. It returns findings without changing state or authorizing execution. It checks the evidence asserted by the recorded state rather than deriving approval from a checkbox, completion claim or prose response alone.

## Evidence at each boundary

| Boundary | Required evidence |
| --- | --- |
| Start implementation | Complete frozen step and unit contracts; applicable approvals of exact normative contents; passing separate specification review; accepted applicable dependencies. |
| Start execution | The implementation conditions and preserved prepared work assessed by a passing separate pre-execution review. Commands, code, effective defaults, configuration and relevant environment behavior belong in that review. |
| Await acceptance | Actual run and output evidence, complete required comparisons, passing checks, and a separate results review covering the same work and results. |
| Finish a step | All prior conditions and explicit user acceptance identifying the exact step revision, specification, reviewed work, runs and comparisons. |
| Start the next step | The current step is finished. Later details become current through a fresh interview and specification cycle. |

Run settings are traced to approved decisions. Literal values must match exactly. Stored check observations are recomputed against their approved expected values when the rule is supported by the comparison helper. A saved `pass` label cannot conceal a recomputed failure. Arbitrary mathematical formulas remain outside automatic evaluation; unsupported checks produce an incomplete assessment. Actual output provenance and whether saved observations truthfully describe execution still require the separate reviewer.

Paired comparisons retain both independent run identities and prepared implementations. Each implementation is checked against the expected result, then directly against the other. Both use identical saved input contents, and their worker contexts must differ. Rules and ordered check identities must match the approved unit. Agreement alone does not establish correctness.

The built-in lifecycle checker binds a pairwise comparison rule to an approved decision whose literal value is that complete Rule object. A different recorded rule is a mismatch. Other representations require a separately specified checker and remain mechanically indeterminate here. A vague approval of closeness cannot authorize a numerical tolerance selected afterward.

Execution input snapshots include the approved step inputs and unit fixtures. An additional input receives an unapproved-input finding. Output snapshots include approved step outputs and permitted unit write paths; they may also retain unchanged input bytes to demonstrate that inputs were not modified. Other additional artifacts receive an unapproved-output finding. A draft run cannot establish accepted results. These checks concern the supplied records; the reviewer must still determine whether actual filesystem access and writes were fully recorded.

Historical failure evidence remains visible. A failed attempt is not automatically accepted because a later attempt passes. Acceptance explicitly selects the runs and comparisons being finalized, and those selected results must all pass. A failed or indeterminate review can remain an honest pending record, but cannot satisfy a required passing gate.

## Necessary amendments

A completed step remains preserved. A proposed amendment identifies the blocking requirement, explains why correction is necessary, lists every affected specification, decision, script, configuration, input and output, and identifies downstream consequences. A preference for different code is insufficient.

The exact amendment receives explicit user approval. The corresponding step opens a new revision and returns its affected choices to interview and specification. Approval to reopen is not approval of unresolved revised choices or future results. New preserved files use new paths; historical accepted contents are not overwritten. If another affected file or operation is discovered, work on that additional scope pauses until expanded approval is recorded.

Affected downstream steps are suspended. Their `blocked_by` entries name direct dependencies and must ultimately reach a reopened, approved amendment whose revised result is still unaccepted. Stale results, reviews and acceptance remain historical evidence rather than current completion evidence. After the revised upstream result is accepted, affected checks, reviews and acceptance must be renewed before those dependent steps finish. Unaffected completed steps remain preserved.

The helper checks exact amendment references, the accepted predecessor and next step revision, scope approval, preservation of earlier files, recorded affected states and dependency links. The reviewer determines whether the stated necessity and edit inventory cover the actual proposed changes. The helper does not invent dependency impact from prose or silently expand an approved amendment.

## Resuming in another session or host

Read the exact selected project revision and follow its retained evidence. Locate the first unfinished step and report its unresolved decisions or reviews. A host change does not replace approvals, change paths or reset completed steps. Missing files, changed digests, unsupported checks and inconsistent state remain visible and block reliance on the affected evidence. The coordinator obtains a separate review session when native delegation is unavailable.

Fictional fixtures exercise these relationships without claiming real user approval or execution. Lifecycle inspection can assess their internal consistency; project implementation readiness additionally rejects their example context. Mechanical consistency and authentic authority remain separate assessments.
