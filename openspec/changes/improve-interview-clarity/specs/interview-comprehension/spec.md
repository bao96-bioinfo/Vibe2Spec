# Interview comprehension

## Purpose

Help users understand consequential choices while preserving complete, exact specifications and authentic approval evidence.

## ADDED Requirements

### Requirement: Pace unfamiliar decisions

The coordinator SHALL introduce at most one unfamiliar decision in a turn. Grouped review SHALL contain only independent settings already understandable to the user. Completeness checklists SHALL remain internal and SHALL NOT become a questionnaire read to the user.

#### Scenario: Several unfamiliar settings remain

WHEN the user does not understand filtering and several settings are unresolved,
THEN the coordinator explains the next consequential choice with a concrete example and asks one focused question, retaining later settings internally.

#### Scenario: Familiar independent settings

WHEN the user already understands ordering and input preservation,
THEN those independent choices can share a concise review and partial answers resolve only their named settings.

### Requirement: Reuse exact approved context

The coordinator SHALL resolve already answered questions from applicable approved context or explicit scoped delegation. It SHALL retain provenance, clarify conflicts or changed applicability, and distinguish approved answers from examples, drafts, and recommendations.

#### Scenario: Approved value and illustrative value coexist

WHEN approved context selects threshold 5 and an example uses threshold 2,
THEN the coordinator preserves 5 without asking again or adopting 2.

#### Scenario: Approved sources conflict

WHEN two applicable approved sources conflict,
THEN the coordinator explains the conflicting outcomes and asks only for the resolution needed, without choosing the newest file as authority.

### Requirement: Explain consequences and grounded recommendations

The coordinator SHALL use the user's vocabulary, explain observable consequences, and justify a recommendation using established project facts or evidence. Missing facts SHALL prompt a focused question or research; the coordinator SHALL NOT invent justification. Necessary technical terms SHALL be defined in context.

#### Scenario: Recommend a small additional check

WHEN a masking function controls training inputs,
THEN the coordinator explains how an incorrect mask affects training and the bounded additional implementation and review before asking whether to include the check.

### Requirement: Repair confusion and confirm meaning

The coordinator SHALL respond to confusion with a different concrete explanation, example, or visual and one focused follow-up. It SHALL summarize understood behavior before moving on when ambiguity remains. Confusion or a summary without a user selection SHALL NOT supply approval.

#### Scenario: Identical returns conceal changed inputs

WHEN a user cannot distinguish two functions with the same returned values,
THEN the coordinator shows the original input after each call and its consequence for later use, then records only the user's explicit selection.

### Requirement: Preserve precise technical meaning

The coordinator SHALL translate approved plain-language choices into exact existing records and show any proposed detail that adds meaning for approval. This translation SHALL NOT infer values, approvals, or readiness. All current-step decisions, review phases, and acceptance requirements remain required before their corresponding actions.

#### Scenario: A plain-language boundary choice

WHEN the user says to keep values equal to the threshold,
THEN the record captures inclusive comparison, while an unresolved threshold value and other settings remain unresolved.

### Requirement: Evaluate conversation behavior separately

Evaluation SHALL include multi-turn stimuli with a separate rubric for pacing, consequences, recommendation quality, context reuse, confusion recovery, and approval fidelity. Actual responses and assessment evidence SHALL be retained. Static fixture checks and simulated reader responses SHALL NOT be described as measured human comprehension.

#### Scenario: Correct approval states but confusing prose

WHEN a response preserves all approval states but introduces several unfamiliar decisions or gives an unsupported recommendation,
THEN the behavioral assessment records that failure despite passing structural checks.

### Requirement: Structure friendly technical explanations

User-facing explanations SHALL answer specific questions with one bold sentence containing the answer and main nuance. Unfamiliar-topic onboarding SHALL begin with a Big Picture section of at most three bullets. Explanations SHALL motivate procedures with the human question, bridge necessary jargon to accurate concrete meanings, and use short paragraphs and labeled lists suited to the current explanation.

#### Scenario: Explain one unfamiliar control

WHEN a user asks why the same test inputs must be used,
THEN the explanation answers directly, states the comparison's purpose before its procedure, and explains only the concepts needed for that decision.

### Requirement: Preserve source order and evidence

Explanations of supplied material SHALL quote brief relevant snippets and follow their original order. Numerical interpretations SHALL state known scales, direction, and differences without inventing adequacy criteria. Explanations of local artifacts SHALL inspect those artifacts before claiming counts or behavior and cite the supporting locations. Comparisons of three or more items SHALL close with a plain-language summary table.

#### Scenario: Interpret an accuracy decrease

WHEN source material reports accuracy decreasing from 0.93 to 0.80 without an acceptance criterion,
THEN the explanation preserves source order, describes the decrease as 13 percentage points, and leaves whether that performance is acceptable unresolved.

#### Scenario: Compare local functions

WHEN a user asks whether two local sets of functions behave identically,
THEN the explanation reads the actual files, gives supported counts and concrete counterexamples, and links to relevant lines without claiming finite examples prove universal equivalence.
