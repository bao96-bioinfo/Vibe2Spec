# Paired envelope pre-execution review

Reviewed at 2026-10-19 02:38:09 UTC by the separate orchestration context `/root/paired_and_package_review`. The reviewer inspected both implementations only after each independent implementation had been written. This context did not author either implementation. The development authorization permits these verification runs; this document does not invent a product user-acceptance event.

| Artifact | Reviewed SHA-256 |
| --- | --- |
| `docs/envelope-unit.md` | `f4b5d694c832a33890edfc56725d20f38dbf3781acaad1c27285b2b015664684` |
| `tests/fixtures/envelope/cases.json` | `b4c795e0025f9722a58eae324c43378c2fe5d3ccbe9dbbccea2d1622adbd77b9` |
| Implementation A, `scripts/envelope.mjs` | `209fc7a363ae0a6581f1b1899e95679daf580bd76c861eba4c595807c623e8d8` |
| Implementation B, `tests/paired/envelope-b.mjs` | `b0f83120c089523f8b30c4d49e3dcfadc19e357e8ee9bb39f79c5748e0a6eb84` |
| Shared harness, `tests/envelope-fixture.mjs` | `d74e8239c5eebf767306fbbd72ad46624b14bdc66c29eaa15ebae9fd53673a44` |

The initial review required a correction to A. Its identifier expression allowed a terminal line terminator because JavaScript interprets the dollar anchor as also matching immediately before a final line terminator. A now requires the entire identifier to match. B already rejected this input. The fixed 64-case oracle was preserved. Additional primary regression checks cover line feed, carriage return, and the two Unicode line separators. The correction follows the existing contract; no expected output was changed to accommodate observed behavior.

The implementations are distinct. A uses its shared finding registry and recursive input inspection. B contains its own literal message registry, iterative input inspection, and independent diagnostic collection and sorting. B's [provenance statement](https://github.com/bao96-bioinfo/Vibe2Spec/blob/main/tests/paired/worker-b-provenance.md) records its isolated handoff and specific repository reads. Both workers share the behavioral contract and saved examples. Shared workspace access and self-reported access boundaries are limitations of this development evidence; separate hardware or separate humans are not claimed.

The saved fixture contains 64 bounded cases. Every case starts from its own base copy. A and B must receive separate copies of identical materialized inputs. Each observation must match the fixed expected findings or the specified actual TypeError. Direct comparison is additional to both correctness checks. Input preservation uses strict deep equality, which detects a change from negative zero to positive zero. This review did not execute the two implementations as a pair or change the saved fixture.

The reviewer corrected two shared-harness weaknesses before execution: source-order changes must be complete permutations, and an exception named `TypeError` must actually be a TypeError instance. These harness changes require an additional separate inspection because this reviewer authored them. Six focused regression tests passed, including counterfeit exceptions and signed-zero mutation. `/root/independent_gate_audit` was asked to provide that independent harness inspection before the authoritative paired run.

The separate `/root/independent_gate_audit` context inspected the corrected harness and confirmed complete-permutation validation, actual TypeError identity, and signed-zero preservation checks. The reviewer also inspected `examples/paired-units/verify.mjs` and `tests/paired-envelope.test.mjs` before the authoritative paired run. The runner checks approved parsing, 64 cases, the 256 KiB fixture bound, the 16 KiB materialized-input bound, each implementation against its oracle, direct observation equality, input preservation, 128 calls per runtime, and a five-second duration bound. Optional evidence writing belongs to the development test, not the installed read-only helper.

The revised implementations and independently inspected shared harness pass pre-execution review. The paired run may proceed on both selected runtime versions. This is bounded evidence for the envelope function, not an assertion that two complete validators or host model workflows produce equivalent results.
