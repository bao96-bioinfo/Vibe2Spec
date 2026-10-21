# Interview policy assessment, 2026-10-21

The revised interview policy introduces one unfamiliar decision at a time, explains observable consequences, and grounds recommendations in the current project. Familiar independent settings can still share a review. Applicable approved context supplies already settled answers. Precise records retain the user's meaning and leave additional settings unapproved.

## Actual conversation evidence

Two fresh responding contexts, `/root/interview_forward_a` and `/root/interview_forward_b`, each handled four fictional cases. Each first reply was saved before its scripted second user turn was supplied. Responders read the coordinator, interview guide, and authoring guide. They received no rubric or earlier candidate responses. Cases within each context were reset by instruction, not by starting another context.

A separate assessor, `/root/interview_change_review`, read the actual replies and the held-out rubric. Seven of the eight initial cases passed. The cutoff-boundary case failed because its first reply described the consequences but supplied neither a recommendation nor an explanation of the missing basis for one. Its approval handling passed. A recommendation about repeats in its next reply did not repair the earlier omission.

| Initial case | Assessment |
| --- | --- |
| Cutoff boundary | Failed the recommendation criterion; other applicable dimensions and approval states passed. |
| Familiar grouped settings | Passed, including retaining a partially answered choice as unresolved. |
| Approved context | Passed, including rejecting a newer unapproved draft as authority. |
| Confusion repair | Passed with a different input whose outputs distinguish the choices. |
| Bounded paired implementation | Passed with a training-specific reason and no duplicate model training. |
| Expert numerical comparison | Passed with appropriate vocabulary and exact user-selected tolerance. |
| Conflicting approvals | Passed by asking about the conflicting directory while preserving other settings. |
| Precise translation | Passed without treating selected behaviors as approval of the full specification. |

The correction explicitly requires a recommendation for the decision at the turn when it is requested, or an explanation of the missing basis and a focused question. A new context, `/root/interview_forward_cutoff`, repeated the two-turn cutoff case without the rubric or earlier replies. The separate assessor passed that focused retest. The new reply tied including equality to the stated goal of counting observations that meet the cutoff and retained it as a recommendation until selection.

The initial run's [inputs](inputs.json), [consolidated responses](responses-initial.json), and [assessment](assessment-initial.json) remain preserved. The original raw [first four cases](forward-a.json) and [second four cases](forward-b.json) retain the exact bytes hashed by the assessor. The focused retest has separate [inputs](inputs-retest.json), [responses and provenance](responses-retest.json), [raw replies](forward-cutoff.json), and [assessment](assessment-retest.json). Snapshot JSON files contain exact policy and fixture contents with SHA-256 fingerprints. The rubric and stimuli were unchanged for the retest.

After the retest, review clarified that a simple confirmation need not ask another question. The public example also explicitly states when a missing statement of intent prevents a recommendation. These wording clarifications received source review; the seven initially passing cases were not rerun under the corrected policy. This is an initial eight-case run and a focused retest, not a new eight-case sweep.

## Automated verification

| Check | Observed result |
| --- | --- |
| Node.js 26.11.1, macOS arm64 | 202 tests passed, zero failures. [Output](tests-node26.txt). |
| Node.js 24.22.0, macOS arm64 | 202 tests passed, zero failures. [Output](tests-node24.txt). |
| Evaluation fixtures | Ten new checks cover stimulus/rubric separation, turn alignment, approval scope, conflicting sources, and exact numerical choices. These validate evaluation data, not comprehension. |
| Skill metadata and resource links | Repository Node.js checks passed for the supported plain frontmatter and linked resources. The optional skill-creator Python validator could not start because PyYAML is absent; no Python package was installed. |
| OpenSpec change | `openspec validate improve-interview-clarity --strict` passed. |
| Plugin assembly | Regenerated through `npm run build`; the package checks verify source parity and documentation links. |

The original forward-response file remains unchanged with SHA-256 `8515b63d53bbda08ffb1e18d02e3b838ee99c3ff2f34180113cae3c3653f89c0`. Its older review now states that approval handling and detailed explanations did not establish user comprehension. Record schemas, runtime APIs, and acceptance gates were not changed.

The [final independent review](final-review.md) found no unresolved issues within this scope. It verified the preserved assessment evidence, approval boundaries, corrected examples, and packaged resource behavior.

## Limits

The user turns are scripted, including statements of understanding. They are not observed human responses. The assessors judged actual model-generated replies against stated criteria; no human comprehension study or controlled baseline comparison was conducted. Four cases shared each initial responding context, so cross-case learning cannot be excluded. One sample per case does not establish reliability across models, hosts, or future sessions. Model identifiers were not exposed by the delegation interface and are not invented here.

The [evaluation protocol](../../interview-evaluation.md) describes how to repeat this assessment and separately collect evidence from actual users. These checks verify this working-tree policy and generated package; they do not claim a marketplace update was published or that installed host behavior was reverified in this change.
