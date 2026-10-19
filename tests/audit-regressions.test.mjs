import test from 'node:test';
import assert from 'node:assert/strict';
import { loadGraph } from '../scripts/graph.mjs';
import { assessLifecycle } from '../scripts/lifecycle.mjs';
import { checkStepReadiness, approvalCovers } from '../scripts/readiness.mjs';
import { compareJson, compareNumbers, compare } from '../scripts/compare.mjs';
import { validateRecord } from '../scripts/records.mjs';
import { isIdentifier } from '../scripts/envelope.mjs';
import { validate } from '../scripts/report.mjs';
import { materialize, ENTRY, fixtureFiles } from './helpers/fixture-graph.mjs';

const p = {
  step: 'records/step/copy-step/r1.json', unit: 'records/unit/copy-unit/r1.json',
  run: 'records/run/copy-run/r1.json', comparison: 'records/comparison/copy-comparison/r1.json',
  acceptance: 'records/acceptance/copy-acceptance/r1.json',
  spec: 'records/snapshot/spec-snapshot/r1.json', approval: 'records/approval/spec-approval/r1.json',
  pair: 'records/decision/pair-choice/r1.json', work: 'records/snapshot/work-snapshot/r1.json',
  workReview: 'records/review/work-review/r1.json', results: 'records/snapshot/results-snapshot/r1.json',
  resultsReview: 'records/review/results-review/r1.json',
};
const ref = path => ({path,sha256:'0'.repeat(64)});
const entry = path => ({...ref(path),size_bytes:0});
const codes = findings => findings.map(f => f.code);
async function inspect(t,edit) {
  const fixture = await materialize({edit}); t.after(fixture.cleanup);
  const graph = await loadGraph(fixture);
  return {graph, lifecycle:assessLifecycle(graph), readiness:checkStepReadiness(graph,p.step,{requireContext:false})};
}
function addSnapshotEntry(files,snapshot,path) {
  files[snapshot].content.content.entries.push(entry(path));
  files[snapshot].content.content.entries.sort((a,b)=>Buffer.compare(Buffer.from(a.path),Buffer.from(b.path)));
}
function paired(files) {
  const step=files[p.step].content.content;
  step.paired_validation.mode='enabled'; step.paired_validation.unit_ids=['copy-unit'];
  files[p.pair].content.content.selection.value='enabled';
  const pairRule='records/decision/pair-rule/r1.json';
  files[pairRule]=structuredClone(files[p.pair]); files[pairRule].content.id='pair-rule';
  files[pairRule].content.content.selection.value=structuredClone(step.checks[0].rule);
  step.decision_refs.push(ref(pairRule)); addSnapshotEntry(files,p.spec,pairRule);
  files[p.approval].content.content.target_paths.push(pairRule);
  const worker={session_id:'example-session',context_id:'example-worker-b'};
  const reviewer={session_id:'example-session',context_id:'example-work-reviewer-b'};
  const work='records/snapshot/work-b/r1.json', workReview='records/review/work-review-b/r1.json', run='records/run/copy-run-b/r1.json';
  files['artifacts/work-b.txt']={encoding:'text',content:'Independent fictional implementation B.\n'};
  files[work]=structuredClone(files[p.work]); files[work].content.id='work-b';
  files[work].content.content.entries=files[work].content.content.entries.filter(e=>e.path!=='artifacts/work.txt');
  addSnapshotEntry(files,work,'artifacts/work-b.txt');
  files[workReview]=structuredClone(files[p.workReview]); files[workReview].content.id='work-review-b';
  files[workReview].content.author=reviewer;
  Object.assign(files[workReview].content.content,{snapshot_ref:ref(work),reviewer,workers:[worker]});
  files[workReview].content.content.artifact_authors.push(worker);
  files[run]=structuredClone(files[p.run]); files[run].content.id='copy-run-b'; files[run].content.author=worker;
  Object.assign(files[run].content.content,{work_snapshot_ref:ref(work),pre_execution_review_ref:ref(workReview),worker});
  const comparison=files[p.comparison].content.content;
  comparison.mode='paired'; comparison.run_refs.push(ref(run)); comparison.worker_contexts.push(worker);
  comparison.correctness_results.push({run_ref:ref(run),results:structuredClone(comparison.correctness_results[0].results)});
  comparison.pairwise_results=comparison.correctness_results[0].results.map(r=>({...r,observed:{left:r.observed,right:structuredClone(r.observed)}}));
  for(const rule of comparison.rules) {rule.pairwise_rule=structuredClone(rule.correctness_rule);rule.pairwise_decision_ref=ref(pairRule);}
  const combined='records/snapshot/combined-work/r1.json';
  files[combined]=structuredClone(files[p.work]); files[combined].content.id='combined-work';
  files[combined].content.content.entries=[entry(p.work),entry(work)].sort((a,b)=>a.path.localeCompare(b.path));
  files[p.acceptance].content.content.work_snapshot_ref=ref(combined); files[p.acceptance].content.content.run_refs.push(ref(run));
  for(const path of [run,combined])addSnapshotEntry(files,p.results,path);
  const resultsReview=files[p.resultsReview].content.content;
  resultsReview.workers.push(worker); resultsReview.artifact_authors.push(reviewer,worker);
  resultsReview.artifact_authors.sort((a,b)=>Buffer.compare(Buffer.from(a.context_id),Buffer.from(b.context_id)));
}

test('approval containing an undeclared workflow field cannot approve a specification',async t=>{
  const {graph,readiness}=await inspect(t,f=>{f[p.approval].content.content.assumed=true;});
  assert(codes(graph.findings).includes('unknown-field'));
  assert.equal(approvalCovers(graph,p.step),false);
  assert(codes(readiness).includes('unapproved-specification'));
});
test('a complete step-specification approval cannot be replaced by independently partial packages',async t=>{
  const {readiness}=await inspect(t,f=>{
    const second='records/approval/partial-spec/r1.json';f[second]=structuredClone(f[p.approval]);f[second].content.id='partial-spec';
    f[second].content.content.target_paths=[p.step];f[p.approval].content.content.target_paths=f[p.approval].content.content.target_paths.filter(path=>path!==p.step);
    f[ENTRY].content.content.evidence_refs.push(ref(second));
  });
  assert(codes(readiness).includes('unapproved-specification'));
});
test('a literal pairing selection cannot contradict the step mode',async t=>{
  const {readiness}=await inspect(t,f=>{f[p.pair].content.content.selection.value='enabled';});
  assert(codes(readiness).includes('association-mismatch'));
});
test('draft execution records cannot establish accepted results',async t=>{
  const {lifecycle}=await inspect(t,f=>{f[p.run].content.lifecycle='draft';});
  assert(codes(lifecycle).includes('association-mismatch'));
});
test('every approved unit fixture must occur in the execution input snapshot',async t=>{
  const {lifecycle}=await inspect(t,f=>{
    f['artifacts/additional-fixture.json']={encoding:'json',content:[4]};
    f[p.unit].content.content.fixture_refs.push(ref('artifacts/additional-fixture.json'));
    addSnapshotEntry(f,p.spec,'artifacts/additional-fixture.json');f[p.approval].content.content.target_paths.push('artifacts/additional-fixture.json');
  });
  assert(lifecycle.some(f=>f.code==='snapshot-membership-mismatch'&&f.pointer==='/content/input_snapshot_ref'));
});
test('recorded additional outputs must belong to approved output or unit write paths',async t=>{
  const {lifecycle}=await inspect(t,f=>{
    f['artifacts/unapproved-output.txt']={encoding:'text',content:'Unapproved side effect.\n'};
    addSnapshotEntry(f,'records/snapshot/output-snapshot/r1.json','artifacts/unapproved-output.txt');
  });
  assert(codes(lifecycle).includes('unapproved-output'));
});
test('recorded additional inputs require an approved input or unit fixture reference',async t=>{
  const {lifecycle}=await inspect(t,f=>{
    f['artifacts/unapproved-input.json']={encoding:'json',content:[7]};
    addSnapshotEntry(f,'records/snapshot/input-snapshot/r1.json','artifacts/unapproved-input.json');
  });
  assert(codes(lifecycle).includes('unapproved-input'));
});
test('approved project-wide decisions participate in complete run and specification scope',async t=>{
  const {graph,readiness,lifecycle}=await inspect(t,f=>{
    const path='records/decision/project-setting/r1.json';f[path]=structuredClone(f[p.pair]);f[path].content.id='project-setting';
    f[path].content.content.selection.value='explicit';f[ENTRY].content.content.project_settings['project-setting']=ref(path);
    addSnapshotEntry(f,p.spec,path);f[p.approval].content.content.target_paths.push(path);
    f[p.run].content.content.effective_settings.push({name:'project-setting',value:'explicit',decision_ref:ref(path),source:'Approved project-wide setting.'});
  });
  assert.deepEqual(graph.findings,[]);assert.deepEqual(readiness,[]);assert.deepEqual(lifecycle,[]);
});
test('paired lifecycle checks accept complete explicitly bound evidence',async t=>{
  const {graph,lifecycle}=await inspect(t,paired);
  assert.deepEqual(graph.findings,[]);assert.deepEqual(lifecycle,[]);
});
test('a pairwise rule must equal the exact rule selected by its approved decision',async t=>{
  const {lifecycle}=await inspect(t,f=>{paired(f);f['records/decision/pair-rule/r1.json'].content.content.selection.value={category:'exact_bytes'};});
  assert(lifecycle.some(f=>f.code==='effective-setting-mismatch'&&f.pointer==='/content/rules/0/pairwise_rule'));
});
test('uninterpreted pairwise decisions cannot establish a mechanical pass',async t=>{
  const {lifecycle}=await inspect(t,f=>{paired(f);f['records/decision/pair-rule/r1.json'].content.content.selection.value='Use something sufficiently close.';});
  assert(lifecycle.some(f=>f.code==='check-not-supported'&&f.pointer==='/content/rules/0/pairwise_decision_ref'));
});
test('honest failed historical attempts do not replace or invalidate selected successful results',async t=>{
  const {graph,lifecycle}=await inspect(t,f=>{
    const historical='records/run/failed-attempt/r1.json';f[historical]=structuredClone(f[p.run]);f[historical].content.id='failed-attempt';
    Object.assign(f[historical].content.content.check_results[0],{outcome:'fail',observed:{input:[1,2,3],output:[9]},detail:'Preserved failed attempt, excluded from acceptance.'});
    f[ENTRY].content.content.evidence_refs.push(ref(historical));
  });
  assert.deepEqual(graph.findings,[]);assert.deepEqual(lifecycle,[]);
});
test('wrong-kind references stop traversal before a target can disclose further paths',async t=>{
  const {graph}=await inspect(t,f=>{
    const orphan='records/decision/wrong-unit/r1.json';f[orphan]=structuredClone(f[p.pair]);f[orphan].content.id='wrong-unit';
    f[orphan].content.content.evidence_refs=[ref('/not-authorized/should-not-be-read.json')];
    f[p.step].content.content.unit_refs=[ref(orphan)];
  });
  assert(codes(graph.findings).includes('reference-kind-mismatch'));
  assert(!codes(graph.findings).includes('access-not-authorized'));
});
test('exact JSON comparisons reject hidden fields, accessors and malformed Unicode',()=>{
  const hidden={};Object.defineProperty(hidden,'extra',{value:1});
  assert.equal(compareJson(hidden,{}).outcome,'unable_to_determine');
  assert.equal(compareJson('\ud800','\ud800').outcome,'unable_to_determine');
  let calls=0;const rule={};Object.defineProperty(rule,'category',{enumerable:true,get(){calls++;return 'exact_json';}});
  assert.equal(compare({}, {}, rule).outcome,'unable_to_determine');assert.equal(calls,0);
});
test('comparison depth uses the parser convention of 64 containers, inclusive',()=>{
  let value=1;for(let i=0;i<64;i++)value=[value];
  assert.equal(compareJson(value,value).outcome,'pass');
  assert.equal(compareJson([value],[value]).outcome,'unable_to_determine');
});
test('relative error overflow and signed zero cannot manufacture a pass',()=>{
  const rule={category:'numerical',metric:'relative_error',tolerance:1,boundary:'inclusive',zero_policy:'exact',nonfinite_policy:'reject',alignment:'position',checker_ref:ref('scripts/compare.mjs')};
  assert.equal(compareNumbers(Number.MAX_SAFE_INTEGER,Number.MIN_VALUE,rule).outcome,'fail');
  assert.equal(compareNumbers(-0,0,rule).outcome,'fail');
});
test('reusable record validation rejects unsafe literal integers without file parsing',async()=>{
  const {files}=await fixtureFiles();const decision=files[p.pair].content;
  decision.content.selection.value={precision:Number.MAX_SAFE_INTEGER+1};
  assert(codes(validateRecord(decision)).includes('invalid-number'));
});
test('identifiers, digests and decimal tolerances reject every trailing Unicode line terminator',async()=>{
  const {files}=await fixtureFiles();
  for(const ending of ['\n','\r','\u2028','\u2029']) {
    assert.equal(isIdentifier('valid-id'+ending),false);
    const step=structuredClone(files[p.step].content);
    step.content.documents.spec.sha256+=''+ending;
    assert(codes(validateRecord(step)).includes('invalid-digest'));
    step.content.checks[0].rule={category:'numerical',metric:'absolute_error',tolerance:'0.1'+ending,boundary:'inclusive',zero_policy:'exact',nonfinite_policy:'reject',alignment:'position',checker_ref:ref('scripts/compare.mjs')};
    assert(codes(validateRecord(step)).includes('invalid-number'));
    const rule={...step.content.checks[0].rule,tolerance:0.1,checker_ref:{path:'scripts/compare.mjs',sha256:'0'.repeat(64)+ending}};
    assert.equal(compareNumbers(1,1,rule).outcome,'unable_to_determine');
  }
});
test('unsupported numerical inputs remain indeterminate even when shapes differ',()=>{
  const rule={category:'numerical',metric:'absolute_error',tolerance:1,boundary:'inclusive',zero_policy:'exact',nonfinite_policy:'reject',alignment:'position',checker_ref:ref('scripts/compare.mjs')};
  assert.equal(compareNumbers([,1],[],rule).outcome,'unable_to_determine');
  assert.equal(compareNumbers({},[1],rule).outcome,'unable_to_determine');
  assert.equal(compareNumbers(1,1,{...rule,tolerance:Number.MAX_SAFE_INTEGER+1}).outcome,'unable_to_determine');
});
test('malformed nested records produce structural findings rather than internal failures',async t=>{
  for(const edit of [
    f=>{f[ENTRY].content.content.states=[null];},
    f=>{f[p.step].content.content.checks=[null];},
    f=>{f[p.run].content.content.check_results=[null];},
    f=>{f[p.comparison].content.content.correctness_results=[null];},
    f=>{f[p.resultsReview].content.content.artifact_authors=[null];},
  ]) {
    const fixture=await materialize({edit});t.after(fixture.cleanup);
    const report=await validate({...fixture,operation:'implementation_readiness'});
    assert.equal(report.exit_status,1);assert.equal(report.structure,'invalid');
    assert(!report.findings.some(f=>f.category==='internal'));
  }
});
