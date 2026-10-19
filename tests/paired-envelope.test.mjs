import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {verifyEnvelopePair} from '../examples/paired-units/verify.mjs';
test('64 saved cases pass both independent implementations, fixed oracle, direct comparison and input preservation',async()=>{
 const evidence=await verifyEnvelopePair();
 assert.equal(evidence.outcome,'pass');assert.equal(evidence.cases,64);assert.equal(evidence.calls,128);
 // Optional development evidence output, never part of installed read-only helpers.
 if(process.env.VIBE2SPEC_PAIR_EVIDENCE_DIR) {
  const dir=resolve(process.env.VIBE2SPEC_PAIR_EVIDENCE_DIR);await mkdir(dir,{recursive:true});
  await writeFile(join(dir,`envelope-${process.version}.json`),JSON.stringify(evidence,null,2)+'\n');
 }
});
