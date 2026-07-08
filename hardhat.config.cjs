require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // For local testing
    hardhat: {
      chainId: 31337,
    },
    // Flare Coston2 Testnet
    coston2: {
      url: "https://coston2-api.flare.network/ext/C/rpc",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 114,
    },
    // Flare Mainnet
    flare: {
      url: "https://flare-api.flare.network/ext/bc/C/rpc",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 14,
    }
  },
};
