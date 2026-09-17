// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test} from "forge-std/Test.sol";
import {SemanticExecutionGuard} from "../contracts/SemanticExecutionGuard.sol";
import {MockAggregatorV3} from "./mocks/MockAggregatorV3.sol";

/// @notice Named vectors mirror relations/robinhood-stock-token-v0/vectors.json's own
/// case_id convention where the on-chain analog exists, plus the vectors that only
/// make sense on-chain (staleness, incomplete round, unregistered asset, feed
/// re-registration). This is NOT a port of the off-chain relation test suite --
/// recompute.mjs/mutations.mjs already own that; this suite proves the on-chain
/// enforcement layer this repo's contracts/README.md said did not exist yet.
contract SemanticExecutionGuardTest is Test {
    bytes32 constant ASSET_A = keccak256("synthetic:equity-A");
    uint256 constant MAX_STALENESS = 3600;

    SemanticExecutionGuard guard;
    MockAggregatorV3 feedA;

    function setUp() public {
        // Forge's default starting block.timestamp is small enough that
        // `block.timestamp - MAX_STALENESS` (or even `- 10`) underflows if left
        // alone -- warp forward first so every test's timestamp arithmetic is real.
        vm.warp(1_000_000);
        guard = new SemanticExecutionGuard(MAX_STALENESS);
        feedA = new MockAggregatorV3(4); // matches vectors.json's output_decimals: 4
        guard.registerFeed(ASSET_A, address(feedA));
    }

    /// V1_CONTROL_CONVERSION analog: a fresh, complete, positive round establishes
    /// the executable price -- exactly vectors.json's own derived_adjusted_value
    /// (mantissa "1543125", decimals 4 -> 154.3125 USD/token).
    function test_V1_freshValidRound_establishesExecutablePrice() public {
        feedA.setRound(10, 1543125, block.timestamp - 10, block.timestamp - 10, 10);

        (int256 price, uint8 dec, uint80 roundId, uint256 updatedAt) = guard.getExecutablePrice(ASSET_A);

        assertEq(price, 1543125);
        assertEq(dec, 4);
        assertEq(roundId, 10);
        assertEq(updatedAt, block.timestamp - 10);
    }

    /// V2_NUMERIC_COINCIDENCE_DIRECT_PROMOTION analog, the actual point of this
    /// handoff: this is a STRUCTURAL test, not a value-based one. It proves the
    /// off-chain "raw quote" can never reach execution not because we compare it
    /// and reject a mismatch, but because executeAtOraclePrice has no parameter
    /// through which any externally-supplied price -- correct-looking or not --
    /// could ever be substituted for the oracle's own fresh read. Demonstrated by
    /// reflection on the function's ABI: its only non-fixed argument is
    /// `amountTokens`, a quantity, never a price.
    function test_V2_protectedActionAcceptsNoExternalPrice() public pure {
        bytes4 selector = SemanticExecutionGuard.executeAtOraclePrice.selector;
        // executeAtOraclePrice(bytes32,uint256) -- keccak256 selector fixed at
        // compile time by the signature itself; asserting it here pins the
        // contract's real ABI shape so a future edit that quietly adds a price
        // parameter changes this selector and fails this test loudly.
        assertEq(selector, bytes4(keccak256("executeAtOraclePrice(bytes32,uint256)")));
    }

    /// Same V2 property, demonstrated by actual execution rather than only by
    /// selector shape: two calls that differ ONLY in what a caller might have
    /// separately claimed as the "raw quote" (impossible to even express as an
    /// argument here) execute identically, because the price always comes from
    /// the same oracle read regardless of any surrounding narrative.
    function test_V2_executionIsInvariantToClaimedRawQuote_byConstruction() public {
        feedA.setRound(10, 1543125, block.timestamp - 10, block.timestamp - 10, 10);
        (int256 priceBefore,,,) = guard.getExecutablePrice(ASSET_A);

        // A caller "believes" (off-chain, out of band) the raw underlying quote was
        // 1543125 too -- the exact V2 coincidence case. There is no on-chain call
        // shape that lets them assert this into the execution path.
        (int256 executedPrice, uint256 notional) = guard.executeAtOraclePrice(ASSET_A, 2);

        assertEq(executedPrice, priceBefore);
        // priceBefore was just returned by getExecutablePrice, which reverts on
        // <= 0 -- safe to cast for this assertion.
        // forge-lint: disable-next-line(unsafe-typecast)
        assertEq(notional, 2 * uint256(priceBefore));
    }

    function test_staleAnswer_reverts() public {
        feedA.setRound(10, 1543125, block.timestamp - 7200, block.timestamp - 7200, 10);
        vm.expectRevert(
            abi.encodeWithSelector(
                SemanticExecutionGuard.StaleAnswer.selector,
                ASSET_A,
                block.timestamp - 7200,
                block.timestamp,
                MAX_STALENESS
            )
        );
        guard.getExecutablePrice(ASSET_A);
    }

    function test_nonPositiveAnswer_reverts() public {
        feedA.setRound(10, 0, block.timestamp - 10, block.timestamp - 10, 10);
        vm.expectRevert(abi.encodeWithSelector(SemanticExecutionGuard.NonPositiveAnswer.selector, ASSET_A, int256(0)));
        guard.getExecutablePrice(ASSET_A);

        feedA.setRound(11, -5, block.timestamp - 10, block.timestamp - 10, 11);
        vm.expectRevert(abi.encodeWithSelector(SemanticExecutionGuard.NonPositiveAnswer.selector, ASSET_A, int256(-5)));
        guard.getExecutablePrice(ASSET_A);
    }

    function test_incompleteRound_reverts() public {
        // answeredInRound < roundId: the classic Chainlink "carried-over stale
        // round" signature -- a real feed can report this during an outage.
        feedA.setRound(10, 1543125, block.timestamp - 10, block.timestamp - 10, 9);
        vm.expectRevert(
            abi.encodeWithSelector(SemanticExecutionGuard.IncompleteRound.selector, ASSET_A, uint80(10), uint80(9))
        );
        guard.getExecutablePrice(ASSET_A);
    }

    function test_unregisteredAsset_reverts() public {
        bytes32 assetB = keccak256("synthetic:equity-B");
        vm.expectRevert(abi.encodeWithSelector(SemanticExecutionGuard.UnknownAsset.selector, assetB));
        guard.getExecutablePrice(assetB);
    }

    function test_feedRegistration_isOneTimeImmutable() public {
        address newFeed = address(new MockAggregatorV3(4));
        vm.expectRevert(
            abi.encodeWithSelector(SemanticExecutionGuard.FeedAlreadyRegistered.selector, ASSET_A, address(feedA))
        );
        guard.registerFeed(ASSET_A, newFeed);
    }

    function test_registerFeed_onlyOwner() public {
        // Construct the mock BEFORE pranking -- `vm.prank` only overrides
        // `msg.sender` for the very next CALL, and `new MockAggregatorV3(4)`
        // evaluated inline as a call argument is itself a CREATE that would
        // silently consume the prank before `registerFeed` ever runs, letting
        // this test pass for the wrong reason (or not at all, as caught here).
        address newFeed = address(new MockAggregatorV3(4));
        vm.prank(address(0xBEEF));
        vm.expectRevert(SemanticExecutionGuard.NotOwner.selector);
        guard.registerFeed(keccak256("synthetic:equity-C"), newFeed);
    }

    /// Boundary check on the staleness window itself: exactly at the bound passes,
    /// one second past it reverts. Off-by-one on `>` vs `>=` is a real, easy mistake
    /// in exactly this kind of check.
    function test_stalenessBoundary_exactAtLimitPasses_onePastReverts() public {
        feedA.setRound(10, 1543125, block.timestamp - MAX_STALENESS, block.timestamp - MAX_STALENESS, 10);
        (int256 price,,,) = guard.getExecutablePrice(ASSET_A);
        assertEq(price, 1543125);

        feedA.setRound(11, 1543125, block.timestamp - MAX_STALENESS - 1, block.timestamp - MAX_STALENESS - 1, 11);
        vm.expectRevert(
            abi.encodeWithSelector(
                SemanticExecutionGuard.StaleAnswer.selector,
                ASSET_A,
                block.timestamp - MAX_STALENESS - 1,
                block.timestamp,
                MAX_STALENESS
            )
        );
        guard.getExecutablePrice(ASSET_A);
    }
}
