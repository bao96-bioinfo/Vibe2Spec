import { finding, sortFindings, compareUtf8, escapePointer } from './findings.mjs';
import { checkRecordEnvelope, RECORD_KINDS, isRecordObject, isIdentifier } from './envelope.mjs';
export { RECORD_KINDS, isRecordObject, isIdentifier } from './envelope.mjs';

const str = { t:'string', nonempty:true }, string = {t:'string'}, id={t:'identifier'}, integer={t:'integer',min:0}, revision={t:'integer',min:1}, json={t:'json'};
const en = (...values)=>({t:'enum',values});
const obj = fields=>({t:'object',fields});
const arr = (item,min=0,unique=null)=>({t:'array',item,min,unique});
const nullable = spec=>({...spec,nullable:true});
const optional = spec=>({...spec,optional:true});
const ref = kind=>({t:'ref',kind});
const path={t:'path'}, directory={t:'path',directory:true}, timestamp={t:'timestamp'};
const actor = {t:'actor'}, response = obj({session_id:str,message_id:str,text:str});
const settings={t:'settings'}, decisionRef=ref('decision'), snapshotRef=ref('snapshot');
const rule={t:'variant',key:'category',variants:{exact_bytes:obj({category:en('exact_bytes')}),exact_json:obj({category:en('exact_json'),array_order:en('preserved'),object_key_order:en('ignored')}),numerical:obj({category:en('numerical'),metric:str,tolerance:{t:'tolerance'},boundary:en('inclusive','exclusive'),zero_policy:str,nonfinite_policy:str,alignment:str,checker_ref:ref(null)})}};
const result=obj({check_id:id,outcome:en('pass','fail','unable_to_determine'),observed:json,detail:str});
const effective=obj({name:str,value:json,decision_ref:decisionRef,source:str});
const stateNames=['provisional','interviewing','awaiting_specification','ready_to_implement','awaiting_pre_execution_review','ready_to_execute','awaiting_results_review','awaiting_acceptance','finished','reopened','suspended'];
const state=obj({step_id:id,revision,state:en(...stateNames),acceptance_ref:nullable(ref('acceptance')),amendment_ref:nullable(ref('amendment')),blocked_by:arr(id,0,'value')});
const selection={t:'variant',key:'mode',variants:{literal:obj({mode:en('literal'),value:json}),derived:obj({mode:en('derived'),expression:str,input_refs:arr(decisionRef)}),inapplicable:obj({mode:en('inapplicable'),reason:str})}};
const reviewOutcome=en('pass','changes_required','unable_to_determine');
const coverage=obj({id,input_refs:arr(ref(null),1,'path'),dependency_refs:arr(ref(null),0,'path'),check_ids:arr(id,0,'value'),outcome:reviewOutcome});
const continuation=obj({baseline_review_ref:ref('review'),reused_coverage_ids:arr(id,0,'value'),finding_resolutions:arr(obj({code:id,path:string,coverage_ids:arr(id,1,'value'),detail:str}))});
const schemas={
  project:obj({title:str,overview_ref:ref(null),step_order:arr(id,1,'value'),current_step_id:nullable(id),states:arr(state),evidence_refs:arr(ref(['approval','review','run','comparison','acceptance','amendment'])),project_settings:settings}),
  decision:obj({question:str,options:arr(obj({id:str,label:str,explanation:str}),0,'id'),selection,rationale:str,evidence_refs:arr(ref('evidence'))}),
  evidence:obj({source_uri:str,source_title:str,source_version:nullable(str),accessed_at:timestamp,claim:str,location:str,limitations:arr(str)}),
  approval:obj({purpose:en('overview','decisions','step_specification','reopen'),snapshot_ref:snapshotRef,target_paths:arr(path,1,'value'),response}),
  step:obj({title:str,documents:obj({spec:ref(null),design:ref(null),tasks:ref(null)}),depends_on:arr(obj({step_id:id,revision})),requirements:arr(obj({id,text:str,decision_refs:arr(decisionRef),check_ids:arr(id)}),1,'id'),decision_refs:arr(decisionRef,1),input_refs:arr(ref(null)),unit_refs:arr(ref('unit'),1),outputs:arr(obj({id,path,description:str,rule,decision_refs:arr(decisionRef)}),1,'id'),checks:arr(obj({id,description:str,expected:json,rule,decision_refs:arr(decisionRef)}),1,'id'),paired_validation:obj({decision_ref:decisionRef,mode:en('enabled','disabled'),unit_ids:arr(id)}),resource_decision_refs:arr(decisionRef,1),project_settings:settings}),
  unit:obj({name:str,step_id:id,step_revision:revision,requirement_ids:arr(id,1),interface:str,method:str,argument_decision_refs:arr(decisionRef),environment_decision_refs:arr(decisionRef),failure_rules:arr(str,1),fixture_refs:arr(ref(null),1),check_ids:arr(id,1),write_paths:arr(path),project_settings:settings}),
  review:obj({phase:en('specification','pre_execution','results'),snapshot_ref:snapshotRef,reviewer:actor,artifact_authors:arr(actor,1,'actor'),workers:arr(actor),outcome:reviewOutcome,findings:arr(obj({code:id,path:string,message:str})),coverage:optional(arr(coverage,1,'id')),continuation:optional(continuation)}),
  run:obj({step_id:id,step_revision:revision,spec_snapshot_ref:snapshotRef,work_snapshot_ref:snapshotRef,pre_execution_review_ref:ref('review'),input_snapshot_ref:snapshotRef,commands:arr(obj({program:str,args:arr(string),cwd:directory,environment:arr(effective)}),1),effective_settings:arr(effective),environment:obj({runtime:str,platform:str,details:str}),output_snapshot_ref:snapshotRef,check_results:arr(result,1),worker:actor,started_at:timestamp,finished_at:timestamp,resource_use:obj({elapsed_ms:integer,input_bytes:integer,output_bytes:integer,calls:integer})}),
  comparison:obj({mode:en('single','paired'),unit_ref:ref('unit'),input_snapshot_ref:snapshotRef,run_refs:arr(ref('run'),1),worker_contexts:arr(actor),correctness_results:arr(obj({run_ref:ref('run'),results:arr(result,1)})),pairwise_results:arr(result),rules:arr(obj({check_id:id,correctness_rule:rule,pairwise_rule:nullable(rule),pairwise_decision_ref:nullable(decisionRef)}))}),
  acceptance:obj({step_id:id,step_revision:revision,spec_snapshot_ref:snapshotRef,work_snapshot_ref:snapshotRef,run_refs:arr(ref('run'),1),comparison_refs:arr(ref('comparison')),results_review_ref:ref('review'),response}),
  amendment:obj({step_id:id,previous_acceptance_ref:ref('acceptance'),proposed_revision:revision,reason:str,blocking_requirement:str,edits:arr(obj({path,operation:en('create','modify','remove'),planned_change:str,necessity:str}),1),affected_step_ids:arr(id),superseded_decision_refs:arr(decisionRef)}),
  snapshot:obj({purpose:str,entries:arr({t:'snapshot-entry'},1,'path')})
};
const refSchema=obj({path,sha256:{t:'digest'}});
const entrySchema=obj({path,sha256:{t:'digest'},size_bytes:integer});
const actorSchema=obj({session_id:str,context_id:str});

/** Syntax only. Filesystem authority, exact spelling and aliases belong to graph loading. */
export function isFilePath(value,{directory=false}={}) {
  if(typeof value!=='string'||!value.length||value.includes('\\')||value.includes('\0'))return false;
  if(directory&&value==='.')return true;
  let tail=value;
  if(value.startsWith('/')) { if(value.startsWith('//'))return false;tail=value.slice(1); }
  else if(/^[A-Z]:\//.test(value))tail=value.slice(3);
  else if(/^[A-Za-z]:/.test(value))return false;
  if(!tail)return directory;
  return tail.split('/').every(part=>part.length>0&&part!=='.'&&part!=='..');
}

export function validateRecord(value, {path:recordPath='', orders=null}={}) {
  const findings=[];
  const add=(code,pointer,related=null)=>findings.push(finding('structural',code,recordPath,pointer,related));
  if(orders!==null&&!(orders instanceof Map))throw new TypeError('Record orders must be a Map.');
  const order=(v,p)=>orders?.get(p)??Object.keys(v);
  const envelope=checkRecordEnvelope(value,{root:isRecordObject(value)?order(value,''):null,author:isRecordObject(value?.author)?order(value.author,'/author'):null});
  for(const f of envelope)findings.push(finding('structural',f.code,recordPath,f.pointer));
  if(!isRecordObject(value)||!isRecordObject(value.content)||!Object.hasOwn(schemas,value.kind))return sortFindings(findings);
  const draft=value.lifecycle==='draft';
  const own=(v,k)=>isRecordObject(v)&&Object.hasOwn(v,k);
  function validate(v,spec,p,allowDraft=true) {
    if(v===null&&(spec.nullable||(draft&&allowDraft)))return;
    const type=t=>{if(typeof v!==t){add('invalid-type',p);return false;}return true;};
    const object=()=>{if(!isRecordObject(v)){add('invalid-type',p);return false;}return true;};
    switch(spec.t){
      case 'json':
        // Envelope validation permits finite unsafe integers so its numeric field
        // diagnostics remain testable. Literal project data has stricter semantics.
        if (typeof v === 'number' && Number.isInteger(v) && !Number.isSafeInteger(v)) add('invalid-number',p);
        else if (Array.isArray(v)) v.forEach((item,i)=>validate(item,json,`${p}/${i}`));
        else if (isRecordObject(v)) for (const key of Object.keys(v)) validate(v[key],json,`${p}/${escapePointer(key)}`);
        return;
      case 'string':if(type('string')&&spec.nonempty&&!v.length)add('empty-value',p);return;
      case 'identifier':if(type('string')&&!isIdentifier(v))add('invalid-identifier',p);return;
      case 'integer':if(type('number')&&(!Number.isSafeInteger(v)||v<spec.min))add('invalid-integer',p);return;
      case 'enum':if(type('string')&&!spec.values.includes(v))add('invalid-enumeration',p);return;
      case 'path':if(type('string')&&!isFilePath(v,{directory:spec.directory}))add('invalid-path',p);return;
      case 'digest':if(type('string')&&!/^[0-9a-f]{64}(?![\s\S])/.test(v))add('invalid-digest',p);return;
      case 'timestamp':if(type('string')&&(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z(?![\s\S])/.test(v)||!Number.isFinite(Date.parse(v))||new Date(v).toISOString().replace('.000Z','Z')!==v))add('invalid-timestamp',p);return;
      case 'tolerance':
        if(typeof v==='number'){if(!Number.isFinite(v)||v<0)add('invalid-number',p);}
        else if(typeof v==='string'){if(!v.length)add('empty-value',p);else if(!/^(?:\+)?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:[eE][+-]?[0-9]+)?(?![\s\S])/.test(v))add('invalid-number',p);}
        else add('invalid-type',p);
        return;
      case 'ref':validate(v,refSchema,p);return;
      case 'snapshot-entry':validate(v,entrySchema,p);return;
      case 'actor':
        validate(v,actorSchema,p);
        if(isRecordObject(v))for(const key of ['session_id','context_id'])if(typeof v[key]==='string'&&v[key].length){if(value.context==='example'&&!v[key].startsWith('example-')||value.context==='authoring'&&v[key] !== (key==='session_id'?'template-session':'template-author'))add('context-conflict',`${p}/${key}`);}
        return;
      case 'array':
        if(!Array.isArray(v)){add('invalid-type',p);return;}
        if(v.length<spec.min)add('empty-value',p);
        {const seen=new Set();v.forEach((item,index)=>{
          validate(item,spec.item,`${p}/${index}`);
          if(spec.unique){const key=spec.unique==='value'?item:spec.unique==='actor'&&isRecordObject(item)?JSON.stringify([item.session_id,item.context_id]):item?.[spec.unique];
            if(key!==undefined&&key!==null){if(seen.has(key))add('duplicate-value',`${p}/${index}`);seen.add(key);}}
        });}return;
      case 'variant':
        if(!object())return;
        {const declared=new Set(Object.values(spec.variants).flatMap(s=>Object.keys(s.fields)));
          for(const key of order(v,p))if(!declared.has(key))add('unknown-field',`${p}/${escapePointer(key)}`);}
        if(!own(v,spec.key)||v[spec.key]===null&&draft){
          if(!own(v,spec.key))add('missing-field',`${p}/${spec.key}`);
          return;
        }
        if(typeof v[spec.key]!=='string'){add('invalid-type',`${p}/${spec.key}`);return;}
        if(!Object.hasOwn(spec.variants,v[spec.key])){add('invalid-enumeration',`${p}/${spec.key}`);return;}
        validate(v,spec.variants[v[spec.key]],p);return;
      case 'settings':
        if(!object())return;
        for(const key of order(v,p)){if(!isIdentifier(key))add('invalid-identifier',`${p}/${escapePointer(key)}`);validate(v[key],decisionRef,`${p}/${escapePointer(key)}`);}return;
      case 'object':{
        if(!object())return;
        const keys=Object.keys(spec.fields),actual=order(v,p);
        for(const key of keys)if(!own(v,key)&&!spec.fields[key].optional)add('missing-field',`${p}/${escapePointer(key)}`);
        for(const key of actual)if(!Object.hasOwn(spec.fields,key))add('unknown-field',`${p}/${escapePointer(key)}`);
        const present=keys.filter(key=>own(v,key));
        if(keys.every(key=>spec.fields[key].optional||own(v,key))&&actual.length===present.length&&actual.every(key=>Object.hasOwn(spec.fields,key))&&actual.some((key,i)=>key!==present[i]))add('invalid-field-order',p);
        for(const key of keys)if(own(v,key))validate(v[key],spec.fields[key],`${p}/${escapePointer(key)}`);
        return;
      }
      default:throw new TypeError('Unknown record schema.');
    }
  }
  validate(value.content,schemas[value.kind],'/content',false);
  const c=value.content, at=field=>`/content/${field}`;
  const sameActor=(a,b)=>isRecordObject(a)&&isRecordObject(b)&&a.session_id===b.session_id&&a.context_id===b.context_id;
  const sameRef=(a,b)=>isRecordObject(a)&&isRecordObject(b)&&a.path===b.path&&a.sha256===b.sha256;
  const sameList=(a,b)=>Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((x,i)=>x===b[i]);
  const distinct=(items,key,p)=>{if(!Array.isArray(items))return;const seen=new Set();items.forEach((item,i)=>{const v=key?item?.[key]:item;if(v!==null&&v!==undefined){if(seen.has(v))add('duplicate-value',`${p}/${i}`);seen.add(v);}});};
  if(value.kind==='project'&&Array.isArray(c.step_order)&&Array.isArray(c.states)){
    if(!sameList(c.step_order,c.states.map(s=>s?.step_id)))add('association-mismatch',at('states'));
    const current=c.states.find(s=>s&&s.state!=='finished');
    if(c.current_step_id!==null&&isIdentifier(c.current_step_id)&&!c.step_order.includes(c.current_step_id))add('association-mismatch',at('current_step_id'));
    if(!draft||c.current_step_id!==null){if((current?.step_id??null)!==c.current_step_id)add('record-inconsistency',at('current_step_id'));}
    c.states.forEach((s,i)=>{
      if(!isRecordObject(s))return;
      const p=at(`states/${i}`);
      if(s.state==='finished'&&s.acceptance_ref===null&&!draft||s.state!=='finished'&&s.acceptance_ref!==null&&s.acceptance_ref!==undefined)add('record-inconsistency',`${p}/acceptance_ref`);
      if(Array.isArray(s.blocked_by)){
        if(s.state==='suspended'&&s.blocked_by.length===0||s.state!=='suspended'&&s.blocked_by.length>0)add('record-inconsistency',`${p}/blocked_by`);
        s.blocked_by.forEach((d,j)=>{if(d===s.step_id||!c.step_order.includes(d))add('association-mismatch',`${p}/blocked_by/${j}`);});
      }
      if(s.step_id===c.current_step_id&&['provisional','suspended'].includes(s.state))add('record-inconsistency',`${p}/state`);
      if(current&&i>c.states.indexOf(current)&&!['provisional','suspended','finished'].includes(s.state)&&s.state!==null)add('record-inconsistency',`${p}/state`);
    });
  }
  if(value.kind==='snapshot'&&Array.isArray(c.entries)){
    for(let i=1;i<c.entries.length;i++)if(typeof c.entries[i-1]?.path==='string'&&typeof c.entries[i]?.path==='string'&&compareUtf8(c.entries[i-1].path,c.entries[i].path)>0)add('invalid-order',at(`entries/${i}`));
    c.entries.forEach((e,i)=>{if(e?.path===recordPath)add('forbidden-snapshot-entry',at(`entries/${i}`));});
  }
  if(value.kind==='step'){
    distinct(c.outputs,'path',at('outputs'));
    if(Array.isArray(c.checks)&&Array.isArray(c.requirements))c.requirements.forEach((r,i)=>{if(Array.isArray(r?.check_ids))r.check_ids.forEach((check,j)=>{if(!c.checks.some(c=>c?.id===check))add('association-mismatch',at(`requirements/${i}/check_ids/${j}`));});});
    if(isRecordObject(c.paired_validation)&&Array.isArray(c.paired_validation.unit_ids)&&((c.paired_validation.mode==='enabled'&&c.paired_validation.unit_ids.length===0)||(c.paired_validation.mode==='disabled'&&c.paired_validation.unit_ids.length!==0)))add('record-inconsistency',at('paired_validation/unit_ids'));
  }
  if(value.kind==='review'){
    if(own(c,'continuation')&&!own(c,'coverage'))add('missing-field',at('coverage'));
    if(Array.isArray(c.coverage))c.coverage.forEach((item,i)=>{
      if(!Array.isArray(item?.input_refs)||!Array.isArray(item?.dependency_refs))return;
      const inputs=new Set(item.input_refs.map(reference=>reference?.path).filter(path=>typeof path==='string'));
      item.dependency_refs.forEach((reference,j)=>{if(inputs.has(reference?.path))add('duplicate-value',at(`coverage/${i}/dependency_refs/${j}`));});
    });
    if(isRecordObject(c.reviewer)&&!sameActor(c.reviewer,value.author))add('association-mismatch',at('reviewer'));
    if(c.outcome==='pass'&&Array.isArray(c.findings)&&c.findings.length)add('record-inconsistency',at('findings'));
    if(Array.isArray(c.artifact_authors))for(let i=1;i<c.artifact_authors.length;i++){
      const a=c.artifact_authors[i-1],b=c.artifact_authors[i];
      if(typeof a?.session_id==='string'&&typeof b?.session_id==='string'&&typeof a.context_id==='string'&&typeof b.context_id==='string'&&(compareUtf8(a.session_id,b.session_id)||compareUtf8(a.context_id,b.context_id))>0)add('invalid-order',at(`artifact_authors/${i}`));
    }
    for(const key of ['artifact_authors','workers'])if(Array.isArray(c[key])&&typeof c.reviewer?.context_id==='string')c[key].forEach((a,i)=>{if(a?.context_id===c.reviewer.context_id)add('record-inconsistency',at(`${key}/${i}`));});
  }
  if(value.kind==='run'){
    distinct(c.check_results,'check_id',at('check_results'));
    distinct(c.effective_settings,'name',at('effective_settings'));
    if(Array.isArray(c.commands)) c.commands.forEach((command,i)=>distinct(command?.environment,'name',at(`commands/${i}/environment`)));
    if(isRecordObject(c.worker)&&!sameActor(c.worker,value.author))add('association-mismatch',at('worker'));
    if(typeof c.started_at==='string'&&typeof c.finished_at==='string'&&Date.parse(c.finished_at)<Date.parse(c.started_at))add('invalid-timestamp',at('finished_at'));
  }
  if(value.kind==='comparison'&&['single','paired'].includes(c.mode)){
    const count=c.mode==='single'?1:2;
    for(const key of ['run_refs','worker_contexts','correctness_results'])if(Array.isArray(c[key])&&c[key].length!==count)add('association-mismatch',at(key));
    if(c.mode==='paired'&&Array.isArray(c.worker_contexts)&&c.worker_contexts.length===2&&c.worker_contexts[0]?.context_id===c.worker_contexts[1]?.context_id)add('record-inconsistency',at('worker_contexts'));
    if(Array.isArray(c.pairwise_results)&&((c.mode==='single'&&c.pairwise_results.length)||(c.mode==='paired'&&!c.pairwise_results.length)))add('record-inconsistency',at('pairwise_results'));
    if(Array.isArray(c.correctness_results)&&Array.isArray(c.run_refs))c.correctness_results.forEach((g,i)=>{if(isRecordObject(g?.run_ref)&&isRecordObject(c.run_refs[i])&&!sameRef(g.run_ref,c.run_refs[i]))add('association-mismatch',at(`correctness_results/${i}/run_ref`));});
    if(Array.isArray(c.rules))c.rules.forEach((r,i)=>{
      if(!isRecordObject(r))return;
      for(const key of ['pairwise_rule','pairwise_decision_ref'])if(c.mode==='single'&&r[key]!==null&&r[key]!==undefined||c.mode==='paired'&&r[key]===null&&!draft)add('record-inconsistency',at(`rules/${i}/${key}`));
    });
    if(c.mode==='paired'&&Array.isArray(c.pairwise_results))c.pairwise_results.forEach((r,i)=>{if(own(r,'observed'))validate(r.observed,obj({left:json,right:json}),at(`pairwise_results/${i}/observed`));});
  }
  return sortFindings(findings);
}

/** Enumerate declared reference positions only; literal user data is never traversed. */
export function getReferences(value) {
  const refs=[];
  if(!isRecordObject(value)||!isRecordObject(value.content)||!Object.hasOwn(schemas,value.kind))return refs;
  function visit(v,s,p){
    if(v===null||v===undefined)return;
    if(s.t==='ref'||s.t==='snapshot-entry'){
      if(isRecordObject(v)&&typeof v.path==='string'&&typeof v.sha256==='string')refs.push({ref:v,pointer:p,kind:s.t==='ref'?s.kind:null});return;
    }
    if(s.t==='object'&&isRecordObject(v))for(const [k,child]of Object.entries(s.fields))if(Object.hasOwn(v,k))visit(v[k],child,`${p}/${escapePointer(k)}`);
    if(s.t==='array'&&Array.isArray(v))v.forEach((child,i)=>visit(child,s.item,`${p}/${i}`));
    if(s.t==='variant'&&isRecordObject(v)&&Object.hasOwn(s.variants,v[s.key]))visit(v,s.variants[v[s.key]],p);
    if(s.t==='settings'&&isRecordObject(v))for(const k of Object.keys(v))visit(v[k],decisionRef,`${p}/${escapePointer(k)}`);
  }
  visit(value.content,schemas[value.kind],'/content');
  return refs;
}
