import test from 'node:test';
import assert from 'node:assert/strict';
import { appendFile } from 'node:fs/promises';
import { join } from 'node:path';
import { loadGraph } from '../scripts/graph.mjs';
import { getReferences, validateRecord } from '../scripts/records.mjs';
import { coverageMatches, reviewFindings, scopePaths } from '../scripts/readiness.mjs';
import { materialize } from './helpers/fixture-graph.mjs';

const CURRENT = 'records/review/correction-review/r1.json';
const BASELINE = 'records/review/baseline-review/r1.json';
const CURRENT_SNAPSHOT = 'records/snapshot/correction-snapshot/r1.json';
const BASELINE_SNAPSHOT = 'records/snapshot/baseline-snapshot/r1.json';
const STEP = 'records/step/copy-step/r1.json';
const STABLE = 'artifacts/stable.txt', BEFORE = 'artifacts/before.txt', AFTER = 'artifacts/after.txt', DEPENDENCY = 'artifacts/dependency.txt';
const ref = path => ({path,sha256:'0'.repeat(64)});
const content = (files,path) => files[path].content.content;
const codes = issues => issues.map(issue => issue.code);
function dependencies(files,start) {
  const seen = new Set(), pending = [start];
  while (pending.length) {
    const file = pending.pop();
    if (seen.has(file)) continue;
    seen.add(file);
    for (const descriptor of getReferences(files[file]?.content)) {
      if (descriptor.pointer !== '/content/continuation/baseline_review_ref') pending.push(descriptor.ref.path);
    }
  }
  return [...seen].filter(file => files[file]?.content?.kind !== 'snapshot').sort();
}
function prepare(files,{withChecks = false} = {}) {
  for (const [path,text] of [[STABLE,'Stable input.'],[BEFORE,'Incorrect content.'],[AFTER,'Corrected content.'],[DEPENDENCY,'Unchanged dependency.']]) files[path] = {encoding:'text',content:text};
  const author = {session_id:'example-session',context_id:'example-author'};
  for (const [path,id,target] of [[BASELINE_SNAPSHOT,'baseline-snapshot',BEFORE],[CURRENT_SNAPSHOT,'correction-snapshot',AFTER]]) {
    const snapshot = structuredClone(files['records/snapshot/spec-snapshot/r1.json']);
    snapshot.content.id = id;
    snapshot.content.author = structuredClone(author);
    snapshot.content.content.entries = [STABLE,target,DEPENDENCY,...(withChecks ? [STEP] : [])].sort().map(path => ({...ref(path),size_bytes:0}));
    files[path] = snapshot;
  }
  const extraDependencies = withChecks ? dependencies(files,STEP) : [];
  const checkIds = withChecks ? content(files,STEP).checks.map(check => check.id) : [];
  const item = (id,path,outcome) => ({id,input_refs:[ref(path)],dependency_refs:id === 'stable-area' ? [DEPENDENCY,...extraDependencies].map(ref) : [],check_ids:id === 'stable-area' ? checkIds : [],outcome});
  for (const [path,id,snapshot,target,outcome] of [[BASELINE,'baseline-review',BASELINE_SNAPSHOT,BEFORE,'changes_required'],[CURRENT,'correction-review',CURRENT_SNAPSHOT,AFTER,'pass']]) {
    const review = structuredClone(files['records/review/spec-review/r1.json']);
    review.content.id = id;
    review.content.content.snapshot_ref = ref(snapshot);
    review.content.content.artifact_authors = [structuredClone(author)];
    review.content.content.workers = [];
    review.content.content.outcome = outcome;
    review.content.content.findings = outcome === 'pass' ? [] : [{code:'incorrect-content',path:BEFORE,message:'The content does not satisfy the approved contract.'}];
    review.content.content.coverage = [item('stable-area',STABLE,'pass'),item('corrected-area',target,outcome)];
    files[path] = review;
  }
  content(files,CURRENT).continuation = {baseline_review_ref:ref(BASELINE),reused_coverage_ids:['stable-area'],finding_resolutions:[{code:'incorrect-content',path:BEFORE,coverage_ids:['corrected-area'],detail:'Corrected the content and checked the preserved replacement.'}]};
}
async function inspect(t,{edit = null,withChecks = false} = {}) {
  const fixture = await materialize({edit:files => { prepare(files,{withChecks}); edit?.(files); }});
  t.after(fixture.cleanup);
  const graph = await loadGraph({...fixture,entry:CURRENT});
  return {graph,files:fixture.files,issues:reviewFindings(graph,CURRENT)};
}

test('a correction reuses an explicit pass from a changes-required baseline with the same independent reviewer',async t => {
  const {graph,issues} = await inspect(t);
  assert.deepEqual(graph.findings,[]);
  assert.deepEqual(issues,[]);
  assert(graph.records.has(BASELINE),'historical evidence is still loaded');
  assert(!scopePaths(graph,CURRENT).has(BASELINE),'historical evidence is not assessment scope');
  assert.deepEqual(reviewFindings(graph,BASELINE,{requirePass:false}),[]);
  assert.equal(graph.records.get(CURRENT).content.reviewer.context_id,graph.records.get(BASELINE).content.reviewer.context_id);
});

test('coverage equality compares exact unordered sets and ignores decision outcomes',() => {
  const a = {id:'area',input_refs:[ref('a'),ref('b')],dependency_refs:[ref('c')],check_ids:['one','two'],outcome:'pass'};
  const b = {...a,input_refs:[...a.input_refs].reverse(),check_ids:[...a.check_ids].reverse(),outcome:'changes_required'};
  assert(coverageMatches(a,b));
  assert(!coverageMatches(a,{...b,dependency_refs:[]}));
  assert(!coverageMatches(a,{...b,input_refs:[ref('a'),ref('a')]}));
  assert(!coverageMatches(a,{...b,id:'another-area'}));
});

test('optional review fields preserve legacy shape, closed fields, ordering, and declared references',async t => {
  const {graph} = await inspect(t);
  const review = structuredClone(graph.records.get(CURRENT));
  assert.deepEqual(validateRecord(review),[]);
  const refs = getReferences(review);
  assert(refs.some(item => item.pointer === '/content/continuation/baseline_review_ref' && item.kind === 'review'));
  assert(refs.some(item => item.pointer === '/content/coverage/0/dependency_refs/0'));
  const legacy = structuredClone(review); delete legacy.content.continuation; delete legacy.content.coverage;
  assert.deepEqual(validateRecord(legacy),[]);
  const wrongOrder = structuredClone(review); const saved = wrongOrder.content.coverage;
  delete wrongOrder.content.coverage; wrongOrder.content.coverage = saved;
  assert(codes(validateRecord(wrongOrder)).includes('invalid-field-order'));
  const absent = structuredClone(review); delete absent.content.coverage;
  assert(validateRecord(absent).some(item => item.code === 'missing-field' && item.pointer === '/content/coverage'));
  const duplicate = structuredClone(review); duplicate.content.coverage.push(structuredClone(duplicate.content.coverage[0]));
  assert(codes(validateRecord(duplicate)).includes('duplicate-value'));
  const overlapping = structuredClone(review); overlapping.content.coverage[0].dependency_refs.push(structuredClone(overlapping.content.coverage[0].input_refs[0]));
  assert(validateRecord(overlapping).some(item => item.code === 'duplicate-value' && item.pointer === '/content/coverage/0/dependency_refs/1'));
  review.content.extra = true; assert(codes(validateRecord(review)).includes('unknown-field'));
});

for (const change of ['input','dependency','removed-dependency']) test(`reuse rejects ${change} changes`,async t => {
  const {graph,issues} = await inspect(t,{edit:files => {
    const item = content(files,CURRENT).coverage[0];
    if (change === 'removed-dependency') { item.dependency_refs = []; content(files,CURRENT).coverage[1].dependency_refs.push(ref(DEPENDENCY)); return; }
    const previous = change === 'input' ? STABLE : DEPENDENCY;
    const replacement = `artifacts/new-${change}.txt`;
    files[replacement] = {encoding:'text',content:'Changed content.'};
    content(files,CURRENT_SNAPSHOT).entries = content(files,CURRENT_SNAPSHOT).entries.map(entry => entry.path === previous ? {...ref(replacement),size_bytes:0} : entry).sort((a,b) => a.path.localeCompare(b.path));
    item[change === 'input' ? 'input_refs' : 'dependency_refs'] = [ref(replacement)];
  }});
  assert.deepEqual(graph.findings,[]);
  assert(codes(issues).includes('review-reuse-mismatch'));
});

test('a changed comparison definition invalidates reuse despite unchanged direct input and check ID',async t => {
  const {graph,issues} = await inspect(t,{withChecks:true,edit:files => {
    const revisedPath = 'records/step/copy-step/r2.json';
    const revised = structuredClone(files[STEP]); revised.content.revision = 2;
    revised.content.content.checks[0].expected = {changed:true};
    files[revisedPath] = revised;
    content(files,CURRENT_SNAPSHOT).entries = content(files,CURRENT_SNAPSHOT).entries.map(entry => entry.path === STEP ? {...ref(revisedPath),size_bytes:0} : entry);
    content(files,CURRENT).coverage[0].dependency_refs = [DEPENDENCY,...dependencies(files,revisedPath)].map(ref);
  }});
  assert.deepEqual(graph.findings,[]);
  assert(codes(issues).includes('review-reuse-mismatch'));
});

test('explicit coverage checks include the owning step and all its dependencies',async t => {
  const good = await inspect(t,{withChecks:true});
  assert.deepEqual(good.graph.findings,[]); assert.deepEqual(good.issues,[]);
  const incomplete = await inspect(t,{withChecks:true,edit:files => {
    const item = content(files,CURRENT).coverage[0];
    const omitted = item.dependency_refs.find(value => value.path === 'artifacts/spec.md');
    item.dependency_refs = item.dependency_refs.filter(value => value !== omitted);
    content(files,CURRENT).coverage[1].dependency_refs.push(omitted);
    content(files,CURRENT).continuation.reused_coverage_ids = [];
  }});
  assert(codes(incomplete.issues).includes('review-coverage-dependency-missing'));
});

test('an uncovered current artifact or required check prevents a pass',async t => {
  const artifact = await inspect(t,{edit:files => {
    files['artifacts/uncovered.txt'] = {encoding:'text',content:'New review obligation.'};
    content(files,CURRENT_SNAPSHOT).entries.push({...ref('artifacts/uncovered.txt'),size_bytes:0});
  }});
  assert(codes(artifact.issues).includes('review-coverage-missing'));
  const check = await inspect(t,{withChecks:true,edit:files => { content(files,CURRENT).coverage[0].check_ids = []; }});
  assert(codes(check.issues).includes('review-coverage-missing'));
  const unknown = await inspect(t,{edit:files => { content(files,CURRENT).coverage[1].check_ids = ['unknown-check']; }});
  assert(codes(unknown.issues).includes('review-coverage-check-mismatch'));
});

test('unknown reused IDs and a nonpassing baseline item cannot substitute for explicit positive coverage',async t => {
  const unknown = await inspect(t,{edit:files => { content(files,CURRENT).continuation.reused_coverage_ids.push('unknown-area'); }});
  assert(codes(unknown.issues).includes('review-reuse-mismatch'));
  const unpassed = await inspect(t,{edit:files => { content(files,BASELINE).coverage[0].outcome = 'unable_to_determine'; }});
  assert(codes(unpassed.issues).includes('review-reuse-mismatch'));
});

test('coverage cannot introduce an artifact outside the current assessment snapshot',async t => {
  const {graph,issues} = await inspect(t,{edit:files => {
    files['artifacts/outside.txt'] = {encoding:'text',content:'Outside the reviewed scope.'};
    content(files,CURRENT).coverage[1].dependency_refs.push(ref('artifacts/outside.txt'));
  }});
  assert.deepEqual(graph.findings,[]);
  assert(codes(issues).includes('review-coverage-reference-invalid'));
});

test('overwritten baseline bytes are rejected under the original preserved reference',async t => {
  const fixture = await materialize({edit:files => prepare(files)}); t.after(fixture.cleanup);
  await appendFile(join(fixture.workspace,BASELINE),'\n');
  const graph = await loadGraph({...fixture,entry:CURRENT});
  assert(codes(graph.findings).includes('digest-mismatch'));
  assert(codes(reviewFindings(graph,CURRENT)).includes('review-baseline-invalid'));
});

for (const invalid of ['omitted','reused-only','mixed-fresh-reused','unrelated-fresh','unknown-finding','duplicate','empty-detail']) test(`finding resolution cannot establish a pass when ${invalid}`,async t => {
  const {issues} = await inspect(t,{edit:files => {
    const continuation = content(files,CURRENT).continuation;
    const resolution = continuation.finding_resolutions[0];
    if (invalid === 'omitted') continuation.finding_resolutions = [];
    if (invalid === 'reused-only') resolution.coverage_ids = ['stable-area'];
    if (invalid === 'mixed-fresh-reused') resolution.coverage_ids = ['corrected-area','stable-area'];
    if (invalid === 'unrelated-fresh') { continuation.reused_coverage_ids = []; resolution.coverage_ids = ['stable-area']; }
    if (invalid === 'unknown-finding') resolution.code = 'other-finding';
    if (invalid === 'duplicate') continuation.finding_resolutions.push(structuredClone(resolution));
    if (invalid === 'empty-detail') resolution.detail = '   ';
  }});
  assert(codes(issues).some(code => ['review-finding-resolution-invalid','review-finding-unresolved'].includes(code)));
});

test('nonpassing corrections can leave findings unresolved and whole-review resolutions can use an associated fresh item',async t => {
  const pending = await inspect(t,{edit:files => {
    const c = content(files,CURRENT); c.outcome = 'changes_required'; c.coverage[1].outcome = 'changes_required';
    c.findings = [{code:'incorrect-content',path:AFTER,message:'Still requires correction.'}]; c.continuation.finding_resolutions = [];
  }});
  assert.deepEqual(reviewFindings(pending.graph,CURRENT,{requirePass:false}),[]);
  assert(codes(pending.issues).includes('review-not-passing'));
  const whole = await inspect(t,{edit:files => {
    content(files,BASELINE).findings[0].path = '';
    content(files,BASELINE).coverage[0].outcome = 'changes_required';
    content(files,CURRENT).continuation.reused_coverage_ids = [];
    content(files,CURRENT).continuation.finding_resolutions[0].path = '';
  }});
  assert.deepEqual(whole.issues,[]);
});

for (const invalid of ['legacy','wrong-phase','draft','unable','incomplete-coverage','ambiguous-findings','invalid-finding-path']) test(`baseline cannot support continuation when ${invalid}`,async t => {
  const {issues} = await inspect(t,{edit:files => {
    const c = content(files,BASELINE);
    if (invalid === 'legacy') delete c.coverage;
    if (invalid === 'wrong-phase') c.phase = 'results';
    if (invalid === 'draft') files[BASELINE].content.lifecycle = 'draft';
    if (invalid === 'unable') c.outcome = 'unable_to_determine';
    if (invalid === 'incomplete-coverage') c.coverage = c.coverage.slice(0,1);
    if (invalid === 'ambiguous-findings') c.findings.push(structuredClone(c.findings[0]));
    if (invalid === 'invalid-finding-path') c.findings[0].path = `${BEFORE}:3`;
  }});
  assert(codes(issues).some(code => ['review-baseline-invalid','review-coverage-required','review-finding-ambiguous'].includes(code)));
});

test('findings on an input, shared dependency, or whole review contradict explicit passing coverage',async t => {
  for (const path of [STABLE,DEPENDENCY,'']) {
    const {graph,issues} = await inspect(t,{edit:files => { content(files,BASELINE).findings[0].path = path; }});
    assert(codes(reviewFindings(graph,BASELINE,{requirePass:false})).includes('review-coverage-finding-conflict'));
    assert(codes(issues).includes('review-baseline-invalid'));
  }
  const ambiguous = await inspect(t,{edit:files => { content(files,BASELINE).findings.push(structuredClone(content(files,BASELINE).findings[0])); }});
  assert(codes(reviewFindings(ambiguous.graph,BASELINE,{requirePass:false})).includes('review-finding-ambiguous'));
});

test('legacy full reviews still pass without incremental fields',async t => {
  const {graph,issues} = await inspect(t,{edit:files => { const c = content(files,CURRENT); delete c.coverage; delete c.continuation; }});
  assert.deepEqual(graph.findings,[]); assert.deepEqual(issues,[]);
});

test('continuation preserves worker and transitive-author independence',async t => {
  const worker = await inspect(t,{edit:files => { content(files,CURRENT).workers = [structuredClone(content(files,CURRENT).reviewer)]; }});
  assert(codes(worker.issues).includes('review-not-independent'));
  const author = await inspect(t,{edit:files => { files[CURRENT_SNAPSHOT].content.author = structuredClone(content(files,CURRENT).reviewer); }});
  assert(codes(author.issues).includes('review-not-independent'));
  const included = await inspect(t,{edit:files => {
    content(files,CURRENT_SNAPSHOT).entries.push({...ref(BASELINE),size_bytes:0});
    content(files,CURRENT_SNAPSHOT).entries.sort((a,b) => a.path.localeCompare(b.path));
  }});
  assert(codes(included.issues).includes('review-baseline-in-scope'));
  assert(codes(included.issues).includes('review-not-independent'));
});

function extendChain(files,count) {
  let prior = BASELINE;
  for (let index = 0; index < count; index++) {
    const path = `records/review/chain-${index}/r1.json`;
    files[path] = structuredClone(files[CURRENT]); files[path].content.id = `chain-${index}`;
    const c = content(files,path); c.continuation.baseline_review_ref = ref(prior);
    if (index > 0) { c.continuation.reused_coverage_ids = c.coverage.map(item => item.id); c.continuation.finding_resolutions = []; }
    prior = path;
  }
  const c = content(files,CURRENT); c.continuation.baseline_review_ref = ref(prior);
  c.continuation.reused_coverage_ids = c.coverage.map(item => item.id); c.continuation.finding_resolutions = [];
}
test('valid continuation chains retain evidence and invalid inherited evidence blocks descendants',async t => {
  const valid = await inspect(t,{edit:files => extendChain(files,2)});
  assert.deepEqual(valid.graph.findings,[]); assert.deepEqual(valid.issues,[]);
  const invalid = await inspect(t,{edit:files => { extendChain(files,2); content(files,'records/review/chain-0/r1.json').continuation.finding_resolutions = []; }});
  assert(codes(invalid.issues).includes('review-baseline-invalid'));
  assert(codes(invalid.issues).includes('review-finding-unresolved'));
});
test('continuation recursion is bounded and defends against cyclic caller graphs',async t => {
  const deep = await inspect(t,{edit:files => extendChain(files,64)});
  assert.deepEqual(deep.graph.findings,[]);
  assert(codes(deep.issues).includes('review-continuation-depth'));
  const cycle = await inspect(t);
  cycle.graph.records.get(CURRENT).content.continuation.baseline_review_ref = {path:CURRENT,sha256:cycle.graph.artifacts.get(CURRENT).sha256};
  assert(codes(reviewFindings(cycle.graph,CURRENT)).includes('review-continuation-cycle'));
});
