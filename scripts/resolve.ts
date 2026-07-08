import { ethers } from "hardhat";

async function main() {
  const contractAddress = process.env.VITE_MARKET_CONTRACT_ADDRESS;
  if (!contractAddress) {
    throw new Error("Contract address not found in environment variables");
  }

  console.log(`Resolving markets on contract: ${contractAddress}`);

  const OmniPredictMarket = await ethers.getContractFactory("OmniPredictMarket");
  const contract = OmniPredictMarket.attach(contractAddress) as any;

  // Resolve an FTSO Crypto Market (Market 0: BTC)
  // Assuming the timestamp has passed. If not, this will revert.
  try {
    const tx1 = await contract.resolveMarket(0);
    await tx1.wait();
    console.log("Resolved Crypto Market 0 via FTSO data!");
  } catch (error) {
    console.log("Could not resolve Market 0 (perhaps it's not expired yet).");
  }

  // Resolve a Weather Market manually (Market 4: Nairobi) -> Let's say YES it exceeded 28°C
  try {
    const tx2 = await contract.adminResolveMarket(4, true);
    await tx2.wait();
    console.log("Admin Resolved Weather Market 4 to YES!");
  } catch (error) {
    console.log("Could not resolve Market 4.");
  }

  console.log("Resolution complete. Users can now call claimWinnings().");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
