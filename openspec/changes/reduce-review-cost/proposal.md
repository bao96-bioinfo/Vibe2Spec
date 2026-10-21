# Proposal

## Why

The user reports five review rounds exceeding 500,000 tokens each. Vibe2Spec currently lacks explicit reuse of passing checks, encourages repeated transitive inspection, and has no correction-loop boundary. The local Superpowers 7.0.0 sources provide useful task-scoped handoffs and correction-only review patterns.

## What Changes

- Introduce explicit reviewed coverage and same-phase correction reviews that preserve valid checks while inspecting changes and affected dependencies.
- Keep the exact current complete snapshot, independent review, approval requirements, and unresolved-defect gates.
- Use compact file-based handoffs, a read-only inspection packet, one consolidated review per phase, and a bounded correction loop.
- Reuse an independent reviewer for same-phase corrections through a separate historical baseline reference, without weakening separation from current artifact authors or workers.
- Add regressions and bounded behavioral evaluation, and rebuild the shared Claude Code/Codex package.

## Capabilities

### New Capabilities

- `review-continuation`: Explicit reusable coverage, correction scope, finite review effort, and safe evidence reuse. Existing reviewed-execution behavior is recorded in the earlier unarchived release change; this capability refines its correction mechanism.

### Modified Capabilities

No main capability specs have yet been archived into `openspec/specs`.

## Impact

Reviewer/coordinator/worker skills, review documentation and templates, review record schema and readiness checks, a Node.js standard-library inspection helper and command, tests, and generated plugin. Legacy records retain their existing validation behavior; no migration, Superpowers dependency, host installation, or publication is required. The user authorized incorporating useful mechanisms and previously authorized recommended package-development decisions.
