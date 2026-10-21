# Review design source notes

Vibe2Spec adapted useful review mechanisms from the user's local `superpowers-main` source tree, whose plugin manifest declares **Superpowers 7.0.0**. Inspection date: 2026-10-21. Its manifest names [obra/superpowers](https://github.com/obra/superpowers) as the upstream repository. The supplied tree had no Git metadata, so these notes identify the inspected bytes rather than claiming a verified upstream commit.

The adaptation uses original instructions and JavaScript. No Superpowers runtime dependency or copied script is included.

| Inspected source | Useful mechanism | Vibe2Spec adaptation |
| --- | --- | --- |
| `skills/subagent-driven-development/task-reviewer-prompt.md`, lines 3, 38, 55, 73 | One task review checks specification and quality; read the diff once, expand for a concrete risk, avoid nested reviewers, inspect existing test evidence | One consolidated review within each phase, named-risk expansion, centralized dispatch, and no unauthorized test execution |
| `skills/subagent-driven-development/re-review-prompt.md`, lines 24, 55, 80 | Follow-up examines earlier findings and the exact fix | Explicit per-finding resolutions plus verified input/dependency coverage; genuine defects outside the diff still block affected readiness |
| `skills/subagent-driven-development/SKILL.md`, lines 251, 325, 458 | File-based task handoffs and bundled correction work | Short handoff, all findings together, one correction pass rather than one reviewer per finding |
| `skills/requesting-code-review/SKILL.md`, lines 8, 80 | Give the reviewer carefully selected task context rather than the whole coordinator history | Direct artifact access with a compact inspection packet and preserved evidence |

Same-reviewer continuation, exact coverage fingerprints, and the normal two-round phase budget are Vibe2Spec adaptations. They are not attributed to Superpowers. Vibe2Spec does not adopt its round-cap procedures that can park findings and let the controller mark work done. Exhausting a review budget leaves unresolved obligations blocked. No token or latency reduction is claimed from source inspection alone.

SHA-256 fingerprints of the inspected files:

```text
f1e28bae51b4a6af9ea340868b140362b4a00ba72bd722e7037cec37c23aa0bb  .claude-plugin/plugin.json
bfed55c8f19d0ff6ed57b0fe09127c92890e9311c6c73917129598826bf9ebe8  skills/subagent-driven-development/task-reviewer-prompt.md
0828a5e9cbb12ba49f14621dd8c3953c48c0fc383e75bb5494f055ed0d6d824f  skills/subagent-driven-development/re-review-prompt.md
8dde5589ee083fb4999106d116f01c8fdaf3116a8a9813fdedeb80329de49046  skills/subagent-driven-development/SKILL.md
2180e14a448e9410bec88e6646a2d1f0ce7fdd58de27388c1e052e929679d2bc  skills/requesting-code-review/SKILL.md
```
