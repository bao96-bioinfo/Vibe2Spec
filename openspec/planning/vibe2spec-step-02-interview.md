# Step 2 interview: validation and readiness

## Current status

Step 1 is finished under [its acceptance record](../changes/add-vibe2spec-guided-workflow/steps/01-records-and-templates/evidence/acceptance-v1.md). The user stated `Step 1 review result is accepted`. Tasks 1.1 through 1.6 are complete, giving 6 of 56 tasks complete. Step 2 is now current for interview and specification. Twelve decisions have explicit responses, recorded in [the first ten policy responses](../changes/add-vibe2spec-guided-workflow/steps/02-validation-and-readiness/decisions/policy-responses-v1.md) and [the runtime and profile responses](../changes/add-vibe2spec-guided-workflow/steps/02-validation-and-readiness/decisions/runtime-profile-responses-v1.md). Its implementation is not authorized while required decisions remain unresolved.

## Established scope

Step 2 covers tasks 2.1 through 2.6 in [the roadmap](../changes/add-vibe2spec-guided-workflow/tasks.md). It supplies Node.js record loading and validation, snapshot and reference verification, structural readiness checks, tests, and explanatory documentation. The approved Step 1 record format is its input contract. Changes to that accepted format require necessity and the explicit reopening process.

The helper must distinguish a structurally valid document from a step that has the required approval and review evidence. It cannot establish human identity or decide whether a scientific explanation is semantically complete. The separate reviewer retains those responsibilities. Values stored as commands are data; validation does not execute them.

## First grouped questions

The user explicitly approved these three recommendations together. Exact interfaces, fixtures, reports, limits, and commands still need a complete approved specification and separate specification review afterward. The policy responses do not approve details absent from the questions.

### S2-DEPENDENCIES: helper dependencies

The helpers need to read JSON, check declared fields, fingerprint file contents, and run small tests. Using Node.js built-in modules avoids installing additional packages and reduces dependencies in both host packages. The project would maintain its own field-checking logic. A third-party validator could supply reusable type-checking machinery, but introduces a dependency and still cannot establish semantic completeness or genuine user approval.

Selected: use only Node.js built-in modules. No third-party dependency is authorized. Status: approved policy.

### S2-REPORTS: report interfaces

A JSON report gives agents stable named fields to inspect. A readable mode can explain the same finding, for example: “The field review_stats is not defined; this record cannot pass validation.” The recommended option provides JSON and readable output modes from the same findings. The alternative provides JSON only and leaves its explanation to the agent. Providing both requires specifying and checking two representations; providing JSON only makes the helper smaller.

Selected: provide both JSON and readable reports from the same findings. The example wording is illustrative. Exact field names, message text, output ordering, and exit codes remain undecided. Status: approved policy.

### S2-PAIR: small independent implementation comparison

The recommended option compares two independent implementations of one small validation function. A candidate checks format version and required record identification fields. Both workers would receive the same complete specification and saved small JSON examples. Each result would be checked against expected findings and compared directly with the other result.

Pairing adds implementation and review work and can reveal ambiguous interpretation. Finite examples cannot prove correctness for every input. Selected: compare two independent implementations of one small function using identical saved synthetic examples. This does not duplicate the full validator or use real datasets. The selected record-envelope function is recorded below. Input cases, expected results, and resource limits require subsequent approval. Status: approved policy.

## Interface, file access, and runtime responses

### S2-INTERFACE: callable functions and command-line access

Selected: reusable JavaScript functions plus a thin command-line interface. Both access routes use the same validation rules. A function accepts specified inputs and returns findings. The command-line layer reads explicitly selected inputs and renders the approved report. Exact exports, arguments, return types, and command syntax remain to be specified. Status: approved policy.

### S2-WRITES: read-only inspection

Selected: read-only inspection with reports returned or printed to the caller. The helpers do not write report files, repair records, change approval, or execute stored commands. The coordinator may preserve a report only under a separately approved evidence-writing procedure. This policy concerns the product helpers; preparing source files and test fixtures still requires the complete Step 2 specification and applicable reviews. Status: approved policy.

### S2-RUNTIME: current development runtime with long-term-support compatibility

The user stated `Use the current version but also make it compatible with Node.js long-term-support environment`. The selected development runtime is the observed Node.js `26.11.1`. Compatibility with a Node.js long-term-support release is a requirement. A runtime's long-term-support status means its release line receives extended maintenance.

The later S2-LTS-VERSION response selected exact Node.js 24.22.0 alongside Node.js 26.11.1 for verification on this Mac. Compatibility must be verified with the specified checks; using stable APIs alone does not establish a tested result. No installation or additional verification has occurred. Status: approved runtime matrix; exact acquisition, commands, and checks pending.

## Current grouped questions

### S2-INPUT-SCOPE: select the assessed state

Selected: an explicitly selected entry record and workspace, following exact references within approved locations and limits. External locations require explicit authorization. Directory discovery is excluded from Step 2. An older approval cannot apply to a newer draft through directory proximity. Status: approved policy.

### S2-FINDINGS: retain independent problems

Selected: collect independent findings while stopping a broken reference branch. Reports distinguish observed defects, unresolved requirements, and checks that could not finish. Missing evidence or an incomplete assessment cannot establish readiness. Status: approved policy.

### S2-PAIRED-UNIT: select the small function

Selected: the record-envelope checker, which validates shared identification fields. The twelve record-specific validators are implemented once. Exact fixtures, expected outcomes, interfaces, and resource limits remain for the complete specification. Status: approved policy.

### S2-NUMBERS: numerical representation and precision loss

Selected: standard JavaScript numbers with strict precision-loss checks. The user was informed that decimal `0.1` has a small binary representation error. The selected behavior accepts `0.1` and `1e-1` as the same supported value. It rejects `0.10000000000000001` when conversion collapses it to `0.1`, oversized integers, overflow, and underflow. Strings can retain precision when their interpretation is explicitly approved and the field permits them. No numerical comparison tolerance is implied. Exact token comparison, negative zero, bounds, and fixtures remain for the complete contract. Status: approved policy.

## Planning artifacts

The [behavior-specification draft](../changes/add-vibe2spec-guided-workflow/steps/02-validation-and-readiness/draft/spec.md) gives the required behavior, architecture diagram, component links, and remaining contract work. The [interface draft](../changes/add-vibe2spec-guided-workflow/steps/02-validation-and-readiness/draft/interface-options.md) explains selected policies and remaining choices. The [coverage map](../changes/add-vibe2spec-guided-workflow/steps/02-validation-and-readiness/draft/coverage.md) maps all twenty-four accepted cases and all twelve record kinds to mechanical checks, separate-review obligations, and later lifecycle responsibilities. Proposed checks remain subject to the complete specification and user approval.

## Environment and resource responses

S2-LTS-VERSION selects Node.js 24.22.0 alongside the installed Node.js 26.11.1 on this Darwin arm64 host. Both use identical prepared source and approved tests. The published 24.22.0 archive checksum is recorded in [the source observation](../changes/add-vibe2spec-guided-workflow/steps/02-validation-and-readiness/draft/runtime-source-observation.md). No archive has been acquired or executed. Status: approved matrix.

S2-ASSESSMENT-LIMITS selects the per-assessment verification profile in [the runtime proposal](../changes/add-vibe2spec-guided-workflow/steps/02-validation-and-readiness/draft/runtime-and-verification-proposal.md): 1,048,576 bytes per JSON input; 4,194,304 bytes per supporting file; 16,777,216 total input bytes; 512 artifacts; 4,096 reference occurrences; 64 nested JSON containers; 100,000 JSON values; 512 retained findings; sequential reads; and a 5,000-millisecond assessment deadline. These approved values govern the development verification profile. They do not establish defaults for future user projects. Count and byte bounds are inclusive; reaching the time deadline prevents a complete pass. Exact accounting and fixture boundaries remain in the complete contract. Additional supervisor, output-capture, aggregate-run, and paired-unit bounds remain proposals. Status: approved assessment profile.

## Next input-handling questions

The [next interview group](../changes/add-vibe2spec-guided-workflow/steps/02-validation-and-readiness/draft/input-decisions.md) explains external file versus directory authorization, handling of a leading encoding marker, and preservation of negative zero. Each is independent. Their recommendations remain unapproved until the user selects them. These questions do not reopen the accepted Step 1 format.

## Remaining specification work

The detailed contract must fix runtime acquisition and commands, module exports, command-line entry points, required arguments, report schema and ordering, exit status meanings, and filesystem access representation. The two-runtime matrix and assessment profile are selected. The contract must define the approved finding collection precisely, malformed JSON handling, reference traversal, record identity checks, remaining execution bounds, and the distinction between a failed check and an assessment that cannot be completed.

The specification must map accepted Step 1 rules to deterministic checks without inventing new record fields. It must identify which obligations require semantic review and which lifecycle operations remain in their later steps. The fixture plan must preserve accepted examples and use new, separately specified artifacts for additional cases. Any selected paired unit receives the same complete current-step context as the primary implementation.

The read-only planning audit by `/root/step2_contract_gaps` found no necessary amendment to Step 1. Callable functions with command-line access and read-only behavior have since been approved. Selection of the entry record, bounded reference traversal, decoding, numeric-token checks, and treatment of partial assessments still need their exact contracts.

The input selection must not combine historical evidence with unrelated later records merely because both exist in a directory. The accepted fixture graph contains multiple historical states. Assessment must follow the selected state and its applicable references. An external path appearing inside a record does not itself authorize reading that location.

The parser design must preserve information needed to reject invalid or unsupported input before ordinary parsing loses it. Examples include repeated object keys and integers beyond the safe range. The accepted format already prohibits silent rounding. Step 2 must specify a conforming detection method and its checks without changing that rule.

Not every existing fixture is a purely mechanical check. For example, detecting that a Markdown instruction says to reverse an array while a structured method says to copy it requires semantic assessment. The detailed coverage map must distinguish automated cases from reviewer obligations and later lifecycle behavior. It must not alter accepted examples or claim that all twenty-four cases are automatically evaluated.

## Research and environment observations

Read-only environment inspection found Node.js `v26.11.1`, npm `11.20.0`, and Darwin arm64. The subsequent user response approves using the installed Node.js version for Step 2 and adds a long-term-support compatibility requirement. The observation alone supplies no distributed compatibility claim, npm prerequisite, or verification result.

The [Node.js release page](https://nodejs.org/en/about/previous-releases), accessed on 2026-10-18 UTC, identifies Node.js 24 and 22 as long-term-support lines and Node.js 26 as Current. It lists Node.js `24.22.0` as the latest long-term-support release. The user subsequently selected exact 24.22.0 for compatibility verification. Acquisition and check procedures remain for the detailed contract. No claim is made that Node.js 24 is installed or tested here.

Node.js documents a [built-in test runner](https://nodejs.org/api/test.html) and [cryptographic hashing](https://nodejs.org/api/crypto.html). These support the proposed dependency policy. API availability and the exact commands must still be checked against the selected runtime before the execution specification is approved.
