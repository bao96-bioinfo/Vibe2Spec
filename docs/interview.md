# Interviewing for informed decisions

The interview converts an intended outcome into explicit choices that a worker can implement. Begin with the outcome, intended users or scientific question, success criteria, available data, and constraints. Resolve questions that affect feasibility or determine later questions before proposing a detailed implementation. Do not adopt the example research topic, conference, model, dataset, or analysis sequence as a default.

For a request such as “I want to publish a paper,” explain that the topic determines the relevant evidence and the target venue determines the intended contribution and submission requirements. Ask for the topic first if the user cannot yet identify a venue. Once that direction is clear, investigate relevant primary publications, available data, competing approaches, and feasible computing and storage requirements. Distinguish observed requirements from estimates and unresolved information.

## Explain before requesting a choice

Each question needs a situation, purpose, understandable options, consequences, and a clear requested selection. Define unfamiliar terms where they first appear. A recommendation needs a reason grounded in the user's task. Use a small common input to expose behavior differences. Show side effects explicitly when returned values alone conceal them. For resource or workflow decisions, explain work and limitations without inventing performance estimates.

Use short, formal sentences. Introduce abbreviations through their full names. Avoid em dashes, bold run-in headings, and procedural lists in explanatory prose. Keep complete explanations when grouping independent settings. A table with short option labels alone is insufficient.

The following questions describe a hypothetical filtering function. The threshold `2` is illustrative. It is not an approved threshold for another project.

### Output order

The function receives `[5, 2, 4, 1]` and keeps values greater than or equal to `2`. We must decide whether retained values keep their original sequence. This matters if their positions correspond to time, source rows, or other aligned information.

| Option | Returned values | Consequence |
| --- | --- | --- |
| Preserve the input order | `[5, 2, 4]` | Each retained value keeps its position relative to the others. The result preserves sequence information. |
| Sort in ascending order | `[2, 4, 5]` | The result is ordered by value. Its positions no longer preserve the source sequence, so related records would need an explicitly specified alignment rule. |

If preserving source sequence matters, preserving input order is the recommended choice. Which order should this function guarantee?

### Repeated values

Repeated values can represent separate observations with the same measurement. For input `[2, 2, 5]`, all three elements meet the illustrative threshold. Removing repeats changes how many observations remain.

| Option | Returned values | Consequence |
| --- | --- | --- |
| Preserve repeated values | `[2, 2, 5]` | Both observations with value `2` remain. Later counts still reflect their multiplicity. |
| Keep only the first occurrence of each value | `[2, 5]` | The result contains distinct values. One observation disappears, so later counts describe unique values rather than the original observations. |

Preserving repeats is recommended when each element represents an observation. Should repeated retained values remain, or should the function return distinct values? Selecting distinct values also requires resolving the equality rule if the accepted input types make equality ambiguous.

### Invalid input

Suppose the intended input is an array of finite numbers, but an element is the string `"3"`. The input `[2, "3", 5]` contains one invalid element. Converting that string, discarding it, and rejecting the operation produce different behavior. A library's conversion rules do not select a policy for this project.

| Option | Observable result | Consequence |
| --- | --- | --- |
| Reject the operation | The function raises the specified error and returns no filtered array. | The caller must correct or explicitly handle the input. Invalid observations remain visible. The exact error type and message still need approval. |
| Discard invalid elements | The function returns `[2, 5]` and follows the approved reporting rule. | The caller receives usable numbers, but one element is lost. The specification must decide whether and how that loss is reported. |
| Accept numeric strings through an explicit conversion | With an approved decimal conversion, the result could be `[2, 3, 5]`. | More input forms are accepted. The specification must define whitespace, empty strings, range limits, and failed conversions before this option is implementable. |

Rejection is recommended when silent loss or conversion would obscure data quality. Which input policy fits the caller's intended use? Resolve any policy-dependent reporting or conversion question individually after this selection.

### Changes to the original input

Mutation means changing the caller's original data. Two functions can return `[2, 5]` while leaving different data for later operations. With original input `[1, 2, 5]`, the distinction is visible only when we also inspect the input after the call.

| Option | Returned result | Original input after the call | Consequence |
| --- | --- | --- | --- |
| Return a new array and leave the input unchanged | `[2, 5]` | `[1, 2, 5]` | Later work can still use every original value. A separate result array must be allocated. |
| Modify the original array and return it | `[2, 5]` | `[2, 5]` | The original array now holds only retained values. Other code referencing that array sees the change. |

Leaving the input unchanged is recommended when other operations may still need the original observations. Should the function preserve the original array, or may it modify that array in the specified way?

### Paired unit validation

Paired validation asks two separate workers to implement this same small function. They receive the same approved specification and saved synthetic inputs. Each output is checked against an approved expected result. Their outputs are also compared directly.

Enabling it adds one bounded implementation and its reviews. Agreement can reveal discrepancies on the selected cases, but it does not prove correctness for every input. Declining it leaves the ordinary correctness checks and separate reviewer in place. Neither choice requires a second full application or real-data experiment. For this small function, pairing is recommended if the extra bounded review work is worthwhile. Should this step include the paired comparison? If yes, approve its unit, fixtures, comparison rules, and resource bounds before implementation.

## Group independent settings without losing context

Output order, repeat handling, and input mutation can be presented together when their stated input domain is already fixed. Retain each explanation and ask the user to select each policy. If the user accepts the order and mutation policies but asks about repeats, record only the first two as accepted. Preserve the repeat decision as unresolved. Do not interpret a partial answer as acceptance of the whole table.

Use an individual question when the answer changes what comes next. A dataset selection determines applicable filtering criteria. A choice to accept numeric strings determines which conversion questions matter. Asking those dependent questions as already settled settings would conceal a decision.

## Research uncertainty

When the user is unsure, investigate relevant primary sources. Record the source locator, title, publication or software version, access time, exact supported claim, location within the source, and limitations. Explain how the finding applies to this project. A reported parameter value can support a recommendation; it cannot authorize that parameter.

If sources conflict, describe the disagreement and its consequence. If evidence cannot be accessed, name the missing evidence and the choice it prevents resolving. Request a source, a supported research capability, or a narrower decision that can be justified with available information. Do not label an inaccessible claim as verified.

## Retain decisions and approval separately

Create one decision record for each independently selectable setting. A selection may be a literal value, an explicitly defined derivation with its approved inputs, or a justified inapplicable setting. A recommendation may be complete but unapproved. Preserve its exact version and obtain an approval record covering only the accepted target paths.

An explanatory example does not supply approval for its threshold, path, method, or budget. An explicit delegation must name its scope and remain traceable to the actual user response. Record the selected concrete settings before implementation. A blank reply, uncertainty, or silence never supplies a decision.
