# An illustrative Vibe2Spec conversation

This example shows the intended interview and review workflow for a small programming task. Vibe2Spec currently provides documents and record templates. The conversation below is fictional. It does not record actual approval, execution, or validation. The partial specification shown here still requires decisions before implementation can begin.

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

> I want a function that keeps numbers above a threshold.

Vibe2Spec:

> A threshold is the value used to decide which numbers qualify. We first need to specify whether a number equal to that threshold qualifies. For example, with a threshold of `2`, the two interpretations produce different results:

| Illustrative input | Interpretation | Expected output |
|---|---|---|
| `[-1, 0, 2, 2, 5]` | Keep numbers greater than or equal to `2`. | `[2, 2, 5]` |
| `[-1, 0, 2, 2, 5]` | Keep numbers strictly greater than `2`. | `[5]` |

> Including the boundary is appropriate when `2` is a qualifying minimum. Excluding it is appropriate when a value must exceed `2`. Which interpretation matches your intended use?

User:

> Include numbers equal to the threshold.

This answer resolves the boundary rule in the fictional conversation. It does not authorize the other choices below. The example threshold of `2` is an illustrative input, not a proposed default threshold.

## Explain independent settings in a grouped review

Vibe2Spec can present the following independent settings together after explaining each one. The user can answer all of them together, answer only some, or request further explanation. A difficult choice receives its own follow-up question. If one answer determines another question, the interview handles that dependency individually.

### Order of the returned values

Vibe2Spec:

> Filtering determines which numbers remain. We also need to decide their order. Preserving input order keeps each retained value in its original relative position. This is useful when position carries meaning, such as the order of observations. Sorting in ascending order places smaller values first, which can make the result easier to inspect. Sorting changes that positional relationship.

| Input and threshold | Choice | Expected output |
|---|---|---|
| `[5, 1, 2, 2]`, threshold `2` | Preserve the original relative order. | `[5, 2, 2]` |
| `[5, 1, 2, 2]`, threshold `2` | Sort retained values in ascending order. | `[2, 2, 5]` |

> Should the returned values preserve their original order, or should they be sorted in ascending order?

### Repeated values

Vibe2Spec:

> Equal values can represent separate observations. Keeping both occurrences preserves their frequency. Returning each distinct value once can be useful when you only need to know which values occur. However, it removes the information that a value appeared more than once. The examples below preserve input order so that only the treatment of repeated values changes.

| Input and threshold | Choice | Expected output |
|---|---|---|
| `[5, 2, 2]`, threshold `2` | Keep every qualifying occurrence. | `[5, 2, 2]` |
| `[5, 2, 2]`, threshold `2` | Keep the first occurrence of each qualifying distinct value. | `[5, 2]` |

> Does each occurrence represent information you need to retain, or do you only need distinct qualifying values?

### Invalid entries

Vibe2Spec:

> An input may contain an entry that the function cannot interpret as a permitted number. Consider `[1, 3, "missing", 5]`. Stopping and reporting the invalid entry makes the data problem visible before a filtered result is used. It requires the caller to correct or handle that problem. Skipping the entry and reporting its removal allows processing to continue. The resulting data contain fewer observations, which can affect later analysis.

| Input and threshold | Choice | Observable outcome |
|---|---|---|
| `[1, 3, "missing", 5]`, threshold `2` | Stop and report the invalid entry. | No filtered result is returned; the report identifies the invalid third entry. |
| `[1, 3, "missing", 5]`, threshold `2` | Skip and report the invalid entry. | The filtered result is `[3, 5]`; the report identifies the discarded third entry. |

> Should invalid entries stop the operation, or should processing continue with a report of the discarded entries? We must subsequently specify permitted input types and the exact reporting interface. This table does not settle those details.

### Changes to the original input

Vibe2Spec:

> Input mutation means changing the array supplied by the caller. Another part of the program may still need that original array. Leaving it unchanged preserves that information. Allowing the function to remove entries directly changes what later code observes. Any claim about memory or speed would require evidence for the selected implementation.

| Original input and threshold | Choice | Returned values | Original array after the call |
|---|---|---|---|
| `[5, 1, 2, 2]`, threshold `2` | Leave the original input unchanged. | `[5, 2, 2]` | `[5, 1, 2, 2]` |
| `[5, 1, 2, 2]`, threshold `2` | Remove excluded entries from the original array. | `[5, 2, 2]` | `[5, 2, 2]` |

> Must the original input remain unchanged? These alternatives return the same values, but their effects on the caller's data differ.

### Independent implementation of this small function

Vibe2Spec:

> We can ask two workers in separate contexts to implement this same small function from the same approved specification. Both receive the same saved synthetic inputs, which are small inputs created specifically for checking behavior. We compare each output with the approved expected output and compare the two outputs directly. This adds implementation and review work. It can reveal differences in how workers interpret the specification, but the selected examples cannot prove correctness for every possible input.

| Saved input and threshold | Worker A | Worker B | Interpretation when the expected output is `[5, 2, 2]` |
|---|---|---|---|
| `[5, 1, 2, 2]`, threshold `2` | `[5, 2, 2]` | `[5, 2, 2]` | Both outputs match the expected values and each other. |
| `[5, 1, 2, 2]`, threshold `2` | `[5]` | `[5]` | The workers agree, but both fail the approved boundary rule. |
| `[5, 1, 2, 2]`, threshold `2` | `[5, 2, 2]` | `[2, 2, 5]` | Worker B fails the approved order rule. |

> Should this step include two independent implementations of the small function? Choosing a single implementation still requires the approved correctness checks. The paired check described here does not involve duplicating an application or training models on real data.

## Record the choices and expose the remaining gaps

Suppose the fictional user selects preserved order, repeated values retained, invalid entries rejected with a report, and unchanged input. Suppose they also choose paired implementation for this unit. The resulting illustrative checks include:

| Input | Threshold | Expected output |
|---|---:|---|
| `[-1, 0, 2, 2, 5]` | `2` | `[2, 2, 5]` |
| `[2]` | `2` | `[2]` |
| `[1]` | `2` | `[]` |
| `[]` | `2` | `[]` |

These selections still leave work for the interview. The programming language, function interface, permitted numerical values, threshold validation, error representation, file locations, execution environment, commands, and comparison rules require explicit decisions. Checks must also cover invalid inputs and changes to the caller's array. The worker cannot fill these gaps silently.

Vibe2Spec would record the complete behavior in the [step specification](../templates/step/spec.md) and [unit contract](../templates/step/unit.json). A unit contract describes the inputs, outputs, and checks for one small implementation unit. The [step contract](../templates/step/contract.json) links the surrounding decisions and execution requirements. The [record format](record-format.md) explains how preserved versions, evidence, and approvals relate to one another.

## Review, accept, and continue

An independent reviewer assesses the complete specification before implementation. The user approves the exact specification version. After the worker prepares code, a separate review checks the actual code, arguments, configuration, and planned commands against that approved version. Unresolved choices block execution.

After the approved run, another independent review examines execution evidence and outputs. Passing checks and reviews allow the user to assess the result. Explicit user acceptance then makes the step finished. Vibe2Spec starts a fresh interview for the next step, whose details remain provisional until that point.

If a later step reveals a necessary correction to completed work, Vibe2Spec explains why progress requires it and lists every affected script and planned modification. The user approves the reopening scope. The affected step repeats specification, review, implementation, validation, and acceptance while preserving its prior accepted version.

[Return to the project README](https://github.com/bao96-bioinfo/Vibe2Spec/blob/main/README.md).
