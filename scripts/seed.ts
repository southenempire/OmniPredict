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

  console.log("🌱 Seeding fresh markets on contract:", marketAddress);

  const now = Math.floor(Date.now() / 1000);
  const day = 86400;

  const markets = [
    // --- Crypto Markets (30-day expiry) ---
    {
      title: "Will Bitcoin (BTC) exceed $100,000 in the next 30 days?",
      symbol: "BTC",
      targetPrice: 100000,
      isAbove: true,
      expiry: now + day * 30,
    },
    {
      title: "Will Ethereum (ETH) cross $4,000 in the next 30 days?",
      symbol: "ETH",
      targetPrice: 4000,
      isAbove: true,
      expiry: now + day * 30,
    },
    {
      title: "Will FLR token reach $0.10 in the next 30 days?",
      symbol: "FLR",
      targetPrice: 1, // 1 = 0.10 scaled
      isAbove: true,
      expiry: now + day * 30,
    },
    {
      title: "Will XRP stay above $2.00 for the next 7 days?",
      symbol: "XRP",
      targetPrice: 2,
      isAbove: true,
      expiry: now + day * 7,
    },
    // --- African Weather Markets (7-day expiry) ---
    {
      title: "Will Lagos, Nigeria exceed 32°C this week?",
      symbol: "WTHR_LOS",
      targetPrice: 32,
      isAbove: true,
      expiry: now + day * 7,
    },
    {
      title: "Will Nairobi, Kenya exceed 28°C this week?",
      symbol: "WTHR_NBO",
      targetPrice: 28,
      isAbove: true,
      expiry: now + day * 7,
    },
    {
      title: "Will Accra, Ghana experience over 5mm rainfall this week?",
      symbol: "WTHR_ACC",
      targetPrice: 5,
      isAbove: true,
      expiry: now + day * 7,
    },
    {
      title: "Will Cape Town, SA drop below 12°C this week?",
      symbol: "WTHR_CPT",
      targetPrice: 12,
      isAbove: false,
      expiry: now + day * 7,
    },
  ];

  let successCount = 0;
  for (const m of markets) {
    try {
      console.log(`  Creating: "${m.title}"...`);
      const tx = await OmniPredictMarket.connect(owner).createMarket(
        m.title,
        m.symbol,
        m.targetPrice,
        m.isAbove,
        m.expiry,
        { value: ethers.parseEther("10") }
      );
      await tx.wait();
      successCount++;
      console.log(`  ✅ Done! (${m.symbol}, expires in ${Math.round((m.expiry - now) / day)} days)`);
    } catch (err: any) {
      console.error(`  ❌ Failed: ${m.title} — ${err.message}`);
    }
  }

  console.log(`\n🎉 Successfully seeded ${successCount}/${markets.length} markets!`);
  console.log("Markets will stay active for 7–30 days.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
