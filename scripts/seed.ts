import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
  const marketAddress = process.env.VITE_MARKET_CONTRACT_ADDRESS;
  if (!marketAddress) {
    console.error("VITE_MARKET_CONTRACT_ADDRESS not found in .env");
    return;
  }

  const OmniPredictMarket = await ethers.getContractAt("OmniPredictMarket", marketAddress);
  const signers = await ethers.getSigners();
  const owner = signers[0];

  console.log("Seeding markets on contract:", marketAddress);

  // Market 1: BTC > 100k by tomorrow
  const tx1 = await OmniPredictMarket.connect(owner).createMarket(
    "Will Bitcoin (BTC) exceed $100,000 before tomorrow?",
    "BTC",
    100000,
    true,
    Math.floor(Date.now() / 1000) + 86400,
    { value: ethers.parseEther("10") }
  );
  await tx1.wait();

  // Market 2: ETH flip BTC (target price is arbitrary for this demo, say > 0.05 BTC/ETH ratio?)
  // Let's just use USD price of ETH > 4000
  const tx2 = await OmniPredictMarket.connect(owner).createMarket(
    "Will Ethereum (ETH) cross $4,000 this week?",
    "ETH",
    4000,
    true,
    Math.floor(Date.now() / 1000) + 86400 * 7,
    { value: ethers.parseEther("10") }
  );
  await tx2.wait();

  // Market 3: XRP > 1.00 in 15 mins
  const tx3 = await OmniPredictMarket.connect(owner).createMarket(
    "Will XRP price stay above $1.00 for the next 15 minutes?",
    "XRP",
    1,
    true,
    Math.floor(Date.now() / 1000) + 900,
    { value: ethers.parseEther("10") }
  );
  await tx3.wait();

  // Market 4: Weather Example
  const tx4 = await OmniPredictMarket.connect(owner).createMarket(
    "Will London exceed 25°C tomorrow?",
    "WTHR_LON",
    25,
    true,
    Math.floor(Date.now() / 1000) + 86400,
    { value: ethers.parseEther("10") }
  );
  await tx4.wait();

  console.log("Successfully seeded 4 initial markets!");

  // African Weather Markets
  const tx5 = await OmniPredictMarket.connect(owner).createMarket(
    "Will Nairobi, Kenya exceed 28°C tomorrow?",
    "WTHR_NBO",
    28,
    true,
    Math.floor(Date.now() / 1000) + 86400,
    { value: ethers.parseEther("10") }
  );
  await tx5.wait();

  const tx6 = await OmniPredictMarket.connect(owner).createMarket(
    "Will Accra, Ghana experience more than 10mm of rainfall this week?",
    "WTHR_ACC",
    10,
    true,
    Math.floor(Date.now() / 1000) + 86400 * 7,
    { value: ethers.parseEther("10") }
  );
  await tx6.wait();

  const tx7 = await OmniPredictMarket.connect(owner).createMarket(
    "Will Cape Town, SA drop below 12°C tonight?",
    "WTHR_CPT",
    12,
    false,
    Math.floor(Date.now() / 1000) + 43200,
    { value: ethers.parseEther("10") }
  );
  await tx7.wait();

  const tx8 = await OmniPredictMarket.connect(owner).createMarket(
    "Will Lagos, Nigeria exceed 32°C tomorrow?",
    "WTHR_LOS",
    32,
    true,
    Math.floor(Date.now() / 1000) + 86400,
    { value: ethers.parseEther("10") }
  );
  await tx8.wait();

  console.log("Successfully seeded African Weather markets!");

  // Let's place some dummy bets so the pools aren't 0
  // NOTE: Commented out for Coston2 deployment to avoid gas limits and missing signers
  /*
  await OmniPredictMarket.connect(owner).placeBet(0, true, { value: ethers.parseEther("10") });
  await OmniPredictMarket.connect(signers[1]).placeBet(0, false, { value: ethers.parseEther("5") });

  await OmniPredictMarket.connect(owner).placeBet(1, true, { value: ethers.parseEther("1") });
  await OmniPredictMarket.connect(signers[2]).placeBet(1, false, { value: ethers.parseEther("2") });

  await OmniPredictMarket.connect(owner).placeBet(3, false, { value: ethers.parseEther("1") });
  await OmniPredictMarket.connect(signers[3]).placeBet(3, true, { value: ethers.parseEther("2") });
  */
  console.log("Seeded initial liquidity pools!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
