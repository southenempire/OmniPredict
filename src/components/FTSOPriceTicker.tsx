import { useState, useEffect } from 'react';
import { createPublicClient, http } from 'viem';
import { flareTestnet } from 'viem/chains';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt } from '@fortawesome/free-solid-svg-icons';

// Minimal ABI for FtsoV2 on Coston2
const FtsoV2Abi = [
  {
    type: "function",
    name: "getFeedsById",
    inputs: [{ name: "_feedIds", type: "bytes21[]", internalType: "bytes21[]" }],
    outputs: [
      { name: "_values", type: "uint256[]", internalType: "uint256[]" },
      { name: "_decimals", type: "int8[]", internalType: "int8[]" },
      { name: "_timestamp", type: "uint64", internalType: "uint64" }
    ],
    stateMutability: "payable"
  }
] as const;

// Feed IDs for Coston2
const FEEDS = [
  { symbol: 'BTC', id: '0x014254432f55534400000000000000000000000000' as `0x${string}` },
  { symbol: 'ETH', id: '0x014554482f55534400000000000000000000000000' as `0x${string}` },
  { symbol: 'FLR', id: '0x01464c522f55534400000000000000000000000000' as `0x${string}` },
  { symbol: 'XRP', id: '0x015852502f55534400000000000000000000000000' as `0x${string}` }
];

const FTSO_V2_ADDRESS = '0x7BDE3Df0624114eDB3A67dFe6753e62f4e7c1d20' as `0x${string}`;

const publicClient = createPublicClient({
  chain: flareTestnet,
  transport: http('https://coston2-api.flare.network/ext/C/rpc')
});

export const FTSOPriceTicker = () => {
  const [prices, setPrices] = useState<{ symbol: string; price: number }[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchPrices = async () => {
      try {
        const feedIds = FEEDS.map(f => f.id);
        const data = await publicClient.readContract({
          address: FTSO_V2_ADDRESS,
          abi: FtsoV2Abi,
          functionName: 'getFeedsById',
          args: [feedIds]
        }) as [bigint[], number[], bigint];

        const [values, decimals, timestamp] = data;

        if (!mounted) return;

        const newPrices = FEEDS.map((feed, i) => {
          // values[i] is scaled by 10^decimals[i]
          const price = Number(values[i]) / Math.pow(10, decimals[i]);
          return { symbol: feed.symbol, price };
        });

        setPrices(newPrices);
        setLastUpdate(new Date(Number(timestamp) * 1000));
      } catch (err) {
        console.error("Failed to fetch FTSO prices:", err);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 10000); // refresh every 10s

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (prices.length === 0) return null;

  return (
    <div style={{
      background: 'rgba(10, 10, 10, 0.6)',
      borderBottom: '1px solid var(--border)',
      padding: '0.5rem 1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '2rem',
      overflowX: 'auto',
      whiteSpace: 'nowrap',
      fontSize: '0.85rem',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--flare)', fontWeight: 700 }}>
        <FontAwesomeIcon icon={faBolt} /> FTSO v2 Live
      </div>
      
      <div style={{ display: 'flex', gap: '2rem' }}>
        {prices.map(p => (
          <div key={p.symbol} style={{ display: 'flex', gap: '0.5rem' }}>
            <span style={{ color: 'var(--muted)' }}>{p.symbol}</span>
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>
              ${p.price < 1 ? p.price.toFixed(4) : p.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginLeft: 'auto', color: 'var(--muted)', fontSize: '0.75rem' }}>
        {lastUpdate && `Updated ${lastUpdate.toLocaleTimeString()}`}
      </div>
    </div>
  );
};
