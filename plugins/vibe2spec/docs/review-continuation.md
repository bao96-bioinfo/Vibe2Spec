# Focused correction reviews

If a review finds one defect, the next review should check its correction and affected behavior without redoing independent checks that already passed. This requires explicit evidence of what passed and which exact inputs it depended on. The absence of a finding is not that evidence.

## A concrete example

Suppose a step prepares a number-filtering function and an independent report-title formatter. The first review confirms the approved report title but finds that filtering uses `>` when the specification requires `>=`.

| Obligation | First review | Correction review |
| --- | --- | --- |
| Inclusive filtering boundary | Requires correction: `[2]` at threshold `2` must return `[2]` | Inspect the corrected operator, its arguments, callers, and approved boundary checks |
| Independent report title | Passes with exact input and dependency references | Reuse only if those references and criteria still match and the fix does not affect it |
| Complete step gate | Blocked by filtering defect | Pass only after the defect is resolved and all current obligations are covered |

If the fix changes a shared formatter, configuration source, interface, or comparison criterion, inspect the affected obligations too. An unchanged caller can behave differently when a callee changes. Keep each coverage item as small as its real dependencies allow; do not invent independence to reduce the packet.

```text
Initial review: all obligations -> explicit passes + all findings
                                      |
                         preserve baseline; correct defect
                                      v
Correction review: fix + affected dependencies + prior findings
                   reuse applicable explicit passes
                                      |
                      all obligations pass? -- no --> stop at budget
                                      |              report blockers
                                     yes
                                      v
                         continue through remaining gates
```

The normal budget is one initial review and one correction review per phase. A recorded user-approved limit overrides it. Further review needs an explicit budget extension or smaller scope. A smaller scope does not waive obligations in the original gate. Specification approval, pre-execution review, results review, and explicit user acceptance remain required.

## Record the covered obligations

Use [review-covered.json](../templates/review-covered.json) for the initial assessment and [review-correction.json](../templates/review-correction.json) for a continuation. Templates are unresolved drafts. Fill them with actual evidence; they are not examples of a passing project review.

The optional `coverage` field follows `findings` in review content. It is a nonempty array with unique item IDs. Each CoverageItem has these fields in order:

| Field | Meaning and constraint |
| --- | --- |
| `id` | Stable Identifier for this review obligation, retained across corrections |
| `input_refs` | Nonempty array of exact Refs to assessed artifacts |
| `dependency_refs` | Array of exact Refs to the evidence and dependencies needed for this obligation |
| `check_ids` | Unique Identifiers for the required step checks this item assesses; empty when none apply |
| `outcome` | `pass`, `changes_required`, or `unable_to_determine` |

References cannot repeat within an item. All referenced artifacts must belong to the current assessment scope. Every non-snapshot artifact in that scope must be covered. An item containing a structured record must include that record's transitive assessment dependencies, excluding snapshot containers. A required step check must be covered by an item containing its owning step and dependencies. The helper verifies these recorded relationships. The reviewer still identifies semantic dependencies in raw code, callers, environment, and scientific assumptions; the helper does not infer them.

In a covered review, a finding's `path` is an exact artifact path covered by an item, or `""` for a whole-review issue. Put the field, line, observed defect, requirement, and required remedy in `message`. Keep each `(code, path)` pair unique so later resolutions are unambiguous. An item cannot be marked passing when a finding names its input or dependency path; a whole-review finding prevents every item from passing. This conservative rule avoids reusing disputed evidence.

## Bind a correction to its baseline

The optional `continuation` field follows `coverage`, which it requires. It has these fields in order:

| Field | Meaning and constraint |
| --- | --- |
| `baseline_review_ref` | Exact Ref to a valid frozen same-phase review with complete explicit coverage and outcome `pass` or `changes_required` |
| `reused_coverage_ids` | Unique IDs of current items whose earlier passing evidence remains applicable |
| `finding_resolutions` | Array of resolutions for baseline findings, each with `code`, `path`, `coverage_ids`, and `detail` in that order |

Each resolution names an actual baseline `(code, path)` pair, nonempty unique IDs of fresh passing current items, and a nonempty explanation. At least one cited item retains the ID of a baseline item covering that finding's path; for a whole-review finding, any baseline item can establish this association. This permits a corrected artifact at a new preserved path without letting an unrelated fresh check resolve the defect. The reviewer verifies that the evidence actually supports the remedy.

Reuse requires the same item ID, exact input and dependency reference sets, check-ID set, and passing outcomes in both reviews. Array order does not change set equality. Moving identical bytes to a new path requires fresh review. Changed dependencies or criteria also require fresh review. A current pass needs all current items passing, no current findings, and a fresh supported resolution for every baseline finding. An unsuccessful correction may retain unresolved findings but cannot establish readiness.

Keep the historical baseline outside the current assessment snapshot. The explicit continuation edge loads and validates it for provenance without making its reviewer an author of the current product. The same independent reviewer can therefore check a correction. This exception applies only to that edge: it does not excuse self-review of product artifacts or ignore earlier reviews explicitly included in the assessment scope. A replacement reviewer can use the same durable evidence without inheriting the entire conversation.

Preserve baseline files and all exact referenced bytes. Do not overwrite an old path and expect its old digest to remain usable. Baseline chains are validated recursively with cycle and depth bounds; invalid, incomplete, or unsupported baselines cannot supply reusable evidence. Legacy reviews remain supported, but a legacy baseline needs a fresh explicit covered assessment before item-level reuse is possible.

## Prepare a compact inspection packet

From the installed plugin root:

```text
node scripts/vibe2spec.mjs review-packet \
  --workspace <approved-workspace> \
  --entry <draft-or-frozen-review-record> \
  --format readable
```

The helper reads the explicitly selected record and exact references under the existing [file limits](validation-graph.md). It reports current and baseline identities, candidate reusable and fresh coverage, inspection paths, prior finding locations, and measured artifact byte counts. It prints no artifact bodies and writes no files. JSON is the default format. The existing `--external-file` and `--limit` options apply; `--operation` does not.

Candidate reuse is navigation advice, not approval or readiness. The reviewer confirms impact and every required obligation. Scope bytes measure preserved artifacts; inspection bytes measure the proposed fresh artifact set. Neither is a model-token estimate or a guarantee of time saved. The helper can still read the complete reference graph to verify integrity even when the reviewer only reads bodies needed for fresh obligations.

See [the review protocol](review.md) for effort limits, consolidated findings, execution restrictions, and stop conditions, and [the source notes](review-sources.md) for the Superpowers mechanisms adapted here.
