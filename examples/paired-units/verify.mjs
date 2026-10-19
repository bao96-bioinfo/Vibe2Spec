/** Development example: bounded independent envelope validation, no filesystem writes. */
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {performance} from 'node:perf_hooks';
import {parseJsonBytes} from '../../scripts/json.mjs';
import {checkRecordEnvelope as workerA} from '../../scripts/envelope.mjs';
import {checkRecordEnvelope as workerB} from '../../tests/paired/envelope-b.mjs';
import {materializeEnvelopeCase,observeEnvelope,expectedEnvelopeObservation} from '../../tests/envelope-fixture.mjs';
import {compareJson} from '../../scripts/compare.mjs';
const root=new URL('../../',import.meta.url);
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
export async function verifyEnvelopePair() {
 const started=performance.now();
 const paths=['docs/envelope-unit.md','tests/fixtures/envelope/cases.json','scripts/envelope.mjs','tests/paired/envelope-b.mjs','tests/envelope-fixture.mjs'];
 const identities={},contents={};for(const p of paths){contents[p]=await readFile(new URL(p,root));identities[p]=digest(contents[p]);}
 const bytes=contents[paths[1]];
 const parsed=parseJsonBytes(bytes,{path:paths[1],maxBytes:262144,maxDepth:64,maxValues:100000});
 assert.equal(parsed.ok,true,JSON.stringify(parsed.findings));
 const fixture=parsed.value;assert.equal(fixture.cases.length,64);
 const observations=[];let calls=0;
 for(const c of fixture.cases) {
  const input=materializeEnvelopeCase(fixture,c);
  assert(Buffer.byteLength(JSON.stringify(input,null,2)+'\n')<=16384);
  const a=structuredClone(input),b=structuredClone(input);
  const left=observeEnvelope(workerA,a.value,a.sourceOrder);calls++;
  const right=observeEnvelope(workerB,b.value,b.sourceOrder);calls++;
  const expected=expectedEnvelopeObservation(c);
  assert.deepEqual(left,expected,`A correctness: ${c.id}`);
  assert.deepEqual(right,expected,`B correctness: ${c.id}`);
  assert.equal(compareJson(left,right).outcome,'pass',`Direct comparison: ${c.id}`);
  observations.push({case_id:c.id,correctness_a:'pass',correctness_b:'pass',pairwise:'pass',observation:left});
 }
 const elapsed_ms=Math.ceil(performance.now()-started);
 assert.equal(calls,128);assert(elapsed_ms<5000,'Paired example exceeded its five-second budget.');
 return {evidence_version:1,unit:'record-envelope',runtime:process.version,platform:process.platform,architecture:process.arch,identities,fixture_bytes:bytes.length,cases:64,calls,elapsed_ms,worker_a_context:'/root/records_core',worker_b_context:'/root/independent_envelope_b',reviewer_context:'/root/paired_and_package_review',outcome:'pass',observations};
}
