import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faChartLine, faSun, faArrowLeft, faWallet, faUser, faTerminal, faCircle, faCommentDots, faLandmark, faPlusCircle, faHistory, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { useFlareContracts, type MarketType } from '../hooks/useFlareContracts';
import { MarketCard } from '../components/MarketCard';
import { TerminalAccessCard } from '../components/TerminalAccessCard';
import { AITerminal } from '../components/AITerminal';
import { MarketCreationForm } from '../components/MarketCreationForm';
import { usePrivy } from '@privy-io/react-auth';
import { FTSOPriceTicker } from '../components/FTSOPriceTicker';
import { Leaderboard } from './Leaderboard';

const FILTERS: { key: MarketType | 'all' | 'past' | 'trades' | 'create' | 'profile' | 'terminal' | 'leaderboard'; label: string; icon: any }[] = [
  { key: 'all',      label: 'All Markets',    icon: faGlobe },
  { key: 'crypto',   label: 'Crypto (FTSO)',  icon: faChartLine },
  { key: 'weather',  label: 'Weather (FDC)',  icon: faSun },
  { key: 'politics', label: 'Politics',       icon: faLandmark },
  { key: 'past',     label: 'Past Markets',   icon: faHistory },
  { key: 'leaderboard', label: 'Leaderboard', icon: faTrophy },
  { key: 'trades',   label: 'My Trades',      icon: faWallet },
  { key: 'create',   label: 'Create Market',  icon: faPlusCircle },
  { key: 'profile',  label: 'Profile',        icon: faUser },
  { key: 'terminal', label: 'OmniAI Scanner', icon: faTerminal },
];

import { WalkthroughModal } from '../components/WalkthroughModal';

export const Dashboard = () => {
  const { markets, trades, userProfile, placeBet, cashOut, createMarket, updateProfile, hasTerminalAccess, purchaseTerminalAccess } = useFlareContracts();
  const { ready, authenticated, user, login, logout } = usePrivy();
  const isWalletConnected = authenticated;
  const [activeFilter, setActiveFilter] = useState<MarketType | 'all' | 'past' | 'trades' | 'create' | 'profile' | 'terminal' | 'leaderboard'>('all');
  const [cashingOutId, setCashingOutId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCashOut = async (tradeId: string) => {
    setCashingOutId(tradeId);
    await cashOut(tradeId);
    setCashingOutId(null);
  };

  const now = new Date();
  const filteredMarkets = markets
    .filter(m => {
      const isExpired = new Date(m.endTime) < now;
      if (activeFilter === 'past') return isExpired;
      return activeFilter === 'all' || m.type === activeFilter;
    })
    .sort((a, b) => {
      const aExpired = new Date(a.endTime) < now;
      const bExpired = new Date(b.endTime) < now;
      if (aExpired && !bExpired) return 1;
      if (!aExpired && bExpired) return -1;
      return 0;
    });

  return (
    <div className="app-container">
      <WalkthroughModal />

      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside className="sidebar">

        {/* Logo */}
        <Link to="/" className="sidebar-logo" style={{ textDecoration: 'none', marginBottom: '0.5rem' }}>
          <img
            src="/logo.jpg"
            alt="OmniPredict"
            style={{ width: 34, height: 34, borderRadius: 9, objectFit: 'cover', flexShrink: 0 }}
          />
          OmniPredict
        </Link>

        {/* Back to landing */}
        <Link
          to="/"
          style={{
            display: 'flex', alignItems: 'center', gap: '.5rem',
            fontSize: '.8rem', color: 'var(--muted)',
            textDecoration: 'none', marginBottom: '.5rem',
            transition: 'color .2s',
          }}
          onMouseOver={e => (e.currentTarget.style.color = 'var(--text)')}
          onMouseOut={e => (e.currentTarget.style.color = 'var(--muted)')}
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Back to home
        </Link>

        <div style={{ height: '1px', background: 'var(--border)', margin: '.5rem 0 1rem' }} />

        {/* Nav filters */}
        <nav className="sidebar-nav">
          {FILTERS.map(f => (
            <a
              key={f.key}
              className={`nav-item ${activeFilter === f.key ? 'active' : ''}`}
              onClick={() => setActiveFilter(f.key)}
            >
              <FontAwesomeIcon icon={f.icon} />
              {f.label}
            </a>
          ))}
          <a
            className="nav-item"
            href="https://forms.gle/W321ovNaBx4uzSgu6"
            target="_blank"
            rel="noreferrer"
          >
            <FontAwesomeIcon icon={faCommentDots} />
            Feedback
          </a>
        </nav>

        {/* Sidebar promo box */}
        <div style={{
          marginTop: 'auto',
          background: 'linear-gradient(135deg, rgba(231,0,82,.15), rgba(123,47,255,.15))',
          border: '1px solid rgba(231,0,82,.25)',
          borderRadius: '1rem',
          padding: '1.25rem',
        }}>
          <div style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--flare)', marginBottom: '.4rem', textTransform: 'uppercase', letterSpacing: '.06em' }}>
            Flare Network
          </div>
          <div style={{ fontSize: '.8rem', color: 'var(--muted)', lineHeight: 1.55, marginBottom: '.85rem' }}>
            All markets resolve trustlessly via FTSO &amp; FDC on-chain.
          </div>
          <a
            href="https://dev.flare.network"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'block', textAlign: 'center',
              background: 'var(--flare)', color: '#fff',
              borderRadius: '.65rem', padding: '.5rem',
              fontSize: '.78rem', fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Read Flare Docs →
          </a>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────── */}
      <main className="main-content">
        <FTSOPriceTicker />

        <header className="header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '.3rem' }}>
              <span style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '.1em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FontAwesomeIcon icon={activeFilter === 'trades' ? faWallet : activeFilter === 'create' ? faPlusCircle : activeFilter === 'profile' ? faUser : activeFilter === 'terminal' ? faTerminal : activeFilter === 'leaderboard' ? faTrophy : faCircle} style={{ fontSize: '0.6rem' }} />
                {activeFilter === 'trades' ? 'Portfolio' : activeFilter === 'create' ? 'Creator' : activeFilter === 'profile' ? 'Settings' : activeFilter === 'terminal' ? 'AI Access' : activeFilter === 'leaderboard' ? 'Rankings' : 'Live'}
              </span>
              {activeFilter !== 'trades' && activeFilter !== 'create' && activeFilter !== 'profile' && activeFilter !== 'terminal' && activeFilter !== 'leaderboard' && (
                <span style={{ fontSize: '.75rem', color: 'var(--muted)' }}>
                  {filteredMarkets.length} market{filteredMarkets.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <h1>
              {activeFilter === 'trades' ? 'My Trades' : activeFilter === 'create' ? 'Launch Market' : activeFilter === 'profile' ? 'Profile Settings' : activeFilter === 'terminal' ? 'OmniAI Terminal' : activeFilter === 'leaderboard' ? 'Leaderboard' : 'Explore Markets'}
            </h1>
          </div>
          <button className="wallet-btn" onClick={authenticated ? logout : login} disabled={!ready}>
            {authenticated ? `${user?.wallet?.address?.slice(0, 6)}...` : 'Login / Connect'}
          </button>
        </header>

        {activeFilter === 'trades' ? (
          <div className="trades-view">
            {!isWalletConnected ? (
              <div style={{ color: 'var(--muted)', padding: '3rem 0' }}>Please connect your wallet to view your trades.</div>
            ) : trades.length === 0 ? (
              <div style={{ color: 'var(--muted)', padding: '3rem 0' }}>You haven't placed any predictions yet.</div>
            ) : (
              <div className="trades-list">
                {trades.map(trade => {
                  const market = markets.find(m => m.id === trade.marketId);
                  return (
                    <div key={trade.id} className="trade-card">
                      <div className="trade-card__header">
                        <div style={{ fontSize: '.75rem', color: 'var(--muted)' }}>{new Date(trade.timestamp).toLocaleString()}</div>
                        <div style={{ fontSize: '.8rem', fontWeight: 700, color: trade.prediction === 'yes' ? 'var(--green)' : 'var(--pink)' }}>
                          Voted {trade.prediction.toUpperCase()}
                        </div>
                      </div>
                      <h3 className="trade-card__title">{market?.title || 'Unknown Market'}</h3>
                      <div className="trade-card__footer">
                        <div>Staked: <strong>{trade.amount} FLR</strong></div>
                        <button 
                          className="lp-btn lp-btn--outline" 
                          style={{ padding: '.4rem 1rem', fontSize: '.8rem' }} 
                          onClick={() => handleCashOut(trade.id)}
                          disabled={cashingOutId === trade.id}
                        >
                          {cashingOutId === trade.id ? 'Claiming...' : 'Cash Out'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : activeFilter === 'leaderboard' ? (
          <Leaderboard />
        ) : activeFilter === 'create' ? (
          <MarketCreationForm createMarket={createMarket} />
        ) : activeFilter === 'profile' ? (
          <div className="profile-view">
            <div className="profile-card premium-card">
              <div className="profile-header">
                <div className="profile-avatar">
                  <FontAwesomeIcon icon={faUser} />
                </div>
                <div className="profile-info">
                  <h3>Anonymous Profile</h3>
                  <div className="wallet-badge">
                    <span className="dot"></span> {isWalletConnected ? '0x71C...A1b2' : 'Not Connected'}
                  </div>
                </div>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '.95rem', marginBottom: '2rem', lineHeight: 1.6 }}>
                Set a custom username to display on the leaderboards instead of your raw wallet address. This helps maintain your privacy while trading on OmniPredict.
              </p>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const username = formData.get('username') as string;
                if (username) updateProfile({ username });
              }}>
                <label style={{ display: 'block', fontSize: '.85rem', color: 'var(--muted)', marginBottom: '.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>
                  Display Name
                </label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
                  <input
                    name="username"
                    defaultValue={userProfile.username || ''}
                    placeholder="e.g. Satoshi123"
                    className="profile-input"
                    maxLength={20}
                  />
                  <button type="submit" className="lp-btn lp-btn--primary" style={{ padding: '.8rem 2rem' }}>Save Changes</button>
                </div>

                <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Privacy Settings</h4>
                
                <div className="privacy-toggle-group">
                  <div className="privacy-item">
                    <div>
                      <div className="privacy-title">Public Profile</div>
                      <div className="privacy-desc">Allow others to view your profile page.</div>
                    </div>
                    <label className="switch">
                      <input type="checkbox" checked={userProfile.isProfilePublic} onChange={(e) => updateProfile({ isProfilePublic: e.target.checked })} />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  <div className="privacy-item">
                    <div>
                      <div className="privacy-title">Share Trade History</div>
                      <div className="privacy-desc">Display your past predictions on your public profile.</div>
                    </div>
                    <label className="switch">
                      <input type="checkbox" checked={userProfile.shareTradeHistory} onChange={(e) => updateProfile({ shareTradeHistory: e.target.checked })} />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  <div className="privacy-item">
                    <div>
                      <div className="privacy-title">Show Wallet Address</div>
                      <div className="privacy-desc">Link your real Flare wallet address to your username.</div>
                    </div>
                    <label className="switch">
                      <input type="checkbox" checked={userProfile.shareWalletAddress} onChange={(e) => updateProfile({ shareWalletAddress: e.target.checked })} />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : activeFilter === 'terminal' ? (
          hasTerminalAccess ? (
            <AITerminal />
          ) : (
            <TerminalAccessCard 
              hasAccess={hasTerminalAccess} 
              onPurchase={() => purchaseTerminalAccess(50)} 
            />
          )
        ) : (
          <div className="markets-grid">
            {filteredMarkets.map(market => (
              <MarketCard
                key={market.id}
                market={market}
                onBet={placeBet}
                onClick={() => navigate(`/market/${market.id}`)}
              />
            ))}
            {filteredMarkets.length === 0 && (
              <div style={{ color: 'var(--muted)', padding: '3rem 0' }}>No markets in this category yet.</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
