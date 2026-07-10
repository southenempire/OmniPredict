import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

interface MarketCreationFormProps {
  createMarket: (title: string, symbol: string, targetPrice: number, isAbove: boolean, endDateStr: string) => Promise<void>;
}

export const MarketCreationForm: React.FC<MarketCreationFormProps> = ({ createMarket }) => {
  const [title, setTitle] = useState('');
  const [symbol, setSymbol] = useState('');
  const [targetPrice, setTargetPrice] = useState(0);
  const [isAbove, setIsAbove] = useState(true);
  const [endDateStr, setEndDateStr] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !symbol || !endDateStr || targetPrice <= 0) return;
    
    setIsSubmitting(true);
    await createMarket(title, symbol, targetPrice, isAbove, endDateStr);
    setIsSubmitting(false);
    
    // Clear form
    setTitle('');
    setSymbol('');
    setTargetPrice(0);
    setEndDateStr('');
  };

  return (
    <div className="profile-view" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div className="profile-card premium-card" style={{ padding: '2rem' }}>
        <div className="profile-header" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <div className="profile-avatar" style={{ background: 'var(--cyan)' }}>
            <FontAwesomeIcon icon={faPlusCircle} style={{ color: '#fff' }} />
          </div>
          <div className="profile-info">
            <h3>Create Custom Market</h3>
            <div className="wallet-badge" style={{ color: 'var(--cyan)', background: 'rgba(59, 130, 246, 0.1)' }}>
              10 FLR Listing Fee
            </div>
          </div>
        </div>
        
        <p style={{ color: 'var(--muted)', fontSize: '.95rem', marginBottom: '2rem', lineHeight: 1.6 }}>
          Propose a new market to the OmniPredict network. Once deployed, anyone can provide liquidity and trade on your market's outcome. The 10 FLR fee prevents spam.
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '.85rem', color: 'var(--muted)', marginBottom: '.5rem', fontWeight: 600, textTransform: 'uppercase' }}>Market Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Will BTC hit $100k?"
              className="profile-input"
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '.85rem', color: 'var(--muted)', marginBottom: '.5rem', fontWeight: 600, textTransform: 'uppercase' }}>Asset Symbol</label>
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="e.g. BTC"
                className="profile-input"
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '.85rem', color: 'var(--muted)', marginBottom: '.5rem', fontWeight: 600, textTransform: 'uppercase' }}>Target Price</label>
              <input
                type="number"
                step="0.01"
                value={targetPrice}
                onChange={(e) => setTargetPrice(Number(e.target.value))}
                placeholder="e.g. 100000"
                className="profile-input"
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '.85rem', color: 'var(--muted)', marginBottom: '.5rem', fontWeight: 600, textTransform: 'uppercase' }}>Condition</label>
              <select 
                value={isAbove ? 'above' : 'below'} 
                onChange={(e) => setIsAbove(e.target.value === 'above')}
                className="profile-input"
                style={{ appearance: 'auto' }}
              >
                <option value="above">Above Target</option>
                <option value="below">Below Target</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '.85rem', color: 'var(--muted)', marginBottom: '.5rem', fontWeight: 600, textTransform: 'uppercase' }}>Resolution Date</label>
              <input
                type="datetime-local"
                value={endDateStr}
                onChange={(e) => setEndDateStr(e.target.value)}
                className="profile-input"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="lp-btn lp-btn--primary" 
            style={{ padding: '1rem', marginTop: '1rem', width: '100%', fontSize: '1rem', fontWeight: 700 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Deploying Market...' : 'Pay 10 FLR & Create Market'}
          </button>
        </form>
      </div>
    </div>
  );
};
