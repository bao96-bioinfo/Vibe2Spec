import test from 'node:test';
import assert from 'node:assert/strict';
import { loadGraph } from '../scripts/graph.mjs';
import { assessLifecycle } from '../scripts/lifecycle.mjs';
import { materialize, ENTRY } from './helpers/fixture-graph.mjs';
const codes = findings => findings.map(f => f.code);
const paths={step:'records/step/copy-step/r1.json',run:'records/run/copy-run/r1.json',comparison:'records/comparison/copy-comparison/r1.json',acceptance:'records/acceptance/copy-acceptance/r1.json',specReview:'records/review/spec-review/r1.json',workReview:'records/review/work-review/r1.json',resultsReview:'records/review/results-review/r1.json'};
async function inspect(t,edit = null,caseId = null) {const fixture=await materialize({edit,caseId});t.after(fixture.cleanup);const graph=await loadGraph(fixture);return {graph,findings:assessLifecycle(graph)};}
for(const caseId of ['state-provisional','state-interviewing','state-awaiting-specification','state-ready-to-implement','state-awaiting-pre-execution-review','state-ready-to-execute','state-awaiting-results-review','state-awaiting-acceptance','reopened-state']) {
  test(`accepted state fixture ${caseId} remains mechanically coherent`,async t=> {const {graph,findings}=await inspect(t,null,caseId);assert.deepEqual(graph.findings,[]);assert.deepEqual(findings,[]);});
}
test('finished state without acceptance is blocked',async t=>{const {findings}=await inspect(t,null,'missing-acceptance');assert(codes(findings).includes('missing-acceptance'));});
test('a passing label cannot conceal an incorrect observed output',async t=> {
 const {findings}=await inspect(t,f=>{f[paths.run].content.content.check_results[0].observed.output=[9];f[paths.comparison].content.content.correctness_results[0].results[0].observed.output=[9];});
 assert(codes(findings).includes('check-not-passing'));
});
test('the actual effective setting must equal its approved literal value',async t=> {
 const {findings}=await inspect(t,f=>{f[paths.run].content.content.effective_settings[0].value.operation='reverse';});
 assert(codes(findings).includes('effective-setting-mismatch'));
});
test('unapproved runtime setting cannot hide behind another approved decision',async t=> {
 const {findings}=await inspect(t,f=>{f[paths.run].content.content.effective_settings[0].decision_ref=f[paths.step].content.content.input_refs[0];});
 assert(codes(findings).includes('unapproved-effective-setting'));
});
test('review independence includes transitive authors omitted from declared list',async t=> {
 const {findings}=await inspect(t,f=>{const r=f[paths.resultsReview].content;r.author={session_id:'example-session',context_id:'example-spec-reviewer'};r.content.reviewer=structuredClone(r.author);r.content.artifact_authors=r.content.artifact_authors.filter(a=>a.context_id!=='example-spec-reviewer');});
 assert(codes(findings).includes('review-not-independent'));assert(codes(findings).includes('association-mismatch'));
});
test('an unrelated results review cannot finalize a result',async t=> {
 const {findings}=await inspect(t,f=>{f[paths.resultsReview].content.content.snapshot_ref=f[paths.specReview].content.content.snapshot_ref;});
 assert(codes(findings).includes('missing-results-review'));
});
test('a pre-execution review must bind the actual work snapshot',async t=> {
 const {findings}=await inspect(t,f=>{f[paths.workReview].content.content.snapshot_ref=f[paths.specReview].content.content.snapshot_ref;});
 assert(codes(findings).includes('missing-pre-execution-review'));
});
test('comparison rules cannot relax the approved check',async t=> {
 const {findings}=await inspect(t,f=>{f[paths.comparison].content.content.rules[0].correctness_rule={category:'exact_bytes'};});
 assert(codes(findings).includes('association-mismatch'));
});
test('missing comparison evidence blocks accepted results',async t=> {
 const {findings}=await inspect(t,f=>{f[paths.acceptance].content.content.comparison_refs=[];});
 assert(codes(findings).includes('missing-comparison-coverage'));
});
test('a reopened state requires exact-scope approval of the amendment',async t=> {
 const {findings}=await inspect(t,f=>{const p=f[ENTRY].content.content;p.current_step_id='copy-step';p.states[0]={step_id:'copy-step',revision:2,state:'reopened',acceptance_ref:null,amendment_ref:null,blocked_by:[]};});
 assert(codes(findings).includes('missing-reopening-approval'));
});
test('run result groups cannot report observations different from the saved run',async t=> {
 const {findings}=await inspect(t,f=>{f[paths.comparison].content.content.correctness_results[0].results[0].observed.input=[0];});
 assert(codes(findings).includes('association-mismatch'));
});
test('unknown numerical checker semantics remain incomplete instead of passing',async t=> {
 const {findings}=await inspect(t,f=>{const rule={category:'numerical',metric:'arbitrary scientific metric',tolerance:1,boundary:'inclusive',zero_policy:'documented',nonfinite_policy:'reject',alignment:'position',checker_ref:f[paths.step].content.content.documents.spec};f[paths.step].content.content.checks[0].rule=rule;f[paths.comparison].content.content.rules[0].correctness_rule=structuredClone(rule);});
 assert(codes(findings).includes('check-not-supported'));
});
test('awaiting acceptance cannot omit all unit comparison evidence',async t=> {
 const {findings}=await inspect(t,f=>{const p=f[ENTRY].content.content;p.current_step_id='copy-step';p.states[0].state='awaiting_acceptance';p.states[0].acceptance_ref=null;p.evidence_refs=p.evidence_refs.filter(r=>!r.path.includes('/acceptance/')&&!r.path.includes('/comparison/'));const entries=f['records/snapshot/results-snapshot/r1.json'].content.content.entries;f['records/snapshot/results-snapshot/r1.json'].content.content.entries=entries.filter(e=>!e.path.includes('/comparison/'));});
 assert(codes(findings).includes('missing-results-review'));
});
test('a specification snapshot alone cannot stand in for prepared code',async t=> {
 const {findings}=await inspect(t,f=>{f['records/snapshot/work-snapshot/r1.json'].content.content.entries=f['records/snapshot/work-snapshot/r1.json'].content.content.entries.filter(e=>e.path!=='artifacts/work.txt');});
 assert(codes(findings).includes('missing-prepared-work'));assert(codes(findings).includes('snapshot-membership-mismatch'));
});
test('results reviewer must identify the relevant run worker',async t=> {
 const {findings}=await inspect(t,f=>{f[paths.resultsReview].content.content.workers=[];});
 assert(codes(findings).includes('association-mismatch'));
});
test('new revised specification files must belong to the approved amendment inventory',async t=> {
 const {findings}=await inspect(t,f=>{
   const p=f[ENTRY].content.content;
   p.current_step_id='copy-step';p.states[0]={step_id:'copy-step',revision:2,state:'awaiting_specification',acceptance_ref:null,amendment_ref:{path:'records/amendment/proposed-amendment/r1.json',sha256:'0'.repeat(64)},blocked_by:[]};
   p.evidence_refs.push({path:'records/approval/reopen-approval/r1.json',sha256:'0'.repeat(64)});
   const revised=structuredClone(f[paths.step]);revised.content.revision=2;revised.content.lifecycle='draft';
   revised.content.content.documents.spec={path:'artifacts/unlisted-revision.md',sha256:'0'.repeat(64)};
   f['artifacts/unlisted-revision.md']={encoding:'text',content:'An unlisted revised specification.\n'};
   f['records/step/copy-step/r2.json']=revised;
   // Use an ordinary snapshot reference to make the draft explicitly reachable.
   f['records/snapshot/amendment-snapshot/r1.json'].content.content.entries.push({path:'records/step/copy-step/r2.json',sha256:'0'.repeat(64),size_bytes:0});
 });
 assert(codes(findings).includes('amendment-scope-changed'));
});
