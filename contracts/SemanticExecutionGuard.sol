// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

/// @notice Minimal Chainlink AggregatorV3Interface subset. Declared inline rather than
/// pulling the full chainlink-contracts npm dependency (foundry.toml pinned libs = []
/// before this guard was added) -- this is the entire surface the guard needs.
interface IAggregatorV3 {
    function decimals() external view returns (uint8);
    function latestRoundData()
        external
        view
        returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);
}

/// @title SemanticExecutionGuard
/// @notice Enforces the semantic relation this repo's off-chain relation profile
/// (relations/robinhood-stock-token-v0) exists to name: an UnderlyingEquityQuote
/// (a raw, unadjusted quote from an off-chain source) does NOT establish an
/// ExecutableTokenPrice, regardless of its numeric value. Only a fresh, bound,
/// on-chain Chainlink read -- already multiplier-adjusted per Robinhood's own oracle
/// design (docs.robinhood.com/chain/oracles-and-price-feeds: "the value you read is
/// the token's full [adjusted] price -- don't apply the multiplier yourself") --
/// can establish it.
///
/// Design note (source-authority, not numeric-equality): the off-chain relation's
/// own V2_NUMERIC_COINCIDENCE_DIRECT_PROMOTION vector rejects DIRECT_PROMOTION even
/// when the raw and adjusted values are numerically identical (multiplier == 1x).
/// The on-chain analog of that same defect would be a guard that reads a
/// caller-supplied "reported price" and compares it against the oracle value,
/// accepting it whenever the two happen to match -- that has an identical failure
/// mode: a no-corporate-action window where raw and adjusted values coincide would
/// silently pass, then the SAME check would fail open at the exact moment a split or
/// dividend makes them diverge, which is the highest-stakes moment for it to hold.
/// This guard avoids that shape structurally: the protected action has no parameter
/// through which an off-chain quote could ever become the executable price. The only
/// value ever used for execution is this contract's own fresh oracle read.
contract SemanticExecutionGuard {
    /// @notice Registered (feed, asset) binding. A feed address alone is not enough --
    /// this guards against a caller supplying a real Chainlink feed for the WRONG
    /// asset and having its value silently accepted for a different one.
    mapping(bytes32 assetId => address feed) public feedOf;

    /// @notice Maximum staleness tolerated between `updatedAt` and the moment of
    /// read. Chosen conservatively; not itself the subject of this handoff -- an
    /// operational parameter the deploying team can tune, set here as a guard-level
    /// default rather than hardcoded in the read path.
    uint256 public immutable maxStalenessSeconds;

    address public immutable owner;

    error UnknownAsset(bytes32 assetId);
    error FeedAlreadyRegistered(bytes32 assetId, address existingFeed);
    error StaleAnswer(bytes32 assetId, uint256 updatedAt, uint256 nowTs, uint256 maxStaleness);
    error NonPositiveAnswer(bytes32 assetId, int256 answer);
    error IncompleteRound(bytes32 assetId, uint80 roundId, uint80 answeredInRound);
    error NotOwner();

    event FeedRegistered(bytes32 indexed assetId, address indexed feed);
    event ExecutablePriceEstablished(
        bytes32 indexed assetId, int256 adjustedPrice, uint8 feedDecimals, uint80 roundId, uint256 updatedAt
    );

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor(uint256 _maxStalenessSeconds) {
        owner = msg.sender;
        maxStalenessSeconds = _maxStalenessSeconds;
    }

    /// @notice One-time binding of an asset id to its Chainlink feed. Immutable once
    /// set -- re-pointing a live asset's feed is exactly the kind of silent
    /// substitution this guard exists to make impossible, so it is disallowed
    /// entirely rather than gated behind a second owner-only call.
    function registerFeed(bytes32 assetId, address feed) external onlyOwner {
        if (feedOf[assetId] != address(0)) {
            revert FeedAlreadyRegistered(assetId, feedOf[assetId]);
        }
        feedOf[assetId] = feed;
        emit FeedRegistered(assetId, feed);
    }

    /// @notice The ONLY source of an executable price this contract recognizes.
    /// Reverts (does not silently return a fallback) on: unregistered asset,
    /// incomplete round, non-positive answer, or staleness past the configured
    /// bound. Returns the adjusted price and its native feed decimals -- callers
    /// must NOT re-apply any multiplier; the returned value is already the full,
    /// multiplier-adjusted per-token price per Robinhood's own feed contract.
    function getExecutablePrice(bytes32 assetId)
        public
        view
        returns (int256 adjustedPrice, uint8 feedDecimals, uint80 roundId, uint256 updatedAt)
    {
        address feed = feedOf[assetId];
        if (feed == address(0)) revert UnknownAsset(assetId);

        uint80 answeredInRound;
        (roundId, adjustedPrice,, updatedAt, answeredInRound) = IAggregatorV3(feed).latestRoundData();

        if (answeredInRound < roundId) {
            revert IncompleteRound(assetId, roundId, answeredInRound);
        }
        if (adjustedPrice <= 0) {
            revert NonPositiveAnswer(assetId, adjustedPrice);
        }
        // block.timestamp is validator-influenceable only by a few seconds; this
        // check's own window is an hour-scale operational staleness bound, not a
        // security boundary sized to resist that magnitude of manipulation.
        // forge-lint: disable-next-line(block-timestamp)
        if (block.timestamp - updatedAt > maxStalenessSeconds) {
            revert StaleAnswer(assetId, updatedAt, block.timestamp, maxStalenessSeconds);
        }

        feedDecimals = IAggregatorV3(feed).decimals();
    }

    /// @notice The protected action. Deliberately takes NO price parameter of any
    /// kind -- there is no argument through which a caller could pass an off-chain
    /// UnderlyingEquityQuote (raw or "already adjusted, trust me") and have it
    /// used for execution. `amountTokens` is the only caller-supplied quantity;
    /// every price figure in the emitted receipt comes from `getExecutablePrice`,
    /// read fresh in this same call, not accepted as input.
    function executeAtOraclePrice(bytes32 assetId, uint256 amountTokens)
        external
        returns (int256 adjustedPrice, uint256 notional)
    {
        uint8 feedDecimals;
        uint80 roundId;
        uint256 updatedAt;
        (adjustedPrice, feedDecimals, roundId, updatedAt) = getExecutablePrice(assetId);

        // casting to uint256 is safe because getExecutablePrice() above already
        // reverts on adjustedPrice <= 0 (NonPositiveAnswer) -- a strictly positive
        // int256 always fits into uint256 without truncation.
        // forge-lint: disable-next-line(unsafe-typecast)
        notional = amountTokens * uint256(adjustedPrice);

        emit ExecutablePriceEstablished(assetId, adjustedPrice, feedDecimals, roundId, updatedAt);
    }
}
