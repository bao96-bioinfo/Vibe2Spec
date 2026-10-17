# Vibe2Spec interview record

This record preserves requirements and decisions supplied by the user. It supports the OpenSpec proposal interview. It does not authorize implementation or establish that the proposal is complete.

## Product requirements supplied by the user

Vibe2Spec will help developers and researchers turn an initially incomplete request into specific, actionable steps. Its intended distribution is a GitHub repository with a plugin installable through Claude and Codex marketplaces. The research-paper example illustrates the desired interaction; it does not establish a fixed domain or a universal research workflow.

The plugin must identify missing information and actively interview the user. When the user is uncertain, it must gather relevant evidence, explain the alternatives and their advantages and disadvantages, and support an informed decision. Research findings and recommendations do not themselves constitute user decisions. The interview must include practical requirements such as computing resources and cost when relevant to the task.

The plugin must establish an overall plan and then develop comprehensive specifications for each step in sequence. Detailed decisions include inputs, data locations, processing methods, criteria, arguments, outputs, and verification requirements. A worker encountering a missing decision must ask the user. It must not silently choose a value or introduce an unapproved assumption.

Future steps may be refined as the project progresses. A completed step is treated as final. A proposal to modify completed work must explain why the modification is necessary to proceed and identify all planned script modifications. It must not silently rewrite the completed step's specification.

Explanations must be scientific, formal, clear, concise, and organized. Unfamiliar abbreviations and terms must be explained. The proposal must draw on relevant experience from OpenSpec and GitHub Spec Kit while retaining the user's stricter requirements for decisions and completed steps.

## Confirmed interview decisions

| Topic | Accepted decision | Source |
| --- | --- | --- |
| Reproducibility | Independent implementations may have different source code. They must have identical specified behavior and outputs, with explicitly approved numerical tolerances when necessary. | User response beginning “Meaning of ‘same results’” |
| Execution control | The first release uses instruction-based execution control. It tells the worker what it must obey. | User response beginning “I want the first release” |
| Additional reviewer | The first release includes a reviewer that checks for arguments not specified or approved by the user and for choices silently assumed on the user's behalf. | User response beginning “I want the first release” |
| Interview organization | Use grouped review for independent settings. Ask individual questions when a decision is difficult or determines the next question. | User response beginning “I want the first release” |
| Review timing | Review prepared code and configuration before execution. Review execution records and outputs again after results are available. This remains an instruction-based workflow. | User selection “Review before execution and again after results” |
| Step finalization | The specified checks must pass, the reviewer must report no unresolved issues, and the user must explicitly accept the result before the step becomes final and work advances. | User selection “Checks pass, reviewer passes, and user explicitly accepts” |
| Framework dependency | Vibe2Spec is standalone and does not require OpenSpec to be installed. | User selection “Standalone Vibe2Spec; borrow ideas without requiring OpenSpec” |
| OpenSpec adaptation | Adapt OpenSpec's method of writing coding specifications. Strengthen it with the additional constraints needed for equivalent behavior and reproducible results. | User follow-ups beginning “Although we are using” and “Also, the current openspec's spec” |
| Project records | Save readable Markdown documents plus structured decision records and provide validation helpers. | User selection “Readable documents plus structured records and validation helpers” |
| Reviewer independence | Use a separate reviewer context. Request a separate review session when native delegation is unavailable. | User selection “Separate reviewer context; request a separate review session if delegation is unavailable” |
| Helper runtime | Use Node.js and JSON records. | User response selecting “Node.js and JSON records” |
| Diagram support | Include ASCII diagrams to explain the overall step architecture. SpecViz must not be a package dependency. Useful components may be copied or adapted into Vibe2Spec. | User response beginning “For the validation helpers” |
| Writing conventions | Adapt the supplied writing style directly into the plugin's instructions or scripts. Do not ship a separate writing-style bundle. | User response beginning “For the validation helpers” |
| Paired validation policy | Test paired implementations on release examples. Explicitly decide whether to use paired validation for each project step. | User response beginning “Decide explicitly for each project step” |
| Paired validation scope | Compare independent implementations of a function or small unit using the same specification and identical small synthetic inputs. Do not duplicate large code blocks or train on real data for this comparison. | User response beginning “Decide explicitly for each project step” |
| Readiness before implementation | Record the complete relevant behavior and decisions in the approved specification before either worker implements the unit. Unspecified behavior must not be implemented. | User response beginning “Decide explicitly for each project step” |
| Repeated step cycle | Agree on the overall plan, then interview and specify the current step, review its specification, implement and review the work, obtain acceptance, and mark it finished. Repeat this cycle for each subsequent step until all are finished. | User clarification beginning “Also here: what you showed” |
| Reopening completed steps | Keep completed steps closed. A substantial necessary correction requires explicitly reopening the corresponding step and repeating the specification process, including affected decisions, reviews, verification, and acceptance. | User clarification beginning “Also here: what you showed” |
| Step 1 draft history | Drafts may be edited. Preserve every version presented for approval or assessed by a reviewer. | User response beginning “My choices are A. Editable drafts” |
| Step 1 field extensibility | Use fixed workflow fields plus a designated project-settings section. | User response beginning “My choices are A. Editable drafts” |
| Step 1 paired validation | Do not perform paired implementations for this documents-only step. Independent reviews and explicit user acceptance remain required. | User response beginning “My choices are A. Editable drafts” |

## Remaining detailed decisions

The architecture and lifecycle questions presented so far have been answered. The technical design will present implementation conventions for review. Such proposed conventions must remain distinguishable from decisions the user has already accepted. Each future project step must resolve its own values, fixtures, comparison rules, and resource limits before implementation.

## Authoring references supplied by the user

Use `/Users/jingxuan.bao/Downloads/SpecViz/skills/specviz/SKILL.md` to produce this proposal's overview as an ASCII diagram. Use `/Users/jingxuan.bao/Downloads/bioinfo-skills-main/my-writing-style/SKILL.md` for prose. These paths identify authoring references, not runtime prerequisites. The released product must provide its own diagram support and incorporate the writing conventions directly, without requiring either separate package.

## Planning status

The repository has a resolved OpenSpec root and uses the `spec-driven` schema. The active change is `add-vibe2spec-guided-workflow`. Its proposal, six capability specifications, technical design, and sequential task roadmap are drafted for review. This completes the proposal artifact set. It does not approve the proposed engineering conventions or authorize implementation. The current development step still requires its detailed interview, specification, approval, and separate review before code preparation.
