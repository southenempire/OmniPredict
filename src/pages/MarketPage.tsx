import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faChartLine, faSun, faCoins, faClock, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useFlareContracts } from '../hooks/useFlareContracts';
import { usePrivy } from '@privy-io/react-auth';

export const MarketPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { markets, placeBet } = useFlareContracts();
  const { ready, authenticated, login } = usePrivy();
  const [betAmount, setBetAmount] = useState<number>(100);

  const market = markets.find(m => m.id === id);

  if (!market) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>Market not found.</div>;
  }

  const yesPayout = (betAmount / market.yesOdds).toFixed(2);
  const noPayout = (betAmount / market.noOdds).toFixed(2);

  return (
    <div className="market-page-container">
      {/* Left Panel: Details and Chart */}
      <div className="market-left-panel">
        <a className="back-link" onClick={() => navigate('/app')} style={{ cursor: 'pointer' }}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Markets
        </a>
        
        <div className="market-header-card">
          <div className={`market-category ${market.type}`} style={{ display: 'inline-flex', marginBottom: '1rem' }}>
            {market.type === 'crypto' ? (
              <><FontAwesomeIcon icon={faChartLine} /> Crypto Market</>
            ) : (
              <><FontAwesomeIcon icon={faSun} /> Weather Market</>
            )}
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>{market.title}</h1>
          
          <div style={{ display: 'flex', gap: '2rem', color: 'var(--text-muted)' }}>
            <div>
              <FontAwesomeIcon icon={faCoins} style={{ color: 'var(--accent-neon)', marginRight: '0.5rem' }} />
              <strong>{market.liquidityFAsset.toLocaleString()} F-XRP</strong> Pool
            </div>
            <div>
              <FontAwesomeIcon icon={faClock} style={{ color: 'var(--accent-purple)', marginRight: '0.5rem' }} />
              Resolves in: {market.timerType === '15m' ? '15 Minutes' : '24 Hours'}
            </div>
          </div>
        </div>

        <div className="market-chart-placeholder pulse-chart">
          <div style={{ textAlign: 'center' }}>
            <FontAwesomeIcon icon={faChartLine} style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }} />
            <p>Historical Data Chart</p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>(Powered by Flare State Connector)</p>
          </div>
        </div>
        
        <div className="mechanics-section">
          <h3><FontAwesomeIcon icon={faInfoCircle} /> Resolution Mechanics</h3>
          <p>
            {market.type === 'crypto' 
              ? `This market relies on the Flare Time Series Oracle (FTSO). At the end of the ${market.timerType === '15m' ? '15-minute' : '24-hour'} timeframe, a decentralized network of data providers will submit the final price securely.`
              : `This market uses the Flare Data Connector (FDC). State connectors will verify off-chain weather API data cryptographically on the Flare network.`}
          </p>
        </div>
      </div>

      {/* Right Panel: Trading Interface */}
      <div className="market-right-panel">
        <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
          Trade
        </h2>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Outcome</span>
          <span>Probability / Payout</span>
        </div>
        
        <div className="bet-buttons" style={{ flexDirection: 'column', gap: '1rem' }}>
          <button 
            className="btn-yes" 
            style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '1rem' }}
            onClick={() => placeBet(market.id, 'yes', betAmount)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <span>Bet YES</span>
              <span className="odds">{(market.yesOdds * 100).toFixed(0)}%</span>
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '0.5rem' }}>
              Potential Payout: {yesPayout} F-XRP
            </div>
          </button>
          
          <button 
            className="btn-no" 
            style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '1rem' }}
            onClick={() => placeBet(market.id, 'no', betAmount)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <span>Bet NO</span>
              <span className="odds">{(market.noOdds * 100).toFixed(0)}%</span>
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '0.5rem' }}>
              Potential Payout: {noPayout} F-XRP
            </div>
          </button>
        </div>

        <div className="trade-input-group">
          <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Amount (F-XRP)</label>
          <input 
            type="number" 
            className="trade-input" 
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            min={1}
          />
        </div>

        <div style={{ marginTop: 'auto' }}>
          {!authenticated ? (
            <button className="wallet-btn" style={{ width: '100%', padding: '1rem' }} onClick={login} disabled={!ready}>
              Login to Trade
            </button>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--accent-green)', fontWeight: 'bold' }}>
              Wallet Connected
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
