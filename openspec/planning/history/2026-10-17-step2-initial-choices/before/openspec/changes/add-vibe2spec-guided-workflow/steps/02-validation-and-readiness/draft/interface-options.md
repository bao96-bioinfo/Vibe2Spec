# Step 2 interface and assessment choices

## Status and fixed constraints

This is an interview draft, not an approved execution specification. The user has approved using only Node.js built-in modules, providing JSON and readable reports, and comparing two independent implementations of one small function. The selected function, fixtures, limits, and exact interfaces still require specification. These policies are recorded in [the Step 2 interview](../../../../../planning/vibe2spec-step-02-interview.md).

Every further recommendation below remains unapproved. Examples illustrate consequences; their names, values, reports, and operations do not become implementation requirements through their inclusion here.

The accepted [record format](../../../../../../docs/record-format.md) defines the input contract. Validation must preserve its distinctions between drafts, frozen contents, approvals, and readiness. Step 2 cannot change that contract silently. It assesses records and evidence; it does not execute commands recorded inside them, authenticate a person, or establish that a scientific method is sufficiently specified. Those limits apply whichever interface is selected.

## How other components call the helpers

A command-line interface is a program invoked with explicit arguments. A callable library exposes functions that another JavaScript program can import. Both can use the same validation logic, but they create different public interfaces that must be specified and tested.

| Option | Consequences |
| --- | --- |
| A. Callable functions and a command-line interface | Future Claude Code and Codex adapters could import the functions or invoke the command. Tests could assess a function directly. This requires approving function inputs, return values, error behavior, and command behavior, then checking their consistency. |
| B. Command-line interface only | Hosts and tests would invoke a process and inspect its report and exit status. This reduces the public interface initially. Future in-process integration would require an additional approved interface. |

Recommendation, unapproved: A, with one shared assessment core. For an illustrative invalid record, both routes should identify the same defect; their transport differs. The choice is whether that direct function interface is useful enough to include in Step 2. Neither option selects exact exported names or arguments.

## Whether validation writes files

A read-only validator reads approved inputs and returns findings without changing project files. Producing report text in the calling process is distinct from choosing a destination and saving a report there.

| Option | Consequences |
| --- | --- |
| A. Read-only helpers | The coordinator receives the report and preserves it through a separately authorized operation. Validation cannot overwrite a specification, approval, or earlier report. Saved evidence still needs an explicitly selected destination. |
| B. Helpers can also save reports | A caller supplies an approved output location. The specification must additionally resolve existing-file behavior, interrupted writes, permitted directories, and whether saved report bytes exactly match displayed output. |

Recommendation, unapproved: A. Report writing would extend the helper's filesystem responsibilities and must be added explicitly if selected. For example, when an earlier report already exists, option A leaves it untouched. Option B is incomplete until the user decides whether the operation refuses, replaces, or creates a separate version. None of these choices authorizes automatic record repair, freezing, approval creation, or lifecycle changes.

## Which project revision is assessed

A record graph is the selected record plus the records and supporting files reachable through its explicit references. Historical evidence can remain valid for its original revision while being insufficient for current work.

| Option | Consequences |
| --- | --- |
| A. Explicit entry record and bounded reference traversal | The caller selects the state to assess. The helper follows applicable references within approved paths and resource limits. Unrelated files are not treated as current evidence. The caller must identify the intended entry record. |
| B. Discover records within a directory | The helper first inventories candidate records. This can help locate a project, but requires rules for ignoring unrelated files, identifying possible entry records, and requesting selection when several exist. Discovery alone cannot determine which revision is authoritative. |

Recommendation, unapproved: A for Step 2. Suppose a directory contains an accepted earlier revision and a later incomplete draft. Combining both indiscriminately could make the draft appear approved by an earlier response. Selecting the later project state and following its exact references exposes the missing current approval. Selecting the earlier state instead assesses that historical state only. Even with option B, authoritative selection and reference identity remain necessary. A path appearing in a record supplies no permission to read an external location.

## What happens when an assessment cannot finish

An invalid input violates an established rule. An incomplete assessment means some required check could not be completed. Neither supports readiness, but the remedies differ. A wrong digest calls for corrected evidence; an unreadable file calls for resolving access and assessing it again. A missing approval can leave a structurally valid draft unready without making its JSON structure invalid.

The proposed reporting approach distinguishes observed defects, unresolved readiness requirements, and checks that could not be completed. It must preserve an observed defect even when another branch is inaccessible. These are proposed report distinctions, not additional record fields. Their exact names, combinations, and exit statuses remain undecided.

| Option | Consequences |
| --- | --- |
| A. Collect independent findings | After a broken reference, stop that reference branch and continue checks that do not depend on it, within approved limits. A user can address several independent problems together. Ordering and partial-assessment reporting need exact rules. |
| B. Stop the overall assessment at the first finding | The report is shorter, but correcting one problem can reveal another on the next invocation. Traversal order determines which finding appears first and therefore needs an exact rule. |

Recommendation, unapproved: A. If one record has an unknown field and an unrelated referenced file is absent, report both when they can be established independently. Do not infer the absent file's contents or report conclusions that require reading it. Resource exhaustion also leaves affected checks incomplete; it never turns them into passes.

## How drafts and readiness appear in reports

The accepted format already separates structural validity from readiness. A draft with an explicitly unresolved content field can be structurally valid. A complete frozen record can still lack approval or a passing independent review. No selectable interface can erase those distinctions.

The interface choice is whether to expose separate structure and readiness operations, or one assessment operation with clearly separated results. Separate operations make a focused draft check easy to request, but require callers to know when readiness assessment is needed. A combined operation can show both conclusions together, but must avoid a single ambiguous “valid” result.

Recommendation, unapproved: make both conclusions separately inspectable in the selected report interface. An illustrative report could explain: “The draft uses the declared fields. Its method remains unresolved, and implementation readiness is not established.” Exact command organization and report fields remain open. The helper must also identify obligations reserved for semantic review rather than presenting nonempty prose as evidence of completeness.

## Preserving information during JSON parsing

Ordinary conversion from JSON text to JavaScript values can lose information needed for validation. For example, two occurrences of the same object key can collapse into one retained value. An integer outside the safe numeric range can be rounded. The original text therefore matters before conversion.

Rejecting silent numeric rounding follows the accepted contract. Within the approved built-in-module policy, the implementation choice is how to inspect the source text: a narrowly specified preliminary parser followed by standard parsing, or a parser that preserves the relevant tokens and object entries during conversion. Each approach requires specified handling of escaped keys, nested objects, numeric forms, malformed text, and diagnostic locations.

Recommendation, unapproved: reject duplicate object keys and detect unsupported numeric tokens before ordinary conversion loses their original form. The detailed method remains for specification. This cannot be delegated to a simple search for repeated words: the same key can legitimately occur in separate objects. Input limits, exact fixtures, failure ordering, and supported numeric representations must be approved before implementation. The separate decision about which small function receives paired implementation remains open.
