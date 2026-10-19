# Step 2 interface and assessment choices

## Status and fixed constraints

This is an interview draft, not an approved execution specification. The first ten approved policies are recorded in [the policy responses](../decisions/policy-responses-v1.md). They select Node.js built-in modules, JSON and readable reports, small-unit pairing, callable functions with command-line access, read-only helpers, the installed Node.js 26.11.1 with long-term-support compatibility, explicit entry selection, independent finding collection, the record-envelope checker as the paired unit, and standard JavaScript numbers with strict precision-loss checks. The subsequent [runtime and profile responses](../decisions/runtime-profile-responses-v1.md) select exact Node.js 24.22.0 compatibility verification and the ten-value assessment profile. Exact interfaces, fixtures, accounting rules, remaining execution limits, and commands still require specification.

The selected policies and remaining proposals are identified in the corresponding sections. Alternative explanations are retained to make each choice understandable. Examples illustrate consequences; their names, values, reports, and operations do not become implementation requirements through their inclusion here. Numeric behavior explicitly selected by the user is identified separately below.

The accepted [record format](../../../../../../docs/record-format.md) defines the input contract. Validation must preserve its distinctions between drafts, frozen contents, approvals, and readiness. Step 2 cannot change that contract silently. It assesses records and evidence; it does not execute commands recorded inside them, authenticate a person, or establish that a scientific method is sufficiently specified. Those limits apply to the selected interfaces.

## How other components call the helpers

A command-line interface is a program invoked with explicit arguments. A callable library exposes functions that another JavaScript program can import. Both can use the same validation logic, but they create different public interfaces that must be specified and tested.

| Option | Consequences |
| --- | --- |
| A. Callable functions and a command-line interface | Future Claude Code and Codex adapters could import the functions or invoke the command. Tests could assess a function directly. This requires approving function inputs, return values, error behavior, and command behavior, then checking their consistency. |
| B. Command-line interface only | Hosts and tests would invoke a process and inspect its report and exit status. This reduces the public interface initially. Future in-process integration would require an additional approved interface. |

Approved selection: A. Callable functions and the command-line interface use the same validation rules. For an illustrative invalid record, both routes identify the same defect; their transport differs. Exact exported names, arguments, return values, and command syntax remain to be specified. Option B was not selected.

## Whether validation writes files

A read-only validator reads approved inputs and returns findings without changing project files. Producing report text in the calling process is distinct from choosing a destination and saving a report there.

| Option | Consequences |
| --- | --- |
| A. Read-only helpers | The coordinator receives the report and preserves it through a separately authorized operation. Validation cannot overwrite a specification, approval, or earlier report. Saved evidence still needs an explicitly selected destination. |
| B. Helpers can also save reports | A caller supplies an approved output location. The specification must additionally resolve existing-file behavior, interrupted writes, permitted directories, and whether saved report bytes exactly match displayed output. |

Approved selection: A. The helpers return or print reports and do not save report files. For example, an earlier saved report remains untouched. The coordinator may preserve new evidence only under a separately approved writing procedure. Option B was not selected. Automatic record repair, freezing, approval creation, stored-command execution, and lifecycle changes are outside the approved helper behavior.

## Which project revision is assessed

A record graph is the selected record plus the records and supporting files reachable through its explicit references. Historical evidence can remain valid for its original revision while being insufficient for current work.

| Option | Consequences |
| --- | --- |
| A. Explicit entry record and bounded reference traversal | The caller selects the state to assess. The helper follows applicable references within approved paths and resource limits. Unrelated files are not treated as current evidence. The caller must identify the intended entry record. |
| B. Discover records within a directory | The helper first inventories candidate records. This can help locate a project, but requires rules for ignoring unrelated files, identifying possible entry records, and requesting selection when several exist. Discovery alone cannot determine which revision is authoritative. |

Approved selection: A for Step 2. Suppose a directory contains an accepted earlier revision and a later incomplete draft. Combining both indiscriminately could make the draft appear approved by an earlier response. Selecting the later project state and following its exact references exposes the missing current approval. Selecting the earlier state instead assesses that historical state only. Directory discovery was not selected. A path appearing in a record supplies no permission to read an external location; the applicable read locations require explicit approval. Exact location arguments, traversal order, and limits remain to be specified.

## What happens when an assessment cannot finish

An invalid input violates an established rule. An incomplete assessment means some required check could not be completed. Neither supports readiness, but the remedies differ. A wrong digest calls for corrected evidence; an unreadable file calls for resolving access and assessing it again. A missing approval can leave a structurally valid draft unready without making its JSON structure invalid.

The approved reporting policy distinguishes observed defects, unresolved readiness requirements, and checks that could not be completed. It preserves an observed defect even when another branch is inaccessible. These distinctions do not add fields to the accepted records. Exact report names, combinations, ordering, and exit statuses remain undecided.

| Option | Consequences |
| --- | --- |
| A. Collect independent findings | After a broken reference, stop that reference branch and continue checks that do not depend on it, within approved limits. A user can address several independent problems together. Ordering and partial-assessment reporting need exact rules. |
| B. Stop the overall assessment at the first finding | The report is shorter, but correcting one problem can reveal another on the next invocation. Traversal order determines which finding appears first and therefore needs an exact rule. |

Approved selection: A. If one record has an unknown field and an unrelated referenced file is absent, report both when they can be established independently. Do not infer the absent file's contents or report conclusions that require reading it. Resource exhaustion also leaves affected checks incomplete; it never turns them into passes. Stopping the entire assessment at the first finding was not selected.

## How drafts and readiness appear in reports

The accepted format already separates structural validity from readiness. A draft with an explicitly unresolved content field can be structurally valid. A complete frozen record can still lack approval or a passing independent review. No selectable interface can erase those distinctions.

The interface choice is whether to expose separate structure and readiness operations, or one assessment operation with clearly separated results. Separate operations make a focused draft check easy to request, but require callers to know when readiness assessment is needed. A combined operation can show both conclusions together, but must avoid a single ambiguous “valid” result.

Recommendation, unapproved: make both conclusions separately inspectable in the selected report interface. An illustrative report could explain: “The draft uses the declared fields. Its method remains unresolved, and implementation readiness is not established.” Exact command organization and report fields remain open. The helper must also identify obligations reserved for semantic review rather than presenting nonempty prose as evidence of completeness.

## Preserving information during JSON parsing

Ordinary conversion from JSON text to JavaScript values can lose information needed for validation. For example, two occurrences of the same object key can collapse into one retained value. An integer outside the safe numeric range can be rounded. The original text therefore matters before conversion.

The user approved standard JavaScript numbers with strict precision-loss checks. The explanation presented before selection states that `0.1` and `1e-1` are accepted as the same supported value, while `0.10000000000000001` must not silently collapse into `0.1`. Oversized integers, overflow, and underflow must not pass through as converted values. This choice does not approve a comparison tolerance or change the accepted record format. An input outside the helper's numeric support can leave assessment incomplete; a violation of an explicit field bound is structurally invalid. The detailed report proposal distinguishes these outcomes.

Within the approved built-in-module policy, the remaining implementation choice is how to inspect the source text: a narrowly specified preliminary parser followed by standard parsing, or a parser that preserves the relevant tokens and object entries during conversion. Each approach requires specified handling of escaped keys, nested objects, numeric forms, malformed text, and diagnostic locations. Exact token comparison, negative zero, bounds, and fixtures remain to be specified.

Recommendation, unapproved: reject duplicate object keys. Detection must distinguish repeated names in one object from the same name legitimately appearing in separate objects. The parser method, input limits, diagnostic precedence, and exact fixtures require approval before implementation.

## Paired unit and runtime

The approved paired unit is the record-envelope checker, which assesses the common identification fields shared by every record kind. Two independent workers will implement that same small function from the same approved contract and saved synthetic inputs. The twelve record-specific validators will be implemented once. The selected unit's exact interface, expected results, independence evidence, and resource limits remain to be specified.

The approved runtime matrix is Node.js 26.11.1 and 24.22.0 on the current Darwin arm64 host. Compatibility checks and setup procedures remain pending. Selecting these versions does not establish that a second runtime has been installed or that compatibility has been verified.
