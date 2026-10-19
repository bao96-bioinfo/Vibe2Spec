# Independent integration review

The separate `/root/paired_and_package_review` context inspected the command-line entry point, report formatting, overview rendering, assembly, and real-host installation smoke script. This review also inspected the bounded envelope comparison before execution; its exact artifact identities and initial correction are recorded in [the paired review](paired-pre-execution-review.md).

| Finding | Correction and evidence |
| --- | --- |
| A malformed project `states` value could throw during report target extraction and replace a useful structural finding with an internal failure. | Target extraction now checks that states are an array and tolerates invalid members. A malformed-state graph and direct report regression both pass. |
| A changed input detected during overview's second graph read could produce a report status different from the process return value. | The command now returns the status from the exact report it prints. |
| ASCII rendering retained only half of a supplementary Unicode character. | Rendering now preserves both UTF-16 units as ASCII escapes. A DNA-symbol example verifies the complete escaped title. |
| The paired harness could accept a plain thrown object named TypeError. | It now requires actual TypeError identity. A counterfeit exception fails the regression. A separate context independently inspected this change. |
| The fixture materializer did not reject invalid source-order permutations. | It now checks exact complete membership without duplicates before accepting an order operation. |
| Assembly trusted marker presence, followed a symbolic-link destination, and removed unrelated files inside the destination. | Assembly now rejects symbolic links in destination ancestors and package contents, checks the exact marker text, records every generated file and directory, rejects modified or extra contents, and completes a staged package before replacing the previous package. Tests verify preservation of symlink targets, modified generated files, and extra directories. |

Eighteen focused tests passed under Node.js 26.11.1 using `node --test tests/integration-review.test.mjs tests/report.test.mjs tests/overview.test.mjs`. This includes complete identifier validation, signed-zero mutation detection, invalid invocation reports, stable report output, and overview state/dependency rendering. These focused results supplement the complete release suite; they do not replace its checks on both selected runtimes.

The assembly ownership inventory is a development safeguard. It does not establish the authenticity of project approvals or authorize the plugin to modify user project data. Its initial migration exception applies only to this repository's original generated package and refuses paths absent from the new package. Other destinations require an inventory created by the assembler.

The host smoke script installs the generated package into isolated host configuration, exercises installed helper code against retained examples, updates the local package version, removes the package, and compares the preserved project record. Helper output parity demonstrates identical packaged helper behavior. It does not demonstrate that a native model session in each host follows every workflow instruction. Claims about native delegation, approval provenance, and real reviewer independence remain subject to the documented workflow and release limitations.
