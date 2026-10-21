import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { reference, candidate } from './fixtures/interview/explanation-source.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const load = async path => JSON.parse(await readFile(resolve(root, path), 'utf8'));
const stimuli = await load('tests/fixtures/interview/explanation-cases.json');
const rubric = await load('tests/fixtures/interview/explanation-rubric.json');
const stimulus = id => stimuli.cases.find(item => item.id === id);
const criterion = id => rubric.cases.find(item => item.id === id);

// These tests protect evaluation facts and approval boundaries. They do not grade
// generated prose, reading traces, formatting, or human comprehension.
test('explanation stimuli and evaluator-only rubric map five cases and six turns', () => {
  assert.equal(stimuli.fixture_version, 1);
  assert.equal(rubric.rubric_version, 1);
  assert.equal(rubric.stimulus_file, 'tests/fixtures/interview/explanation-cases.json');
  const ids = stimuli.cases.map(item => item.id);
  assert.equal(ids.length, 5);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(rubric.cases.map(item => item.id), ids);
  assert.equal(stimuli.cases.reduce((count, item) => count + item.turns.length, 0), 6);
  for (const item of stimuli.cases) {
    assert.deepEqual(criterion(item.id).turns.map(turn => turn.id), item.turns.map(turn => turn.id));
    assert.equal(new Set(item.turns.map(turn => turn.id)).size, item.turns.length);
    assert.ok(criterion(item.id).dimensions.length > 0);
    assert.ok(criterion(item.id).dimensions.every(dimension => Object.hasOwn(rubric.dimensions, dimension)));
    assert.equal(new Set(criterion(item.id).dimensions).size, criterion(item.id).dimensions.length);
  }
});

test('assistant-visible cases exclude rubric facts and can expose the current turn alone', () => {
  const permitted = ['approved_decisions', 'audience', 'history', 'id', 'project', 'sources', 'turns'];
  for (const item of stimuli.cases) {
    assert.deepEqual(Object.keys(item).sort(), permitted);
    for (const turn of item.turns) {
      assert.deepEqual(Object.keys(turn).sort(), ['id', 'user']);
      assert.ok(turn.user.length > 0);
    }
    for (const decision of Object.values(item.approved_decisions)) {
      assert.deepEqual(Object.keys(decision).sort(), ['source', 'value']);
      assert.ok(decision.source.length > 0);
    }
    for (const message of item.history) {
      assert.deepEqual(Object.keys(message).sort(), ['content', 'role']);
      assert.ok(['user', 'assistant'].includes(message.role));
    }
    const { turns, ...context } = item;
    const firstPrompt = { ...context, user: turns[0].user };
    assert.ok(!Object.hasOwn(firstPrompt, 'turns'));
    assert.ok(!Object.hasOwn(firstPrompt, 'facts'));
    if (turns.length > 1) assert.notEqual(firstPrompt.user, turns[1].user);
  }
});

test('local comparison facts match the real source and distinguish empty-array behavior', async () => {
  const item = stimulus('local-function-comparison');
  assert.equal(item.sources.length, 1);
  assert.equal(item.sources[0].kind, 'local_file');
  assert.equal(item.sources[0].path, 'tests/fixtures/interview/explanation-source.mjs');
  assert.ok((await readFile(resolve(root, item.sources[0].path), 'utf8')).length > 0);
  const facts = criterion(item.id).facts;
  assert.deepEqual(Object.keys(reference), Object.keys(candidate));
  assert.equal(Object.keys(reference).length, facts.function_pairs);
  assert.equal(facts.equivalent_pairs + facts.different_pairs, facts.function_pairs);
  assert.equal(facts.equivalent_names.length, facts.equivalent_pairs);
  assert.equal(facts.different_names.length, facts.different_pairs);
  for (const name of facts.equivalent_names) assert.equal(reference[name].toString(), candidate[name].toString());
  assert.deepEqual(reference.keepAtLeast([5, 1, 2, 4], 2), [5, 2, 4]);
  assert.deepEqual(candidate.keepAtLeast([5, 1, 2, 4], 2), [5, 2, 4]);
  assert.equal(reference.sum([]), 0);
  assert.equal(candidate.sum([]), 0);
  assert.equal(reference.mean([2, 4]), candidate.mean([2, 4]));
  assert.equal(reference.mean([]), facts.empty_reference_mean);
  assert.equal(item.approved_decisions.empty_mean.value, facts.empty_reference_mean);
  assert.equal(String(candidate.mean([])), facts.empty_candidate_mean);
  assert.ok(Number.isNaN(candidate.mean([])));
});

test('novice vocabulary facts preserve source order without approving a method', () => {
  const item = stimulus('novice-count-data');
  const expected = criterion(item.id);
  const passage = item.sources[0].passage.toLowerCase();
  const positions = expected.facts.term_order.map(term => passage.indexOf(term));
  assert.ok(positions.every(position => position >= 0));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
  assert.equal(expected.facts.minimum_bridged_terms, 2);
  assert.equal(expected.facts.maximum_bridged_terms, 4);
  assert.equal(expected.facts.maximum_big_picture_bullets, 3);
  assert.deepEqual(item.approved_decisions, {});
  assert.deepEqual(expected.turns[0].newly_resolved, {});
  assert.deepEqual(expected.turns[0].pending, ['normalization_method', 'processing_parameters']);
});

test('score facts preserve bullet order and calculate absolute and relative drops correctly', () => {
  const item = stimulus('source-order-and-scores');
  const expected = criterion(item.id);
  const bullets = item.sources[0].items;
  assert.deepEqual(bullets.map(bullet => bullet.id), expected.facts.source_order);
  assert.equal(bullets[0].score, expected.facts.original_score);
  assert.equal(bullets[1].score, expected.facts.reduced_score);
  assert.equal(bullets[2].same_evaluation_examples, true);
  const difference = bullets[0].score - bullets[1].score;
  assert.ok(Math.abs(difference - expected.facts.score_drop) < 1e-15);
  assert.ok(Math.abs(difference / bullets[0].score * 100 - expected.facts.relative_drop_percent) < 1e-12);
  assert.deepEqual(item.approved_decisions.implementation_comparison.value, {
    absolute_tolerance: expected.facts.approved_absolute_tolerance,
    relative_tolerance: 0,
    boundary: 'inclusive',
  });
  assert.deepEqual(expected.turns[0].newly_resolved, {});
  assert.deepEqual(expected.turns[0].pending, ['quality_target']);
});

test('three missing-value options have distinct consequences without a selected policy', () => {
  const item = stimulus('three-missing-value-options');
  const expected = criterion(item.id);
  assert.deepEqual(expected.facts.options, ['reject', 'skip', 'replace-with-zero']);
  const example = expected.facts.example;
  assert.equal(example.input.filter(value => value === null).length, 1);
  assert.deepEqual(example.input.filter(value => value !== null), example.skip);
  assert.deepEqual(example.input.map(value => value === null ? 0 : value), example.replace_with_zero);
  assert.equal(example.skip.length, example.input.length - 1);
  assert.equal(example.replace_with_zero.length, example.input.length);
  assert.equal(item.approved_decisions.row_order.value, 'preserve');
  assert.ok(!Object.hasOwn(item.approved_decisions, 'missing_value_policy'));
  assert.deepEqual(expected.turns[0].newly_resolved, {});
  assert.deepEqual(expected.turns[0].pending, ['missing_value_policy']);
});

test('confusion example distinguishes order and later selection resolves only output order', () => {
  const item = stimulus('confused-order-followup');
  const expected = criterion(item.id);
  const example = expected.facts.example;
  assert.equal(item.approved_decisions.threshold.value, example.threshold);
  assert.equal(item.approved_decisions.inclusive.value, example.inclusive);
  const retained = example.input.filter(value => value >= example.threshold);
  assert.deepEqual(retained, example.preserved);
  assert.deepEqual([...retained].sort((a, b) => a - b), example.sorted);
  assert.notDeepEqual(example.preserved, example.sorted);
  assert.deepEqual(expected.turns[0].newly_resolved, {});
  assert.deepEqual(expected.turns[1].newly_resolved, { output_order: 'preserve' });
  assert.deepEqual(expected.turns[1].pending, ['full_specification_approval', 'execution_approval']);
});

test('all turn states preserve existing choices and prohibit contradictory approval states', () => {
  for (const item of rubric.cases) {
    const known = new Map(Object.entries(stimulus(item.id).approved_decisions).map(([key, approval]) => [key, approval.value]));
    for (const turn of item.turns) {
      assert.equal(turn.max_new_unfamiliar_decisions, 1);
      for (const name of turn.must_reuse) assert.ok(known.has(name), `${item.id}/${turn.id}: unresolved reuse ${name}`);
      for (const [name, value] of Object.entries(turn.newly_resolved)) {
        assert.ok(!known.has(name), `${item.id}/${turn.id}: duplicate resolution ${name}`);
        known.set(name, value);
      }
      assert.equal(new Set(turn.pending).size, turn.pending.length);
      for (const name of turn.pending) assert.ok(!known.has(name), `${item.id}/${turn.id}: resolved and pending ${name}`);
    }
  }
});
