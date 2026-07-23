import { useState, useEffect } from 'react';
import { createPublicClient, http, parseAbiItem, formatEther } from 'viem';
import { flareTestnet } from 'viem/chains';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faMedal, faWallet, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { usePrivy } from '@privy-io/react-auth';

const publicClient = createPublicClient({
  chain: flareTestnet,
  transport: http('https://coston2-api.flare.network/ext/C/rpc')
});

const MARKET_ADDRESS = import.meta.env.VITE_MARKET_CONTRACT_ADDRESS as `0x${string}`;

interface LeaderboardEntry {
  address: string;
  volume: number;
  rank: number;
}

export const Leaderboard = () => {
  const { user } = usePrivy();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!MARKET_ADDRESS) return;
      
      try {
        setLoading(true);
        // Event signature: BetPlaced(uint256 indexed marketId, address indexed user, bool isYes, uint256 amount)
        const logs = await publicClient.getLogs({
          address: MARKET_ADDRESS,
          event: parseAbiItem('event BetPlaced(uint256 indexed marketId, address indexed user, bool isYes, uint256 amount)'),
          fromBlock: 0n, // Scan from beginning (or contract deployment)
          toBlock: 'latest'
        });

        // Aggregate volumes by user
        const volumeMap: Record<string, number> = {};
        
        logs.forEach(log => {
          if (!log.args.user || !log.args.amount) return;
          const userAddr = log.args.user.toLowerCase();
          const amountFLR = Number(formatEther(log.args.amount));
          
          if (!volumeMap[userAddr]) {
            volumeMap[userAddr] = 0;
          }
          volumeMap[userAddr] += amountFLR;
        });

        // Convert to array, sort by volume descending, and assign ranks
        const sortedEntries: LeaderboardEntry[] = Object.entries(volumeMap)
          .map(([address, volume]) => ({ address, volume, rank: 0 }))
          .sort((a, b) => b.volume - a.volume)
          .map((entry, index) => ({ ...entry, rank: index + 1 }))
          .slice(0, 50); // Top 50

        setEntries(sortedEntries);
      } catch (err) {
        console.error("Failed to fetch leaderboard logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const formatAddress = (addr: string) => {
    if (user?.wallet?.address && addr.toLowerCase() === user.wallet.address.toLowerCase()) {
      return 'You (Current User)';
    }
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="leaderboard-view">
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--text)' }}>
          <FontAwesomeIcon icon={faTrophy} style={{ color: 'var(--flare)', marginRight: '10px' }} />
          Top Traders
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
          Ranked by total FLR wagered across all markets.
        </p>
      </div>

      <div className="premium-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '0' }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--muted)' }}>
            <FontAwesomeIcon icon={faSpinner} spin size="2x" style={{ marginBottom: '1rem' }} />
            <div>Aggregating on-chain data...</div>
          </div>
        ) : entries.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)' }}>
            No trades have been placed yet.
          </div>
        ) : (
          <div className="leaderboard-table">
            <div className="leaderboard-header" style={{ 
              display: 'grid', 
              gridTemplateColumns: '80px 1fr 150px', 
              padding: '1rem 2rem', 
              borderBottom: '1px solid var(--border)',
              fontWeight: 600,
              color: 'var(--muted)',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              <div>Rank</div>
              <div>Trader</div>
              <div style={{ textAlign: 'right' }}>Total Wagered</div>
            </div>
            
            {entries.map((entry, idx) => {
              const isCurrentUser = user?.wallet?.address && entry.address.toLowerCase() === user.wallet.address.toLowerCase();
              
              return (
                <div key={entry.address} style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr 150px',
                  padding: '1.25rem 2rem',
                  borderBottom: idx === entries.length - 1 ? 'none' : '1px solid var(--border)',
                  alignItems: 'center',
                  background: isCurrentUser ? 'rgba(231, 0, 82, 0.05)' : 'transparent',
                  transition: 'background 0.2s'
                }} className="leaderboard-row">
                  
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: entry.rank <= 3 ? 'var(--text)' : 'var(--muted)' }}>
                    {entry.rank === 1 && <FontAwesomeIcon icon={faMedal} style={{ color: '#FFD700', marginRight: '5px' }} />}
                    {entry.rank === 2 && <FontAwesomeIcon icon={faMedal} style={{ color: '#C0C0C0', marginRight: '5px' }} />}
                    {entry.rank === 3 && <FontAwesomeIcon icon={faMedal} style={{ color: '#CD7F32', marginRight: '5px' }} />}
                    {entry.rank > 3 && `#${entry.rank}`}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ 
                      width: '32px', height: '32px', 
                      borderRadius: '50%', 
                      background: 'var(--surface-light)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--muted)',
                      fontSize: '0.8rem'
                    }}>
                      <FontAwesomeIcon icon={faWallet} />
                    </div>
                    <span style={{ 
                      fontFamily: 'monospace', 
                      fontSize: '0.95rem',
                      fontWeight: isCurrentUser ? 700 : 500,
                      color: isCurrentUser ? 'var(--flare)' : 'var(--text)'
                    }}>
                      {formatAddress(entry.address)}
                    </span>
                  </div>
                  
                  <div style={{ textAlign: 'right', fontWeight: 600, fontSize: '1.05rem', color: 'var(--cyan)' }}>
                    {entry.volume.toLocaleString(undefined, { maximumFractionDigits: 1 })} FLR
                  </div>
                  
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
