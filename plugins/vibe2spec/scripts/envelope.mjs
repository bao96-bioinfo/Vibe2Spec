import { MESSAGES, compareUtf8, escapePointer } from './findings.mjs';

export const RECORD_KINDS = Object.freeze(['project','decision','evidence','approval','step','unit','review','run','comparison','acceptance','amendment','snapshot']);
export const ENVELOPE_KEYS = Object.freeze(['schema_version','kind','id','revision','project_id','context','lifecycle','author','content']);
export const isRecordObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
export const isIdentifier = value => typeof value === 'string' && value.length <= 80 && /^[a-z][a-z0-9-]*(?![\s\S])/.test(value);

function jsonDomain(value, ancestors = new Set()) {
  if (value === null || typeof value === 'boolean') return true;
  if (typeof value === 'string') {
    for(let i=0;i<value.length;i++){
      const code=value.charCodeAt(i);
      if(code>=0xd800&&code<=0xdbff){const next=value.charCodeAt(++i);if(!(next>=0xdc00&&next<=0xdfff))return false;}
      else if(code>=0xdc00&&code<=0xdfff)return false;
    }
    return true;
  }
  if (typeof value === 'number') return Number.isFinite(value);
  if (typeof value !== 'object' || ancestors.has(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  if (!(Array.isArray(value) ? prototype === Array.prototype : prototype === Object.prototype || prototype === null)) return false;
  ancestors.add(value);
  const keys = Reflect.ownKeys(value);
  if (keys.some(k => typeof k !== 'string')) return false;
  if (Array.isArray(value) && (keys.length !== value.length + 1 || keys.at(-1) !== 'length')) return false;
  for (const key of keys) {
    if (Array.isArray(value) && key === 'length') continue;
    if (!jsonDomain(key)) return false;
    const descriptor = Object.getOwnPropertyDescriptor(value,key);
    if (!descriptor.enumerable || !Object.hasOwn(descriptor,'value') || !jsonDomain(descriptor.value,ancestors)) return false;
  }
  ancestors.delete(value);
  return true;
}

/** Primary implementation A, designated before either paired worker began. */
export function checkRecordEnvelope(value, sourceOrder) {
  const error = () => { throw new TypeError('Invalid envelope-checker input.'); };
  if (arguments.length !== 2 || !jsonDomain(value) || !isRecordObject(sourceOrder) || !jsonDomain(sourceOrder) || Object.keys(sourceOrder).join(',') !== 'root,author') error();
  for (const [name,object] of [['root',value],['author',isRecordObject(value) ? value.author : null]]) {
    const order = sourceOrder[name];
    if (!isRecordObject(object)) { if (order !== null) error(); continue; }
    if (!Array.isArray(order) || order.some(x=>typeof x !== 'string') || order.length !== Object.keys(object).length || new Set(order).size !== order.length || order.some(k=>!Object.hasOwn(object,k))) error();
  }
  const found = [];
  const add = (code,pointer) => found.push({code,pointer,message:MESSAGES[code]});
  const object = (v,keys,order,pointer) => {
    for(const key of keys) if(!Object.hasOwn(v,key)) add('missing-field',`${pointer}/${escapePointer(key)}`);
    for(const key of order) if(!keys.includes(key)) add('unknown-field',`${pointer}/${escapePointer(key)}`);
    if (order.length === keys.length && order.every(key=>keys.includes(key)) && order.some((key,i)=>key!==keys[i])) add('invalid-field-order',pointer);
  };
  const field = (object,key,type,pointer,check) => {
    if (!Object.hasOwn(object,key)) return;
    const v=object[key];
    if (!(type === 'object' ? isRecordObject(v) : typeof v === type)) {add('invalid-type',pointer);return;}
    check?.(v);
  };
  if (!isRecordObject(value)) { add('invalid-type',''); return found; }
  object(value,ENVELOPE_KEYS,sourceOrder.root,'');
  field(value,'schema_version','number','/schema_version',v=>{
    if(!Number.isSafeInteger(v)||v<0) add('invalid-integer','/schema_version');
    else if(v!==1) add('unsupported-version','/schema_version');
  });
  for(const [key,choices] of [['kind',RECORD_KINDS],['context',['authoring','example','project']],['lifecycle',['draft','frozen']]]) field(value,key,'string',`/${key}`,v=>{if(!choices.includes(v))add('invalid-enumeration',`/${key}`);});
  for(const key of ['id','project_id'])field(value,key,'string',`/${key}`,v=>{if(!isIdentifier(v))add('invalid-identifier',`/${key}`);});
  field(value,'revision','number','/revision',v=>{if(!Number.isSafeInteger(v)||v<1)add('invalid-integer','/revision');});
  field(value,'content','object','/content');
  field(value,'author','object','/author',author=>{
    object(author,['session_id','context_id'],sourceOrder.author,'/author');
    for(const key of ['session_id','context_id'])field(author,key,'string',`/author/${key}`,v=>{
      if(!v.length) add('empty-value',`/author/${key}`);
      else if(value.context==='example'&&!v.startsWith('example-') || value.context==='authoring'&&v!==(key==='session_id'?'template-session':'template-author'))add('context-conflict',`/author/${key}`);
    });
  });
  return found.sort((a,b)=>compareUtf8(a.pointer,b.pointer)||compareUtf8(a.code,b.code));
}
