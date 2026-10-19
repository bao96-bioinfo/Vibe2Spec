# Design

Development authorization: the user has requested autonomous completion using recommended remaining choices. [The recorded instruction](../../planning/development-authorization.md) supersedes development-only interview and acceptance pauses below. Product workflow gates remain required. Historical completion evidence is preserved.

## Context

See `proposal.md` for the motivation and capability scope. Step 1 has delivered reviewed documents, templates, and fictional fixtures; the user accepted its exact reviewed result. Step 2 is current for interview and specification. Executable workflows, helpers, and host packages remain planned. The six capability specifications define the release behavior. `../../planning/vibe2spec-interview.md` distinguishes accepted user decisions from design recommendations.

The accepted architecture uses standalone agent instructions, Markdown specifications, JSON records, and Node.js validation helpers. A separate reviewer assesses specifications before implementation, prepared work before execution, and evidence after execution. Each project step has its own complete interview and specification process. A completed step remains closed until a necessary amendment is approved and the step is explicitly reopened.

The file layout, record fields, helper interfaces, and implementation stages below are proposed engineering conventions. They are reviewable parts of this proposal, not evidence that the user has already approved every field or command. Before implementing a stage, its current-step specification must resolve the relevant conventions and obtain approval and specification review. Later stages remain provisional.

## Goals / Non-Goals

The design makes missing decisions visible before code preparation. It preserves the exact specification and evidence assessed at each gate. It allows another worker to reconstruct the intended behavior without guessing values, boundaries, or comparison rules. Small independent function implementations provide practical evidence of agreement on approved synthetic cases.

The first release does not provide an execution sandbox, a custom command runner, or a model service. Instructions and reviewers cannot technically intercept every host action. Structural validation cannot prove semantic completeness. Finite unit comparisons cannot prove equality for all possible inputs or establish the quality of a scientific finding.

The biological research example is an interview example. This change does not select a foundation model, download scientific data, conduct training, or write a manuscript. Public marketplace publication remains a later distribution action. This proposal prepares the repository and verification approach without publishing it.

## Decisions

### Adapt OpenSpec's document responsibilities

OpenSpec separates motivation, observable requirements, technical design, and implementation tasks. Its specification format uses named SHALL or MUST requirements and WHEN/THEN scenarios. Changes include complete revised requirements and scenarios. Vibe2Spec adopts these concrete writing rules and adds explicit approvals, execution contracts, and evidence gates. [OpenSpec schema](https://github.com/Fission-AI/OpenSpec/blob/main/schemas/spec-driven/schema.yaml)

| OpenSpec pattern | Vibe2Spec adaptation | Additional constraint |
| --- | --- | --- |
| Proposal | Project purpose, constraints, ordered overview, and feasibility | Agreement on the overview does not approve detailed future settings |
| Behavioral specification | Named requirements with stable identifiers and testable scenarios | Every required behavior links to approved decisions and objective checks |
| Design | Current-step method and execution contract | All relevant arguments, derivations, interfaces, defaults, and boundaries resolved before implementation |
| Tasks | Small authorized units with file scope and verification | A unit cannot bypass an unresolved current-step specification |
| Requirement delta | Necessary amendment with complete revised text and scenarios | User approves necessity and every planned affected script edit before reopening |
| Historical artifacts | Accepted revision with its checks, reviews, and acceptance | Earlier evidence remains historical; changed work requires fresh applicable evidence |

This keeps behavioral requirements readable while placing detailed values in linked contracts. A single long prose document would make reference and consistency checks harder. Requiring the OpenSpec application would add an installation dependency the user has excluded.

Spec Kit contributes uncertainty coverage, dependency-aware clarification, decision rationale, and traceable tasks. Its initial specification workflow permits informed defaults and limits clarification markers. Its clarification workflow limits questions per session. Vibe2Spec does not adopt those limits or authorize defaults through them. The interview continues until the current step has no unresolved required decision. Independent settings can be reviewed together. Difficult or dependent decisions receive individual explanations and questions. [Spec Kit specification workflow](https://github.com/github/spec-kit/blob/main/templates/commands/specify.md), [clarification workflow](https://github.com/github/spec-kit/blob/main/templates/commands/clarify.md)

### Separate the project loop from the current-step cycle

The project record contains the agreed ordered steps, dependency references, one current step, and each step's status. The overview may change for future work through an explicit user decision. It cannot silently remove unfinished obligations or rewrite accepted work.

After overview agreement, the coordinator selects the first unfinished step. It interviews the user and researches unresolved decisions for that step. Necessary downstream interface questions are resolved here when they affect the current output contract. Detailed work on the next step begins only after the current step is finished.

```text
                  +-------------------------------+
                  | Agree on the overall step plan |
                  +-------------------------------+
                                  |
                                  v
             +-------------------------------------------+
       +---->| Select the current step                    |<----+
       |     | Interview, research, and write its full spec|     |
       |     +-------------------------------------------+     |
       |                          |                            |
       |                          v                            |
       |     +-------------------------------------------+     |
       |     | User approves; separate spec review passes |     |
       |     | Prepare implementation                    |     |
       |     | Separate code/configuration review passes |     |
       |     | Execute; checks and results review pass   |     |
       |     +-------------------------------------------+     |
       |                          |                            |
       |                          v                            |
       |     +-------------------------------------------+     |
       |     | User accepts this result                  |     |
       |     | Mark this step finished and keep it closed|     |
       |     +-------------------------------------------+     |
       |                          |                            |
       |      More steps remain? -+                            |
       +----------- Yes           |                            |
                                  No                           |
                                  v                            |
                    +-------------------------+                |
                    | All required steps done |                |
                    | Project finished        |                |
                    +-------------------------+                |
                                                               |
  Necessary correction to a completed step:                     |
  Explain necessity and every planned affected script edit     |
    -> user approves exact reopening scope                     |
    -> reopen that step; suspend affected dependent work ------+
```

The reopening route can be triggered by a necessary defect discovered during any later step or after completion. It creates a new revision and repeats the affected step's full cycle. Project completion also requires all affected downstream evidence to be valid.

Within the current step, the coordinator prepares the complete specification and obtains user approval and a passing separate specification review. The worker then prepares the specified code and configuration. A separate reviewer checks the prepared work before any project code, including a new test, executes. After execution, the reviewer checks the actual evidence and outputs. The user accepts the assessed result only after required checks and review pass. The coordinator marks the step finished and repeats this cycle for the next step. When every required step has current accepted evidence and no necessary reopening is unresolved, the project is finished.

| State | Required evidence to leave the state | Next state |
| --- | --- | --- |
| Provisional | Preceding step accepted; step selected from the agreed overview | Interviewing |
| Interviewing | Complete current-step contracts, decisions, and proposed checks | Awaiting specification approval and review |
| Awaiting specification approval and review | User approval and passing separate review of the same version | Ready to implement |
| Ready to implement | Code, configuration, commands, and checks prepared within approved scope | Awaiting pre-execution review |
| Awaiting pre-execution review | Passing assessment bound to the actual prepared work | Ready to execute |
| Ready to execute | Approved operation performed; run evidence captured | Awaiting results review |
| Awaiting results review | Required checks pass and reviewer has no unresolved finding | Awaiting user acceptance |
| Awaiting user acceptance | Explicit acceptance of the assessed revision and result | Finished |

A missing decision returns the affected current step to interviewing. A coding error covered by the existing contract returns it to implementation and fresh applicable reviews. An unavailable reviewer leaves the relevant gate pending. A failed check remains recorded. The state records the blocking reason and previous state so a new session can resume accurately.

Specification approval and specification review may occur in either order. Both must refer to the same final contents. A review is an assessment of compliance and completeness; it cannot supply user approval. An interview answer that changes the contract invalidates the previous applicable review.

### Use shared instructions and small local helpers

The coordinator, worker, and reviewer are roles performed by host agents. Shared skills describe their responsibilities and handoff records. Node.js helpers inspect files and produce structured findings. They do not decide scientific methods, select user values, or execute arbitrary project commands.

| Proposed repository area | Responsibility |
| --- | --- |
| `skills/vibe2spec/` | Interview, research, project overview, current-step authoring, and workflow routing |
| `skills/vibe2spec-worker/` | Approved-context handoff, missing-decision stops, prepared-work and run evidence |
| `skills/vibe2spec-review/` | Specification, pre-execution, and results assessments in a separate context |
| `templates/` | Markdown documents and versioned JSON record templates |
| `scripts/` | Record validation, fingerprints, readiness checks, comparisons, and ASCII rendering |
| `tests/` | Deterministic helper checks and workflow fixtures |
| `examples/` | Small release projects with recorded paired-unit evidence |
| `packaging/` | Host-specific installation resources and compatibility records |
| `docs/` | Record formats, authoring rules, lifecycle, comparison protocol, and installation |

The proposed helper implementation uses Node.js built-in modules and explicit JSON field validators. The built-in test runner can exercise the helper contracts without a separate test package. The development runtime and available interfaces are approved in Step 2 before helper implementation. The packaging stage fixes and verifies the distributed compatibility range. [Node.js test runner](https://nodejs.org/api/test.html)

The alternative of embedding the workflow separately into each host would duplicate policy and allow it to drift. Shared role instructions and record formats preserve the same gates across hosts. Host adapters remain small and version-tested.

### Keep project records outside the installed plugin

The proposed project directory is `.vibe2spec/` within the selected workspace. The coordinator confirms this location in the project's setup decisions. Plugin updates must not own or overwrite project records.

| Proposed project artifact | Content |
| --- | --- |
| `project.md`, `project.json` | Outcome, constraints, overview, current step, dependencies, and status |
| `decisions/<id>.json` | Question, alternatives, evidence, proposed or approved value, scope, and response reference |
| `evidence/<id>.json` | Source identity, access date, supported claim, applicability, limitations, and conflicts |
| `approvals/<id>.json` | User response, exact approved scope, referenced content versions, and approval purpose |
| `steps/<id>/revisions/<revision>/spec.md` | Purpose, named behavioral requirements, and scenarios |
| `steps/<id>/revisions/<revision>/design.md` | Method, rationale, dependencies, and detailed execution semantics |
| `steps/<id>/revisions/<revision>/tasks.md` | Authorized units, affected files, dependencies, and verification |
| `steps/<id>/revisions/<revision>/contract.json` | Structured step fields and references to units, decisions, checks, and resources |
| `steps/<id>/revisions/<revision>/units/` | Unit contracts and approved fixture manifests |
| `reviews/<id>.json` | Review phase, reviewer context, assessed content, findings, and outcome |
| `runs/<id>.json` | Actual operation, code, inputs, effective settings, environment, outputs, and check results |
| `acceptances/<id>.json` | User acceptance linked to the exact assessed result |
| `amendments/<id>.json` | Necessity, proposed edits per path, affected steps, approval, and revision links |

Records use a declared format version, record kind, unique identity, and project-relative references. A reference identifies both its target and content version. A record with an unsupported format version, duplicate identity, invalid type, or unresolved required reference fails validation. An empty string, placeholder, or null is not a resolved decision. A field can be inapplicable only when its reason and approval are recorded.

Readable documents and structured fields are jointly reviewed. Machine-checkable fields use explicit decision and requirement identifiers in the prose. A discrepancy blocks readiness. JSON does not silently override the document, and prose does not silently override a structured value. The reviewer checks meaning that a structural validator cannot determine.

### Bind approval and review to contents

A content fingerprint identifies a file version using a cryptographic digest of its exact bytes. The proposed digest is SHA-256. A snapshot manifest records normalized project-relative paths, byte lengths, and digests in sorted path order. References to remote inputs include an immutable version or a locally verified digest, plus the approved acquisition rule.

Approval records reference the presented snapshot and the user's actual response. The coordinator records a response identifier where the host provides one, or a preserved response with session provenance when it does not. It must not fabricate a response or convert a recommendation into acceptance. Grouped approval identifies each accepted setting separately. Partial answers leave the other settings unresolved.

A changed decision cannot inherit approval merely by retaining its identifier. A changed specification invalidates its applicable review. Changed code, configuration, input contents, or relevant environment invalidate the corresponding pre-execution assessment. New results require their own applicable checks and review. Historical records remain associated with their original snapshots.

Fingerprints detect content changes. They are not proof of human identity, an access-control mechanism, or a guarantee that the execution record is truthful. The independent reviewer inspects actual files and evidence to assess those remaining claims.

### Define the complete current-step and unit contracts

The step contract covers every planned implementation unit and the dependencies needed to understand the current step. It also records the explicit decision to enable or decline paired validation, with selected units when enabled. A complete unit cannot authorize code while a required current-step decision is unresolved.

| Contract area | Required decisions before implementation |
| --- | --- |
| Purpose and scope | Required behavior, excluded behavior, requirement identifiers, permitted file changes, and dependencies |
| Interface | Function or operation name, arguments, argument sources, accepted types, shapes, units, ordering, return schema, and mutation or side effects |
| Inputs | Exact fixture or data identity, location, versions, integrity checks, selections, partitions, and acquisition behavior |
| Semantics | Method, equations or algorithms, operation order, comparison operators, ties, duplicates, empty inputs, missing values, and errors |
| Settings | Every effective argument, omitted-argument default, configuration source and precedence, and approved derivations |
| Environment | Relevant dependencies, precision, device, randomness, concurrency, and allowed environment differences |
| Outputs | Paths, schemas, ordering, identifier alignment, serialization, and explicitly approved variable fields |
| Verification | Expected outcomes or invariants, normal and boundary cases, invalid-input cases, and per-output comparison rules |
| Resources | Approved execution resources, sizes, counts, time limits, and applicable cost or storage bounds |
| Failure and recovery | Stop conditions, allowed retries or fallbacks, evidence to retain, and questions requiring a return to interview |

Derived values are authorized through an approved formula and its inputs. The worker can evaluate that formula within its specified domain. It cannot invent a formula to avoid a missing decision. Source-level organization may differ between workers when it preserves the entire contract. Choosing a new externally effective argument, behavior, dependency, or side effect requires a recorded decision.

For research with unknown outcomes, acceptance checks establish the approved procedure, valid artifacts, and comparison properties. They do not require an invented favorable result. Free-form outputs that lack an agreed objective comparison remain unresolved under the requested reproducibility standard.

### Review the specification, prepared work, and actual results

Each review request identifies its phase, current revision, required files, decision and approval records, and the exact question being assessed. The reviewer works in a context separate from the author of the assessed artifact and the relevant implementation workers. This also applies when the coordinator authored the specification. The reviewer receives direct access to the relevant artifacts. Author summaries can help navigation but do not replace those artifacts.

The specification reviewer checks completeness across the contract areas above, decision provenance, consistency with accepted dependencies, scenario coverage, and objective acceptance rules. It reports hidden defaults and unresolved current-step choices before a worker writes code.

The pre-execution reviewer inspects the actual code, calls, commands, configuration, dependency defaults, environment overrides, and acceptance checks. Every effective setting must trace to the approved contract. This review also covers prepared unit tests and comparison scripts before they run. A changed implementation receives a new applicable assessment.

The results reviewer inspects the actual run record, input and output identities, effective settings, failures, and check outcomes. Missing evidence prevents a passing assessment. A corrected implementation that follows existing decisions can proceed through fresh reviews. A new method or criterion returns to the interview. Reviewers cannot approve their own proposed remedy on the user's behalf.

Review outcomes are pass, changes required, or unable to determine. Only pass with no unresolved findings satisfies a gate. If native delegation is unavailable, the coordinator prepares the same handoff for a separate review session. The relevant gate remains pending. A reviewer role instruction does not create a technical sandbox.

### Compare small independent implementations

Paired validation is a unit-level protocol. Before either worker prepares code, the complete current step and selected unit have approved specifications, fixtures, comparison rules, resource bounds, and a passing specification review. Both workers receive identical content versions. The saved fixture contents are shared; using the same random seed is insufficient by itself.

Two separate worker contexts implement the specified function independently. Neither receives the other's implementation or results until its own implementation is fixed for the comparison. Their output locations and write scopes are specified separately. A distinct reviewer assesses each prepared implementation. A worker and its reviewer do not count as two implementations.

After both prepared implementations pass review, they execute only the approved small cases. Each result is checked against its approved expected value or invariant. The two results are also compared directly. Two matching outputs can both be wrong. Two outputs can each pass a tolerance against a reference while failing the direct pairwise tolerance.

The comparison record links both worker contexts, code versions, shared contract and fixtures, pre-execution reviews, individual checks, pairwise checks, resource use, and results review. If separate worker contexts are unavailable, separate sessions are required before claiming independent paired evidence. The record cannot relabel a single implementation or an edited copy as independent.

The protocol does not duplicate complete applications, download production weights, or train on real data. A large model project can compare a loss calculation, masking operation, normalization rule, or other approved unit on small vectors or tensors. Resource limits apply before execution. Exceeding them returns the unit boundary or budget to the user.

Candidate release examples include a stable threshold filter and a small numerical vector transformation. The filter can expose inclusive versus exclusive boundaries, ordering, empty inputs, and invalid arguments. The numerical example can expose output alignment and tolerance handling. These are proposed examples. Their exact interfaces, fixture contents, expected outputs, and bounds must be specified and approved before workers implement them.

### Make comparison rules explicit

Every required output has an approved comparison category. Exact bytes compare the serialized content directly. Exact logical content compares parsed values under specified ordering and representation rules. Numerical agreement uses an approved metric, threshold, boundary operator, and treatment of zero, missing, and non-finite values. There is no default tolerance or automatically ignored field.

For a numerical unit, the contract identifies each compared component, its alignment, the exact comparison formula, and all constants. A proposed absolute-error rule, for example, must define whether equality at the approved threshold passes. A relative-error rule must define its denominator and behavior at zero. Direct pairwise and reference-based rules are recorded separately when their meanings differ.

Node helpers can validate comparison records and implement explicitly supported byte, JSON, and finite-number operations. They must reject unsupported numeric representations or unsafe conversions. A target-language checker can be specified for tensors, high-precision values, or domain formats. Its implementation and effective arguments receive the same reviews. A helper must not silently coerce an unsupported value to obtain a result.

Comparison evidence always states its tested units, fixtures, environments, and criteria. Unit success does not replace an explicitly specified integration check or authorize a full experiment. A failed criterion remains in history. Any revised criterion requires a new approved contract and fresh applicable evidence.

### Keep completed work closed and reopen necessary corrections explicitly

A finished step retains its accepted revision and evidence. Routine preferences, cleanup, or a different coding style do not establish necessity for changing it. A necessary correction identifies the blocking requirement or defect and explains why the project cannot proceed correctly with the accepted work.

The amendment proposal enumerates every affected script and the exact planned edit to each. It also covers affected specifications, configuration, inputs, outputs, checks, and directly or transitively dependent steps. The user approves the necessity and exact scope before any protected work changes. Discovering another required script edit returns that expansion for approval.

After approval, the coordinator opens a new revision of the corresponding step and makes it current. Affected dependent work is suspended. The revised scope returns to interview and specification review. Unchanged accepted decisions can be referenced with their original provenance. Approval to reopen does not approve unresolved revised values or accept future results.

The reopened step repeats implementation, pre-execution review, execution, checks, results review, and user acceptance. It becomes finished only after those gates pass again. Downstream evidence remains historical for the old inputs and is marked stale for current reliance. Required downstream checks, reviews, and acceptance are renewed before progress resumes. Unaffected completed steps remain closed.

### Provide research and explanation within the interview

The coordinator records the user's outcome, experience, constraints, and unresolved questions. It prioritizes decisions that affect feasibility or determine later questions. It groups independent settings while preserving a separate approval for each. A user's uncertainty triggers explanation and evidence gathering, not an inferred answer.

Before asking for a choice, the coordinator explains the concrete situation, the decision's purpose, and its relevance to the user's intended work. It defines unfamiliar terms and describes the alternatives in complete sentences. It then shows what each option changes and explains the relevant benefits, drawbacks, and consequences. A small shared input with expected outputs makes behavioral differences visible. Before-and-after input states explain mutation, meaning a change to the original data. Concrete workflow or resource consequences explain decisions whose distinction is not an output value. The coordinator does not invent performance estimates or artificial output differences.

The user clarified this requirement after the filter-tool demonstration: brief labels such as preserving order, removing duplicates, or permitting mutation did not provide enough information to decide. The user preferred concrete input, threshold, and expected-output examples. Grouping therefore controls how related questions are presented; each independent setting still receives its own sufficient explanation and explicit selection question. Examples remain illustrative until their values are approved. Recommendations state their rationale and never become an inferred selection. An uncertain answer triggers further explanation or relevant research.

Interview review checks whether a reader can identify the requested choice, explain how its alternatives differ in this task, and understand its practical consequences from the supplied explanation. More words alone do not satisfy this check. Step 3's dialogue cases must expose missing context, unexplained terms, examples that fail to reveal the distinction, omitted data loss or side effects, and unsupported claims about verification or resources. This refinement supplies release-level interview requirements; detailed Step 3 implementation remains subject to its own future specification and approval.

Evidence records identify the primary source, publication or documentation version, access date, supported claim, and limits of applicability. Literature choices cover methods, common data practices, computing needs, and alternatives relevant to the user's task. Conflicting findings remain visible. Inaccessible evidence is reported with the decision it prevents resolving.

The supplied writing conventions are incorporated directly into shared skill instructions and templates. Explanations use short, formal sentences and define unfamiliar terms. They avoid em dashes, bold run-in headings, and unexplained abbreviations. Procedures are narrated in prose or shown in diagrams. Structured task checkboxes remain a machine-readable artifact format.

The overview renderer consumes explicit step order, dependencies, and recorded status. It shows the project loop and the repeated current-step cycle. Reopened steps and blocked dependencies are visible. It does not infer completion from a diagram. Useful SpecViz layout ideas may be adapted with appropriate license attribution; the release has no SpecViz or Python runtime dependency for this feature.

### Keep host integration thin and verified

Shared skills and helpers carry the workflow. Host-specific installation metadata and delegation instructions form small adapters. Claude supports shared skill directories and native plugin agent definitions. Codex supports skill-directed delegation with host-specific agent configuration. These host formats are verified during packaging. [Claude plugin components](https://code.claude.com/docs/en/plugins/components), [Codex subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents)

OpenAI's submission guidance preserves reusable skills and requires adapting Claude-specific agent procedures for its public package. It excludes lifecycle hooks from public submissions. This design does not depend on hooks or assume that one agent manifest works unchanged in both hosts. [OpenAI plugin conversion guidance](https://developers.openai.com/plugins/guides/submit-claude-plugin)

Clean installation checks verify every referenced skill, template, helper, runtime prerequisite, and delegation fallback. User state remains in the selected workspace. A package must not reference the author's local SpecViz or writing-style folders. Missing research access, file access, helpers, or separate contexts are reported as capability gaps. They do not silently weaken a gate.

### Require marketplace installation and prepare directory submissions

The user reaffirmed that the package must work in both Codex and Claude Code and be installable through their marketplaces. This is a release requirement. Shared instructions, templates, and Node.js helpers remain the core. Each host receives the metadata and delegation adaptation its supported versions require. Exact names, versions, paths, catalog fields, listing text, and commands are resolved in Step 8's specification before implementation.

The official documentation was checked on 2026-10-17. Claude Code documents `.claude-plugin/plugin.json` and a repository catalog at `.claude-plugin/marketplace.json`. Git-backed installation can copy the plugin into a cache, so all required resources must travel with that package. Local development loading alone cannot establish installed behavior. [Claude manifest reference](https://code.claude.com/docs/en/plugins-reference), [Claude marketplace guide](https://code.claude.com/docs/en/plugin-marketplaces), [Claude loading behavior](https://code.claude.com/docs/en/plugins/loading)

OpenAI documents a portable root `plugin.json`, with `.codex-plugin/plugin.json` retained as a compatibility format. Its repository catalog uses `.agents/plugins/marketplace.json`. The supported installation surface and format must be verified against the approved Codex version. This design does not assume that copying Claude metadata establishes Codex compatibility. [OpenAI packaging guide](https://developers.openai.com/plugins/build/plugins)

Reusable worker and reviewer procedures remain in shared skills. Host adapters preserve the separate reviewer context and separate-session fallback. Claude-specific command and agent declarations need adaptation for OpenAI submission; public packages cannot rely on lifecycle hooks. [OpenAI conversion guidance](https://developers.openai.com/plugins/guides/submit-claude-plugin)

Step 8 tests discovery and actual installation through each marketplace mechanism in clean environments. Evidence identifies the host surface, versions, source revision, catalog, and package. Checks cover packaged resources, the reviewer path, updates, removal, and preserved workspace records. Step 9 exercises the integrated workflow and resumption across the installed hosts. Neither a valid manifest nor a successful development load is sufficient.

Project-maintained catalogs and official directory listings are separate distribution routes. Claude's directory submission requires external review; its default official marketplace has a distinct admission path. OpenAI public plugins use a submission portal and require approval followed by publication. Step 8 prepares the applicable listing materials and Step 9 records readiness against current requirements. External submission and published availability are recorded separately after release acceptance. [Claude publishing guide](https://code.claude.com/docs/en/plugins/publish), [OpenAI submission guide](https://developers.openai.com/plugins/deploy/submission)

### Implement the product in sequential stages

This table is the proposed development overview for Vibe2Spec itself. Each stage becomes a project step with its own detailed specification when it becomes current. The six capability specifications describe the release contract; they do not authorize implementing all stages at once.

| Stage | Intended outcome | Verification focus |
| --- | --- | --- |
| 1. Records and specification templates | Versioned decision, approval, contract, review, run, and acceptance formats | Approved examples expose complete, missing, conflicting, and changed decisions |
| 2. Validation and readiness | Node helpers check structure, references, fingerprints, and gate evidence | Missing decisions and stale approvals cannot yield readiness |
| 3. Interview and research | Coordinator collects informed decisions with traceable evidence | Grouped partial answers and uncertainty preserve unresolved choices |
| 4. Step authoring and diagrams | Current-step contracts, task units, and project-loop overview | Future steps remain provisional; no code before complete current-step readiness |
| 5. Worker and reviewer protocol | Separate specification, pre-execution, and results review handoffs | Hidden defaults, unavailable reviewers, and changed code block the correct gate |
| 6. Paired unit validation | Independent small functions, shared fixtures, correctness and direct comparisons | Shared mistakes, reference-only agreement, and exceeded budgets fail correctly |
| 7. Completion and reopening | Sequential acceptance, resume, history, and necessary amendments | No early advancement; reopened work repeats the cycle and invalidates affected evidence |
| 8. Host packages and documentation | Claude Code and Codex marketplace packages and public submission materials | Clean marketplace installation, package lifecycle, portable records, and explicit capability failures |
| 9. Release examples and verification | Small paired examples and a complete multi-step workflow demonstration | Repeated step cycles, necessary reopening, both hosts, and bounded resources |

Before Stage 1 implementation, its detailed contract must fix the exact record fields, identities, validation meanings, template examples, file scope, and acceptance checks. It must record the paired-validation decision for Stage 1. Later stages receive the same process after their predecessors are accepted. `tasks.md` provides the proposed work breakdown and evidence expected at each stage.

## Risks / Trade-offs

| Risk or trade-off | Mitigation and remaining limit |
| --- | --- |
| Instructions can be ignored or misunderstood | Separate reviews, explicit gates, and direct evidence expose violations; this is not technical prevention |
| Structural checks miss a semantic gap | Separate specification review and approved normal, boundary, and invalid-input cases; unresolved meaning blocks readiness |
| Two workers share the same error | Check each result against approved expected behavior as well as against the other result |
| Small fixtures do not cover production behavior | State tested coverage explicitly and specify integration or real-work checks separately |
| Interview burden grows with detail | Group independent settings, reuse accepted decisions with provenance, and explain difficult choices individually |
| A reviewer or host feature is unavailable | Preserve the pending gate and provide a separate-session handoff |
| Dependencies or numerical environments drift | Version relevant inputs and settings; changes require renewed applicable approval and review |
| Approval records are altered or fabricated | Preserve response provenance and fingerprints; do not present these as authenticated signatures |
| A reopened dependency leaves old results appearing current | Mark direct and transitive affected evidence stale and require renewed checks, reviews, and acceptance |
| Review after an action cannot undo its effects | Record the violation, stop affected work, and request a recovery decision |

## Migration Plan

This is a greenfield product. Existing OpenSpec planning files remain authoring records. They are not imported as user-approved Vibe2Spec project records. The initial package declares its record version and rejects unsupported versions with an actionable diagnostic.

Development proceeds through the stages above. Verified marketplace installation, submission preparation, and release examples precede external directory submission. Package updates and removal preserve workspace records. A future record migration must have its own specification, preserved prior contents, review, and approval. Reverting a plugin version must not silently reinterpret records written by a newer unsupported format.

## Open Questions

Release account identity, marketplace submission metadata, exact tested host versions, and the distributed Node.js compatibility range are resolved in the packaging stage. The development runtime is resolved earlier in Step 2. Exact synthetic fixtures and budgets are resolved in the release-example step contracts. These are future-step decisions. None supplies an implicit value or authorizes implementation while unresolved.
