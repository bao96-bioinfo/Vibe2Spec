import { finding, sortFindings } from './findings.mjs';
import { compare } from './compare.mjs';
import { list, sameRef, validRecord, resolveRef, recordPath, ofKind, identityStep, scopePaths, specificationScope, snapshotEntries, snapshotContains, approvalCovers, reviewFindings, checkStepReadiness } from './readiness.mjs';

const equals = (a,b) => compare(a,b,{category:'exact_json',array_order:'preserved',object_key_order:'ignored'}).outcome === 'pass';
const READY = new Set(['ready_to_implement','awaiting_pre_execution_review','ready_to_execute','awaiting_results_review','awaiting_acceptance','finished']);
const EXECUTED = new Set(['awaiting_results_review','awaiting_acceptance','finished']);
const COMPLETE = new Set(['awaiting_acceptance','finished']);

/** Inspect recorded state; this function never advances or edits the project. */
export function assessLifecycle(graph) {
  const out = [];
  const add = (category,code,file,pointer = null,related = null) => out.push(finding(category,code,file,pointer,related));
  const project = graph.records.get(graph.entry);
  if (project?.kind !== 'project') return graph.complete ? [finding('readiness','missing-current-step',graph.entry)] : [];
  if (project.lifecycle !== 'frozen') add('readiness','incomplete-step',graph.entry,'/lifecycle');
  if (graph.complete && !approvalCovers(graph,project.content?.overview_ref?.path,['overview','step_specification'])) add('readiness','unapproved-specification',graph.entry,'/content/overview_ref');
  const states = project?.kind === 'project' ? list(project.content?.states) : [];
  const stateById = new Map(states.filter(s=>s && typeof s==='object').map(s => [s.step_id,s]));
  const currentSteps = new Map([...stateById.values()].map(s => [s.step_id,identityStep(graph,s.step_id,s.revision)]));
  const failures = new Map();
  const delta = (file,start) => failures.set(file,out.slice(start));
  const scopeHas = (snapshotRef, paths) => {
    const snapshot = resolveRef(graph,snapshotRef,'snapshot');
    if (!snapshot || snapshot.lifecycle !== 'frozen') return false;
    const scope = scopePaths(graph,snapshotRef?.path);
    return paths.every(p => typeof p === 'string' && scope.has(p));
  };
  const scopedReview = (reviewPath, phase, scope = []) => {
    const review = graph.records.get(reviewPath);
    if (review?.kind !== 'review' || review.content?.phase !== phase) return false;
    return scopeHas(review.content.snapshot_ref,scope) && reviewFindings(graph,reviewPath).length === 0;
  };
  const preparedWork = (review,stepPath) => {
    const snapshot = resolveRef(graph,review?.content?.snapshot_ref,'snapshot');
    if (!snapshot || !scopeHas(review.content.snapshot_ref,[stepPath])) return false;
    const normative = specificationScope(graph,stepPath,project);
    return list(snapshot.content?.entries).some(entry => !normative.has(entry.path) && !graph.records.has(entry.path) && graph.artifacts.has(entry.path));
  };
  const recompute = (result,check,file,pointer,rule = check?.rule,expected = check?.expected) => {
    if (!check || !rule) { add('structural','association-mismatch',file,pointer); return; }
    const actual = compare(result?.observed,expected,rule);
    if (actual.outcome === 'unable_to_determine') add('incomplete','check-not-supported',file,pointer);
    if (result?.outcome === 'pass' && actual.outcome === 'fail') add('readiness','check-not-passing',file,pointer);
  };
  for (const [file,approval] of ofKind(graph,'approval')) {
    for (const target of list(approval.content?.target_paths)) {
      if (!snapshotEntries(graph,approval.content?.snapshot_ref).has(target)) add('structural','snapshot-membership-mismatch',file,'/content/target_paths',target);
    }
  }
  for (const [file,review] of ofKind(graph,'review')) {
    out.push(...reviewFindings(graph,file,{requirePass:false}));
    // A pending review remains an honest record; only a gate that needs it requires pass.
    if (review.content?.outcome === 'pass' && list(review.content?.findings).length) add('structural','record-inconsistency',file,'/content/outcome');
  }
  for (const [file,step] of ofKind(graph,'step')) {
    if (!validRecord(graph,file)) continue;
    for (const dep of list(step.content?.depends_on)) {
      if (dep.step_id === step.id) add('structural','dependency-cycle',file,'/content/depends_on');
    }
  }
  const visiting = new Set(), visited = new Set();
  function dependencyVisit(id) {
    if (visiting.has(id)) { add('structural','dependency-cycle',graph.entry,'/content/states'); return; }
    if (visited.has(id)) return;
    visiting.add(id);
    const selected = currentSteps.get(id);
    const step = selected && validRecord(graph,selected[0]) ? selected[1] : null;
    for (const dep of list(step?.content?.depends_on)) dependencyVisit(dep.step_id);
    visiting.delete(id); visited.add(id);
  }
  for (const id of currentSteps.keys()) dependencyVisit(id);

  for (const [file,run] of ofKind(graph,'run')) {
    if (!validRecord(graph,file)) continue;
    const start = out.length, c = run.content ?? {};
    const stepEntry = identityStep(graph,c.step_id,c.step_revision);
    if (!stepEntry || !validRecord(graph,stepEntry[0])) { add('structural','association-mismatch',file,'/content/step_id'); delta(file,start); continue; }
    const [stepPath,step] = stepEntry;
    const normative = specificationScope(graph,stepPath,project);
    if (!snapshotContains(graph,c.spec_snapshot_ref,normative)) add('structural','snapshot-membership-mismatch',file,'/content/spec_snapshot_ref');
    const pre = resolveRef(graph,c.pre_execution_review_ref,'review');
    if (!pre || pre.content?.phase !== 'pre_execution' || !sameRef(pre.content?.snapshot_ref,c.work_snapshot_ref)) add('readiness','missing-pre-execution-review',file,'/content/pre_execution_review_ref');
    else {
      out.push(...reviewFindings(graph,c.pre_execution_review_ref.path));
      if (!list(pre.content?.workers).some(w => equals(w,c.worker))) add('structural','association-mismatch',file,'/content/worker',c.pre_execution_review_ref.path);
    }
    if (!scopeHas(c.work_snapshot_ref,[c.spec_snapshot_ref?.path]) || (pre && !preparedWork(pre,stepPath))) add('structural','snapshot-membership-mismatch',file,'/content/work_snapshot_ref');
    const requiredInputs = [...list(step.content?.input_refs), ...list(step.content?.unit_refs).flatMap(ref => list(resolveRef(graph,ref,'unit')?.content?.fixture_refs))];
    for (const ref of requiredInputs) if (snapshotEntries(graph,c.input_snapshot_ref).get(ref.path) !== ref.sha256) add('structural','snapshot-membership-mismatch',file,'/content/input_snapshot_ref',ref.path);
    for (const [path,digest] of snapshotEntries(graph,c.input_snapshot_ref)) {
      if (!requiredInputs.some(ref => ref.path === path && ref.sha256 === digest)) add('readiness','unapproved-input',file,'/content/input_snapshot_ref',path);
    }
    for (const output of list(step.content?.outputs)) if (!snapshotEntries(graph,c.output_snapshot_ref).has(output.path)) add('readiness','missing-comparison-coverage',file,'/content/output_snapshot_ref',output.path);
    const permittedOutputs = new Set([...list(step.content?.outputs).map(output => output.path), ...list(step.content?.unit_refs).flatMap(ref => list(resolveRef(graph,ref,'unit')?.content?.write_paths))]);
    const originalInputs = snapshotEntries(graph,c.input_snapshot_ref);
    for (const [path,digest] of snapshotEntries(graph,c.output_snapshot_ref)) {
      // Retaining an unchanged input proves nonmutation; it is not an additional write.
      if (!permittedOutputs.has(path) && originalInputs.get(path) !== digest) add('readiness','unapproved-output',file,'/content/output_snapshot_ref',path);
    }
    const declaredDecisions = new Set([...normative].filter(p => graph.records.get(p)?.kind === 'decision'));
    const settings = [...list(c.effective_settings), ...list(c.commands).flatMap(command => list(command?.environment))];
    for (const setting of settings) {
      const decision = resolveRef(graph,setting?.decision_ref,'decision');
      if (!decision || !declaredDecisions.has(setting.decision_ref.path) || !approvalCovers(graph,setting.decision_ref.path)) add('readiness','unapproved-effective-setting',file,'/content/effective_settings',setting?.decision_ref?.path ?? null);
      else if (decision.content?.selection?.mode === 'literal' && !equals(setting.value,decision.content.selection.value)) add('readiness','effective-setting-mismatch',file,'/content/effective_settings',setting.decision_ref.path);
      else if (decision.content?.selection?.mode === 'inapplicable') add('readiness','effective-setting-mismatch',file,'/content/effective_settings',setting.decision_ref.path);
    }
    for (const [i,result] of list(c.check_results).entries()) recompute(result,list(step.content?.checks).find(check => check.id === result.check_id),file,`/content/check_results/${i}`);
    delta(file,start);
  }

  for (const [file,comparison] of ofKind(graph,'comparison')) {
    if (!validRecord(graph,file)) continue;
    const start = out.length, c = comparison.content ?? {};
    const unit = resolveRef(graph,c.unit_ref,'unit');
    const step = unit && identityStep(graph,unit.content?.step_id,unit.content?.step_revision)?.[1];
    if (!unit || !step || !validRecord(graph,recordPath(graph,step))) { add('structural','association-mismatch',file,'/content/unit_ref'); delta(file,start); continue; }
    const ids = list(unit.content?.check_ids);
    const runs = list(c.run_refs).map(ref => resolveRef(graph,ref,'run'));
    if (!equals(list(c.rules).map(r => r?.check_id),ids)) add('structural','association-mismatch',file,'/content/rules');
    if (c.mode === 'paired' && (step.content?.paired_validation?.mode !== 'enabled' || !list(step.content.paired_validation.unit_ids).includes(unit.id))) add('structural','association-mismatch',file,'/content/mode');
    if (c.mode === 'single' && step.content?.paired_validation?.mode === 'enabled' && list(step.content.paired_validation.unit_ids).includes(unit.id)) add('readiness','missing-comparison-coverage',file,'/content/mode');
    for (const [i,run] of runs.entries()) {
      if (!run) continue;
      if (run.content?.step_id !== step.id || run.content?.step_revision !== step.revision || !sameRef(run.content?.input_snapshot_ref,c.input_snapshot_ref) || !equals(run.content?.worker,list(c.worker_contexts)[i])) add('structural','association-mismatch',file,`/content/run_refs/${i}`);
      const group = list(c.correctness_results)[i];
      if (!sameRef(group?.run_ref,list(c.run_refs)[i]) || !equals(list(group?.results).map(r => r.check_id),ids)) add('structural','association-mismatch',file,`/content/correctness_results/${i}`);
      for (const [j,result] of list(group?.results).entries()) {
        const check = list(step.content?.checks).find(check => check.id === result.check_id);
        const rule = list(c.rules)[j];
        if (!equals(rule?.correctness_rule,check?.rule)) add('structural','association-mismatch',file,`/content/rules/${j}/correctness_rule`);
        const reported = list(run.content?.check_results).find(r => r.check_id === result.check_id);
        if (!reported || !equals(result.observed,reported.observed) || result.outcome !== reported.outcome) add('structural','association-mismatch',file,`/content/correctness_results/${i}/results/${j}`);
        recompute(result,check,file,`/content/correctness_results/${i}/results/${j}`);
      }
    }
    if (c.mode === 'paired') {
      if (runs.length !== 2 || runs[0]?.content?.worker?.context_id === runs[1]?.content?.worker?.context_id || sameRef(runs[0]?.content?.work_snapshot_ref,runs[1]?.content?.work_snapshot_ref)) add('readiness','review-not-independent',file,'/content/run_refs');
      if (!equals(list(c.pairwise_results).map(r => r.check_id),ids)) add('structural','association-mismatch',file,'/content/pairwise_results');
      for (const [i,result] of list(c.pairwise_results).entries()) {
        const rule = list(c.rules)[i];
        const left = list(list(c.correctness_results)[0]?.results)[i]?.observed;
        const right = list(list(c.correctness_results)[1]?.results)[i]?.observed;
        if (!equals(result.observed,{left,right})) add('structural','association-mismatch',file,`/content/pairwise_results/${i}/observed`);
        if (!specificationScope(graph,recordPath(graph,step),project).has(rule?.pairwise_decision_ref?.path) || !approvalCovers(graph,rule?.pairwise_decision_ref?.path)) add('readiness','unapproved-decision',file,`/content/rules/${i}/pairwise_decision_ref`);
        const selection = resolveRef(graph,rule?.pairwise_decision_ref,'decision')?.content?.selection;
        if (selection?.mode === 'literal' && selection.value && typeof selection.value === 'object' && Object.hasOwn(selection.value,'category')) {
          if (!equals(selection.value,rule?.pairwise_rule)) add('readiness','effective-setting-mismatch',file,`/content/rules/${i}/pairwise_rule`);
        } else add('incomplete','check-not-supported',file,`/content/rules/${i}/pairwise_decision_ref`);
        recompute({ ...result,observed:left },{rule:rule?.pairwise_rule,expected:right},file,`/content/pairwise_results/${i}`);
      }
    }
    delta(file,start);
  }

  function acceptanceFindings(file,acceptance) {
    const start = out.length, c = acceptance?.content ?? {};
    const stepEntry = identityStep(graph,c.step_id,c.step_revision);
    if (!stepEntry || !validRecord(graph,stepEntry[0]) || acceptance.lifecycle !== 'frozen') { add('readiness','missing-acceptance',file); return out.slice(start); }
    const [stepPath,step] = stepEntry;
    out.push(...checkStepReadiness(graph,stepPath,{project,requireContext:false}));
    const scope = [c.spec_snapshot_ref?.path,c.work_snapshot_ref?.path,...list(c.run_refs).map(r => r.path),...list(c.comparison_refs).map(r => r.path)];
    const review = resolveRef(graph,c.results_review_ref,'review');
    if (!review || !scopedReview(c.results_review_ref.path,'results',scope)) {
      add('readiness','missing-results-review',file,'/content/results_review_ref');
      if (review) out.push(...reviewFindings(graph,c.results_review_ref.path));
    }
    const covered = new Set(), compared = new Set();
    for (const ref of list(c.run_refs)) {
      const run = resolveRef(graph,ref,'run');
      if (!run || run.lifecycle !== 'frozen' || run.content?.step_id !== c.step_id || run.content?.step_revision !== c.step_revision || !sameRef(run.content?.spec_snapshot_ref,c.spec_snapshot_ref)) { add('structural','association-mismatch',file,'/content/run_refs',ref.path); continue; }
      if (!sameRef(run.content.work_snapshot_ref,c.work_snapshot_ref) && !scopeHas(c.work_snapshot_ref,[run.content.work_snapshot_ref.path])) add('structural','association-mismatch',file,'/content/work_snapshot_ref',ref.path);
      if (review && !list(review.content?.workers).some(worker => equals(worker,run.content?.worker))) add('structural','association-mismatch',file,'/content/results_review_ref',ref.path);
      for (const result of list(run.content?.check_results)) {
        if (result.outcome === 'pass') covered.add(result.check_id);
        else add('readiness','check-not-passing',file,'/content/run_refs',ref.path);
      }
      out.push(...(failures.get(ref.path) ?? []));
    }
    for (const check of list(step.content?.checks)) if (!covered.has(check.id)) add('readiness','missing-comparison-coverage',file,'/content/run_refs');
    for (const ref of list(c.comparison_refs)) {
      const comparison = resolveRef(graph,ref,'comparison');
      const unit = resolveRef(graph,comparison?.content?.unit_ref,'unit');
      if (!comparison || comparison.lifecycle !== 'frozen' || !unit || unit.content?.step_id !== c.step_id || unit.content?.step_revision !== c.step_revision || list(comparison.content?.run_refs).some(r => !list(c.run_refs).some(a => sameRef(a,r)))) add('structural','association-mismatch',file,'/content/comparison_refs',ref.path);
      else {
        compared.add(unit.id);
        if ([...list(comparison.content?.pairwise_results),...list(comparison.content?.correctness_results).flatMap(group => list(group.results))].some(result => result.outcome !== 'pass')) add('readiness','check-not-passing',file,'/content/comparison_refs',ref.path);
      }
      out.push(...(failures.get(ref.path) ?? []));
    }
    for (const ref of list(step.content?.unit_refs)) {
      const unit = resolveRef(graph,ref,'unit');
      if (unit && !compared.has(unit.id)) add('readiness','missing-comparison-coverage',file,'/content/comparison_refs',ref.path);
    }
    return out.slice(start);
  }
  // Only acceptance used by a current state is a current completion assertion.
  for (const [i,state] of states.entries()) {
    if (!state || typeof state !== 'object') continue;
    const pointer = `/content/states/${i}`, stepEntry = currentSteps.get(state.step_id);
    if (state.state === 'finished') {
      const acceptance = resolveRef(graph,state.acceptance_ref,'acceptance');
      if (!acceptance || acceptance.content?.step_id !== state.step_id || acceptance.content?.step_revision !== state.revision) add('readiness','missing-acceptance',graph.entry,pointer + '/acceptance_ref');
      else acceptanceFindings(state.acceptance_ref.path,acceptance);
    }
    if (READY.has(state.state)) {
      if (!stepEntry) add('readiness','incomplete-step',graph.entry,pointer);
      else out.push(...checkStepReadiness(graph,stepEntry[0],{project,requireContext:false}));
    }
    if (state.state === 'awaiting_specification' && !stepEntry) add('readiness','incomplete-step',graph.entry,pointer);
    if (['awaiting_pre_execution_review','ready_to_execute',...EXECUTED].includes(state.state) && stepEntry) {
      const prepared = ofKind(graph,'review').filter(([,r]) => r.content?.phase === 'pre_execution' && preparedWork(r,stepEntry[0]));
      if (!prepared.length && graph.complete) add('readiness','missing-prepared-work',graph.entry,pointer);
      if (state.state !== 'awaiting_pre_execution_review' && !prepared.some(([p]) => scopedReview(p,'pre_execution',[stepEntry[0]])) && graph.complete) add('readiness','missing-pre-execution-review',graph.entry,pointer);
    }
    if (EXECUTED.has(state.state)) {
      const runs = ofKind(graph,'run').filter(([file,r]) => validRecord(graph,file) && r.content?.step_id === state.step_id && r.content?.step_revision === state.revision);
      if (!runs.length && graph.complete) add('readiness','missing-run',graph.entry,pointer);
      if (COMPLETE.has(state.state) && state.state !== 'finished') {
        const results = ofKind(graph,'review').filter(([,r]) => r.content?.phase === 'results' && runs.some(([p]) => scopeHas(r.content.snapshot_ref,[p])));
        const completeReview = results.some(([p,review]) => {
          if (!scopedReview(p,'results') || !stepEntry) return false;
          const scope = scopePaths(graph,review.content.snapshot_ref.path);
          const selectedRuns = runs.filter(([file]) => scope.has(file));
          const selectedComparisons = ofKind(graph,'comparison').filter(([file,record]) => {
            const unit = resolveRef(graph,record.content?.unit_ref,'unit');
            return scope.has(file) && unit?.content?.step_id === state.step_id && unit?.content?.step_revision === state.revision;
          });
          if (!selectedRuns.length || selectedRuns.some(([file,run]) => run.lifecycle !== 'frozen' || list(run.content?.check_results).some(c => c.outcome !== 'pass') || (failures.get(file) ?? []).length || !list(review.content?.workers).some(w => equals(w,run.content.worker)))) return false;
          const runFiles = new Set(selectedRuns.map(([file]) => file));
          const coveredUnits = new Set();
          for (const [file,comparison] of selectedComparisons) {
            if (comparison.lifecycle !== 'frozen' || (failures.get(file) ?? []).length || list(comparison.content?.run_refs).some(ref => !runFiles.has(ref.path))) return false;
            if ([...list(comparison.content?.pairwise_results),...list(comparison.content?.correctness_results).flatMap(group => list(group.results))].some(result => result.outcome !== 'pass')) return false;
            coveredUnits.add(resolveRef(graph,comparison.content.unit_ref,'unit')?.id);
          }
          if (list(stepEntry[1].content?.unit_refs).some(ref => !coveredUnits.has(resolveRef(graph,ref,'unit')?.id))) return false;
          const observed = new Set(selectedRuns.flatMap(([,r]) => list(r.content?.check_results).map(c => c.check_id)));
          return list(stepEntry[1].content?.checks).every(check => observed.has(check.id));
        });
        if (!completeReview && graph.complete) add('readiness','missing-results-review',graph.entry,pointer);
      }
    }
    if (state.amendment_ref) {
      const amendment = resolveRef(graph,state.amendment_ref,'amendment');
      const previous = resolveRef(graph,amendment?.content?.previous_acceptance_ref,'acceptance');
      if (!amendment || !previous || amendment.content?.step_id !== state.step_id || amendment.content?.proposed_revision !== state.revision || previous.content?.step_id !== state.step_id || previous.content?.step_revision >= state.revision) add('structural','association-mismatch',graph.entry,pointer + '/amendment_ref');
      if (!approvalCovers(graph,state.amendment_ref.path,['reopen']) && graph.complete) add('readiness','missing-reopening-approval',graph.entry,pointer + '/amendment_ref',state.amendment_ref.path);
      if (amendment && previous) {
        const preserved = new Set([...scopePaths(graph,amendment.content.previous_acceptance_ref.path)]);
        const inventory = new Set(list(amendment.content?.edits).map(edit => edit.path));
        for (const edit of list(amendment.content?.edits)) if (preserved.has(edit.path)) add('readiness','amendment-scope-changed',state.amendment_ref.path,'/content/edits',edit.path);
        if (stepEntry) {
          for (const changed of scopePaths(graph,stepEntry[0],{normative:true})) {
            if (!preserved.has(changed) && !inventory.has(changed)) add('readiness','amendment-scope-changed',state.amendment_ref.path,'/content/edits',changed);
          }
          for (const [,run] of ofKind(graph,'run').filter(([,run]) => run.content?.step_id === state.step_id && run.content?.step_revision === state.revision)) {
            const workAndOutput = [...snapshotEntries(graph,run.content?.work_snapshot_ref).keys(),...snapshotEntries(graph,run.content?.output_snapshot_ref).keys()];
            for (const changed of workAndOutput) if (!graph.records.has(changed) && !preserved.has(changed) && !inventory.has(changed)) add('readiness','amendment-scope-changed',state.amendment_ref.path,'/content/edits',changed);
          }
        }
        for (const affected of list(amendment.content?.affected_step_ids)) {
          const downstream = stateById.get(affected);
          if (!downstream || (state.state !== 'finished' && downstream.state !== 'suspended')) add('readiness','stale-dependency-evidence',graph.entry,pointer,state.amendment_ref.path);
        }
      }
    } else if (state.state === 'reopened') add('readiness','missing-reopening-approval',graph.entry,pointer);
    if (state.state === 'suspended') {
      if (!stepEntry) add('readiness','incomplete-step',graph.entry,pointer);
      const seen = new Set();
      const reachesReopen = id => {
        if (seen.has(id)) return false;
        seen.add(id);
        const dep = stateById.get(id);
        if (!dep) return false;
        if (dep.amendment_ref && dep.state !== 'finished' && approvalCovers(graph,dep.amendment_ref.path,['reopen'])) return true;
        return dep.state === 'suspended' && list(dep.blocked_by).some(reachesReopen);
      };
      for (const dep of list(state.blocked_by)) {
        seen.clear();
        if (!reachesReopen(dep)) add('readiness','stale-dependency-evidence',graph.entry,pointer + '/blocked_by');
        if (stepEntry && !list(stepEntry[1].content?.depends_on).some(d => d.step_id === dep)) add('structural','association-mismatch',graph.entry,pointer + '/blocked_by');
      }
    }
  }
  return sortFindings(out);
}
