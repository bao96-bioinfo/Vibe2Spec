# Validation interface

The helpers require Node.js 24.22.0 or later within major version 24, or Node.js 26.11.1 or later within major version 26. Those minimum versions are tested on macOS arm64. Other major versions are unresolved until compatibility verification. No additional Node.js packages are required.

The coordinator obtains approval for the workspace, exact entry record, external files and inspection bounds. It then invokes the read-only helper from the installed plugin directory. References are resolved from the selected workspace, regardless of the plugin's location.

```sh
node scripts/vibe2spec.mjs validate \
  --workspace /absolute/project/workspace \
  --entry .vibe2spec/records/project/project-state/r3.json \
  --operation implementation_readiness \
  --format readable
```

`--operation structure` checks the selected reference graph and record shapes. `implementation_readiness` additionally checks current-step approval, specification review, and lifecycle evidence. `lifecycle` checks the recorded execution, acceptance and reopening relationships. These assessments inspect evidence. They do not grant permission, advance state, or establish the authenticity of recorded claims.

`--format` accepts `json` (the default) or `readable`. Both contain the same findings and four mandatory reviewer obligations. Repeated `--external-file` options authorize only their exact absolute filenames at the caller interface. Their actual user approval remains a workflow obligation. Repeated `--limit name=value` options select the documented positive integer limits in [Exact-file validation](validation-graph.md). An unknown or repeated argument, invalid limit, or absent required value produces an invocation report.

```sh
node scripts/vibe2spec.mjs overview \
  --workspace /absolute/project/workspace \
  --entry .vibe2spec/records/project/project-state/r3.json
```

The overview command validates its input before rendering recorded states as ASCII. It never marks a step finished. It accepts the same external-file and limit options. For programmable use, import `validate` and `formatReport` from `scripts/report.mjs`, `loadGraph` from `scripts/graph.mjs`, or the specific pure checker modules. `validate` accepts `{workspace, entry, operation, externalFiles, limits}` and returns a report; `formatReport` returns a string.

## Compact review packets

`review-packet --workspace <workspace> --entry <review-record> [--format json|readable]` prepares [review navigation](review-continuation.md) from a draft or frozen review and its exact references. It accepts the same external-file and limit options but rejects `--operation`. A successful packet contains candidate reuse, fresh inspection paths, finding locations, and artifact byte counts, with no file bodies. It is read-only and does not authorize work or declare readiness. Errors use the report format and exit statuses below.

For programmable use, `buildReviewPacket(graph, {startedAt})` from `scripts/review-packet.mjs` accepts a graph returned by `loadGraph` and returns `{packet, report}`. The options object is optional. `startedAt` is a finite `performance.now()` timestamp captured before loading when the caller needs one combined deadline; by default it is captured at the packet function's entry. The command-line interface captures it before loading. Combined assessment findings obey the configured bound, and an exhausted deadline or findings budget suppresses the packet and marks assessment incomplete. A rejected or incomplete input has `packet: null` and a diagnostic report. `formatReviewPacket(packet, format)` returns JSON or readable text. The caller must retain the actual graph integrity findings; constructing a map of declarations is not a substitute for loading and checking their bytes.

Packet version 1 contains `notice`, current and baseline review identities and snapshot references, `phase`, `candidate_reuse_ids`, `fresh_coverage_ids`, `uncovered_paths`, `uncovered_checks`, `inspection_paths`, `baseline_findings`, and `measurements`. Each uncovered check names its owning `step_path` and `check_id`. Each prior finding names its `code`, affected `path`, baseline `record_path`, and JSON `pointer`. Measurements distinguish current scope files/bytes, proposed inspection files/bytes, and actual graph files/bytes read. Missing check coverage expands inspection to the owning step and its dependencies, even if every file path was otherwise covered.

## Reports and exit status

The report has a fixed field order: report version, operation, entry path and digest, target step identity and revision, completion, structure, implementation readiness, lifecycle status, findings, reviewer obligations, and exit status. JSON uses two-space indentation and a final line feed. Readable output quotes values so embedded line breaks cannot obscure finding boundaries. Reports omit wall-clock timestamps and machine-specific filesystem errors.

| Status | Meaning |
| --- | --- |
| 0 | The selected mechanical checks completed successfully. Separate review and actual approval still apply. |
| 1 | At least one known structural defect or workflow blocker exists. Other checks may remain incomplete. |
| 2 | Assessment is incomplete without a known defect or blocker. |
| 3 | Invocation is invalid; assessment did not start. |
| 4 | An unexpected internal or output error prevented completion. |

`completion` must be inspected alongside the status. A report can contain both a known defect and an unreadable independent branch. Findings sort by category, then UTF-8 path, pointer, code, and related path. Duplicate diagnostic locations are suppressed. The findings bound applies to the combined report. If exceeded, the last slot records the resource limit and completion remains incomplete.

The deadline covers graph loading and the complete assessment. It is checked cooperatively. A system call that never returns cannot be interrupted by this in-process helper. Structural validation permits unresolved draft values. Readiness reports required unresolved values without filling them. A valid frozen recommendation still needs exact-scope approval.

The reviewer must assess semantic completeness, actual approval provenance, real context independence, and evidence authenticity. Plain text fields and a successful helper exit cannot prove these facts. The [record format](record-format.md), [record validation guide](validation-records.md), [graph guide](validation-graph.md), and [lifecycle guide](lifecycle.md) define the scope in detail.
