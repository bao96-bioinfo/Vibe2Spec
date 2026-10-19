# Two implementations of one small function

This example compares two independent implementations of the record-envelope checker. The envelope is the shared set of identification fields surrounding each Vibe2Spec record. The [complete contract](../../docs/envelope-unit.md) fixes its inputs, outputs, errors, field order and all predicates. The [saved fixture](../../tests/fixtures/envelope/cases.json) fixes 64 small cases before the paired run.

Worker A was designated as the integrated implementation before coding. Worker B received the contract and fixtures in a fresh agent context without A's source or results. A separate reviewer inspected both after B's code was fixed. The review found and corrected a terminal-newline identifier defect in A. The original oracle was preserved. [The pre-execution review](../../docs/release/paired-pre-execution-review.md) records the assessed hashes and the separate inspection of the shared harness.

```text
                    Same contract and 64 saved cases
                              /             \
                             v               v
                    Worker A              Worker B
                    integrated checker    separate checker
                             |               |
                             v               v
                    Compare with oracle   Compare with oracle
                              \             /
                               v           v
                       Compare complete observations
                       Check input preservation
```

The [verification function](verify.mjs) parses the fixture under the approved numeric policy, enforces fixture and case byte limits, and calls each implementation once per case. The result contains 128 calls per runtime. Each observation must equal the expected finding array or actual TypeError, and must equal the other implementation's observation. Input preservation is checked separately. No numerical tolerance applies to these discrete outputs.

The authoritative release experiment uses Node.js 24.22.0 and 26.11.1, for 256 total calls. Per-runtime evidence is stored under [release evidence](../../docs/release/). Subsequent development test runs are new verification runs, not additional coverage claims for the saved release experiment. The five-second run budget and byte bounds keep this comparison small. It performs no downloads or model training.

The code is at [implementation A](../../scripts/envelope.mjs) and [implementation B](../../tests/paired/envelope-b.mjs). The [worker B provenance](../../tests/paired/worker-b-provenance.md) identifies its available context identifier and permitted reads. No unavailable session identifier is invented. This evidence supports the specified envelope function on the saved cases. It does not establish equivalence of whole validators or arbitrary research systems.
