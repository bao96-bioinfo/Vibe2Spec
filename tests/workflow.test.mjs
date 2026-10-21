import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { dirname, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const load = async path => JSON.parse(await readFile(resolve(root, path), 'utf8'));
const interview = await load('tests/fixtures/interview/cases.json');
const review = await load('tests/fixtures/review/cases.json');

test('shared skills expose valid names and descriptions using the supported plain frontmatter form', async () => {
  for (const name of ['vibe2spec', 'vibe2spec-worker', 'vibe2spec-review']) {
    const content = await readFile(resolve(root, 'skills', name, 'SKILL.md'), 'utf8');
    const match = content.match(/^---\nname: ([a-z0-9-]+)\ndescription: ([^\n]+)\n---\n/);
    assert.ok(match, `${name}: expected the package's two-field plain YAML frontmatter`);
    assert.equal(match[1], name);
    assert.ok(name.length <= 64 && !name.includes('--'));
    assert.ok(match[2].length > 0 && match[2].length <= 1024);
    assert.doesNotMatch(match[2], /[<>]|^\[TODO:/);
    assert.doesNotMatch(content.slice(match[0].length), /^\s*\[TODO:[^\n]*\]\s*$/m);
  }
});

test('portable workflow entrypoints resolve their actual packaged documentation and templates', async () => {
  const files = [
    'skills/vibe2spec/SKILL.md',
    'skills/vibe2spec-worker/SKILL.md',
    'skills/vibe2spec-review/SKILL.md',
    'skills/vibe2spec/references/lifecycle.md',
    'docs/interview.md',
    'docs/friendly-explanations.md',
    'docs/specification-authoring.md',
    'docs/project-overview.md',
    'docs/review.md',
    'docs/paired-validation.md',
  ];
  let checked = 0;
  for (const file of files) {
    const content = await readFile(resolve(root, file), 'utf8');
    for (const match of content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
      const target = match[1];
      if (/^[a-z]+:|^#/i.test(target)) continue;
      const destination = resolve(root, dirname(file), target.split('#')[0]);
      const local = relative(root, destination);
      assert.ok(local !== '..' && !local.startsWith(`..${sep}`), `${file}: ${target} leaves the package`);
      assert.ok((await stat(destination)).isFile(), `${file}: ${target} is not a file`);
      checked++;
    }
  }
  assert.ok(checked >= 20, 'the portability check must inspect the linked workflow resources');
});

test('interview corpus preserves independently resolved and unresolved choices', () => {
  const ids = new Set();
  for (const item of interview.cases) {
    assert.ok(!ids.has(item.id), `duplicate interview case ${item.id}`);
    ids.add(item.id);
    assert.ok(item.prompt.length > 0);
    assert.ok(item.expected.next_action.length > 0);
    assert.ok(item.expected.prohibited.length > 0);
    for (const decision of item.expected.resolved) {
      assert.ok(!item.expected.unresolved.includes(decision), `${item.id}: ${decision} has conflicting fixture states`);
    }
  }
  const partial = interview.cases.find(item => item.id === 'partial-group-answer');
  assert.deepEqual(partial.expected.resolved, ['output-order', 'input-mutation']);
  assert.deepEqual(partial.expected.unresolved, ['repeated-values', 'actual-threshold']);
});

test('the order explanation uses a shared input that actually distinguishes the alternatives', () => {
  const example = interview.behavioral_examples.find(item => item.id === 'order');
  const retained = example.input.filter(value => value >= example.threshold);
  assert.deepEqual(example.options[0].output, retained);
  assert.deepEqual(example.options[1].output, [...retained].sort((left, right) => left - right));
  assert.notDeepEqual(example.options[0].output, example.options[1].output);
});

test('the duplicate explanation exposes the actual loss of multiplicity', () => {
  const example = interview.behavioral_examples.find(item => item.id === 'duplicates');
  const retained = example.input.filter(value => value >= example.threshold);
  assert.deepEqual(example.options[0].output, retained);
  assert.deepEqual(example.options[1].output, [...new Set(retained)]);
  assert.equal(example.options[0].output.length - example.options[1].output.length, 1);
});

test('the mutation explanation distinguishes input state even with equal return values', () => {
  const example = interview.behavioral_examples.find(item => item.id === 'mutation');
  const [copy, mutation] = example.options;
  assert.deepEqual(copy.output, mutation.output);
  assert.deepEqual(copy.input_after, example.input);
  assert.deepEqual(mutation.input_after, mutation.output);
  assert.notDeepEqual(copy.input_after, mutation.input_after);
});

test('invalid-input options reveal rejection, element loss, and explicit conversion', () => {
  const example = interview.behavioral_examples.find(item => item.id === 'invalid');
  assert.equal(example.options[0].output, undefined);
  assert.ok(example.options[0].error.length > 0);
  assert.deepEqual(example.options[1].output, example.input.filter(Number.isFinite));
  assert.deepEqual(example.options[2].output, example.input.map(Number));
  assert.notDeepEqual(example.options[1].output, example.options[2].output);
});

test('review fixtures distinguish established defects from missing evidence', () => {
  const ids = new Set();
  const phases = new Set();
  const outcomes = new Set();
  for (const item of review.cases) {
    assert.ok(!ids.has(item.id), `duplicate review case ${item.id}`);
    ids.add(item.id);
    phases.add(item.phase);
    outcomes.add(item.expected.outcome);
    assert.ok(item.approved && typeof item.approved === 'object');
    assert.equal(item.expected.outcome === 'pass', item.expected.findings.length === 0);
    assert.ok(item.expected.next_action.length > 0);
  }
  assert.deepEqual([...phases].sort(), ['pre_execution', 'results', 'specification']);
  assert.deepEqual([...outcomes].sort(), ['changes_required', 'pass', 'unable_to_determine']);
});

test('the shared-error fixture agrees pairwise while violating its expected result', () => {
  const item = review.cases.find(item => item.id === 'matching-wrong-pair');
  assert.deepEqual(item.actual.left, item.actual.right);
  assert.notDeepEqual(item.actual.left, item.approved.expected);
  assert.notDeepEqual(item.actual.right, item.approved.expected);
  assert.equal(item.expected.outcome, 'changes_required');
});

test('the numerical fixture passes both reference checks and fails direct comparison', () => {
  const item = review.cases.find(item => item.id === 'reference-pass-pair-fail');
  const { reference, correctness_tolerance, pairwise_tolerance } = item.approved;
  const { left, right } = item.actual;
  assert.ok(Math.abs(left - reference) <= correctness_tolerance);
  assert.ok(Math.abs(right - reference) <= correctness_tolerance);
  assert.ok(Math.abs(left - right) > pairwise_tolerance);
  assert.equal(item.expected.outcome, 'changes_required');
});

test('the changed-criterion fixture really fails its original rule', () => {
  const item = review.cases.find(item => item.id === 'relaxed-tolerance');
  const error = Math.abs(item.actual.observed - item.approved.reference);
  assert.ok(error > item.approved.tolerance);
  assert.ok(error <= item.actual.tolerance_used);
  assert.equal(item.expected.outcome, 'changes_required');
});
