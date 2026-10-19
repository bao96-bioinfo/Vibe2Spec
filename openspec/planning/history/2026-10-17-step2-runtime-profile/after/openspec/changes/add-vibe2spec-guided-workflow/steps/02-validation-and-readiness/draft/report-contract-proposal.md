# Step 2 report contract proposal

## UNAPPROVED proposal and scope

This entire document proposes report details for user review. It is not an implementation authorization. The approved policies are reusable functions with a command-line interface, read-only helpers that print reports, JSON and readable output, built-in Node.js modules, explicit entry selection and approved read locations, collection of independent findings with incomplete assessment distinguished, pairing of the small record-envelope checker, and standard JavaScript numbers with strict precision-loss checks. The selected runtime matrix is Node.js 26.11.1 and 24.22.0. The ten per-assessment resource values are also approved in [their response record](../decisions/runtime-profile-responses-v1.md). These choices do not approve the report fields, messages, exit statuses, or example reports proposed below.

The helper would assess record structure and the recorded evidence required to begin implementation. It would not authorize execution, advance project states, authenticate a user response, or perform semantic review. The accepted [record format](../../../../../../docs/record-format.md) remains unchanged. This report is a separate helper output format, not a new record kind or an extension to the accepted Finding type.

The proposal uses the approved explicit entry and reference-graph policy. It does not add directory discovery. Collecting independent findings is approved; the exact ordering and report representation proposed here remain unapproved. No directory, command spelling, numerical resource limit, or exact paired-unit interface is selected here.

## Assessments and meanings

`structure` assesses the selected records against the approved structural and reference rules. `implementation_readiness` additionally assesses the current step's required decisions, exact approval coverage, units, comparison coverage, dependency evidence, and passing specification review. It does not assess readiness to execute prepared code or declare a project step finished.

| Report field | Proposed values and meaning |
| --- | --- |
| `completion` | `complete` means every applicable mechanical check in the requested assessment was determined. `incomplete` means a required check could not be determined or an approved resource limit left independent checks unperformed. `not_started` is reserved for invalid invocation. |
| `structure` | `invalid` means at least one structural defect was established. `valid` requires a complete structural assessment with no such defect. `indeterminate` means no defect has been established, but required structural checks remain incomplete. `not_assessed` applies when processing did not begin. |
| `implementation_readiness` | `blocked` means a required condition is demonstrably unsatisfied or a structural defect prevents reliance on the specification. `satisfied_in_records` requires complete mechanical assessment with no structural defect or unresolved readiness finding. `indeterminate` means required evidence could not be assessed and no known blocker has been established. `not_requested` applies to a structure-only request. `not_assessed` applies to invalid invocation. |

A structurally valid draft can remain blocked because a decision is unresolved. A structurally invalid record remains invalid even if another file cannot be read. The report preserves both the known defect and the incomplete assessment. A missing referenced file is a definite defect; permission denial is an inability to inspect the file. These conditions have different findings and do not become interchangeable failures.

The helper's supported numeric representations are distinct from the broader accepted record format. A finite decimal token in a general JSON value can satisfy that format while being unsupported by the selected JavaScript-number policy. If conversion would lose a distinction that the approved precision policy requires preserving, the proposed finding is `incomplete/unsupported-number`. The helper leaves the affected assessment incomplete and cannot certify readiness. It does not declare the accepted format invalid merely because its own numeric support is narrower.

A violation of an explicit format constraint is structural when the original token and field context establish that violation. For example, a workflow revision outside its positive safe-integer range produces `structural/invalid-integer`. The same distinction applies wherever the accepted format explicitly requires an oversized integer to be represented as a string. The helper must classify the original token before lossy conversion; an unsupported conversion alone is insufficient evidence of a format violation. If a definite structural violation and conversion limitation concern the same value, the proposed specific structural finding takes precedence and the helper does not duplicate it as `unsupported-number`.

| Numeric illustration, not a complete approved fixture | Proposed classification |
| --- | --- |
| A general literal value contains `0.10000000000000001`, whose distinction from `0.1` would be lost under the selected number representation. | `incomplete/unsupported-number`; preserve the original bytes and do not substitute `0.1`. The token is not declared structurally invalid solely because the helper cannot support its precision. |
| The workflow `revision` field contains `9007199254740992`. | `structural/invalid-integer`; the original value violates that field's explicit safe-integer bound. |
| A general literal value contains `0.1` or `1e-1`. | These values are supported under the user's approved policy. Other applicable checks still determine the record's outcome. |

`satisfied_in_records` describes the declared evidence only. A valid review record with `outcome: pass` supplies recorded review evidence. Its existence does not prove that the reviewer inspected the work, that the context labels are genuine, or that the response came from the user. The coordinator must assess those facts through the separate review process.

## JSON representation

The proposed object has exactly these fields, in this order. All fields are present, and unlisted fields are prohibited. Reports contain no timestamp, process identifier, elapsed time, platform error string, color code, or runtime version. Those observations would require a separately specified execution record. Identical assessed bytes, invocation, limits, access results, and check results would therefore produce identical report bytes across the approved runtimes.

| Field | Exact shape |
| --- | --- |
| `report_version` | Integer `1`. |
| `operation` | `structure`, `implementation_readiness`, or null when no valid operation was supplied. |
| `entry_path` | The supplied valid workspace-relative or approved external path, or null when no valid path was supplied. No machine-root substitution is performed. |
| `entry_sha256` | The observed lowercase SHA-256 digest of the complete entry bytes, or null when those bytes were not completely read. |
| `target_step_id` | The current step's identifier for a readiness request once established; otherwise null. |
| `target_step_revision` | The corresponding positive safe integer revision; otherwise null. |
| `completion` | One value defined above. |
| `structure` | One value defined above. |
| `implementation_readiness` | One value defined above. |
| `findings` | Array of the finding objects defined below, including an empty array when none exist. |
| `review_obligations` | Array of fixed obligation objects defined below. |
| `exit_status` | Integer selected by the precedence table below. |

A finding has exactly `category`, `code`, `path`, `pointer`, `related_path`, and `message`, in that order. `category` is `structural`, `readiness`, `incomplete`, `invocation`, or `internal`. `code` is a registry identifier below. `path` identifies the affected supplied artifact, or null for invocation or process-level failures. `pointer` is a JSON Pointer identifying the affected field, or null for a whole-file, decoding, syntax, or invocation finding. The empty pointer identifies the JSON document root. Pointer segments escape `~` as `~0` and `/` as `~1`; array indices use decimal digits without leading zeros. `related_path` identifies a referenced target involved in the finding, or null. It never substitutes for the affected source location.

Messages are the exact strings in the registry. The path and pointer supply location without interpolation into prose. Unknown fields identify that field; missing fields identify the absent field's expected pointer. A duplicate-key finding identifies the duplicate member's decoded key pointer and is emitted once per repeated key in the same object. A source syntax failure identifies the whole file; detailed source offsets are excluded from this proposal to avoid implementation-specific parser messages.

JSON output uses UTF-8 without a byte-order mark, two spaces for indentation, and one final line-feed character. Field and array order follow this document. Strings use standard JSON escapes for quotation marks, backslashes, and control characters; other Unicode characters are emitted directly. No automatic Unicode normalization occurs. Handling of unpaired Unicode surrogates must be resolved in the parser specification before this serialization rule can be finalized.

## Ordering and dependent checks

Under the approved collection policy, applicable checks continue after independent findings. A broken reference stops assessment through that reference; the helper does not substitute another path or version. Descendant checks that require the missing target produce no invented findings. The established broken reference already prevents a valid assessment of that graph. A resource or access failure additionally marks the assessment incomplete.

Findings are sorted by category in this order: `invocation`, `internal`, `structural`, `readiness`, `incomplete`. Within a category they are sorted by `path`, `pointer`, `code`, then `related_path`, comparing the UTF-8 bytes of decoded strings. Null sorts before every string. Identical tuples are emitted once. A shorter byte sequence sorts first when it is a prefix of another. Locale settings do not affect ordering.

An invalid parent value suppresses type-dependent child findings: a missing content object produces one missing-field finding, not a finding for every inaccessible child. A valid draft's unresolved null remains structurally permitted wherever the accepted format permits it. Readiness reports the unresolved required location; structure-only validation does not turn that null into an invalid-type finding.

The helper cannot stop the entire assessment merely because it found one independent defect. Approved resource limits can still prevent completion. The detailed traversal and check schedule must be specified so that a limited assessment has reproducible coverage; sorting final findings alone does not define which checks occur before a limit is reached.

## Structural finding registry

The proposed registry is finite. Codes identify rule families; the detailed coverage map must specify the exact predicates and source locations for every family. These entries do not approve new input rules. For example, duplicate-key rejection is a pending parser policy, while rejecting silent rounding follows the accepted record contract.

| Code | Exact message |
| --- | --- |
| `invalid-encoding` | The file is not valid under the approved text encoding. |
| `invalid-json` | The file does not contain one complete valid JSON value. |
| `duplicate-key` | This object contains the same decoded field name more than once. |
| `unsupported-version` | The record format version is unsupported. |
| `unknown-field` | This field is not declared for the containing object. |
| `missing-field` | This required field is absent. |
| `invalid-type` | This value does not have the type declared for this field. |
| `invalid-enumeration` | This value is not one of the declared alternatives. |
| `invalid-field-order` | The object fields are not in their declared order. |
| `invalid-identifier` | The identifier does not satisfy the declared spelling or length rule. |
| `invalid-integer` | The value does not satisfy the declared safe-integer range. |
| `invalid-number` | The value does not satisfy the declared finite-number or nonnegative-number rule. |
| `empty-value` | This field requires a nonempty string or collection. |
| `duplicate-value` | This collection contains a value that its uniqueness rule prohibits repeating. |
| `invalid-order` | This collection is not in its declared order. |
| `invalid-timestamp` | The timestamp or timestamp ordering does not satisfy the declared rule. |
| `invalid-digest` | The digest is not a lowercase SHA-256 hexadecimal value. |
| `invalid-path` | The path does not satisfy the declared path syntax or location rule. |
| `path-alias` | The path identifies an artifact through a prohibited alias or case collision. |
| `symbolic-path` | The artifact or one of its ancestor directories is symbolic. |
| `not-ordinary-file` | The referenced artifact is not an ordinary file. |
| `missing-reference` | The referenced file does not exist at its specified location. |
| `digest-mismatch` | The referenced file bytes do not match the specified digest. |
| `size-mismatch` | The file byte length does not match the snapshot entry. |
| `reference-kind-mismatch` | The referenced record has a different kind from the one required here. |
| `reference-project-mismatch` | The referenced record belongs to a different project. |
| `reference-cycle` | Following these record references creates a cycle. |
| `dependency-cycle` | Following these step dependencies creates a cycle. |
| `duplicate-identity` | This project graph contains more than one record for the same identity and revision. |
| `identity-conflict` | This record identity changes its kind or project. |
| `revision-conflict` | The revision does not satisfy the applicable preserved-revision rule. |
| `context-conflict` | The declared context or actor identity violates the record's context rules. |
| `association-mismatch` | The referenced identities, revisions, or ordered associations do not match the containing record's requirements. |
| `snapshot-membership-mismatch` | The claimed target is absent from the exact snapshot scope required here. |
| `forbidden-snapshot-entry` | The snapshot includes itself or evidence that must be created after it. |
| `record-inconsistency` | These declared fields contradict an explicit cross-field rule of the record format. |

General consistency codes must not become a way to infer semantic facts from prose. Their approved predicates must be finite and mapped individually. A revision-history check also needs an approved available-history boundary; inspecting one revision cannot establish facts about undisclosed history.

## Readiness finding registry

| Code | Exact message |
| --- | --- |
| `non-project-context` | Authoring templates and fictional examples cannot establish readiness for an actual project. |
| `missing-current-step` | The selected project evidence does not identify an assessable current step. |
| `incomplete-step` | The current step has an unresolved required contract value. |
| `incomplete-unit` | A required unit has an unresolved required contract value. |
| `unresolved-decision` | A required decision has no resolved selection. |
| `missing-pair-decision` | The current step lacks the required explicit paired-validation decision. |
| `unapproved-decision` | No applicable approval covers these exact required decision contents. |
| `unapproved-specification` | No applicable specification approval covers this required artifact and its exact contents. |
| `unpreserved-specification` | A required specification artifact is not preserved as the required frozen version. |
| `missing-comparison-coverage` | A required output or check lacks its specified comparison coverage. |
| `missing-specification-review` | No applicable specification review covers the complete required specification scope. |
| `review-not-passing` | The applicable specification review does not report a pass with no unresolved findings. |
| `review-not-independent` | The recorded reviewer context is also an assessed author's or relevant worker's context. |
| `missing-acceptance` | A required dependency lacks acceptance for its applicable revision. |
| `dependency-not-current` | A required dependency has unresolved current evidence or recorded suspension. |

Absence of approval is assessed only after the selected evidence scope has been inspected sufficiently to establish that absence. An unreadable evidence branch yields incomplete assessment instead of an invented missing-approval finding. A required unresolved content field can have a narrower code such as `unresolved-decision`; the helper does not also emit `incomplete-step` for the same unresolved value merely because the step depends on it.

Step 2 may read dependency acceptance and suspension evidence required for implementation readiness. It does not decide lifecycle transitions, expand an amendment's approved edit scope, or assess execution and results gates. Existing Step 1 categories such as `amendment-scope-changed` remain for their applicable later behavior. The accepted `representation-conflict` example requires semantic assessment of prose and cannot be represented as a passed mechanical check. The `incomplete-example` fixture category requires an explicit fixture-adapter mapping; it is not silently converted into project approval evidence.

## Incomplete, invocation, and internal finding registries

| Category | Code | Exact message |
| --- | --- | --- |
| `incomplete` | `access-not-authorized` | The requested location is outside the approved read scope. |
| `incomplete` | `access-denied` | The required artifact could not be read because access was denied. |
| `incomplete` | `read-failed` | The required artifact could not be read because a filesystem operation failed. |
| `incomplete` | `input-changed` | The input changed during assessment, so its checked identity is not established. |
| `incomplete` | `resource-limit` | An approved assessment resource limit prevented completion. |
| `incomplete` | `unsupported-number` | This numeric representation is outside the helper's approved precision support; the affected assessment remains incomplete. |
| `incomplete` | `check-not-supported` | This required check is outside the approved mechanical check set. |
| `invocation` | `invalid-operation` | A supported assessment operation must be selected. |
| `invocation` | `invalid-argument` | An invocation argument is missing, repeated, unknown, or invalid. |
| `invocation` | `invalid-read-scope` | The invocation does not provide a valid approved read scope. |
| `invocation` | `invalid-limits` | The invocation does not provide the required valid resource limits. |
| `internal` | `internal-failure` | The helper encountered an unexpected failure and did not complete the assessment. |

The parser and filesystem specifications must map actual runtime errors to these categories without including platform-specific error text. The exact read-race checks and resource accounting remain integration decisions. A report must not claim `input-changed` detection until its approved observation method establishes that change.

## Reviewer obligations

The report always includes the following four obligations, in this order. Each object contains exactly `code` and `message`. These entries describe limits of automation; they are not findings and do not themselves force an incomplete mechanical assessment. A structure-only request does not claim that any of these obligations has been fulfilled. A readiness request still relies on the actual separate review process to assess them.

| Code | Exact message |
| --- | --- |
| `semantic-completeness` | A separate reviewer must assess whether the specification resolves every effective decision and whether its readable and structured statements agree. |
| `approval-provenance` | The coordinator and separate reviewer must assess the actual user response and its exact approval scope; text fields alone do not authenticate approval. |
| `review-independence` | The separate review process must assess the actual handoff and context separation; distinct recorded labels alone do not prove independence. |
| `evidence-authenticity` | The separate reviewer must assess whether preserved artifacts and claimed observations describe the actual work; matching record fields alone do not establish that fact. |

The helper cannot turn an unreviewed mathematical formula into an accepted comparison rule by observing a nonempty string. It checks required representation and exact approval references; semantic sufficiency remains within the actual specification review.

## Exit statuses and output channels

These are proposed process exit statuses. The reusable functions return the same report with `exit_status`; they do not terminate their caller. The first applicable row determines the status.

| Condition, in precedence order | Status |
| --- | ---: |
| An internal failure occurred. | 4 |
| Invocation is invalid and assessment did not begin. | 3 |
| A structural defect or known readiness blocker was established. This includes reports that also contain incomplete checks. | 1 |
| Assessment is incomplete and no known defect or blocker was established. | 2 |
| The requested mechanical assessment completed successfully. For readiness this requires `satisfied_in_records`; for structure it requires `valid`. | 0 |

Exit status 0 is not permission to execute work or skip the separate reviewer. Exit status 1 does not promise that every possible defect has been found; callers inspect `completion` and the full findings. A structurally valid unfinished draft can produce 0 for structure and 1 for readiness under the same exact contents.

For a valid selected report mode, the command writes exactly one report to standard output and no additional progress text to standard error. Invalid report-mode arguments use the JSON representation. An output-stream failure may prevent any complete report; the command then exits 4 and attempts the exact single line `Vibe2Spec report output failed.` on standard error. Operating-system termination or an unavailable Node.js executable cannot guarantee a report and must not be interpreted as a validation result.

## Readable representation

Readable output uses exactly these initial lines, in this order, substituting the corresponding JSON value after each colon. String values are JSON-quoted; null and integers use their JSON spelling. This quoting keeps paths containing line breaks on one physical report line.

```text
Vibe2Spec validation report
Report version: <report_version>
Operation: <operation>
Entry: <entry_path>
Entry SHA-256: <entry_sha256>
Target step: <target_step_id>
Target revision: <target_step_revision>
Completion: <completion>
Structure: <structure>
Implementation readiness: <implementation_readiness>
Exit status: <exit_status>
```

One blank line follows, then `Findings: N`, where N is the findings-array length in decimal. Each finding uses one following line with the exact form `<category> | <code> | <path> | <pointer> | <related_path> | <message>`. Every substituted value is JSON-quoted or null, using the same escaping rules as JSON mode. No line is printed for an empty findings array. Another blank line follows, then `Reviewer obligations: 4`, then four lines of `<code> | <message>` using JSON-quoted strings in the fixed obligation order. The report ends with exactly one line-feed character. It has no color, terminal-width wrapping, localized text, or additional recommendation text.

Readable mode exposes exactly the same findings and limitations as JSON mode. Detailed interview explanations remain in the coordinator's user-facing dialogue, where the agent can explain the meaning of a located finding without changing its recorded assessment.

## Illustrative outcomes and unresolved integration

| Illustration, not an approved fixture | Proposed conclusions |
| --- | --- |
| A permitted draft null is found during a complete structure assessment. | `structure: valid`, `implementation_readiness: not_requested`, status 0. |
| The same required null belongs to the current step assessed for implementation. | `structure: valid`, `implementation_readiness: blocked`, a located unresolved-value finding, status 1. |
| One independent record has an unknown field and another cannot be read because access is denied. | `structure: invalid`, `completion: incomplete`, both findings preserved, status 1. |
| Required evidence cannot be read, and no defect or blocker has been established elsewhere. | `completion: incomplete`, readiness indeterminate when requested, status 2. |
| All mechanical readiness checks pass, including recorded specification approval and separate review. | `satisfied_in_records`, status 0, and all four reviewer obligations retained. |

Before approval, integration must resolve the exact arguments for the approved entry and read-location policies, evidence selection, parser rules including Unicode and duplicate keys, exact command and function signatures, collection traversal order, runtime setup, resource counting and remaining execution bounds, error mapping, and the complete finite mapping from accepted record rules to checks. It must also resolve whether field-order enforcement distinguishes integer-like keys inside unrestricted decision data from workflow objects. The approved format's declared order must not become an unstated sorting rule for arbitrary user data.

The check map must determine the classification and single diagnostic location for every cross-field rule, prevent duplicate generic and specific findings, and define handling of historical project states without importing future lifecycle automation. Every registry entry needs approved cases or an explicit deferred scope. These unresolved integration decisions prevent this proposal from serving as a complete implementation contract on its own.
