import test from 'node:test';
import assert from 'node:assert/strict';
import {compareBytes, compareJson, compareNumbers, comparePair, compare} from '../scripts/compare.mjs';
const exact = {category:'exact_json',array_order:'preserved',object_key_order:'ignored'};
const numeric = (changes = {}) => ({category:'numerical', metric:'absolute_error',tolerance:0.25,boundary:'inclusive',zero_policy:'exact',nonfinite_policy:'reject',alignment:'position',checker_ref:{path:'scripts/compare.mjs',sha256:'0'.repeat(64)},...changes});
test('exact byte identity includes whitespace and trailing newline', () => {
 assert.equal(compareBytes(Buffer.from('a'),Buffer.from('a\n')).outcome,'fail');
 assert.equal(compareBytes(Buffer.from('a'),Buffer.from('a')).outcome,'pass');
 assert.equal(compareBytes('a','a').outcome,'unable_to_determine');
});
test('JSON ignores object order but preserves array order, signed zero and missing fields', () => {
 assert.equal(compareJson({b:2,a:1},{a:1,b:2}).outcome,'pass');
 assert.deepEqual(compareJson([2,1],[1,2]).differences,['/0','/1']);
 assert.equal(compareJson(-0,0).outcome,'fail');
 assert.equal(compareJson({a:null},{}).outcome,'fail');
 assert.equal(compareJson([NaN],[NaN]).outcome,'unable_to_determine');
 assert.equal(compareJson([,1],[null,1]).outcome,'unable_to_determine');
 const cyclic = []; cyclic.push(cyclic);
 assert.equal(compareJson(cyclic,[]).outcome,'unable_to_determine');
});
test('numerical boundary, alignment and zero handling are explicit', () => {
 assert.equal(compareNumbers([1.25],[1],numeric()).outcome,'pass');
 assert.equal(compareNumbers([1.25],[1],numeric({boundary:'exclusive'})).outcome,'fail');
 assert.equal(compareNumbers([1,2],[1],numeric()).outcome,'fail');
 assert.equal(compareNumbers(0,0,numeric({metric:'relative_error',zero_policy:'reject'})).outcome,'unable_to_determine');
 assert.equal(compareNumbers(0,0,numeric({metric:'relative_error'})).outcome,'pass');
 assert.equal(compareNumbers(-0,0,numeric({metric:'relative_error'})).outcome,'fail');
 assert.equal(compareNumbers([Infinity],[1],numeric()).outcome,'unable_to_determine');
 assert.equal(compareNumbers([1],[1],numeric({tolerance:'0.1'})).outcome,'unable_to_determine');
 assert.equal(compareNumbers([1],[1],numeric({alignment:'sort'})).outcome,'unable_to_determine');
 assert.equal(compare(1,1,null).outcome,'unable_to_determine');
});
test('paired evidence preserves shared-error and direct-disagreement failures', () => {
 const sameWrong=comparePair([3],[3],[2],exact,exact);
 assert.equal(sameWrong.pairwise.outcome,'pass'); assert.equal(sameWrong.outcome,'fail');
 const diverged=comparePair([0.75],[1.25],[1],numeric(),numeric());
 assert.deepEqual(diverged.correctness.map(x=>x.outcome),['pass','pass']);
 assert.equal(diverged.pairwise.outcome,'fail'); assert.equal(diverged.outcome,'fail');
});
