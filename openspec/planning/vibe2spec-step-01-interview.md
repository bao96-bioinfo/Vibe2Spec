# Step 1 interview: records and specification templates

## Current status

The active change is `add-vibe2spec-guided-workflow`. Tasks 1.1 through 1.6 are complete, giving 6 of 56 implementation tasks complete. Step 1 is finished and Step 2 is current for interview and specification.

The user approved specification revision 4 with the response `Approved.`, recorded in `evidence/specification-approval-r4.md`. Its twenty deliverables are implemented as prepared version 1. Separate pre-execution review passed, the single approved verification run passed, and a distinct results reviewer passed all eleven required assessments with no unresolved findings. The user subsequently replied `Step 1 review result is accepted`. The [acceptance record](../changes/add-vibe2spec-guided-workflow/steps/01-records-and-templates/evidence/acceptance-v1.md) binds this response to the exact delivered version and evidence. Earlier specification and prepared-work versions remain preserved.

## Established scope

Step 1 covers tasks 1.1 through 1.6 in `../changes/add-vibe2spec-guided-workflow/tasks.md`. It defines readable documentation, JSON record templates, and small example records. Node.js validation helpers belong to Step 2. No plugin package, helper implementation, model training, or scientific dataset is part of the current scope.

The existing requirements already establish Markdown and JSON records, explicit user decisions, version-bound approval, independent review, and step-by-step completion. They also establish that recommendations, unanswered questions, and implicit defaults do not authorize work. Those decisions are retained without reopening the architecture interview.

## Approved grouped choices

| Decision | Options presented | Recommendation | Status |
| --- | --- | --- | --- |
| S1-HISTORY | Editable drafts with preserved presented or reviewed versions; preserve every saved draft version | Permit draft edits and preserve every version presented for approval or assessed by a reviewer | Approved: option A |
| S1-FIELDS | Fixed workflow fields with a designated project-settings section; additional fields anywhere subject to review | Reject unknown workflow fields and allow explicitly approved domain settings in their designated section | Approved: option A |
| S1-PAIR | No paired implementations for the documents-only step; revise scope to include a small executable function | No paired implementations in Step 1; retain independent specification and results reviews | Approved: option A |

The supporting user response is: "My choices are A. Editable drafts; preserve presented and reviewed versions; A. Fixed workflow fields plus a project-settings section; A. No paired implementations in Step 1". These initial policies were subsequently made concrete in revision 4. The later `Approved.` response covers that complete technical package.

## Approved deliverables

| Task | Deliverable | Required content |
| --- | --- | --- |
| 1.1 | `docs/record-format.md` | Exact fields, types, permitted states, identity and reference meanings, and representative examples |
| 1.2 | Project, decision, evidence, and approval templates | Partial answers, unresolved choices, evidence provenance, and exact approved contents |
| 1.3 | Step behavior, design, task, contract, and unit templates | Complete current-step context, traceable decisions and checks, and the accepted writing conventions |
| 1.4 | Review, run, comparison, acceptance, and amendment templates | Three review phases, output comparison coverage, version provenance, and every planned affected script edit |
| 1.5 | Complete and deliberately incomplete records under `tests/fixtures/records/` | Parseable examples with explicit expected findings for missing, conflicting, changed, or unapproved content |
| 1.6 | Verification, independent review, and user acceptance evidence | Exact delivered artifacts assessed and explicitly accepted before Step 2 begins |

The approved manifest specifies twenty product files. Its exact contents are in `../changes/add-vibe2spec-guided-workflow/steps/01-records-and-templates/revisions/4/spec.md` and its three companion files. The table above identifies the corresponding outputs in the existing roadmap.

## Approved technical package

| Group | Proposed contents | Approval status |
| --- | --- | --- |
| S1-FORMAT | Exact record fields and state evidence; workspace and external paths; incomplete drafts; fixed workflow fields and project settings | Approved, revision 4 |
| S1-VERSIONS | Exact-byte preservation, SHA-256 content fingerprints, and separate approval, review, progress, and acceptance records | Approved, revision 4 |
| S1-EXAMPLES | Twenty exact deliverables, twelve JSON templates, twenty-nine virtual artifacts, and twenty-four fixture cases | Approved, revision 4 |
| S1-CHECKS | Existing Node.js v26.11.1 for read-only parsing and hashing; manual contract assessment; separate pre-execution and results reviews; specified resource limits | Approved, revision 4 |

The frozen package has a separate `4-manifest.json`. Its original proposed status remains part of its history; the later approval record establishes current authority without rewriting that manifest. Review findings are retained in `../changes/add-vibe2spec-guided-workflow/steps/01-records-and-templates/reviews/`. Implementation is limited to the twenty approved product files. OpenSpec format validation passed; that check does not establish product correctness.

## Details required by the current-step specification

The specification must define the common record fields and each record type. It must distinguish a draft's valid structure from readiness to authorize work. Deliberately incomplete templates and negative examples must remain representable without being mistaken for approved project state.

The specification must identify exactly what an approval references. Recording an approval or changing a displayed status must not alter the content that approval identifies. A content digest must not require a record to contain its own digest or create circular dependencies between a decision and its approval. The selected versioning approach will determine the concrete representation.

The specification must define record identities, revision identities, reference locations, required and optional values, unknown-field handling, and the relationship between prose and structured settings. It must also define how partial approval, changed decisions, superseded revisions, review findings, and inapplicable fields are represented.

Every example needs exact inputs, expected findings, and an approved comparison rule. A fictional example must be identified as fictional and must not be treated as a real user approval. A negative example must identify the rule it violates and the expected finding. A deliberately unresolved example must remain unready.

The specification must fix the verification procedure, its available runtime if a tool is needed, permitted file writes, resource bounds, and evidence locations before verification runs. Paired implementations are explicitly disabled for Step 1 by the user's response above. Independent reviews and explicit completion acceptance remain required.

## Acceptance coverage to resolve

| Area | Required assessment |
| --- | --- |
| Record completeness | Every record type and lifecycle phase required by the release behavior can be represented |
| Decision authority | A recommendation, missing response, or partially answered group cannot create approval for unresolved settings |
| Version identity | Changed decision contents cannot inherit an older approval; historical evidence retains its original association |
| Cross-references | Missing, conflicting, or incorrectly versioned references remain visible and cannot establish readiness |
| Current-step readiness | A complete isolated unit cannot bypass unresolved required decisions for its step |
| Reviewer independence | Specification, pre-execution, and results reviews identify a separate assessment and its exact scope |
| Comparison coverage | Each required output has an explicit comparison category; tolerances and normalization have no implicit defaults |
| Completion and reopening | Checks, review, and user acceptance are distinct; a necessary amendment records exact scope and repeats the affected step process |
| Example truthfulness | Demonstration approvals and outcomes cannot be confused with actual project evidence |

These coverage obligations are addressed by the approved exact fixtures and check outcomes in revision 4. Delivered artifacts and actual execution evidence receive their own assessments.

## Advancement rule

The complete Step 1 specification has user approval and passing separate specification review. Prepared version 1 received passing independent pre-execution review. The single approved verification run passed with exit code 0 using Node.js v26.11.1. Separate results review passed. The user's explicit result acceptance now completes the final gate for this version. Step 2 may begin its own interview and specification. No Step 2 implementation choice is approved by this handoff.
