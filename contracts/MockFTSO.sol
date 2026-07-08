// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// A local mock for the Flare Time Series Oracle to simulate live crypto prices
contract MockFTSORegistry {
    mapping(string => uint256) public prices;
    mapping(string => uint256) public decimals;

    function setPrice(string memory _symbol, uint256 _price, uint256 _decimals) external {
        prices[_symbol] = _price;
        decimals[_symbol] = _decimals;
    }

    function getCurrentPriceWithDecimals(string memory _symbol) external view returns (uint256 _price, uint256 _timestamp, uint256 _assetPriceUsdDecimals) {
        return (prices[_symbol], block.timestamp, decimals[_symbol]);
    }
}
