import { open, lstat, realpath } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { performance } from 'node:perf_hooks';
import { parseJsonBytes } from './json.mjs';
import { validateRecord, getReferences, isFilePath } from './records.mjs';
import { finding, sortFindings, compareUtf8 } from './findings.mjs';

export const DEFAULT_LIMITS = Object.freeze({
  jsonBytes: 1048576, supportingBytes: 4194304, totalBytes: 16777216,
  files: 512, references: 4096, depth: 64, values: 100000, findings: 512,
  concurrentReads: 1, deadlineMs: 5000,
});
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const digestPattern = /^[a-f0-9]{64}(?![\s\S])/;
const sameStat = (a, b) => ['dev', 'ino', 'size', 'mtimeNs', 'ctimeNs'].every(k => a[k] === b[k]);
const within = (root, file) => {
  const relative = path.relative(root,file);
  return relative === '' || relative !== '..' && !relative.startsWith('..' + path.sep) && !path.isAbsolute(relative);
};

/** Read the explicitly selected reference graph. No discovery, writes, or execution. */
export async function loadGraph({workspace, entry, externalFiles = [], limits = {}} = {}) {
  const graph = { records: new Map(), artifacts: new Map(), recordValidity: new Map(), findings: [], entry: entry ?? null,
    entry_sha256: null, complete: true, edges: new Map(), limits: { ...DEFAULT_LIMITS, ...limits } };
  const started = performance.now();
  const profile = graph.limits;
  let totalBytes = 0, fileCount = 0, referenceCount = 0, stopped = false;
  const add = (category, code, file = null, pointer = null, related = null) => {
    if (category === 'incomplete' || category === 'internal' || category === 'invocation') graph.complete = false;
    if (graph.findings.length >= profile.findings) {
      graph.findings.splice(profile.findings - 1);
      if (!graph.findings.some(f => f.code === 'resource-limit' && f.path === null)) graph.findings.push(finding('incomplete', 'resource-limit'));
      graph.complete = false; stopped = true; return;
    }
    graph.findings.push(finding(category, code, file, pointer, related));
  };
  const validLimits = limits && typeof limits === 'object' && !Array.isArray(limits)
    && Object.keys(limits).every(k => Object.hasOwn(DEFAULT_LIMITS, k))
    && Object.entries(profile).every(([k,v]) => Number.isSafeInteger(v) && v > 0 && (k !== 'concurrentReads' || v === 1))
    && profile.findings >= 2;
  if (!validLimits) { graph.findings = [finding('invocation','invalid-limits')]; graph.complete = false; return graph; }
  if (typeof workspace !== 'string' || !path.isAbsolute(workspace) || !isFilePath(workspace,{directory:true}) || !isFilePath(entry) || !Array.isArray(externalFiles)
    || externalFiles.some(p => !isFilePath(p) || !path.isAbsolute(p)) || new Set(externalFiles).size !== externalFiles.length) {
    add('invocation','invalid-read-scope'); return graph;
  }
  const root = path.resolve(workspace);
  const external = new Set(externalFiles);
  if (externalFiles.some(p => within(root, p))) { add('invocation','invalid-read-scope'); return graph; }
  const seenSpellings = new Map();
  const cache = new Map();
  const attempted = new Set();
  const visiting = new Set();
  const traversed = new Set();
  const identities = new Map();
  const identityKinds = new Map();
  let projectId = null, projectContext = null;
  const budget = () => {
    if (stopped) return false;
    if (performance.now() - started >= profile.deadlineMs) { add('incomplete','resource-limit'); stopped = true; return false; }
    return true;
  };
  const ancestors = async (absolute, source, pointer, related) => {
    const parsed = path.parse(absolute);
    let cursor = parsed.root;
    const names = absolute.slice(parsed.root.length).split(path.sep).filter(Boolean);
    const observed = [];
    for (const name of ['', ...names]) {
      if (name) cursor = path.join(cursor, name);
      const stat = await lstat(cursor, { bigint: true });
      if (stat.isSymbolicLink()) { add('structural','symbolic-path',source,pointer,related); return null; }
      observed.push([cursor,stat]);
    }
    return observed;
  };
  const read = async (file, source, pointer, expectedKind) => {
    if (cache.has(file)) return cache.get(file);
    if (!budget()) return null;
    if (!isFilePath(file)) { add('structural','invalid-path',source,pointer,file); return null; }
    const absolute = path.isAbsolute(file) ? file : path.resolve(root, file);
    if (/^[A-Z]:\//.test(file) && process.platform !== 'win32') { add('incomplete','access-not-authorized',source,pointer,file); return null; }
    if (path.isAbsolute(file) && within(root,absolute)) { add('structural','path-alias',source,pointer,file); return null; }
    if (path.isAbsolute(file) && !external.has(file)) { add('incomplete','access-not-authorized',source,pointer,file); return null; }
    const folded = absolute.toLowerCase();
    if (seenSpellings.has(folded) && seenSpellings.get(folded) !== absolute) { add('structural','path-alias',source,pointer,file); return null; }
    seenSpellings.set(folded,absolute);
    if (!attempted.has(file)) {
      if (fileCount >= profile.files) { add('incomplete','resource-limit',source,pointer,file); stopped = true; return null; }
      attempted.add(file); fileCount++;
    }
    let handle;
    try {
      const before = await ancestors(absolute,source,pointer,file);
      if (!before) return null;
      const stat = before.at(-1)[1];
      if (!stat.isFile()) { add('structural','not-ordinary-file',source,pointer,file); return null; }
      const canonical = await realpath(absolute);
      if (canonical !== absolute && canonical.toLowerCase() === absolute.toLowerCase()) { add('structural','path-alias',source,pointer,file); return null; }
      const cap = expectedKind || file.toLowerCase().endsWith('.json') ? profile.jsonBytes : profile.supportingBytes;
      if (stat.size > BigInt(cap) || BigInt(totalBytes) + stat.size > BigInt(profile.totalBytes)) { add('incomplete','resource-limit',source,pointer,file); return null; }
      handle = await open(absolute, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0) | (constants.O_NONBLOCK ?? 0));
      if (!sameStat(stat, await handle.stat({ bigint:true }))) { add('incomplete','input-changed',source,pointer,file); return null; }
      const buffer = Buffer.alloc(Number(stat.size) + 1);
      let offset = 0;
      while (offset < buffer.length) {
        if (!budget()) return null;
        const {bytesRead} = await handle.read(buffer,offset,buffer.length-offset,null);
        if (!bytesRead) break;
        offset += bytesRead;
      }
      const after = await handle.stat({ bigint:true });
      const afterPaths = await ancestors(absolute,source,pointer,file);
      if (!afterPaths || !sameStat(stat,after) || offset !== Number(stat.size)
        || before.some(([p,s],i) => p !== afterPaths[i]?.[0] || (i === before.length - 1 ? !sameStat(s,afterPaths[i][1]) : s.dev !== afterPaths[i][1].dev || s.ino !== afterPaths[i][1].ino))) {
        add('incomplete','input-changed',source,pointer,file); return null;
      }
      const bytes = buffer.subarray(0,offset);
      totalBytes += bytes.length;
      const artifact = {bytes,sha256:hash(bytes)};
      graph.artifacts.set(file,artifact); cache.set(file,artifact);
      return artifact;
    } catch (error) {
      const code = error?.code === 'ENOENT' || error?.code === 'ENOTDIR' ? 'missing-reference'
        : error?.code === 'EACCES' || error?.code === 'EPERM' ? 'access-denied'
        : error?.code === 'ELOOP' ? 'symbolic-path' : 'read-failed';
      add(code === 'missing-reference' || code === 'symbolic-path' ? 'structural' : 'incomplete',code,source,pointer,file);
      return null;
    } finally { if (handle) await handle.close().catch(() => {}); }
  };
  const walk = async (file, source, pointer, expected = null, expectedKind = null) => {
    if (!budget()) return;
    const artifact = await read(file,source,pointer,expectedKind);
    if (!artifact) return;
    if (file === entry) graph.entry_sha256 = artifact.sha256;
    if (expected && digestPattern.test(expected.sha256 ?? '') && artifact.sha256 !== expected.sha256) {
      add('structural','digest-mismatch',source,pointer,file); return;
    }
    if (expected && typeof expected.size_bytes === 'number' && artifact.bytes.length !== expected.size_bytes) { add('structural','size-mismatch',source,pointer,file); return; }
    if (visiting.has(file)) { add('structural','reference-cycle',source,pointer,file); return; }
    let record = graph.records.get(file);
    if (!traversed.has(file) || (expectedKind && !record)) {
      const jsonFile = expectedKind || file === entry || file.toLowerCase().endsWith('.json');
      if (jsonFile) {
        const parsed = parseJsonBytes(artifact.bytes,{path:file,maxBytes:profile.jsonBytes,maxDepth:profile.depth,maxValues:profile.values});
        for (const f of parsed.findings) add(f.category,f.code,f.path,f.pointer,f.related_path);
        if (!parsed.ok) { traversed.add(file); return; }
        const candidate = parsed.value;
        if (expectedKind || file === entry || (candidate && typeof candidate === 'object' && !Array.isArray(candidate) && Object.hasOwn(candidate,'kind') && Object.hasOwn(candidate,'schema_version'))) {
          record = candidate;
          const issues = validateRecord(record,{path:file,orders:parsed.orders});
          for (const f of issues) add(f.category,f.code,f.path,f.pointer,f.related_path);
          if (!record || typeof record !== 'object' || Array.isArray(record)) { traversed.add(file); return; }
          // A matching digest does not authorize traversing a target of another kind,
          // project or context. A later, independently valid edge may still inspect it.
          if (expectedKind && !(Array.isArray(expectedKind) ? expectedKind : [expectedKind]).includes(record.kind)) {
            add('structural','reference-kind-mismatch',source,pointer,file); return;
          }
          if (projectId !== null && record.project_id !== projectId) { add('structural','reference-project-mismatch',source,pointer,file); return; }
          if (projectContext !== null && record.context !== projectContext) { add('structural','context-conflict',file,'/context'); return; }
          graph.records.set(file,record);
          graph.recordValidity.set(file,issues.length === 0);
          if (projectId === null) { projectId = record.project_id; projectContext = record.context; }
          const identity = `${record.project_id}\0${record.id}\0${record.revision}`;
          if (identities.has(identity) && identities.get(identity) !== file) add('structural','duplicate-identity',file,'/id',identities.get(identity));
          identities.set(identity,file);
          const idKey = `${record.project_id}\0${record.id}`;
          if (identityKinds.has(idKey) && identityKinds.get(idKey) !== record.kind) add('structural','identity-conflict',file,'/kind');
          identityKinds.set(idKey,record.kind);
          visiting.add(file);
          const refs = getReferences(record).sort((a,b) => compareUtf8(a.pointer,b.pointer));
          graph.edges.set(file,refs.map(d => d.ref?.path).filter(p => typeof p === 'string'));
          for (const descriptor of refs) {
            if (!budget()) break;
            if (referenceCount >= profile.references) { add('incomplete','resource-limit',file,descriptor.pointer); stopped = true; break; }
            referenceCount++;
            if (!descriptor.ref || !isFilePath(descriptor.ref.path) || !digestPattern.test(descriptor.ref.sha256 ?? '')) continue;
            await walk(descriptor.ref.path,file,descriptor.pointer,descriptor.ref,descriptor.kind);
          }
          visiting.delete(file);
        }
      }
      traversed.add(file);
    }
    if (expectedKind && (!record || !(Array.isArray(expectedKind) ? expectedKind : [expectedKind]).includes(record.kind))) add('structural','reference-kind-mismatch',source,pointer,file);
  };
  try {
    const rootInfo = await ancestors(root,entry,null,null);
    if (!rootInfo || !rootInfo.at(-1)[1].isDirectory()) { if (rootInfo) add('invocation','invalid-read-scope'); return graph; }
  } catch { add('invocation','invalid-read-scope'); return graph; }
  await walk(entry,entry,null,null,null);
  budget();
  graph.findings = sortFindings(graph.findings);
  graph.complete = graph.complete && !graph.findings.some(f => ['incomplete','internal','invocation'].includes(f.category));
  graph.stats = {files:fileCount, references:referenceCount, bytes:totalBytes};
  return graph;
}
