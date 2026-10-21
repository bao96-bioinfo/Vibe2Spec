# An illustrative Vibe2Spec conversation

This example shows the intended interview and review workflow for a small programming task. The conversation below is fictional. It does not record actual approval, execution, or validation. The partial specification shown here still requires decisions before implementation can begin. Each unfamiliar decision has its own exchange; the sections are not one questionnaire.

The user wants a function that retains numbers above a threshold. Even this small request leaves several observable behaviors unspecified. Vibe2Spec explains those choices, records the user's decisions, and prepares the current step for independent review.

```text
"Keep numbers above a threshold."
                 |
                 v
      Explain the unresolved choices
                 |
                 v
      User selects the intended behavior
                 |
                 v
      Complete and review the specification
                 |
                 v
      Implement, review, and run approved work
                 |
                 v
      Check outputs and obtain user acceptance
                 |
                 v
      Finish this step; interview for the next
```

## Clarify the boundary before asking dependent questions

User:

> I want a function that keeps numbers above a threshold. The values are measurements collected in time order. Each entry is a separate observation, and a later calculation uses the original data.

Vibe2Spec:

> A threshold is the value used to decide which numbers qualify. We first need to specify whether a number equal to that threshold qualifies. For example, with a threshold of `2`, the two interpretations produce different results:

| Illustrative input | Interpretation | Expected output |
|---|---|---|
| `[-1, 0, 2, 2, 5]` | Keep numbers greater than or equal to `2`. | `[2, 2, 5]` |
| `[-1, 0, 2, 2, 5]` | Keep numbers strictly greater than `2`. | `[5]` |

> Including the boundary is appropriate when `2` is a qualifying minimum. Excluding it is appropriate when a value must exceed `2`.
>
> I need your intended meaning before recommending a rule for this task. Which interpretation matches your intended use?

User:

> Include numbers equal to the threshold.

This answer resolves the boundary rule in the fictional conversation. It does not authorize the other choices below. The example threshold of `2` is an illustrative input, not a proposed default threshold.

## Explain unfamiliar settings individually

Vibe2Spec reuses the selected inclusive boundary. It does not ask the user to choose it again. The following exchanges introduce the remaining unfamiliar settings separately. Once the user understands independent options, they can request a grouped review. A question whose answer determines the next question remains individual.

### Order of the returned values

Vibe2Spec:

> Filtering determines which numbers remain. We also need to decide their order.
>
> Preserving input order keeps each retained value in its original relative position. This is useful when position carries meaning, such as the order of observations.
>
> Sorting in ascending order places smaller values first, which can make the result easier to inspect. Sorting changes that positional relationship.

| Input and threshold | Choice | Expected output |
|---|---|---|
| `[5, 1, 2, 2]`, threshold `2` | Preserve the original relative order. | `[5, 2, 2]` |
| `[5, 1, 2, 2]`, threshold `2` | Sort retained values in ascending order. | `[2, 2, 5]` |

> Your measurements were collected in time order, so I recommend keeping that sequence available for later analysis. Should the returned values preserve that order?

User:

> I understand the difference. Leave this choice open so I can review it together with the original-data setting once I understand that too.

The order choice remains unresolved. The user has explicitly deferred it, so the conversation can introduce the next unfamiliar setting.

### Repeated values

Vibe2Spec:

> Equal values can represent separate observations. Keeping both occurrences preserves their frequency.
>
> Returning each distinct value once can be useful when you only need to know which values occur. However, it removes the information that a value appeared more than once.
>
> **Why do this?** The examples below preserve input order so that only the treatment of repeated values changes.

| Input and threshold | Choice | Expected output |
|---|---|---|
| `[5, 2, 2]`, threshold `2` | Keep every qualifying occurrence. | `[5, 2, 2]` |
| `[5, 2, 2]`, threshold `2` | Keep the first occurrence of each qualifying distinct value. | `[5, 2]` |

> You said that each entry is a separate observation. I recommend keeping both measurements so later counts still include both observations. Should repeated measurements remain?

User:

> I still do not understand why two identical values are different observations.

Vibe2Spec:

> **They are separate observations because they were collected at different times.**
>
> Suppose the instrument recorded `2` at 09:00 and another `2` at 09:01. Keeping both counts two observations; keeping the value only once counts one and loses a reading.
>
> I recommend keeping both so neither reading disappears. Should both readings remain in the result?

User:

> Yes. Keep both readings even when their values match.

Vibe2Spec records retention of repeated observations. This answer does not select an ordering policy or a numerical cutoff. The new example repairs the confusing distinction without introducing another decision.

### Invalid entries

Vibe2Spec:

> **The Goal:** “How should filtering handle a reading that is not a permitted number?”
>
> An input may contain an entry that the function cannot interpret as a permitted number. Consider `[1, 3, "missing", 5]`.
>
> Stopping and reporting the invalid entry makes the data problem visible before a filtered result is used. It requires the caller to correct or handle that problem.
>
> Skipping the entry and reporting its removal allows processing to continue. The resulting data contain fewer observations, which can affect later analysis.

| Input and threshold | Choice | Observable outcome |
|---|---|---|
| `[1, 3, "missing", 5]`, threshold `2` | Stop and report the invalid entry. | No filtered result is returned; the report identifies the invalid third entry. |
| `[1, 3, "missing", 5]`, threshold `2` | Skip and report the invalid entry. | The filtered result is `[3, 5]`; the report identifies the discarded third entry. |

> Because each entry represents an observation in your analysis, I recommend stopping so an invalid reading can be corrected before the result is used. Should an invalid entry stop the operation, or should processing continue with a report of discarded entries?

User:

> Stop the operation and tell the caller that an entry is invalid.

The agent retains permitted input types and the exact reporting interface as later questions. This initial selection does not settle those details.

### Changes to the original input

User:

> Both options seem to return the same numbers. Does it matter which one we use?

Vibe2Spec:

> **Yes, because changing the original array would remove measurements that your later calculation needs.**
>
> **The Goal:** “Will the original observations still be available after filtering?”
>
> Changing the original data is called *input mutation*. Returning a new result leaves the original measurements available; removing entries from the original array changes what later code receives.

| Original input and threshold | Choice | Returned values | Original array after the call |
|---|---|---|---|
| `[5, 1, 2, 2]`, threshold `2` | Leave the original input unchanged. | `[5, 2, 2]` | `[5, 1, 2, 2]` |
| `[5, 1, 2, 2]`, threshold `2` | Remove excluded entries from the original array. | `[5, 2, 2]` | `[5, 2, 2]` |

> Your later calculation needs the original measurements, so I recommend returning a new array and leaving the original unchanged. Should the function preserve the original data this way?

### Group settings once their consequences are understood

User:

> I understand the order and original-data choices now. Please show your recommendations together before I select them.

Vibe2Spec:

| Setting | Proposed behavior and consequence |
|---|---|
| Order | Keep the retained measurements in collection order so their sequence remains available. |
| Original data | Return a separate result and keep the original measurements available for your later calculation. |

> These choices are independent. Should I record both recommendations, or would you like a different behavior for either one?

User:

> Record both.

Vibe2Spec records those two choices separately. It also retains the earlier approval to keep repeated observations. A partial answer would leave only the unanswered item pending; repeating the entire interview is unnecessary.

### Independent implementation of this small function

Vibe2Spec:

> **The Goal:** “Do two independent implementations produce the results required by the same written rules?”
>
> We can ask two workers in separate contexts to implement this same small function from the same approved specification. Both receive the same saved synthetic inputs, which are small inputs created specifically for checking behavior. We compare each output with the approved expected output and compare the two outputs directly.
>
> **Why do this?** Using identical inputs keeps a change in the input from explaining a difference in the outputs. Checking the expected output also catches cases where both workers make the same mistake.
>
> This adds implementation and review work. It can reveal differences in how workers interpret the specification, but the selected examples cannot prove correctness for every possible input.

| Saved input and threshold | Worker A | Worker B | Interpretation when the expected output is `[5, 2, 2]` |
|---|---|---|---|
| `[5, 1, 2, 2]`, threshold `2` | `[5, 2, 2]` | `[5, 2, 2]` | Both outputs match the expected values and each other. |
| `[5, 1, 2, 2]`, threshold `2` | `[5]` | `[5]` | The workers agree, but both fail the approved boundary rule. |
| `[5, 1, 2, 2]`, threshold `2` | `[5, 2, 2]` | `[2, 2, 5]` | Worker B fails the approved order rule. |

> This function decides which observations enter your analysis. I recommend the additional implementation to check that the same written rules produce the same retained observations on these small examples. Should this step include that check?
>
> Choosing a single implementation still requires the approved correctness checks and separate review. This check does not duplicate an application or train models on real data.

## Record the choices and expose the remaining gaps

Suppose the fictional user selects preserved order, repeated values retained, invalid entries rejected with a report, and unchanged input. Suppose they also choose paired implementation for this unit. The resulting illustrative checks include:

| Input | Threshold | Expected output |
|---|---:|---|
| `[-1, 0, 2, 2, 5]` | `2` | `[2, 2, 5]` |
| `[2]` | `2` | `[2]` |
| `[1]` | `2` | `[]` |
| `[]` | `2` | `[]` |

These selections still leave work for the interview. The agent's internal checklist includes the programming language, interface, permitted numerical values, threshold validation, error representation, locations, environment, commands, and comparison rules. Checks must also cover invalid inputs and changes to the caller's array. The agent resolves each remaining gap from applicable approved context or a focused question. It does not present this checklist as one request to the user. The worker cannot fill the gaps silently.

Vibe2Spec would record the complete behavior in the [step specification](../templates/step/spec.md) and [unit contract](../templates/step/unit.json). A unit contract describes the inputs, outputs, and checks for one small implementation unit. The [step contract](../templates/step/contract.json) links the surrounding decisions and execution requirements. The [record format](record-format.md) explains how preserved versions, evidence, and approvals relate to one another.

## Review, accept, and continue

An independent reviewer assesses the complete specification before implementation. The user approves the exact specification version. After the worker prepares code, a separate review checks the actual code, arguments, configuration, and planned commands against that approved version. Unresolved choices block execution.

After the approved run, another independent review examines execution evidence and outputs. Passing checks and reviews allow the user to assess the result. Explicit user acceptance then makes the step finished. Vibe2Spec starts a fresh interview for the next step, whose details remain provisional until that point.

If a later step reveals a necessary correction to completed work, Vibe2Spec explains why progress requires it and lists every affected script and planned modification. The user approves the reopening scope. The affected step repeats specification, review, implementation, validation, and acceptance while preserving its prior accepted version.

[Return to the project README](https://github.com/bao96-bioinfo/Vibe2Spec/blob/main/README.md).
