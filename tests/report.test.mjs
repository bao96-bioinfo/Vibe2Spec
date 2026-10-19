import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {validate,formatReport,createReport,supportedRuntime} from '../scripts/report.mjs';
import {finding} from '../scripts/findings.mjs';
import {materialize} from './helpers/fixture-graph.mjs';
import {parseArguments} from '../scripts/vibe2spec.mjs';
test('runtime contract supports tested lines and rejects older lines',()=>{
 for(const v of ['24.22.0','24.23.0','26.11.1','26.12.0']) assert(supportedRuntime(v));
 for(const v of ['22.20.0','24.21.0','26.11.0','27.0.0']) assert(!supportedRuntime(v));
});
test('same selected evidence returns byte-stable JSON and readable findings without writes',async t=>{
 const f=await materialize();t.after(f.cleanup);
 const before=await readFile(`${f.workspace}/${f.entry}`);
 const one=await validate({...f,operation:'structure'}),two=await validate({...f,operation:'structure'});
 assert.equal(one.exit_status,0);assert.equal(formatReport(one),formatReport(two));
 assert.equal(one.review_obligations.length,4);assert.match(formatReport(one,'readable'),/Findings: 0/);
 assert.deepEqual(await readFile(`${f.workspace}/${f.entry}`),before);
});
test('known defects dominate incomplete checks without claiming completion',()=>{
 const report=createReport({operation:'structure',findings:[finding('incomplete','read-failed'),finding('structural','unknown-field','r.json','/x')],complete:false});
 assert.equal(report.exit_status,1);assert.equal(report.completion,'incomplete');assert.equal(report.structure,'invalid');
});
test('CLI rejects unknown, repeated, missing and malformed arguments',()=>{
 for(const args of [[],['validate'],['validate','--workspace','/x','--workspace','/y'],['validate','--workspace','/x','--entry','x','--operation','structure','--extra','a']]) assert.throws(()=>parseArguments(args));
 const p=spawnSync(process.execPath,['scripts/vibe2spec.mjs','validate'],{encoding:'utf8'});assert.equal(p.status,3);assert.equal(JSON.parse(p.stdout).completion,'not_started');assert.equal(p.stderr,'');
 const allowed=['validate','--workspace','/x','--entry','--record.json','--operation','structure'];
 assert.equal(parseArguments(allowed).entry,'--record.json');
 assert.throws(()=>parseArguments([...allowed,'--limit','files=1\n']));
});
test('CLI reports fictional readiness as blocked and independently renders overview',async t=>{
 const f=await materialize();t.after(f.cleanup);
 const p=spawnSync(process.execPath,['scripts/vibe2spec.mjs','validate','--workspace',f.workspace,'--entry',f.entry,'--operation','implementation_readiness','--format','readable'],{encoding:'utf8'});
 assert.equal(p.status,1);assert.match(p.stdout,/non-project-context/);
 const diagram=spawnSync(process.execPath,['scripts/vibe2spec.mjs','overview','--workspace',f.workspace,'--entry',f.entry],{encoding:'utf8'});
 assert.equal(diagram.status,0);assert.match(diagram.stdout,/Repeated for each current step/);
});
