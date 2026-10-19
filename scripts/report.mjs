import {performance} from 'node:perf_hooks';
import {loadGraph, DEFAULT_LIMITS} from './graph.mjs';
import {assessReadiness} from './readiness.mjs';
import {assessLifecycle} from './lifecycle.mjs';
import {finding, sortFindings, MESSAGES} from './findings.mjs';
export const REVIEW_OBLIGATIONS = ['semantic-completeness','approval-provenance','review-independence','evidence-authenticity'].map(code=>Object.freeze({code,message:MESSAGES[code]}));
export const OPERATIONS = ['structure','implementation_readiness','lifecycle'];
export function supportedRuntime(version=process.versions.node) {
 const [major,minor,patch]=version.split('.').map(Number);
 return major===24 && (minor>22 || minor===22 && patch>=0) || major===26 && (minor>11 || minor===11 && patch>=1);
}
export function createReport({operation=null,entry=null,graph=null,findings=[],complete=false}={}) {
 const ordered=sortFindings(findings);
 const has=c=>ordered.some(f=>f.category===c);
 const invalidInvocation=has('invocation');
 const incomplete=!complete || has('incomplete') || has('internal');
 const knownBad=has('structural'), blocked=has('readiness');
 const p=graph?.records?.get(graph.entry);
 const state=Array.isArray(p?.content?.states)?p.content.states.find(s=>s?.step_id===p.content.current_step_id):undefined;
 return {
  report_version:1, operation, entry_path:entry, entry_sha256:graph?.entry_sha256??null,
  target_step_id:operation!=='structure'?state?.step_id??null:null,
  target_step_revision:operation!=='structure'?state?.revision??null:null,
  completion:invalidInvocation?'not_started':incomplete?'incomplete':'complete',
  structure:invalidInvocation?'not_assessed':knownBad?'invalid':incomplete?'indeterminate':'valid',
  implementation_readiness:operation!=='implementation_readiness'?'not_requested':invalidInvocation?'not_assessed':knownBad||blocked?'blocked':incomplete?'indeterminate':'satisfied_in_records',
  lifecycle_status:operation!=='lifecycle'?'not_requested':invalidInvocation?'not_assessed':knownBad||blocked?'blocked':incomplete?'indeterminate':'satisfied_in_records',
  findings:ordered,review_obligations:REVIEW_OBLIGATIONS,
  exit_status:has('internal')?4:invalidInvocation?3:knownBad||blocked?1:incomplete?2:0,
 };
}
export async function validate(options={}) {
 const {operation,workspace,entry,externalFiles=[],limits={}}=options;
 if(!OPERATIONS.includes(operation)) return createReport({findings:[finding('invocation','invalid-operation')]});
 if(!supportedRuntime()) return createReport({operation,entry,findings:[finding('incomplete','check-not-supported')]});
 const start=performance.now();
 try {
  const graph=await loadGraph({workspace,entry,externalFiles,limits});
  let findings=[...graph.findings];
  if(!findings.some(f=>f.category==='invocation')) {
   if(operation==='implementation_readiness') findings.push(...assessReadiness(graph),...assessLifecycle(graph));
   if(operation==='lifecycle') findings.push(...assessLifecycle(graph));
  }
  let complete=graph.complete;
  const limit=graph.limits?.findings??DEFAULT_LIMITS.findings;
  findings=sortFindings(findings);
  if(performance.now()-start >= (graph.limits?.deadlineMs??DEFAULT_LIMITS.deadlineMs)) {findings.push(finding('incomplete','resource-limit'));complete=false;}
  if(findings.length>limit) {findings=sortFindings(findings).slice(0,limit-1);findings.push(finding('incomplete','resource-limit'));complete=false;}
  return createReport({operation,entry,graph,findings,complete});
 } catch {
  return createReport({operation,entry,findings:[finding('internal','internal-failure')]});
 }
}
export function formatReport(report,format='json') {
 if(format==='json') return JSON.stringify(report,null,2)+'\n';
 if(format!=='readable') throw new TypeError('Unknown report format.');
 const fields=[['Report version','report_version'],['Operation','operation'],['Entry','entry_path'],['Entry SHA-256','entry_sha256'],['Target step','target_step_id'],['Target revision','target_step_revision'],['Completion','completion'],['Structure','structure'],['Implementation readiness','implementation_readiness'],['Lifecycle','lifecycle_status'],['Exit status','exit_status']];
 const text=['Vibe2Spec validation report',...fields.map(([label,key])=>`${label}: ${JSON.stringify(report[key])}`),'',`Findings: ${report.findings.length}`];
 for(const f of report.findings) text.push(['category','code','path','pointer','related_path','message'].map(k=>JSON.stringify(f[k])).join(' | '));
 text.push('',`Reviewer obligations: ${report.review_obligations.length}`);
 for(const o of report.review_obligations) text.push(`${JSON.stringify(o.code)} | ${JSON.stringify(o.message)}`);
 return text.join('\n')+'\n';
}
