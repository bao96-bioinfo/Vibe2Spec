/** Render portable ASCII without changing workflow state. */
const safe = value => JSON.stringify(String(value)).slice(1,-1).replace(/[^\x20-\x7e]/g, c => `\\u${c.charCodeAt(0).toString(16).padStart(4,'0')}`);
function box(lines) {
  const width = Math.max(...lines.map(x=>x.length));
  const edge = `+${'-'.repeat(width+2)}+`;
  return [edge,...lines.map(x=>`| ${x.padEnd(width)} |`),edge].join('\n');
}
export function renderOverview(project, steps = []) {
  if (project?.kind !== 'project' || !Array.isArray(project.content?.step_order) || !Array.isArray(project.content.states)) throw new TypeError('A project record with ordered states is required.');
  const c = project.content;
  if (!c.step_order.length || c.step_order.length > 512 || new Set(c.step_order).size !== c.step_order.length || c.states.length !== c.step_order.length || c.states.some((s,i)=>s?.step_id !== c.step_order[i])) throw new TypeError('Project step order and states must agree.');
  const lookup = new Map(steps.filter(x=>x?.kind==='step').map(s=>[`${s.id}@${s.revision}`,s]));
  const parts = [`Vibe2Spec project: ${safe(c.title ?? project.id)}`, ''];
  for(let i=0;i<c.states.length;i++) {
    const s=c.states[i], step=lookup.get(`${s.step_id}@${s.revision}`);
    const lines=[`${i+1}. ${safe(step?.content?.title ?? s.step_id)}`,`State: ${safe(s.state)} | revision ${safe(s.revision)}${c.current_step_id===s.step_id?' | CURRENT':''}`];
    if(step?.content?.depends_on?.length) lines.push(`Depends on: ${step.content.depends_on.map(d=>`${safe(d.step_id)}@${safe(d.revision)}`).join(', ')}`);
    if(s.blocked_by?.length) lines.push(`Blocked by: ${s.blocked_by.map(safe).join(', ')}`);
    parts.push(box(lines));
    if(i<c.states.length-1) parts.push('        |','        v');
  }
  parts.push('', 'Repeated for each current step:', 'Interview -> Specify -> User approval + separate specification review', '    -> Prepare code -> Separate pre-execution review -> Execute', '    -> Checks + separate results review -> Explicit user acceptance', '    -> Finish step -> Interview the next step', '', 'Necessary correction: approve exact amendment -> reopen affected step', '    -> suspend affected dependencies -> repeat the applicable cycle', '', 'This diagram displays recorded state. Rendering it does not approve or finish work.');
  return parts.join('\n')+'\n';
}
