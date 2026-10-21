# Record validation

The accepted [record format](record-format.md) defines twelve record kinds. The helpers inspect their representation and linked evidence without modifying files or executing recorded commands. Structural validity is separate from approval, implementation readiness and actual reviewer independence. The [development authorization](../openspec/planning/development-authorization.md) selects implementation details left open in the earlier proposals.

## Supported inputs

`parseJsonBytes(bytes, options)` accepts a `Uint8Array` or `Buffer`. Its options are `path`, `maxBytes`, `maxDepth` and `maxValues`. Defaults are an empty display path, 1,048,576 bytes, 64 container levels and 100,000 values. Containers count as values; object member names do not. Every limit is inclusive. Attempting one additional byte, container level or value reports an incomplete resource-limited assessment. Parsing does not read files.

The result is `{ok, value, orders, findings}`. `orders` is a Map from JSON Pointer to the decoded member names in their exact source order. `value` is unavailable when decoding produced any finding. A file with duplicate keys cannot be interpreted by selecting the first or last duplicate. Findings identify decoded member names, including the required JSON Pointer escaping of slash and tilde characters.

| Input property | Behavior |
| --- | --- |
| Encoding | Strict UTF-8; malformed byte sequences are structural defects. No replacement decoding or normalization occurs. |
| Byte-order mark | A leading UTF-8 byte-order mark is unsupported. Assessment is incomplete, and the bytes are not repaired. |
| JSON syntax | Exactly one value with JSON whitespace. Comments, trailing commas and extra values are rejected. |
| Repeated member | Repeated decoded names within one object are rejected, including names expressed through different escapes. |
| Unicode | Paired surrogate escapes are supported. Unpaired surrogates are unsupported and cannot pass assessment. |
| Numbers | Tokens must normalize to the same exact decimal value as the Number's shortest decimal representation. `0.1`, `1e-1` and `0.100` are supported. `0.10000000000000001` is unsupported because conversion would lose information. |
| Integer precision | Mathematical integers outside JavaScript's safe range are unsupported. They must use an approved string representation when the record format permits it. |
| Extreme values | Overflow and nonzero underflow are unsupported. Negative zero is preserved. |
| Object order | Declared workflow objects retain source order. Literal project data has no additional ordering constraint. |

The numeric policy deliberately supports ordinary binary floating-point representation of accepted fractions. It does not promise exact decimal arithmetic. A decimal string can retain exact text when its meaning is approved. The helper never evaluates such a string as code.

## Reusable functions

`validateRecord(value, {path, orders})` returns deterministic findings for a decoded record. Callers inspecting source files must supply the Map returned by the parser. Omitting it checks an already constructed JavaScript object using its existing enumeration order; it cannot establish the original order of unavailable source bytes. Programmatic inputs must belong to the JSON-derived domain defined in the [envelope contract](envelope-unit.md). Unsupported executable objects are invocation errors.

`getReferences(value)` returns `{ref, pointer, kind}` for each declared reference, in field and array order. `kind` is an expected record kind, a list of permitted kinds, or null for a supporting artifact. Snapshot references retain `size_bytes`. Literal decision values, observed values, expected values and arbitrary command arguments never create reference edges. Merely resembling a reference grants no read authority.

`checkRecordEnvelope(value, sourceOrder)` checks the common envelope only. It requires explicit source-order metadata and has no optional arguments. The [64 saved cases](../tests/fixtures/envelope/cases.json) and [unit contract](envelope-unit.md) fix its complete output and invocation-error behavior. Primary implementation A was designated before either paired implementation began. Paired evidence applies to this small function, not the entire validator.

`finding(category, code, path, pointer, related_path)` constructs an item from the fixed message registry. `sortFindings(findings)` removes identical diagnostic tuples and orders categories as invocation, internal, structural, readiness and incomplete, then compares path, pointer, code and related path by UTF-8 bytes. Null sorts before a string. Messages contain no runtime-specific error text.

## Mechanical coverage

All twelve kinds receive closed-field, field-order, primitive-type, required-field, enumeration, identifier, reference, path, digest and applicable collection checks. Draft null values remain unresolved rather than structurally invalid where the format permits them. The envelope and content object's field inventory remain mandatory. Invalid parent values suppress inaccessible child checks; independent fields continue to be inspected.

| Record group | Additional local checks |
| --- | --- |
| Project | Step-state ordering, first unfinished step, later-state restrictions, acceptance placement, suspension dependencies and current-step identity. |
| Decision and evidence | Selection variants, unique option identities, timestamp representation and explicit evidence references. |
| Step and unit | Unique requirement, check and output identities; output path uniqueness; requirement-to-check associations; explicit pairing mode; declared method, interface, resource and fixture fields. |
| Snapshot and approval | Unique snapshot paths, UTF-8 path ordering, self-entry exclusion, exact reference shapes and explicit approval scope fields. |
| Review and run | Recorded actor associations, actor ordering and repeated authors, directly conflicting reviewer identities, pass/findings consistency, optional coverage and continuation shapes, timestamp order and resource-use integer bounds. |
| Comparison | One or two runs according to mode, ordered correctness associations, distinct paired worker contexts, pairwise observation shape and explicit pairwise rule fields. |
| Acceptance and amendment | Exact revision and reference fields, explicit user-response fields, nonempty amendment rationale and edit inventory, and declared change operations. |

Cross-file digests, reference kinds, project identities, graph cycles, actual snapshot membership, approval coverage, unit ownership, comparison rule associations and lifecycle evidence require graph inspection. They are not inferred from a standalone record. Undisclosed history cannot establish that a selected revision is the newest revision.

## Limits of automated conclusions

Covered reviews additionally receive [continuation checks](review-continuation.md) at readiness assessment: complete scope and required checks, exact reuse of passing coverage, valid same-phase baselines, and explicit fresh resolutions for baseline findings. Legacy reviews retain their existing behavior. These checks do not infer semantic dependencies or prove that a cited correction solves its finding.

A nonempty method can still omit a necessary choice. An actor label does not prove a separate context. A response field does not authenticate user approval. A matching run record does not establish that execution occurred. The separate reviewer must assess complete decision coverage, agreement between readable and structured specifications, actual approval provenance, handoff independence and evidence authenticity.

Validation reports retain those obligations even when all mechanical checks pass. A passing structural report cannot authorize implementation or execution.
