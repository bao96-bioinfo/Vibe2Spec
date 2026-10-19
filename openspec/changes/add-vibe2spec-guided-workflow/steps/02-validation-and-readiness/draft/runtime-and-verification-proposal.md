# Step 2 runtime and verification proposal

## Status and established decisions

This document records approved runtime and resource choices alongside proposed verification methods. The user's latest response is preserved in [the runtime and resource approval record](../decisions/runtime-profile-responses-v1.md). The complete Step 2 specification still requires approval and independent review. Implementation, runtime acquisition, test execution, and fixture creation have not been authorized by these individual choices.

The user has approved Node.js built-in modules only, JSON and readable report modes, reusable functions and a command-line interface, read-only helpers, an explicit entry record and approved access locations, collection of independent findings with incomplete assessments distinguished, and paired implementation of the small record-envelope checker. The exact verification environments are now Node.js 26.11.1 and Node.js 24.22.0 on the current Darwin arm64 host. Long-term support means that a release line receives maintenance for an extended period. The ten assessment limits below are also approved. The paired-unit interface, test fixtures, detailed counting algorithms, additional verification-process limits, runtime acquisition, and exact execution commands remain proposed or unresolved.

The accepted format in `docs/record-format.md` remains the input contract. The twenty-four accepted fixture cases remain unchanged. Their division between mechanical checks, semantic review, and later lifecycle or comparison work is described in the adjacent `coverage.md` proposal. This document proposes how to verify the Step 2 implementation once its full specification is approved.

## Approved runtime compatibility scope

Use the existing Node.js 26.11.1 development environment and verify the same prepared work under Node.js 24.22.0 on the same operating system and architecture. The user approved this exact two-runtime scope. The official release page identifies the 24 line as long-term support. [Node.js releases](https://nodejs.org/en/about/previous-releases). The selected versions have not yet been used to execute the Step 2 checks. This approval establishes a verification requirement; it does not establish a passing compatibility result.

| Item | Decision or remaining proposal | Consequence |
| --- | --- | --- |
| Development runtime | Approved: use exact Node.js 26.11.1 on the current Darwin arm64 host. Proposed evidence method: record its resolved path and identity before execution. | Development uses the existing environment after complete specification approval and the required reviews. |
| Compatibility runtime | Approved: test identical prepared source and tests under exact Node.js 24.22.0 on the same host. Acquisition details remain pending. | Both runtimes must independently satisfy the specified behavior and output checks. |
| Implementation baseline | Proposed: use stable built-in interfaces documented for the selected Node.js 24 version and explicit ECMAScript modules in `.mjs` files. | The exact interface inventory must support both approved runtimes. |
| Compatibility claim | Approved verification scope: report the two exact tested versions once results exist. Any wider supported range requires a separately specified minimum version and relevant checks. | Testing one patch does not prove compatibility with every earlier or future patch. |
| Public package metadata | Pending: the exact `engines.node` declaration and any wider release support range. | The declaration must accurately distinguish the verification evidence from a broader support target. |
| Host compatibility | Preserve runtime verification evidence for the later Claude Code and Codex packages. | Local Node.js checks do not replace marketplace installation, delegation, update, removal, or cross-host checks assigned to Steps 8 and 9. |

The approved verification matrix has two rows: Node.js 26.11.1 on the observed Darwin arm64 host and Node.js 24.22.0 on that same host. A separate operating system or architecture would add a separately specified matrix row. Lexical tests for supported path forms can run on this host, but a Windows-style path string test is not evidence of an actual Windows filesystem run.

The Node.js 24 documentation identifies the built-in test runner, filesystem module, and cryptographic module as stable. The proposal uses ordinary assertions, bounded file reads and metadata inspection, and SHA-256 hashing from those built-ins. Exact functions and flags must be inventoried during specification so that stability of a module is not confused with stability of every interface it contains. [Test runner](https://nodejs.org/docs/latest-v24.x/api/test.html), [Filesystem](https://nodejs.org/docs/latest-v24.x/api/fs.html), [Cryptography](https://nodejs.org/docs/latest-v24.x/api/crypto.html).

## Acquiring the compatibility runtime

Prefer an existing user-selected compatible binary if its version and identity can be verified. If no such binary is available, propose an isolated official Node.js archive. Its download, extraction location, archive digest, binary path, permitted disk use, and network operation must appear in the approved specification before acquisition.

Read-only source research located the official archive URL and published checksum for the selected Darwin arm64 runtime. The [source observation](runtime-source-observation.md) preserves those findings and their limits. Earlier unsuccessful source requests remain historical observations; they no longer make the published archive location or checksum unknown.

| Source field | Observed value |
| --- | --- |
| Archive | `node-v24.22.0-darwin-arm64.tar.gz` |
| Official source | `https://nodejs.org/dist/v24.22.0/node-v24.22.0-darwin-arm64.tar.gz` |
| Published SHA-256 | `6a9724d9b50a5f22b4816cded441b5a8d9ddae546191a5e5b7efa5a5e2ee26d5` |

The published checksum identifies the expected archive bytes. No archive has been downloaded, hashed locally, installed, extracted, or executed for this proposal. The acquisition source and checksum must still be included in the complete approved setup contract. The download and extraction locations, permitted byte counts, archive inspection and extraction methods, selected binary identity, and exact commands remain pending.

Runtime acquisition would be a separately recorded setup operation. Package tests themselves would have no network access, package installation, automatic runtime download, or host installation side effects. No `npm install` prerequisite is proposed because no additional Node.js packages are selected. The approved setup still needs to identify any non-Node archive tool it uses.

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

## Approved assessment resource profile

The user approved these ten limits for one Step 2 development validation assessment. They do not amend the version 1 record format or establish defaults for future projects. Future projects explicitly select their own limits. The public callable and command-line interfaces must receive the selected limits through the approved interface; they cannot silently increase them.

One mebibyte is 1,048,576 bytes. The byte columns below use exact decimal byte counts so that no unit conversion is implicit.

| Resource | Approved maximum | Scope stated in the interview |
| --- | ---: | --- |
| One JSON input | 1,048,576 bytes | Maximum size of one JSON input to the assessment. |
| One supporting file | 4,194,304 bytes | Maximum size of one supporting file, such as a specification document. |
| Total input read | 16,777,216 bytes | Maximum total input read during one assessment. |
| Distinct files inspected | 512 | The assessment may inspect 512 distinct files. A required 513th file makes it incomplete. |
| Reference occurrences followed | 4,096 | Maximum number of reference occurrences followed during one assessment. |
| Nested JSON objects or arrays | 64 levels | Maximum nesting of JSON containers. |
| JSON values inspected | 100,000 | Maximum number of inspected JSON values. |
| Findings retained | 512 | Maximum number of retained findings. |
| Files read concurrently | 1 | At most one file read at a time. |
| Assessment duration | 5 seconds | Reaching 5,000 milliseconds makes the assessment incomplete. |

The count, byte, and depth maxima are inclusive. Reaching an approved maximum is permitted when the remaining checks can finish within all limits. Attempting to consume one additional unit makes the assessment incomplete. Reaching the duration limit also makes the assessment incomplete. Established findings remain available, and an incomplete assessment cannot return a complete pass. These boundary outcomes were part of the approved profile.

## Proposed counting and deadline methods

The approved numbers do not settle the algorithms for measuring every resource. The following methods remain proposals for the complete specification. They require explicit review because two implementations could otherwise reach different limits on the same input.

| Resource | Proposed method still requiring approval |
| --- | --- |
| JSON input and supporting-file bytes | Count raw bytes before decoding. Apply the JSON limit whenever an input is parsed as JSON, including fixture containers. Define whether a JSON supporting file read only for its digest is subject to the JSON limit, the supporting-file limit, or both. |
| Total bytes | Count bytes actually read, including repeated reads. Specify the exact read size, cache policy, and the order of budget checks. |
| Distinct files | Count distinct approved resolved paths, including the entry artifact. Define aliases, repeated references, failed reads, and any virtual fixture identity explicitly. |
| Reference occurrences | Count each followed reference occurrence and snapshot-entry edge, including repeated references to a cached target. Specify the treatment of malformed references and blocked branches. |
| Container depth | Give the root object or array depth 1. Each nested object or array adds 1; scalar values add no container level. |
| JSON values | Count each object, array, and scalar across the assessment. Property names do not count as values. Specify how repeated parsing and already cached values affect this count. |
| Retained findings | Retain the first 512 findings in the specified deterministic traversal order. Represent the limit indication outside that retained list so the cap remains 512. Specify sorting, suppression, and whether an already established defect remains the primary outcome. |
| Duration | Measure elapsed monotonic time at explicitly listed parser, traversal, and read boundaries. Specify the start point and end point. A cooperative check cannot interrupt synchronous code that blocks those boundaries. |

The accepted embedded fixture container is test input. Its parsing and virtual-file accounting need a specified adapter; it must not be treated as a thirteenth record kind. Detailed counting choices must remain consistent with the approved incomplete outcome when a limit is exceeded.

## Additional verification-process limits proposed for approval

The ten approved assessment limits govern a helper assessment. They do not approve limits for the surrounding verification process, which may launch child processes, collect evidence, and create temporary test files. The following additions remain pending.

| Additional resource | Proposed limit | Proposed consequence |
| --- | ---: | --- |
| One child-process invocation | 10,000 milliseconds | An independent supervisor terminates an invocation that exceeds its deadline and preserves failed or incomplete verification evidence. The termination method and affected-process scope remain to be specified. |
| Captured standard output plus standard error per child invocation | 4,194,304 bytes | Count bytes received by the supervisor. Exceeding the limit stops the invocation and records incomplete evidence. The exact bounded-capture method remains to be specified. |
| One complete runtime verification run | 60,000 milliseconds | Report an unfinished verification run when its aggregate deadline is reached. |
| Both runtime verification runs | 120,000 milliseconds | Bound the complete matrix, excluding separately approved acquisition and human review. |

These limits must not appear as approved constants in code or execution commands until the user approves them. Aggregate input, scratch-disk capacity, process count, and evidence size still require calculation from the final fixture and command inventory.

## Testing resource boundaries

Each count, byte, and depth limit needs cases immediately below the bound, exactly at the bound, and immediately above it. For the approved maximum of 512 distinct files, for example, proposed cases inspect 511, 512, and 513 files. They must be generated from an approved deterministic recipe or preserved as approved files. Approval of the limit does not approve the fixture recipe or authorize fixture creation and execution.

Boundary tests should isolate the resource being assessed. A depth-limit test cannot incidentally exceed the byte limit first and then claim it verified depth handling. A fixture that intentionally reaches more than one limit must specify the order of checks and the expected first or accumulated findings. Tests must also show that a previously observed defect remains visible when another branch reaches a limit.

Use specified in-memory readers for count and graph boundaries when actual filesystem behavior is irrelevant. Use real files only where needed to verify byte reading, file kind, ancestor checks, permissions, and read-only behavior. The approved scratch-workspace capacity must include the complete temporary fixture plan. The per-assessment input limit does not bound all test setup files.

For time boundaries, propose a specified test clock to exercise exact decision points without relying on sleep timing. Real process deadlines provide a separate execution safeguard. Node.js documents that an in-process test timeout may not cancel a test that blocks its application thread. Therefore, the test runner timeout alone cannot establish enforcement of the process deadline. [Node.js test timeout behavior](https://nodejs.org/docs/latest-v24.x/api/test.html#testname-options-fn).

Test-file concurrency of 1 remains a separate proposed harness setting. The approved single concurrent file read applies within an assessment; it does not approve the number of test processes. Exact aggregate input, scratch-disk, process-count, and output-evidence limits must be calculated from the final fixture and command inventory before execution approval.

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

The exact runtime versions and ten assessment maxima are approved. The remaining specification must settle the supported-version declaration; runtime acquisition method and locations; the selected envelope checker's detailed interface and integrated implementation selection method; detailed resource counting and extra harness limits; fixture contents and expected outputs; test support and temporary locations; deterministic reports and exit behavior; and the complete command inventory. The official archive URL and checksum are now observed values that can be included in the proposed setup contract.

The runtime and profile approval does not approve the entire draft or its additional proposals. Remaining values must be written into the final step and unit specifications and approved and reviewed before implementation or execution. Accepted Step 1 artifacts remain unchanged throughout.
