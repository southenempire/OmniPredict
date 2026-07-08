// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// Minimal interface for Flare's FTSO Registry to fetch crypto prices
interface IFtsoRegistry {
    function getCurrentPriceWithDecimals(string memory _symbol) external view returns (uint256 _price, uint256 _timestamp, uint256 _assetPriceUsdDecimals);
}

contract OmniPredictMarket is Ownable, ReentrancyGuard {
    IFtsoRegistry public ftsoRegistry;

    enum Outcome { Unresolved, Yes, No }

    struct Market {
        uint256 id;
        string title;
        string symbol; // e.g., "BTC"
        uint256 targetPrice; // The price to beat
        bool isAbove; // True if betting it will go above targetPrice
        uint256 resolutionTimestamp; // When the market can be resolved
        uint256 yesPool; // Total native token (FLR) bet on Yes
        uint256 noPool;  // Total native token (FLR) bet on No
        Outcome winningOutcome;
        bool resolved;
    }

    uint256 public marketCount;
    mapping(uint256 => Market) public markets;
    
    // marketId => user => amount bet on Yes
    mapping(uint256 => mapping(address => uint256)) public yesBets;
    // marketId => user => amount bet on No
    mapping(uint256 => mapping(address => uint256)) public noBets;
    // marketId => user => whether they claimed their winnings
    mapping(uint256 => mapping(address => bool)) public hasClaimed;

    event MarketCreated(uint256 indexed marketId, string title, string symbol, uint256 targetPrice, uint256 resolutionTimestamp);
    event BetPlaced(uint256 indexed marketId, address indexed user, bool isYes, uint256 amount);
    event MarketResolved(uint256 indexed marketId, Outcome winningOutcome, uint256 finalPrice);
    event WinningsClaimed(uint256 indexed marketId, address indexed user, uint256 amount);

    constructor(address _ftsoRegistry) Ownable(msg.sender) {
        ftsoRegistry = IFtsoRegistry(_ftsoRegistry);
    }

    function createMarket(
        string memory _title,
        string memory _symbol,
        uint256 _targetPrice,
        bool _isAbove,
        uint256 _resolutionTimestamp
    ) external onlyOwner {
        require(_resolutionTimestamp > block.timestamp, "Resolution must be in the future");

        uint256 marketId = marketCount++;
        markets[marketId] = Market({
            id: marketId,
            title: _title,
            symbol: _symbol,
            targetPrice: _targetPrice,
            isAbove: _isAbove,
            resolutionTimestamp: _resolutionTimestamp,
            yesPool: 0,
            noPool: 0,
            winningOutcome: Outcome.Unresolved,
            resolved: false
        });

        emit MarketCreated(marketId, _title, _symbol, _targetPrice, _resolutionTimestamp);
    }

    function placeBet(uint256 _marketId, bool _isYes) external payable nonReentrant {
        require(msg.value > 0, "Bet amount must be greater than 0");
        Market storage market = markets[_marketId];
        require(!market.resolved, "Market already resolved");
        require(block.timestamp < market.resolutionTimestamp, "Trading is closed");

        if (_isYes) {
            market.yesPool += msg.value;
            yesBets[_marketId][msg.sender] += msg.value;
        } else {
            market.noPool += msg.value;
            noBets[_marketId][msg.sender] += msg.value;
        }

        emit BetPlaced(_marketId, msg.sender, _isYes, msg.value);
    }

    function resolveMarket(uint256 _marketId) external {
        Market storage market = markets[_marketId];
        require(!market.resolved, "Market already resolved");
        require(block.timestamp >= market.resolutionTimestamp, "Too early to resolve");

        // Fetch price from Flare Time Series Oracle
        (uint256 currentPrice, , ) = ftsoRegistry.getCurrentPriceWithDecimals(market.symbol);

        bool priceConditionMet = market.isAbove ? currentPrice > market.targetPrice : currentPrice < market.targetPrice;

        market.resolved = true;
        market.winningOutcome = priceConditionMet ? Outcome.Yes : Outcome.No;

        emit MarketResolved(_marketId, market.winningOutcome, currentPrice);
    }

    // Admin resolve function for off-chain markets (Weather) mimicking FDC flow
    function adminResolveMarket(uint256 _marketId, bool _isYesWinning) external onlyOwner {
        Market storage market = markets[_marketId];
        require(!market.resolved, "Market already resolved");
        
        market.resolved = true;
        market.winningOutcome = _isYesWinning ? Outcome.Yes : Outcome.No;

        emit MarketResolved(_marketId, market.winningOutcome, 0);
    }

    function claimWinnings(uint256 _marketId) external nonReentrant {
        Market storage market = markets[_marketId];
        require(market.resolved, "Market not resolved yet");
        require(!hasClaimed[_marketId][msg.sender], "Already claimed");

        uint256 payout = 0;
        uint256 totalPool = market.yesPool + market.noPool;

        if (market.winningOutcome == Outcome.Yes) {
            uint256 userBet = yesBets[_marketId][msg.sender];
            require(userBet > 0, "No winning bets");
            payout = (userBet * totalPool) / market.yesPool;
        } else if (market.winningOutcome == Outcome.No) {
            uint256 userBet = noBets[_marketId][msg.sender];
            require(userBet > 0, "No winning bets");
            payout = (userBet * totalPool) / market.noPool;
        }

        hasClaimed[_marketId][msg.sender] = true;
        
        // Calculate 2% platform fee
        uint256 fee = (payout * 2) / 100;
        uint256 finalPayout = payout - fee;

        // Send fee to the contract owner
        if (fee > 0) {
            (bool feeSuccess, ) = payable(owner()).call{value: fee}("");
            require(feeSuccess, "Fee transfer failed");
        }

        // Send final payout to the user
        (bool success, ) = payable(msg.sender).call{value: finalPayout}("");
        require(success, "Transfer failed");

        emit WinningsClaimed(_marketId, msg.sender, finalPayout);
    }

    // Set FTSO Registry address (in case it changes)
    function setFtsoRegistry(address _newRegistry) external onlyOwner {
        ftsoRegistry = IFtsoRegistry(_newRegistry);
    }
}
