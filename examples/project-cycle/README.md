# A complete fictional project history

This example follows two steps through acceptance, discovery of a necessary interface correction, reopening, and renewed acceptance. The saved workspace contains actual JSON records and files with coherent SHA-256 references. All records use `context: "example"`. User replies, actors, commands, execution results, and review outcomes are explicitly fictional. No recorded command was executed. The example is instructional evidence, not authorization for a real project.

The first step initially copies `[1, 2, 3]` unchanged. The second step calculates its sum. Its detailed interview reveals a fixed external consumer that validates the preparation output before the summary operation. That interface requires `{"values": [1, 2, 3]}`. The fictional user confirms that the consumer cannot be changed and excludes an intermediate conversion. Those disclosed constraints make a revision of the preparation output necessary. A preference for a different representation alone would not justify reopening accepted work.

```text
Agree on the overview
         |
         v
Copy step, revision 1
Interview -> approved specification -> separate specification review
Prepare -> separate pre-execution review -> run -> checks
Separate results review -> explicit acceptance
         |
         v
Summary step, revision 1: interview
Fixed consumer requires a named values field
         |
         v
Approve exact amendment; suspend the summary step
         |
         v
Copy step, revision 2
Repeat specification, preparation, execution, and review cycle
Accept the revised result; preserve every revision 1 artifact
         |
         v
Summary step, revision 2
Complete its own specification, preparation, execution, and review cycle
Explicit acceptance -> both required steps finished
```

The five entry records select exact historical states. Later records can exist in the same directory without supplying approval to an earlier entry. Helpers follow explicit references and do not select whichever revision has the largest number.

| Entry under `workspace/` | Preserved state | Meaning |
| --- | --- | --- |
| `records/project/project-state/r1.json` | Copy step awaits acceptance; summary step remains provisional | Passing checks and results review have not replaced the user's acceptance. |
| `records/project/project-state/r2.json` | Copy step is finished; summary step is interviewing | The saved summary draft contains unresolved fields and an honest `changes_required` review. It cannot authorize implementation. |
| `records/project/project-state/r3.json` | Copy step revision 2 is reopened; summary step is suspended | The amendment names the blocking interface requirement and every new replacement artifact. Its exact-scope approval starts a new specification cycle. |
| `records/project/project-state/r4.json` | Copy step revision 2 is finished; summary interview resumes | New specification approval, all three review phases, run evidence, comparison, and a distinct acceptance bind the revised result. Old approval and acceptance remain intact. |
| `records/project/project-state/r5.json` | Both current step revisions are finished | The summary consumes the accepted revision 2 object, produces `{"sum": 6}`, and has its own complete approval and review evidence. |

The amendment creates replacement files instead of overwriting protected files. The prepared operations are `artifacts/work.txt`, `artifacts/work-r2.txt`, and `artifacts/work-summary.txt`. They contain fictional descriptions, not executable scripts. The inventory explicitly includes the changed prepared operation, specification, decisions, unit, output, snapshots, approvals, reviews, run, comparison, and acceptance records. There are no undisclosed scripts in this example.

Inspect the final recorded graph from the repository root:

```sh
node scripts/vibe2spec.mjs validate --workspace "$PWD/examples/project-cycle/workspace" --entry records/project/project-state/r5.json --operation structure --format readable
```

The `structure` operation checks records and references. The lifecycle tests additionally check recorded completion, reopening, suspension, and renewed acceptance. An `implementation_readiness` assessment rejects the example context for real work. Do not change that context to manufacture readiness. A mechanical pass cannot authenticate the fictional user replies or prove that the fictional commands ran.

Run the saved-state and negative-gate tests with:

```sh
node --test tests/project-cycle.test.mjs
```

The tests inspect all five entry records without rewriting them. They also challenge missing acceptance, an unresolved next-step draft, premature resumption, an omitted amendment path, and a missing final results reviewer. `build-fixture.mjs` is a development-only deterministic generator for this example. Running it deliberately rewrites only this example's `workspace/` contents from the retained base fixture; product validation helpers remain read-only.
