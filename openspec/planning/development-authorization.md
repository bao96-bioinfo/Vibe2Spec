# Autonomous development authorization

On 2026-10-17 the user instructed: “Please use all recommended choice in the future choices. This is for the package development, we do not necessary to use the package for its development. I need a handoff run until finished.”

This instruction supersedes development-only interview, serial-step and acceptance pauses in the roadmap. Recommended remaining decisions may be selected, implemented, tested and independently reviewed without further development approval. It does not represent acceptance of results that have not yet been produced. Historical responses remain unchanged. Product users still receive the complete interview, explicit decision approval, independent review and result acceptance workflow.

Accepted Step 1 record files remain the format authority. Node.js built-in modules and JSON remain the runtime foundation. External reads use individually authorized exact files. A leading UTF-8 byte-order mark is rejected. Negative zero is preserved by input parsing and distinguished by exact JSON comparison. Unpaired Unicode surrogates are rejected as unsupported text. Reference traversal uses declared reference fields, never objects that merely resemble references inside literal user data.

Development can proceed in parallel across validation, workflow instructions and packaging. Reports distinguish mechanical checks from semantic review and authentic user consent. Marketplace catalog preparation and local installation checks are authorized; an official external directory submission remains a separate action.

## Shared implementation interfaces

Modules are ECMAScript modules under `scripts/`; tests use `node:test`. All helpers are read-only. The coordinator creates records under an explicitly selected workspace and record store.

`parseJsonBytes(bytes, options)` in `json.mjs` returns `{ok, value, orders, findings}`. Options include `path`, `maxBytes`, `maxDepth`, and `maxValues`. `orders` is a Map from JSON Pointer to decoded source member names. Findings contain `category`, `code`, `path`, `pointer`, `related_path`, and `message`.

`validateRecord(value, {path, orders})` in `records.mjs` returns findings. `getReferences(value)` returns `{ref, pointer, kind}` descriptors for declared references; `kind` is null, a string or an array of allowed record kinds. Snapshot entries additionally carry `size_bytes` in the reference object.

`checkRecordEnvelope(value, sourceOrder)` in `envelope.mjs` follows the saved envelope-unit contract. `findings.mjs` exports `finding(category, code, path = null, pointer = null, related_path = null)` and `sortFindings(findings)`.

`loadGraph({workspace, entry, externalFiles = [], limits = {}})` in `graph.mjs` returns `{records, artifacts, findings, entry, entry_sha256, complete}`. Records and artifacts are Maps keyed by supplied workspace-relative or approved absolute path. Artifact values contain `{bytes, sha256}`. `assessReadiness(graph)` and `assessLifecycle(graph)` return findings. Graph inspection does not modify or execute supplied records.

The default inspection profile is 1,048,576 bytes per JSON file; 4,194,304 per supporting file; 16,777,216 total bytes; 512 files; 4,096 references; depth 64; 100,000 JSON values; 512 findings; one concurrent read; and 5,000 milliseconds. Exact supported option names and report contracts are documented alongside the completed interface. If the findings limit is reached, reserve the final slot for a resource-limit finding and mark assessment incomplete.
