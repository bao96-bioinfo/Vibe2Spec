# Proposal

## Why

An incomplete request leaves implementation choices to an agent, which can introduce assumptions that the user never accepted. Vibe2Spec will convert developer and researcher requests into explicit, reviewed step specifications so independent workers can produce the same specified behavior and outputs.

## What Changes

- Introduce an active interview that identifies missing decisions, gathers relevant evidence, and explains alternatives and practical requirements. Before requesting a decision, explain the situation, why the choice matters, unfamiliar terms, and each option's concrete consequences and trade-offs. Use small shared examples with expected outputs for behavior choices, and relevant resource or workflow examples for other choices. Group independent settings while retaining enough explanation for each. Ask individual questions when a choice is difficult or determines the next question.
- Preserve the distinction between evidence, recommendations, unresolved choices, and user-approved decisions. A recommendation, omitted answer, or implicit library default must not supply approval.
- Establish a project-specific overview, then repeat the full interview, specification review, implementation, work review, and acceptance cycle for each step. Each actionable step must define its inputs, processing rules, arguments, outputs, and acceptance criteria. Future steps remain provisional until they become current.
- Require a complete approved specification before a worker prepares implementation code. Guide the worker through that specification and require it to stop when it discovers an uncovered choice. Use instruction-based execution control in the first release.
- Add a separate specification review before implementation, a review of prepared code and configuration before execution, and a review after results. Review must detect unapproved arguments, effective defaults, and assumptions. The reviewer must report unresolved decisions to the user.
- Finalize a step only after its specified checks pass, the reviewer reports no unresolved issues, and the user explicitly accepts the result. Then begin the next step's interview and specification process. Necessary changes to completed work must explain why progress requires them and identify all planned script modifications. Reopen the affected step explicitly and repeat its specification, review, implementation, verification, and acceptance process for the approved amendment scope.
- Define reproducibility through the specified behavior and outputs, an exact execution contract, and approved comparison rules. Control input identity, effective settings, algorithmic boundaries, ordering, randomness, and environment differences. Source code may differ. Numerical tolerances require explicit user approval.
- Decide paired validation explicitly for each project step and include it in representative release examples. Two independent workers implement the same small function or unit from the same approved specification. Compare their outputs on identical small synthetic fixtures and check each result against approved expected behavior. This comparison does not duplicate large implementations or train on real data.
- Save readable specifications alongside structured JSON decisions and validation results, with Node.js validation helpers. Use a separate reviewer context, with a separate review session requested when native delegation is unavailable.
- Require standalone Claude Code and Codex packages with verified installation through both hosts' marketplace mechanisms. Prepare project-maintained catalogs and the materials required for public directory submission. Preserve the same workflow across hosts and test installed resources, updates, removal, and project resumption. Adapt OpenSpec's behavioral requirements, scenarios, design, tasks, and amendments without requiring its installation. Extend that method with user approvals and reproducibility contracts. Use GitHub Spec Kit as an additional design reference.
- Present the ordered plan as an ASCII diagram. Adapt useful SpecViz components where appropriate without creating a SpecViz package dependency. Incorporate the supplied writing conventions directly into Vibe2Spec's instructions, without a separate style bundle.

## Capabilities

### New Capabilities

- `request-discovery`: Evidence-backed interviews, explanations of alternatives, and explicit resolution of missing project decisions.
- `step-specification`: A provisional project overview and comprehensive, traceable specifications for the current actionable step.
- `reviewed-execution`: Worker instructions and reviews before execution and after results, including detection of unapproved effective settings.
- `step-lifecycle`: User acceptance, preservation of completed work, and necessary revisions with an affected-script explanation.
- `reproducibility-contract`: Explicit input, behavior, output, and comparison requirements for equivalent independent implementations.
- `host-integration`: Marketplace installation and workflow access in Claude Code and Codex, public submission readiness, portable project records, and understandable plan presentation.

### Modified Capabilities

None. The repository has no existing capability specifications.

## Impact

At proposal creation, the repository contained its name in `README.md`, an Apache 2.0 license, and OpenSpec configuration and generated agent workflows. Step 1 has since delivered reviewed record documents, templates, and fictional fixtures; result acceptance remains pending. The executable workflow, automated helpers, and installable packages remain planned. This proposal defines the release behavior contract and sequential implementation roadmap.

The product will need agent instructions, specification templates, review instructions, examples, verification assets, and host installation metadata. Readable Markdown documents, JSON decision records, Node.js validation helpers, separate reviewer contexts, included diagram support, and incorporated writing conventions are accepted choices. Paired implementation testing is scoped to small units and synthetic fixtures, with an explicit decision for each project step and representative paired release examples.

The first release uses instruction-based compliance with review evidence. A custom controlled execution runner is outside the accepted first-release scope. Review cannot retroactively prevent an action that has already occurred. The proposal must therefore distinguish the review protocol from technical prevention.

The research-paper workflow is an example of the intended interaction. It does not prescribe a fixed sequence for every project or establish a requirement to conduct that biological study. Installation through both hosts' marketplaces and public submission readiness are required release capabilities. Actual public listing requires the applicable external review and publication process after release acceptance. This planning update does not publish or implement the plugin.

Accepted user decisions are recorded in `../../planning/vibe2spec-interview.md`. New design recommendations remain proposals until the user resolves them.
