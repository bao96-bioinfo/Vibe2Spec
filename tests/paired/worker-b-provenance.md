# Independent envelope worker B provenance

Implementation: `tests/paired/envelope-b.mjs`.

The worker received an independent implementation handoff through the canonical orchestration task `/root/independent_envelope_b`. That task route is the only worker/context identifier exposed to this worker. No execution-session identifier or separate human identity was exposed; none is claimed or invented here.

The implementation was frozen at `2026-10-19 02:34:42 UTC`, before this worker received another implementation's code, observations, comparison results, or review results. Its SHA-256 is `b0f83120c089523f8b30c4d49e3dcfadc19e357e8ee9bb39f79c5748e0a6eb84`. Frozen means the worker will not revise it without recording a subsequent correction; it does not mean filesystem permissions were changed.

Repository inputs read before freezing:

- `docs/envelope-unit.md`: sole behavioral contract; SHA-256 `f4b5d694c832a33890edfc56725d20f38dbf3781acaad1c27285b2b015664684`.
- `tests/fixtures/envelope/cases.json`: fixed saved oracle; SHA-256 `b4c795e0025f9722a58eae324c43378c2fe5d3ccbe9dbbccea2d1622adbd77b9`.
- `tests/envelope-fixture.mjs`: permitted harness inspection; SHA-256 `5764d2baf1ea6a325bdf21d062ca145660e8ce516afa5c3df14ce22cb9e4527d`. The worker did not execute this module or read its imported registry file.
- The newly written implementation B was loaded for its own tests and read for hashing.

No other repository file was inspected. In particular, implementation A (`scripts/envelope.mjs`), its results, and other primary implementation code were not inspected. No implementation source was borrowed from A or an outside source. The saved contract and oracle were not changed.

An ephemeral independent Node runner materialized the saved operations and checked all 64 cases against the saved expected codes and pointers and the contract's exact message registry. It checked finding key order, complete ordered observations, exact TypeError identity/message, and argument preservation using strict deep equality. All 64 passed. Focused checks also passed for non-JSON invocation values, cycles, unevaluated accessors, malformed order metadata, argument counts, signed-zero preservation, null-prototype records and authors, trailing-line-terminator rejection in identifiers, pointer escaping, and UTF-8 ordering across BMP and supplementary characters.

The runner's first attempt stopped before invoking B because its local Markdown-table extraction selected too many rows. Restricting extraction to the message-registry section corrected the runner; no expected result or implementation change was made in response to that runner failure.

These local checks decoded the trusted fixture container with `JSON.parse`; they make no claim to validate the approved ingestion parser. Independent workers share a workspace and common contract/oracle. This attestation establishes the worker's stated access boundary, not separate hardware, a separate human, or independence of the shared specification. Authoritative paired comparison and separate review remain the parent task's responsibility.
