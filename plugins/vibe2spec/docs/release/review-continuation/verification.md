# Review continuation verification

The `reduce-review-cost` change adds explicit reusable review coverage, compact inspection packets, and bounded correction guidance to the shared Claude Code/Codex package. It adapts concepts from the inspected local Superpowers 7.0.0 sources without adding a dependency. See [source provenance](../../review-sources.md) and [the workflow contract](../../review-continuation.md).

## Automated checks

| Check | Observed result |
| --- | --- |
| `node --test tests/*.test.mjs`, Node.js 26.11.1, macOS arm64 | 256 passed, zero failures or skips; test-runner duration 3265.512958 milliseconds |
| Same suite with `/tmp/node-v24.22.0-darwin-arm64/bin/node` | 256 passed, zero failures or skips; test-runner duration 3177.756917 milliseconds |
| `openspec validate reduce-review-cost --strict` | Valid |
| `npm run build` | Shared plugin assembled from source; no third-party Node.js dependencies |
| Package manifest, runtime parity, and installed link checks | Pass in the full suite; rerun after final evidence assembly |
| `git diff --check` | Pass |

The new runtime cases exercise partial-baseline reuse, changed inputs and dependencies, changed criteria, missing scope/checks, false passing coverage, ambiguous findings, fresh resolution association, preserved baseline bytes, invalid phases/chains, and reviewer independence. Packet cases exercise compact deterministic output, overlapping dependencies, uncovered checks, read-only operation, exact-reference failures, invocation failures, and combined resource limits. Existing lifecycle and legacy-record tests remain in the full suite.

## Independent review and correction

One [initial independent review](independent-review.md) assessed the changed implementation and three synthetic instruction cases. It found a resource-finalization defect: packet assessment could exceed the caller's findings bound and lacked a combined deadline check. That observed failure remains in the original report.

The author corrected only packet finalization, the command's timer, associated tests, and API documentation. The same independent reviewer inspected those changes and ran only the three relevant regressions. Its [correction review](correction-review.md) passed; previously completed coverage was retained. It did not restart a whole-project audit. The reviewer recorded 19 tool calls across both assessments; token usage was unavailable.

The [raw behavior responses](behavior-responses.json) were saved before judgment. They supported all three expected actions: reuse an independently passing formatter after a filter-only fix, freshly inspect it when shared configuration changes, and stop automatic review dispatch after the two-round budget with an unapproved argument unresolved. These are bounded synthetic observations, not proof of universal model compliance or a live host workflow benchmark.

## Inspection-scope observation

The [fictional packet example](packet-example.json), generated from the packet test fixture, reports:

| Measured set | Files | Bytes |
| --- | ---: | ---: |
| Current assessment artifacts, excluding snapshot containers | 3 | 124,054 |
| Suggested fresh inspection artifacts | 1 | 18 |
| Full graph read for integrity, including history and records | 8 | 129,416 |

The example deliberately includes an unchanged independent artifact. It demonstrates omission of that artifact's body from suggested fresh inspection. Byte counts are not token measurements, and this example does not estimate savings for a large scientific project. The machine still validates the full reference graph; the reviewer confirms semantic impact before accepting candidate reuse.

Effort limits remain instruction based. The helper enforces its recorded file/assessment limits but cannot intercept every agent action. User approval, separate reviews, exact complete snapshots, and explicit final acceptance remain required. This change rebuilt the local distribution; it did not publish a marketplace release or repeat host installation tests.
