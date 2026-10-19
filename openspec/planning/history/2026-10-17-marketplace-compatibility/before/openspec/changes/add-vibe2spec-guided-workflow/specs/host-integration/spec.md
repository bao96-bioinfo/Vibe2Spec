# Host integration

## Purpose

Make the Vibe2Spec workflow usable in Claude and Codex through a standalone plugin. Preserve the same specification, review, and approval rules across hosts and provide understandable project overviews.

## ADDED Requirements

### Requirement: Operate without an OpenSpec installation

Vibe2Spec SHALL provide its own workflow instructions, specification templates, and validation helpers. Using the plugin SHALL NOT require OpenSpec or GitHub Spec Kit to be installed.

#### Scenario: A user has no specification framework installed

WHEN a user installs Vibe2Spec in a supported host without OpenSpec or Spec Kit,
THEN the plugin can conduct its interview and manage its own project records using its declared prerequisites.

### Requirement: Adapt OpenSpec's specification-writing structure

Vibe2Spec SHALL separate project motivation, behavioral requirements, technical execution decisions, and implementation tasks. Behavioral specifications SHALL use named requirements with normative SHALL or MUST statements and testable WHEN/THEN scenarios. Each requirement SHALL have at least one scenario.

#### Scenario: A behavior needs detailed execution settings

WHEN a requirement describes a processing outcome,
THEN the behavioral specification states the outcome and scenarios while the linked execution contract records approved methods, arguments, and other reproducibility settings.

#### Scenario: An accepted behavior needs amendment

WHEN a necessary amendment changes a requirement,
THEN its proposed revision includes the complete revised requirement and scenarios and preserves the previously accepted version for comparison.

### Requirement: Preserve workflow meaning across hosts

The plugin SHALL provide access to its interview, specification review, worker, execution review, completion, and reopening workflows in Claude and Codex. Host-specific invocation details SHALL preserve the same user approval requirements, missing-decision stops, and reviewer independence.

#### Scenario: The user changes coding hosts

WHEN a project is resumed in the other supported host,
THEN its saved decisions, specifications, and completion evidence retain their meaning. The change of host does not itself authorize new settings or waive a required review.

### Requirement: Disclose missing host capabilities

The workflow SHALL identify unavailable capabilities that affect the requested work, including project-file access, research access, helper execution, and separate reviewer contexts. It SHALL explain the blocked function and request a supported way to proceed without silently weakening the workflow.

#### Scenario: A host cannot launch a separate reviewer

WHEN native reviewer delegation is unavailable,
THEN the plugin requests a separate review session as required by the reviewed-execution specification.

#### Scenario: A host cannot execute validation helpers

WHEN the host cannot run the declared validation helpers,
THEN the plugin identifies the unavailable validation and does not report that the checks passed.

### Requirement: Use Node.js helpers and JSON records

The plugin's validation helpers SHALL use Node.js and its structured project records SHALL use JSON. The plugin SHALL declare the runtime requirements needed to run those helpers and report an unsupported environment before claiming validation succeeded.

#### Scenario: The helper runtime is unavailable

WHEN the supported Node.js runtime is not available,
THEN the plugin explains the missing prerequisite and keeps the dependent validation unresolved.

### Requirement: Keep project records portable

The plugin SHALL save user project records in the selected project workspace and resolve their internal references portably. It SHALL NOT require access to the plugin author's personal folders to load specifications, review evidence, or writing instructions.

#### Scenario: Another developer opens the repository

WHEN a project is transferred to another supported environment,
THEN its project-relative specification and decision references remain resolvable. Environment-specific execution paths remain subject to the project's explicit decisions.

### Requirement: Present the overview as an ASCII diagram

The plugin SHALL present the ordered project overview as an ASCII diagram with readable step names, dependencies, and the current step's status. It SHALL distinguish the overall plan from the interview, specification, review, implementation, and acceptance cycle repeated for each step. Diagram generation SHALL NOT require the SpecViz package to be installed.

#### Scenario: The user has not installed SpecViz

WHEN the user requests the project's overall steps,
THEN Vibe2Spec presents the diagram using its own included functionality and preserves unresolved or provisional step status.

#### Scenario: The project has several steps

WHEN the diagram explains the workflow of a multi-step project,
THEN it shows that accepting one step begins a fresh interview and specification cycle for the next step, repeated until all required steps are finished.

#### Scenario: A diagram is displayed for unfinished work

WHEN an overview contains future or unfinished steps,
THEN their displayed status remains provisional or unfinished. Rendering a diagram does not mark work as completed.

#### Scenario: A completed step is reopened

WHEN a necessary amendment opens a new revision and suspends dependent work,
THEN the diagram marks the step as reopened, identifies the affected blocked steps, and preserves the completed status of unaffected steps.

### Requirement: Incorporate the accepted writing conventions

The plugin SHALL incorporate the user's supplied writing conventions into its own instructions. Explanatory prose SHALL use short, clear sentences, explain unfamiliar terms, and avoid unexplained abbreviations, em dashes, and bold run-in headings. The plugin SHALL NOT require a separately installed writing-style bundle.

#### Scenario: A question includes a technical concept

WHEN the plugin introduces a concept unfamiliar to the user,
THEN its explanation defines the concept and gives the information needed for the decision using the incorporated writing conventions.

### Requirement: Declare package prerequisites and verify installation

Each distributed host package SHALL identify its required runtime and included components. Installation verification SHALL check that its workflows and referenced local resources are available in a clean supported environment.

#### Scenario: A package references an absent authoring resource

WHEN a packaged workflow depends on a file present only in the author's checkout,
THEN installation verification fails and reports that reference before the package is considered ready for distribution.
