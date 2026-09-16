import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { validate } from '../schema-validator.mjs';
import { loadVectors, recompute, toGuardResult, digest } from '../recompute.mjs';
const schema = JSON.parse(readFileSync(new URL('../../../docs/guard-result.schema.json', import.meta.url)));
test('handoff preserves all consumer coordinates and full evidence binding', () => {
  const input = loadVectors()[0].input, receipt = recompute(input), result = toGuardResult(receipt);
  assert.deepEqual(validate(result, schema), []);
  assert.equal(result.asset_id, input.context.asset.asset_id);
  assert.equal(result.chain_id, input.context.asset.chain_id);
  assert.equal(result.contract_address, input.context.asset.contract_address);
  assert.equal(result.currency, input.context.currency); assert.equal(result.price_side, input.context.price_side);
  assert.equal(result.quote_time, input.context.quote_time);
  assert.equal(result.multiplier_effective_state, input.context.effective_state);
  assert.equal(result.evidence_digest, digest(input)); assert.equal(result.context_digest, digest(input.context));
  assert.deepEqual(result, JSON.parse(readFileSync(new URL('../../../artifacts/guard-result-control.json', import.meta.url))));
});
test('handoff schema does not accept a failed status or ambiguous scale', () => {
  const result = toGuardResult(recompute(loadVectors()[0].input));
  assert.ok(validate({ ...result, relation_status: 'FAIL' }, schema).length);
  assert.ok(validate({ ...result, decimals: 1.5 }, schema).length);
});
test('demo distinguishes expected future guard behavior from observed execution', () => {
  const demo = JSON.parse(execFileSync(process.execPath, [fileURLToPath(new URL('../../../demo/relation-demo.mjs', import.meta.url))], { encoding: 'utf8' }));
  assert.equal(demo.demo, 'LOCAL_SYNTHETIC_RELATION_ONLY');
  assert.deepEqual(demo.paths.map(p => p.relation_status), ['FAIL','PASS']);
  assert.equal(demo.paths[0].semantic_result, null);
  assert.ok(demo.paths.every(p => p.actual_onchain_execution === 'NOT_IMPLEMENTED_NOT_OBSERVED'));
});
