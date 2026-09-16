import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { validate } from './schema-validator.mjs';

export const PROFILE = 'semantic-execution-guard.robinhood-stock-token.v0';
export const TYPES = Object.freeze({ RAW: 'UNDERLYING_EQUITY_QUOTE', MULTIPLIER: 'SHARES_PER_TOKEN_MULTIPLIER',
  DERIVED: 'MULTIPLIER_ADJUSTED_TOKEN_PRICE', ONCHAIN: 'ALREADY_ADJUSTED_ONCHAIN_PRICE' });
export const schema = JSON.parse(readFileSync(new URL('./relation.schema.json', import.meta.url)));
export function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value !== null && typeof value === 'object') return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${canonical(value[k])}`).join(',')}}`;
  return JSON.stringify(value);
}
export const digest = value => `0x${createHash('sha256').update(canonical(value), 'utf8').digest('hex')}`;
const same = (a, b) => canonical(a) === canonical(b);
const pow10 = decimals => 10n ** BigInt(decimals);
function rational(n, d) {
  let a = n, b = d;
  while (b !== 0n) [a, b] = [b, a % b];
  return { numerator: String(n / a), denominator: String(d / a) };
}

export function recompute(input) {
  const q = input?.quote, m = input?.multiplier, c = input?.context, w = input?.conversion;
  const receipt = {
    relation_profile_id: input?.relation_profile_id ?? null,
    fixture_kind: input?.fixture_kind ?? null, case_id: input?.case_id ?? null,
    asset_id: q?.asset?.asset_id ?? null, asset: q?.asset ?? null,
    input_price_type: q?.claim_type ?? null, requested_claim_type: input?.requested_claim_type ?? null,
    source_surface: q?.source_surface ?? null, authority_class: q?.authority_class ?? null,
    currency: q?.currency ?? null, price_side: q?.price_side ?? null,
    raw_value: q?.mantissa ?? null, raw_decimals: q?.decimals ?? null,
    multiplier: m?.mantissa ?? null, multiplier_decimals: m?.decimals ?? null,
    already_adjusted: q?.already_adjusted ?? null,
    quote_time_or_epoch: q?.observed_at ?? null, multiplier_time_or_epoch: m?.observed_at ?? null,
    multiplier_effective_state: m?.state_id ?? null,
    exact_normalized_value: null, derived_adjusted_value: null,
    relation_status: 'CANNOT_ESTABLISH', reason_code: 'INVALID_INPUT', explicit_boundary_hit: false,
    input_digest: digest(input), context_digest: digest(c ?? null),
  };
  const finish = (status, reason, boundary = false) => ({ ...receipt, relation_status: status, reason_code: reason, explicit_boundary_hit: boundary });
  const invalid = validate(input, schema);
  if (invalid.length) return { ...finish('CANNOT_ESTABLISH', 'INVALID_INPUT'), validation_errors: invalid };
  if (input.requested_claim_type !== TYPES.DERIVED) return finish('FAIL', 'REQUESTED_CLAIM_TYPE', true);
  const adjusted = q.already_adjusted || q.claim_type === TYPES.ONCHAIN;
  if (adjusted) return finish('FAIL', 'DOUBLE_ADJUSTMENT', true); // MUTATION:M5
  if (![TYPES.RAW, TYPES.ONCHAIN].includes(q.claim_type)) return finish('FAIL', 'INPUT_CLAIM_TYPE', true);
  const expectedSource = q.claim_type === TYPES.ONCHAIN ? 'ROBINHOOD_ONCHAIN_ADJUSTED_FEED' : 'ROBINHOOD_REST_PRICES';
  const expectedAuthority = q.claim_type === TYPES.ONCHAIN ? 'DECLARED_ONCHAIN_FEED' : 'DECLARED_REST_QUOTE';
  if (q.source_surface !== expectedSource || q.authority_class !== expectedAuthority)
    return finish('FAIL', 'SOURCE_AUTHORITY_SUBSTITUTION', true);
  if (m === null) return finish('CANNOT_ESTABLISH', 'MISSING_MULTIPLIER', true); // MUTATION:M2
  if (m.claim_type !== TYPES.MULTIPLIER) return finish('FAIL', 'MULTIPLIER_CLAIM_TYPE', true);
  if (m.source_surface !== 'ROBINHOOD_REST_ASSETS' || m.authority_class !== 'DECLARED_ASSET_METADATA')
    return finish('FAIL', 'MULTIPLIER_SOURCE_AUTHORITY', true);
  if (!same(q.asset, m.asset) || !same(q.asset, c.asset)) return finish('FAIL', 'ASSET_IDENTITY_MISMATCH', true); // MUTATION:M3
  if (q.currency !== 'USD' || c.currency !== q.currency || c.price_side !== q.price_side)
    return finish('FAIL', 'CURRENCY_OR_SIDE_MISMATCH', true);
  const temporalMismatch = q.observed_at !== c.quote_time || q.state_id !== c.effective_state
    || m.state_id !== c.effective_state || m.effective_from !== c.effective_from || m.effective_until !== c.effective_until
    || m.effective_from >= m.effective_until || q.observed_at < m.effective_from || q.observed_at >= m.effective_until
    || m.observed_at < m.effective_from || m.observed_at > q.observed_at || c.state_observed_at < q.observed_at;
  if (temporalMismatch) return finish('FAIL', m.state_id !== c.effective_state ? 'STALE_MULTIPLIER_STATE' : 'TEMPORAL_MISMATCH', true); // MUTATION:M4
  // Direct promotion is forbidden even when the multiplier is exactly one.
  if (w === null || w.operation !== 'MULTIPLY_EXACT') return finish('FAIL', 'EXPLICIT_CONVERSION_REQUIRED', true); // MUTATION:M1_M7
  if (w.quote_digest !== digest(q) || w.multiplier_digest !== digest(m)) return finish('FAIL', 'WITNESS_DIGEST_MISMATCH', true);
  const scaleMismatch = m.decimals !== 18 || c.multiplier_decimals !== 18 || q.decimals !== c.raw_decimals
    || w.raw_decimals !== q.decimals || w.multiplier_decimals !== m.decimals || w.output_decimals !== c.output_decimals;
  if (scaleMismatch) return finish('FAIL', 'SCALE_MISMATCH', true); // MUTATION:M6
  const numerator = BigInt(q.mantissa) * BigInt(m.mantissa);
  const denominator = pow10(q.decimals + m.decimals);
  receipt.exact_normalized_value = rational(numerator, denominator);
  const scaled = numerator * pow10(c.output_decimals);
  if (scaled % denominator !== 0n) return finish('CANNOT_ESTABLISH', 'ROUNDING_UNSPECIFIED');
  receipt.derived_adjusted_value = { mantissa: String(scaled / denominator), decimals: c.output_decimals };
  return finish('PASS', 'EXACT_CONVERSION_ESTABLISHED');
}

export function toGuardResult(receipt) {
  if (receipt.relation_status !== 'PASS' || !receipt.derived_adjusted_value) return null;
  return {
    relation_profile_id: receipt.relation_profile_id, asset_id: receipt.asset_id,
    chain_id: receipt.asset.chain_id, contract_address: receipt.asset.contract_address,
    claim_type: TYPES.DERIVED, currency: receipt.currency, price_side: receipt.price_side,
    value: receipt.derived_adjusted_value.mantissa, decimals: receipt.derived_adjusted_value.decimals,
    quote_time: receipt.quote_time_or_epoch, multiplier_effective_state: receipt.multiplier_effective_state,
    evidence_digest: receipt.input_digest, context_digest: receipt.context_digest,
    relation_status: 'PASS', reason_code: receipt.reason_code,
  };
}

export const loadVectors = () => JSON.parse(readFileSync(new URL('./vectors.json', import.meta.url)));
export const runVectors = () => loadVectors().map(({ input }) => recompute(input));
export const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const output = serialize(runVectors());
  if (process.argv[2]) writeFileSync(process.argv[2], output); else process.stdout.write(output);
}
