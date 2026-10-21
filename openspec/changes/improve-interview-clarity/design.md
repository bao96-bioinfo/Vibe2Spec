# Design

## Context

See proposal.md for the reported problem. The user's current instruction authorizes this correction. Existing autonomous development authorization also permits recommended implementation choices without applying the product's approval workflow to its development.

## Goals / Non-Goals

The conversation will separate what the user needs to understand now from the complete contract the agent must eventually record. This change does not relax approvals, review independence, reproducibility, or completed-step protection. It does not change the accepted record format or install external packages.

## Decisions

Keep the coordinator's essential conversation policy short and expand examples in docs/interview.md. Amend authoring guidance to make its comprehensive table an internal coverage aid. Update the public illustrative conversation and README so they model sequential unfamiliar choices and familiar grouped review.

Use independently assessed multi-turn fixtures with stimuli separated from expectations. Retain the old forward responses unchanged. Correct the old review's unsupported clarity claim through an explicit later assessment note. New evidence identifies exact instruction content and simulated status. Static tests validate fixture consistency; an independent agent assesses actual generated responses using the rubric. Neither substitutes for a real user study.

Rebuild plugins/vibe2spec through the existing assembler. Source runtime code, marketplace identities, and version remain unchanged for this working-tree correction. No external publication or installation is required to verify text behavior and packaged resource parity.

The user subsequently supplied Friendly Technical Explainer. Adapt it in docs/friendly-explanations.md and route explanatory work there from the coordinator, worker, and reviewer. Its bold answer sentences, short sections, and labeled lists govern user-facing explanations. Formal specification artifacts retain their own templates. Use onboarding structure and vocabulary only when needed for the current concept, preserving one unfamiliar decision at a time. Analogies must retain accurate definitions and numbers must be interpreted against known scales or criteria, never invented standards of success. A separate explanation corpus and held-out rubric extend the existing evaluation without rewriting earlier evidence.

Use a private pre-send review for human purpose, short paragraphs, list labels, and necessary tables. Draft one or two sentences per paragraph to leave room within the three-sentence ceiling, and count citation-only sentences too. Exported decision states distinguish unanswered settings from pending approvals. Preserve every failed response and evaluate focused retests as new evidence; a passing retest does not erase an earlier failure or establish general reliability.

## Risks / Trade-offs

More short turns can increase conversation length. Familiar independent settings may still be grouped, and applicable approved answers are reused. Agent evaluations can share model biases; report them as bounded behavioral evidence and retain failed cases. Conversational simplification can hide assumptions; assess precise decision states and unresolved settings alongside readability.

## Verification

Run independent forward responses on the revised policy and retain assessment findings. Run the fixture tests and existing full suite on installed Node.js 26.11.1 and the retained Node.js 24.22.0 runtime. Validate the skill and OpenSpec change, rebuild the package, and inspect the final diff. Tests must not claim readability from wording matches.
