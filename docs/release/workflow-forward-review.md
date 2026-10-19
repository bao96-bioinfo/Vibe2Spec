# Independent forward assessment of the shared workflows

A separate evaluator context, `/root/workflow_forward_and_examples`, assessed the coordinator, worker, and reviewer instructions against eight interview stimuli and fourteen review stimuli. It first read the three skill files and their linked guidance. It then used a script to display each scenario with the `expected` field removed. Source snippets remained data and were never executed. The evaluator wrote its actual responses to [workflow-forward-responses.json](workflow-forward-responses.json) before opening the expected assessments.

The saved response file has SHA-256 fingerprint `8515b63d53bbda08ffb1e18d02e3b838ee99c3ff2f34180113cae3c3653f89c0`. The subsequent comparison found that all fourteen review outcomes matched the reference outcomes. All eight interview responses preserved the intended unresolved choices and selected the expected next action. This is a bounded qualitative assessment of these stimuli, not a claim that every host or future model will follow every instruction.

## Interview observations

| Scenario | Observed response and assessment |
| --- | --- |
| Paper direction | Explained why topic and venue determine the research plan, asked for the missing direction, and retained feasibility and detailed planning as unresolved. It chose no topic, model, or dataset. Success criteria and resources remain later interview requirements; the initial question appropriately prioritizes the missing direction. |
| Partial grouped answer | Recorded only the explicitly accepted ordering and non-mutation policies. Explained that retaining `[5, 2, 2]` preserves three observations while `[5, 2]` preserves two. Asked about repeats and explicitly left the actual threshold unresolved. |
| Non-distinguishing example | Replaced the misleading already-sorted example with `[5, 2, 4, 1]`. It showed `[5, 2, 4]` versus `[2, 4, 5]` and explained the consequence for source sequence. |
| Dataset-dependent question | Explained why dataset and measurement technology determine appropriate filtering rules. Asked for organism, cell types, and constraints before proposing dataset-specific cutoffs. It described the evidence needed without inventing a completed literature review. |
| Unavailable research | Identified the missing paper and research capability, requested accessible material or a research-capable session, and withheld an unsupported method recommendation. |
| Mutation hidden by return value | Explained that later code would retain `[1, 2, 5]` with a new result array but see `[2, 5]` after mutation. It rejected the unsupported speed claim and asked for the user's policy. |
| Delegation scope | Selected preserved ordering under the explicit ordering delegation. It did not extend delegation to the unresolved threshold or manufacture acceptance. |
| Paired validation cost | Limited the proposal to one additional small masking implementation and its reviews. It required shared saved fixtures, individual correctness, and direct comparison. It stated the coverage limit and excluded duplicate model training. |

The detailed explanations resolve the original concern about terse option labels. They identify the situation, the decision's effect, an observable example, the reason for a recommendation, and the remaining selection. Grouping preserves independent approval status. A user's uncertainty remains visible instead of being converted into a default.

## Review observations

| Scenario | Actual outcome | Material observation |
| --- | --- | --- |
| Missing boundary | `changes_required` | Equality at the threshold had no approved behavior. The response showed the distinct outputs and returned the choice to interview. |
| Hidden library default | `changes_required` | The omitted threshold became the library default `0`, contradicting the approved `2`. The response required a corrected actual call and fresh review. |
| Extra sorting argument | `changes_required` | `sort: true` changed the approved output order. The response identified the call and a distinguishing input. |
| Environment override | `changes_required` | The environment made the effective worker count eight despite configuration text saying one. |
| Changed input | `changes_required` | The actual input fingerprint differed. Passing output checks did not erase the violation. |
| Relaxed tolerance | `changes_required` | An error near `0.03` failed the approved `0.01` bound. The response preserved that failure and rejected the substituted `0.05` tolerance. |
| Missing execution evidence | `unable_to_determine` | Output alone could not establish commands, runtime, or effective settings. Acceptance remained pending. |
| Same reviewer context | `unable_to_determine` | A different session label did not separate the reviewer from the author's context. |
| Source changed after review | `changes_required` | Replacing `>=` with `>` invalidated the existing review and changed equality behavior. |
| Matching incorrect pair | `changes_required` | Both outputs agreed with each other but failed the expected result. |
| Reference checks pass, pair fails | `changes_required` | Both reference errors were near `0.09`, while the direct difference was near `0.18` and failed the approved `0.10` pairwise tolerance. |
| Edit to a finished step | `changes_required` | Simplifying later work did not justify a protected edit. The response required a demonstrated blocking defect and approved exact amendment inventory. |
| No native reviewer | `unable_to_determine` | Self-review did not satisfy separation. The response required a separate-session handoff and kept execution pending. |
| Compliant filter | `pass` | The response traced input validation, inclusive filtering, order, repeats, lack of mutation, and absent defaults to the supplied complete contract. It limited the pass to that fictional pre-execution scope. |

The saved responses retain concrete findings and corrective actions. They do not use the exact reference finding-code vocabulary in every sentence; this assessment compares meaning and gate behavior rather than requiring a particular wording. Each unsupported or contradictory case preserves its blocking condition. The compliant case is a positive control, so the assessment does not reward rejecting every input indiscriminately.

## Lifecycle evidence

The [complete fictional project history](../../examples/project-cycle/README.md) supplements the focused scenarios with five preserved entry records in one workspace. It demonstrates a first step awaiting acceptance, acceptance followed by the second step's interview, a necessary reopening with dependent work suspended, renewed acceptance, and completion of the second step through its own evidence chain.

The eleven project-cycle tests check exact saved references and lifecycle consistency. They also challenge premature completion without acceptance, premature resumption during reopening, an omitted affected work artifact, and a missing results reviewer. Every fixture remains in example context. Real-project implementation-readiness assessment rejects that context even when its fictional lifecycle is mechanically coherent.

These tests verify the saved records and mechanical gates. They do not prove the fictional user spoke, the fictional reviewers worked independently, or the recorded commands executed. Those limitations are stated in the example itself and remain review obligations in a real project.
