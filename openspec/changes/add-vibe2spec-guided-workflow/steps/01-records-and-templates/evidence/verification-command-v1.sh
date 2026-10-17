node --input-type=module <<'NODE'
import { lstatSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';

const paths = [
  'docs/record-format.md',
  'templates/project.md',
  'templates/project.json',
  'templates/decision.json',
  'templates/evidence.json',
  'templates/approval.json',
  'templates/step/spec.md',
  'templates/step/design.md',
  'templates/step/tasks.md',
  'templates/step/contract.json',
  'templates/step/unit.json',
  'templates/review.json',
  'templates/run.json',
  'templates/comparison.json',
  'templates/acceptance.json',
  'templates/amendment.json',
  'templates/snapshot.json',
  'tests/fixtures/records/base.json',
  'tests/fixtures/records/cases.json',
  'tests/fixtures/records/README.md'
];
if (process.version !== 'v26.11.1') throw new Error('Unexpected verification runtime');
let totalBytes = 0;
const files = [];
let base;
for (const path of paths) {
  let parent = dirname(resolve(path));
  while (true) {
    const directory = lstatSync(parent);
    if (!directory.isDirectory() || directory.isSymbolicLink()) throw new Error('Invalid ancestor directory: ' + parent);
    const next = dirname(parent);
    if (next === parent) break;
    parent = next;
  }
  const stat = lstatSync(path);
  if (!stat.isFile() || stat.size > 262144) throw new Error('Invalid file or file limit: ' + path);
  totalBytes += stat.size;
  if (totalBytes > 2097152) throw new Error('Combined file limit exceeded');
  const bytes = readFileSync(path);
  const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  if (bytes[0] === 239 && bytes[1] === 187 && bytes[2] === 191) throw new Error('Unexpected byte-order mark: ' + path);
  if (!text.endsWith('\n') || text.includes('\r')) throw new Error('Invalid line endings: ' + path);
  if (path.endsWith('.json')) {
    const value = JSON.parse(text);
    if (JSON.stringify(value, null, 2) + '\n' !== text) throw new Error('Noncanonical JSON serialization: ' + path);
    if (path === 'tests/fixtures/records/base.json') base = value;
  }
  files.push({ path, size_bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') });
}
const virtualFiles = [];
for (const path of Object.keys(base.files).sort()) {
  const file = base.files[path];
  if (file.encoding !== 'json' && file.encoding !== 'text') throw new Error('Invalid virtual encoding: ' + path);
  const text = file.encoding === 'json' ? JSON.stringify(file.content, null, 2) + '\n' : file.content;
  if (typeof text !== 'string') throw new Error('Invalid virtual text: ' + path);
  const bytes = Buffer.from(text, 'utf8');
  virtualFiles.push({ path, size_bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') });
}
console.log(JSON.stringify({ runtime: process.version, parsed: true, files, virtual_files: virtualFiles }, null, 2));
NODE
