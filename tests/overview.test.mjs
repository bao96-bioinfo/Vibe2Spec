import test from 'node:test';
import assert from 'node:assert/strict';
import {renderOverview} from '../scripts/overview.mjs';
const states = ['finished','reopened','suspended','provisional'].map((state,i)=>({step_id:`step-${i+1}`,revision:i===1?2:1,state,acceptance_ref:null,amendment_ref:null,blocked_by:i===2?['step-2']:[]}));
const project={kind:'project',id:'demo',content:{title:'Study\nplan',step_order:states.map(s=>s.step_id),current_step_id:'step-2',states}};
test('overview distinguishes current, accepted, provisional, reopened and blocked work',()=>{
 const saved=structuredClone(project); const text=renderOverview(project);
 assert.match(text,/finished/);assert.match(text,/reopened.*revision 2.*CURRENT/);assert.match(text,/Blocked by: step-2/);assert.match(text,/provisional/);
 assert.match(text,/Interview the next step/); assert.match(text,/Explicit user acceptance/);
 assert.match(text,/Study\\nplan/); assert.deepEqual(project,saved);
});
test('overview includes exact dependency revisions and rejects inconsistent state order',()=>{
 const text=renderOverview(project,[{kind:'step',id:'step-3',revision:1,content:{title:'Evaluate',depends_on:[{step_id:'step-2',revision:2}]}}]);
 assert.match(text,/Depends on: step-2@2/);
 const bad=structuredClone(project);bad.content.states.reverse();assert.throws(()=>renderOverview(bad),TypeError);
});
