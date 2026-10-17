# Step 1 verification contract

## Scope and prerequisites

This protocol applies only after the user approves the complete Step 1 specification and a separate specification review passes. It uses the existing Node.js v26.11.1 installation observed in this workspace. It does not select the product's release runtime range. A different installed version requires a revised decision before these checks run.

No product helper is written or executed. The command below invokes Node.js built-in file reading, JSON parsing, and hashing for this one verification. It does not evaluate commands stored in example records. A separate reviewer assesses the actual deliverables and this exact command before execution.

The twenty files listed in `spec.md` are the only product inputs. Each file is at most 262144 bytes. The combined size is at most 2097152 bytes. Every input must be an ordinary file at the approved path. No package installation, network access, model execution, or scientific data processing is permitted. One command invocation is allowed per reviewed artifact version. The operator stops it if it exceeds 30 seconds. Any repeated invocation after a correction uses a newly reviewed artifact version.

The command has no filesystem writes. Its standard output and error are captured as verification evidence. The coordinator may save that exact tool output under the step's `evidence/` directory. The agent's authoring and review work is not claimed to have a hard compute limit; the bounds above apply to the verification command.

## Prepared-work review

The pre-execution reviewer receives the approved four-file specification package, the twenty delivered files, their current fingerprints, and the exact command below. It checks file scope, template contents, fixture construction, the absence of unapproved product files, and the command's read-only behavior. It also checks that no template or fictional response has been used as an actual project approval.

If any input or command changes after this assessment, the previous assessment does not authorize running the changed version. A missing or indeterminate review remains a blocked gate.

## Exact mechanical check

Run from `/Users/jingxuan.bao/Downloads/Vibe2Spec`. The command and script are proposed verification instructions; including them here does not authorize executing them before the gates above pass.

```sh
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
```

Success requires exit code 0, `parsed: true`, twenty actual-file entries, and one virtual-file entry for every named fixture artifact. Failure produces a nonzero exit and remains recorded. No unsuccessful result is rewritten as a success. The mechanical check establishes parseability, serialization, and fingerprints. It does not establish schema conformance, approval, semantic completeness, or reviewer independence.

The JSON serialization check rejects text that would change when parsed and reserialized, including duplicate-key input in these fixtures. All approved example object keys are ordinary nonnumeric strings and all integers are small. Field and array order still receive the explicit comparison below.

## Exact artifact and semantic assessment

The independent reviewer compares `docs/record-format.md` byte-for-byte with the approved source. It compares the four Markdown templates and the fixture README with their exact fenced source contents and final line feeds. No discretionary prose is added to these deliverables.

Each JSON template is compared with the deterministic envelope and field construction in `spec.md`. Every field and value must match. The author Actor uses the exact template constants in `record-format.md`. Content fields appear in the kind dictionary's order and all have unresolved null values. No alias or extra field is accepted.

The reviewer compares every base fixture envelope and content field with `fixtures.md`. It resolves each reference against the mechanical check's virtual-file digest table and checks every snapshot entry's size and ordering. It verifies that approval snapshots exclude later approval, review, and acceptance records and that the directed reference graph has no cycle. It then assesses the positive graph's declared fictional completion evidence and each scoped negative case. It does not execute a stored command or implement a case evaluator.

The case container must contain all sixteen cases in the specified order. Each case's changes, reference policy, assessment, and expected code set must match its specification. Case findings are assessed within the named scope. Missing information in a draft is retained. Example context is never accepted for real-project authorization.

The review record lists each assessment below as pass, fail, or unable to determine. It includes exact paths for findings. A pass requires every required assessment to pass and no unresolved finding.

| Check identity | Required evidence |
| --- | --- |
| `s1-inventory` | Exactly the twenty approved product deliverables and no additional product changes |
| `s1-parse-and-bytes` | Successful mechanical check, approved runtime, size bounds, serialization, and actual-file fingerprints |
| `s1-document-content` | Exact approved record-format document, Markdown templates, and fixture README |
| `s1-template-content` | All twelve JSON templates have exactly the declared envelope and kind fields and remain unresolved authoring drafts |
| `s1-fixture-content` | Base graph and sixteen case definitions have the exact approved logical contents |
| `s1-reference-integrity` | Every positive reference and snapshot matches preserved virtual bytes; no circular digest dependency exists |
| `s1-approval-authority` | Exact targets, partial acceptance, changed decisions, and fictional-response limits have the specified meanings |
| `s1-review-gates` | Three review phases, author separation, non-pass outcomes, and version changes are represented correctly |
| `s1-completion-and-reopening` | Explicit result acceptance and exact reopening scope remain distinct; earlier evidence remains historical |
| `s1-comparison-scope` | Exact comparison rules are explicit; paired drafts cannot be reported as independent comparisons |
| `s1-no-live-example-action` | No example command, user response, run, or approval was treated as a real event |

These checks cover tasks 1.1 through 1.5. No numerical tolerance is applicable to their comparisons. Failed cases in the fixture contract are successful test examples only when their expected finding is identified. They are not passing project records.

## Evidence and explicit acceptance

Before separate review or user presentation, retain this specification package under `revisions/<revision>/` with a SHA-256 manifest. A revised package gets a new directory; the reviewed version remains unchanged. Keep the review report separately so it cannot change the assessed package digest.

After implementation, retain the actual-file manifest, pre-execution assessment, exact command output, semantic assessment, and results review under this step's `evidence/` directory. Record actual user approvals and acceptance separately with their response provenance. Do not substitute a synthetic fixture response for a real response. The use of manual evidence during Step 1 does not require the unfinished product helpers.

The user receives the delivered snapshot and passing verification and review evidence. Task 1.6 is completed only after explicit acceptance of that result. Until then Step 1 remains unfinished and Step 2 remains provisional. Approval of this specification authorizes work within its scope but does not constitute acceptance of the eventual result.
