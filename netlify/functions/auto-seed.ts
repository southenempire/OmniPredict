import type { Config } from "@netlify/functions";
import { createPublicClient, createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { flareTestnet } from "viem/chains";
import OmniPredictMarketABI from "../../src/abis/OmniPredictMarket.json";

const MARKET_ADDRESS = process.env.VITE_MARKET_CONTRACT_ADDRESS as `0x${string}`;
const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`;

const publicClient = createPublicClient({
  chain: flareTestnet,
  transport: http("https://coston2-api.flare.network/ext/C/rpc"),
});

// Markets to create — all expire 30 days from now so they last a long time
function buildMarkets() {
  const now = Math.floor(Date.now() / 1000);
  const day = 86400;

  return [
    // --- Crypto Markets ---
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
      targetPrice: 0.10 * 1e6, // scaled to avoid decimals
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
    // --- African Weather Markets ---
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
      title: "Will Accra, Ghana experience rainfall this week?",
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
}

export default async function handler() {
  try {
    if (!MARKET_ADDRESS || !PRIVATE_KEY) {
      return new Response("Missing env vars", { status: 500 });
    }

    const account = privateKeyToAccount(PRIVATE_KEY);
    const walletClient = createWalletClient({
      account,
      chain: flareTestnet,
      transport: http("https://coston2-api.flare.network/ext/C/rpc"),
    });

    // Check how many markets exist and how many are still active
    const count = (await publicClient.readContract({
      address: MARKET_ADDRESS,
      abi: OmniPredictMarketABI.abi,
      functionName: "marketCount",
    })) as bigint;

    const now = Math.floor(Date.now() / 1000);
    let activeCount = 0;

    for (let i = 0; i < Number(count); i++) {
      const marketData: any = await publicClient.readContract({
        address: MARKET_ADDRESS,
        abi: OmniPredictMarketABI.abi,
        functionName: "markets",
        args: [BigInt(i)],
      });
      const expiry = Number(marketData[5]);
      if (expiry > now) activeCount++;
    }

    console.log(`Found ${activeCount} active markets out of ${count} total.`);

    // Only seed if fewer than 4 active markets remain
    if (activeCount >= 4) {
      return new Response(
        JSON.stringify({ message: `${activeCount} active markets exist. No seeding needed.` }),
        { status: 200 }
      );
    }

    console.log("Active markets low — seeding fresh markets...");
    const markets = buildMarkets();
    const seeded: string[] = [];

    for (const m of markets) {
      try {
        const hash = await walletClient.writeContract({
          address: MARKET_ADDRESS,
          abi: OmniPredictMarketABI.abi,
          functionName: "createMarket",
          args: [m.title, m.symbol, BigInt(m.targetPrice), m.isAbove, BigInt(m.expiry)],
          value: parseEther("10"),
        });
        await publicClient.waitForTransactionReceipt({ hash });
        seeded.push(`${m.title} (${hash.slice(0, 10)}...)`);
        console.log(`✅ Created: ${m.title}`);
      } catch (err: any) {
        console.error(`❌ Failed to create ${m.title}:`, err.message);
      }
    }

    return new Response(
      JSON.stringify({ message: `Seeded ${seeded.length} new markets.`, seeded }),
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Auto-seed error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// Run every day at midnight UTC
export const config: Config = {
  schedule: "0 0 * * *",
};
