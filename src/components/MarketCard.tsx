import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faSun, faCoins, faHourglassHalf } from '@fortawesome/free-solid-svg-icons';
import { type Market } from '../hooks/useFlareContracts';

interface MarketCardProps {
  market: Market;
  onBet: (marketId: string, prediction: 'yes' | 'no', amount: number) => void;
  onClick?: () => void;
}

export const MarketCard: React.FC<MarketCardProps> = ({ market, onBet, onClick }) => {
  const handleBetClick = (e: React.MouseEvent, prediction: 'yes' | 'no') => {
    e.stopPropagation();
    onBet(market.id, prediction, 100);
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
          <span>{market.liquidityFAsset.toLocaleString()} F-XRP Pool</span>
        </div>
        <div>
          <FontAwesomeIcon icon={faHourglassHalf} /> {new Date(market.endTime).toLocaleDateString()}
        </div>
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

      {/* Resolution badge */}
      <div className="flare-badge">
        ⚡ Secured by {market.resolutionSource}
      </div>
    </div>
  );
};
