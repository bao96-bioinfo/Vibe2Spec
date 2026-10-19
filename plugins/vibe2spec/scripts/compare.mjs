/** Pure comparison helpers. Rules must be explicitly approved before use. */
const result = (outcome, differences = [], reason = null) => ({outcome, differences, reason});
const pointer = (p, k) => `${p}/${String(k).replaceAll('~', '~0').replaceAll('/', '~1')}`;
const object = x => x !== null && typeof x === 'object' && !Array.isArray(x);
const utf8 = (a, b) => Buffer.compare(Buffer.from(a), Buffer.from(b));
const keysExactly = (obj, keys) => object(obj) && [Object.prototype, null].includes(Object.getPrototypeOf(obj))
  && Reflect.ownKeys(obj).length === keys.length && keys.every(k => {
    const descriptor = Object.getOwnPropertyDescriptor(obj, k);
    return descriptor?.enumerable && Object.hasOwn(descriptor, 'value');
  });

function scalarString(value) {
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code >= 0xd800 && code <= 0xdbff) {
      const next = value.charCodeAt(++i);
      if (!(next >= 0xdc00 && next <= 0xdfff)) return false;
    } else if (code >= 0xdc00 && code <= 0xdfff) return false;
  }
  return true;
}

function supported(value, seen = new Set(), depth = 0) {
  if (value === null || typeof value === 'boolean') return true;
  if (typeof value === 'string') return scalarString(value);
  if (typeof value === 'number') return Number.isFinite(value) && (!Number.isInteger(value) || Number.isSafeInteger(value));
  if (typeof value !== 'object' || seen.has(value)) return false;
  if (depth >= 64) return false;
  if (!Array.isArray(value) && ![Object.prototype, null].includes(Object.getPrototypeOf(value))) return false;
  if (Array.isArray(value) && Object.getPrototypeOf(value) !== Array.prototype) return false;
  seen.add(value);
  const desc = Object.getOwnPropertyDescriptors(value);
  const ownKeys = Reflect.ownKeys(value);
  if (ownKeys.some(k => typeof k === 'symbol')) return false;
  const names = Object.keys(value);
  if (ownKeys.length !== names.length + (Array.isArray(value) ? 1 : 0)) return false;
  if (Array.isArray(value) && (names.length !== value.length || names.some((k, i) => k !== String(i)))) return false;
  if (!names.every(k => scalarString(k) && Object.hasOwn(desc[k], 'value') && supported(desc[k].value, seen, depth + 1))) return false;
  seen.delete(value);
  return true;
}

export function compareBytes(actual, expected) {
  if (!(actual instanceof Uint8Array) || !(expected instanceof Uint8Array)) return result('unable_to_determine', [], 'Byte comparison requires two byte arrays.');
  return result(Buffer.from(actual).equals(Buffer.from(expected)) ? 'pass' : 'fail', Buffer.from(actual).equals(Buffer.from(expected)) ? [] : ['']);
}

export function compareJson(actual, expected) {
  if (!supported(actual) || !supported(expected)) return result('unable_to_determine', [], 'Comparison requires supported finite JSON values.');
  const differences = [];
  function visit(a, b, p) {
    if (Object.is(a, b)) return;
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) differences.push(p);
      for (let i = 0; i < Math.min(a.length, b.length); i++) visit(a[i], b[i], pointer(p, i));
    } else if (object(a) && object(b)) {
      for (const key of [...new Set([...Object.keys(a), ...Object.keys(b)])].sort(utf8)) {
        const q = pointer(p, key);
        if (!Object.hasOwn(a, key) || !Object.hasOwn(b, key)) differences.push(q);
        else visit(a[key], b[key], q);
      }
    } else differences.push(p);
  }
  visit(actual, expected, '');
  return result(differences.length ? 'fail' : 'pass', differences);
}

/** Numerical v1: scalar or flat vector, explicit finite absolute/relative error. */
export function compareNumbers(actual, expected, rule) {
  const fields = ['category', 'metric', 'tolerance', 'boundary', 'zero_policy', 'nonfinite_policy', 'alignment', 'checker_ref'];
  if (!keysExactly(rule, fields) || rule.category !== 'numerical' || !['absolute_error', 'relative_error'].includes(rule.metric) ||
      typeof rule.tolerance !== 'number' || !supported(rule.tolerance) || rule.tolerance < 0 ||
      !['inclusive', 'exclusive'].includes(rule.boundary) || !['exact', 'reject'].includes(rule.zero_policy) ||
      rule.nonfinite_policy !== 'reject' || rule.alignment !== 'position' || !keysExactly(rule.checker_ref, ['path', 'sha256']) ||
      typeof rule.checker_ref.path !== 'string' || !rule.checker_ref.path.length || typeof rule.checker_ref.sha256 !== 'string' || !/^[a-f0-9]{64}(?![\s\S])/.test(rule.checker_ref.sha256)) {
    return result('unable_to_determine', [], 'The numerical rule is outside the supported v1 checker contract.');
  }
  const numericValue = value => supported(value) && (typeof value === 'number' || Array.isArray(value) && value.every(item => typeof item === 'number'));
  if (!numericValue(actual) || !numericValue(expected)) return result('unable_to_determine', [], 'Finite supported numbers are required at every position.');
  if (Array.isArray(actual) !== Array.isArray(expected)) return result('fail', [''], 'Scalar and vector shapes differ.');
  const a = Array.isArray(actual) ? actual : [actual], b = Array.isArray(expected) ? expected : [expected];
  if (a.length !== b.length) return result('fail', [''], 'Vector lengths differ.');
  const differences = [];
  for (let i = 0; i < a.length; i++) {
    let passes;
    if (rule.metric === 'relative_error' && b[i] === 0) {
      if (rule.zero_policy === 'reject') return result('unable_to_determine', [], 'Relative error at a zero reference is excluded by this rule.');
      passes = Object.is(a[i], b[i]);
    } else {
      const error = rule.metric === 'absolute_error' ? Math.abs(a[i] - b[i]) : Math.abs((a[i] - b[i]) / b[i]);
      // Subtraction overflow is a mathematically out-of-range error, never a pass.
      passes = Number.isFinite(error) && (rule.boundary === 'inclusive' ? error <= rule.tolerance : error < rule.tolerance);
    }
    if (!passes) differences.push(Array.isArray(actual) ? `/${i}` : '');
  }
  return result(differences.length ? 'fail' : 'pass', differences);
}

export function compare(actual, expected, rule) {
  if (keysExactly(rule, ['category']) && rule.category === 'exact_bytes') return compareBytes(actual, expected);
  if (keysExactly(rule, ['category', 'array_order', 'object_key_order']) && rule.category === 'exact_json' && rule.array_order === 'preserved' && rule.object_key_order === 'ignored') return compareJson(actual, expected);
  if (Object.getOwnPropertyDescriptor(rule ?? {}, 'category')?.value === 'numerical') return compareNumbers(actual, expected, rule);
  return result('unable_to_determine', [], 'An explicit supported comparison rule is required.');
}

export function comparePair(left, right, expected, correctnessRule, pairwiseRule) {
  const correctness = [compare(left, expected, correctnessRule), compare(right, expected, correctnessRule)];
  const pairwise = compare(left, right, pairwiseRule);
  const outcomes = [...correctness, pairwise].map(x => x.outcome);
  return {outcome: outcomes.includes('fail') ? 'fail' : outcomes.includes('unable_to_determine') ? 'unable_to_determine' : 'pass', correctness, pairwise};
}
