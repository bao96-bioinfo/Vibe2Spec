import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { loadGraph } from '../scripts/graph.mjs';
import { assessLifecycle } from '../scripts/lifecycle.mjs';
import { assessReadiness } from '../scripts/readiness.mjs';

const workspace=path.resolve(fileURLToPath(new URL('../examples/project-cycle/workspace/',import.meta.url)));
const entry=revision=>`records/project/project-state/r${revision}.json`;
const load=revision=>loadGraph({workspace,entry:entry(revision)});
const codes=findings=>findings.map(f=>f.code);
const expectedStates=[
 ['awaiting_acceptance','provisional'],
 ['finished','interviewing'],
 ['reopened','suspended'],
 ['finished','interviewing'],
 ['finished','finished']
];

for(let revision=1;revision<=5;revision++)test(`saved fictional project state ${revision} has exact references and coherent lifecycle`,async()=>{
 const graph=await load(revision);
 assert.equal(graph.complete,true);
 assert.deepEqual(graph.findings,[]);
 assert.deepEqual(assessLifecycle(graph),[]);
 assert.deepEqual(graph.records.get(entry(revision)).content.states.map(s=>s.state),expectedStates[revision-1]);
 for(const record of graph.records.values())assert.equal(record.context,'example');
 assert(codes(assessReadiness(graph)).includes('non-project-context'),'Fictional evidence must not establish real-project implementation readiness.');
});

test('presented next-step draft remains unresolved despite complete future records on disk',async()=>{
 const graph=await load(2);
 const draft=graph.records.get('records/step/summary-step/r1.json');
 assert.equal(draft.lifecycle,'draft');
 assert.equal(draft.content.documents,null);
 assert.equal(draft.content.checks,null);
 assert.equal(graph.records.has('records/acceptance/summary-copy-acceptance/r2.json'),false);
 assert(codes(assessReadiness(graph)).includes('incomplete-step'));
});

test('reopening suspends the dependent step and does not discover future acceptance',async()=>{
 const graph=await load(3),states=graph.records.get(entry(3)).content.states;
 assert.deepEqual(states[1].blocked_by,['copy-step']);
 assert.equal(states[0].acceptance_ref,null);
 assert.equal(graph.records.has('records/acceptance/copy-acceptance/r2.json'),false);
 assert.equal(graph.records.has('records/acceptance/copy-acceptance/r1.json'),true);
 states[1].state='interviewing';states[1].blocked_by=[];
 assert(codes(assessLifecycle(graph)).includes('stale-dependency-evidence'));
});

test('a passing results review cannot replace explicit acceptance',async()=>{
 const graph=await load(1),state=graph.records.get(entry(1)).content.states[0];
 assert.equal(graph.records.get('records/review/results-review/r1.json').content.outcome,'pass');
 state.state='finished';
 assert(codes(assessLifecycle(graph)).includes('missing-acceptance'));
});

test('renewed acceptance binds the revised specification and leaves the original result intact',async()=>{
 const graph=await load(4);
 const old=graph.records.get('records/acceptance/copy-acceptance/r1.json');
 const renewed=graph.records.get('records/acceptance/copy-acceptance/r2.json');
 assert.equal(old.content.step_revision,1);assert.equal(renewed.content.step_revision,2);
 assert.notEqual(old.content.spec_snapshot_ref.path,renewed.content.spec_snapshot_ref.path);
 assert.deepEqual(JSON.parse(graph.artifacts.get('artifacts/output.json').bytes),[1,2,3]);
 assert.deepEqual(JSON.parse(graph.artifacts.get('artifacts/output-r2.json').bytes),{values:[1,2,3]});
 assert.notEqual(old.content.response.message_id,renewed.content.response.message_id);
});

test('reopening inventory includes changed prepared work and excludes every preserved old file',async()=>{
 const graph=await load(5),amendment=graph.records.get('records/amendment/proposed-amendment/r1.json');
 const paths=amendment.content.edits.map(e=>e.path);
 assert(paths.includes('artifacts/work-r2.txt'));
 assert(paths.includes('artifacts/output-r2.json'));
 assert.equal(paths.includes('artifacts/work.txt'),false);
 amendment.content.edits=amendment.content.edits.filter(e=>e.path!=='artifacts/work-r2.txt');
 assert(codes(assessLifecycle(graph)).includes('amendment-scope-changed'));
});

test('complete project evidence still requires the final separate results review',async()=>{
 const graph=await load(5);
 assert.equal(graph.records.get(entry(5)).content.current_step_id,null);
 assert.deepEqual(JSON.parse(graph.artifacts.get('artifacts/output-summary.json').bytes),{sum:6});
 graph.records.delete('records/review/summary-results-review/r2.json');
 assert(codes(assessLifecycle(graph)).includes('missing-results-review'));
});
