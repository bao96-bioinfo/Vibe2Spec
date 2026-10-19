# Step 2 input and traversal contract proposal

## Status

This is a planning proposal. Every exact method and new setting below awaits approval in the complete Step 2 specification. It authorizes no implementation or test execution. The accepted [version 1 record format](../../../../../../docs/record-format.md) remains unchanged. The [coverage proposal](coverage.md) identifies structural checks and obligations that require separate review.

The user has selected built-in Node.js modules, reusable functions plus a command-line interface, JSON and readable reports, read-only inspection, and an explicit entry record with approved read locations. Independent findings are collected while incomplete assessments remain distinct. The approved runtime matrix is Node.js 26.11.1 and 24.22.0 on the current Darwin arm64 host. The [ten assessment limits](../decisions/runtime-profile-responses-v1.md) are also selected. Exact acquisition, accounting rules, and verification procedures remain pending. Paired implementation of a small record-envelope checker is approved; its exact interface and fixtures remain pending.

## Bytes, JSON syntax, and object entries

Proposed method: read each authorized ordinary file as bytes. Compute its digest and byte count from those unchanged bytes. Decode record files with strict UTF-8 validation. Invalid byte sequences produce a decoding finding; replacement characters must not repair malformed input. Bytes belonging to an ordinary supporting artifact need no JSON interpretation.

The proposed JSON reader accepts exactly one JSON value and only JSON whitespace before or after it. Comments, trailing commas, extra values, malformed escapes, and unescaped control characters are syntax failures. A leading byte-order mark would be rejected under this proposal. Its treatment requires approval because some readers discard it automatically. Neither whitespace nor line endings are rewritten. The two-space serialization of the accepted fixture container does not impose that formatting on every otherwise valid record.

The reader retains each object's ordered entries, decoded key, source position, and each number's original token before producing values for validation. A duplicate key is detected within its own object after decoding escapes. For example, `{"id":1,"\u0069d":2}` repeats the same key; two separate objects can each contain `id`. No Unicode normalization is applied to keys. Visually similar but differently encoded names remain different names and may independently fail a declared field inventory.

Duplicate keys block interpretation of that object. Other independent records can still be assessed under the approved policy of collecting independent findings. The helper never chooses the first or last duplicate as the intended value. Structured finding locations must distinguish a file path, a field path, and an occurrence in the source; their exact representation remains a report-interface decision.

Declared field order is checked against the retained source entries. JavaScript enumeration is insufficient: it can enumerate a key such as `"2"` before `"10"` regardless of their source order. Closed workflow objects follow their declared order. Objects inside literal project values remain data, with no invented alphabetic ordering. An exact-JSON comparison's ignored object-key order does not remove a workflow object's separate field-order requirement.

Escaped paired surrogates decode to the corresponding character. Escaped unpaired surrogates need an explicit interpretation: JSON syntax can represent them, but the accepted phrase “Unicode strings” does not specify whether these isolated code units count as permitted strings. Rejecting all such values would narrow one possible interpretation. The proposal must expose this issue before approval; it must not add the restriction silently. Paths need a lossless UTF-8 representation in all cases.

## Numeric values without silent rounding

The user has approved standard JavaScript numbers with strict precision-loss checks, including accepting `0.1` and `1e-1`, rejecting the precision loss in `0.10000000000000001`, and rejecting oversized integers, overflow, and underflow. The actual response is retained in [the policy evidence](../decisions/policy-responses-v1.md). Exact normalization, negative-zero behavior, and fixtures remain proposals.

Workflow integers can be assessed precisely from the number token. The proposed reader interprets its decimal significand and exponent using bounded integer arithmetic before any conversion to a JavaScript Number. It rejects a fractional value where an integer is required, an integer outside the accepted range, and a negative value in a nonnegative field. For example, `9007199254740993` must not become `9007199254740992`. A string containing the former number remains a string and needs its approved meaning; the helper does not convert it automatically.

Equivalent number spellings need an explicit rule. The proposal treats `1`, `1.0`, and `1e0` as the same mathematical integer for a field that requires an integer. Source bytes remain different for fingerprints. The sign of `-0` is retained until the approved numeric policy resolves its interpretation.

The accepted format permits finite general numbers but does not define their complete representation domain. Ordinary binary floating-point conversion approximates many decimal fractions. Specifying that domain is necessary before the public function can promise lossless inputs and reproducible findings.

Proposed detailed method for the selected policy: retain tokens through numeric validation. Normalize the token's exact decimal value and the shortest decimal spelling of its converted Number, then require equality. Thus `0.1` and `1e-1` describe the same supported Number, while `0.10000000000000001` is unsupported because conversion returns `0.1`. This explicitly adopts binary floating-point approximation for supported fractions; it does not promise exact decimal arithmetic. Unsafe mathematical integers are rejected regardless of exponent spelling. Rejection of overflow and underflow is approved; their detection and negative-zero handling still need exact rules.

The representation policy is approved; the exact token method still requires the complete specification. If the Step 2 support boundary is narrower than version 1, report an unsupported assessment rather than falsely declaring a valid version 1 record invalid. If the format itself must change, follow the accepted-step reopening process.

## Explicit authority for filesystem inspection

The proposed invocation identifies one workspace root, one entry-record path, and explicitly approved external read locations. Read authority is supplied through the caller's approved procedure. A record cannot grant that authority to itself. The complete specification must define whether each external authorization names one file or a directory subtree; it must not infer either interpretation from a string.

Path spelling is checked before filesystem access. Relative references resolve only from the selected workspace root. Absolute workspace aliases, unsupported path forms, dot segments, backslashes, and prohibited trailing separators fail their accepted rules. A syntactically valid path outside the authorized locations is reported inaccessible under the supplied authority, without opening the target. A path valid for another operating system is not translated to a guessed local location.

Each accessed artifact and every ancestor are inspected for symbolic links, including ancestors of the selected workspace and external locations. The helper does not use canonicalization to bypass a symbolic ancestor. A directory, socket, device, or pipe cannot serve as the ordinary file required by a Ref. A record containing command strings is always data; reading it never launches those commands.

The proposal permits inspecting directory entries only to establish the exact spelling of an already selected path component. This is distinct from discovering candidate project records and needs explicit metadata-read authority and bounds. No record-directory inventory, recursive discovery, filename-based latest selection, or fallback target is allowed.

Case collisions are checked among all selected path claims, including missing targets. The accepted portability rule covers paths differing only in case. Its treatment of non-ASCII case pairs needs a fixed definition; ASCII-only comparison and the runtime's changing Unicode tables are not interchangeable implementations. A pinned Unicode case-fold definition is one possible solution without third-party packages. Its data version, treatment of expansions, and test examples remain open. No normalization or casing change is applied to the actual read path.

## Traversal and failure behavior

Proposed traversal follows explicit references in retained field order and array order, using depth-first traversal. Snapshot entries already have their accepted UTF-8 byte ordering. Only declared Ref positions and snapshot entries generate edges. A literal decision object that happens to contain `path` and `sha256` does not create read authority or a graph edge.

For each edge, assess path authority and target type, obtain bytes, and check the claimed digest before relying on target contents. A mismatched digest terminates that edge. Do not parse the changed target as if it were the approved evidence. Byte-size claims on snapshots are checked against the same bytes. Target kind and project relationships are checked only after successful parsing and identity validation.

Repeated references to the same path and digest reuse one verified byte image per assessment. Conflicting digests for one path remain separate failed claims, not interchangeable versions. Duplicate record identities are checked across the selected graph. An active traversal stack detects reference cycles; already completed nodes prevent repeated traversal without hiding distinct incoming claims. Domain dependency cycles receive a separate check after the required step identities are available.

Under the approved independent-findings policy, a failed branch stops while unrelated branches continue in the proposed order. Dependent findings are suppressed when their premise is unavailable. An unreadable target does not imply its kind, contents, or approval status. A report preserves established defects while also identifying incomplete checks. Exceeding an approved count, byte, or depth limit, or reaching the time deadline, prevents a complete pass. The numeric assessment profile is approved; detailed counting, diagnostic boundaries, and checkpoints remain pending.

The proposed filesystem strategy inspects path metadata, opens without following a final symbolic link where the host supports it, checks the opened file type, reads bounded bytes, and checks metadata again. A detected change makes that evidence unstable and prevents a passing assessment. There is no automatic retry. This is detection within an instruction-based workflow, not a guarantee against every concurrent ancestor replacement. Exact cross-platform mechanisms and observed-change criteria require specification before implementation.

## Scope and unresolved decisions

Step 2 checks structure, supplied evidence identity, and prerequisites for implementation readiness. It neither edits records nor advances states. A selected historical graph is assessed as historical evidence; absent knowledge of other revisions cannot establish that it is the newest project state. Approval provenance, substantive completeness, reviewer independence in practice, and unrecorded assumptions still require separate review.

The remaining choices are the detailed numerical token method and negative zero, escaped-surrogate handling, byte-order-mark handling, exact finding locations, external file versus subtree authorization, directory-metadata inspection, non-ASCII case rules, concurrency checks, resource bounds, and the public token-preserving input interface. Each recommendation must become an explicit approved requirement or remain a blocker. None requires silently changing the accepted Step 1 artifacts.
