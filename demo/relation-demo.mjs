import { loadVectors, recompute, toGuardResult, serialize } from '../relations/robinhood-stock-token-v0/recompute.mjs';
const vectors = loadVectors();
const paths = ['V2_NUMERIC_COINCIDENCE_DIRECT_PROMOTION', 'V1_CONTROL_CONVERSION'].map(case_id => {
  const { input } = vectors.find(v => v.input.case_id === case_id);
  const receipt = recompute(input);
  return { case_id, fixture_kind: input.fixture_kind, relation_status: receipt.relation_status,
    reason_code: receipt.reason_code, semantic_result: toGuardResult(receipt),
    expected_future_guard_path: receipt.relation_status === 'PASS' ? 'EXECUTE_IF_OTHER_GUARD_CHECKS_PASS' : 'REVERT',
    actual_onchain_execution: 'NOT_IMPLEMENTED_NOT_OBSERVED' };
});
process.stdout.write(serialize({ demo: 'LOCAL_SYNTHETIC_RELATION_ONLY', paths }));
