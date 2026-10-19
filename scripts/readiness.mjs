import { getReferences } from './records.mjs';
import { finding, sortFindings } from './findings.mjs';

export const list = value => Array.isArray(value) ? value : [];
export const sameRef = (a,b) => Boolean(a && b && a.path === b.path && a.sha256 === b.sha256);
export const validRecord = (graph, path) => graph.records.has(path) && graph.recordValidity?.get(path) !== false;
export function resolveRef(graph, ref, kind = null) {
  if (!ref || graph.artifacts.get(ref.path)?.sha256 !== ref.sha256) return null;
  const record = graph.records.get(ref.path);
  return validRecord(graph,ref.path) && (!kind || (Array.isArray(kind) ? kind : [kind]).includes(record.kind)) ? record : null;
}
export function recordPath(graph, record) {
  for (const [file,value] of graph.records) if (value === record) return file;
  return null;
}
export const ofKind = (graph,kind) => [...graph.records.entries()].filter(([,r]) => r.kind === kind);
export const identityStep = (graph,id,revision) => ofKind(graph,'step').find(([,r]) => r.id === id && r.revision === revision);
export function scopePaths(graph, start, {normative = false} = {}) {
  const found = new Set();
  const pending = [start];
  while (pending.length) {
    const file = pending.pop();
    if (typeof file !== 'string' || found.has(file)) continue;
    found.add(file);
    const record = graph.records.get(file);
    if (!record) continue;
    if (normative && !['step','unit','decision','snapshot'].includes(record.kind)) continue;
    for (const descriptor of getReferences(record)) {
      if (graph.artifacts.get(descriptor.ref?.path)?.sha256 === descriptor.ref?.sha256
        && (!descriptor.kind || resolveRef(graph,descriptor.ref,descriptor.kind))) pending.push(descriptor.ref.path);
    }
  }
  return found;
}
export function snapshotEntries(graph, ref) {
  const snapshot = resolveRef(graph,ref,'snapshot');
  if (!snapshot || snapshot.lifecycle !== 'frozen') return new Map();
  return new Map(list(snapshot.content?.entries).filter(e => graph.artifacts.get(e.path)?.sha256 === e.sha256 && graph.artifacts.get(e.path)?.bytes.length === e.size_bytes).map(e => [e.path,e.sha256]));
}
export function specificationScope(graph, stepPath, project = graph.records.get(graph.entry)) {
  const scope = scopePaths(graph,stepPath,{normative:true});
  const settings = project?.content?.project_settings;
  if (settings && typeof settings === 'object' && !Array.isArray(settings)) {
    for (const ref of Object.values(settings)) if (resolveRef(graph,ref,'decision')) {
      for (const file of scopePaths(graph,ref.path,{normative:true})) scope.add(file);
    }
  }
  return scope;
}
export function snapshotContains(graph, ref, files) {
  const entries = snapshotEntries(graph,ref);
  return [...files].every(p => entries.get(p) === graph.artifacts.get(p)?.sha256 && entries.has(p));
}
export function approvalCovers(graph, file, purposes = ['decisions','step_specification']) {
  return ofKind(graph,'approval').some(([path,a]) => validRecord(graph,path) && a.lifecycle === 'frozen' && purposes.includes(a.content?.purpose)
    && list(a.content?.target_paths).includes(file)
    && snapshotEntries(graph,a.content.snapshot_ref).get(file) === graph.artifacts.get(file)?.sha256
    && graph.artifacts.has(file));
}
export function approvalCoversScope(graph, files, purpose = 'step_specification') {
  return ofKind(graph,'approval').some(([path,a]) => validRecord(graph,path) && a.lifecycle === 'frozen'
    && a.content?.purpose === purpose && [...files].every(file => list(a.content.target_paths).includes(file)
      && snapshotEntries(graph,a.content.snapshot_ref).get(file) === graph.artifacts.get(file)?.sha256 && graph.artifacts.has(file)));
}
function unresolved(value) {
  if (value === null || value === undefined) return true;
  if (Array.isArray(value)) return value.some(unresolved);
  if (value && typeof value === 'object') return Object.entries(value).some(([key,item]) => key !== 'expected' && unresolved(item));
  return false;
}
export function reviewFindings(graph, reviewPath, {requirePass = true} = {}) {
  const review = graph.records.get(reviewPath);
  if (review?.kind !== 'review') return [];
  const c = review.content ?? {};
  const out = [];
  const add = (code,pointer,related = null,category = 'readiness') => out.push(finding(category,code,reviewPath,pointer,related));
  if (requirePass && (!validRecord(graph,reviewPath) || review.lifecycle !== 'frozen' || c.outcome !== 'pass' || list(c.findings).length)) add('review-not-passing','/content/outcome');
  const reviewer = c.reviewer?.context_id;
  const authors = list(c.artifact_authors), workers = list(c.workers);
  const scopedAuthors = [...scopePaths(graph,c.snapshot_ref?.path)].map(p => graph.records.get(p)?.author).filter(Boolean);
  if (reviewer && [...authors,...workers,...scopedAuthors].some(a => a?.context_id === reviewer)) add('review-not-independent','/content/reviewer');
  for (const actor of scopedAuthors) {
    if (!authors.some(a => a?.session_id === actor.session_id && a?.context_id === actor.context_id)) add('association-mismatch','/content/artifact_authors',null,'structural');
  }
  if (!resolveRef(graph,c.snapshot_ref,'snapshot') || resolveRef(graph,c.snapshot_ref,'snapshot')?.lifecycle !== 'frozen') add('snapshot-membership-mismatch','/content/snapshot_ref',c.snapshot_ref?.path ?? null,'structural');
  return sortFindings(out);
}
export function checkStepReadiness(graph, stepPath, {project = graph.records.get(graph.entry), requireContext = true} = {}) {
  const out = [];
  const step = graph.records.get(stepPath);
  if (!step || step.kind !== 'step') return [finding('readiness','missing-current-step',graph.entry)];
  const add = (code,file = stepPath,pointer = null,related = null,category = 'readiness') => out.push(finding(category,code,file,pointer,related));
  const c = step.content ?? {};
  if (requireContext && step.context !== 'project') add('non-project-context',stepPath,'/context');
  if (step.lifecycle !== 'frozen' || !validRecord(graph,stepPath)) add('unpreserved-specification',stepPath,'/lifecycle');
  if (!validRecord(graph,stepPath)) return sortFindings(out);
  if (unresolved(c)) add('incomplete-step',stepPath,'/content');
  if (!c.paired_validation?.decision_ref) add('missing-pair-decision',stepPath,'/content/paired_validation');
  const scope = specificationScope(graph,stepPath,project);
  for (const file of scope) {
    const record = graph.records.get(file);
    if (record && ['step','unit','decision'].includes(record.kind)) {
      if (record.lifecycle !== 'frozen' && record.kind !== 'step') add(record.kind === 'decision' ? 'unresolved-decision' : 'incomplete-unit',file,'/lifecycle');
      if (requireContext && record.context !== 'project') add('non-project-context',file,'/context');
      if (record.kind === 'decision' && (!record.content?.selection || record.lifecycle !== 'frozen')) add('unresolved-decision',file,'/content/selection');
      if (record.kind === 'unit' && unresolved(record.content)) add('incomplete-unit',file,'/content');
    }
    if (!approvalCovers(graph,file,record?.kind === 'decision' ? ['decisions','step_specification'] : ['step_specification']) && graph.complete) add(record?.kind === 'decision' ? 'unapproved-decision' : 'unapproved-specification',file);
  }
  if (graph.complete && !approvalCoversScope(graph,scope)) add('unapproved-specification',stepPath);
  const pairingChoice = resolveRef(graph,c.paired_validation?.decision_ref,'decision')?.content?.selection;
  if (pairingChoice?.mode === 'literal' && ['enabled','disabled'].includes(pairingChoice.value)
      && pairingChoice.value !== c.paired_validation?.mode) add('association-mismatch',stepPath,'/content/paired_validation/mode',null,'structural');
  const stepChecks = new Set(list(c.checks).map(check => check.id));
  const requirementIds = new Set(list(c.requirements).map(r => r.id));
  for (const requirement of list(c.requirements)) {
    if (!list(requirement.check_ids).length || !list(requirement.decision_refs).length) add('missing-comparison-coverage',stepPath,'/content/requirements');
  }
  const units = list(c.unit_refs).map(ref => [ref,resolveRef(graph,ref,'unit')]);
  const coveredChecks = new Set();
  for (const [ref,unit] of units) {
    if (!unit) continue;
    if (unit.content?.step_id !== step.id || unit.content?.step_revision !== step.revision) add('association-mismatch',ref.path,'/content/step_id',stepPath,'structural');
    for (const id of list(unit.content?.check_ids)) {
      if (!stepChecks.has(id)) add('association-mismatch',ref.path,'/content/check_ids',stepPath,'structural');
      coveredChecks.add(id);
    }
    for (const id of list(unit.content?.requirement_ids)) if (!requirementIds.has(id)) add('association-mismatch',ref.path,'/content/requirement_ids',stepPath,'structural');
  }
  for (const id of stepChecks) if (!coveredChecks.has(id)) add('missing-comparison-coverage',stepPath,'/content/checks');
  if (c.paired_validation?.mode === 'enabled') {
    const unitIds = new Set(units.map(([,u]) => u?.id));
    for (const id of list(c.paired_validation.unit_ids)) if (!unitIds.has(id)) add('association-mismatch',stepPath,'/content/paired_validation/unit_ids',null,'structural');
  }
  const candidates = ofKind(graph,'review').filter(([,r]) => r.content?.phase === 'specification' && snapshotContains(graph,r.content?.snapshot_ref,scope));
  if (!candidates.length && graph.complete) add('missing-specification-review');
  else if (!candidates.some(([p]) => reviewFindings(graph,p).length === 0)) for (const [p] of candidates) out.push(...reviewFindings(graph,p));
  for (const dependency of list(c.depends_on)) {
    const state = list(project?.content?.states).find(s => s.step_id === dependency.step_id);
    if (!state || state.revision !== dependency.revision || state.state !== 'finished') add('dependency-not-current',stepPath,'/content/depends_on');
    const accepted = resolveRef(graph,state?.acceptance_ref,'acceptance');
    if (!accepted || accepted.lifecycle !== 'frozen' || accepted.content?.step_id !== dependency.step_id || accepted.content?.step_revision !== dependency.revision) add('missing-acceptance',stepPath,'/content/depends_on',state?.acceptance_ref?.path ?? null);
  }
  return sortFindings(out);
}

export function assessReadiness(graph) {
  const project = graph.records.get(graph.entry);
  if (project?.kind !== 'project') return graph.complete ? [finding('readiness','missing-current-step',graph.entry)] : [];
  const out = [];
  if (project.context !== 'project') out.push(finding('readiness','non-project-context',graph.entry,'/context'));
  if (project.lifecycle !== 'frozen') out.push(finding('readiness','incomplete-step',graph.entry,'/lifecycle'));
  const state = list(project.content?.states).find(s => s?.step_id === project.content?.current_step_id);
  const step = state && identityStep(graph,state.step_id,state.revision);
  if (!step) { if (graph.complete) out.push(finding('readiness','missing-current-step',graph.entry,'/content/current_step_id')); return sortFindings(out); }
  if (['provisional','suspended','finished','reopened','interviewing'].includes(state.state)) out.push(finding('readiness','incomplete-step',step[0]));
  if (!approvalCovers(graph,project.content?.overview_ref?.path,['overview','step_specification']) && graph.complete) out.push(finding('readiness','unapproved-specification',graph.entry,'/content/overview_ref'));
  out.push(...checkStepReadiness(graph,step[0],{project}));
  return sortFindings(out);
}
