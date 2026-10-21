import {performance} from 'node:perf_hooks';
import {compareUtf8, finding, sortFindings} from './findings.mjs';
import {DEFAULT_LIMITS} from './graph.mjs';
import {createReport} from './report.mjs';
import {coverageMatches, list, resolveRef, reviewFindings, scopePaths, validRecord} from './readiness.mjs';

const sorted = values => [...new Set(values)].sort(compareUtf8);
const refs = item => [...list(item?.input_refs), ...list(item?.dependency_refs)];
const notice = 'Advisory only: candidate reuse requires independent impact assessment. This packet grants no approval, review pass, or permission to execute.';

/** Build a compact suggestion. Pass a performance.now() start taken before loading to share its deadline. */
export function buildReviewPacket(graph,{startedAt=performance.now()}={}) {
 const findings = [...(graph?.findings ?? [])];
 const result = packet => {
  let ordered=sortFindings(findings),complete=graph?.complete === true;
  // Invalid invocations have not started an assessment and may contain invalid limits.
  if (!ordered.some(item => item.category === 'invocation')) {
   const limit=graph?.limits?.findings ?? DEFAULT_LIMITS.findings;
   if (performance.now()-startedAt >= (graph?.limits?.deadlineMs ?? DEFAULT_LIMITS.deadlineMs)) {
    ordered=sortFindings([...ordered,finding('incomplete','resource-limit')]);complete=false;
   }
   if (ordered.length > limit) {
    ordered=ordered.slice(0,limit-1);ordered.push(finding('incomplete','resource-limit'));complete=false;
   }
  }
  const report=createReport({operation:'structure',entry:graph?.entry ?? null,graph,findings:ordered,complete});
  return {packet:report.exit_status === 0 ? packet : null,report};
 };
 if (!Number.isFinite(startedAt)) {findings.push(finding('invocation','invalid-argument'));return result(null);}
 if (!graph?.complete || findings.length) return result(null);
 if (performance.now()-startedAt >= (graph.limits?.deadlineMs ?? DEFAULT_LIMITS.deadlineMs)) return result(null);
 const current = graph.records.get(graph.entry);
 if (current?.kind !== 'review' || !validRecord(graph,graph.entry)) {
  findings.push(finding('structural','reference-kind-mismatch',graph.entry)); return result(null);
 }
 const c = current.content;
 const snapshot = resolveRef(graph,c.snapshot_ref,'snapshot');
 if (!snapshot || snapshot.lifecycle !== 'frozen') findings.push(finding('structural','snapshot-membership-mismatch',graph.entry,'/content/snapshot_ref',c.snapshot_ref?.path ?? null));
 if (!['specification','pre_execution','results'].includes(c.phase)) findings.push(finding('structural','invalid-enumeration',graph.entry,'/content/phase'));
 if (findings.length) return result(null);

 const fullScope = scopePaths(graph,c.snapshot_ref.path);
 const scope = new Set([...fullScope].filter(file => graph.records.get(file)?.kind !== 'snapshot'));
 const items = list(c.coverage).filter(item => item && typeof item.id === 'string');
 for (let i=0;i<items.length;i++) for (const ref of refs(items[i])) {
  if (ref && !fullScope.has(ref.path)) findings.push(finding('structural','review-coverage-reference-invalid',graph.entry,'/content/coverage',ref.path ?? null));
 }
 const baselineRef = c.continuation?.baseline_review_ref;
 let baseline = null;
 if (c.continuation) {
  baseline = resolveRef(graph,baselineRef,'review');
  if (!baseline || baseline.lifecycle !== 'frozen' || baseline.content.phase !== c.phase || !['pass','changes_required'].includes(baseline.content.outcome)) {
   findings.push(finding('readiness','review-baseline-invalid',graph.entry,'/content/continuation/baseline_review_ref',baselineRef?.path ?? null));
  } else {
   if (!Array.isArray(baseline.content.coverage) || !baseline.content.coverage.length) findings.push(finding('readiness','review-coverage-required',baselineRef.path,'/content/coverage'));
   findings.push(...reviewFindings(graph,baselineRef.path,{requirePass:false}));
   if (scope.has(baselineRef.path)) findings.push(finding('readiness','review-baseline-in-scope',graph.entry,'/content/continuation/baseline_review_ref',baselineRef.path));
  }
 }
 if (findings.length) return result(null);

 const candidates = new Set(items.filter(item => (item.outcome === null || item.outcome === 'pass')
  && !list(c.findings).some(issue => issue?.path === '' || refs(item).some(ref => ref?.path === issue?.path))
  && list(baseline?.content.coverage).some(previous => previous.outcome === 'pass' && coverageMatches(item,previous))).map(item => item.id));
 const covered = new Set(items.flatMap(item => refs(item).map(ref => ref?.path)).filter(file => scope.has(file)));
 const uncovered = sorted([...scope].filter(file => !covered.has(file)));
 const uncoveredChecks = [...scope].flatMap(file => {
  const record=graph.records.get(file);
  return record?.kind === 'step' ? list(record.content.checks).filter(check => !items.some(item => list(item.check_ids).includes(check.id) && refs(item).some(ref => ref?.path === file))).map(check => ({step_path:file,check_id:check.id})) : [];
 }).sort((a,b) => compareUtf8(a.step_path,b.step_path) || compareUtf8(a.check_id,b.check_id));
 const freshPaths = [...uncovered,...uncoveredChecks.map(check => check.step_path),...items.filter(item => !candidates.has(item.id)).flatMap(item => refs(item).map(ref => ref?.path))];
 const inspection = sorted(freshPaths.flatMap(file => [...scopePaths(graph,file)]).filter(file => scope.has(file)));
 const identity = (file,record) => ({path:file,sha256:graph.artifacts.get(file).sha256,id:record.id,revision:record.revision,lifecycle:record.lifecycle});
 const bytes = files => [...files].reduce((total,file) => total + graph.artifacts.get(file).bytes.length,0);
 const packet = {
  packet_version:1,
  notice,
  current_review:identity(graph.entry,current),
  phase:c.phase,
  snapshot_ref:c.snapshot_ref,
  baseline_review:baseline ? identity(baselineRef.path,baseline) : null,
  baseline_snapshot_ref:baseline?.content.snapshot_ref ?? null,
  candidate_reuse_ids:sorted(candidates),
  fresh_coverage_ids:sorted(items.filter(item => !candidates.has(item.id)).map(item => item.id)),
  uncovered_paths:uncovered,
  uncovered_checks:uncoveredChecks,
  inspection_paths:inspection,
  baseline_findings:list(baseline?.content.findings).map((item,index) => ({code:item.code,path:item.path,record_path:baselineRef.path,pointer:`/content/findings/${index}`})),
  measurements:{scope_files:scope.size,scope_bytes:bytes(scope),inspection_files:inspection.length,inspection_bytes:bytes(inspection),graph_files_read:graph.stats?.files ?? graph.artifacts.size,graph_bytes_read:graph.stats?.bytes ?? bytes(graph.artifacts.keys())},
 };
 return result(packet);
}

export function formatReviewPacket(packet,format='json') {
 if (format === 'json') return JSON.stringify(packet,null,2)+'\n';
 if (format !== 'readable') throw new TypeError('Unknown packet format.');
 const text = ['Vibe2Spec review inspection packet',packet.notice,
  `Current review: ${JSON.stringify(packet.current_review)}`,`Phase: ${packet.phase}`,`Current snapshot: ${JSON.stringify(packet.snapshot_ref)}`,
  `Baseline review: ${JSON.stringify(packet.baseline_review)}`,`Baseline snapshot: ${JSON.stringify(packet.baseline_snapshot_ref)}`,
  `Candidate reusable items: ${JSON.stringify(packet.candidate_reuse_ids)}`,`Fresh items: ${JSON.stringify(packet.fresh_coverage_ids)}`,
  `Uncovered paths: ${JSON.stringify(packet.uncovered_paths)}`,`Uncovered checks: ${JSON.stringify(packet.uncovered_checks)}`,'','Inspection paths:',...packet.inspection_paths.map(file => JSON.stringify(file)),
  '',`Baseline findings: ${packet.baseline_findings.length}`,...packet.baseline_findings.map(item => JSON.stringify(item)),
  '',`Measured scope: ${packet.measurements.scope_files} files, ${packet.measurements.scope_bytes} bytes`,
  `Suggested inspection: ${packet.measurements.inspection_files} files, ${packet.measurements.inspection_bytes} bytes`,
  `Graph loaded: ${packet.measurements.graph_files_read} files, ${packet.measurements.graph_bytes_read} bytes`];
 return text.join('\n')+'\n';
}
