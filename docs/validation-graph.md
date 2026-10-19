# Exact-file validation

The reusable `loadGraph` function in `scripts/graph.mjs` accepts an explicitly selected workspace and entry record. It follows only the references declared by version 1 of the record format. It does not search directories, execute stored commands, edit records, or treat a literal decision value that resembles a reference as permission to read a file.

```javascript
import { loadGraph } from './scripts/graph.mjs';
import { assessReadiness } from './scripts/readiness.mjs';

const graph = await loadGraph({
  workspace: '/absolute/project/workspace',
  entry: '.vibe2spec/records/project/project-state/r3.json',
  externalFiles: [],
});
const readinessFindings = assessReadiness(graph);
```

The workspace is a nonsymbolic absolute directory. References inside it use workspace-relative paths, including references written in nested records. External access requires the exact absolute filename in `externalFiles`; authorizing a directory does not authorize its children. The caller must obtain the user's approval for the workspace and external filenames before invoking the helper. Supplying an argument does not authenticate that approval.

## Inspection profile

| Option in `limits` | Default | Meaning |
| --- | ---: | --- |
| `jsonBytes` | 1,048,576 | Maximum bytes in one JSON file. |
| `supportingBytes` | 4,194,304 | Maximum bytes in one other supporting artifact. |
| `totalBytes` | 16,777,216 | Maximum total bytes in distinct successfully read files. |
| `files` | 512 | Maximum distinct file-read attempts. |
| `references` | 4,096 | Maximum declared reference edges followed. |
| `depth` | 64 | Maximum nested JSON container depth. |
| `values` | 100,000 | Maximum JSON values in one file. |
| `findings` | 512 | Maximum reported graph findings, reserving the final slot for an incomplete-assessment finding when necessary. |
| `concurrentReads` | 1 | Supported concurrency. Reads occur sequentially. |
| `deadlineMs` | 5,000 | Assessment time budget, checked before traversal and file reads. |

Limits are positive safe integers. `findings` requires at least two slots, and `concurrentReads` must equal one. Unknown limit names are rejected. Exact count, byte and depth boundaries are inclusive. Starting an additional operation beyond a bound leaves the assessment incomplete. A deadline is reached when elapsed time is greater than or equal to its value. The deadline is cooperative; an operating-system filesystem call that does not return cannot be interrupted by this helper.

Traversal starts at the selected entry. Each record's declared reference descriptors are ordered by the UTF-8 bytes of their JSON Pointer and traversed depth first. Previously read files are cached by their exact supplied spelling. This ordering is independent of locale. The parser checks source member order directly rather than relying on JavaScript's enumeration of integer-like keys.

## Filesystem checks

The loader checks every path ancestor, rejects symbolic components and nonordinary files, and rejects workspace absolute aliases and case collisions. It opens files without following a final symbolic link. File identity, size and modification metadata are compared before and after reading. Ancestor identity is checked again. A detected change yields `input-changed`; permission errors and unsupported access yield incomplete assessment. These observations do not promise protection against every hostile filesystem race.

Every reference verifies the exact SHA-256 digest. Snapshot entries additionally verify byte length. A broken reference stops that branch without substituting another revision. Independent branches continue while the profile permits. Record references are checked for kind, project, context, duplicate identity and cycles. Plain supporting JSON files receive strict parsing, but become record graphs only when their declared use or their envelope identifies a record.

The returned `records` and `artifacts` are Maps keyed by the supplied path. Artifact values hold `bytes` and `sha256`. `recordValidity` identifies whether each decoded record passed its local schema checks; an invalid record cannot supply approval or valid referenced evidence. `entry_sha256` identifies the completely read entry. `complete` is false when required work remains unperformed. The result also exposes `edges`, the effective `limits`, and observed `stats` for callers that need inspection diagnostics. These are observations, not authorization or lifecycle transitions.

## Readiness checks

`assessReadiness(graph)` requires a project entry and its exact current step. It checks frozen required records, resolved decisions, approval coverage, unit ownership, requirement and check relationships, an explicit pairing choice, current accepted dependencies, and a passing separate specification review of the complete normative scope. Project-wide settings must also be approved. Authoring templates and fictional examples cannot establish actual project readiness.

The complete specification requires a step-specification approval covering its entire required scope. Several partial approvals do not replace that final package approval. Grouped decision approvals can still be retained during the interview. Project-wide settings participate in the specification scope, its review and its execution snapshot. The command-line readiness operation combines graph, readiness and lifecycle findings; callers using the reusable functions must retain all three assessments.

A review's independence includes authors found through the entire transitive assessment scope, including earlier reviewers. Omitting a known author from `artifact_authors` does not evade the independence check. A missing passing review cannot be replaced by a worker's self-assessment.

The helper cannot interpret arbitrary prose, authenticate a human response, establish actual context independence from labels alone, or discover undisclosed history. The separate reviewer must assess complete effective arguments, readable and structured consistency, mathematical meaning, provenance and execution evidence. Revisions are assessed within the explicitly selected graph; absence of an undisclosed earlier version is not proof that it never existed. A report with mechanically satisfied conditions does not permit skipping these obligations.
