/** Development-only real marketplace checks. Isolated host configuration; no model calls. */
import {mkdtemp,mkdir,readFile,writeFile,cp,readdir} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const root=resolve(import.meta.dirname,'..');
const sandbox=await mkdtemp('/private/tmp/vibe2spec-host-check-');
const catalog=join(sandbox,'marketplace');
await mkdir(catalog,{recursive:true});
for(const file of ['.claude-plugin/marketplace.json','.agents/plugins/marketplace.json']) {
 await mkdir(join(catalog,file,'..'),{recursive:true});await cp(join(root,file),join(catalog,file));
}
await cp(join(root,'plugins'),join(catalog,'plugins'),{recursive:true});
const workspace=join(sandbox,'project');await mkdir(join(workspace,'.vibe2spec'),{recursive:true});
const record=join(workspace,'.vibe2spec','preserved-user-record.json');
await writeFile(record,'{"preserve":"across installation, update and removal"}\n');
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const before=digest(await readFile(record));
const cycle=join(workspace,'cycle');
await cp(join(root,'examples/project-cycle/workspace'),cycle,{recursive:true});
async function treeIdentity(directory) {
 const found=[];
 async function visit(dir,prefix='') {for(const entry of await readdir(dir,{withFileTypes:true})) {
  const p=prefix+entry.name;
  if(entry.isDirectory())await visit(join(dir,entry.name),p+'/');
  else found.push([p,digest(await readFile(join(dir,entry.name)))]);
 }}
 await visit(directory);return found.sort((a,b)=>a[0].localeCompare(b[0],'en'));
}
const cycleBefore=await treeIdentity(cycle);
const transcript=[];
const configs={codex:join(sandbox,'codex-config'),claude:join(sandbox,'claude-config')};
for(const dir of Object.values(configs)) await mkdir(dir,{recursive:true});
// These documented host configuration variables are scoped to child processes.
// The parent session and user's normal host configuration are never modified.
function run(host,args) {
 const env={...process.env};
 if(host==='codex') env.CODEX_HOME=configs.codex;
 if(host==='claude') env.CLAUDE_CONFIG_DIR=configs.claude;
 const r=spawnSync(host,args,{cwd:workspace,env,encoding:'utf8',timeout:45000,maxBuffer:2*1024*1024});
 const item={host,args,status:r.status,stdout:r.stdout??'',stderr:r.stderr??'',error:r.error?.message??null};transcript.push(item);
 console.log(`${host} ${args.join(' ')}: ${r.status}`);
 return item;
}
const versions={codex:run('codex',['--version']).stdout.trim(),claude:run('claude',['--version']).stdout.trim()};
const installed={};
for(const host of ['codex','claude']) {
 run(host,['plugin','marketplace','add',catalog,'--json']);
 if(host==='codex') {
  run(host,['plugin','list','--marketplace','vibe2spec-marketplace','--available','--json']);
  const added=run(host,['plugin','add','vibe2spec@vibe2spec-marketplace','--json']);
  if(added.status===0) installed.codex=JSON.parse(added.stdout).installedPath;
  run(host,['plugin','list','--marketplace','vibe2spec-marketplace','--json']);
 } else {
  run(host,['plugin','install','vibe2spec@vibe2spec-marketplace']);
  run(host,['plugin','details','vibe2spec']);
  const listed=run(host,['plugin','list','--json']);
  if(listed.status===0) installed.claude=JSON.parse(listed.stdout).find(p=>p.id==='vibe2spec@vibe2spec-marketplace')?.installPath;
 }
}
const installedChecks=[];
const {materialize}=await import('../tests/helpers/fixture-graph.mjs');
for(const caseId of [null,'self-review','indeterminate-review','missing-value']) {
 const fixture=await materialize(caseId?{caseId}:{});
 const outputs=[];
 for(const host of ['codex','claude']) {
  if(!installed[host]) continue;
  const r=spawnSync(process.execPath,[join(installed[host],'scripts/vibe2spec.mjs'),'validate','--workspace',fixture.workspace,'--entry',fixture.entry,'--operation','implementation_readiness'],{encoding:'utf8',timeout:10000});
  outputs.push({host,status:r.status,report:JSON.parse(r.stdout)});
 }
 installedChecks.push({case:caseId??'fictional-complete',outputs,identical:outputs.length===2&&JSON.stringify(outputs[0].report)===JSON.stringify(outputs[1].report)});
 await fixture.cleanup();
}
for(let revision=1;revision<=5;revision++) {
 const outputs=[];
 for(const host of ['codex','claude']) {
  if(!installed[host])continue;
  const r=spawnSync(process.execPath,[join(installed[host],'scripts/vibe2spec.mjs'),'validate','--workspace',cycle,'--entry',`records/project/project-state/r${revision}.json`,'--operation','lifecycle'],{encoding:'utf8',timeout:10000});
  outputs.push({host,status:r.status,report:JSON.parse(r.stdout)});
 }
 installedChecks.push({case:`project-cycle-r${revision}`,outputs,identical:outputs.length===2&&outputs.every(o=>o.status===0)&&JSON.stringify(outputs[0].report)===JSON.stringify(outputs[1].report)});
}
const unavailableRuntime=spawnSync(join(sandbox,'node-is-unavailable'),['--version'],{encoding:'utf8'});
const capabilityChecks={unavailable_runtime:{status:unavailableRuntime.status,error_code:unavailableRuntime.error?.code,passed_validation:false},reviewer_unavailable:{evidence:'docs/release/workflow-forward-review.md',outcome:'Separate-session fallback; gate remains pending.'}};
const updatedVersion='0.1.1-smoke';
for(const file of ['plugin.json','.claude-plugin/plugin.json','.codex-plugin/plugin.json','package.json']) {
 const p=join(catalog,'plugins/vibe2spec',file),data=JSON.parse(await readFile(p,'utf8'));data.version=updatedVersion;await writeFile(p,JSON.stringify(data,null,2)+'\n');
}
const cm=join(catalog,'.claude-plugin/marketplace.json'),cat=JSON.parse(await readFile(cm,'utf8'));cat.plugins[0].version=updatedVersion;await writeFile(cm,JSON.stringify(cat,null,2)+'\n');
// Local catalogs are read directly. The upgrade command is for Git snapshots.
run('codex',['plugin','add','vibe2spec@vibe2spec-marketplace','--json']);
const codexUpdated=run('codex',['plugin','list','--marketplace','vibe2spec-marketplace','--json']);
run('claude',['plugin','marketplace','update','vibe2spec-marketplace']);
run('claude',['plugin','update','vibe2spec@vibe2spec-marketplace']);
const claudeUpdated=run('claude',['plugin','list','--json']);
const updated={codex:codexUpdated.status===0&&JSON.parse(codexUpdated.stdout).installed.some(p=>p.version===updatedVersion),claude:claudeUpdated.status===0&&JSON.parse(claudeUpdated.stdout).some(p=>p.version===updatedVersion)};
run('codex',['plugin','remove','vibe2spec@vibe2spec-marketplace','--json']);
run('claude',['plugin','uninstall','vibe2spec@vibe2spec-marketplace']);
const codexRemoved=run('codex',['plugin','list','--marketplace','vibe2spec-marketplace','--json']);
const claudeRemoved=run('claude',['plugin','list','--json']);
const removed={codex:codexRemoved.status===0&&JSON.parse(codexRemoved.stdout).installed.length===0,claude:claudeRemoved.status===0&&JSON.parse(claudeRemoved.stdout).length===0};
const preserved=before===digest(await readFile(record))&&JSON.stringify(cycleBefore)===JSON.stringify(await treeIdentity(cycle));
// Save observations before any adaptive follow-up or update work.
const observation={date:new Date().toISOString(),sandbox,versions,installed,installedChecks,capabilityChecks,updated,removed,preserved,preserved_cycle_files:cycleBefore.length,project_record_sha256:before,transcript};
await writeFile(join(root,'docs/release/host-install-observation.json'),JSON.stringify(observation,null,2)+'\n');
console.log(`Observation: ${sandbox}`);
if(transcript.some(x=>x.status!==0)||!preserved||!Object.values(updated).every(Boolean)||!Object.values(removed).every(Boolean)||installedChecks.some(c=>!c.identical)) process.exitCode=1;
