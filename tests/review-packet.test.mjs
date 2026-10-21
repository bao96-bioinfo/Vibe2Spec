import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdtemp,mkdir,readFile,readdir,realpath,rm,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {performance} from 'node:perf_hooks';
import {loadGraph} from '../scripts/graph.mjs';
import {buildReviewPacket,formatReviewPacket} from '../scripts/review-packet.mjs';
import {parseArguments} from '../scripts/vibe2spec.mjs';
import {rebuild,encode,materialize} from './helpers/fixture-graph.mjs';

const author={session_id:'example-session',context_id:'example-author'};
const reviewer={session_id:'example-review-session',context_id:'example-reviewer'};
const entry='reviews/current.json';
const ref=file=>({path:file,sha256:'0'.repeat(64)});
const record=(kind,id,revision,content,actor=author,lifecycle='frozen')=>({schema_version:1,kind,id,revision,project_id:'example-packet',context:'example',lifecycle,author:actor,content});
const snapshot=(id,revision,paths)=>record('snapshot',id,revision,{purpose:'Prepared work review',entries:paths.sort().map(file=>({...ref(file),size_bytes:0}))});
const coverage=(id,input,dependencies=[],outcome='pass')=>({id,input_refs:[ref(input)],dependency_refs:dependencies.map(ref),check_ids:[],outcome});
async function fixture(t,edit=()=>{}) {
 const files={
  'work/unchanged.txt':{encoding:'text',content:'DO NOT COPY THIS ARTIFACT BODY\n'.repeat(4000)},
  'work/dependency.txt':{encoding:'text',content:'Independent settings, revision one.\n'},
  'work/incorrect.txt':{encoding:'text',content:'Incorrect result.\n'},
  'work/corrected.txt':{encoding:'text',content:'Corrected result.\n'},
  'snapshots/baseline.json':{encoding:'json',content:snapshot('work-snapshot',1,['work/unchanged.txt','work/dependency.txt','work/incorrect.txt'])},
  'snapshots/current.json':{encoding:'json',content:snapshot('work-snapshot',2,['work/unchanged.txt','work/dependency.txt','work/corrected.txt'])},
  'reviews/baseline.json':{encoding:'json',content:record('review','work-review',1,{phase:'pre_execution',snapshot_ref:ref('snapshots/baseline.json'),reviewer,artifact_authors:[author],workers:[],outcome:'changes_required',findings:[{code:'wrong-result',path:'work/incorrect.txt',message:'The return value differs from the approved expected result.'}],coverage:[coverage('independent','work/unchanged.txt',['work/dependency.txt']),coverage('correct-result','work/incorrect.txt',[],'changes_required')]},reviewer)},
  [entry]:{encoding:'json',content:record('review','work-review',2,{phase:'pre_execution',snapshot_ref:ref('snapshots/current.json'),reviewer,artifact_authors:[author],workers:[],outcome:null,findings:[],coverage:[coverage('independent','work/unchanged.txt',['work/dependency.txt'],null),coverage('correct-result','work/corrected.txt',[],null)],continuation:{baseline_review_ref:ref('reviews/baseline.json'),reused_coverage_ids:[],finding_resolutions:[]}},reviewer,'draft')},
 };
 edit(files);rebuild(files);
 const workspace=await mkdtemp(path.join(await realpath(tmpdir()),'vibe2spec-packet-'));t.after(()=>rm(workspace,{recursive:true,force:true}));
 for(const [file,value] of Object.entries(files)) {await mkdir(path.dirname(path.join(workspace,file)),{recursive:true});await writeFile(path.join(workspace,file),encode(value));}
 return {workspace,entry,files};
}
const cli=f=>['scripts/vibe2spec.mjs','review-packet','--workspace',f.workspace,'--entry',f.entry];
async function diskState(workspace) {
 const names=(await readdir(workspace,{recursive:true,withFileTypes:true})).filter(item=>item.isFile()).map(item=>path.join(item.parentPath,item.name)).sort();
 return Promise.all(names.map(async file=>[file,await readFile(file,'utf8')]));
}

test('a draft correction reuses explicit independent passes and narrows actual inspection bytes',async t=>{
 const f=await fixture(t),graph=await loadGraph(f);
 assert.deepEqual(graph.findings,[]);
 const {packet,report}=buildReviewPacket(graph);
 assert.equal(report.exit_status,0,JSON.stringify(report.findings));
 assert.deepEqual(packet.candidate_reuse_ids,['independent']);
 assert.deepEqual(packet.fresh_coverage_ids,['correct-result']);
 assert.deepEqual(packet.inspection_paths,['work/corrected.txt']);
 assert.deepEqual(packet.uncovered_paths,[]);
 assert.equal(packet.current_review.lifecycle,'draft');
 assert.equal(packet.baseline_review.path,'reviews/baseline.json');
 assert.equal(packet.measurements.scope_files,3);
 assert.equal(packet.measurements.inspection_bytes,Buffer.byteLength(f.files['work/corrected.txt'].content));
 assert(packet.measurements.inspection_bytes < packet.measurements.scope_bytes);
 assert(packet.measurements.graph_bytes_read > packet.measurements.scope_bytes);
 assert.deepEqual(packet.baseline_findings,[{code:'wrong-result',path:'work/incorrect.txt',record_path:'reviews/baseline.json',pointer:'/content/findings/0'}]);
 assert.match(packet.notice,/grants no approval/);
 assert(!JSON.stringify(packet).includes('DO NOT COPY THIS ARTIFACT BODY'));
 assert(JSON.stringify(packet).length < packet.measurements.scope_bytes/10);
});

test('a changed dependency expands inspection even when the primary input is unchanged',async t=>{
 const f=await fixture(t,files=>{
  files['work/dependency-r2.txt']={encoding:'text',content:'Changed setting affects the unchanged unit.\n'};
  files[entry].content.content.coverage[0].dependency_refs=[ref('work/dependency-r2.txt')];
  files['snapshots/current.json'].content=snapshot('work-snapshot',2,['work/unchanged.txt','work/dependency-r2.txt','work/corrected.txt']);
 });
 const {packet,report}=buildReviewPacket(await loadGraph(f));
 assert.equal(report.exit_status,0,JSON.stringify(report.findings));
 assert.deepEqual(packet.candidate_reuse_ids,[]);
 assert.deepEqual(packet.fresh_coverage_ids,['correct-result','independent']);
 assert.deepEqual(packet.inspection_paths,['work/corrected.txt','work/dependency-r2.txt','work/unchanged.txt']);
 assert.equal(packet.measurements.inspection_bytes,packet.measurements.scope_bytes);
});

test('shared paths remain in inspection when at least one fresh item depends on them',async t=>{
 const f=await fixture(t,files=>{files[entry].content.content.coverage[1].dependency_refs=[ref('work/dependency.txt')];});
 const {packet,report}=buildReviewPacket(await loadGraph(f));
 assert.equal(report.exit_status,0);
 assert.deepEqual(packet.candidate_reuse_ids,['independent']);
 assert.deepEqual(packet.inspection_paths,['work/corrected.txt','work/dependency.txt']);
});

test('an explicit current concern prevents candidate reuse of the affected item',async t=>{
 for(const change of [
  content=>{content.coverage[0].outcome='changes_required';},
  content=>{content.coverage[0].outcome='unable_to_determine';},
  content=>{content.findings=[{code:'new-risk',path:'work/dependency.txt',message:'The current impact assessment found a changed scientific assumption.'}];},
  content=>{content.findings=[{code:'new-risk',path:'',message:'A whole-review concern remains unresolved.'}];},
 ]) {
  const f=await fixture(t,files=>change(files[entry].content.content)),{packet,report}=buildReviewPacket(await loadGraph(f));
  assert.equal(report.exit_status,0,JSON.stringify(report.findings));
  assert.deepEqual(packet.candidate_reuse_ids,[]);
  assert.equal(packet.measurements.inspection_bytes,packet.measurements.scope_bytes);
 }
});

test('legacy and partially described drafts retain all uncovered paths for fresh inspection',async t=>{
 const f=await fixture(t,files=>{delete files[entry].content.content.continuation;delete files[entry].content.content.coverage;});
 const {packet,report}=buildReviewPacket(await loadGraph(f));
 assert.equal(report.exit_status,0);
 assert.deepEqual(packet.candidate_reuse_ids,[]);
 assert.deepEqual(packet.uncovered_paths,['work/corrected.txt','work/dependency.txt','work/unchanged.txt']);
 assert.deepEqual(packet.inspection_paths,packet.uncovered_paths);
 assert.equal(packet.baseline_review,null);
});

test('a required check without coverage expands inspection even when all file paths are covered',async t=>{
 const baselinePath='records/review/spec-review/r1.json',currentPath='records/review/spec-review/r2.json',stepPath='records/step/copy-step/r1.json';
 const f=await materialize({edit:files=>{
  const step=files[stepPath].content.content;
  step.checks.push({...structuredClone(step.checks[0]),id:'second-required-check'});
  const baseline=files[baselinePath].content,paths=files[baseline.content.snapshot_ref.path].content.content.entries.map(item=>item.path);
  const allDependencies=paths.filter(file=>file!==stepPath);
  baseline.content.coverage=[{...coverage('first-check',stepPath,allDependencies),check_ids:['same-vector']},{...coverage('second-check',stepPath,allDependencies),check_ids:['second-required-check']}];
  const current=structuredClone(baseline);current.revision=2;current.lifecycle='draft';current.content.outcome=null;
  current.content.coverage=[{...structuredClone(current.content.coverage[0]),outcome:null}];
  current.content.continuation={baseline_review_ref:ref(baselinePath),reused_coverage_ids:[],finding_resolutions:[]};
  files[currentPath]={encoding:'json',content:current};
 }});t.after(f.cleanup);
 const {packet,report}=buildReviewPacket(await loadGraph({...f,entry:currentPath}));
 assert.equal(report.exit_status,0,JSON.stringify(report.findings));
 assert.deepEqual(packet.candidate_reuse_ids,['first-check']);
 assert.deepEqual(packet.uncovered_paths,[]);
 assert.deepEqual(packet.uncovered_checks,[{step_path:stepPath,check_id:'second-required-check'}]);
 assert(packet.inspection_paths.includes(stepPath));
 assert(packet.inspection_paths.includes('records/decision/method-choice/r1.json'));
 assert(packet.inspection_paths.includes('artifacts/input.json'));
});

test('packet CLI and library are deterministic, content-free, and leave all input files untouched',async t=>{
 const f=await fixture(t),before=await diskState(f.workspace);
 const first=spawnSync(process.execPath,cli(f),{encoding:'utf8'}),second=spawnSync(process.execPath,cli(f),{encoding:'utf8'});
 assert.equal(first.status,0,first.stdout+first.stderr);assert.equal(second.status,0);
 assert.equal(first.stdout,second.stdout);assert.equal(first.stderr,'');
 const library=buildReviewPacket(await loadGraph(f));
 assert.equal(first.stdout,formatReviewPacket(library.packet));
 const readable=spawnSync(process.execPath,[...cli(f),'--format','readable'],{encoding:'utf8'});
 assert.equal(readable.status,0);assert.equal(readable.stdout,formatReviewPacket(library.packet,'readable'));
 assert.match(readable.stdout,/Suggested inspection: 1 files/);
 assert(!readable.stdout.includes('DO NOT COPY THIS ARTIFACT BODY'));
 assert.deepEqual(await diskState(f.workspace),before);
});

test('stale artifact bytes produce an ordinary failure report and no inspection packet',async t=>{
 const f=await fixture(t);await writeFile(path.join(f.workspace,'work/dependency.txt'),'Unreviewed alteration.\n');
 const {packet,report}=buildReviewPacket(await loadGraph(f));
 assert.equal(packet,null);assert.equal(report.exit_status,1);assert(report.findings.some(item=>item.code==='digest-mismatch'));
 const processResult=spawnSync(process.execPath,cli(f),{encoding:'utf8'});
 assert.equal(processResult.status,1);assert(JSON.parse(processResult.stdout).findings.some(item=>item.code==='digest-mismatch'));
});

test('an invalid baseline or a baseline without explicit coverage cannot suggest reuse',async t=>{
 for(const change of [
  files=>{delete files['reviews/baseline.json'].content.content.coverage;},
  files=>{files['reviews/baseline.json'].content.content.phase='results';},
  files=>{files['reviews/baseline.json'].content.content.coverage.pop();},
 ]) {
  const f=await fixture(t,change),{packet,report}=buildReviewPacket(await loadGraph(f));
  assert.equal(packet,null);assert.equal(report.exit_status,1);
 }
});

test('malformed input, wrong entry kinds, and exhausted read limits cannot return a packet',async t=>{
 const f=await fixture(t);
 const wrong=buildReviewPacket(await loadGraph({...f,entry:'snapshots/current.json'}));
 assert.equal(wrong.packet,null);assert.equal(wrong.report.exit_status,1);
 const limited=spawnSync(process.execPath,[...cli(f),'--limit','files=1'],{encoding:'utf8'});
 assert.equal(limited.status,2);assert(JSON.parse(limited.stdout).findings.some(item=>item.code==='resource-limit'));
 await writeFile(path.join(f.workspace,entry),'{ invalid');
 const invalid=buildReviewPacket(await loadGraph(f));
 assert.equal(invalid.packet,null);assert.equal(invalid.report.exit_status,1);assert(invalid.report.findings.some(item=>item.code==='invalid-json'));
});

test('packet assessment respects an already elapsed deadline without returning a success packet',async t=>{
 const f=await fixture(t),graph=await loadGraph(f);
 assert.equal(buildReviewPacket(graph).report.exit_status,0);
 const {packet,report}=buildReviewPacket(graph,{startedAt:performance.now()-graph.limits.deadlineMs-1});
 assert.equal(packet,null);assert.equal(report.exit_status,2);assert.equal(report.completion,'incomplete');
 assert.deepEqual(report.findings.map(item=>item.code),['resource-limit']);
 assert.equal(graph.complete,true);assert.deepEqual(graph.findings,[]);
});

test('baseline assessment findings share the caller limit in the library and CLI',async t=>{
 const f=await fixture(t,files=>{
  const baseline=files['reviews/baseline.json'].content.content;
  baseline.coverage[0].dependency_refs=[];baseline.coverage.pop();
  baseline.findings.push(structuredClone(baseline.findings[0]));
 });
 const unrestricted=buildReviewPacket(await loadGraph(f));
 assert(unrestricted.report.findings.length>2);
 const graph=await loadGraph({...f,limits:{findings:2}});
 assert.deepEqual(graph.findings,[]);
 const {packet,report}=buildReviewPacket(graph);
 assert.equal(packet,null);assert.equal(report.exit_status,1);assert.equal(report.completion,'incomplete');
 assert.equal(report.findings.length,2);assert(report.findings.some(item=>item.code==='resource-limit'));
 const processResult=spawnSync(process.execPath,[...cli(f),'--limit','findings=2'],{encoding:'utf8'});
 assert.equal(processResult.status,1);assert.deepEqual(JSON.parse(processResult.stdout),report);
});

test('invalid packet invocation limits retain invocation diagnostics without assessment budget findings',async t=>{
 const f=await fixture(t),graph=await loadGraph({...f,limits:{findings:1}});
 const {packet,report}=buildReviewPacket(graph,{startedAt:performance.now()-60000});
 assert.equal(packet,null);assert.equal(report.exit_status,3);assert.equal(report.completion,'not_started');
 assert.deepEqual(report.findings.map(item=>item.code),['invalid-limits']);
 const processResult=spawnSync(process.execPath,[...cli(f),'--limit','findings=1'],{encoding:'utf8'});
 assert.equal(processResult.status,3);assert.deepEqual(JSON.parse(processResult.stdout),report);
});

test('review packet arguments allow approved locations and formats but reject operation selection',()=>{
 const args=['review-packet','--workspace','/workspace','--entry','review.json'];
 assert.equal(parseArguments([...args,'--format','readable','--external-file','/exact/file','--limit','files=2']).command,'review-packet');
 assert.throws(()=>parseArguments([...args,'--operation','structure']));
 assert.throws(()=>parseArguments([...args,'--format','other']));
});
