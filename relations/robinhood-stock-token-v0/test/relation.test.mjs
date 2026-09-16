import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { digest, loadVectors, recompute, toGuardResult, schema } from '../recompute.mjs';
import { validate } from '../schema-validator.mjs';

const vectors = loadVectors();
for (const { input, expected } of vectors) {
  test(input.case_id, () => {
    const r = recompute(input);
    assert.equal(r.relation_status, expected.relation_status);
    assert.equal(r.reason_code, expected.reason_code);
    assert.deepEqual(r.derived_adjusted_value, expected.derived_adjusted_value);
    assert.equal(r.input_digest, digest(input));
    if (r.relation_status !== 'PASS') assert.equal(toGuardResult(r), null);
  });
}
test('mandatory numeric coincidence is numerically equal but fails semantic promotion', () => {
  const i = vectors.find(v => v.input.case_id.startsWith('V2_')).input;
  assert.equal(BigInt(i.quote.mantissa) * BigInt(i.multiplier.mantissa), BigInt(i.quote.mantissa) * 10n ** BigInt(i.multiplier.decimals));
  const r = recompute(i);
  assert.equal(r.relation_status, 'FAIL'); assert.equal(r.explicit_boundary_hit, true);
  const converted = structuredClone(i); converted.conversion.operation = 'MULTIPLY_EXACT';
  assert.equal(recompute(converted).relation_status, 'PASS');
});
test('fresh processes reproduce committed receipt bytes exactly', () => {
  const script = fileURLToPath(new URL('../recompute.mjs', import.meta.url));
  const a = execFileSync(process.execPath, [script]); const b = execFileSync(process.execPath, [script]);
  assert.deepEqual(a, b);
  assert.deepEqual(a, readFileSync(new URL('../../../artifacts/recomputation-receipts.json', import.meta.url)));
});
test('exact product and unsupported rounding retain the same rational', () => {
  const a = recompute(vectors[0].input), b = recompute(vectors.find(v => v.input.case_id.startsWith('V13_')).input);
  assert.deepEqual(a.exact_normalized_value, { numerator: '2469', denominator: '16' });
  assert.deepEqual(b.exact_normalized_value, a.exact_normalized_value);
  assert.equal(b.relation_status, 'CANNOT_ESTABLISH'); assert.equal(b.derived_adjusted_value, null);
});
test('large mantissa preserves precision beyond IEEE-754 integer range', () => {
  const i = structuredClone(vectors[0].input); i.quote.mantissa = '9007199254740993';
  i.multiplier.mantissa = '1000000000000000000';
  i.conversion.quote_digest = digest(i.quote); i.conversion.multiplier_digest = digest(i.multiplier);
  assert.deepEqual(recompute(i).derived_adjusted_value, { mantissa: '900719925474099300', decimals: 4 });
});
test('schema rejects omitted fields, extras, floats, signs, exponent notation and unsafe times', () => {
  for (const mutate of [
    i => { delete i.quote.asset.contract_address; }, i => { i.quote.extra = true; },
    i => { i.quote.mantissa = 123.45; }, i => { i.quote.mantissa = '-1'; },
    i => { i.quote.mantissa = '1e6'; }, i => { i.quote.mantissa = '0'; },
    i => { i.quote.decimals = 1.5; }, i => { i.quote.decimals = 1000000; },
    i => { i.quote.observed_at = Number.MAX_SAFE_INTEGER + 1; },
    i => { i.relation_profile_id = 'unknown'; }, i => { i.multiplier.unit = 'USD'; },
  ]) {
    const i = structuredClone(vectors[0].input); mutate(i);
    assert.ok(validate(i, schema).length); assert.equal(recompute(i).relation_status, 'CANNOT_ESTABLISH');
  }
});
test('canonical digest ignores object key order but binds every semantic coordinate', () => {
  const i = vectors[0].input;
  assert.equal(digest(i), digest(Object.fromEntries(Object.entries(i).reverse())));
  for (const change of [x => x.quote.asset.asset_id += '-changed', x => x.quote.observed_at++, x => x.context.output_decimals++, x => x.quote.authority_class += '-changed']) {
    const j = structuredClone(i); change(j); assert.notEqual(digest(i), digest(j));
  }
});
test('both already-adjusted role and flag independently close the raw path', () => {
  for (const change of [x => { x.quote.already_adjusted = true; }, x => { x.quote.claim_type = 'ALREADY_ADJUSTED_ONCHAIN_PRICE'; }]) {
    const i = structuredClone(vectors[0].input); change(i);
    assert.equal(recompute(i).reason_code, 'DOUBLE_ADJUSTMENT');
  }
});
test('temporal policy rejects future observations, mismatched intervals and quote context', () => {
  for (const change of [x => x.multiplier.observed_at = 1001, x => x.multiplier.observed_at = 899,
    x => x.context.state_observed_at = 999, x => x.multiplier.effective_until = 1200,
    x => x.context.quote_time = 999, x => x.quote.state_id = 'another-state']) {
    const i = structuredClone(vectors[0].input); change(i);
    assert.equal(recompute(i).relation_status, 'FAIL');
  }
});
