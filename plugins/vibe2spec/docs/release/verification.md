# Vibe2Spec 0.1.0 verification

Vibe2Spec 0.1.0 implements the standalone coordinator, worker and reviewer workflows, twelve record types, read-only validation, output comparisons, step lifecycle checks, ASCII overviews, and marketplace packages for Claude Code and Codex. The user authorized autonomous completion of package development. Product projects retain explicit user decision approval, separate reviews and result acceptance.

## Observed checks

| Area | Observed evidence |
| --- | --- |
| Node.js 26.11.1, macOS arm64 | 192 tests passed; zero failures. [Runtime record](runtime-verification.json) and [test output](tests-node26.txt). |
| Node.js 24.22.0, macOS arm64 | The same 192 tests passed; zero failures. [Test output](tests-node24.txt). |
| Independent small-unit comparison | 64 fixed envelope cases; 128 calls per runtime, 256 total in the final experiment. Each implementation passed its oracle and direct comparison, with input preservation. [Node 26 evidence](envelope-v26.11.1.json), [Node 24 evidence](envelope-v24.22.0.json). |
| Workflow explanations and review | A separate context produced responses before reading held-out outcomes. Eight interview cases and fourteen review cases matched the intended meaning and gate behavior. [Assessment](workflow-forward-review.md). |
| Full project history | Seventy-five fictional files preserve five states across two steps, acceptance, necessary reopening, suspension and renewed acceptance. Eleven automated checks inspect the saved history. [Example](https://github.com/bao96-bioinfo/Vibe2Spec/blob/main/examples/project-cycle/README.md). |
| Claude Code 2.1.296 | Actual local marketplace installation, three-skill inventory, installed helper checks, temporary version update and removal passed. |
| Codex CLI 0.162.1 | Actual local marketplace discovery, installation, enabled package inventory, installed helper checks, temporary version update and removal passed. |
| Cross-host evidence | Nine selected states produced identical parsed reports from both installed copies. All seventy-five project-history files and a separate workspace marker retained their fingerprints after update and removal. [Host observations](host-install-observation.json). |
| Accepted foundation | All twenty accepted Step 1 files retain their exact original bytes and digests. [Requirements audit](requirements-audit.md). |

Both host checks used isolated configuration directories and a temporary local marketplace. The update version `0.1.1-smoke` exists only inside that test. Node.js 24.22.0 was obtained from the official distribution archive and verified against SHA-256 `6a9724d9b50a5f22b4816cded441b5a8d9ddae546191a5e5b7efa5a5e2ee26d5`. No global runtime or normal host configuration was changed.

## Requirement coverage

| Capability | Implementation and checks |
| --- | --- |
| Request discovery | Coordinator skill, research and explanatory interview guidance, dialogue fixtures and independent forward assessment. |
| Complete step specification | Record schemas, strict input parser, exact reference graph, complete-scope approval, specification review, unit coverage and authoring examples. |
| Reviewed execution | Worker/reviewer skills, direct artifact inspection, effective-setting checks, exact snapshot binding, separate-context checks and preserved limitations. |
| Reproducible outputs | Explicit byte, JSON and numerical contracts; independent oracle and pairwise checks; fixed fixtures and resource bounds. |
| Completion and reopening | Run and comparison validation, required acceptance, exact amendment scope, dependency suspension, stale evidence checks and preserved historical revisions. |
| Host integration | Shared self-contained package, two marketplace catalogs, installed resource checks, versioned lifecycle observations and portable record results. |

## Independent review and corrections

The [core source audit](independent-code-review.md), [integration review](integration-review.md), [requirements audit](requirements-audit.md), and [paired pre-execution review](paired-pre-execution-review.md) inspected actual source and evidence. They found and corrected defects in approval scope, draft-run acceptance, paired-rule binding, input/output coverage, exact identifier matching, malformed records, report handling and generated-package protection. Regression tests preserve the corrected behavior.

The first integrated run exposed a stale generated copy after the final source correction. Its [failure record](prior-verification-findings.json) is retained. Rebuilding the package resolved the mismatch; the complete suites then passed on both fixed runtimes. The expected comparison fixtures and criteria were unchanged.

## Scope and external status

Mechanical reports do not authenticate user responses, prove genuine context independence from labels, or interpret every scientific method. Separate review remains necessary. Numerical formulas outside the documented checker contract remain indeterminate. File observations detect specified changes but do not claim protection from every hostile filesystem race. Deadlines are cooperative.

The actual host package-manager tests establish installation and installed-helper behavior. They do not claim that an autonomous model completed every workflow inside each clean host. Missing native review requires the separately assessed separate-session fallback. An unavailable Node.js process does not produce a passing validation result. These capability boundaries are retained in the host evidence.

The final repository contains the installable package and marketplace catalogs. The release archive and listing materials are prepared for publisher review. Official public directory submission, approval and publication remain external actions; none is claimed. The package's finite paired tests establish the recorded unit behavior on the saved examples, not universal equivalence or scientific validity.
