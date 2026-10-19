import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,mkdir,writeFile,rm,symlink,realpath} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {checkRecordEnvelope} from '../scripts/envelope.mjs';
import {parseJsonBytes} from '../scripts/json.mjs';
import {createReport,validate} from '../scripts/report.mjs';
import {finding} from '../scripts/findings.mjs';
import {materialize} from './helpers/fixture-graph.mjs';
import {materializeEnvelopeCase,observeEnvelope} from './envelope-fixture.mjs';
import {assemble} from '../scripts/package.mjs';
import {renderOverview} from '../scripts/overview.mjs';

const parsed=parseJsonBytes(await readFile(new URL('./fixtures/envelope/cases.json',import.meta.url)));
assert.equal(parsed.ok,true);
const fixture=parsed.value;

test('primary envelope requires the complete ASCII identifier string',()=>{
 for(const suffix of ['\n','\r','\u2028','\u2029']){
  const {value,sourceOrder}=materializeEnvelopeCase(fixture,fixture.cases[0]);
  value.id+=suffix;value.project_id+=suffix;
  assert.deepEqual(checkRecordEnvelope(value,sourceOrder).map(({code,pointer})=>({code,pointer})),[
   {code:'invalid-identifier',pointer:'/id'},
   {code:'invalid-identifier',pointer:'/project_id'},
  ]);
 }
});
test('paired harness cannot accept a counterfeit TypeError',()=>{
 assert.throws(()=>observeEnvelope(()=>{throw {name:'TypeError',message:'Invalid envelope-checker input.'};},null,{root:null,author:null}),assert.AssertionError);
});
test('paired harness detects signed-zero mutation even though JSON serializes both zeros alike',()=>{
 assert.throws(()=>observeEnvelope(value=>{value.revision=0;return [];},{revision:-0},{root:['revision'],author:null}),assert.AssertionError);
});
test('paired fixture rejects an invalid source-order permutation',()=>{
 assert.throws(()=>materializeEnvelopeCase(fixture,{changes:[['order','',['kind']]]}),assert.AssertionError);
});
test('report target extraction tolerates an independently invalid state field',()=>{
 for(const states of [null,0,'invalid',{},[null]]){
  const graph={entry:'entry.json',records:new Map([['entry.json',{content:{states,current_step_id:'step-a'}}]])};
  const report=createReport({operation:'implementation_readiness',graph,findings:[finding('structural','invalid-type','entry.json','/content/states')],complete:true});
  assert.equal(report.exit_status,1);assert.equal(report.structure,'invalid');assert.equal(report.target_step_id,null);
 }
});
test('malformed project state reports a structural defect without an internal failure',async t=>{
 const f=await materialize({edit:files=>{files['records/project/project-state/r1.json'].content.content.states='invalid';}});t.after(f.cleanup);
 const report=await validate({...f,operation:'structure'});
 assert.equal(report.exit_status,1);assert(report.findings.some(item=>item.code==='invalid-type'&&item.pointer==='/content/states'));
 assert(!report.findings.some(item=>item.category==='internal'));
});
test('ASCII overview preserves both UTF-16 units of supplementary characters',()=>{
 const diagram=renderOverview({kind:'project',id:'demo',content:{title:'DNA 🧬',step_order:['step-a'],current_step_id:'step-a',states:[{step_id:'step-a',revision:1,state:'interviewing',blocked_by:[]}]}});
 assert.match(diagram,/DNA \\ud83e\\uddec/);assert(!/[^\x00-\x7f]/.test(diagram));
});
async function packageSandbox(t){
 const base=await mkdtemp(join(await realpath(tmpdir()),'vibe2spec-package-review-'));t.after(()=>rm(base,{recursive:true,force:true}));return base;
}
test('assembly refuses symlink destinations and preserves their targets',async t=>{
 const base=await packageSandbox(t),target=join(base,'target');await mkdir(target);await writeFile(join(target,'user-record.json'),'keep');
 await symlink(target,join(base,'vibe2spec'));
 await assert.rejects(assemble(join(base,'vibe2spec')),/symbolic links/);
 assert.equal(await readFile(join(target,'user-record.json'),'utf8'),'keep');
});
test('assembly refuses symlink ancestors without writing through them',async t=>{
 const base=await packageSandbox(t),target=join(base,'target');await mkdir(target);await symlink(target,join(base,'alias'));
 await assert.rejects(assemble(join(base,'alias','vibe2spec')),/symbolic links/);
});
test('assembly preserves existing directories with a counterfeit ownership marker',async t=>{
 const base=await packageSandbox(t),output=join(base,'vibe2spec');await mkdir(output);await writeFile(join(output,'.vibe2spec-generated'),'unrelated');await writeFile(join(output,'user-record.json'),'keep');
 await assert.rejects(assemble(output),/ownership marker/);
 assert.equal(await readFile(join(output,'user-record.json'),'utf8'),'keep');
});
test('assembly creates a reusable inventory and refuses modified or added package contents',async t=>{
 const base=await packageSandbox(t),output=join(base,'vibe2spec');
 await assemble(output);await assemble(output);
 const saved=await readFile(join(output,'package.json'),'utf8');
 await writeFile(join(output,'package.json'),saved+' ');
 await assert.rejects(assemble(output),/modified or unowned/);
 assert.equal(await readFile(join(output,'package.json'),'utf8'),saved+' ');
 await writeFile(join(output,'package.json'),saved);await mkdir(join(output,'.vibe2spec'));
 await assert.rejects(assemble(output),/modified or unowned/);
});
