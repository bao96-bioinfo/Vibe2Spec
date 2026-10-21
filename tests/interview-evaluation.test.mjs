import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const load = async path => JSON.parse(await readFile(resolve(root, path), 'utf8'));
const stimuli = await load('tests/fixtures/interview/conversations.json');
const rubric = await load('tests/fixtures/interview/conversation-rubric.json');
const stimulus = id => stimuli.cases.find(item => item.id === id);
const criterion = id => rubric.cases.find(item => item.id === id);

// These tests verify evaluation data, not generated prose or human comprehension.
test('conversation stimuli and hidden rubric have a one-to-one case and turn mapping', () => {
  assert.equal(stimuli.fixture_version, 1);
  assert.equal(rubric.rubric_version, 1);
  assert.equal(rubric.stimulus_file, 'tests/fixtures/interview/conversations.json');
  const ids = stimuli.cases.map(item => item.id);
  assert.equal(ids.length, 8);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(rubric.cases.map(item => item.id), ids);
  for (const item of stimuli.cases) {
    assert.equal(item.turns.length, 2, `${item.id}: expected a continuation after the first response`);
    assert.equal(new Set(item.turns.map(turn => turn.id)).size, item.turns.length);
    assert.deepEqual(criterion(item.id).turns.map(turn => turn.id), item.turns.map(turn => turn.id));
    for (const turn of item.turns) {
      assert.deepEqual(Object.keys(turn).sort(), ['id', 'user']);
      assert.ok(typeof turn.user === 'string' && turn.user.trim().length > 0);
    }
  }
});

test('assistant-visible contexts do not embed grading fields or expected responses', () => {
  const permitted = new Set(['id', 'project', 'audience', 'approved_decisions', 'unapproved_context', 'conflicting_approvals', 'history', 'turns']);
  for (const item of stimuli.cases) {
    assert.ok(Object.keys(item).every(key => permitted.has(key)), item.id);
    for (const decision of Object.values(item.approved_decisions)) {
      assert.deepEqual(Object.keys(decision).sort(), ['source', 'value']);
      assert.ok(decision.source.length > 0);
    }
    for (const message of item.history) {
      assert.deepEqual(Object.keys(message).sort(), ['content', 'role']);
      assert.ok(['user', 'assistant'].includes(message.role));
      assert.ok(message.content.length > 0);
    }
    const { turns, ...context } = item;
    const firstPrompt = { ...context, user: turns[0].user };
    assert.ok(!Object.hasOwn(firstPrompt, 'turns'));
    assert.notEqual(firstPrompt.user, turns[1].user);
  }
});

test('rubric decisions retain approval scope across turns without contradictory states', () => {
  for (const item of rubric.cases) {
    const known = new Map(Object.entries(stimulus(item.id).approved_decisions).map(([key, value]) => [key, value.value]));
    assert.ok(item.dimensions.length > 0);
    assert.equal(new Set(item.dimensions).size, item.dimensions.length);
    assert.ok(item.dimensions.every(dimension => Object.hasOwn(rubric.dimensions, dimension)));
    assert.ok(item.checks.length > 0);
    for (const turn of item.turns) {
      assert.equal(turn.max_new_unfamiliar_decisions, 1);
      assert.equal(new Set(turn.pending).size, turn.pending.length);
      for (const decision of turn.must_reuse) assert.ok(known.has(decision), `${item.id}/${turn.id}: cannot reuse unresolved ${decision}`);
      for (const [decision, value] of Object.entries(turn.newly_resolved)) {
        assert.ok(!known.has(decision), `${item.id}/${turn.id}: reapproves an existing choice`);
        known.set(decision, value);
      }
      for (const decision of turn.pending) assert.ok(!known.has(decision), `${item.id}/${turn.id}: ${decision} is both resolved and pending`);
    }
  }
});

test('partial grouped reply approves exactly two choices and leaves repeats unresolved', () => {
  const item = criterion('familiar-group');
  assert.deepEqual(item.turns[0].familiar_group, ['output_order', 'repeated_values', 'input_mutation']);
  assert.deepEqual(item.turns[0].newly_resolved, {});
  assert.deepEqual(item.turns[1].newly_resolved, { output_order: 'preserve', input_mutation: false });
  assert.deepEqual(item.turns[1].pending, ['repeated_values']);
});

test('draft and illustrative thresholds differ from the approved value and remain unselected', () => {
  const item = stimulus('approved-context');
  assert.equal(item.approved_decisions.threshold.value, 2);
  assert.deepEqual(item.unapproved_context.map(decision => decision.value), [3, 5]);
  assert.deepEqual(item.unapproved_context.map(decision => decision.kind), ['draft', 'illustration']);
  for (const turn of criterion(item.id).turns) {
    assert.ok(turn.must_reuse.includes('threshold'));
    assert.ok(!Object.hasOwn(turn.newly_resolved, 'threshold'));
  }
});

test('confusion does not approve an order or promote an illustrative threshold', () => {
  const item = criterion('confusion-repair');
  assert.deepEqual(stimulus(item.id).approved_decisions, {});
  assert.equal(stimulus(item.id).history.length, 1);
  assert.deepEqual(item.turns[0].newly_resolved, {});
  assert.deepEqual(item.turns[1].newly_resolved, { output_order: 'preserve' });
  assert.ok(item.turns.every(turn => turn.pending.includes('threshold')));
});

test('pairing selection covers only the bounded unit and does not settle its checks', () => {
  const item = criterion('bounded-pairing');
  assert.deepEqual(item.turns[0].newly_resolved, {});
  assert.deepEqual(item.turns[1].newly_resolved, { paired_validation: true, paired_unit: 'masking-function' });
  assert.deepEqual(item.turns[1].pending, ['paired_fixtures', 'paired_comparison', 'paired_resource_bounds']);
});

test('expert selection preserves the exact numerical boundary and unresolved non-finite policy', () => {
  const item = criterion('expert-comparison');
  assert.deepEqual(item.turns[0].newly_resolved, {});
  assert.deepEqual(item.turns[1].newly_resolved, {
    comparison: { absolute_tolerance: 1e-8, relative_tolerance: 0, boundary: 'inclusive' },
  });
  assert.deepEqual(item.turns[1].pending, ['non_finite_output']);
});

test('conflicting approvals require a scoped replacement and preserve independent settings', () => {
  const item = stimulus('approved-conflict');
  assert.ok(!Object.hasOwn(item.approved_decisions, 'output_directory'));
  assert.equal(new Set(item.conflicting_approvals.map(approval => approval.decision)).size, 1);
  assert.equal(new Set(item.conflicting_approvals.map(approval => approval.value)).size, 2);
  const expected = criterion(item.id);
  assert.deepEqual(expected.turns[0].newly_resolved, {});
  assert.deepEqual(expected.turns[0].pending, ['output_directory']);
  assert.deepEqual(expected.turns[1].newly_resolved, { output_directory: '/workspace/exports' });
  assert.ok(expected.turns.every(turn => turn.must_reuse.includes('report_format') && turn.must_reuse.includes('row_order')));
});

test('precise translation resolves three choices without granting full specification approval', () => {
  const item = criterion('precise-translation');
  assert.deepEqual(item.turns[0].newly_resolved, {
    output_order: 'preserve', repeated_values: 'preserve', input_mutation: false,
  });
  assert.deepEqual(item.turns[1].newly_resolved, {});
  for (const turn of item.turns) {
    assert.deepEqual(turn.pending, ['full_specification_approval', 'specification_review']);
  }
});
