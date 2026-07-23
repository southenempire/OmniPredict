import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faSun, faCoins, faHourglassHalf, faCommentDots, faLandmark, faLock } from '@fortawesome/free-solid-svg-icons';
import { type Market } from '../hooks/useFlareContracts';
import toast from 'react-hot-toast';

interface MarketCardProps {
  market: Market;
  onBet: (marketId: string, prediction: 'yes' | 'no', amount: number) => void;
  onClick?: () => void;
}

export const MarketCard: React.FC<MarketCardProps> = ({ market, onBet, onClick }) => {
  const [betAmount, setBetAmount] = useState<number>(100);

  const handleBetClick = (e: React.MouseEvent, prediction: 'yes' | 'no') => {
    e.stopPropagation();
    if (betAmount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }
    onBet(market.id, prediction, betAmount);
  };

  const isExpired = new Date(market.endTime) < new Date();

  const yesPct = (market.yesOdds * 100).toFixed(0);
  const noPct  = (market.noOdds  * 100).toFixed(0);
  
  let categoryIcon = faChartLine;
  let categoryName = 'Crypto';
  if (market.type === 'weather') { categoryIcon = faSun; categoryName = 'Weather'; }
  else if (market.type === 'politics') { categoryIcon = faLandmark; categoryName = 'Politics'; }

  return (
    <div
      className="market-card"
      onClick={onClick}
      style={{ 
        cursor: onClick ? 'pointer' : 'default',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '0.75rem',
        padding: '1.25rem',
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}
      onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {/* Header: Category & Pool */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <FontAwesomeIcon icon={categoryIcon} />
          <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>{categoryName}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <FontAwesomeIcon icon={faCoins} />
          <span>{market.liquidityFAsset.toLocaleString()} FLR</span>
        </div>
      </div>

      {/* Title */}
      <h3 style={{ fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.4, margin: 0, color: 'var(--text)' }}>
        {market.title}
      </h3>

      {/* Odds probability bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>
          <span style={{ color: 'var(--green)' }}>Yes {yesPct}%</span>
          <span style={{ color: 'var(--pink)' }}>No {noPct}%</span>
        </div>
        <div style={{ display: 'flex', height: '6px', borderRadius: '4px', overflow: 'hidden', background: 'var(--border)' }}>
          <div style={{
            height: '100%',
            width: `${yesPct}%`,
            background: 'var(--green)',
            transition: 'width 0.4s ease',
          }} />
          <div style={{
            height: '100%',
            width: `${noPct}%`,
            background: 'var(--pink)',
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      {/* Amount Input & Buttons or Closed Badge */}
      {isExpired ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '0.4rem', border: '1px solid var(--border)', color: 'var(--muted)', fontWeight: 600, fontSize: '0.9rem' }}>
          <FontAwesomeIcon icon={faLock} /> Market Closed
        </div>
      ) : (
        <>
          {/* Amount Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.4rem 0.6rem', borderRadius: '0.4rem', border: '1px solid var(--border)' }} onClick={e => e.stopPropagation()}>
            <span style={{ color: 'var(--muted)', fontSize: '0.75rem', fontWeight: 600 }}>Amt:</span>
            <input 
              type="number" 
              value={betAmount} 
              onChange={(e) => setBetAmount(Number(e.target.value))}
              style={{ background: 'transparent', border: 'none', color: 'white', flex: 1, outline: 'none', fontSize: '0.85rem', textAlign: 'right', paddingRight: '0.4rem' }}
              min="1"
              autoComplete="off"
              autoCorrect="off"
              className="hide-arrows"
            />
            <span style={{ color: 'var(--muted)', fontSize: '0.75rem', fontWeight: 600 }}>FLR</span>
          </div>

          {/* Bet buttons (Side-by-side) */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={(e) => handleBetClick(e, 'yes')}
              style={{ flex: 1, padding: '0.6rem', borderRadius: '0.4rem', border: '1px solid var(--green)', background: 'transparent', color: 'var(--green)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              Buy Yes
            </button>
            <button 
              onClick={(e) => handleBetClick(e, 'no')}
              style={{ flex: 1, padding: '0.6rem', borderRadius: '0.4rem', border: '1px solid var(--pink)', background: 'transparent', color: 'var(--pink)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              Buy No
            </button>
          </div>
        </>
      )}

      {/* Footer: Resolution & Feedback */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--muted)', fontWeight: 500 }}>
          <FontAwesomeIcon icon={faHourglassHalf} style={{ marginRight: '0.3rem' }} />
          Resolves {new Date(market.endTime).toLocaleDateString()}
        </div>
        <a 
          href="https://forms.gle/W321ovNaBx4uzSgu6" 
          target="_blank" 
          rel="noreferrer" 
          onClick={e => e.stopPropagation()}
          style={{ fontSize: '0.7rem', color: 'var(--muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem', transition: 'color 0.2s' }}
          onMouseOver={e => e.currentTarget.style.color = 'var(--text)'}
          onMouseOut={e => e.currentTarget.style.color = 'var(--muted)'}
        >
          <FontAwesomeIcon icon={faCommentDots} /> Feedback
        </a>
      </div>
    </div>
  );
};
