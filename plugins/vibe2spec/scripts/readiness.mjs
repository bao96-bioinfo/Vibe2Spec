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
      // A continuation baseline is historical evidence, never assessment input.
      // Graph loading still follows this declared reference and checks its bytes.
      if (record.kind === 'review' && descriptor.pointer === '/content/continuation/baseline_review_ref') continue;
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
const coverageRefs = item => [...list(item?.input_refs),...list(item?.dependency_refs)];
const refKey = value => JSON.stringify([value?.path,value?.sha256]);
const findingKey = value => JSON.stringify([value?.code,value?.path]);
function matchingSets(left, right, key = value => value) {
  if (!Array.isArray(left) || !Array.isArray(right)) return false;
  const a = new Set(left.map(key)), b = new Set(right.map(key));
  return a.size === left.length && b.size === right.length && a.size === b.size && [...a].every(value => b.has(value));
}
/** Structural equality only; callers decide whether the outcomes permit reuse. */
export function coverageMatches(a, b) {
  return Boolean(a && b && typeof a.id === 'string' && a.id === b.id
    && matchingSets(a.input_refs,b.input_refs,refKey)
    && matchingSets(a.dependency_refs,b.dependency_refs,refKey)
    && matchingSets(a.check_ids,b.check_ids));
}
export function reviewFindings(graph, reviewPath, {requirePass = true} = {}) {
  return assessReview(graph,reviewPath,requirePass,new Set(),new Map());
}
function assessReview(graph, reviewPath, requirePass, ancestors, scopeCache) {
  const review = graph.records.get(reviewPath);
  if (review?.kind !== 'review') return [];
  const c = review.content ?? {};
  const out = [];
  const add = (code,pointer,related = null,category = 'readiness') => out.push(finding(category,code,reviewPath,pointer,related));
  if (ancestors.has(reviewPath)) { add('review-continuation-cycle','/content/continuation'); return out; }
  if (ancestors.size >= 64) { add('review-continuation-depth','/content/continuation'); return out; }
  const chain = new Set(ancestors).add(reviewPath);
  if (requirePass && (!validRecord(graph,reviewPath) || review.lifecycle !== 'frozen' || c.outcome !== 'pass' || list(c.findings).length)) add('review-not-passing','/content/outcome');
  const reviewer = c.reviewer?.context_id;
  const authors = list(c.artifact_authors), workers = list(c.workers);
  const assessmentScope = file => {
    if (!scopeCache.has(file)) scopeCache.set(file,scopePaths(graph,file));
    return scopeCache.get(file);
  };
  const scope = assessmentScope(c.snapshot_ref?.path);
  const scopedAuthors = [...scope].map(p => graph.records.get(p)?.author).filter(Boolean);
  if (reviewer && [...authors,...workers,...scopedAuthors].some(a => a?.context_id === reviewer)) add('review-not-independent','/content/reviewer');
  for (const actor of scopedAuthors) {
    if (!authors.some(a => a?.session_id === actor.session_id && a?.context_id === actor.context_id)) add('association-mismatch','/content/artifact_authors',null,'structural');
  }
  if (!resolveRef(graph,c.snapshot_ref,'snapshot') || resolveRef(graph,c.snapshot_ref,'snapshot')?.lifecycle !== 'frozen') add('snapshot-membership-mismatch','/content/snapshot_ref',c.snapshot_ref?.path ?? null,'structural');

  const covered = Object.hasOwn(c,'coverage');
  const items = list(c.coverage), byId = new Map(items.map(item => [item?.id,item]));
  const assessmentPaths = [...scope].filter(file => graph.records.get(file)?.kind !== 'snapshot');
  const requiredChecks = new Map();
  for (const file of assessmentPaths) {
    const step = graph.records.get(file);
    if (step?.kind === 'step') for (const check of list(step.content?.checks)) {
      if (!requiredChecks.has(check?.id)) requiredChecks.set(check?.id,[]);
      requiredChecks.get(check?.id).push(file);
    }
  }
  const coveredPaths = new Set(), coveredChecks = new Set();
  if (covered) {
    if (!items.length) add('review-coverage-missing','/content/coverage');
    items.forEach((item,index) => {
      const pointer = `/content/coverage/${index}`;
      const refs = coverageRefs(item);
      const itemPaths = new Set();
      for (const ref of refs) {
        if (!ref || !scope.has(ref.path) || graph.artifacts.get(ref.path)?.sha256 !== ref.sha256
          || (graph.records.has(ref.path) && !validRecord(graph,ref.path))) {
          add('review-coverage-reference-invalid',pointer,ref?.path ?? null); continue;
        }
        itemPaths.add(ref.path); coveredPaths.add(ref.path);
      }
      for (const file of itemPaths) {
        if (!graph.records.has(file)) continue;
        for (const dependency of assessmentScope(file)) {
          if (graph.records.get(dependency)?.kind !== 'snapshot' && !itemPaths.has(dependency)) add('review-coverage-dependency-missing',pointer,dependency);
        }
      }
      for (const id of list(item?.check_ids)) {
        const owners = requiredChecks.get(id) ?? [];
        const included = owners.filter(file => itemPaths.has(file));
        if (!included.length) add('review-coverage-check-mismatch',`${pointer}/check_ids`);
        for (const file of included) coveredChecks.add(JSON.stringify([file,id]));
      }
      if (c.outcome === 'pass' && item?.outcome !== 'pass') add('review-coverage-not-passing',`${pointer}/outcome`);
      if (item?.outcome === 'pass' && list(c.findings).some(issue => issue?.path === '' || itemPaths.has(issue?.path))) add('review-coverage-finding-conflict',`${pointer}/outcome`);
    });
    for (const file of assessmentPaths) if (!coveredPaths.has(file)) add('review-coverage-missing','/content/coverage',file);
    for (const [id,owners] of requiredChecks) for (const file of owners) if (!coveredChecks.has(JSON.stringify([file,id]))) add('review-coverage-missing','/content/coverage',file);
    const findingIdentities = new Set();
    list(c.findings).forEach((item,index) => {
      if (item?.path !== '' && !assessmentPaths.includes(item?.path)) add('review-finding-path-invalid',`/content/findings/${index}/path`,item?.path ?? null);
      const key = findingKey(item);
      if (findingIdentities.has(key)) add('review-finding-ambiguous',`/content/findings/${index}`);
      findingIdentities.add(key);
    });
  }

  if (Object.hasOwn(c,'continuation')) {
    const continuation = c.continuation ?? {};
    const baselinePath = continuation.baseline_review_ref?.path;
    const baseline = resolveRef(graph,continuation.baseline_review_ref,'review');
    const baselineContent = baseline?.content ?? {};
    if (!covered || !Array.isArray(baselineContent.coverage) || !baselineContent.coverage.length) add('review-coverage-required','/content/continuation/baseline_review_ref',baselinePath ?? null);
    if (scope.has(baselinePath)) add('review-baseline-in-scope','/content/continuation/baseline_review_ref',baselinePath);
    const eligible = baseline && baseline.lifecycle === 'frozen' && baselineContent.phase === c.phase
      && ['pass','changes_required'].includes(baselineContent.outcome) && Array.isArray(baselineContent.coverage) && baselineContent.coverage.length;
    if (!eligible) add('review-baseline-invalid','/content/continuation/baseline_review_ref',baselinePath ?? null);
    else {
      const baselineIssues = assessReview(graph,baselinePath,false,chain,scopeCache);
      if (baselineIssues.length) {
        add('review-baseline-invalid','/content/continuation/baseline_review_ref',baselinePath);
        out.push(...baselineIssues);
      }
    }
    const baselineItems = list(baselineContent.coverage), baselineById = new Map(baselineItems.map(item => [item?.id,item]));
    const reused = new Set(list(continuation.reused_coverage_ids));
    list(continuation.reused_coverage_ids).forEach((id,index) => {
      const current = byId.get(id), prior = baselineById.get(id);
      if (!coverageMatches(current,prior) || current?.outcome !== 'pass' || prior?.outcome !== 'pass') add('review-reuse-mismatch',`/content/continuation/reused_coverage_ids/${index}`,baselinePath ?? null);
    });
    const priorFindings = new Map();
    for (const item of list(baselineContent.findings)) {
      const key = findingKey(item);
      if (priorFindings.has(key)) add('review-finding-ambiguous','/content/continuation/baseline_review_ref',baselinePath ?? null);
      priorFindings.set(key,item);
    }
    const resolutions = new Set(), resolved = new Set();
    list(continuation.finding_resolutions).forEach((resolution,index) => {
      const pointer = `/content/continuation/finding_resolutions/${index}`;
      const key = findingKey(resolution), priorFinding = priorFindings.get(key);
      const ids = list(resolution?.coverage_ids);
      const associatedFreshPass = ids.some(id => {
        const current = byId.get(id), prior = baselineById.get(id);
        return current?.outcome === 'pass' && !reused.has(id) && prior
          && (priorFinding?.path === '' || coverageRefs(prior).some(ref => ref?.path === priorFinding?.path));
      });
      if (!priorFinding || resolutions.has(key) || typeof resolution?.detail !== 'string' || !resolution.detail.trim()
        || !ids.length || ids.some(id => byId.get(id)?.outcome !== 'pass' || reused.has(id)) || !associatedFreshPass) add('review-finding-resolution-invalid',pointer,baselinePath ?? null);
      else resolved.add(key);
      resolutions.add(key);
    });
    if (c.outcome === 'pass') for (const [key,item] of priorFindings) {
      if (!resolved.has(key)) add('review-finding-unresolved','/content/continuation/finding_resolutions',item?.path || baselinePath || null);
    }
  }
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
