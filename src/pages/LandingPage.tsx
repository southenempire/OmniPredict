import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight, faChartLine, faSun, faCloud, faBolt, faShield, faRobot, faPercent, faPlus, faDatabase, faStar
} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';

/* ── Live market preview cards ─────────────────────────── */
const MARKETS = [
  { id: 'm1', title: 'Will BTC exceed $100K before Aug 15?', type: 'crypto', yes: 65 },
  { id: 'm3', title: 'NYC temp above 100°F in August?',      type: 'weather', yes: 71 },
  { id: 'm2', title: 'Will ETH flip BTC market cap in 2025?',type: 'crypto', yes: 12 },
];

/* ── Animated particle canvas ──────────────────────────── */
function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    let raf: number;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const COLS = ['#00d4ff', '#7b2fff', '#f72585', '#00ff87'];
    const pts = Array.from({ length: 70 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      col: COLS[Math.floor(Math.random() * COLS.length)],
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // lines between close particles
        pts.forEach(q => {
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255,255,255,${0.06 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        });

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.col + 'cc';
        ctx.shadowColor = p.col;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{
        position: 'fixed', inset: 0, zIndex: 0,
        pointerEvents: 'none', opacity: 0.7
      }}
    />
  );
}

/* ── Scrolling ticker ──────────────────────────────────── */
const TICKER_ITEMS = [
  { label: 'BTC > $100K?', yes: 65, type: 'crypto' },
  { label: 'NYC Temp > 95°F?', yes: 71, type: 'weather' },
  { label: 'ETH flips BTC?', yes: 12, type: 'crypto' },
  { label: 'Rain in London Aug?', yes: 88, type: 'weather' },
  { label: 'FLR > $0.10?', yes: 54, type: 'crypto' },
  { label: 'XRP > $3 by Sep?', yes: 43, type: 'crypto' },
  { label: 'LA Heat > 110°F?', yes: 22, type: 'weather' },
];
const TICKER_DOUBLE = [...TICKER_ITEMS, ...TICKER_ITEMS];

function Ticker() {
  return (
    <div className="ticker-strip">
      <div className="ticker-track">
        {TICKER_DOUBLE.map((t, i) => (
          <div className="ticker-item" key={i}>
            <span className={`ticker-dot ticker-dot--${t.type}`} />
            <span style={{ color: '#f0f0ff', fontWeight: 600 }}>{t.label}</span>
            <span className="yes">YES {t.yes}%</span>
            <span className="no">NO {100 - t.yes}%</span>
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Mock Phone Frame ────────────────────────── */
function MockPhone() {
  return (
    <div className="phone-mockup" style={{
      width: '320px',
      height: '620px',
      border: '12px solid #1e293b',
      borderRadius: '40px',
      overflow: 'hidden',
      position: 'relative',
      background: 'var(--bg)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.1)',
      margin: '0 auto',
      transform: 'rotate(-2deg)',
      transition: 'transform 0.4s ease'
    }}
    onMouseOver={e => e.currentTarget.style.transform = 'rotate(0deg) scale(1.02)'}
    onMouseOut={e => e.currentTarget.style.transform = 'rotate(-2deg) scale(1)'}
    >
      {/* Notch */}
      <div style={{
        position: 'absolute',
        top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '120px', height: '24px',
        background: '#1e293b',
        borderBottomLeftRadius: '16px',
        borderBottomRightRadius: '16px',
        zIndex: 10
      }} />

      {/* Mini App UI */}
      <div style={{ padding: '2.5rem 1rem 1rem', height: '100%', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
           <img src="/logo.jpg" alt="Logo" style={{ width: 24, height: 24, borderRadius: 4 }} />
           <div style={{ background: 'var(--flare)', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem', color: '#fff', fontWeight: 'bold' }}>Connect</div>
        </div>
        
        {/* Mock market cards inside the phone */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { t: 'Will BTC exceed $100K before Aug 15?', y: 65, c: 'Crypto' },
            { t: 'Will Candidate X win in 2026?', y: 35, c: 'Politics' },
            { t: 'NYC Temp > 95°F in August?', y: 71, c: 'Weather' }
          ].map((m, i) => (
             <div key={i} style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--cyan)', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase' }}>{m.c}</div>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem', lineHeight: 1.3 }}>{m.t}</h4>
                <div style={{ display: 'flex', height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                   <div style={{ width: `${m.y}%`, background: 'var(--green)' }} />
                   <div style={{ width: `${100-m.y}%`, background: 'var(--pink)' }} />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div style={{ flex: 1, border: '1px solid var(--green)', color: 'var(--green)', fontSize: '0.7rem', padding: '0.4rem', textAlign: 'center', borderRadius: '4px', fontWeight: 'bold' }}>Buy Yes</div>
                  <div style={{ flex: 1, border: '1px solid var(--pink)', color: 'var(--pink)', fontSize: '0.7rem', padding: '0.4rem', textAlign: 'center', borderRadius: '4px', fontWeight: 'bold' }}>Buy No</div>
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Stats counter ─────────────────────────────────────── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(to / 60);
    const id = setInterval(() => {
      start = Math.min(start + step, to);
      setVal(start);
      if (start >= to) clearInterval(id);
    }, 20);
    return () => clearInterval(id);
  }, [to]);
  return <>{val.toLocaleString()}{suffix}</>;
}

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { root: document.querySelector('.lp-content'), threshold: 0.1 }
    );

    document.querySelectorAll('.reveal-element').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
}

/* ── Main page ─────────────────────────────────────────── */
export const LandingPage = () => {
  const navigate = useNavigate();
  useScrollReveal();
  
  return (
    <div className="lp-root">
      <ParticleCanvas />
      <Ticker />

      <div className="lp-content">

        {/* ── SNAP 1: Hero ── */}
        <div className="lp-snap-section">
          <section className="lp-hero">
            <div className="lp-hero__left">
              <h1 className="lp-hero__title">
                Predict anything.<br />
                <span className="line2">Win trustlessly.</span>
              </h1>
              <p className="lp-hero__sub">
                The first omni-chain prediction market on Flare Network — crypto prices
                resolved by FTSO, real-world events by FDC. No oracles to trust, no
                judges to bribe.
              </p>
              <div className="lp-hero__cta">
                <button className="lp-btn lp-btn--primary" onClick={() => navigate('/app')}>
                  Open App <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
              <div className="lp-stats-row">
                {[
                  { to: 4200000, prefix: '$', suffix: '+', label: 'Total Volume' },
                  { to: 127, prefix: '', suffix: '', label: 'Active Markets' },
                  { to: 998, prefix: '', suffix: '%', label: 'Resolution Acc.' },
                ].map(s => (
                  <div className="stat-pill" key={s.label}>
                    <span className="stat-pill__val">
                      {s.prefix}<Counter to={s.to} suffix={s.suffix} />
                    </span>
                    <span className="stat-pill__lbl">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lp-hero__right">
              <MockPhone />
            </div>

            <div className="weather-widget">
              <div className="weather-text">
                Real-world<br/>
                <span>Weather Markets</span>
              </div>
              <div className="weather-icon-container">
                <FontAwesomeIcon icon={faSun} className="w-sun" />
                <FontAwesomeIcon icon={faCloud} className="w-cloud" />
                <FontAwesomeIcon icon={faBolt} className="w-bolt" />
              </div>
            </div>
          </section>
        </div>

        {/* ── SNAP 2: Markets ── */}
        <div id="markets" className="lp-snap-section" style={{ position: 'relative' }}>
          <div className="ambient-orb ambient-orb--1" />
          <div className="ambient-orb ambient-orb--2" />
          <section className="lp-section reveal-element" style={{ width: '100%', padding: '2rem 3rem' }}>
            <div className="lp-section__eyebrow">
              <span className="live-dot" style={{ display: 'inline-block', width: 8, height: 8, background: 'var(--green)', borderRadius: '50%', marginRight: 8, boxShadow: '0 0 8px var(--green)', animation: 'pulse-dot 1.5s infinite' }} />
              Live Markets
            </div>
            <h2 className="lp-section__title">What are people predicting?</h2>
            <div className="preview-grid">
              {MARKETS.map((m, index) => {
                const source = m.type === 'crypto' ? 'FTSO' : 'FDC';
                return (
                  <div
                    key={m.id}
                    className="market-card"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <div className={`market-category ${m.type}`}>
                      <FontAwesomeIcon icon={m.type === 'crypto' ? faChartLine : faSun} />
                      {m.type === 'crypto' ? 'Crypto Market' : 'Weather Market'}
                    </div>
                    <h3 className="market-title">{m.title}</h3>
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.78rem', fontWeight: 700, marginBottom: '.4rem' }}>
                        <span style={{ color: '#00ff87' }}>YES {m.yes}%</span>
                        <span style={{ color: '#f72585' }}>NO {100 - m.yes}%</span>
                      </div>
                      <div style={{ height: '6px', background: 'var(--border)', borderRadius: '9999px', overflow: 'hidden', display: 'flex' }}>
                        <div style={{ width: `${m.yes}%`, background: 'var(--green)' }} />
                        <div style={{ width: `${100 - m.yes}%`, background: 'var(--pink)' }} />
                      </div>
                    </div>
                    <div className="bet-buttons">
                      <div className="btn-yes" style={{ pointerEvents: 'none' }}>
                        <span>Yes</span><span className="odds">{m.yes}%</span>
                      </div>
                      <div className="btn-no" style={{ pointerEvents: 'none' }}>
                        <span>No</span><span className="odds">{100 - m.yes}%</span>
                      </div>
                    </div>
                    <div className="flare-badge">
                      <FontAwesomeIcon icon={faBolt} /> Secured by {source}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* ── SNAP 3: Pricing + CTA ── */}
        <div id="pricing" className="lp-snap-section" style={{ position: 'relative' }}>
          <div className="ambient-orb ambient-orb--3" />
          <div className="ambient-orb ambient-orb--2" style={{ background: 'var(--cyan)' }} />
          <div className="lp-pricing-screen reveal-element">
            <div className="lp-section__eyebrow">Transparent Pricing</div>
            <h2 className="lp-section__title" style={{ marginBottom: '0.4rem' }}>No hidden fees. Ever.</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 1.25rem', fontSize: '0.85rem' }}>
              Every fee is baked into the smart contract and visible on-chain.
            </p>
            <div className="pricing-grid">
              <div className="pricing-card">
                <div className="pricing-card__icon" style={{ background: 'rgba(0,255,135,0.1)', color: 'var(--green)' }}><FontAwesomeIcon icon={faShield} /></div>
                <h3 className="pricing-card__name">Trader</h3>
                <div className="pricing-card__price">Free</div>
                <p className="pricing-card__sub">to get started</p>
                <ul className="pricing-card__features">
                  <li><FontAwesomeIcon icon={faPercent} /><span><strong>2% protocol fee</strong> on winnings</span></li>
                  <li><FontAwesomeIcon icon={faShield} /><span>Fully anonymous by default</span></li>
                  <li><FontAwesomeIcon icon={faChartLine} /><span>All FTSO crypto markets</span></li>
                  <li><FontAwesomeIcon icon={faSun} /><span>All FDC weather markets</span></li>
                  <li><FontAwesomeIcon icon={faDatabase} /><span>Private trade history</span></li>
                </ul>
              </div>
              <div className="pricing-card pricing-card--featured">
                <div className="pricing-card__badge">Most Popular</div>
                <div className="pricing-card__icon" style={{ background: 'rgba(0,212,255,0.1)', color: 'var(--cyan)' }}><FontAwesomeIcon icon={faRobot} /></div>
                <h3 className="pricing-card__name">OmniAI Terminal</h3>
                <div className="pricing-card__price">50 <span className="pricing-unit">FLR</span></div>
                <p className="pricing-card__sub">per 24 hours</p>
                <ul className="pricing-card__features">
                  <li><FontAwesomeIcon icon={faRobot} /><span><strong>AI market scanner</strong> access</span></li>
                  <li><FontAwesomeIcon icon={faBolt} /><span>Real-time arbitrage detection</span></li>
                  <li><FontAwesomeIcon icon={faChartLine} /><span>Sentiment analysis on FTSO</span></li>
                  <li><FontAwesomeIcon icon={faSun} /><span>Weather pattern modeling</span></li>
                  <li><FontAwesomeIcon icon={faStar} /><span>Priority support</span></li>
                </ul>
              </div>
              <div className="pricing-card">
                <div className="pricing-card__icon" style={{ background: 'rgba(123,47,255,0.1)', color: 'var(--purple)' }}><FontAwesomeIcon icon={faPlus} /></div>
                <h3 className="pricing-card__name">Market Creator</h3>
                <div className="pricing-card__price">10 <span className="pricing-unit">FLR</span></div>
                <p className="pricing-card__sub">per market listed</p>
                <ul className="pricing-card__features">
                  <li><FontAwesomeIcon icon={faPlus} /><span><strong>Create custom markets</strong></span></li>
                  <li><FontAwesomeIcon icon={faDatabase} /><span>Earn LP yield from your market</span></li>
                  <li><FontAwesomeIcon icon={faBolt} /><span>Resolved trustlessly on-chain</span></li>
                  <li><FontAwesomeIcon icon={faShield} /><span>Backed by FTSO or FDC</span></li>
                  <li><FontAwesomeIcon icon={faStar} /><span>Featured listing option</span></li>
                </ul>
              </div>
            </div>
            <div className="fee-note" style={{ marginBottom: '1.5rem' }}>
              <FontAwesomeIcon icon={faShield} />
              All fees are collected automatically by the smart contract. No middlemen. No surprises.
            </div>
            {/* CTA lives inside the pricing screen */}
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                Ready to predict the <span style={{ background: 'linear-gradient(90deg, var(--cyan), var(--green))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>future?</span>
              </h3>
              <p style={{ color: 'var(--muted)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                Join thousands of traders on the most trustless prediction protocol on Flare.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="lp-btn lp-btn--primary" style={{ fontSize: '0.95rem', padding: '0.75rem 1.75rem' }} onClick={() => navigate('/app')}>
                  Start Predicting <FontAwesomeIcon icon={faArrowRight} />
                </button>
                <a className="lp-btn lp-btn--ghost" href="https://t.me/+Y8gmhWODdQJkYjRk" target="_blank" rel="noreferrer" style={{ fontSize: '0.95rem', padding: '0.75rem 1.75rem' }}>
                  Join Community
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="lp-footer">
          <div className="lp-logo">
            <img src="/logo.jpg" alt="OmniPredict" style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover' }} />
            OmniPredict
          </div>
          <span>Built on Flare Network · FTSO + FDC · @omnipredict/sdk</span>
          <a href="https://t.me/+Y8gmhWODdQJkYjRk" target="_blank" rel="noreferrer" style={{ color: '#00d4ff' }}>
            Join Community →
          </a>
        </footer>

      </div>
    </div>
  );
};
