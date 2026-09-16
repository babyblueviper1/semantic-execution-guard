import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, writeFileSync, copyFileSync, unlinkSync, rmdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadVectors, recompute, serialize, PROFILE } from './recompute.mjs';

const sha = text => createHash('sha256').update(text).digest('hex');
const sourceURL = new URL('./recompute.mjs', import.meta.url);
const source = readFileSync(sourceURL, 'utf8');
const directRule = "if (w === null || w.operation !== 'MULTIPLY_EXACT') return finish('FAIL', 'EXPLICIT_CONVERSION_REQUIRED', true); // MUTATION:M1_M7";
// Deliberately incorrect mutant behavior: silently promote raw price into a derived claim.
const promote = "return { ...finish('PASS', 'MUTANT_RAW_PROMOTION'), derived_adjusted_value: { mantissa: String(BigInt(q.mantissa) * pow10(c.output_decimals) / pow10(q.decimals)), decimals: c.output_decimals } };";
export const mutations = [
  { mutation_id: 'M1', changed_rule: 'Explicit conversion requirement removed: direct raw promotion allowed',
    before: directRule, after: `if (w === null || w.operation !== 'MULTIPLY_EXACT') { ${promote} }`, required_killer: 'V11_DIRECT_PROMOTION_NONUNIT' },
  { mutation_id: 'M2', changed_rule: 'Multiplier requirement removed: missing evidence silently defaults to identity',
    before: "if (m === null) return finish('CANNOT_ESTABLISH', 'MISSING_MULTIPLIER', true); // MUTATION:M2",
    after: `if (m === null) { ${promote} }`, required_killer: 'V4_MISSING_MULTIPLIER' },
  { mutation_id: 'M3', changed_rule: 'Asset/chain/contract identity matching removed',
    before: "if (!same(q.asset, m.asset) || !same(q.asset, c.asset)) return finish('FAIL', 'ASSET_IDENTITY_MISMATCH', true); // MUTATION:M3",
    after: '// MUTANT: asset identities ignored', required_killer: 'V5_WRONG_ASSET_MULTIPLIER' },
  { mutation_id: 'M4', changed_rule: 'Temporal/effective-state compatibility enforcement removed',
    before: "if (temporalMismatch) return finish('FAIL', m.state_id !== c.effective_state ? 'STALE_MULTIPLIER_STATE' : 'TEMPORAL_MISMATCH', true); // MUTATION:M4",
    after: '// MUTANT: temporal/effective identity ignored', required_killer: 'V3_STALE_MULTIPLIER' },
  { mutation_id: 'M5', changed_rule: 'Already-adjusted evidence exclusion removed: multiplier applied again',
    before: "if (adjusted) return finish('FAIL', 'DOUBLE_ADJUSTMENT', true); // MUTATION:M5",
    after: '// MUTANT: adjusted evidence allowed into raw conversion', required_killer: 'V7_DOUBLE_ADJUSTMENT' },
  { mutation_id: 'M6', changed_rule: 'Decimal/scale agreement enforcement removed',
    before: "if (scaleMismatch) return finish('FAIL', 'SCALE_MISMATCH', true); // MUTATION:M6",
    after: '// MUTANT: scale metadata disagreement ignored', required_killer: 'V8_SCALE_MISMATCH' },
  { mutation_id: 'M7', changed_rule: 'Numeric coincidence treated as semantic equivalence without conversion',
    before: directRule, after: `if (w === null || w.operation !== 'MULTIPLY_EXACT') { if (BigInt(m.mantissa) === pow10(m.decimals)) { ${promote} } return finish('FAIL', 'EXPLICIT_CONVERSION_REQUIRED', true); }`,
    required_killer: 'V2_NUMERIC_COINCIDENCE_DIRECT_PROMOTION' },
];

export async function runMutations() {
  const vectors = loadVectors();
  for (const { input, expected } of vectors) {
    const r = recompute(input);
    assert.equal(r.relation_status, expected.relation_status, `${input.case_id}: invalid baseline`);
    assert.equal(r.reason_code, expected.reason_code);
    assert.deepEqual(r.derived_adjusted_value, expected.derived_adjusted_value);
  }
  const records = [];
  for (const mutation of mutations) {
    assert.equal(source.split(mutation.before).length - 1, 1, `${mutation.mutation_id}: patch must apply exactly once`);
    const changed = source.replace(mutation.before, mutation.after);
    assert.notEqual(changed, source);
    // A separate module in a fresh temporary directory; production has no mutation switch.
    const directory = mkdtempSync(join(tmpdir(), 'semantic-guard-mutation-'));
    const files = ['recompute.mjs', 'relation.schema.json', 'schema-validator.mjs'];
    try {
      writeFileSync(join(directory, 'recompute.mjs'), changed);
      for (const file of files.slice(1)) copyFileSync(new URL(file, sourceURL), join(directory, file));
      const mutant = await import(pathToFileURL(join(directory, 'recompute.mjs')).href);
      const results = vectors.map(({ input, expected }) => ({ case_id: input.case_id,
        baseline_status: expected.relation_status, mutant: mutant.recompute(input) }));
      // A crash or broken positive control is not a kill.
      for (const { input, expected } of vectors.filter(v => v.expected.relation_status === 'PASS')) {
        const r = results.find(v => v.case_id === input.case_id).mutant;
        assert.equal(r.relation_status, 'PASS'); assert.deepEqual(r.derived_adjusted_value, expected.derived_adjusted_value);
      }
      const killers = results.filter(r => r.baseline_status !== 'PASS' && r.mutant.relation_status === 'PASS');
      assert.ok(killers.some(r => r.case_id === mutation.required_killer), `${mutation.mutation_id}: required vector must kill`);
      records.push({ mutation_id: mutation.mutation_id, changed_rule: mutation.changed_rule,
        killer_vectors: killers.map(r => r.case_id), observed_result: killers.map(r => ({ case_id: r.case_id,
          baseline_status: r.baseline_status, mutant_status: r.mutant.relation_status, mutant_reason_code: r.mutant.reason_code,
          mutant_derived_value: r.mutant.derived_adjusted_value })), status: 'KILLED',
        patch_occurrences: 1, mutant_source_sha256: sha(changed), positive_controls_preserved: 2 });
    } finally {
      // Delete only exact files created in this unique temporary directory, never recursively.
      for (const file of files) { try { unlinkSync(join(directory, file)); } catch (e) { if (e.code !== 'ENOENT') throw e; } }
      rmdirSync(directory);
    }
  }
  return { relation_profile_id: PROFILE, fixture_kind: 'SYNTHETIC_RELATION_FIXTURE',
    implementation_sha256: sha(source), schema_sha256: sha(readFileSync(new URL('./relation.schema.json', import.meta.url))),
    validator_sha256: sha(readFileSync(new URL('./schema-validator.mjs', import.meta.url))),
    vectors_sha256: sha(readFileSync(new URL('./vectors.json', import.meta.url))),
    mutation_runner_sha256: sha(readFileSync(new URL('./mutations.mjs', import.meta.url))),
    baseline_vectors: vectors.length, killed: records.length, survived: 0, records };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const output = serialize(await runMutations());
  if (process.argv[2]) writeFileSync(process.argv[2], output); else process.stdout.write(output);
}
