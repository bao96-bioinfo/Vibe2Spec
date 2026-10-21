# Independent bounded review

Outcome: **changes required** for packet assessment resource limits. No review-reuse or approval-gate bypass was confirmed in the inspected continuation changes. This is one bounded source and instruction-behavior pass, not a complete project audit.

Reviewer context: `/root/focused_review_evaluation`, separate from the implementing agents. No recursive reviewers or runtime/documentation edits were performed; only these release evidence artifacts were written.

## Actionable finding

**RRC-01 — Medium: packet assessment bypasses combined limits.** `scripts/vibe2spec.mjs` dispatches `review-packet` directly through `loadGraph` and `buildReviewPacket`; `scripts/review-packet.mjs:12` calls `createReport` using the loader's completion state. New baseline-assessment findings at `scripts/review-packet.mjs:38` receive neither the combined findings bound nor the assessment-wide deadline finalization used by `scripts/report.mjs:45–48`. `docs/validation.md:43–45` requires the combined findings bound and a deadline covering loading plus complete assessment; `docs/validation.md:29` gives packet the same limit options.

A focused CLI probe added five valid, uncovered artifacts to the baseline snapshot and invoked `review-packet --limit findings=2`. Observed result:

```json
{"case":"packet assessment findings=2","exit_status":1,"completion":"complete","findings_count":5,"findings":["review-coverage-missing","review-coverage-missing","review-coverage-missing","review-coverage-missing","review-coverage-missing"]}
```

Expected: at most two reported findings, reserving a resource-limit finding and marking completion incomplete. Also carry the start time across loading and packet assessment and apply the existing cooperative deadline before returning a successful packet. The missing deadline finalization is source-confirmed; no artificial timing probe was performed. Root received this finding before this report was saved. Any later fix needs its own narrow verification and does not erase the observed failure.

## Behavior probe judgment

Raw responses were saved first in [behavior-responses.json](behavior-responses.json), before this judgment. These are synthetic next-action responses from this reviewer, not live execution of a product workflow or proof that every model will comply.

| Case | Judgment | Concrete next action evidenced in the raw response |
| --- | --- | --- |
| Filter-only correction, independent formatter explicitly passed | Pass | Preserve baseline and complete snapshot; send round 2 to the same independent reviewer; inspect filter operator, arguments, callers, boundary check and prior finding; reuse formatter only after matching its exact references, checks and criteria. Execution remains pending. |
| Formatter bytes unchanged, shared configuration changed | Pass | Make formatter coverage fresh and inspect the effective shared setting and affected checks; expand to other consumers only for concrete impact; keep unapproved behavior blocked. |
| Two rounds exhausted with a genuine extra unapproved argument | Pass | Return `changes_required`, preserve remaining finding and coverage, stop automatic dispatch and execution, request explicit decision plus review-budget extension or agreed narrower scope; narrowing does not pass the original gate. |

Instruction evidence: `skills/vibe2spec/SKILL.md:46,60`; `skills/vibe2spec-review/SKILL.md:28–34`; `skills/vibe2spec-worker/SKILL.md:26,30,34–36`; `docs/review.md:34,40–48,62–70`; `docs/review-continuation.md:7–15,32,48–68`; `templates/review-handoff.md:9–19`.

## Source coverage and limits

Inspected the changed schema/validation code in `scripts/records.mjs`, findings in `scripts/findings.mjs`, continuation/scope logic in `scripts/readiness.mjs`, and new `tests/review-continuation.test.mjs`; then the completed `scripts/review-packet.mjs`, CLI diff, and `tests/review-packet.test.mjs`. Followed only the named resource-limit risk into relevant lines of `scripts/report.mjs`, `scripts/graph.mjs`, `docs/validation.md`, and `docs/validation-graph.md`.

Covered optional-field legacy compatibility, exact set comparison, complete current coverage, required-check ownership, baseline preservation and eligibility, fresh finding-resolution association, unchanged-worker and transitive-author independence, cycle/depth handling, packet candidate-versus-approval wording, dependency expansion, uncovered checks, read-only CLI behavior, and error/limit flow. Existing test cases were inspected rather than rerunning their suites. Root reported 32 focused runtime passes, 90 documentation/template/workflow passes, and 16 packet/report passes; those counts were not independently rerun here.

A separate narrow probe for duplicate input/dependency references was rejected by the current code: graph findings `duplicate-value` twice, record finding `duplicate-value`, and review findings `review-baseline-invalid`, `review-coverage-required`, `review-finding-resolution-invalid`, `review-reuse-mismatch`, `review-not-passing`. This refuted the suspected acceptance gap; it is not a remaining finding. No full suite, broad project audit, or prepared product execution was performed.

## Observed effort

First timed instruction read: 2026-10-21T21:09:32.403028+00:00. Report recorded: 2026-10-21T21:12:41.878848+00:00. Elapsed wall time between these observations: 189.5 seconds, including coordination and waiting. Initial workspace discovery preceded the start observation and is not included. Through this artifact write: 16 top-level tool calls, including 12 `functions.exec` calls containing 14 shell invocations, three coordination messages, and one coordination wait. A final coordination notification will add one top-level call. Token usage: unavailable.
