import { useState, useEffect, useCallback } from 'react';
import { createPublicClient, http, formatEther, parseEther, createWalletClient, custom } from 'viem';
import { flareTestnet } from 'viem/chains';
import { useWallets } from '@privy-io/react-auth';
import OmniPredictMarketABI from '../abis/OmniPredictMarket.json';

// Local Hardhat Node Client
const publicClient = createPublicClient({
  chain: flareTestnet,
  transport: http('https://coston2-api.flare.network/ext/C/rpc')
});

const MARKET_ADDRESS = import.meta.env.VITE_MARKET_CONTRACT_ADDRESS as `0x${string}`;

export type MarketType = 'crypto' | 'weather' | 'politics';

export interface Market {
  id: string;
  title: string;
  type: MarketType;
  timerType?: '15m' | '24h';
  liquidityFAsset: number;
  endTime: string;
  yesOdds: number;
  noOdds: number;
  resolutionSource: string;
  rawTargetPrice?: number;
  isAbove?: boolean;
}

export interface Trade {
  id: string;
  marketId: string;
  prediction: 'yes' | 'no';
  amount: number;
  timestamp: string;
}

export interface UserProfile {
  username?: string;
  isProfilePublic: boolean;
  shareTradeHistory: boolean;
  shareWalletAddress: boolean;
}

export function useFlareContracts() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    isProfilePublic: false,
    shareTradeHistory: false,
    shareWalletAddress: false,
  });
  const [hasTerminalAccess, setHasTerminalAccess] = useState(false);

  const fetchMarkets = useCallback(async () => {
    if (!MARKET_ADDRESS) return;

    try {
        const count = await publicClient.readContract({
          address: MARKET_ADDRESS,
          abi: OmniPredictMarketABI.abi,
          functionName: 'marketCount'
        }) as bigint;

        const fetchedMarkets: Market[] = [];

        for (let i = 0; i < Number(count); i++) {
          const marketData: any = await publicClient.readContract({
            address: MARKET_ADDRESS,
            abi: OmniPredictMarketABI.abi,
            functionName: 'markets',
            args: [BigInt(i)]
          });

          // marketData struct: [id, title, symbol, targetPrice, isAbove, resolutionTimestamp, yesPool, noPool, winningOutcome, resolved]
          const id = marketData[0].toString();
          const title = marketData[1];
          const symbol = marketData[2];
          const targetPrice = Number(marketData[3]);
          const isAbove = marketData[4];
          const endTime = new Date(Number(marketData[5]) * 1000).toISOString();
          const yesPool = Number(formatEther(marketData[6]));
          const noPool = Number(formatEther(marketData[7]));
          
          const totalPool = yesPool + noPool;
          
          // Calculate implied odds based on pool ratio (Pari-Mutuel)
          // If pools are 0, default to 50/50
          const yesOdds = totalPool === 0 ? 0.50 : yesPool / totalPool;
          const noOdds = totalPool === 0 ? 0.50 : noPool / totalPool;

          const isWeather = symbol.startsWith('WTHR');

          fetchedMarkets.push({
            id,
            title,
            type: isWeather ? 'weather' : 'crypto',
            timerType: '24h',
            liquidityFAsset: totalPool,
            endTime,
            yesOdds,
            noOdds,
            resolutionSource: 'FTSO',
            rawTargetPrice: targetPrice,
            isAbove
          });
        }

        // --- Mock Politics Markets ---
        fetchedMarkets.push({
          id: 'mock-pol-1',
          title: 'Will the US Senate pass the Crypto Innovation Act before 2026?',
          type: 'politics',
          liquidityFAsset: 45200,
          endTime: '2025-12-31T00:00:00Z',
          yesOdds: 0.35,
          noOdds: 0.65,
          resolutionSource: 'FDC (News/Gov Oracle)',
        });
        fetchedMarkets.push({
          id: 'mock-pol-2',
          title: 'Will the UK hold a snap General Election in 2025?',
          type: 'politics',
          liquidityFAsset: 12400,
          endTime: '2025-12-31T00:00:00Z',
          yesOdds: 0.12,
          noOdds: 0.88,
          resolutionSource: 'FDC (News/Gov Oracle)',
        });

        setMarkets(fetchedMarkets);
      } catch (err) {
      console.error("Error fetching markets from smart contract:", err);
    }
  }, []);

  // Fetch real data from the Smart Contract
  useEffect(() => {
    fetchMarkets();
    
    // Poll every 5 seconds for updates
    const interval = setInterval(fetchMarkets, 5000);
    return () => clearInterval(interval);
  }, [fetchMarkets]);

  const { wallets } = useWallets();

  const placeBet = async (marketId: string, prediction: 'yes' | 'no', amount: number) => {
    const wallet = wallets[0];
    if (!wallet) {
      alert("Please connect your wallet first!");
      return;
    }

    try {
      await wallet.switchChain(flareTestnet.id);
      const provider = await wallet.getEthereumProvider();
      
      const walletClient = createWalletClient({
        account: wallet.address as `0x${string}`,
        chain: flareTestnet,
        transport: custom(provider)
      });

      const amountWei = parseEther(amount.toString());
      const isAbove = prediction === 'yes';

      const hash = await walletClient.writeContract({
        address: MARKET_ADDRESS,
        abi: OmniPredictMarketABI.abi,
        functionName: 'placeBet',
        args: [BigInt(marketId), isAbove],
        value: amountWei
      });

      // Wait for transaction locally via publicClient
      await publicClient.waitForTransactionReceipt({ hash });

      // Add to local state (optimistic/immediate)
      const newTrade: Trade = {
        id: hash,
        marketId,
        prediction,
        amount,
        timestamp: new Date().toISOString()
      };
      setTrades(prev => [newTrade, ...prev]);
      
      alert(`Transaction confirmed! Staked ${amount} FLR on '${prediction.toUpperCase()}'. Hash: ${hash.slice(0,10)}...`);
      
      // Trigger a re-fetch of markets to update liquidity pools
      fetchMarkets();
    } catch (err: any) {
      console.error("Bet transaction failed:", err);
      alert(`Transaction failed: ${err.message || 'Unknown error'}`);
    }
  };

  const cashOut = async (tradeId: string) => {
    const trade = trades.find(t => t.id === tradeId);
    if (!trade) return;

    const wallet = wallets[0];
    if (!wallet) {
      alert("Please connect your wallet first!");
      return;
    }

    try {
      await wallet.switchChain(flareTestnet.id);
      const provider = await wallet.getEthereumProvider();
      
      const walletClient = createWalletClient({
        account: wallet.address as `0x${string}`,
        chain: flareTestnet,
        transport: custom(provider)
      });

      const hash = await walletClient.writeContract({
        address: MARKET_ADDRESS,
        abi: OmniPredictMarketABI.abi,
        functionName: 'claimWinnings',
        args: [BigInt(trade.marketId)]
      });

      // Wait for transaction locally via publicClient
      await publicClient.waitForTransactionReceipt({ hash });

      setTrades(prev => prev.filter(t => t.id !== tradeId));
      alert(`Successfully claimed winnings for market ${trade.marketId}! Hash: ${hash.slice(0,10)}...`);
      
      fetchMarkets();
    } catch (err: any) {
      console.error("Claim transaction failed:", err);
      alert(`Claim failed: ${err.shortMessage || err.message || 'Unknown error'}`);
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  const purchaseTerminalAccess = (cost: number) => {
    alert(`Successfully spent ${cost} FLR to unlock OmniAI Terminal for 24 hours!`);
    setHasTerminalAccess(true);
  };

  return {
    markets,
    trades,
    userProfile,
    hasTerminalAccess,
    placeBet,
    cashOut,
    updateProfile,
    purchaseTerminalAccess
  };
}
