# Friendly technical explanations: verification

On 2026-10-21, Vibe2Spec incorporated the supplied Friendly Technical Explainer into its shared [explanation guide](../../friendly-explanations.md). The coordinator, worker, and reviewer all reference that guide. No separately installed skill, dependency, record-schema change, or runtime API change is required.

The guide covers direct answers, unfamiliar-topic orientation, human purpose before procedure, accurate vocabulary bridges, source-order walkthroughs, short paragraphs, comparison tables, and inspected local evidence. It preserves one unfamiliar decision at a time, familiar independent grouping, exact approved values, separate reviews, and explicit step acceptance.

## Actual response evaluation

The [evaluation protocol](../../explanation-evaluation.md) separates assistant-visible scenarios from the evaluator's rubric. Five scenarios cover six user turns: local function comparison, novice count-data onboarding, experimental scores, three missing-value options, and confusion followed by a narrow selection.

Separate agents generated the replies and assessed them. Responses were retained verbatim, including failures; scripted user replies are test inputs, not evidence that a person understood the explanation.

| Run | Cases / assistant turns | Assessment |
| --- | --- | --- |
| Initial | 5 / 6 | Four cases failed presentation or purpose criteria. The remaining case had incomplete exported approval state. Across response dimensions, 25 passed and 5 failed. |
| First retest | 4 / 4 | Novice onboarding and missing-value comparison passed. Local comparison and score explanation still had overlong paragraphs; local pending approvals were also missing from its state export. Across response dimensions, 20 passed and 2 failed. |
| Focused retest | 3 / 4 | Local comparison, scores, and both confusion turns passed all 19 applicable response dimensions and all four state checks. Pending approvals remained explicit. |

The first correction added a private pre-send check for purpose and presentation. The second advised drafting one or two sentences per paragraph, counting citation-only sentences toward the three-sentence ceiling, and retaining pending approvals in exported decision state. Neither correction changed the rubric or relaxed approval requirements.

The independent assessment found no unauthorized project execution or expanded approval in the initial or first-retest prose. Missing pending-approval entries were recorded separately as incomplete state evidence. Correct wording alone did not establish complete records.

## Preserved artifacts

| Evidence | Files |
| --- | --- |
| Initial policy, fixtures, and provenance | [Frozen inputs](inputs-initial.json), [source review](source-review.json) |
| Initial replies and assessment | [Actor A](responses-a.json), [actor B](responses-b.json), [assessment](assessment-initial.json) |
| First-retest policy and replies | [Frozen inputs](inputs-retest.json), [actor A](responses-retest-a.json), [actor B](responses-retest-b.json), [assessment](assessment-retest.json) |
| Focused policy and replies | [Frozen inputs](inputs-focused.json), [actor A](responses-focused-a.json), [actor B](responses-focused-b.json), [assessment](assessment-focused.json) |
| Automated checks | [Node.js 24.22.0](tests-node24.txt), [Node.js 26.11.1](tests-node26.txt), [final package and workflow checks](tests-final-package.txt) |

Each snapshot includes the six supplied policy, stimulus, rubric, and local-source files with their contents and SHA-256 hashes. The rubric was withheld from the generating agents. The local comparison replies include the read command, source hash, and line-numbered source; this is agent-captured reading evidence, not a separately authenticated host audit log.

## Automated and package verification

The full test suite passed **210 of 210 checks** on both Node.js 24.22.0 and 26.11.1 after the policy changes. Eight new checks validate the explanation fixtures, source-example behavior, numerical facts, and approval-state relationships. They do not grade prose or establish comprehension.

The shared plugin was rebuilt with `npm run build` for the existing Claude Code and Codex distribution. After the final example edits and response reports, all 14 packaging and workflow checks passed, including skill metadata and installed Markdown links. Final review evidence is retained alongside this report; this change does not claim a new marketplace publication or a fresh host-installation test.

## Scope and limitations

The initial actors handled two and three reset cases in their respective contexts. First-retest actors each handled two; the focused local/confusion actor also shared a context, while the focused score actor received only that case. Shared contexts can transfer habits between cases and are not equivalent to fully isolated conversations.

The focused run does not repeat the novice and missing-value cases. Their passing results belong to the first-retest policy snapshot. After focused generation, the final source review split long README and interview-example paragraphs and added a human-purpose explanation to the existing paired-validation example; these editorial examples were not followed by another behavioral run.

These results are bounded agent assessments, not proof of general reliability, measured improvement against a comparable baseline, or a human usability study. Exact snapshots distinguish the evaluated versions from later editorial changes. Earlier interview-clarity evidence and original release responses remain preserved.
