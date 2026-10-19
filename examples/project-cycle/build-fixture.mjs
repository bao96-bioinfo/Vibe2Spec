// Build saved fictional evidence. No command from a record is executed.
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fixtureFiles, rebuild, encode } from '../../tests/helpers/fixture-graph.mjs';

const root = fileURLToPath(new URL('./workspace/', import.meta.url));
const { files } = await fixtureFiles();
const base = structuredClone(files);
const ref = p => ({path:p,sha256:'0'.repeat(64)});
const c = p => files[p].content.content;
const state = (id, revision, status, acceptance = null, amendment = null, blocked = []) => ({step_id:id,revision,state:status,acceptance_ref:acceptance&&ref(acceptance),amendment_ref:amendment&&ref(amendment),blocked_by:blocked});
const recordPath = (kind,id,rev=1) => `records/${kind}/${id}/r${rev}.json`;
const entry = revision => recordPath('project','project-state',revision);
const acceptance = revision => recordPath('acceptance','copy-acceptance',revision);
const amendment = 'records/amendment/proposed-amendment/r1.json';
const revised = p => p.startsWith('artifacts/') ? p.replace(/(\.[^.]+)$/, '-r2$1') : p.replace('/r1.json','/r2.json');
files['artifacts/overview.md'].content = '# Fictional two-step project\n\nCopy the approved vector, then calculate its sum. Each step has its own complete interview, specification approval, independent specification review, prepared-work review, result review, and result acceptance. Later details remain provisional.\n';
const clonedPaths = Object.keys(base).filter(p => ![
  'records/project/', 'records/amendment/', 'records/evidence/',
  'records/approval/reopen-', 'records/snapshot/amendment-',
  'records/snapshot/input-', 'records/decision/resource-', 'records/decision/pair-'
].some(prefix => p.startsWith(prefix)) && !['artifacts/overview.md','artifacts/input.json'].includes(p));
const r2map = new Map(clonedPaths.map(p => [p,revised(p)]));
function replace(value, mapping) {
  if(typeof value === 'string') { for(const [from,to] of [...mapping].sort((a,b)=>b[0].length-a[0].length)) value=value.split(from).join(to);return value; }
  if(Array.isArray(value)) return value.map(v=>replace(v,mapping));
  if(value && typeof value==='object') return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,replace(v,mapping)]));
  return value;
}
for(const p of clonedPaths) {
  const file=replace(base[p],r2map);
  if(file.content?.kind) { file.content.revision=2; if(Object.hasOwn(file.content.content,'step_revision'))file.content.content.step_revision=2; }
  files[r2map.get(p)]=file;
}
const step2path='records/step/copy-step/r2.json';
const unit2path='records/unit/copy-unit/r2.json';
const method2path='records/decision/method-choice/r2.json';
const expected2={input:[1,2,3],output:{values:[1,2,3]}};
c(step2path).title='Wrap the preserved vector in the required values field';
c(step2path).requirements[0].text='The step SHALL preserve the input vector and write an object with exactly one values field containing that vector in its original order.';
c(step2path).outputs[0].description='Object containing the unchanged vector under values.';
c(step2path).checks[0].expected=expected2;
c(step2path).checks[0].description='Verify unchanged input and exactly the required named output field.';
c(method2path).selection.value.operation='wrap';
c(method2path).question='How should the vector be represented for the summary consumer?';
c(method2path).rationale='The downstream consumer requires an object with exactly one values field. No values, ordering, or input contents may change.';
c(unit2path).interface='Read artifacts/input.json containing [1,2,3]. Leave it unchanged. Write exactly {"values":[1,2,3]} to artifacts/output-r2.json as two-space-indented JSON followed by one newline.';
c(unit2path).method='Wrap the approved vector in an object with one values field. Do not sort or transform its values. This is a fictional operation, not an executed command.';
files['artifacts/output-r2.json'].content={values:[1,2,3]};
files['artifacts/spec-r2.md'].content='# Revised vector preparation\n\nFictional specification, revision 2. The step SHALL leave [1,2,3] unchanged and output an object with exactly one values field containing [1,2,3]. WHEN the approved vector is supplied, THEN the output is {"values":[1,2,3]}. Missing or changed input SHALL stop without output. Existing revision 1 files SHALL remain unchanged.\n';
files['artifacts/design-r2.md'].content='# Revised execution design\n\nRead artifacts/input.json, wrap its vector under values, and write artifacts/output-r2.json. Preserve values, order, and the original input. The method decision fixes this representation and path; the unchanged resource and pairing decisions retain their original provenance. The fictional runtime is fictional-copy-1. One invocation and no retry are permitted. Use exact JSON comparison with array order preserved.\n';
files['artifacts/tasks-r2.md'].content='# Revised tasks\n\nPrepare the disclosed wrapping operation; obtain separate pre-execution review; perform the fictional bounded run; compare output and retained input; obtain separate results review and explicit fictional acceptance. This text defines work and does not itself assert completion.\n';
files['artifacts/work-r2.txt'].content='Fictional prepared operation: wrap the approved vector under values without mutation. No code was executed.\n';
c('records/run/copy-run/r2.json').check_results[0].observed=structuredClone(expected2);
c('records/run/copy-run/r2.json').commands[0].program='example-wrap';
c('records/run/copy-run/r2.json').effective_settings[0].value=structuredClone(c(method2path).selection.value);
c('records/comparison/copy-comparison/r2.json').correctness_results[0].results[0].observed=structuredClone(expected2);
c('records/acceptance/copy-acceptance/r2.json').response.message_id='example-accept-revised-result';
c('records/acceptance/copy-acceptance/r2.json').response.text='Fictional acceptance of copy-step revision 2 and its reviewed named-field output; revision 1 remains historical.';
c('records/approval/spec-approval/r2.json').response.message_id='example-approve-revised-spec';
c('records/approval/spec-approval/r2.json').response.text='Fictional approval of the complete revised specification and every listed target.';

// The second step has only a presented draft before the first step is reopened.
const summaryDraft=structuredClone(files[step2path]);
summaryDraft.content.id='summary-step';summaryDraft.content.revision=1;summaryDraft.content.lifecycle='draft';
summaryDraft.content.content={...summaryDraft.content.content,title:'Calculate the vector sum',documents:null,depends_on:[{step_id:'copy-step',revision:1}],requirements:null,decision_refs:null,input_refs:null,unit_refs:null,outputs:null,checks:null,paired_validation:null,resource_decision_refs:null,project_settings:{}};
files['records/step/summary-step/r1.json']=summaryDraft;
files['records/snapshot/summary-draft/r1.json']=structuredClone(base['records/snapshot/input-snapshot/r1.json']);
files['records/snapshot/summary-draft/r1.json'].content.id='summary-draft';
c('records/snapshot/summary-draft/r1.json').purpose='Presented incomplete summary-step interview draft; this snapshot supplies no approval.';
c('records/snapshot/summary-draft/r1.json').entries=[{...ref('records/step/summary-step/r1.json'),size_bytes:0}];
files['records/review/summary-draft-review/r1.json']=structuredClone(base['records/review/spec-review/r1.json']);
const draftReview=files['records/review/summary-draft-review/r1.json'].content;
draftReview.id='summary-draft-review';draftReview.author.context_id='example-draft-reviewer';
Object.assign(draftReview.content,{snapshot_ref:ref('records/snapshot/summary-draft/r1.json'),reviewer:structuredClone(draftReview.author),outcome:'changes_required',findings:[{code:'summary-contract-incomplete',path:'records/step/summary-step/r1.json',message:'The current interview draft has unresolved input representation, method, outputs, and checks. No implementation is authorized.'}]});

// A complete, separately accepted second-step revision is recorded only later.
const summaryMap=new Map([...r2map.values()].map(p => [p,p.startsWith('artifacts/') ? p.replace('-r2.','-summary.') : p.replace(/records\/([^/]+)\/([^/]+)\/r2\.json$/,(_,kind,id)=>`records/${kind}/summary-${id}/r2.json`)]));
summaryMap.set('records/step/copy-step/r2.json','records/step/summary-step/r2.json');
summaryMap.set('records/unit/copy-unit/r2.json','records/unit/summary-unit/r2.json');
summaryMap.set('artifacts/input.json','artifacts/output-r2.json');
summaryMap.set('records/snapshot/input-snapshot/r1.json','records/snapshot/summary-input-snapshot/r2.json');
for(const p of [...r2map.values()]) {
  const file=replace(files[p],summaryMap);
  if(file.content?.kind) { file.content.id=summaryMap.get(p).split('/')[2];if(file.content.content.step_id)file.content.content.step_id='summary-step'; }
  files[summaryMap.get(p)]=file;
}
const sumStep=c('records/step/summary-step/r2.json');
sumStep.title='Calculate the sum from the accepted named-field output';sumStep.depends_on=[{step_id:'copy-step',revision:2}];
sumStep.requirements[0].text='The step SHALL sum the three values in order and leave the accepted input object unchanged.';
const expectedSum={input:{values:[1,2,3]},output:{sum:6}};
sumStep.checks[0].expected=expectedSum;sumStep.checks[0].description='The input object remains unchanged and the exact sum is six.';
sumStep.outputs[0].description='Object containing exactly sum: 6.';
const sumMethod=c('records/decision/summary-method-choice/r2.json');
sumMethod.question='How should the approved named-field vector be summarized?';sumMethod.selection.value.operation='sum';sumMethod.rationale='Add exactly the approved three integers in source order, starting from zero; preserve the input.';
const sumUnit=c('records/unit/summary-unit/r2.json');sumUnit.name='sum_vector';sumUnit.interface='Read the approved object {"values":[1,2,3]} from artifacts/output-r2.json without mutation and write {"sum":6} to artifacts/output-summary.json.';sumUnit.method='Initialize zero, add each of the three integer values in source order, and write exactly one sum field. Stop without output if input differs from the approved object. This fictional operation was not executed.';
files['artifacts/output-summary.json'].content={sum:6};
files['artifacts/spec-summary.md'].content='# Summary specification\n\nThe step SHALL consume exactly the accepted revision 2 object {"values":[1,2,3]} without mutation and write {"sum":6}. WHEN this object is supplied, THEN the three integers are added in source order beginning at zero. Missing or changed input SHALL stop without output. All revision 1 and revision 2 preparation artifacts remain unchanged.\n';
files['artifacts/design-summary.md'].content='# Summary execution design\n\nRead artifacts/output-r2.json. Add its values in source order beginning at zero. Write exactly one sum field to artifacts/output-summary.json as two-space-indented JSON followed by a newline. Compare input and output by exact JSON. Use the retained approved resource bound and explicit decision to decline pairing for this fictional step. No retries or additional writes are allowed.\n';
files['artifacts/tasks-summary.md'].content='# Summary tasks\n\nPrepare the disclosed summary operation, obtain separate pre-execution review, retain fictional run evidence, check the sum and unchanged input, obtain separate results review, and obtain fictional acceptance. These task definitions remain preserved.\n';
files['artifacts/work-summary.txt'].content='Fictional prepared operation: sum exactly values [1,2,3] into {"sum":6} without modifying input. No code was executed.\n';
const sumRun=c('records/run/summary-copy-run/r2.json');sumRun.check_results[0].observed=structuredClone(expectedSum);sumRun.effective_settings[0].value=structuredClone(sumMethod.selection.value);
sumRun.commands[0].program='example-sum';
c('records/comparison/summary-copy-comparison/r2.json').correctness_results[0].results[0].observed=structuredClone(expectedSum);
c('records/acceptance/summary-copy-acceptance/r2.json').response={session_id:'example-user-session',message_id:'example-accept-summary',text:'Fictional acceptance of the exact reviewed summary result for summary-step revision 2.'};
c('records/approval/summary-spec-approval/r2.json').response={session_id:'example-user-session',message_id:'example-approve-summary',text:'Fictional approval of all listed summary specification contents after renewed acceptance of copy-step revision 2.'};
files['records/snapshot/summary-input-snapshot/r2.json']=structuredClone(base['records/snapshot/input-snapshot/r1.json']);
files['records/snapshot/summary-input-snapshot/r2.json'].content.id='summary-input-snapshot';files['records/snapshot/summary-input-snapshot/r2.json'].content.revision=2;
c('records/snapshot/summary-input-snapshot/r2.json').entries=[{...ref('artifacts/output-r2.json'),size_bytes:0}];

// Disclose every created replacement, including preserved approval and evidence records.
c(amendment).affected_step_ids=['summary-step'];
c(amendment).reason='The fictional user confirms that a fixed external summary interface must consume the accepted preparation output directly. It requires a named values field, while the accepted revision 1 output is an array. An intermediate conversion and an interface change are excluded by that disclosed integration requirement.';
c(amendment).blocking_requirement='The preparation output itself must satisfy the fixed consumer interface: an object with exactly one values field. The consumer validates that input before the summary operation and cannot accept the bare array or an unapproved intermediate conversion.';
c(amendment).edits=[...r2map.values()].sort().map(p=>({path:p,operation:'create',planned_change:`Create the preserved revision 2 replacement at ${p}. ${p.endsWith('work-r2.txt')?'This is the complete affected prepared-operation inventory; the example has no executable scripts.':'Record the revised named-field contract or its exact approved review, execution, comparison, or acceptance evidence.'}`,necessity:'Supply and verify the required named-field output while preserving every revision 1 artifact.'}));

const initialEvidence=base[entry(1)].content.content.evidence_refs.filter(r=>!r.path.includes('/acceptance/'));
const originalProject=structuredClone(base[entry(1)]);
function project(revision,states,evidence) {
  const file=structuredClone(originalProject);file.content.revision=revision;
  Object.assign(file.content.content,{title:'Fictional preparation and summary cycle',step_order:['copy-step','summary-step'],current_step_id:states.find(s=>s.state!=='finished')?.step_id??null,states,evidence_refs:evidence.map(p=>typeof p==='string'?ref(p):structuredClone(p)),project_settings:{}});
  files[entry(revision)]=file;
}
const originalFinished=state('copy-step',1,'finished',acceptance(1));
project(1,[state('copy-step',1,'awaiting_acceptance'),state('summary-step',1,'provisional')],initialEvidence);
project(2,[originalFinished,state('summary-step',1,'interviewing')],[...initialEvidence,acceptance(1),'records/review/summary-draft-review/r1.json']);
project(3,[state('copy-step',2,'reopened',null,amendment),state('summary-step',1,'suspended',null,null,['copy-step'])],[...initialEvidence,acceptance(1),'records/approval/reopen-approval/r1.json','records/review/summary-draft-review/r1.json']);
const revisedEvidence=[...r2map.values()].filter(p=>/^records\/(approval|review|run|comparison|acceptance)\//.test(p));
project(4,[state('copy-step',2,'finished',acceptance(2),amendment),state('summary-step',2,'interviewing')],[...initialEvidence,acceptance(1),'records/approval/reopen-approval/r1.json',...revisedEvidence]);
project(5,[state('copy-step',2,'finished',acceptance(2),amendment),state('summary-step',2,'finished','records/acceptance/summary-copy-acceptance/r2.json')],[...initialEvidence,acceptance(1),'records/approval/reopen-approval/r1.json',...revisedEvidence,...[...summaryMap.values()].filter(p=>/^records\/(approval|review|run|comparison|acceptance)\//.test(p))]);

// Snapshot ordering is normative; all references bind the final saved exact bytes.
for(const runPath of ['records/run/copy-run/r2.json','records/run/summary-copy-run/r2.json']) {
 const run=c(runPath), setting=run.effective_settings[0].value;
 run.resource_use.input_bytes=encode(files[setting.input]).length;
 run.resource_use.output_bytes=encode(files[setting.output]).length;
}
for(const file of Object.values(files)) if(file.content?.kind==='snapshot')file.content.content.entries.sort((a,b)=>Buffer.compare(Buffer.from(a.path),Buffer.from(b.path)));
rebuild(files);
for(const [p,file] of Object.entries(files)) { await mkdir(path.dirname(path.join(root,p)),{recursive:true});await writeFile(path.join(root,p),encode(file)); }
console.log(`Saved ${Object.keys(files).length} fictional files under ${root}`);
