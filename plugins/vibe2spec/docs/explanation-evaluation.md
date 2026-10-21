# Evaluating technical explanations

The explanation evaluation checks whether Vibe2Spec applies the Friendly Technical Explainer guidance while preserving the approved meaning of a project. It complements the [interview evaluation](interview-evaluation.md): a well-paced question can still contain a misleading analogy, unsupported interpretation, or incorrect account of a local file.

The [assistant-visible stimuli](https://github.com/bao96-bioinfo/Vibe2Spec/blob/main/tests/fixtures/interview/explanation-cases.json) contain five cases and six user turns. The [separate rubric](https://github.com/bao96-bioinfo/Vibe2Spec/blob/main/tests/fixtures/interview/explanation-rubric.json) records semantic expectations, presentation criteria, and approval boundaries. The [automated tests](https://github.com/bao96-bioinfo/Vibe2Spec/blob/main/tests/explanation-evaluation.test.mjs) check fixture relationships, numerical facts, and the small local source example. They do not grade generated prose or establish human comprehension.

The [2026-10-21 verification report](release/friendly-explanations/verification.md) retains actual replies, independent assessments, failed cases, and focused retests with exact policy snapshots. Passing results across successive snapshots are not described as a single final-version evaluation.

| Case | Explanation being tested | Evidence to assess |
|---|---|---|
| Local function comparison | Answer a specific question from the actual workspace source | Reading trace, exact count of matching functions, the empty-array difference, and useful file-and-line links |
| Novice count data | Introduce a dense unfamiliar passage | A short Big Picture, a human purpose before procedure, bounded vocabulary bridges, original terms, and source order |
| Source order and scores | Interpret three experimental bullets | Brief accurate quotations, original order, the size of the score drop, uncertainty about adequacy, and the unchanged approved tolerance |
| Three missing-value options | Explain and recommend among three alternatives | Concrete consequences and a summary table without introducing additional decisions or approving the recommendation |
| Confused order follow-up | Repair an ineffective explanation and receive a later selection | A distinguishing before-and-after example, project-specific reasoning, reuse of approved settings, and the exact limited selection |

## Run without exposing the answer key

Preserve the exact coordinator and explanation policy supplied to the assistant, along with their paths, hashes, and repository revision when available. Record stimulus, rubric, and local source identities; the available model or agent identifier; date; tools; and context arrangement. Do not invent missing identifiers. Include every policy document actually supplied and retain the tool trace for the local-file case.

Start a fresh assistant context for each case where possible. Supply only that case's project, audience, approved decisions, source descriptions, prior history, and current user turn, together with the policy under evaluation. Do not give the generating assistant the rubric, expected counts, evaluator checks, future turns, or another candidate's answer. The local-file case must have read access to the actual [source fixture](https://github.com/bao96-bioinfo/Vibe2Spec/blob/main/tests/fixtures/interview/explanation-source.mjs); giving it a summary of that file does not test whether it checks the workspace.

Export one first-turn prompt from the repository root with this command:

```sh
node --input-type=module - local-function-comparison <<'NODE'
import { readFile } from 'node:fs/promises';
const data = JSON.parse(await readFile('tests/fixtures/interview/explanation-cases.json', 'utf8'));
const item = data.cases.find(candidate => candidate.id === process.argv[2]);
if (!item) throw new Error('Unknown explanation case');
const { turns, ...context } = item;
console.log(JSON.stringify({ ...context, user: turns[0].user }, null, 2));
NODE
```

Ask the assistant to respond naturally as the coordinator, without implementing or executing the project. Read-only source inspection is part of the local-file case. Save each actual response verbatim. For the confusion case, deliver the second user turn in the same context after saving the first response. Do not reveal that second turn early or rewrite the first response to make the continuation fit.

If cases share a context, record that limitation and explicitly reset to the supplied case context between them. Such a run is not equivalent to isolated conversations. A scripted follow-up is a test input; its wording does not demonstrate that a real person understood the earlier explanation.

## Assess meaning and presentation separately

Give a separate evaluator the frozen policy, complete stimuli, rubric, exact responses, and relevant tool traces. For each applicable dimension, record `pass`, `fail`, or `not_observed`, the case and turn, a short quotation or precise omission, and the reasoning. A missing reading trace makes source inspection unobserved even when the final answer happens to be correct. Incorrect behavior is a failure, not merely missing evidence.

Evaluate the content and the requested presentation. A bold opening that gives the wrong answer fails. A correct explanation can still fail an applicable presentation requirement, such as omitting a summary table when comparing three alternatives. Do not award semantic credit for keywords, count question marks as decisions, or use prose regular expressions as a substitute for reviewing the response.

Apply structure proportionately. A novice passage needs orientation and vocabulary bridges; a short confirmation does not need an invented glossary or a new Big Picture section. Inspect whether analogies preserve the original meaning and state their limits. A library-size analogy, for example, must not equate recorded counts with all genetic material in a cell. A numerical drop has a calculable size, but adequacy requires a criterion that these fixtures deliberately do not supply.

Keep precise approvals distinct from explanations. The comparison tolerance governs agreement between implementations, not the model's prediction score. A recommended missing-value policy remains unresolved until selected. The confusion follow-up selects output ordering only. Record translation, attractive formatting, or a clear explanation must not expand any of those authorizations.

## Preserve results and their limits

A case passes only if every applicable criterion and turn-state restriction passes. Count failures and incomplete cases in the report, retain original responses, and record policy fixes and retests as new evidence. A later reply cannot retroactively supply a missing explanation at the turn where the user needed it.

These fixtures measure observed assistant behavior under five scenarios. Automated test success establishes only the stated fixture checks. Claims of improvement need a comparable baseline; claims of human comprehension need actual participants interpreting consequences and making decisions. Report an agent's assessment and a scripted user's selection as those forms of evidence, without presenting them as a human usability study.
