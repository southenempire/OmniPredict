import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
  const marketAddress = process.env.VITE_MARKET_CONTRACT_ADDRESS;
  const OmniPredictMarket = await ethers.getContractAt("OmniPredictMarket", marketAddress);
  
  const filter = OmniPredictMarket.filters.BetPlaced();
  const logs = await OmniPredictMarket.queryFilter(filter, 0, "latest");
  console.log(`Found ${logs.length} BetPlaced events`);
}

main().catch(console.error);
