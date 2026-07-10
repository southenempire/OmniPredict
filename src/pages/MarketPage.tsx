import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faChartLine, faSun, faCoins, faClock, faInfoCircle, faLandmark, faListUl, faTerminal } from '@fortawesome/free-solid-svg-icons';
import { useFlareContracts } from '../hooks/useFlareContracts';
import { usePrivy } from '@privy-io/react-auth';
import { AITerminal } from '../components/AITerminal';

export const MarketPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { markets, placeBet } = useFlareContracts();
  const { ready, authenticated, login } = usePrivy();
  const [betAmount, setBetAmount] = useState<number>(100);
  const [showAI, setShowAI] = useState<boolean>(false);

  const market = markets.find(m => m.id === id);

  if (!market) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>Market not found.</div>;
  }

  const yesPayout = (betAmount / market.yesOdds).toFixed(2);
  const noPayout = (betAmount / market.noOdds).toFixed(2);
  const yesPct = (market.yesOdds * 100).toFixed(0);
  const noPct = (market.noOdds * 100).toFixed(0);

  let categoryIcon = faChartLine;
  let categoryName = 'Crypto';
  if (market.type === 'weather') { categoryIcon = faSun; categoryName = 'Weather'; }
  else if (market.type === 'politics') { categoryIcon = faLandmark; categoryName = 'Politics'; }

  // Generate some mock recent trades based on the market id
  const recentTrades = [
    { time: 'Just now', type: 'BUY YES', amount: '1,250 FLR', user: '0x4F...a2B' },
    { time: '2 mins ago', type: 'BUY NO', amount: '450 FLR', user: '0x88...1cF' },
    { time: '5 mins ago', type: 'BUY YES', amount: '8,900 FLR', user: '0x1A...99e' },
    { time: '12 mins ago', type: 'BUY YES', amount: '120 FLR', user: '0x33...bbA' },
    { time: '18 mins ago', type: 'BUY NO', amount: '3,400 FLR', user: '0x9E...7d4' },
  ];

  return (
    <div className="market-page-container" style={{ padding: '2rem 4rem', maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '3rem' }}>
      {/* Left Panel: Details and Chart */}
      <div className="market-left-panel" style={{ flex: 1 }}>
        <a className="back-link" onClick={() => navigate('/app')} style={{ cursor: 'pointer', color: 'var(--muted)', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Markets
        </a>
        
        <div className="market-header-card" style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--cyan)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', background: 'rgba(59, 130, 246, 0.1)', padding: '0.4rem 0.8rem', borderRadius: '4px' }}>
            <FontAwesomeIcon icon={categoryIcon} /> {categoryName} Market
          </div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '1.5rem', lineHeight: 1.3, fontWeight: 700 }}>{market.title}</h1>
          
          <div style={{ display: 'flex', gap: '2rem', color: 'var(--muted)', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FontAwesomeIcon icon={faCoins} style={{ color: 'var(--text)' }} />
              <strong style={{ color: 'var(--text)' }}>{market.liquidityFAsset.toLocaleString()} FLR</strong> Pool
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FontAwesomeIcon icon={faClock} style={{ color: 'var(--text)' }} />
              Resolves: <strong style={{ color: 'var(--text)' }}>{new Date(market.endTime).toLocaleDateString()}</strong>
            </div>
          </div>
        </div>

        {/* Order Book / Recent Trades */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FontAwesomeIcon icon={faListUl} style={{ color: 'var(--muted)' }} /> Recent Activity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {recentTrades.map((trade, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.8rem', borderBottom: i !== recentTrades.length - 1 ? '1px solid var(--border)' : 'none', fontSize: '0.9rem' }}>
                <div style={{ color: 'var(--muted)', width: '80px' }}>{trade.time}</div>
                <div style={{ fontWeight: 600, color: trade.type.includes('YES') ? 'var(--green)' : 'var(--pink)', width: '80px' }}>{trade.type}</div>
                <div style={{ fontWeight: 600, width: '100px', textAlign: 'right' }}>{trade.amount}</div>
                <div style={{ color: 'var(--cyan)', fontFamily: 'monospace' }}>{trade.user}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mechanics-section" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '0.75rem', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FontAwesomeIcon icon={faInfoCircle} style={{ color: 'var(--cyan)' }} /> Market Rules & Resolution
          </h3>
          <p style={{ color: 'var(--muted)', lineHeight: 1.6, fontSize: '0.9rem', marginBottom: '1rem' }}>
            {market.type === 'crypto' 
              ? `This market relies on the Flare Time Series Oracle (FTSO). At the end of the timeframe, a decentralized network of up to 100 independent data providers will submit the final price securely to the smart contract.`
              : market.type === 'weather' 
              ? `This market uses the Flare Data Connector (FDC). State connectors will verify off-chain weather API data cryptographically on the Flare network, ensuring no single entity can manipulate the outcome.`
              : `This market uses the Flare Data Connector (FDC). Attestation providers reach consensus on real-world news events by querying multiple Web2 APIs and submitting cryptographic proofs on-chain.`}
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ background: 'var(--surface)', padding: '0.6rem 1rem', borderRadius: '4px', fontSize: '0.8rem', border: '1px solid var(--border)' }}>
              <strong style={{ color: 'var(--text)' }}>Resolution Source:</strong> {market.resolutionSource}
            </div>
            <div style={{ background: 'var(--surface)', padding: '0.6rem 1rem', borderRadius: '4px', fontSize: '0.8rem', border: '1px solid var(--border)' }}>
              <strong style={{ color: 'var(--text)' }}>Trading Fee:</strong> 2% on Profits
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Trading Interface */}
      <div className="market-right-panel" style={{ width: '400px', flexShrink: 0 }}>
        {/* OmniAI Toggle */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button 
            onClick={() => setShowAI(!showAI)}
            style={{ width: '100%', padding: '0.8rem', background: 'rgba(0, 255, 135, 0.1)', color: 'var(--cyan)', border: '1px solid var(--cyan)', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(0, 255, 135, 0.2)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(0, 255, 135, 0.1)'}
          >
            <FontAwesomeIcon icon={faTerminal} /> {showAI ? 'Hide OmniAI' : 'Ask OmniAI'}
          </button>
          
          {showAI && (
            <div style={{ marginTop: '1rem' }}>
              <AITerminal marketContext={market.title} />
            </div>
          )}
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.75rem', padding: '1.5rem', position: 'sticky', top: '100px' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
            Trade
          </h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--muted)' }}>Outcome</span>
            <span style={{ color: 'var(--muted)' }}>Probability</span>
          </div>
          
          <div className="bet-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {/* YES Button block */}
            <div 
              style={{ border: '1px solid var(--green)', borderRadius: '6px', padding: '1rem', cursor: 'pointer', transition: 'background 0.2s' }}
              onClick={() => placeBet(market.id, 'yes', betAmount)}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 600 }}>
                <span style={{ color: 'var(--green)' }}>Buy YES</span>
                <span>{yesPct}%</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                Potential Return: <strong style={{ color: 'var(--text)' }}>{yesPayout} FLR</strong>
              </div>
            </div>
            
            {/* NO Button block */}
            <div 
              style={{ border: '1px solid var(--pink)', borderRadius: '6px', padding: '1rem', cursor: 'pointer', transition: 'background 0.2s' }}
              onClick={() => placeBet(market.id, 'no', betAmount)}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 600 }}>
                <span style={{ color: 'var(--pink)' }}>Buy NO</span>
                <span>{noPct}%</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                Potential Return: <strong style={{ color: 'var(--text)' }}>{noPayout} FLR</strong>
              </div>
            </div>
          </div>

          <div className="trade-input-group" style={{ marginBottom: '2rem' }}>
            <label style={{ color: 'var(--muted)', fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>Amount (FLR)</label>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: '6px', padding: '0.6rem 1rem' }}>
              <input 
                type="number" 
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                min={1}
                style={{ background: 'transparent', border: 'none', color: 'var(--text)', flex: 1, outline: 'none', fontSize: '1rem' }}
                className="hide-arrows"
              />
              <span style={{ color: 'var(--muted)', fontWeight: 600, fontSize: '0.9rem' }}>FLR</span>
            </div>
          </div>

          <div style={{ marginTop: 'auto' }}>
            {!authenticated ? (
              <button 
                style={{ width: '100%', padding: '1rem', background: 'var(--flare)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }} 
                onClick={login} 
                disabled={!ready}
              >
                Connect Wallet
              </button>
            ) : (
              <button 
                style={{ width: '100%', padding: '1rem', background: 'var(--surface)', color: 'var(--green)', border: '1px solid var(--border)', borderRadius: '6px', fontWeight: 700 }} 
                disabled
              >
                Wallet Connected
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
