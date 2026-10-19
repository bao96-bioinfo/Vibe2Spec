import { readFile, mkdtemp, mkdir, writeFile, rm, realpath } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { getReferences } from '../../scripts/records.mjs';
export const ENTRY = 'records/project/project-state/r1.json';
export const digest = bytes => createHash('sha256').update(bytes).digest('hex');
export const encode = file => Buffer.from(file.encoding === 'json' ? JSON.stringify(file.content,null,2) + '\n' : file.content);
export async function fixtureFiles(caseId = null) {
  const base = JSON.parse(await readFile(new URL('../fixtures/records/base.json',import.meta.url)));
  const cases = JSON.parse(await readFile(new URL('../fixtures/records/cases.json',import.meta.url))).cases;
  const selected = cases.find(c => c.id === caseId);
  const files = base.files;
  for (const change of selected?.changes ?? []) {
    if (change.target === 'file' && change.operation === 'remove') { delete files[change.file]; continue; }
    const file = files[change.file];
    let object = change.target === 'envelope' ? file.content : file.content?.kind ? file.content.content : file;
    const segments = change.pointer.length ? change.pointer : [file.content?.kind ? 'content' : 'content'];
    if (!change.pointer.length && file.content?.kind) object = file.content;
    for (const key of segments.slice(0,-1)) object = object[key];
    if (change.operation === 'remove') delete object[segments.at(-1)];
    else object[segments.at(-1)] = structuredClone(change.value);
  }
  return {files,selected};
}
export function rebuild(files) {
  const done = new Set(), visiting = new Set();
  function update(file) {
    if (done.has(file) || !files[file]) return;
    if (visiting.has(file)) throw new Error('Fixture reference cycle.');
    visiting.add(file);
    for (const {ref} of getReferences(files[file].content)) {
      if (!files[ref.path]) continue;
      update(ref.path);
      const bytes = encode(files[ref.path]); ref.sha256 = digest(bytes);
      if (Object.hasOwn(ref,'size_bytes')) ref.size_bytes = bytes.length;
    }
    visiting.delete(file); done.add(file);
  }
  for (const file of Object.keys(files)) update(file);
  return files;
}
export async function materialize({caseId = null, edit = null, refresh = true} = {}) {
  const {files,selected} = await fixtureFiles(caseId);
  if (edit) edit(files);
  if (refresh && selected?.reference_policy !== 'preserve') rebuild(files);
  const workspace = await mkdtemp(path.join(await realpath(tmpdir()),'vibe2spec-fixture-'));
  for (const [file,content] of Object.entries(files)) {
    await mkdir(path.dirname(path.join(workspace,file)),{recursive:true});
    await writeFile(path.join(workspace,file),encode(content));
  }
  return {workspace,files,entry:ENTRY,cleanup:() => rm(workspace,{recursive:true,force:true})};
}
