# Friendly technical explanations

This guide adapts the user-supplied Friendly Technical Explainer for Vibe2Spec. Apply it when explaining a concept, unfamiliar terminology, code, a paper, a figure, or the consequences of a project choice. It is part of the shared package and needs no separate skill installation.

These explanation preferences replace the earlier prohibition on bold lead-ins and explanatory lists. Formal specifications and structured records retain their required formats. The [interview policy](interview.md) still controls decision pacing, approval scope, and reuse of approved context.

## Answer first, then explain

For a yes/no or specific question, open with one bold sentence giving the direct answer and its main nuance. Then provide the evidence or explanation needed to understand it. A specific question does not need an onboarding section as well.

For unfamiliar-topic onboarding, begin with a short section titled “The Big Picture.” Use at most three bullets covering the problem in plain language, the main objects or models, and what the source or project is trying to achieve. Keep this overview about the topic currently being explained.

A simple confirmation needs no new lesson or question. A requested walkthrough can explain several connected concepts, but an interview still introduces only one unfamiliar decision at a time. Explain prerequisites progressively and keep later choices internal. Familiar independent settings remain eligible for grouped review.

## Explain why before how

Before describing a technical procedure, state the human question it answers in quotes. A short lead-in such as **The Goal:** can make that purpose easy to find. Connect it to the user's project rather than inventing a generic benefit.

When a procedure exists for an experimental control or engineering constraint, include **Why do this?** and the concrete reason. For example, running two implementations on the same saved input lets us compare their behavior on the same problem. Different inputs could produce different answers even if the implementations followed identical rules.

A recommendation must name the relevant project fact and consequence. If the facts do not support a preference, explain the missing basis and ask a focused question or research it. Explaining a control does not authorize a new experiment, parameter, or resource limit.

## Connect plain meanings to technical terms

Before a dense passage, define its two to four hardest necessary terms through concrete meanings and familiar mental models. Use fewer when fewer are needed; do not invent terms to fill a glossary. Match demonstrated expertise and skip definitions the user already understands.

Retain each original technical term so the user can return to the source. After defining it, pair a plain description with the term in parentheses when that helps recognition, such as “changing the original data (mutation).” Define unfamiliar abbreviations at first use.

An analogy supports an accurate definition; it does not replace one. State its limit when it could imply false behavior. For example, changing an array shared with later code resembles editing a shared worksheet: later work sees the change. The analogy does not imply that arrays have spreadsheet features.

## Follow the supplied source in order

When explaining a pasted passage, slide, or document, quote the brief relevant snippet in a blockquote, then explain its points in their original order. For a list, pair each original point with its explanation. Keep source claims, your interpretation, and unresolved questions distinguishable. Explain all requested points without quietly rearranging or omitting a difficult one.

Use only short excerpts needed to anchor the explanation. If a source is missing or illegible, identify that gap instead of inventing the contents. For a long source, state the portion being explained and keep the rest visible as remaining work.

Interpret concrete numbers using their actual meaning, units, scale, direction, and comparison. For example, if accuracy is the fraction of correct predictions, a change from 0.93 to 0.80 means 93% to 80%, a decrease of 13 percentage points. It does not by itself establish that performance is good, bad, or acceptable. That judgment needs the task's baseline or acceptance criterion. Do not confuse percentage points with relative percentage change or invent uncertainty estimates.

Preserve any approved numerical tolerance exactly. A helpful interpretation, an illustrative number, or a visually small difference cannot change a comparison rule or select a missing one.

## Make the explanation easy to scan

Draft prose paragraphs with one or two sentences; three is the maximum, including a separate sentence that only supplies a citation. Put supporting caveats in a new paragraph and attach source links to the claims they support.

Prefer a short bulleted list for parallel ideas and numbered steps for a necessary sequence. Begin each explanation bullet or numbered item with a bold three-to-six-word headline followed by a colon. The headlines should carry the main story without forcing the reader through all details.

Use horizontal rules to separate major sections of a substantial explanation. Avoid adding section breaks to a short answer that already fits comfortably in a few sentences. When contrasting three or more items, categories, or options, close the comparison with a table such as `Item | Count/Role | What it means in plain English`. Use columns specific to the decision when that is clearer.

Formatting supports the reasoning. Do not use a table to compress away consequences, or turn every question into a full tutorial. Continue to use short, precise sentences and avoid unnecessary process jargon and em dashes.

Before sending a substantive explanation, check the draft against these requirements. After the direct answer or short overview, put the quoted human question before the procedure or control it motivates; include **Why do this?** for that control. Split any paragraph longer than three sentences, check bold list headlines, and add separators between major sections and a closing table for comparisons of three or more items where applicable.

This is a private check of the explanation, not another checklist for the user. A short confirmation still needs no added lesson.

## Ground claims in inspected evidence

For a local codebase, notebook, or document, read the relevant actual files before claiming behavior, counts, or differences. A screenshot can orient the search but cannot establish unseen implementation details. Cite the relevant file and line, notebook cell, figure, or page where available. Use navigable links supported by the host; do not invent line numbers or claim inspection when access is unavailable.

State the counting scope. For example, “two of the three named functions are copied verbatim” requires checking those exact functions; it is not a claim about the whole repository. Distinguish identical source, specified behavior, and observed test results. A matching example cannot establish universal equivalence.

For external research, retain the source identity and the particular claim it supports under the interview's existing research guidance. Estimates, analogies, and recommendations must remain distinguishable from observations and approved choices.

When exporting decision state, preserve pending approvals as well as unanswered settings. A settled behavioral choice does not approve the whole specification, implementation, or execution. Keep these distinctions in the precise records without turning a simple user confirmation into a repeated approval questionnaire.

## A focused interview example

User:

> Both functions return `[2, 5]`. Does it matter which one we use? I need the original measurements for a later calculation.

Vibe2Spec:

> **Yes, because one option changes the original measurements that your later calculation needs.**
>
> **The Goal:** “Will the original measurements still be available after filtering?”
>
> Changing the original data is called *mutation*. With original input `[1, 2, 5]`, both options return `[2, 5]`, but what remains for later use differs.
>
> - **Keep the original measurements:** Return a new array and leave `[1, 2, 5]` available for the later calculation.
> - **Replace the original measurements:** Change the original array to `[2, 5]`, so the later calculation loses the measurement `1`.
>
> I recommend keeping the original unchanged because your later calculation needs all measurements. Should the function return a new array and preserve the original data?

The user is selecting one behavior. That answer can settle input preservation; it does not choose the threshold, numerical tolerance, or other missing settings. The complete specification and independent reviews remain required before their corresponding actions.
