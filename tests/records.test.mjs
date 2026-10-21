import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parseJsonBytes } from '../scripts/json.mjs';
import { checkRecordEnvelope } from '../scripts/envelope.mjs';
import { validateRecord,getReferences,isFilePath } from '../scripts/records.mjs';
import { materializeEnvelopeCase,observeEnvelope,expectedEnvelopeObservation } from './envelope-fixture.mjs';

const parse=(source,options)=>parseJsonBytes(Buffer.from(source),options);
const codes=result=>result.findings.map(f=>f.code);
const fixture=JSON.parse(fs.readFileSync(new URL('./fixtures/envelope/cases.json',import.meta.url),'utf8'));
for(const testcase of fixture.cases)test(`envelope oracle: ${testcase.id}`,()=>{
  const {value,sourceOrder}=materializeEnvelopeCase(fixture,testcase);
  assert.deepEqual(observeEnvelope(checkRecordEnvelope,value,sourceOrder),expectedEnvelopeObservation(testcase));
});
test('envelope rejects invalid caller data before record assessment',()=>{
  const bad=[undefined,Infinity,NaN,'\ud800',{'\ud800':1},()=>{},new Date(),{x:undefined},{get x(){throw new Error('Must not invoke.');}}];
  const cycle={};cycle.self=cycle;bad.push(cycle);
  for(const value of bad)assert.throws(()=>checkRecordEnvelope(value,{root:null,author:null}),{name:'TypeError',message:'Invalid envelope-checker input.'});
  assert.throws(()=>checkRecordEnvelope(null),TypeError);
  assert.throws(()=>checkRecordEnvelope(null,{root:null,author:null},true),TypeError);
  assert.deepEqual(checkRecordEnvelope(null,{root:null,author:null}),[{code:'invalid-type',pointer:'',message:'This value does not have the type declared for this field.'}]);
});
test('parser preserves source order, decoded names and signed zero',()=>{
  const decoded=parse('{"10":-0,"2":0.1,"nested":{"a/b~c":1e-1}}');
  assert.equal(decoded.ok,true);assert.deepEqual(decoded.orders.get(''),['10','2','nested']);assert(Object.is(decoded.value['10'],-0));assert.equal(decoded.value['2'],0.1);
  assert.deepEqual(decoded.orders.get('/nested'),['a/b~c']);
});
test('parser rejects precision loss, oversized integers, overflow and underflow',()=>{
  for(const token of ['0.10000000000000001','9007199254740993','9007199254740992','1e309','1e-400','12345678901234567890123456789e-30'])assert.deepEqual(codes(parse(token)),['unsupported-number'],token);
  for(const token of ['0.1','1e-1','1.0','1e0','9007199254740991','-0','-0.0','0e99999999999999999999'])assert.equal(parse(token).ok,true,token);
});
test('parser rejects invalid syntax and decoded duplicate keys',()=>{
  for(const token of ['', '01','[1,]','{"x":1,}','{}{}','true false','"\\x"','"\n"','NaN','/*x*/1','['])assert(codes(parse(token)).includes('invalid-json'),token);
  const duplicate=parse('{"x":1,"\\u0078":2,"nested":{"a/b~":0,"a/b~":1}}');
  assert.equal(duplicate.ok,false);assert.deepEqual(duplicate.findings.map(f=>[f.code,f.pointer]),[['duplicate-key','/nested/a~1b~0'],['duplicate-key','/x']]);
  assert.equal(parse('{"__proto__":{"polluted":true}}').value.__proto__.polluted,true);assert.equal({}.polluted,undefined);
});
test('parser enforces UTF-8, Unicode and BOM support without repair',()=>{
  assert.deepEqual(codes(parseJsonBytes(Buffer.from([0xc0,0x80]))),['invalid-encoding']);
  assert.deepEqual(codes(parseJsonBytes(Buffer.from([0xef,0xbb,0xbf,0x31]))),['check-not-supported']);
  assert.deepEqual(codes(parse('"\\ud800"')),['check-not-supported']);assert.deepEqual(codes(parse('"\\udc00"')),['check-not-supported']);
  assert.equal(parse('"\\ud83d\\ude00"').value,'😀');
});
test('parser bounds are inclusive and count containers as values',()=>{
  assert.equal(parse('[0]',{maxBytes:3,maxDepth:1,maxValues:2}).ok,true);
  assert.deepEqual(codes(parse('[0]',{maxBytes:2})),['resource-limit']);
  assert.deepEqual(codes(parse('[[]]',{maxDepth:1})),['resource-limit']);
  assert.deepEqual(codes(parse('[0]',{maxValues:1})),['resource-limit']);
});
test('every accepted blank template passes structure',()=>{
  const paths=['templates/project.json','templates/decision.json','templates/evidence.json','templates/approval.json','templates/step/contract.json','templates/step/unit.json','templates/review.json','templates/review-covered.json','templates/review-correction.json','templates/run.json','templates/comparison.json','templates/acceptance.json','templates/amendment.json','templates/snapshot.json'];
  for(const path of paths){const parsed=parseJsonBytes(fs.readFileSync(path));assert.equal(parsed.ok,true,path);assert.deepEqual(validateRecord(parsed.value,{path,orders:parsed.orders}),[],path);}
});
test('accepted fictional records pass local schemas',()=>{
  const fixture=JSON.parse(fs.readFileSync('tests/fixtures/records/base.json','utf8'));
  for(const [path,file]of Object.entries(fixture.files))if(file.encoding==='json'&&file.content?.kind){const parsed=parse(JSON.stringify(file.content));assert.deepEqual(validateRecord(parsed.value,{path,orders:parsed.orders}),[],path);}
});
test('closed objects reject unknown fields, wrong order and invalid draft null envelope',()=>{
  const decision=JSON.parse(fs.readFileSync('templates/decision.json','utf8'));
  decision.content.extra=true;assert(validateRecord(decision).some(f=>f.code==='unknown-field'&&f.pointer==='/content/extra'));
  delete decision.content.extra;decision.content={rationale:null,question:null,options:null,selection:null,evidence_refs:null};assert(validateRecord(decision).some(f=>f.code==='invalid-field-order'));
  decision.content=null;assert.deepEqual(validateRecord(decision).map(f=>[f.code,f.pointer]),[['invalid-type','/content']]);
});
test('reference traversal ignores literal data and follows declared settings',()=>{
  const r={path:'value.json',sha256:'a'.repeat(64)};
  const decision={...fixture.base,kind:'decision',content:{question:'Q',options:[],selection:{mode:'literal',value:r},rationale:'R',evidence_refs:[]}};
  assert.deepEqual(getReferences(decision),[]);
  decision.content.selection={mode:'derived',expression:'copy approved value',input_refs:[r]};
  assert.deepEqual(getReferences(decision),[{ref:r,pointer:'/content/selection/input_refs/0',kind:'decision'}]);
});
test('paths reject aliases at syntax boundary',()=>{
  for(const path of ['', '.', '..','a/../b','a//b','a/','a\\b','//server/share','c:/x','a\0b'])assert.equal(isFilePath(path),false,path);
  for(const path of ['x','a/b','/a/b','C:/a/b'])assert.equal(isFilePath(path),true,path);
  assert.equal(isFilePath('.',{directory:true}),true);assert.equal(isFilePath('/',{directory:true}),true);
});
test('every record kind rejects missing content fields and unresolved frozen content',()=>{
  const fixture=JSON.parse(fs.readFileSync('tests/fixtures/records/base.json','utf8'));
  const records=Object.values(fixture.files).filter(f=>f.encoding==='json'&&f.content?.kind).map(f=>f.content);
  const seen=new Set();
  for(const record of records){
    if(seen.has(record.kind))continue;seen.add(record.kind);
    const first=Object.keys(record.content)[0];const copy=structuredClone(record);delete copy.content[first];
    assert(validateRecord(copy).some(f=>f.code==='missing-field'&&f.pointer===`/content/${first}`),record.kind);
    const frozen=structuredClone(record);frozen.lifecycle='frozen';frozen.content[first]=null;
    assert(validateRecord(frozen).some(f=>f.code==='invalid-type'&&f.pointer===`/content/${first}`),record.kind);
  }
  assert.equal(seen.size,12);
});
test('unresolved variant discriminator does not permit extra workflow fields',()=>{
  const decision=JSON.parse(fs.readFileSync('templates/decision.json','utf8'));
  decision.content.selection={mode:null,unapproved:true};
  assert.deepEqual(validateRecord(decision).map(f=>[f.code,f.pointer]),[['unknown-field','/content/selection/unapproved']]);
});
test('nested workflow order uses raw source order while literal data has no imposed order',()=>{
  const source=JSON.stringify({...fixture.base,kind:'decision',content:{question:'Q',options:[],selection:{mode:'literal',value:{'2':1,'10':2}},rationale:'R',evidence_refs:[]}});
  const parsed=parse(source);assert.deepEqual(validateRecord(parsed.value,{orders:parsed.orders}),[]);
  parsed.orders.set('/content/selection',['value','mode']);
  assert.deepEqual(validateRecord(parsed.value,{orders:parsed.orders}).map(f=>[f.code,f.pointer]),[['invalid-field-order','/content/selection']]);
});
test('review consistency, snapshot ordering and run time order are mechanical checks',()=>{
  const fixture=JSON.parse(fs.readFileSync('tests/fixtures/records/base.json','utf8'));
  const byKind=kind=>structuredClone(Object.values(fixture.files).find(f=>f.content?.kind===kind).content);
  const review=byKind('review');review.content.reviewer.context_id='example-other';
  assert(validateRecord(review).some(f=>f.code==='association-mismatch'));
  const run=byKind('run');run.content.started_at='2025-01-01T00:00:00Z';run.content.finished_at='2020-01-01T00:00:00Z';
  assert(validateRecord(run).some(f=>f.code==='invalid-timestamp'&&f.pointer==='/content/finished_at'));
  const snapshot=byKind('snapshot');snapshot.content.entries=[{path:'z',sha256:'a'.repeat(64),size_bytes:0},{path:'a',sha256:'b'.repeat(64),size_bytes:0}];
  assert(validateRecord(snapshot).some(f=>f.code==='invalid-order'));
});
