import test from 'node:test';
import assert from 'node:assert/strict';
import { writeFile, symlink, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { loadGraph, DEFAULT_LIMITS } from '../scripts/graph.mjs';
import { assessReadiness, checkStepReadiness } from '../scripts/readiness.mjs';
import { assessLifecycle } from '../scripts/lifecycle.mjs';
import { materialize, ENTRY, digest } from './helpers/fixture-graph.mjs';
const codes = findings => findings.map(f => f.code);
const stepPath = 'records/step/copy-step/r1.json';
const ref = (files,p) => files[p].content;
async function inspect(t, options = {}) {
  const fixture = await materialize(options); t.after(fixture.cleanup);
  const graph = await loadGraph(fixture); return {fixture,graph};
}
test('complete fictional graph has valid records and lifecycle, but cannot authorize a real project', async t => {
  const {fixture,graph} = await inspect(t);
  assert.equal(graph.complete,true); assert.equal(graph.artifacts.size,26); assert.deepEqual(graph.findings,[]);
  assert.deepEqual(assessLifecycle(graph),[]);
  assert(codes(assessReadiness(graph)).includes('non-project-context'));
  assert.deepEqual(checkStepReadiness(graph,stepPath,{requireContext:false}),[]);
  assert.equal((await readFile(path.join(fixture.workspace,'artifacts/input.json'),'utf8')).trim(),'[\n  1,\n  2,\n  3\n]');
});
for (const [caseId,code] of [['unknown-field','unknown-field'],['missing-reference','missing-reference'],['changed-decision','digest-mismatch'],['stale-review','digest-mismatch']]) {
  test(`accepted fixture ${caseId} produces ${code}`,async t => {const {graph}=await inspect(t,{caseId});assert(codes(graph.findings).includes(code));});
}
for (const [caseId,code] of [['missing-value','unresolved-decision'],['partial-approval','unapproved-decision'],['missing-pair-decision','missing-pair-decision'],['self-review','review-not-independent'],['indeterminate-review','review-not-passing']]) {
  test(`readiness fixture ${caseId} blocks implementation`,async t => {const {graph}=await inspect(t,{caseId});assert(codes(checkStepReadiness(graph,stepPath,{requireContext:false})).includes(code));});
}
test('wrong target kind is rejected although its digest matches',async t => {
  const {graph}=await inspect(t,{edit:files=> {ref(files,stepPath).content.unit_refs[0].path='records/decision/method-choice/r1.json';}});
  assert(codes(graph.findings).includes('reference-kind-mismatch'));
});
test('a literal object resembling a reference never grants a filesystem read',async t => {
  const {graph}=await inspect(t,{edit:files=> {ref(files,'records/decision/method-choice/r1.json').content.selection.value={path:'/not-authorized/secret',sha256:'0'.repeat(64)};}});
  assert(!graph.artifacts.has('/not-authorized/secret'));
  assert(!codes(graph.findings).includes('access-not-authorized'));
});
test('an unapproved absolute location remains incomplete without reading it',async t => {
  const {graph}=await inspect(t,{edit:files=> {ref(files,stepPath).content.input_refs.push({path:'/unapproved/secret.json',sha256:'0'.repeat(64)});}});
  assert.equal(graph.complete,false); assert(codes(graph.findings).includes('access-not-authorized'));
});
test('workspace absolute spellings are rejected as aliases',async t => {
  const fixture=await materialize(); t.after(fixture.cleanup);
  const graph=await loadGraph({workspace:fixture.workspace,entry:path.join(fixture.workspace,ENTRY)});
  assert(codes(graph.findings).includes('path-alias'));
});
test('symlinked files and ancestors are rejected',async t => {
  const fixture=await materialize(); t.after(fixture.cleanup);
  const linked=path.join(fixture.workspace,'linked'); await symlink(path.join(fixture.workspace,'records'),linked,'dir');
  const graph=await loadGraph({workspace:fixture.workspace,entry:'linked/project/project-state/r1.json'});
  assert(codes(graph.findings).includes('symbolic-path'));
});
test('files, references, total bytes, and finding counts have bounded incomplete outcomes',async t => {
  const fixture=await materialize(); t.after(fixture.cleanup);
  for(const limits of [{files:1},{references:1},{totalBytes:1},{jsonBytes:1},{findings:2,files:1}]) {
    const graph=await loadGraph({...fixture,limits}); assert.equal(graph.complete,false);assert(codes(graph.findings).includes('resource-limit'));
    assert(graph.findings.length <= (limits.findings??DEFAULT_LIMITS.findings));
  }
});
test('invalid limits and malformed entry do not start inspection',async t => {
  const fixture=await materialize(); t.after(fixture.cleanup);
  for(const limits of [{files:0},{concurrentReads:2},{files:1.5},{unknown:1}]) assert(codes((await loadGraph({...fixture,limits})).findings).includes('invalid-limits'));
  assert(codes((await loadGraph({...fixture,entry:'../outside'})).findings).includes('invalid-read-scope'));
});
test('external authorization is exact-file, never a directory grant',async t => {
  const fixture=await materialize(); t.after(fixture.cleanup);
  const other=await materialize(); t.after(other.cleanup);
  const absolute=path.join(other.workspace,'records/decision/method-choice/r1.json');
  const allowed=await loadGraph({workspace:fixture.workspace,entry:absolute,externalFiles:[absolute]});
  assert(allowed.records.has(absolute));
  assert(!codes(allowed.findings).includes('access-not-authorized'));
  const denied=await loadGraph({workspace:fixture.workspace,entry:absolute,externalFiles:[other.workspace]});
  assert(codes(denied.findings).includes('access-not-authorized'));
});
test('independent shape defect and inaccessible branch are both retained',async t => {
  const {graph}=await inspect(t,{edit:files=> {const step=ref(files,stepPath);step.content.extra=true;step.content.input_refs.push({path:'/unapproved/a',sha256:'0'.repeat(64)});}});
  assert(codes(graph.findings).includes('unknown-field'));assert(codes(graph.findings).includes('access-not-authorized'));assert.equal(graph.complete,false);
});
test('standalone decision records support structure inspection',async t => {
  const fixture=await materialize();t.after(fixture.cleanup);
  const graph=await loadGraph({...fixture,entry:'records/decision/method-choice/r1.json'});
  assert.deepEqual(graph.findings,[]);assert(codes(assessReadiness(graph)).includes('missing-current-step'));
});
