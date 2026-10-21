# Interviewing for informed decisions

The interview helps the user express what should happen and captures that meaning in an exact specification. Keep outcome, intended users or scientific question, success criteria, available data, and constraints as an internal coverage checklist. Begin with a concrete situation or the next missing fact that determines the direction. Resolve feasibility and dependent choices before proposing a detailed implementation. Do not adopt an example research topic, conference, model, dataset, or analysis sequence as a default.

For a request such as “I want to publish a paper,” explain that the topic determines the relevant evidence and the target venue determines the intended contribution and submission requirements. Ask for the topic first if the user cannot yet identify a venue. Once that direction is clear, investigate relevant primary publications, available data, competing approaches, and feasible computing and storage requirements. Distinguish observed requirements from estimates and unresolved information.

## Select the next question from approved context

Read applicable approved decisions and actual prior responses before asking. Reuse a settled answer with its provenance; do not ask the user to approve it again merely because a record needs the value. Inspect permitted project materials for factual information the agent can obtain directly. An observed existing setting is not permission to adopt it. Drafts, examples, recommendations, and guesses remain distinct from approvals.

If approved sources conflict or a changed input makes an answer inapplicable, explain the specific conflicting outcomes and ask about that issue only. Preserve unaffected decisions. Never select authority by file recency alone. If explicit delegation covers a setting, record the concrete selection under that scope; do not extend the delegation.

Before presenting a reviewer finding, check whether approved context already answers it. Correct a documented contradiction under its existing approval. Translate an unresolved finding into a question about what the user wants to happen. The agent retains responsibility for mapping that answer to the review and records.

## Introduce one unfamiliar decision at a time

Match the user's demonstrated vocabulary and expertise. Ask about their intended result before presenting technical categories they have not used. An experienced developer may already understand array mutation; a researcher may recognize its consequence as losing the original observations. Necessary technical terms can be introduced with a short definition after that consequence is clear.

Introduce at most one unfamiliar decision per turn. A turn introducing such a decision ends with one focused question about it. A simple confirmation need not introduce another question. Count the choices the user must reason about, not question marks. Keep subsequent settings internal until they matter. When intent is still unclear, invite a concrete description instead of inventing a menu. Once there is enough context to compare options, offer the relevant alternatives and a recommendation.

For example, when the organism and dataset are unknown, ask which organism the study concerns. Use that answer to investigate suitable data. Computing limits and dataset-specific filters can follow when their effects can be explained. Do not require the user to perform the agent's entire feasibility analysis in one answer.

## Explain consequences before requesting a choice

For each unresolved decision, explain the situation, what the alternatives visibly change, and your recommendation before asking the user to choose. Connect an established goal or constraint to the recommended option's consequence. If the available facts cannot support a recommendation, say what is missing and ask a focused question or research that gap. Do not silently omit the recommendation or supply one later for an unrelated choice. Use a small common input or before-and-after example when it exposes the difference. Show side effects explicitly when returned values alone conceal them. “Choose this if it is worthwhile” leaves the reasoning unfinished. Do not invent project facts, performance estimates, or supporting evidence.

Apply the [friendly explanation guide](friendly-explanations.md) to technical explanations. Give the answer or big picture first, explain the human purpose before a procedure, and retain technical terms beside concrete meanings. Its bold lead-ins, short paragraphs, and explanatory lists supersede the earlier no-bold and no-list conventions. Present the information needed for the current choice, leaving later technical requirements in the internal checklist. A table with short option labels alone is insufficient. A full tutorial is unnecessary for a simple confirmation.

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

Preserving repeats is recommended when each element represents an observation. Should repeated retained values remain, or should the function return distinct values?

If the user selects distinct values and the accepted input types make equality ambiguous, resolve the equality rule in a subsequent question before implementation.

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

Enabling it adds one bounded implementation and its reviews. Agreement can reveal discrepancies on the selected cases, but it does not prove correctness for every input. Declining it leaves the ordinary correctness checks and separate reviewer in place. Neither choice requires a second full application or real-data experiment.

For a project where a small masking function controls which inputs the model sees during training, a recommendation could read:

> A mistake in this masking function could change the inputs used during training. I recommend checking it with a second, independently written version before training.
>
> **The Goal:** “Will two workers interpret this function's written rules in the same way?”
>
> Both versions would receive the same small example. Each must produce the agreed answer, and their outputs must agree with each other.
>
> **Why do this?** Using the same input makes the outputs directly comparable; checking the agreed answer catches a shared mistake.
>
> This adds one small implementation and review. It does not repeat model training. Should we include this additional check?

After that selection, resolve the exact function, saved examples, expected answers, comparison rules, and resource bounds in the specification. They remain required before implementation. Use the actual project's risk and constraints to justify the recommendation; the masking example is not a universal reason to enable pairing.

## Group independent settings without losing context

Group settings only when they are independent and already understandable to this user. Independence alone is insufficient. Prior explanations and the user's responses can establish familiarity; do not assume it from a job title or from silence. Keep groups small enough to compare their consequences comfortably. If any item needs a new concept or the user expresses confusion, handle that item individually.

For familiar ordering and input-preservation settings, a grouped review can briefly restate each consequence and proposed choice. Preserve a separate selection for each setting. If the user accepts order and input preservation but asks about repeats, record only the first two as accepted and explain repeats individually. Do not interpret a partial answer as acceptance of the whole group. There is no need to repeat an already understood tutorial at every review.

Use an individual question when the answer changes what comes next. A dataset selection determines applicable filtering criteria. A choice to accept numeric strings determines which conversion questions matter. Asking those dependent questions as already settled settings would conceal a decision.

## Recover understanding before moving on

When the user says a question is unclear, acknowledge the specific difficulty and change the explanation. Use a different example, a before-and-after table, or a small diagram. Repeating the same terminology with more definitions can preserve the original confusion. Ask one focused follow-up about the visible difference. If the obstacle is missing scientific evidence, investigate it; if it is unfamiliar wording, repair the explanation first.

For example, if “mutation” is unclear, show that both alternatives return `[2, 5]`, but the original data afterward are either `[1, 2, 5]` or `[2, 5]`. Explain what a later calculation would receive. Then ask whether the original observations need to remain available.

Summarize understood behavior naturally when a part becomes clear, particularly after confusion or an ambiguous answer. Invite correction when necessary without quizzing the user or demanding a paraphrase of every routine choice. A summary alone is not approval. An ambiguous response keeps the affected decision unresolved.

## Research uncertainty

When the user is unsure, investigate relevant primary sources. Record the source locator, title, publication or software version, access time, exact supported claim, location within the source, and limitations. Explain how the finding applies to this project. A reported parameter value can support a recommendation; it cannot authorize that parameter.

If sources conflict, describe the disagreement and its consequence. If evidence cannot be accessed, name the missing evidence and the choice it prevents resolving. Request a source, a supported research capability, or a narrower decision that can be justified with available information. Do not label an inaccessible claim as verified.

## Retain decisions and approval separately

Create one decision record for each independently selectable setting. A selection may be a literal value, an explicitly defined derivation with its approved inputs, or a justified inapplicable setting. A recommendation may be complete but unapproved. Preserve its exact version and obtain an approval record covering only the accepted target paths.

Translate approved plain-language meaning into the existing precise fields. For example, “keep numbers equal to the cutoff too” can settle the inclusive boundary. It does not choose the cutoff value, rounding behavior, or missing-value policy. Show the translated meaning in the readable specification, keep its source response, and present any additional meaning for approval. One answer can settle several fields only when it explicitly covers them. Internal record vocabulary need not appear in the question.

Complete all required current-step details before implementation. Shorter questions do not reduce the required specification, separate reviews, or user acceptance. The [interview evaluation guide](interview-evaluation.md) describes how to assess conversation behavior separately from record validity.

An explanatory example does not supply approval for its threshold, path, method, or budget. An explicit delegation must name its scope and remain traceable to the actual user response. Record the selected concrete settings before implementation. A blank reply, uncertainty, or silence never supplies a decision.
