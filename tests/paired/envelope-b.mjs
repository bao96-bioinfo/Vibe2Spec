// Independent implementation B, derived from docs/envelope-unit.md.
const ROOT_FIELDS = [
  'schema_version', 'kind', 'id', 'revision', 'project_id',
  'context', 'lifecycle', 'author', 'content',
];
const AUTHOR_FIELDS = ['session_id', 'context_id'];
const KINDS = new Set([
  'project', 'decision', 'evidence', 'approval', 'step', 'unit',
  'review', 'run', 'comparison', 'acceptance', 'amendment', 'snapshot',
]);
const CONTEXTS = new Set(['authoring', 'example', 'project']);
const LIFECYCLES = new Set(['draft', 'frozen']);
const MESSAGES = {
  'unsupported-version': 'The record format version is unsupported.',
  'unknown-field': 'This field is not declared for the containing object.',
  'missing-field': 'This required field is absent.',
  'invalid-type': 'This value does not have the type declared for this field.',
  'invalid-enumeration': 'This value is not one of the declared alternatives.',
  'invalid-field-order': 'The object fields are not in their declared order.',
  'invalid-identifier': 'The identifier does not satisfy the declared spelling or length rule.',
  'invalid-integer': 'The value does not satisfy the declared safe-integer range.',
  'empty-value': 'This field requires a nonempty string or collection.',
  'context-conflict': "The declared context or actor identity violates the record's context rules.",
};
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const owns = (value, key) => Object.hasOwn(value, key);

// Use descriptors to reject accessors without evaluating them. The active set
// distinguishes cycles from harmless repeated references to the same value.
function isJsonValue(value) {
  const active = new Set();
  const finished = new Set();
  const pending = [{ value, leave: false }];
  while (pending.length > 0) {
    const entry = pending.pop();
    const current = entry.value;
    if (entry.leave) {
      active.delete(current);
      finished.add(current);
      continue;
    }
    if (current === null || typeof current === 'boolean' || typeof current === 'string') continue;
    if (typeof current === 'number') {
      if (!Number.isFinite(current)) return false;
      continue;
    }
    if (typeof current !== 'object') return false;
    if (active.has(current)) return false;
    if (finished.has(current)) continue;
    const array = Array.isArray(current);
    const prototype = Object.getPrototypeOf(current);
    if (array ? prototype !== Array.prototype : prototype !== Object.prototype && prototype !== null) return false;
    const keys = Reflect.ownKeys(current);
    if (keys.some(key => typeof key !== 'string')) return false;
    if (array && keys.length !== current.length + 1) return false;
    active.add(current);
    pending.push({ value: current, leave: true });
    for (const key of keys) {
      if (array && key === 'length') continue;
      if (array && (!Number.isSafeInteger(Number(key)) || Number(key) < 0 || String(Number(key)) !== key || Number(key) >= current.length)) return false;
      const descriptor = Object.getOwnPropertyDescriptor(current, key);
      if (!owns(descriptor, 'value') || !descriptor.enumerable) return false;
      pending.push({ value: descriptor.value, leave: false });
    }
  }
  return true;
}

function matchesKeys(object, order) {
  if (!isObject(object)) return order === null;
  if (!Array.isArray(order) || order.some(key => typeof key !== 'string')) return false;
  if (new Set(order).size !== order.length) return false;
  const keys = Object.keys(object);
  return keys.length === order.length && order.every(key => owns(object, key));
}

function validInvocation(value, sourceOrder) {
  if (!isJsonValue(value) || !isJsonValue(sourceOrder) || !isObject(sourceOrder)) return false;
  const containerKeys = Object.keys(sourceOrder);
  if (containerKeys.length !== 2 || containerKeys[0] !== 'root' || containerKeys[1] !== 'author') return false;
  const author = isObject(value) && owns(value, 'author') ? value.author : null;
  return matchesKeys(value, sourceOrder.root) && matchesKeys(author, sourceOrder.author);
}

function childPointer(parent, key) {
  return `${parent}/${key.replaceAll('~', '~0').replaceAll('/', '~1')}`;
}

function compareBytes(left, right) {
  const length = Math.min(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    if (left[index] !== right[index]) return left[index] - right[index];
  }
  return left.length - right.length;
}

export function checkRecordEnvelope(value, sourceOrder) {
  if (arguments.length !== 2 || !validInvocation(value, sourceOrder)) {
    throw new TypeError('Invalid envelope-checker input.');
  }
  const findings = [];
  const emitted = new Set();
  function report(code, pointer) {
    const identity = JSON.stringify([code, pointer]);
    if (emitted.has(identity)) return;
    emitted.add(identity);
    findings.push({ code, pointer, message: MESSAGES[code] });
  }
  if (!isObject(value)) {
    report('invalid-type', '');
    return findings;
  }

  function checkShape(object, order, fields, pointer) {
    let exact = true;
    for (const field of fields) {
      if (!owns(object, field)) {
        exact = false;
        report('missing-field', childPointer(pointer, field));
      }
    }
    const declared = new Set(fields);
    for (const field of order) {
      if (!declared.has(field)) {
        exact = false;
        report('unknown-field', childPointer(pointer, field));
      }
    }
    if (exact && fields.some((field, index) => order[index] !== field)) {
      report('invalid-field-order', pointer);
    }
  }

  function typed(object, field, pointer, predicate) {
    if (!owns(object, field)) return false;
    if (predicate(object[field])) return true;
    report('invalid-type', childPointer(pointer, field));
    return false;
  }
  function textField(object, field, pointer = '') {
    return typed(object, field, pointer, item => typeof item === 'string');
  }
  function enumField(field, alternatives) {
    if (!textField(value, field)) return false;
    if (alternatives.has(value[field])) return true;
    report('invalid-enumeration', childPointer('', field));
    return false;
  }

  checkShape(value, sourceOrder.root, ROOT_FIELDS, '');
  if (typed(value, 'schema_version', '', item => typeof item === 'number')) {
    if (!Number.isSafeInteger(value.schema_version) || value.schema_version < 0) {
      report('invalid-integer', '/schema_version');
    } else if (value.schema_version !== 1) {
      report('unsupported-version', '/schema_version');
    }
  }
  enumField('kind', KINDS);
  for (const field of ['id', 'project_id']) {
    if (textField(value, field) && (value[field].length > 80 || !/^[a-z]/.test(value[field]) || /[^a-z0-9-]/.test(value[field]))) {
      report('invalid-identifier', childPointer('', field));
    }
  }
  if (typed(value, 'revision', '', item => typeof item === 'number') &&
      (!Number.isSafeInteger(value.revision) || value.revision < 1)) {
    report('invalid-integer', '/revision');
  }
  const validContext = enumField('context', CONTEXTS);
  enumField('lifecycle', LIFECYCLES);
  if (typed(value, 'author', '', isObject)) {
    checkShape(value.author, sourceOrder.author, AUTHOR_FIELDS, '/author');
    for (const field of AUTHOR_FIELDS) {
      if (!textField(value.author, field, '/author')) continue;
      const actor = value.author[field];
      const pointer = childPointer('/author', field);
      if (actor.length === 0) {
        report('empty-value', pointer);
        continue;
      }
      if (!validContext) continue;
      if (value.context === 'example' && !actor.startsWith('example-')) {
        report('context-conflict', pointer);
      } else if (value.context === 'authoring' && actor !== (field === 'session_id' ? 'template-session' : 'template-author')) {
        report('context-conflict', pointer);
      }
    }
  }
  typed(value, 'content', '', isObject);

  const encoder = new TextEncoder();
  return findings.map(item => ({
    item,
    pointerBytes: encoder.encode(item.pointer),
    codeBytes: encoder.encode(item.code),
  })).sort((left, right) =>
    compareBytes(left.pointerBytes, right.pointerBytes) || compareBytes(left.codeBytes, right.codeBytes)
  ).map(entry => entry.item);
}
