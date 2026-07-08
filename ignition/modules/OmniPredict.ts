import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("OmniPredictModule", (m) => {
  // First we deploy our Mock FTSO Registry for local testing
  const mockFTSO = m.contract("MockFTSORegistry");

  // Then we deploy the OmniPredictMarket, passing the Mock FTSO address to the constructor
  const market = m.contract("OmniPredictMarket", [mockFTSO]);

  return { mockFTSO, market };
});
