import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faSun, faCoins, faHourglassHalf, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { type Market } from '../hooks/useFlareContracts';

interface MarketCardProps {
  market: Market;
  onBet: (marketId: string, prediction: 'yes' | 'no', amount: number) => void;
  onClick?: () => void;
}

export const MarketCard: React.FC<MarketCardProps> = ({ market, onBet, onClick }) => {
  const [betAmount, setBetAmount] = useState<number>(100);

  const handleBetClick = (e: React.MouseEvent, prediction: 'yes' | 'no') => {
    e.stopPropagation();
    if (betAmount <= 0) return alert("Amount must be greater than 0");
    onBet(market.id, prediction, betAmount);
  };

  const yesPct = (market.yesOdds * 100).toFixed(0);
  const noPct  = (market.noOdds  * 100).toFixed(0);
  const isCrypto = market.type === 'crypto';

  return (
    <div
      className="market-card"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* Type badge */}
      <div className={`market-category ${market.type}`}>
        <FontAwesomeIcon icon={isCrypto ? faChartLine : faSun} />
        {isCrypto ? 'Crypto Market' : 'Weather Market'}
      </div>

      {/* Title */}
      <h3 className="market-title">{market.title}</h3>

      {/* Odds probability bar */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.78rem', fontWeight: 700, marginBottom: '.4rem' }}>
          <span style={{ color: '#00ff87' }}>YES {yesPct}%</span>
          <span style={{ color: '#f72585' }}>NO {noPct}%</span>
        </div>
        <div style={{ height: '5px', background: 'rgba(255,255,255,.08)', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${yesPct}%`,
            background: 'linear-gradient(90deg, #00ff87, #00d4ff)',
            borderRadius: '9999px',
            transition: 'width .6s ease',
          }} />
        </div>
      </div>

      {/* Stats row */}
      <div className="market-stats">
        <div className="market-liquidity">
          <FontAwesomeIcon icon={faCoins} />
          <span>{market.liquidityFAsset.toLocaleString()} FLR Pool</span>
        </div>
        <div>
          <FontAwesomeIcon icon={faHourglassHalf} /> {new Date(market.endTime).toLocaleDateString()}
        </div>
      </div>

      {/* Amount Input */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)' }} onClick={e => e.stopPropagation()}>
        <span style={{ color: 'var(--muted)', fontSize: '0.8rem', fontWeight: 600 }}>Amount:</span>
        <input 
          type="number" 
          value={betAmount} 
          onChange={(e) => setBetAmount(Number(e.target.value))}
          style={{ background: 'transparent', border: 'none', color: 'white', flex: 1, outline: 'none', fontSize: '0.9rem' }}
          min="1"
        />
        <span style={{ color: 'var(--flare)', fontSize: '0.8rem', fontWeight: 700 }}>FLR</span>
      </div>

      {/* Bet buttons */}
      <div className="bet-buttons">
        <button className="btn-yes" onClick={(e) => handleBetClick(e, 'yes')}>
          <span>Yes</span>
          <span className="odds">{yesPct}%</span>
        </button>
        <button className="btn-no" onClick={(e) => handleBetClick(e, 'no')}>
          <span>No</span>
          <span className="odds">{noPct}%</span>
        </button>
      </div>

      {/* Resolution badge and feedback */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <div className="flare-badge" style={{ margin: 0 }}>
          ⚡ Secured by {market.resolutionSource}
        </div>
        <a 
          href="https://forms.gle/W321ovNaBx4uzSgu6" 
          target="_blank" 
          rel="noreferrer" 
          onClick={e => e.stopPropagation()}
          style={{ fontSize: '0.75rem', color: 'var(--muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem', transition: 'color 0.2s' }}
          onMouseOver={e => { e.currentTarget.style.color = 'var(--text)'; }}
          onMouseOut={e => { e.currentTarget.style.color = 'var(--muted)'; }}
        >
          <FontAwesomeIcon icon={faCommentDots} /> Feedback
        </a>
      </div>
    </div>
  );
};
