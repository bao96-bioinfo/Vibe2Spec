# Host compatibility

The same package supplies three skills and the same JSON record contract in both hosts. Separate reviewer contexts use the host's available delegation mechanism. A separate-session handoff remains required when delegation is unavailable. There are no host-specific agent definitions, lifecycle hooks, external servers, or automatic execution permissions.

| Surface | Observed version | Verification |
| --- | --- | --- |
| Claude Code command line | 2.1.296 | Manifest validation, marketplace discovery, installation, three-skill inventory, installed helper execution, versioned update and removal. |
| Codex command line | 0.162.1 | Marketplace discovery, installation, enabled package inventory, installed helper execution, versioned update and removal. |
| Node.js on macOS arm64 | 26.11.1 and 24.22.0 | Full product test suite and paired small-unit checks. |

Host installation tests use isolated configuration directories and an isolated local marketplace. The original user configuration is preserved. A synthetic update changes only the temporary package version to `0.1.1-smoke`. It does not publish that version. The test checks that workspace records survive installation, update and removal.

Cross-host checks invoke each installed package's own helper against the same saved fixture graph. Parsed reports must agree exactly for complete fictional evidence, missing decisions, self-review and indeterminate review. Fictional examples remain unable to authorize a real project. These checks establish portable installed resources and mechanical gate agreement. They do not prove that every model follows instructions in every conversation.

The [independent workflow assessment](release/workflow-forward-review.md) records actual fresh-context responses to the interview and review scenarios. That assessment is distinct from marketplace installation. Native autonomous model execution in both clean hosts is not claimed by the local package-manager tests. The workflow uses separate review sessions if native delegation is absent; the product does not simulate an unavailable reviewer.

Official directory publication and desktop-client account access are external distribution states. The repository catalogs provide the verified command-line installation route. Consult [installation](installation.md) for commands and [publishing](publishing.md) for submission materials. Host behavior can change; rerun the host checks when upgrading beyond the observed versions.
