# Node.js compatibility source observation

The user approved Node.js 26.11.1 and 24.22.0 for verification on the current Darwin arm64 host, as recorded in [the runtime response](../decisions/runtime-profile-responses-v1.md). This observation supplies source information for the selected compatibility version. Acquisition and verification procedures remain to be completed in the specification.

Read-only inspection on 2026-10-18 UTC located the development executable at `/opt/homebrew/bin/node`; invoking its version command returned `v26.11.1`.

The official [Node.js release page](https://nodejs.org/en/about/previous-releases) identifies the 24 line as long-term support. The official [version-specific checksum file](https://nodejs.org/dist/v24.22.0/SHASUMS256.txt) was retrieved successfully through a read-only HTTPS request. It reports the following archive identity.

| Field | Observed value |
| --- | --- |
| Archive | `node-v24.22.0-darwin-arm64.tar.gz` |
| Source | `https://nodejs.org/dist/v24.22.0/node-v24.22.0-darwin-arm64.tar.gz` |
| SHA-256 | `6a9724d9b50a5f22b4816cded441b5a8d9ddae546191a5e5b7efa5a5e2ee26d5` |
| Proposed use | Compatibility verification on the current Darwin arm64 host. |

This observation verifies the published checksum listing. The archive has not been downloaded, hashed locally, extracted, installed, or executed. Acquisition location, byte limits, exact extraction scope, and verification commands remain part of the pending complete specification. The selected helper source and fixture bytes must be identical in both runtime checks.
