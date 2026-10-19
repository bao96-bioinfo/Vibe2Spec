import { finding, sortFindings, escapePointer } from './findings.mjs';

const NUMBER = /-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?/y;
const WHITESPACE = /[\x20\x09\x0a\x0d]/;

function normalizedDecimal(token) {
  const [mantissa, exponent = '0'] = token.toLowerCase().split('e');
  const unsigned = mantissa.replace(/^-/, '');
  let digits = unsigned.replace('.', '').replace(/^0+/, '');
  if (!digits) return '0';
  const trimmedExponent = exponent.replace(/^[+-]?0*/, '');
  if (trimmedExponent.length > 7) return null;
  let scale = Number(exponent) - (unsigned.includes('.') ? unsigned.length - unsigned.indexOf('.') - 1 : 0);
  const trailing = /0+$/.exec(digits)?.[0].length ?? 0;
  if (trailing) { digits = digits.slice(0, -trailing); scale += trailing; }
  return `${mantissa.startsWith('-') ? '-' : ''}${digits}e${scale}`;
}

function supportedNumber(token) {
  const value = Number(token);
  if (!Number.isFinite(value) || (Number.isInteger(value) && !Number.isSafeInteger(value))) return false;
  return normalizedDecimal(token) === normalizedDecimal(String(value));
}

function unicodeScalarString(value) {
  for (let i = 0; i < value.length; i++) {
    const c = value.charCodeAt(i);
    if (c >= 0xd800 && c <= 0xdbff) {
      const next = value.charCodeAt(++i);
      if (!(next >= 0xdc00 && next <= 0xdfff)) return false;
    } else if (c >= 0xdc00 && c <= 0xdfff) return false;
  }
  return true;
}

/** Strict bounded JSON decoding with source member order retained separately. */
export function parseJsonBytes(bytes, { path = '', maxBytes = 1048576, maxDepth = 64, maxValues = 100000 } = {}) {
  const orders = new Map();
  const findings = [];
  const result = (value) => ({ ok: findings.length === 0, value: findings.length ? undefined : value, orders, findings: sortFindings(findings) });
  const add = (category, code, pointer = null) => findings.push(finding(category, code, path, pointer));
  if (!(bytes instanceof Uint8Array) || typeof path !== 'string' || ![maxBytes,maxDepth,maxValues].every(x => Number.isSafeInteger(x) && x > 0)) {
    add('invocation', 'invalid-argument'); return result();
  }
  if (bytes.byteLength > maxBytes) { add('incomplete', 'resource-limit'); return result(); }
  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) { add('incomplete', 'check-not-supported'); return result(); }
  let source;
  try { source = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes); }
  catch { add('structural', 'invalid-encoding'); return result(); }
  let offset = 0, count = 0;
  const stop = Symbol('parse-stop');
  function fail(category, code, pointer = null) { add(category, code, pointer); throw stop; }
  function space() { while (offset < source.length && WHITESPACE.test(source[offset])) offset++; }
  function string(pointer) {
    const begin = offset++;
    while (offset < source.length) {
      const c = source.charCodeAt(offset++);
      if (c === 34) {
        let value;
        try { value = JSON.parse(source.slice(begin, offset)); } catch { fail('structural', 'invalid-json'); }
        if (!unicodeScalarString(value)) fail('incomplete', 'check-not-supported', pointer);
        return value;
      }
      if (c < 32) fail('structural', 'invalid-json');
      if (c === 92) {
        const escape = source[offset++];
        if (escape === 'u') {
          if (!/^[a-fA-F0-9]{4}$/.test(source.slice(offset, offset + 4))) fail('structural', 'invalid-json');
          offset += 4;
        } else if (!['"','\\','/','b','f','n','r','t'].includes(escape)) fail('structural', 'invalid-json');
      }
    }
    fail('structural', 'invalid-json');
  }
  function value(pointer, depth) {
    space();
    if (++count > maxValues) fail('incomplete', 'resource-limit', pointer);
    const c = source[offset];
    if (c === '{' || c === '[') {
      if (depth + 1 > maxDepth) fail('incomplete', 'resource-limit', pointer);
      const object = c === '{', out = object ? {} : [], names = [], seen = new Set();
      const close = object ? '}' : ']';
      offset++; space();
      if (object) orders.set(pointer, names);
      if (source[offset] === close) { offset++; return out; }
      let index = 0;
      while (offset < source.length) {
        space();
        let key;
        if (object) {
          if (source[offset] !== '"') fail('structural', 'invalid-json');
          key = string(pointer);
          space(); if (source[offset++] !== ':') fail('structural', 'invalid-json');
        } else key = index++;
        const childPointer = `${pointer}/${escapePointer(key)}`;
        const child = value(childPointer, depth + 1);
        if (object) {
          names.push(key);
          if (seen.has(key)) add('structural', 'duplicate-key', childPointer);
          else { seen.add(key); Object.defineProperty(out, key, { value: child, enumerable: true, writable: true, configurable: true }); }
        } else out.push(child);
        space();
        if (source[offset] === close) { offset++; return out; }
        if (source[offset++] !== ',') fail('structural', 'invalid-json');
      }
      fail('structural', 'invalid-json');
    }
    if (c === '"') return string(pointer);
    for (const [token, decoded] of [['true',true],['false',false],['null',null]]) {
      if (source.startsWith(token, offset)) { offset += token.length; return decoded; }
    }
    NUMBER.lastIndex = offset;
    const match = NUMBER.exec(source);
    if (!match) fail('structural', 'invalid-json');
    offset = NUMBER.lastIndex;
    if (!supportedNumber(match[0])) { add('incomplete', 'unsupported-number', pointer); return null; }
    return Number(match[0]);
  }
  try {
    const decoded = value('', 0); space();
    if (offset !== source.length) fail('structural', 'invalid-json');
    return result(decoded);
  } catch (error) { if (error !== stop) throw error; return result(); }
}
