import { Market, Prediction } from './types';
import { JsonRpcProvider, Contract, Wallet } from 'ethers';

/**
 * OmniPredictClient
 * 
 * The official SDK for interacting with OmniPredict Prediction Markets on the Flare Network.
 * Supports querying FTSO and FDC markets, and placing programmatic bets.
 */
export class OmniPredictClient {
  private provider: JsonRpcProvider;
  private wallet?: Wallet;
  // TODO: Add contract addresses for testnet/mainnet

  constructor(rpcUrl: string, privateKey?: string) {
    this.provider = new JsonRpcProvider(rpcUrl);
    if (privateKey) {
      this.wallet = new Wallet(privateKey, this.provider);
    }
  }

  /**
   * Fetch all active markets
   */
  public async getActiveMarkets(): Promise<Market[]> {
    // In a real implementation, this reads from the OmniPredict Smart Contract
    console.log('Fetching markets from Flare RPC:', this.provider._getConnection().url);
    
    // Mock response for now
    return [
      {
        id: 'm1',
        title: 'Will Bitcoin (BTC) exceed $100,000 before Aug 15?',
        type: 'crypto',
        timerType: '24h',
        liquidityFAsset: 450000,
        endTime: '2026-08-15T00:00:00Z',
        yesOdds: 0.65,
        noOdds: 0.35,
        resolutionSource: 'FTSO'
      }
    ];
  }

  /**
   * Place a bet on a market
   * @param marketId The ID of the market
   * @param prediction 'yes' or 'no'
   * @param amount The amount of F-Assets to stake
   */
  public async placeBet(marketId: string, prediction: Prediction, amount: number): Promise<string> {
    if (!this.wallet) {
      throw new Error('Wallet not initialized. Provide a private key to place bets.');
    }

    console.log(`Placing bet: ${amount} on ${prediction} for market ${marketId}...`);
    // Example: await contract.placeBet(marketId, prediction === 'yes', amount);
    
    // Return mock transaction hash
    return '0x...mockTxHash';
  }
}
