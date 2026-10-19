import assert from 'node:assert/strict';
import { MESSAGES } from '../scripts/findings.mjs';

const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
export function materializeEnvelopeCase(fixture, testcase) {
  let value=structuredClone(fixture.base);
  let sourceOrder={root:Object.keys(value),author:Object.keys(value.author)};
  const recalculate=()=>{sourceOrder={root:object(value)?Object.keys(value):null,author:object(value?.author)?Object.keys(value.author):null};};
  function set(pointer,replacement){
    if(pointer===''){value=structuredClone(replacement);recalculate();return;}
    const parts=pointer.slice(1).split('/').map(p=>p.replaceAll('~1','/').replaceAll('~0','~'));
    const parent=parts.length===1?value:value.author;
    const order=parts.length===1?sourceOrder.root:sourceOrder.author;
    const key=parts.at(-1);
    if(!Object.hasOwn(parent,key))order.push(key);
    Object.defineProperty(parent,key,{value:structuredClone(replacement),enumerable:true,writable:true,configurable:true});
    if(pointer==='/author')sourceOrder.author=object(value.author)?Object.keys(value.author):null;
  }
  for(const change of testcase.changes){
    const [operation,pointer]=change;
    if(operation==='set')set(pointer,change[2]);
    else if(operation==='repeat')set(pointer,change[2].repeat(change[3]));
    else if(operation==='revision-above-safe')set('/revision',Number.MAX_SAFE_INTEGER+1);
    else if(operation==='override-order')sourceOrder[pointer]=structuredClone(change[2]);
    else if(operation==='order'){
      assert(pointer===''||pointer==='/author','An order operation must select root or author.');
      const which=pointer===''?'root':'author',keys=change[2];
      assert(Array.isArray(keys)&&Array.isArray(sourceOrder[which])&&keys.length===sourceOrder[which].length&&new Set(keys).size===keys.length&&keys.every(key=>sourceOrder[which].includes(key)),'An order operation must provide a complete permutation.');
      sourceOrder[which]=structuredClone(keys);
    }
    else if(operation==='remove'){
      const parts=pointer.slice(1).split('/');const parent=parts.length===1?value:value.author;const key=parts.at(-1);assert(Object.hasOwn(parent,key));delete parent[key];
      const which=parts.length===1?'root':'author';sourceOrder[which]=sourceOrder[which].filter(k=>k!==key);
    }else throw new Error('Unknown fixture operation.');
  }
  return {value,sourceOrder};
}

export function observeEnvelope(implementation,value,sourceOrder){
  const before=structuredClone({value,sourceOrder});let observation;
  try{
    const items=implementation(value,sourceOrder);
    assert(Array.isArray(items));for(const item of items)assert.deepEqual(Object.keys(item),['code','pointer','message']);
    observation={kind:'findings',items};
  }catch(error){
    // A name property alone does not establish the specified exception identity.
    if(error?.name==='TypeError')assert(error instanceof TypeError,'The checker must throw an actual TypeError.');
    observation={kind:'throw',name:error?.name,message:error?.message};
  }
  assert.deepEqual({value,sourceOrder},before,'The checker must preserve its arguments.');
  return observation;
}

export function expectedEnvelopeObservation(testcase){
  if(testcase.expected.kind==='throw')return testcase.expected;
  return {kind:'findings',items:testcase.expected.items.map(({code,pointer})=>({code,pointer,message:MESSAGES[code]}))};
}
