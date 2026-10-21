# Evaluating interview conversations

An interview can preserve approvals and still be difficult to understand. Evaluate both. The [conversation stimuli](../tests/fixtures/interview/conversations.json) exercise eight situations across two turns each. The [separate rubric](../tests/fixtures/interview/conversation-rubric.json) assesses pacing, observable consequences, project-specific reasoning, approved-context reuse, recovery from confusion, vocabulary, and exact approval scope.

The older [single-response cases](../tests/fixtures/interview/cases.json) remain useful for approval and behavioral examples. They do not establish that a user understood an explanation. Passing the automated tests verifies fixture relationships and example calculations. It does not score the quality of an agent's questions or prove human comprehension.

The [2026-10-21 assessment](release/interview-clarity/verification.md) records an actual run of these cases, a failed recommendation, and its focused retest. It preserves the original replies and distinguishes the tested policy versions.

The complementary [technical explanation evaluation](explanation-evaluation.md) checks source walkthroughs, vocabulary, numerical interpretation, presentation, and evidence from actual local files. Its separate cases preserve the same approval boundaries.

## Run a forward evaluation

Use the coordinator skill and interview guide as the policy under evaluation. Preserve their exact contents or record the repository commit and file hashes. Also record the stimulus and rubric hashes, the model or agent identifier when available, the date, available tools, and how contexts were separated. Do not invent unavailable model or session identifiers.

Start a fresh assistant context for each case where possible. Give it the policy, that case's project and audience, approved decisions, unapproved context, any conflicting approvals, prior conversation, and only the current user turn. Do not give it the rubric, expected decisions, future user turns, another candidate's responses, or an instruction to satisfy specific grading criteria. The audience describes demonstrated knowledge rather than a presumed level of intelligence.

This command exports only the first turn of one case from the repository root:

```sh
node --input-type=module - cutoff-boundary <<'NODE'
import { readFile } from 'node:fs/promises';
const fixture = JSON.parse(await readFile('tests/fixtures/interview/conversations.json', 'utf8'));
const item = fixture.cases.find(candidate => candidate.id === process.argv[2]);
if (!item) throw new Error('Unknown conversation case');
const { turns, ...context } = item;
console.log(JSON.stringify({ ...context, user: turns[0].user }, null, 2));
NODE
```

Ask the assistant to respond as it would to the user, without implementing or executing the project. Save its actual response verbatim. Then deliver the case's second user turn in the same conversation and save that response. The second turn is a scripted test stimulus, not a response from an actual user. Do not rewrite an awkward first response to make the second turn fit. If a response makes continuation incoherent, preserve it and let the evaluator identify the problem.

If tooling requires several cases to share one context, explicitly reset to each case's supplied context and record this limitation. Shared context can carry lessons between cases, so do not describe such a run as fully independent. A test operator may have access to the rubric for assessment, but the assistant producing the evaluated answers must not receive it.

## Assess the saved responses separately

Give a separate evaluator the policy, full stimuli, rubric, and exact saved transcripts. Ask it to judge behavior and meaning, not the presence of particular words. For each applicable dimension, retain a status of `pass`, `fail`, or `not_observed`, the case and turn, a short exact excerpt or identified omission, and the reason. Check the rubric's per-turn decision state as well as its prose criteria. Recommendations remain unapproved until the user selects them or supplies scoped delegation.

A case passes only when all applicable dimensions and turn restrictions pass. An unobserved criterion remains unresolved. Count all cases in the report, including failures and incomplete conversations. Preserve failures when revising the policy. A retest is a new run with new provenance, not an edit of the previous output.

Assess a recommendation at the turn where that decision is requested. A later recommendation about another setting cannot repair an earlier omission. When project facts do not support a preference, a clear explanation of the missing basis and a focused question can satisfy this obligation. Evaluator-visible decision metadata cannot supply an explanation absent from the user-facing reply.

The evaluator should distinguish independent settings from understandable settings. It should check whether a concrete example separates the options, whether a recommendation follows from this project's facts, whether a confused user receives a different explanation, and whether a later choice is accurately summarized. Extra explanations can introduce several unfamiliar decisions even when a response ends with only one question mark. Conversely, several sentences explaining one decision do not constitute several decisions.

Keep exact approval boundaries in view. Reusing an approved value does not approve a changed value. Translating a clear selection into a record does not require the user to learn field names or repeat that selection. It also does not waive complete-specification approval, separate reviews, or final step acceptance. A friendly or concise response that silently settles missing behavior fails.

## Report what the evidence supports

Store the evaluation as an evidence artifact with policy and fixture identities, context arrangement, actual transcripts, evaluator findings, and unresolved limitations. Separate assistant-generated outputs from scripted user turns. Do not claim that a scripted statement such as “Now I understand” demonstrates human understanding.

A forward evaluation can show whether the agent followed the intended conversation policy in these cases. Measuring improvement requires a preserved baseline evaluated on the same stimuli and criteria under comparable conditions. Without that comparison, report the revised policy's observed behavior without claiming a measured improvement.

Human comprehension requires separate evidence. In a user study, ask participants unfamiliar with the topic to explain each option's consequence in their own words and select the option that serves a stated goal. Record mistaken interpretations, requests for clarification, and unnecessary repeated decisions. Participation and actual responses must be recorded as such; an agent simulation cannot substitute for them.
