import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runMutations } from '../mutations.mjs';
import { serialize } from '../recompute.mjs';

test('all seven real source mutations killed, positive controls preserved, deterministic report', async () => {
  const a = await runMutations(), b = await runMutations();
  assert.equal(a.killed, 7); assert.equal(a.survived, 0);
  assert.deepEqual(a, b);
  assert.equal(serialize(a), readFileSync(new URL('../../../artifacts/mutation-report.json', import.meta.url), 'utf8'));
  for (const record of a.records) {
    assert.equal(record.status, 'KILLED'); assert.ok(record.killer_vectors.length);
    assert.equal(record.patch_occurrences, 1); assert.equal(record.positive_controls_preserved, 2);
  }
});
