# Step 2 runtime and verification proposal

## Status and established decisions

This is a planning proposal. It does not authorize implementation, runtime acquisition, test execution, fixture changes, or any operation on accepted Step 1 artifacts. The exact values and methods proposed below require approval in the complete Step 2 specification.

The user has approved Node.js built-in modules only, JSON and readable report modes, reusable functions and a command-line interface, read-only helpers, an explicit entry record and approved access locations, collection of independent findings with incomplete assessments distinguished, paired implementation of the small record-envelope checker, use of the installed Node.js 26.11.1 for development, and compatibility with a Node.js long-term support release. Long-term support means that a release line receives maintenance for an extended period. The exact paired-unit interface, precise compatibility baseline, test fixtures, resource bounds, runtime acquisition, and exact execution commands remain unresolved.

The accepted format in `docs/record-format.md` remains the input contract. The twenty-four accepted fixture cases remain unchanged. Their division between mechanical checks, semantic review, and later lifecycle or comparison work is described in the adjacent `coverage.md` proposal. This document proposes how to verify the Step 2 implementation once its full specification is approved.

## Runtime compatibility recommendation

Use Node.js 26.11.1 in the existing Darwin arm64 development environment. For compatibility verification, use an explicitly selected Node.js 24 long-term support version on the same operating system and architecture. The current official release page identifies the 24 line as long-term support, and the official 24-line documentation is currently labeled 24.22.0. Therefore, 24.22.0 is the proposed exact compatibility version, subject to approval and verified availability. These observations do not establish that a binary is installed or that this package works on it. [Node.js releases](https://nodejs.org/en/about/previous-releases), [Node.js 24 documentation](https://nodejs.org/docs/latest-v24.x/api/test.html).

| Item | Proposed specification | Consequence |
| --- | --- | --- |
| Development runtime | Use the existing exact Node.js 26.11.1 binary, recording its resolved path and identity before execution. | Development can proceed in the existing environment after specification and pre-execution review. |
| Compatibility runtime | Test the same prepared work under exact Node.js 24.22.0, after approving its source, location, and acquisition method. | A passing run supplies evidence for this specific long-term support patch and environment. |
| Implementation baseline | Use stable built-in interfaces documented for the selected Node.js 24 version. Use explicit ECMAScript modules in `.mjs` files, as already proposed in the roadmap. | A convenient interface available only in Node.js 26 cannot silently become a dependency. |
| Compatibility claim | Report the two exact tested versions. Treat wider support across the 24 line as a target requiring an explicit minimum version and relevant checks. | Testing one patch does not prove compatibility with every earlier or future patch. |
| Public package metadata | Fix the exact `engines.node` declaration together with the accepted minimum version. Do not use a broad lower-bound-only range that implicitly claims untested future major versions. | The final declared range must distinguish the supported long-term support target from the approved development version. Its exact syntax remains to be approved. |
| Host compatibility | Preserve runtime verification evidence for the later Claude Code and Codex packages. | Local Node.js checks do not replace marketplace installation, delegation, update, removal, or cross-host checks assigned to Steps 8 and 9. |

The proposed first verification matrix has two rows: Node.js 26.11.1 on the observed Darwin arm64 host and Node.js 24.22.0 on that same host. A separate operating system or architecture would add a separately specified matrix row. Lexical tests for supported path forms can run on this host, but a Windows-style path string test is not evidence of an actual Windows filesystem run.

The Node.js 24 documentation identifies the built-in test runner, filesystem module, and cryptographic module as stable. The proposal uses ordinary assertions, bounded file reads and metadata inspection, and SHA-256 hashing from those built-ins. Exact functions and flags must be inventoried during specification so that stability of a module is not confused with stability of every interface it contains. [Test runner](https://nodejs.org/docs/latest-v24.x/api/test.html), [Filesystem](https://nodejs.org/docs/latest-v24.x/api/fs.html), [Cryptography](https://nodejs.org/docs/latest-v24.x/api/crypto.html).

## Acquiring the compatibility runtime

Prefer an existing user-selected compatible binary if its version and identity can be verified. If no such binary is available, propose an isolated official Node.js archive rather than replacing the development installation. Its download, extraction location, archive digest, binary path, permitted disk use, and network operation must appear in the approved specification before acquisition.

For the proposed Darwin arm64 runtime, the candidate archive is `node-v24.22.0-darwin-arm64.tar.gz` from the official Node.js distribution directory for that version. The exact download URL, published checksum, archive size, extraction method, and resulting binary identity remain unresolved. Attempts to inspect the version-pinned checksum and documentation URLs through the research tool did not return usable contents. The reachable 24-line documentation alone does not verify the archive. No archive has been downloaded, installed, extracted, or executed for this proposal.

Runtime acquisition would be a separately recorded setup operation. Package tests themselves would have no network access, package installation, automatic runtime download, or host installation side effects. No `npm install` prerequisite is proposed because no additional Node.js packages are selected. The approved setup still needs to identify any non-Node archive tool it uses, rather than treating that tool as an unstated prerequisite.

If the selected compatibility binary cannot be obtained or does not match its expected identity, preserve that failure and leave compatibility verification pending. Do not substitute another patch, use the development run as compatibility evidence, or mark the long-term support requirement complete.

## Test organization

The following paths are proposed additions. They do not exist as approved implementation deliverables merely because they are listed here. The final specification must assign every test to a requirement, exact fixture, expected result, and approved command.

| Proposed artifact | Responsibility | Important boundary |
| --- | --- | --- |
| `tests/records.test.mjs` | Exercise the parser, common envelope, record-family structures, identity rules, and deterministic findings. | Unsupported raw numeric representations and repeated keys must be assessed before ordinary parsing loses their meaning. |
| `tests/snapshots.test.mjs` | Exercise authorized path resolution, file-kind checks, references, snapshots, exact bytes, and bounded traversal. | No repair, alternate-revision fallback, or mutation of accepted records is allowed. |
| `tests/readiness.test.mjs` | Exercise the complete selected current-step contract, approvals, units, output rules, explicit pairing choice, dependency evidence, and passing specification review. | A structurally valid draft or complete isolated unit cannot obtain step readiness. |
| `tests/cli.test.mjs` | Exercise the approved command-line arguments, JSON and readable reports, standard streams, exit statuses, and consistency with reusable functions. | Each child command, environment value, working directory, and expected output must be explicit. |
| `tests/paired-envelope.test.mjs` | Compare the record-envelope checker's two independent implementations against the same expected results and against one another. | The exact path and interface remain proposals. This test does not duplicate the full validator. |
| `tests/fixtures/validation/` | Preserve new raw-byte, structure, path, graph, readiness, reporting, and boundary fixtures with explicit expected findings. | New fixtures do not overwrite or expand the accepted Step 1 fixtures in place. |
| `tests/fixtures/paired-envelope/` | Preserve the exact shared small-unit cases and expected results. | Values must be approved before either worker implements the unit. |
| `tests/support/` | Contain only the specified virtual-file adapter, test support, and any verification supervisor required by the approved plan. | Test support is executable code and receives the same review before execution as other prepared work. |

Use the Node.js built-in test runner with an explicit ordered inventory of test files. Propose one test file at a time, no watch mode, no automatic fixture update mode, no hidden test-name filtering, and no required checks marked skipped or unfinished. Each runtime runs the same prepared source and fixture snapshot. The exact runner arguments and package-script expansion remain to be written into the execution contract after interfaces and filenames are approved.

Tests of fictional records should construct their virtual artifacts in memory where the check does not require actual filesystem behavior. Filesystem-specific tests require a separately approved temporary workspace containing only test-created artifacts. The helper under test remains read-only; test preparation and cleanup are separate authorized operations. Their create and remove paths must be enumerated. A fixture representing an external location must not cause access outside the approved test locations.

The accepted twenty-four cases retain their original scoped assessment and expected categories. An adapter applies each case independently to an in-memory copy of the accepted base. It preserves or rebuilds references exactly as the accepted fixture contract directs. Cases requiring semantic assessment or later lifecycle behavior remain explicitly identified. A successful structural contribution does not count as automatic completion of the entire original case.

## Proposed assessment resource profile

The following numbers are proposed limits for the Step 2 verification profile. They are not new limits on the version 1 record format and are not approved defaults for every future user project. Larger projects would need their own explicit resource decisions. The public callable and command-line interfaces must receive the selected limits through the approved interface; they cannot silently increase them.

One mebibyte is 1,048,576 bytes. The byte columns below use exact decimal byte counts so that no unit conversion is implicit.

| Resource | Proposed limit | Exact counting rule and reason |
| --- | ---: | --- |
| One JSON record or JSON fixture artifact | 1,048,576 bytes | Count raw input bytes before decoding. This bounds parser work while leaving substantial space beyond the current small fixtures. |
| One non-record supporting artifact | 4,194,304 bytes | Count bytes read for digest verification. This permits documentation and small prepared artifacts without authorizing large data or model reads. |
| Total input bytes in one assessment | 16,777,216 bytes | Count bytes actually read across the assessment, including repeated reads if the implementation performs them. The specification must not hide duplicate work by counting only unique file sizes. |
| Distinct referenced artifacts in one assessment | 512 | Count distinct approved resolved paths admitted to traversal, including the entry artifact. Repeated edges to an already assessed artifact do not create a second distinct artifact. |
| Reference edges in one assessment | 4,096 | Count each encountered reference occurrence and each snapshot entry edge. Repeated references consume edge capacity even when target bytes are cached. |
| Nested JSON containers | 64 | The root object or array has depth 1; each nested object or array adds 1; scalar values do not add a container level. |
| Parsed JSON values | 100,000 | Count each object, array, and scalar value once. Object property names do not count as values; their bytes remain bounded by the input-byte limit. |
| Collected findings | 512 | Retain the first 512 findings under the approved deterministic ordering. Encountering another finding makes the assessment incomplete and adds a separately specified limit indication; it must never silently produce a complete pass. |
| Sequential file-read concurrency | 1 | Read one artifact at a time during one assessment. This makes ordering and total resource accounting easier to reproduce. |
| Cooperative assessment deadline | 5,000 milliseconds | Check elapsed monotonic time at specified parser and traversal boundaries. Reaching the deadline stops further assessment and reports incomplete evaluation. This is not a guarantee against a synchronously blocked process. |
| Child-process verification deadline | 10,000 milliseconds | An independent verification supervisor monitors each invoked helper or paired-unit batch. A timed-out process yields failed verification and preserved evidence. The supervisor's exact termination and evidence behavior still needs specification. |
| Captured standard output plus standard error per child invocation | 4,194,304 bytes | Count bytes received by the supervisor. Exceeding the capture limit stops the invocation and records incomplete evidence without silently truncating a passing report. |

The complete specification must decide whether the generic JSON-record limit also applies when a supporting fixture is itself JSON but is not a Vibe2Spec record. This table proposes that it does. The accepted embedded fixture container is a test input, not a record of a thirteenth kind; its parsing and virtual-byte accounting must be explicitly defined by the test adapter.

All count, byte, and depth limits are proposed as inclusive. An assessment with exactly the approved maximum is permitted when all other checks can finish; attempting to consume one additional unit stops the affected work. The deadline is proposed as exclusive: when elapsed time reaches the approved duration, the assessment is incomplete. These distinctions must be approved along with the numbers.

## Testing resource boundaries

Each count, byte, and depth limit needs cases immediately below the bound, exactly at the bound, and immediately above it. For a proposed maximum of 512 distinct artifacts, for example, the relevant proposed cases have 511, 512, and 513 artifacts. They must be generated from an approved deterministic recipe or preserved as approved files. This example proposes fixture sizes; it does not authorize creating or running them.

Boundary tests should isolate the resource being assessed. A depth-limit test cannot incidentally exceed the byte limit first and then claim it verified depth handling. A fixture that intentionally reaches more than one limit must specify the order of checks and the expected first or accumulated findings. Tests must also show that a previously observed defect remains visible when another branch reaches a limit.

Use specified in-memory readers for count and graph boundaries when actual filesystem behavior is irrelevant. Use real files only where needed to verify byte reading, file kind, ancestor checks, permissions, and read-only behavior. The approved scratch-workspace capacity must include the complete temporary fixture plan rather than assuming the per-assessment input limit bounds all test setup files.

For time boundaries, propose a specified test clock to exercise exact decision points without relying on sleep timing. Real process deadlines provide a separate execution safeguard. Node.js documents that an in-process test timeout may not cancel a test that blocks its application thread. Therefore, the test runner timeout alone cannot establish enforcement of the process deadline. [Node.js test timeout behavior](https://nodejs.org/docs/latest-v24.x/api/test.html#testname-options-fn).

Propose a maximum of 60,000 milliseconds for one complete runtime verification run and 120,000 milliseconds for the two-run matrix, excluding separately approved runtime acquisition and human review. Test file concurrency remains 1. Exact aggregate input, scratch-disk, process-count, and output-evidence limits must be calculated from the final fixture and command inventory before execution approval. The per-assessment numbers above do not supply those missing aggregate limits.

## Selected paired-unit proposal

The user selected the record-envelope checker. Pair only that small function. Its proposed detailed scope is the nine common envelope fields and the nested Actor shape, plus the requirement that `content` is an object. It checks field inventory and order, supported version, kind, identifiers, revision, context, lifecycle, and author fields. It does not validate kind-specific content, traverse references, calculate digests, assess approvals, interpret prose, or execute commands.

The proposed input is a fresh JSON-derived value supplied through the approved parsing boundary, together with the explicitly specified diagnostic location. The raw parser remains responsible for duplicate keys, unsafe numeric tokens, and decoding errors before information is lost. Pairing the envelope checker consequently supplies no evidence of independent parser correctness. The final callable contract must state the accepted value domain and behavior for non-object JSON roots; JavaScript objects with getters, proxies, functions, or other non-JSON behavior cannot be silently included in that domain.

The function returns the exact approved ordered findings and performs no mutation, filesystem access, environment access, network access, randomness, or time-dependent work. Diagnostic codes, paths, message text, validation order, treatment of missing fields, and whether a parent error suppresses dependent field errors all remain to be specified. Both workers receive the complete approved current-step context, the same small-unit contract, and the same preserved fixtures.

| Paired-unit resource | Proposed limit | Interpretation |
| --- | ---: | --- |
| Saved shared cases | 64 | This is an upper bound; the final exact number and every case remain to be approved. |
| Serialized input for one case | 16,384 bytes | Keeps every case small enough to inspect. |
| Total serialized inputs | 262,144 bytes | Applies to the complete shared case set, not separately to each worker. |
| Calls per implementation per runtime | One call per approved case | If the final fixture count is `N`, each implementation receives exactly `N` calls on each approved runtime. No unrecorded retries or extra random cases are permitted. |
| Total calls for two implementations and two runtimes | `4 × N`, at most 256 | This is the whole proposed independent-comparison call budget. Other helper tests must list any additional calls separately. |
| Batch execution | Sequential within each worker/runtime batch | Results remain aligned to the preserved fixture order. |

Each implementation is prepared in a separate context. Neither worker receives the other's code, results, or implementation-specific advice before its own implementation is fixed and preserved. A distinct reviewer checks each prepared implementation against the same approved contract before execution. Both implementation identities and their review evidence are retained.

For each case, compare implementation A with the expected result, implementation B with the expected result, and A directly with B. The proposed rule is exact logical JSON equality with array order preserved and object-key order ignored, matching the accepted exact-JSON category. No numerical tolerance is proposed for this unit. Input immutability is checked independently. Two implementations that return the same wrong finding list fail their individual correctness checks even if their direct comparison passes.

The same fixed pair would run under both approved runtimes. Its expected logical outputs must remain identical across those runs. The final specification must identify which implementation is integrated into the reusable helper and how both are retained as evidence. Choosing the smaller, faster, or first-written implementation would itself be an unresolved decision unless the specification fixes that selection method.

This pairing decision applies only to the record-envelope checker. A second paired function or a duplicated full validator would require an additional explicit decision and specification.

## Comparing results across runtimes

The compatibility run uses identical source bytes, approved fixture bytes, test inventory, helper arguments, comparison criteria, and resource decisions. Runtime identity is the intended difference. Working-directory and permitted scratch-path differences must be explicitly represented in the run specification; they cannot be removed from evidence through undocumented normalization.

Compare the helpers' deterministic JSON findings and readable report bytes according to their approved output contract. Test-runner timing, runtime versions, process identifiers, and run timestamps are execution evidence and are not expected to match between runs. The specification must identify those evidence fields separately before comparison. Do not delete changing fields after a mismatch to obtain a pass.

Each runtime must independently satisfy all required checks. Agreement between two failing runs is insufficient. A runtime-specific failure remains in the evidence and blocks the compatibility claim until resolved through the approved correction and review process. No automatic retry, test exclusion, tolerance change, or alternate runtime selection is proposed.

## Review and execution evidence

Before execution, preserve the complete specification, exact source, tests, fixture recipes or bytes, package metadata, command inventory, runtime identities, and allowed read/write locations. The independent pre-execution reviewer checks these actual prepared artifacts, including test support and any supervisor. The approved helper remains read-only even though the separately specified harness may create test artifacts or save evidence.

For each run, retain the exact invoked binary, argument array, working directory, selected environment values, start and finish times, source and fixture digests, exit status, standard streams, observed resource use, and any supervisor termination. Evidence-writing locations and existing-file behavior must be specified separately because the helpers themselves do not choose report destinations.

The results reviewer assesses all required tests, any remaining semantic obligations, paired-unit independence, exact output comparisons, compatibility evidence, and accepted-artifact preservation. Step 2 becomes finished only after these checks and reviews pass and the user explicitly accepts the exact results. A prepared test suite, documentation review, or one successful development-runtime run cannot replace the complete accepted verification plan.

## Consolidated decisions required before implementation

The proposed package can be reviewed as grouped settings once the dependent interface choices are settled. It needs an exact long-term support baseline and supported-version declaration; runtime source and checksum if acquisition is needed; the selected envelope checker's detailed interface and integrated implementation selection method; the concrete limits and counting rules; fixture contents and expected outputs; test support and temporary locations; deterministic reports and exit behavior; and the complete command and resource inventory.

Approval of this proposal's policy direction would not make missing fixture bytes, unknown checksums, or unspecified commands complete. Those remaining values must be written into the final step and unit specifications and reviewed before implementation or execution. Accepted Step 1 artifacts remain unchanged throughout.
